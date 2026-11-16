-- Shishu Medical Hall — Neon PostgreSQL schema.
-- Run after Neon Auth and the Neon Data API have been provisioned.
create extension if not exists pgcrypto;

create table if not exists public.store_members (
  id uuid primary key default gen_random_uuid(),
  user_id text not null unique,
  display_name text,
  role text not null check (role in ('owner','co_owner','editor')),
  invited_by text,
  created_at timestamptz not null default now()
);

create table if not exists public.medicines (
  id uuid primary key default gen_random_uuid(),
  brand_name text not null,
  generic_name text,
  strength text,
  dosage_form text,
  manufacturer text,
  therapeutic_group text,
  unit_price numeric(12,2),
  source_name text,
  source_url text,
  source_updated_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.suppliers (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_person text,
  mpo_name text,
  phone text,
  address text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.stock_batches (
  id uuid primary key default gen_random_uuid(),
  medicine_id uuid not null references public.medicines(id),
  supplier_id uuid references public.suppliers(id),
  batch_number text,
  quantity integer not null default 0 check (quantity >= 0),
  purchase_unit_cost numeric(12,2) not null default 0, -- legacy only; app roles have no column privileges
  selling_unit_price numeric(12,2),
  expiry_date date,
  received_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('income','expense')),
  amount numeric(12,2) not null check (amount > 0),
  description text,
  occurred_at timestamptz not null default now(),
  created_by text,
  created_at timestamptz not null default now()
);

create table if not exists public.sales (
  id uuid primary key default gen_random_uuid(),
  sold_at timestamptz not null default now(),
  total_amount numeric(12,2) not null default 0,
  total_cost numeric(12,2) not null default 0,
  note text,
  created_by text,
  created_at timestamptz not null default now()
);

create table if not exists public.sale_items (
  id uuid primary key default gen_random_uuid(),
  sale_id uuid not null references public.sales(id) on delete cascade,
  medicine_id uuid references public.medicines(id),
  batch_id uuid references public.stock_batches(id),
  item_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12,2) not null,
  unit_cost numeric(12,2) not null default 0
);

