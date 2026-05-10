-- Simple finance foundation: customers + debts.
-- Apply in backend/Supabase project, then expose matching REST endpoints:
-- GET/POST /customers, GET /customers/:id, GET/POST /debts

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  address text,
  note text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.debts (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete restrict,
  amount numeric(14, 2) not null check (amount >= 0),
  paid_amount numeric(14, 2) not null default 0 check (paid_amount >= 0),
  remaining_amount numeric(14, 2) generated always as (greatest(amount - paid_amount, 0)) stored,
  status text generated always as (
    case
      when paid_amount >= amount then 'PAID'
      when paid_amount > 0 then 'PARTIAL'
      else 'UNPAID'
    end
  ) stored,
  due_date date,
  note text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint debts_status_check check (status in ('UNPAID', 'PARTIAL', 'PAID'))
);

create index if not exists customers_name_idx on public.customers using gin (to_tsvector('simple', name));
create index if not exists debts_customer_id_idx on public.debts(customer_id);
create index if not exists debts_status_idx on public.debts(status);

alter table public.customers enable row level security;
alter table public.debts enable row level security;

-- Match current app model: authenticated owner/staff/admin can read/write.
-- Tighten later when finance roles exist.
create policy if not exists customers_authenticated_select on public.customers
  for select to authenticated using (true);
create policy if not exists customers_authenticated_insert on public.customers
  for insert to authenticated with check (true);
create policy if not exists customers_authenticated_update on public.customers
  for update to authenticated using (true) with check (true);

create policy if not exists debts_authenticated_select on public.debts
  for select to authenticated using (true);
create policy if not exists debts_authenticated_insert on public.debts
  for insert to authenticated with check (true);
create policy if not exists debts_authenticated_update on public.debts
  for update to authenticated using (true) with check (true);
