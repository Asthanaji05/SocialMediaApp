import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.REALM_SUPABASE_URL || 'https://rqhyepbqlokrccsrpnlc.supabase.co';
const supabaseKey = process.env.REALM_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.REALM_SUPABASE_ACCESS_TOKEN; // Service Role Key for Admin ops

if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️ Moscownpur (RealM) Supabase configuration missing. Identity sync PENDING.');
}

const realmSupabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseKey || 'placeholder');

// Admin client for updates that bypass RLS (if token is provided)
const realmAdmin = supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } })
    : realmSupabase;

export { realmAdmin };
export default realmSupabase;

