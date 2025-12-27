import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.REALM_SUPABASE_URL || 'https://rqhyepbqlokrccsrpnlc.supabase.co';
const supabaseKey = process.env.REALM_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️ Moscownpur ID (Supabase) fully configured state: PENDING. Cross-platform login may fail.');
}

export const supabase = createClient(supabaseUrl, supabaseKey || 'placeholder');
