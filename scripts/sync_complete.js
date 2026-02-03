
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const PRODUCTS = [
    {
        id: 'kit-ibiza',
        handle: 'kit-3-camisas-ibiza-em-linho-de-algodao',
        title: 'Kit 3 Camisas Ibiza em Linho de Algodão',
        description: 'O Kit 3 Camisas Ibiza em Linho de Algodão é ideal para quem busca leveza, conforto e elegância no dia a dia.',
        category_name: 'Kits Promocionais',
        price: 109.90,
        compare_at_price: 297.00,
        images: [
            'https://cdn.shopify.com/s/files/1/0809/1274/4673/files/Gemini_Generated_Image_3si0m13si0m13si0.png?v=1770007798',
            'https://cdn.shopify.com/s/files/1/0773/0148/1696/files/gemini-generated-image-1udnr91udnr91udn-6981409358279-698141d2dd466.jpg?v=1770078753',
            'https://cdn.shopify.com/s/files/1/0809/1274/4673/files/Gemini_Generated_Image_6uri3j6uri3j6uri.png?v=1770007797'
        ],
        sizes: ['PP', 'P', 'M', 'G', 'GG', '3G', '4G', '5G'],
        installments: '12x de R$ 10,96',
        is_kit: true,
        checkout_url: 'https://compra.lojadasdivas.com.br/pay/b6ba4039-5b33-4ba4-aaea-8a3e8d10098a'
    },
    {
        id: 'cj-babados-marrom',
        handle: 'conjunto-regata-e-saia-longa-babados-marrom',
        title: 'Conjunto Regata e Saia Longa Babados Marrom',
        description: 'A Saia Longa Babados é a escolha perfeita para quem busca elegância e conforto nos dias quentes.',
        category_name: 'Conjuntos',
        price: 99.90,
        compare_at_price: 142.71,
        images: [
            'https://cdn.shopify.com/s/files/1/0805/6055/4224/files/marrom1_18731aac-7308-47ff-8098-6868edcc6d56.jpg?v=1769027431',
            'https://cdn.shopify.com/s/files/1/0805/6055/4224/files/marrom2_68664ec8-5c57-4c88-8a5d-4a7691332c11.jpg?v=1769027431'
        ],
        sizes: ['PPP', 'PP', 'P', 'M', 'GG'],
        installments: '3x sem juros',
        is_kit: false,
        variant_urls: {
            'PPP': 'https://compra.lojadasdivas.com.br/pay/5c3b8ead-c039-451f-99bd-29e424708dc1',
            'PP': 'https://compra.lojadasdivas.com.br/pay/90956b83-0c3b-4e30-a015-1ceff0906ed8',
            'P': 'https://compra.lojadasdivas.com.br/pay/a0bff8b6-7004-4373-b649-9d5afef4c891',
            'M': 'https://compra.lojadasdivas.com.br/pay/31144fa0-631b-4106-9c98-b41987767be1',
            'GG': 'https://compra.lojadasdivas.com.br/pay/64f05064-9f8a-4397-89d9-9ad111413d08'
        }
    },
    {
        id: 'cj-babados-lima',
        handle: 'conjunto-regata-e-saia-longa-babados-lima',
        title: 'Conjunto Regata e Saia Longa Babados Lima',
        description: 'Confeccionada em um tecido leve e respirável, esta saia proporciona frescor e liberdade de movimentos.',
        category_name: 'Conjuntos',
        price: 99.90,
        compare_at_price: 142.71,
        images: [
            'https://cdn.shopify.com/s/files/1/0805/6055/4224/files/2_c8e9ecc9-ce1c-421f-b040-2457818ea6af.jpg?v=1769027348',
            'https://cdn.shopify.com/s/files/1/0805/6055/4224/files/lima1.jpg?v=1769027348'
        ],
        sizes: ['PPP', 'PP', 'P', 'M', 'G', 'GG'],
        installments: '3x sem juros',
        is_kit: false,
        variant_urls: {
            'PPP': 'https://compra.lojadasdivas.com.br/pay/bf608024-f079-4441-a0ac-03b5c6aec618',
            'PP': 'https://compra.lojadasdivas.com.br/pay/b5b2bad0-5dec-4a73-9ceb-c6d7331daf59',
            'P': 'https://compra.lojadasdivas.com.br/pay/bad6bce5-ac7e-452a-ae6f-5cd174a9cb90',
            'M': 'https://compra.lojadasdivas.com.br/pay/8f711a44-ca11-433a-bad7-9a905b48354e',
            'G': 'https://compra.lojadasdivas.com.br/pay/ebc3617d-f437-4a11-b79f-452c71d31d60',
            'GG': 'https://compra.lojadasdivas.com.br/pay/f9ae17e3-5ea2-4f11-aca9-dca3ee626c24'
        }
    },
    {
        id: 'vest-midi-rami-vermelho',
        handle: 'vestido-midi-rami-vermelho',
        title: 'Vestido Midi Rami Vermelho',
        description: 'Confeccionado em tecido rami, conhecido pela sua textura natural e leveza, este vestido combina conforto com um corte elegante.',
        category_name: 'Vestidos',
        price: 244.30,
        compare_at_price: 500.00,
        images: [
            'https://cdn.shopify.com/s/files/1/0805/6055/4224/files/vermelho1_5e09aea8-c814-4ad3-b0ab-3d727043a6d8.jpg?v=1769025311',
            'https://cdn.shopify.com/s/files/1/0805/6055/4224/files/vermelho2_4d9aaa88-3be8-4c0c-ab44-971743add11c.jpg?v=1769025311'
        ],
        sizes: ['PPP', 'PP', 'P', 'M', 'G', 'GG'],
        installments: '12x de R$ 24,43',
        is_kit: false,
        variant_urls: {
            'PPP': 'https://compra.lojadasdivas.com.br/pay/4c2cf727-926d-42dd-8378-f5f24133ec3c',
            'PP': 'https://compra.lojadasdivas.com.br/pay/b4eeb35b-876e-40d3-ae6b-e08b5757ccb3',
            'P': 'https://compra.lojadasdivas.com.br/pay/728c2ae3-6115-4d3f-b478-d94bc95e0cfc',
            'M': 'https://compra.lojadasdivas.com.br/pay/e621d241-d243-481c-a149-6537a9c04144',
            'G': 'https://compra.lojadasdivas.com.br/pay/38105af3-342b-46fa-8cca-704ed6387a39',
            'GG': 'https://compra.lojadasdivas.com.br/pay/90f553d8-ff4e-4974-a157-66eb7180a094'
        }
    }
];

