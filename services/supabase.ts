import { createClient } from '@supabase/supabase-js';

// Environment variables should be set in Netlify
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

// If credentials aren't present (local dev without env), we'll handle null gracefully in services
export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;
