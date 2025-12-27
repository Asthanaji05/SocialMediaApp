import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.REALM_SUPABASE_URL;
const supabaseKey = process.env.REALM_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
