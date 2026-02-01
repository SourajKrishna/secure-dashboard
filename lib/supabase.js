// Supabase Client Configuration
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
let supabase = null;

export function getSupabaseClient() {
    if (!supabase) {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Missing Supabase environment variables');
        }

        supabase = createClient(supabaseUrl, supabaseKey);
    }

    return supabase;
}
