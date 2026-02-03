import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const handler: Handler = async (event, context) => {
  if (!['GET', 'POST', 'PUT', 'DELETE'].includes(event.httpMethod || '')) {
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

    // GET: Fetch coupons
    if (event.httpMethod === 'GET') {
      const limit = parseInt(event.queryStringParameters?.limit || '50');
      const offset = parseInt(event.queryStringParameters?.offset || '0');
      const active = event.queryStringParameters?.active;

      let query = supabase
        .from('coupons')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (active !== undefined) {
        query = query.eq('active', active === 'true');
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
          coupons: data,
          total: count,
          limit,
          offset,
        }),
      };
    }

    // POST: Create coupon
    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { code, discountType, discountValue, maxUses, expiresAt, active } = body;

      if (!code || !discountType || discountValue === undefined) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Missing required fields: code, discountType, discountValue' }),
        };
      }

      const { data, error } = await supabase
        .from('coupons')
        .insert([
          {
            code: code.toUpperCase(),
            discount_type: discountType, // 'percentage' or 'fixed'
            discount_value: discountValue,
            max_uses: maxUses,
            expires_at: expiresAt,
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

    // PUT: Update coupon
    if (event.httpMethod === 'PUT') {
      const couponId = event.queryStringParameters?.id;
      if (!couponId) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Missing coupon ID' }),
        };
      }

      const body = JSON.parse(event.body || '{}');
      const { code, discountType, discountValue, maxUses, expiresAt, active } = body;

      const { data, error } = await supabase
        .from('coupons')
        .update({
          code: code ? code.toUpperCase() : undefined,
          discount_type: discountType,
          discount_value: discountValue,
          max_uses: maxUses,
          expires_at: expiresAt,
          active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', couponId)
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

    // DELETE: Delete coupon
    if (event.httpMethod === 'DELETE') {
      const couponId = event.queryStringParameters?.id;
      if (!couponId) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Missing coupon ID' }),
        };
      }

      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', couponId);

      if (error) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: error.message }),
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Coupon deleted' }),
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