const CATEGORIES = [
    { id: 'kits', name: 'Kits Promocionais', slug: 'kits' },
    { id: 'conjuntos', name: 'Conjuntos', slug: 'conjuntos' },
    { id: 'vestidos', name: 'Vestidos', slug: 'vestidos' }
];

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

async function run() {
    console.log('🚀 Starting Complete Sync...');

    // 1. Categories
    console.log('📁 Syncing Categories...');
    for (const cat of CATEGORIES) {
        const { data: existing } = await supabase.from('categories').select('id').eq('slug', cat.slug).single();
        if (!existing) {
            await supabase.from('categories').insert({ name: cat.name, slug: cat.slug, active: true });
        }
    }
    const { data: dbCategories } = await supabase.from('categories').select('*');
    const catMap = Object.fromEntries(dbCategories.map(c => [c.name, c.id]));

    // 2. Products
    console.log('🏷️ Syncing Products...');
    for (const p of PRODUCTS) {
        const { category_name, ...prodData } = p;
        const category_id = catMap[category_name];

        const { error } = await supabase.from('products').upsert({
            ...prodData,
            category_id,
            status: 'active'
        }, { onConflict: 'id' });

        if (error) console.error(`❌ Error logic product ${p.id}:`, error.message);
        else console.log(`✅ Product Synced: ${p.title}`);
    }

    // 3. Pages
    console.log('📄 Syncing Institutional Pages...');
    const PAGES = [
        { slug: 'sobre', title: 'Sobre a Loja', content: '<h1>Nossa História</h1><p>Bem-vindo à Loja das Divas...</p>', is_published: true },
        { slug: 'trocas', title: 'Trocas e Devoluções', content: '<h1>Política de Troca</h1><p>Você tem 7 dias para trocar...</p>', is_published: true },
        { slug: 'termos', title: 'Termos de Uso', content: '<h1>Termos e Condições</h1><p>Ao usar nosso site...</p>', is_published: true }
    ];
    for (const page of PAGES) {
        await supabase.from('pages').upsert(page, { onConflict: 'slug' });
    }

    // 4. Home Sections
    console.log('🏠 Syncing Home Sections...');
    const SECTIONS = [
        {
            section_key: 'hero_banner',
            section_type: 'banner',
            title: 'Nova Coleção Linho',
            data: { image: 'https://cdn.shopify.com/s/files/1/0809/1274/4673/files/heronew.png?v=1770054480', buttonText: 'Ver Coleção', link: '/category/kits' }
        },
        {
            section_key: 'bestsellers',
            section_type: 'grid',
            title: 'Mais Vendidos',
            data: { limit: 4, category: 'kits' }
        }
    ];
    for (const sec of SECTIONS) {
        await supabase.from('home_sections').upsert(sec, { onConflict: 'section_key' });
    }

    console.log('✅ Sync Finished!');
}

run();
