-- Migration: Add admin system tables
-- Description: Adds categories, pages, coupons, and RLS policies for MVP admin panel

-- ============================================================================
-- NÍVEL 1: MVP ESSENCIAL
-- ============================================================================

-- 1. CATEGORIES TABLE
create table if not exists public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  slug text not null unique,
  description text,
  image_url text,
  order_position integer default 0,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. PAGES (CMS)
create table if not exists public.pages (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  content text not null,
  meta_title text,
  meta_description text,
  is_published boolean default false,
  published_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Update products table if needed
alter table if exists public.products add column if not exists category_id uuid references public.categories(id);
alter table if exists public.products add column if not exists sku text unique;
alter table if exists public.products add column if not exists stock integer default 0;
alter table if exists public.products add column if not exists status text default 'active';
alter table if exists public.products add column if not exists compare_at_price numeric;
alter table if exists public.products add column if not exists external_id text;
alter table if exists public.products add column if not exists installments text;
alter table if exists public.products add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now());

-- Update orders table if needed
alter table if exists public.orders add column if not exists customer_phone text;
alter table if exists public.orders add column if not exists notes text;
alter table if exists public.orders add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now());

-- 3. Update HOME SECTIONS table
alter table if exists public.home_sections add column if not exists section_type text;
alter table if exists public.home_sections add column if not exists title text;
alter table if exists public.home_sections add column if not exists description text;
alter table if exists public.home_sections add column if not exists order_position integer default 0;
alter table if exists public.home_sections add column if not exists created_at timestamp with time zone default timezone('utc'::text, now());

-- ============================================================================
-- NÍVEL 2: OPERACIONAL
-- ============================================================================

-- 4. COUPONS / PROMOTIONS
create table if not exists public.coupons (
  id uuid default gen_random_uuid() primary key,
  code text unique not null,
  description text,
  discount_type text not null,
  discount_value numeric not null,
  valid_from timestamp with time zone,
  valid_until timestamp with time zone,
  max_uses integer,
  current_uses integer default 0,
  min_purchase_amount numeric,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Update inventory logs if needed
alter table if exists public.inventory_logs add column if not exists notes text;

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Categories
alter table public.categories enable row level security;
drop policy if exists "categories_public_read" on public.categories;
drop policy if exists "categories_admin_all" on public.categories;

create policy "categories_public_read" on public.categories
  for select using (active = true);
create policy "categories_admin_all" on public.categories
  for all using (
    exists (
      select 1 from public.admin_users
      where admin_users.id = auth.uid()
    )
  );

-- Pages
alter table public.pages enable row level security;
drop policy if exists "pages_public_read" on public.pages;
drop policy if exists "pages_admin_all" on public.pages;

create policy "pages_public_read" on public.pages
  for select using (is_published = true);
create policy "pages_admin_all" on public.pages
  for all using (
    exists (
      select 1 from public.admin_users
      where admin_users.id = auth.uid()
    )
  );

-- Update products policies
alter table public.products enable row level security;
drop policy if exists "Public Read Products" on public.products;
drop policy if exists "Admin Write Products" on public.products;
drop policy if exists "products_public_read" on public.products;
drop policy if exists "products_admin_all" on public.products;

create policy "products_public_read" on public.products
  for select using (status = 'active');
create policy "products_admin_all" on public.products
  for all using (
    exists (
      select 1 from public.admin_users
      where admin_users.id = auth.uid()
    )
  );

-- Coupons
alter table public.coupons enable row level security;
drop policy if exists "coupons_admin_all" on public.coupons;

create policy "coupons_admin_all" on public.coupons
  for all using (
    exists (
      select 1 from public.admin_users
      where admin_users.id = auth.uid()
    )
  );
