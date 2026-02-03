
-- Create site_settings table for global configuration
create table if not exists public.site_settings (
    id uuid default gen_random_uuid() primary key,
    setting_key text unique not null,
    setting_value text,
    label text,
    field_type text default 'text', -- text, textarea, email, etc
    group_name text default 'general', -- contact, social, footer
    created_at timestamp with time zone default timezone('utc'::text, now()),
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS for settings
alter table public.site_settings enable row level security;

create policy "Settings Public Read" on public.site_settings
    for select using (true);

create policy "Settings Admin Write" on public.site_settings
    for all using (
        exists (
            select 1 from public.admin_users
            where admin_users.id = auth.uid()
        )
    );
