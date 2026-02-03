import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const handler: Handler = async (event, context) => {
  // Only allow GET, PUT, DELETE
  if (!['GET', 'PUT', 'DELETE'].includes(event.httpMethod || '')) {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const productId = event.queryStringParameters?.id;
  if (!productId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing product ID' }),
    };
  }

  try {
    // GET: Fetch single product (public - no auth required)
    if (event.httpMethod === 'GET') {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'Product not found' }),
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify(data),
      };
    }

    // PUT: Update product (admin only)
    if (event.httpMethod === 'PUT') {
      const token = event.headers.authorization?.split('Bearer ')[1];
      
      if (!token) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: 'Unauthorized' }),
        };
      }

      // Verify admin
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
      const { title, handle, description, categoryId, price, stock, images, sizes, active } = body;

      const { data, error } = await supabase
        .from('products')
        .update({
          title,
          handle,
          description,
          category_id: categoryId,
          price,
          stock,
          images,
          sizes,
          active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', productId)
        .select();

      if (error) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: error.message }),
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify(data[0]),
      };
    }

    // DELETE: Delete product (admin only)
    if (event.httpMethod === 'DELETE') {
      const token = event.headers.authorization?.split('Bearer ')[1];
      
      if (!token) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: 'Unauthorized' }),
        };
      }

      // Verify admin
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

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: error.message }),
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Product deleted' }),
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