create table if not exists public.ledger_accounts (
  id uuid primary key default gen_random_uuid(),
  ledger_type text not null check (ledger_type in ('customer_due','supplier_debt')),
  party_name text not null,
  phone text,
  notes text,
  opening_balance numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.ledger_entries (
  id uuid primary key default gen_random_uuid(),
  ledger_id uuid not null references public.ledger_accounts(id) on delete cascade,
  entry_type text not null check (entry_type in ('charge','payment','adjustment')),
  amount numeric(12,2) not null check (amount > 0),
  description text,
  occurred_at timestamptz not null default now(),
  created_by text
);

create table if not exists public.shortage_requests (
  id uuid primary key default gen_random_uuid(),
  medicine_id uuid references public.medicines(id),
  medicine_label text not null,
  supplier_id uuid references public.suppliers(id),
  requested_quantity integer,
  status text not null default 'open' check (status in ('open','ordered','received','cancelled')),
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.website_content (
  id uuid primary key default gen_random_uuid(),
  content_key text not null unique,
  content jsonb not null default '{}'::jsonb,
  updated_by text,
  updated_at timestamptz not null default now()
);

create table if not exists public.purchase_orders (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid references public.suppliers(id),
  status text not null default 'draft' check (status in ('draft','sent','partially_received','received','cancelled')),
  order_total numeric(12,2) not null default 0,
  note text,
  ordered_at timestamptz not null default now(),
  received_at timestamptz,
  created_by text
);

create table if not exists public.purchase_order_items (
  id uuid primary key default gen_random_uuid(),
  purchase_order_id uuid not null references public.purchase_orders(id) on delete cascade,
  medicine_id uuid references public.medicines(id),
  item_name text not null,
  quantity integer not null check (quantity > 0),
  unit_cost numeric(12,2) not null default 0,
  received_quantity integer not null default 0 check (received_quantity >= 0)
);

create table if not exists public.company_contacts (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  person_name text,
  role_title text,
  phone text,
  territory text,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists medicines_brand_name_idx on public.medicines (brand_name);
create index if not exists medicines_generic_name_idx on public.medicines (generic_name);
create index if not exists stock_batches_expiry_idx on public.stock_batches (expiry_date);
create index if not exists transactions_occurred_at_idx on public.transactions (occurred_at desc);
create index if not exists sales_sold_at_idx on public.sales (sold_at desc);
create index if not exists ledger_entries_ledger_occurred_idx on public.ledger_entries (ledger_id, occurred_at desc);
create index if not exists shortage_requests_status_idx on public.shortage_requests (status, created_at desc);
create index if not exists purchase_orders_ordered_at_idx on public.purchase_orders (ordered_at desc);

create or replace function public.current_store_role()
returns text
language sql stable security definer
set search_path = public
set row_security = off
as $$
  select role from public.store_members
  where user_id = (select auth.user_id())::text
  limit 1;
$$;

create or replace function public.is_store_member()
returns boolean
language sql stable security definer
set search_path = public
set row_security = off
as $$
  select exists (
    select 1 from public.store_members
    where user_id = (select auth.user_id())::text
  );
$$;

create or replace function public.can_manage_finances()
returns boolean
language sql stable security definer
set search_path = public
set row_security = off
as $$
  select coalesce(public.current_store_role() in ('owner','co_owner'), false);
$$;

alter table public.store_members enable row level security;
alter table public.medicines enable row level security;
alter table public.suppliers enable row level security;
alter table public.stock_batches enable row level security;
alter table public.transactions enable row level security;
alter table public.sales enable row level security;
alter table public.sale_items enable row level security;
alter table public.ledger_accounts enable row level security;
alter table public.ledger_entries enable row level security;
alter table public.shortage_requests enable row level security;
alter table public.website_content enable row level security;
alter table public.purchase_orders enable row level security;
alter table public.purchase_order_items enable row level security;
alter table public.company_contacts enable row level security;

grant usage on schema public to anonymous, authenticated;
grant select on public.website_content to anonymous;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;
grant execute on function public.current_store_role() to authenticated;
grant execute on function public.is_store_member() to authenticated;
grant execute on function public.can_manage_finances() to authenticated;

create policy store_members_read_self on public.store_members
for select to authenticated
using (user_id = (select auth.user_id())::text or public.current_store_role() = 'owner');
create policy store_members_owner_manage on public.store_members
for all to authenticated
using (public.current_store_role() = 'owner')
with check (public.current_store_role() = 'owner');

create policy members_manage_medicines on public.medicines
for all to authenticated using (public.is_store_member()) with check (public.is_store_member());
create policy members_manage_suppliers on public.suppliers
for all to authenticated using (public.is_store_member()) with check (public.is_store_member());
create policy members_manage_stock on public.stock_batches
for all to authenticated using (public.is_store_member()) with check (public.is_store_member());
create policy members_manage_shortages on public.shortage_requests
for all to authenticated using (public.is_store_member()) with check (public.is_store_member());
create policy owners_manage_purchase_orders on public.purchase_orders
for all to authenticated using (public.can_manage_finances()) with check (public.can_manage_finances());
create policy owners_manage_purchase_items on public.purchase_order_items
for all to authenticated using (public.can_manage_finances()) with check (public.can_manage_finances());
create policy members_manage_contacts on public.company_contacts
for all to authenticated using (public.is_store_member()) with check (public.is_store_member());
create policy members_read_homepage on public.website_content
for select to authenticated using (public.is_store_member());
create policy members_edit_homepage on public.website_content
for all to authenticated using (public.is_store_member()) with check (public.is_store_member());
create policy public_read_homepage on public.website_content
for select to anonymous using (true);

create policy owners_manage_transactions on public.transactions
for all to authenticated using (public.can_manage_finances()) with check (public.can_manage_finances());
create policy owners_manage_sales on public.sales
for all to authenticated using (public.can_manage_finances()) with check (public.can_manage_finances());
create policy owners_manage_sale_items on public.sale_items
for all to authenticated using (public.can_manage_finances()) with check (public.can_manage_finances());
create policy owners_manage_ledgers on public.ledger_accounts
for all to authenticated using (public.can_manage_finances()) with check (public.can_manage_finances());
create policy owners_manage_ledger_entries on public.ledger_entries
for all to authenticated using (public.can_manage_finances()) with check (public.can_manage_finances());


-- Invitation links are single-use, expiring, and bound to the invited email.
create table if not exists public.store_invitations (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  role text not null check (role in ('co_owner','editor')),
  token_hash text not null unique,
  invited_by text,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '7 days'),
  accepted_at timestamptz
);
alter table public.store_invitations enable row level security;
grant select, insert, update, delete on public.store_invitations to authenticated;
create policy store_invitations_owner_manage on public.store_invitations
for all to authenticated using (public.current_store_role() = 'owner')
with check (public.current_store_role() = 'owner');

create or replace function public.create_store_invitation(p_email text, p_role text, p_token text)
returns uuid
language plpgsql security definer
set search_path = public
set row_security = off
as $$
declare v_id uuid;
begin
  if public.current_store_role() <> 'owner' then raise exception 'Only the owner can invite team members'; end if;
  if p_role not in ('co_owner','editor') then raise exception 'Invalid invitation role'; end if;
  if length(trim(p_email)) < 5 or length(p_token) < 32 then raise exception 'Invalid invitation details'; end if;
  insert into public.store_invitations(email, role, token_hash, invited_by)
  values (lower(trim(p_email)), p_role, encode(digest(p_token, 'sha256'), 'hex'), (select auth.user_id())::text)
  returning id into v_id;
  return v_id;
end;
$$;

create or replace function public.accept_store_invitation(p_token text)
returns jsonb
language plpgsql security definer
set search_path = public
set row_security = off
as $$
declare
  v_user_id text;
  v_email text;
  v_name text;
  v_invite public.store_invitations%rowtype;
begin
  select id::text, email, name into v_user_id, v_email, v_name
  from neon_auth."user"
  where id = (select auth.user_id())::uuid;
  if v_user_id is null then raise exception 'Please sign in before accepting this invitation'; end if;
  if exists (select 1 from public.store_members where user_id = v_user_id) then
    raise exception 'This account already has store access';
  end if;
  select * into v_invite
  from public.store_invitations
  where token_hash = encode(digest(p_token, 'sha256'), 'hex')
    and lower(email) = lower(v_email)
    and accepted_at is null
    and expires_at > now()
  for update;
  if v_invite.id is null then raise exception 'Invitation is invalid, expired, or belongs to another email'; end if;
  insert into public.store_members(user_id, display_name, role, invited_by)
  values (v_user_id, v_name, v_invite.role, v_invite.invited_by);
  update public.store_invitations set accepted_at = now() where id = v_invite.id;
  return jsonb_build_object('role', v_invite.role, 'email', v_invite.email);
end;
$$;

grant execute on function public.create_store_invitation(text,text,text) to authenticated;
grant execute on function public.accept_store_invitation(text) to authenticated;


-- One-time owner bootstrap token. The raw token is never stored in Postgres.
create table if not exists public.store_bootstrap_tokens (
  token_hash text primary key,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '7 days'),
  consumed_at timestamptz
);
alter table public.store_bootstrap_tokens enable row level security;

create or replace function public.bootstrap_store_owner(p_token text)
returns jsonb
language plpgsql security definer
set search_path = public
set row_security = off
as $$
declare
  v_user_id text;
  v_email text;
  v_name text;
  v_token_hash text;
begin
  select id::text, email, name into v_user_id, v_email, v_name
  from neon_auth."user"
  where id = (select auth.user_id())::uuid and "emailVerified" = true;
  if v_user_id is null then raise exception 'Sign in with a verified email before setting up the owner account'; end if;
  if exists (select 1 from public.store_members) then raise exception 'The initial owner has already been created'; end if;
  v_token_hash := encode(digest(p_token, 'sha256'), 'hex');
  perform 1 from public.store_bootstrap_tokens
    where token_hash = v_token_hash and consumed_at is null and expires_at > now()
    for update;
  if not found then raise exception 'Setup code is invalid, expired, or already used'; end if;
  insert into public.store_members(user_id, display_name, role)
  values (v_user_id, v_name, 'owner');
  update public.store_bootstrap_tokens set consumed_at = now() where token_hash = v_token_hash;
  return jsonb_build_object('role', 'owner', 'email', v_email);
end;
$$;
grant execute on function public.bootstrap_store_owner(text) to authenticated;


-- Atomic stock operations (kept in sync with neon/migrations/2026-11-17-atomic-sales-purchases.sql)
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
