import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'GET' && event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // GET: Fetch all categories (public)
    if (event.httpMethod === 'GET') {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('active', true)
        .order('order_position', { ascending: true });

      if (error) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: error.message }),
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify(data),
      };
    }

    // POST: Create category (admin only)
    if (event.httpMethod === 'POST') {
      const token = event.headers.authorization?.split('Bearer ')[1];
      
      if (!token) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: 'Unauthorized' }),
        };
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      
      if (authError || !user?.email) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: 'Invalid token' }),
        };
      }

      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('role')
        .eq('email', user.email)
        .single();

      if (!adminUser || adminUser.role !== 'admin') {
        return {
          statusCode: 403,
          body: JSON.stringify({ error: 'Forbidden' }),
        };
      }

      const body = JSON.parse(event.body || '{}');
      const { name, slug, description, imageUrl, orderPosition, active } = body;

      if (!name || !slug) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Missing required fields: name, slug' }),
        };
      }

      const { data, error } = await supabase
        .from('categories')
        .insert([
          {
            name,
            slug,
            description,
            image_url: imageUrl,
            order_position: orderPosition || 0,
            active: active !== false,
          },
        ])
        .select();

      if (error) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: error.message }),
        };
      }

      return {
        statusCode: 201,
        body: JSON.stringify(data[0]),
      };
    }
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal server error' }),
    };
  }
};

export { handler };
