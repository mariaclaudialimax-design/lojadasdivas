
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

async function check() {
    const { data: products } = await supabase.from('products').select('id, title');
    const { data: sections } = await supabase.from('home_sections').select('id, title');
    const { data: categories } = await supabase.from('categories').select('id, name');

    console.log('Products:', products?.length || 0);
    console.log('Sections:', sections?.length || 0);
    console.log('Categories:', categories?.length || 0);
}

check();
