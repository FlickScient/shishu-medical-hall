-- Atomic sale posting and purchase receiving.
-- All stock and financial writes happen in a single PostgreSQL transaction.

create or replace function public.record_store_sale(p_items jsonb, p_note text default null)
returns jsonb
language plpgsql
security definer
set search_path = public
set row_security = off
as $$
declare
  v_line jsonb;
  v_batch public.stock_batches%rowtype;
  v_sale_id uuid;
  v_qty integer;
  v_price numeric(12,2);
  v_cost numeric(12,2);
  v_revenue numeric(12,2) := 0;
  v_total_cost numeric(12,2) := 0;
  v_name text;
  v_user text := (select auth.user_id())::text;
begin
  if not public.can_manage_finances() then
    raise exception 'Only the owner or co-owner can record sales';
  end if;
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Add at least one medicine to the sale';
  end if;

  insert into public.sales(total_amount,total_cost,note,created_by)
  values (0,0,nullif(trim(p_note),''),v_user)
  returning id into v_sale_id;

  for v_line in select value from jsonb_array_elements(p_items)
  loop
    v_qty := (v_line->>'quantity')::integer;
    v_price := (v_line->>'unit_price')::numeric;
    if v_qty <= 0 or v_price < 0 then
      raise exception 'Sale quantity must be positive and unit price cannot be negative';
    end if;

    select * into v_batch
    from public.stock_batches
    where id = (v_line->>'batch_id')::uuid
    for update;

    if v_batch.id is null then raise exception 'A selected stock batch no longer exists'; end if;
    if v_batch.quantity < v_qty then
      raise exception 'Insufficient stock for batch %. Available: %, requested: %', v_batch.batch_number, v_batch.quantity, v_qty;
    end if;

    select coalesce(c.purchase_unit_cost, v_batch.purchase_unit_cost, 0)
      into v_cost
    from (select 1) x
    left join public.stock_batch_costs c on c.batch_id = v_batch.id;

    select brand_name || case when strength is null then '' else ' ' || strength end
      into v_name from public.medicines where id = v_batch.medicine_id;

    update public.stock_batches set quantity = quantity - v_qty where id = v_batch.id;
    insert into public.sale_items(sale_id,medicine_id,batch_id,item_name,quantity,unit_price,unit_cost)
    values (v_sale_id,v_batch.medicine_id,v_batch.id,coalesce(v_name,'Medicine'),v_qty,v_price,v_cost);

    v_revenue := v_revenue + (v_qty * v_price);
    v_total_cost := v_total_cost + (v_qty * v_cost);
  end loop;

  update public.sales set total_amount = v_revenue, total_cost = v_total_cost where id = v_sale_id;
  return jsonb_build_object('sale_id',v_sale_id,'total_amount',v_revenue,'total_cost',v_total_cost,'gross_profit',v_revenue-v_total_cost);
end;
$$;

create or replace function public.receive_purchase_order(p_order_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
set row_security = off
as $$
declare
  v_order public.purchase_orders%rowtype;
  v_line public.purchase_order_items%rowtype;
  v_remaining integer;
  v_batch_id uuid;
  v_received integer := 0;
  v_user text := (select auth.user_id())::text;
begin
  if not public.can_manage_finances() then
    raise exception 'Only the owner or co-owner can receive purchase orders';
  end if;

  select * into v_order
  from public.purchase_orders
  where id = p_order_id
  for update;

  if v_order.id is null then raise exception 'Purchase order not found'; end if;
  if v_order.status not in ('sent','partially_received') then
    raise exception 'Only sent or partially received orders can be received';
  end if;

  for v_line in
    select * from public.purchase_order_items
    where purchase_order_id = p_order_id
    order by id
    for update
  loop
    v_remaining := v_line.quantity - v_line.received_quantity;
    if v_remaining < 0 then raise exception 'Received quantity exceeds ordered quantity'; end if;
    if v_remaining = 0 then continue; end if;
    if v_line.medicine_id is null then raise exception 'Purchase line % has no medicine linked', v_line.item_name; end if;

    insert into public.stock_batches(medicine_id,supplier_id,quantity)
    values (v_line.medicine_id,v_order.supplier_id,v_remaining)
    returning id into v_batch_id;

    insert into public.stock_batch_costs(batch_id,purchase_unit_cost)
    values (v_batch_id,v_line.unit_cost);

    update public.purchase_order_items
    set received_quantity = quantity
    where id = v_line.id;

    v_received := v_received + v_remaining;
  end loop;

  update public.purchase_orders
  set status = 'received', received_at = now()
  where id = p_order_id;

  return jsonb_build_object('order_id',p_order_id,'received_units',v_received,'status','received','received_by',v_user);
end;
$$;

revoke all on function public.record_store_sale(jsonb,text) from public, anonymous;
revoke all on function public.receive_purchase_order(uuid) from public, anonymous;
grant execute on function public.record_store_sale(jsonb,text) to authenticated;
grant execute on function public.receive_purchase_order(uuid) to authenticated;
