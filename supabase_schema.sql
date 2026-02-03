
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================================
-- NÍVEL 1: MVP ESSENCIAL
-- ============================================================================

-- 1. CATEGORIES TABLE
create table if not exists public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  slug text not null unique,
  description text,
  image_url text,
  order_position integer default 0,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. PRODUCTS TABLE (Enhanced)
create table if not exists public.products (
  id text primary key,
  handle text unique not null,
  title text not null,
  description text,
  category_id uuid references public.categories(id),
  price numeric not null,
  compare_at_price numeric,
  sku text unique,
  stock integer default 0,
  status text default 'active', -- 'active' or 'draft'
  images text[], -- Array of image URLs
  sizes text[],
  is_kit boolean default false,
  installments text,
  checkout_url text,
  variant_urls jsonb, -- Map of size -> url
  external_id text, -- ID from Corvex
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. HOME SECTIONS (CMS)
create table if not exists public.home_sections (
  id uuid default uuid_generate_v4() primary key,
  section_key text unique not null, -- e.g., 'hero_banner', 'bestsellers'
  section_type text not null, -- 'banner', 'grid', 'text', 'html'
  title text,
  description text,
  data jsonb not null, -- Flexible JSON for content
  is_active boolean default true,
  order_position integer default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. PAGES (CMS)
create table if not exists public.pages (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null,
  title text not null,
  content text not null, -- Rich HTML or Markdown
  meta_title text,
  meta_description text,
  is_published boolean default false,
  published_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 5. ORDERS (Synced from Webhook)
create table if not exists public.orders (
  id uuid default uuid_generate_v4() primary key,
  external_id text unique,
  customer_name text,
  customer_email text,
  customer_phone text,
  total_price numeric,
  status text default 'pending', -- 'pending', 'paid', 'shipped', 'refunded', 'canceled'
  items jsonb, -- Array of {product_id, quantity, price}
  tracking_code text,
  event_id text unique, -- CAPI deduplication
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 6. ADMIN USERS
create table if not exists public.admin_users (
  id uuid references auth.users not null primary key,
  email text not null,
  role text default 'admin', -- 'admin', 'editor', 'viewer'
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- ============================================================================
-- NÍVEL 2: OPERACIONAL (Estoque, Cupons, SEO)
-- ============================================================================

-- 7. INVENTORY LOGS (Stock Movement History)
create table if not exists public.inventory_logs (
  id uuid default uuid_generate_v4() primary key,
  product_id text references public.products(id) on delete cascade,
  variant text, -- e.g., 'M', 'G'
  delta integer not null, -- negative for sales, positive for restock
  reason text not null, -- 'sale', 'restock', 'adjustment', 'return'
  order_id uuid references public.orders(id),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 8. COUPONS / PROMOTIONS
create table if not exists public.coupons (
  id uuid default uuid_generate_v4() primary key,
  code text unique not null,
  description text,
  discount_type text not null, -- 'percentage' or 'fixed'
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

-- 9. SERVER EVENTS (Queue for CAPI/GA4)
create table if not exists public.server_events (
  id uuid default uuid_generate_v4() primary key,
  event_name text not null, -- 'purchase', 'view_item', etc.
  event_id text,
  payload jsonb not null,
  status text default 'pending', -- 'pending', 'sent', 'failed'
  retry_count integer default 0,
  error_message text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Products: Public read, Admin write
alter table public.products enable row level security;
create policy "products_public_read" on public.products
  for select using (status = 'active');
create policy "products_admin_all" on public.products
  for all using (
    exists (
      select 1 from public.admin_users
      where admin_users.id = auth.uid()
    )
  );

-- Categories: Public read, Admin write
alter table public.categories enable row level security;
create policy "categories_public_read" on public.categories
  for select using (active = true);
create policy "categories_admin_all" on public.categories
  for all using (
    exists (
      select 1 from public.admin_users
      where admin_users.id = auth.uid()
    )
  );

-- Home Sections: Public read, Admin write
alter table public.home_sections enable row level security;
create policy "home_sections_public_read" on public.home_sections
  for select using (is_active = true);
create policy "home_sections_admin_all" on public.home_sections
  for all using (
    exists (
      select 1 from public.admin_users
      where admin_users.id = auth.uid()
    )
  );

-- Pages: Public read published, Admin write
alter table public.pages enable row level security;
create policy "pages_public_read" on public.pages
  for select using (is_published = true);
create policy "pages_admin_all" on public.pages
  for all using (
    exists (
      select 1 from public.admin_users
      where admin_users.id = auth.uid()
    )
  );

-- Orders: Admin read only
alter table public.orders enable row level security;
create policy "orders_admin_read" on public.orders
  for all using (
    exists (
      select 1 from public.admin_users
      where admin_users.id = auth.uid()
    )
  );

-- Admin Users: Only admins can read
alter table public.admin_users enable row level security;
create policy "admin_users_admin_read" on public.admin_users
  for select using (
    exists (
      select 1 from public.admin_users au
      where au.id = auth.uid()
    )
  );

-- Inventory Logs: Admin read
alter table public.inventory_logs enable row level security;
create policy "inventory_logs_admin_read" on public.inventory_logs
  for all using (
    exists (
      select 1 from public.admin_users
      where admin_users.id = auth.uid()
    )
  );

-- Coupons: Admin manage
alter table public.coupons enable row level security;
create policy "coupons_admin_all" on public.coupons
  for all using (
    exists (
      select 1 from public.admin_users
      where admin_users.id = auth.uid()
    )
  );

-- Server Events: Admin read
alter table public.server_events enable row level security;
create policy "server_events_admin_read" on public.server_events
  for select using (
    exists (
      select 1 from public.admin_users
      where admin_users.id = auth.uid()
    )
  );
