
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = (SUPABASE_URL && SUPABASE_SERVICE_KEY)
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
        auth: { persistSession: false }
    })
    : null;

export const handler = async (event: any) => {
    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    if (!supabase) {
        return { statusCode: 500, body: JSON.stringify({ error: 'Supabase not configured' }) };
    }

    try {
        const { email, password, name, role = 'admin' } = JSON.parse(event.body);

        if (!email || !password || !name) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Email, password and name are required' })
            };
        }

        // 1. Create user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { full_name: name }
        });

        if (authError) {
            console.error('Auth signup error:', authError.message);
            return {
                statusCode: 400,
                body: JSON.stringify({ error: authError.message })
            };
        }

        if (!authData.user) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Failed to create user' })
            };
        }

        // 2. Create entry in public.admin_users
        const { error: adminError } = await supabase
            .from('admin_users')
            .insert({
                id: authData.user.id,
                email: email,
                role: role
            });

        if (adminError) {
            console.error('Admin record creation error:', adminError.message);
            // Rollback auth user creation if possible (optional but recommended)
            await supabase.auth.admin.deleteUser(authData.user.id);

            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Failed to set admin permissions: ' + adminError.message })
            };
        }

        return {
            statusCode: 201,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: 'Admin created successfully',
                user: {
                    id: authData.user.id,
                    email: authData.user.email,
                    name: name
                }
            })
        };
    } catch (err: any) {
        console.error('Signup error:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message || 'Server error' })
        };
    }
};
