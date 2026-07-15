-- Re-Trace database schema for Supabase (Postgres).
-- Run this once in the Supabase SQL editor (Dashboard -> SQL Editor -> New query).
-- It is idempotent enough to re-run: it uses IF NOT EXISTS / CREATE OR REPLACE and
-- drops policies before recreating them.

-- Column names here match the *_row interfaces in src/lib and src/Services
-- (e.g. serial_number, owner_id, full_name).

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'client' check (role in ('client', 'industry', 'admin')),
  organization text,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  manufacturer text not null,
  serial_number text not null,
  owner_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'active'
    check (status in ('active', 'in_repair', 'recycled', 'retired')),
  manufacture_date date,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.repairs (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  requester_id uuid not null references auth.users (id) on delete cascade,
  technician_id uuid references auth.users (id) on delete set null,
  description text not null,
  status text not null default 'pending'
    check (status in ('pending', 'in_progress', 'completed', 'rejected')),
  cost numeric,
  created_at timestamptz not null default now()
);

create table if not exists public.recycle_records (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  method text not null,
  status text not null default 'requested'
    check (status in ('requested', 'collected', 'processed')),
  points integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Helper: current user's role, read with SECURITY DEFINER to avoid RLS
-- recursion when used inside policies on the profiles table itself.
-- ---------------------------------------------------------------------------

create or replace function public.current_user_role()
returns text
language sql
security definer
stable
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- ---------------------------------------------------------------------------
-- Auto-create a profile row when a new auth user signs up. The app passes
-- full_name / role / organization via auth signUp options.data, which land in
-- raw_user_meta_data.
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role, organization)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'role', 'client'),
    new.raw_user_meta_data ->> 'organization'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.repairs enable row level security;
alter table public.recycle_records enable row level security;
alter table public.notifications enable row level security;

-- profiles: owners see/edit their own row; admins see all.
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.current_user_role() = 'admin');

drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

drop policy if exists profiles_insert on public.profiles;
create policy profiles_insert on public.profiles
  for insert to authenticated
  with check (id = auth.uid());

-- products: publicly readable (public passport pages); owners create/edit;
-- admins and industry partners can manage.
drop policy if exists products_select on public.products;
create policy products_select on public.products
  for select to anon, authenticated
  using (true);

drop policy if exists products_insert on public.products;
create policy products_insert on public.products
  for insert to authenticated
  with check (owner_id = auth.uid());

drop policy if exists products_update on public.products;
create policy products_update on public.products
  for update to authenticated
  using (owner_id = auth.uid() or public.current_user_role() in ('admin', 'industry'))
  with check (owner_id = auth.uid() or public.current_user_role() in ('admin', 'industry'));

drop policy if exists products_delete on public.products;
create policy products_delete on public.products
  for delete to authenticated
  using (owner_id = auth.uid() or public.current_user_role() = 'admin');

-- repairs: requesters see their own; admins and industry partners see/manage all.
drop policy if exists repairs_select on public.repairs;
create policy repairs_select on public.repairs
  for select to authenticated
  using (requester_id = auth.uid() or public.current_user_role() in ('admin', 'industry'));

drop policy if exists repairs_insert on public.repairs;
create policy repairs_insert on public.repairs
  for insert to authenticated
  with check (requester_id = auth.uid());

drop policy if exists repairs_update on public.repairs;
create policy repairs_update on public.repairs
  for update to authenticated
  using (public.current_user_role() in ('admin', 'industry'))
  with check (public.current_user_role() in ('admin', 'industry'));

-- recycle_records: users see/create their own; admins manage all.
drop policy if exists recycle_select on public.recycle_records;
create policy recycle_select on public.recycle_records
  for select to authenticated
  using (user_id = auth.uid() or public.current_user_role() = 'admin');

drop policy if exists recycle_insert on public.recycle_records;
create policy recycle_insert on public.recycle_records
  for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists recycle_update on public.recycle_records;
create policy recycle_update on public.recycle_records
  for update to authenticated
  using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

-- notifications: recipients see/update their own; admins may create.
drop policy if exists notifications_select on public.notifications;
create policy notifications_select on public.notifications
  for select to authenticated
  using (user_id = auth.uid());

drop policy if exists notifications_insert on public.notifications;
create policy notifications_insert on public.notifications
  for insert to authenticated
  with check (user_id = auth.uid() or public.current_user_role() = 'admin');

drop policy if exists notifications_update on public.notifications;
create policy notifications_update on public.notifications
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Helpful indexes
-- ---------------------------------------------------------------------------

create index if not exists products_owner_id_idx on public.products (owner_id);
create index if not exists repairs_requester_id_idx on public.repairs (requester_id);
create index if not exists recycle_user_id_idx on public.recycle_records (user_id);
create index if not exists notifications_user_id_idx on public.notifications (user_id);
