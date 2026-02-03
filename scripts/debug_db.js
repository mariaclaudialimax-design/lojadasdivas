
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

async function run() {
    console.log('--- Database Check ---');

    // Check home_sections
    const { data: sections, error: sectionsError } = await supabase.from('home_sections').select('*');
    if (sectionsError) {
        console.log('❌ home_sections table Error:', sectionsError.message);
    } else {
        console.log('✅ home_sections exists. Rows:', sections.length);
        if (sections.length > 0) console.log('First Section sample:', sections[0]);
    }

    // Check categories
    const { data: categories, error: catsError } = await supabase.from('categories').select('*');
    if (catsError) {
        console.log('❌ categories table Error:', catsError.message);
    } else {
        console.log('✅ categories exist. Rows:', categories.length);
    }

    // Check products
    const { data: products, error: prodsError } = await supabase.from('products').select('*');
    if (prodsError) {
        console.log('❌ products table Error:', prodsError.message);
    } else {
        console.log('✅ products exist. Rows:', products.length);
    }
}

run();
