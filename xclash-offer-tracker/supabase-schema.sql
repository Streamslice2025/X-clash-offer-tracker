-- Run this in your Supabase project > SQL Editor

-- Packages table
create table if not exists packages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  price numeric not null,
  currency text default 'USD',
  tag text default '',
  notes text default '',
  expires_at text default '',
  items jsonb not null default '[]',
  created_at timestamptz default now()
);

-- Baselines table
create table if not exists baselines (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  price numeric not null,
  currency text default 'USD',
  items jsonb not null default '[]',
  created_at timestamptz default now()
);

-- Allow public read access
alter table packages enable row level security;
alter table baselines enable row level security;

create policy "Public read packages" on packages for select using (true);
create policy "Public read baselines" on baselines for select using (true);

-- Allow all insert/update/delete (admin password handled in frontend)
create policy "Admin write packages" on packages for all using (true);
create policy "Admin write baselines" on baselines for all using (true);
