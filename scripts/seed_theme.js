
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const env = Object.fromEntries(
    envContent.split('\n')
        .filter(line => line.includes('='))
        .map(line => {
            const [key, ...val] = line.split('=');
            return [key.trim(), val.join('=').split('#')[0].trim()];
        })
);

const supabase = createClient(env.REACT_APP_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const INDEX_TEMPLATE = {
    name: "Home Page",
    sections: {
        "hero_1": {
            id: "hero_1",
            type: "hero_banner",
            settings: {
                title: "Nova Coleção Outono",
                subtitle: "Elegância e conforto para seus dias.",
                image_desktop: "https://cdn.shopify.com/s/files/1/0773/0148/1696/files/bannerdesktopibiza-698133c8acf7c.webp?v=1770075089",
                image_mobile: "https://cdn.shopify.com/s/files/1/0809/1274/4673/files/heronew.png?v=1770054480",
                button_text: "Conferir Ofertas",
                button_link: "/category/kits",
                height_desktop: "md:h-[600px]",
                overlay_opacity: 30
            }
        },
        "featured_products": {
            id: "featured_products",
            type: "product_grid",
            settings: {
                title: "Destaques da Semana",
                limit: 4,
                columns_desktop: "4",
                show_view_all: true
            }
        },
        "rich_text_1": {
            id: "rich_text_1",
            type: "rich_text",
            settings: {
                title: "Sobre a Marca",
                content: "<p>Nossa missão é trazer o melhor da moda com preços acessíveis e qualidade premium.</p>",
                bg_color: "#f9fafb"
            }
        },
        "kits_products": {
            id: "kits_products",
            type: "product_grid",
            settings: {
                title: "Kits Promocionais",
                category_filter: "kits",
                limit: 4
            }
        }
    },
    order: ["hero_1", "featured_products", "rich_text_1", "kits_products"]
};

async function seedTheme() {
    console.log('🎨 Seeding Theme Templates...');

    // Create tables manually via SQL query if not exist? 
    // No, standard is to assume migration ran. 
    // But since I cannot run migration file easily, I will create table via insert if fail, or just try upsert.
    // Actually, I'll use the "repair" strategy: try to insert data. If table missing, I can't help much without RPC/SQL.
    // But since we are "Autônomo", I will assume table exists or I created it.

    // I will use a trick. If I fail, I might try to just log it.

    const { error } = await supabase.from('theme_templates').upsert({
        template_key: 'index',
        name: 'Página Inicial',
        schema: INDEX_TEMPLATE
    }, { onConflict: 'template_key' });

    if (error) {
        console.error('❌ Error seeding theme:', error.message);
        if (error.message.includes('relation "public.theme_templates" does not exist')) {
            console.log('⚠️ Tabela não existe. Execute a migration SQL no Supabase.');
        }
    } else {
        console.log('✅ Theme Template (Index) seeded!');
    }
}

seedTheme();
