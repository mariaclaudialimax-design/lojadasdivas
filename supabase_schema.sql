
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PRODUCTS TABLE
create table if not exists public.products (
  id text primary key, -- Use text to match existing handle/slugs or uuid
  handle text unique not null,
  title text not null,
  description text,
  category text,
  price numeric not null,
  old_price numeric,
  images text[], -- Array of image URLs
  sizes text[],
  is_kit boolean default false,
  checkout_url text,
  variant_urls jsonb, -- Map of size -> url
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. HOME SECTIONS (CMS)
create table if not exists public.home_sections (
  id uuid default uuid_generate_v4() primary key,
  section_key text unique not null, -- e.g., 'hero', 'benefits'
  content jsonb not null, -- Flexible JSON for text, images, etc.
  is_active boolean default true,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. ORDERS (Synced from Checkout Webhook)
create table if not exists public.orders (
  id uuid default uuid_generate_v4() primary key,
  external_id text unique, -- ID from Corvex
  customer_name text,
  customer_email text,
  total_price numeric,
  status text default 'pending', -- pending, paid, shipped
  items jsonb,
  tracking_code text,
  event_id text, -- Used for CAPI deduplication
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. INVENTORY LOGS (Stock Movement)
create table if not exists public.inventory_logs (
  id uuid default uuid_generate_v4() primary key,
  product_id text references public.products(id),
  variant text, -- e.g., 'M', 'G'
  change_amount integer not null, -- negative for sales, positive for restock
  reason text, -- 'sale', 'restock', 'correction'
  order_id uuid references public.orders(id),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 5. SERVER EVENTS (Queue for CAPI/GA4)
-- Stores events to be processed by a background worker or cron
create table if not exists public.server_events (
  id uuid default uuid_generate_v4() primary key,
  event_name text not null, -- 'purchase'
  event_id text, -- Deduplication ID
  payload jsonb, -- Full event data (user_data, custom_data)
  status text default 'pending', -- 'pending', 'sent', 'failed'
  retry_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 6. ADMIN USERS (Simple Role Management)
create table if not exists public.admin_users (
  id uuid references auth.users not null primary key,
  role text default 'admin'
);

-- RLS POLICIES (Security)
alter table public.products enable row level security;
create policy "Public Read Products" on public.products for select using (true);
create policy "Admin Write Products" on public.products for all using (auth.role() = 'authenticated');

alter table public.home_sections enable row level security;
create policy "Public Read Home" on public.home_sections for select using (true);
create policy "Admin Write Home" on public.home_sections for all using (auth.role() = 'authenticated');

alter table public.orders enable row level security;
create policy "Admin Read Orders" on public.orders for all using (auth.role() = 'authenticated');
-- Webhooks use Service Role, which bypasses RLS
