
-- Tabela para armazenar todas as configurações do tema (cores globais, fontes)
create table if not exists public.theme_settings (
    id uuid default gen_random_uuid() primary key,
    settings jsonb default '{}'::jsonb, -- JSON global
    created_at timestamp with time zone default timezone('utc'::text, now()),
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Tabela para armazenar os templates de páginas (JSONs de seções)
create table if not exists public.theme_templates (
    id uuid default gen_random_uuid() primary key,
    template_key text unique not null, -- ex: 'index', 'product', 'collection', 'page.about'
    name text,
    schema jsonb default '{}'::jsonb, -- O JSON gordo com { sections: {}, order: [] }
    created_at timestamp with time zone default timezone('utc'::text, now()),
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS
alter table public.theme_settings enable row level security;
alter table public.theme_templates enable row level security;

create policy "Public Read Theme" on public.theme_settings for select using (true);
create policy "Admin Write Theme" on public.theme_settings for all using (exists (select 1 from public.admin_users where id = auth.uid()));

create policy "Public Read Templates" on public.theme_templates for select using (true);
create policy "Admin Write Templates" on public.theme_templates for all using (exists (select 1 from public.admin_users where id = auth.uid()));
