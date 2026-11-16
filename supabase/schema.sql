-- Shishu Medical Hall: initial multi-user pharmacy schema
create extension if not exists pgcrypto;

create table if not exists public.store_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text,
  role text not null check (role in ('owner','co_owner','editor')),
  invited_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  unique(user_id)
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
  purchase_unit_cost numeric(12,2) not null default 0,
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
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.sales (
  id uuid primary key default gen_random_uuid(),
  sold_at timestamptz not null default now(),
  total_amount numeric(12,2) not null default 0,
  total_cost numeric(12,2) not null default 0,
  note text,
  created_by uuid references auth.users(id),
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
  created_by uuid references auth.users(id)
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
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);

create or replace function public.current_store_role()
returns text language sql stable security definer set search_path = public
as $$
  select role from public.store_members where user_id = auth.uid() limit 1;
$$;

create or replace function public.can_manage_finances()
returns boolean language sql stable security definer set search_path = public
as $$
  select coalesce(public.current_store_role() in ('owner','co_owner'), false);
$$;

create or replace function public.is_store_member()
returns boolean language sql stable security definer set search_path = public
as $$
  select exists(select 1 from public.store_members where user_id = auth.uid());
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

-- Owners can manage membership. Members can read their own membership row.
create policy "members read own row" on public.store_members for select using (user_id = auth.uid() or public.current_store_role() = 'owner');
create policy "owner manages members" on public.store_members for all using (public.current_store_role() = 'owner') with check (public.current_store_role() = 'owner');

-- Editors can work with medicines, stock, suppliers and shortages.
create policy "members manage medicines" on public.medicines for all using (public.is_store_member()) with check (public.is_store_member());
create policy "members manage suppliers" on public.suppliers for all using (public.is_store_member()) with check (public.is_store_member());
create policy "members manage stock" on public.stock_batches for all using (public.is_store_member()) with check (public.is_store_member());
create policy "members manage shortages" on public.shortage_requests for all using (public.is_store_member()) with check (public.is_store_member());
create policy "members read homepage" on public.website_content for select using (public.is_store_member());
create policy "members edit homepage" on public.website_content for all using (public.is_store_member()) with check (public.is_store_member());

-- Financial records are inaccessible to editor role at the database layer.
create policy "owners read transactions" on public.transactions for select using (public.can_manage_finances());
create policy "owners insert transactions" on public.transactions for insert with check (public.can_manage_finances());
create policy "owners update transactions" on public.transactions for update using (public.can_manage_finances()) with check (public.can_manage_finances());
create policy "owners delete transactions" on public.transactions for delete using (public.can_manage_finances());
create policy "owners manage sales" on public.sales for all using (public.can_manage_finances()) with check (public.can_manage_finances());
create policy "owners manage sale items" on public.sale_items for all using (public.can_manage_finances()) with check (public.can_manage_finances());
create policy "owners manage ledgers" on public.ledger_accounts for all using (public.can_manage_finances()) with check (public.can_manage_finances());
create policy "owners manage ledger entries" on public.ledger_entries for all using (public.can_manage_finances()) with check (public.can_manage_finances());
