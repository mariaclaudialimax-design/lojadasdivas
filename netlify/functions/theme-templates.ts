
import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const handler: Handler = async (event, context) => {
    // GET /theme-templates?key=index
    if (event.httpMethod === 'GET') {
        const key = event.queryStringParameters?.key || 'index';

        const { data, error } = await supabase
            .from('theme_templates')
            .select('*')
            .eq('template_key', key)
            .single();

        if (error && error.code !== 'PGRST116') { // Ignore not found
            return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
        }

        if (!data) {
            return { statusCode: 404, body: JSON.stringify({ error: 'Template not found' }) };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(data.schema),
        };
    }

    // PUT /theme-templates?key=index (Admin Save)
    if (event.httpMethod === 'PUT') {
        const token = event.headers.authorization?.split('Bearer ')[1];
        if (!token) return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };

        const { data: { user }, error: authError } = await supabase.auth.getUser(token);
        if (authError || !user?.email) return { statusCode: 401, body: JSON.stringify({ error: 'Invalid token' }) };

        const { data: adminUser } = await supabase.from('admin_users').select('role').eq('email', user.email).single();
        if (!adminUser || adminUser.role !== 'admin') return { statusCode: 403, body: JSON.stringify({ error: 'Forbidden' }) };

        const key = event.queryStringParameters?.key;
        if (!key) return { statusCode: 400, body: JSON.stringify({ error: 'Missing key' }) };

        const body = JSON.parse(event.body || '{}');

        // Upsert
        const { data, error } = await supabase
            .from('theme_templates')
            .upsert({
                template_key: key,
                schema: body, // The full { sections, order } JSON
                updated_at: new Date().toISOString()
            }, { onConflict: 'template_key' })
            .select();

        if (error) return { statusCode: 500, body: JSON.stringify({ error: error.message }) };

        return {
            statusCode: 200,
            body: JSON.stringify(data[0]),
        };
    }

    return { statusCode: 405, body: 'Make sure checking method' };
};

export { handler };
