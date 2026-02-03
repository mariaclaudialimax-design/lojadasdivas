
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
        }
    ];

    console.log('🔄 Uploading Products...');
    for (const p of PRODUCTS) {
        await supabase.from('products').upsert(p, { onConflict: 'id' });
    }

    console.log('🔄 Setting up Home Sections...');
    const SECTIONS = [
        {
            section_key: 'hero',
            section_type: 'banner',
            title: 'Coleção Ibiza',
            description: 'Aproveite nossa oferta exclusiva de lançamento.',
            content: JSON.stringify({
                image_mobile: 'https://cdn.shopify.com/s/files/1/0809/1274/4673/files/heronew.png?v=1770054480',
                image_desktop: 'https://cdn.shopify.com/s/files/1/0773/0148/1696/files/bannerdesktopibiza-698133c8acf7c.webp?v=1770075089',
                button_text: 'VER COLEÇÃO',
                link: '/category/kits'
            }),
            order_position: 1,
            is_active: true
        },
        {
            section_key: 'featured',
            section_type: 'grid',
            title: 'Destaques da Semana',
            content: JSON.stringify({
                limit: 4,
                category: 'all'
            }),
            order_position: 2,
            is_active: true
        }
    ];

    for (const s of SECTIONS) {
        const { error } = await supabase.from('home_sections').upsert(s, { onConflict: 'section_key' });
        if (error) console.error(`Err ${s.section_key}:`, error.message);
    }

    console.log('✨ All synced!');
}

repair();
