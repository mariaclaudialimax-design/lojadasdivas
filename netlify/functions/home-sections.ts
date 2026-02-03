import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'GET' && event.httpMethod !== 'PUT') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // GET: Fetch home page sections (public - show active only)
    if (event.httpMethod === 'GET') {
      const { data, error } = await supabase
        .from('home_sections')
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

    // PUT: Update home sections (admin only - batch update)
    if (event.httpMethod === 'PUT') {
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
      const sectionId = event.queryStringParameters?.id;

      if (!sectionId) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Missing section ID' }),
        };
      }

      const { title, subtitle, imageUrl, content, active, orderPosition } = body;

      const { data, error } = await supabase
        .from('home_sections')
        .update({
          title: title !== undefined ? title : undefined,
          subtitle: subtitle !== undefined ? subtitle : undefined,
          image_url: imageUrl !== undefined ? imageUrl : undefined,
          content: content !== undefined ? content : undefined,
          active: active !== undefined ? active : undefined,
          order_position: orderPosition !== undefined ? orderPosition : undefined,
          updated_at: new Date().toISOString(),
        })
        .eq('id', sectionId)
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
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal server error' }),
    };
  }
};

export { handler };
