
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

async function repair() {
    console.log('👷 Repairing Schema & Syncing Data...');

    // 1. Get all products from hardcoded data to seed
    // (Assuming PRODUCTS from data/products.ts)
    const PRODUCTS = [
        {
            id: 'kit-ibiza',
            handle: 'kit-3-camisas-ibiza-em-linho-de-algodao',
            title: 'Kit 3 Camisas Ibiza em Linho de Algodão',
            description: 'O Kit 3 Camisas Ibiza em Linho de Algodão é ideal para quem busca leveza, conforto e elegância no dia a dia.',
            price: 109.90,
            compare_at_price: 297.00,
            images: [
                'https://cdn.shopify.com/s/files/1/0809/1274/4673/files/Gemini_Generated_Image_3si0m13si0m13si0.png?v=1770007798',
                'https://cdn.shopify.com/s/files/1/0773/0148/1696/files/gemini-generated-image-1udnr91udnr91udn-6981409358279-698141d2dd466.jpg?v=1770078753',
                'https://cdn.shopify.com/s/files/1/0809/1274/4673/files/Gemini_Generated_Image_6uri3j6uri3j6uri.png?v=1770007797'
            ],
            sizes: ['PP', 'P', 'M', 'G', 'GG', '3G', '4G', '5G'],
            is_kit: true,
            status: 'active'
        },
        {
            id: 'cj-babados-marrom',
            handle: 'conjunto-regata-e-saia-longa-babados-marrom',
            title: 'Conjunto Regata e Saia Longa Babados Marrom',
            description: 'A Saia Longa Babados é a escolha perfeita para quem busca elegância e conforto nos dias quentes.',
            price: 99.90,
            compare_at_price: 142.71,
            images: [
                'https://cdn.shopify.com/s/files/1/0805/6055/4224/files/marrom1_18731aac-7308-47ff-8098-6868edcc6d56.jpg?v=1769027431',
                'https://cdn.shopify.com/s/files/1/0805/6055/4224/files/marrom2_68664ec8-5c57-4c88-8a5d-4a7691332c11.jpg?v=1769027431'
            ],
            sizes: ['PPP', 'PP', 'P', 'M', 'GG'],
            is_kit: false,
            status: 'active'
        }
    ];

    console.log('🔄 Uploading Products...');
    for (const p of PRODUCTS) {
        const { error } = await supabase.from('products').upsert(p, { onConflict: 'id' });
        if (error) console.error(`Err ${p.id}:`, error.message);
    }

    console.log('🔄 Uploading Categories...');
    const CATS = [
        { name: 'Kits Promocionais', slug: 'kits' },
        { name: 'Conjuntos', slug: 'conjuntos' },
        { name: 'Vestidos', slug: 'vestidos' }
    ];
    for (const c of CATS) {
        await supabase.from('categories').upsert(c, { onConflict: 'slug' });
    }

    console.log('🔄 Setting up Home Sections...');
    const SECTIONS = [
        {
            section_key: 'hero',
            section_type: 'banner',
            title: 'Coleção Ibiza',
            data: {
                image_mobile: 'https://cdn.shopify.com/s/files/1/0809/1274/4673/files/heronew.png?v=1770054480',
                image_desktop: 'https://cdn.shopify.com/s/files/1/0773/0148/1696/files/bannerdesktopibiza-698133c8acf7c.webp?v=1770075089',
                button_text: 'VER COLEÇÃO',
                link: '/category/kits'
            },
            order_position: 1,
            is_active: true
        }
    ];
    for (const s of SECTIONS) {
        await supabase.from('home_sections').upsert(s, { onConflict: 'section_key' });
    }

    console.log('✨ All synced!');
}

repair();
