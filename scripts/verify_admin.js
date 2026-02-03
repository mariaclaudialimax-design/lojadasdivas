
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Extract env vars from .env.local
const envContent = fs.readFileSync('.env.local', 'utf8');
const env = Object.fromEntries(
    envContent.split('\n')
        .filter(line => line.includes('='))
        .map(line => {
            const [key, ...val] = line.split('=');
            return [key.trim(), val.join('=').trim()];
        })
);

const SUPABASE_URL = env.REACT_APP_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

console.log('URL Length:', SUPABASE_URL?.length);
console.log('Key Length:', SUPABASE_SERVICE_KEY?.length);

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Missing credentials in .env.local');
    process.exit(1);
}

async function verify() {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    console.log('--- Checking admin_users table ---');
    const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', 'admin@teste.com');

    if (error) {
        console.error('Error querying admin_users:', error);
    } else {
        console.log('Result for admin@teste.com in admin_users:', data);
    }

    console.log('--- Checking auth users (internal) ---');
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
        console.error('Error listing auth users:', authError);
    } else {
        const user = authData.users.find(u => u.email === 'admin@teste.com');
        console.log('Result for admin@teste.com in Auth:', user ? { id: user.id, email: user.email } : 'Not found');
    }
}

verify();
