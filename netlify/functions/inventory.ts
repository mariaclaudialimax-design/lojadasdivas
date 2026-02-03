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

    // GET: Fetch inventory logs
    if (event.httpMethod === 'GET') {
      const productId = event.queryStringParameters?.productId;
      const limit = parseInt(event.queryStringParameters?.limit || '50');
      const offset = parseInt(event.queryStringParameters?.offset || '0');

      let query = supabase
        .from('inventory_logs')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (productId) {
        query = query.eq('product_id', productId);
      }

      const { data, error, count } = await query;

      if (error) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: error.message }),
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({
          logs: data,
          total: count,
          limit,
          offset,
        }),
      };
    }

    // POST: Create inventory log (stock adjustment)
    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { productId, quantity, reason } = body;

      if (!productId || quantity === undefined || !reason) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Missing required fields: productId, quantity, reason' }),
        };
      }

      const { data, error } = await supabase
        .from('inventory_logs')
        .insert([
          {
            product_id: productId,
            quantity_change: quantity,
            reason,
            admin_email: user.email,
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
