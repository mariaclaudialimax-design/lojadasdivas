import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const handler: Handler = async (event, context) => {
  // Only allow GET and POST
  if (event.httpMethod !== 'GET' && event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // GET: Fetch all products (public - no auth required)
    if (event.httpMethod === 'GET') {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });

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

    // POST: Create product (admin only - requires auth token)
    if (event.httpMethod === 'POST') {
      const token = event.headers.authorization?.split('Bearer ')[1];
      
      if (!token) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: 'Unauthorized - no token' }),
        };
      }

      // Verify admin role via JWT validation
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      
      if (authError || !user?.email) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: 'Invalid token' }),
        };
      }

      // Check if user is admin
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('role')
        .eq('email', user.email)
        .single();

      if (!adminUser || adminUser.role !== 'admin') {
        return {
          statusCode: 403,
          body: JSON.stringify({ error: 'Forbidden - not admin' }),
        };
      }

      const body = JSON.parse(event.body || '{}');
      const { title, handle, description, categoryId, price, stock, images, sizes, active } = body;

      if (!title || !handle || !price) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Missing required fields: title, handle, price' }),
        };
      }

      const { data, error } = await supabase
        .from('products')
        .insert([
          {
            title,
            handle,
            description,
            category_id: categoryId,
            price,
            stock: stock || 0,
            images,
            sizes,
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
