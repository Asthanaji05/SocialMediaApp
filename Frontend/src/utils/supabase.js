import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_REALM_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || 'https://rqhyepbqlokrccsrpnlc.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_REALM_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey && !supabaseAnonKey.includes('placeholder'));

if (!isSupabaseConfigured) {
    console.warn('Moscownpur (RealM) Supabase configuration missing on Frontend. SSO might be disabled.');
} else {
    console.log('✅ Moscownpur (RealM) Identity Engine Linked.');
}

export const supabase = createClient(
    supabaseUrl || 'https://none.supabase.co',
    supabaseAnonKey || 'none'
);
