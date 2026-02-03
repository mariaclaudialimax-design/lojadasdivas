
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Constants from data/products.ts logic
const PRODUCTS = [
    {
        id: "kit-3-lux-linho",
        handle: "kit-3-lux-linho",
        title: "Kit 3 Camisas Lux Linho",
        description: "Elegância e frescor para o seu dia a dia.",
        price: 197.00,
        old_price: 397.00,
        images: ["https://cdn.shopify.com/s/files/1/0809/1274/4673/files/heronew.png?v=1770054480"],
        sizes: ["P", "M", "G", "GG"],
        is_kit: true,
        active: true
    }
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

async function seed() {
    console.log('🌱 Seeding initial products...');

    for (const product of PRODUCTS) {
        const { error } = await supabase
            .from('products')
            .upsert(product, { onConflict: 'id' });

        if (error) {
            console.error(`❌ Error seeding ${product.id}:`, error.message);
        } else {
            console.log(`✅ Seeded: ${product.id}`);
        }
    }

    // Also seed a default category
    const category = {
        id: '11111111-1111-1111-1111-111111111111',
        name: 'Kits Promocionais',
        slug: 'kits',
        active: true,
        order_position: 1
    };

    const { error: catError } = await supabase
        .from('categories')
        .upsert(category, { onConflict: 'id' });

    if (catError) console.error('❌ Error seeding category:', catError.message);
    else console.log('✅ Seeded Category: Kits');
}

seed();
