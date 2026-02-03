import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = (SUPABASE_URL && SUPABASE_SERVICE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: { persistSession: false }
    })
  : null;

export const handler = async (event: any) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  if (!supabase) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Supabase not configured' }) };
  }

  try {
    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email and password required' })
      };
    }

    // Sign in user with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Auth error:', error.message);
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid credentials' })
      };
    }

    if (!data.user || !data.session) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Login failed' })
      };
    }

    // Check if user is admin
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('id, role')
      .eq('id', data.user.id)
      .single();

    if (adminError || !adminUser) {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: 'Not authorized as admin' })
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: data.session.access_token,
        user: {
          id: data.user.id,
          email: data.user.email || ''
        },
        role: adminUser.role
      })
    };
  } catch (err: any) {
    console.error('Login error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Server error' })
    };
  }
};
