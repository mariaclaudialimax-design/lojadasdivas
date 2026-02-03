
import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const handler: Handler = async (event, context) => {
    // GET: Fetch all settings
    if (event.httpMethod === 'GET') {
        const { data, error } = await supabase
            .from('site_settings')
            .select('*')
            .order('group_name', { ascending: true });

        if (error) return { statusCode: 500, body: JSON.stringify({ error: error.message }) };

        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    }

    // PUT: Update a specific setting
    if (event.httpMethod === 'PUT') {
        const token = event.headers.authorization?.split('Bearer ')[1];
        if (!token) return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };

        // Verify Admin
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);
        if (authError || !user?.email) return { statusCode: 401, body: JSON.stringify({ error: 'Invalid token' }) };

        const { data: adminUser } = await supabase.from('admin_users').select('role').eq('email', user.email).single();
        if (!adminUser || adminUser.role !== 'admin') return { statusCode: 403, body: JSON.stringify({ error: 'Forbidden' }) };

        const body = JSON.parse(event.body || '{}');
        const { key, value } = body;

        if (!key) return { statusCode: 400, body: JSON.stringify({ error: 'Missing setting key' }) };

        const { data, error } = await supabase
            .from('site_settings')
            .update({
                setting_value: value,
                updated_at: new Date().toISOString()
            })
            .eq('setting_key', key)
            .select();

        if (error) return { statusCode: 500, body: JSON.stringify({ error: error.message }) };

        return {
            statusCode: 200,
            body: JSON.stringify(data[0]),
        };
    }

    return { statusCode: 405, body: 'Method Not Allowed' };
};

export { handler };
