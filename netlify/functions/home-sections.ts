
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
    // GET: Fetch home page sections (public)
    if (event.httpMethod === 'GET') {
      const { data, error } = await supabase
        .from('home_sections')
        .select('*')
        .eq('is_active', true)
        .order('order_position', { ascending: true });

      if (error) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: error.message }),
        };
      }

      // Map DB fields to Frontend expected fields (content -> data, is_active -> active)
      const mappedData = data.map((item: any) => ({
        ...item,
        active: item.is_active,
        data: typeof item.content === 'string' ? JSON.parse(item.content) : item.content
      }));

      return {
        statusCode: 200,
        body: JSON.stringify(mappedData),
      };
    }

    // PUT: Update home sections (admin only)
    if (event.httpMethod === 'PUT') {
      const token = event.headers.authorization?.split('Bearer ')[1];
      if (!token) return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };

      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (authError || !user?.email) return { statusCode: 401, body: JSON.stringify({ error: 'Invalid token' }) };

      const body = JSON.parse(event.body || '{}');
      const sectionId = event.queryStringParameters?.id;

      if (!sectionId) return { statusCode: 400, body: JSON.stringify({ error: 'Missing section ID' }) };

      const { title, description, data, active, orderPosition } = body;

      const { data: updated, error } = await supabase
        .from('home_sections')
        .update({
          title: title !== undefined ? title : undefined,
          description: description !== undefined ? description : undefined,
          content: data !== undefined ? JSON.stringify(data) : undefined,
          is_active: active !== undefined ? active : undefined,
          order_position: orderPosition !== undefined ? orderPosition : undefined,
          updated_at: new Date().toISOString(),
        })
        .eq('id', sectionId)
        .select();

      if (error) return { statusCode: 400, body: JSON.stringify({ error: error.message }) };

      return {
        statusCode: 200,
        body: JSON.stringify(updated[0]),
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
