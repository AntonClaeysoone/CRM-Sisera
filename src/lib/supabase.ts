import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 10)}...` : 'Not found');

if (!supabaseUrl) {
  console.error('Missing env.VITE_SUPABASE_URL - Make sure to add it to your .env file');
  throw new Error('Missing env.VITE_SUPABASE_URL');
}

if (!supabaseAnonKey) {
  console.error('Missing env.VITE_SUPABASE_ANON_KEY - Make sure to add it to your .env file');
  throw new Error('Missing env.VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
