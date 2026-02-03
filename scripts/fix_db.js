
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

async function fix() {
    console.log('🚀 Fixing Database Tables...');

    // We can't run CREATE TABLE directly via Supabase JS unless we use a function
    // But we can check if we can at least insert what we have.

    // The previous error said "Could not find the 'active' column".
    // This means the table exists but lacks that column.

    // Let's see what columns ARE there.
    // I will try to insert a row with ONLY the guaranteed columns.
    const { error: err1 } = await supabase.from('home_sections').insert({
        section_key: 'test-' + Date.now(),
        section_type: 'banner'
    });

    if (err1) {
        console.log('❌ Error inserting minimal row:', err1.message);
    } else {
        console.log('✅ Minimal row inserted. Table exists.');
    }
}

fix();
