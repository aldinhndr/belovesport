// Path: src/lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 🛡️ BARIKADE FAIL-FAST: Gagalkan kompilasi runtime jika env bocor/kosong
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        'CRITICAL RUNTIME ERROR: Supabase environment variables are missing! ' +
        'Please verify that NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY ' +
        'are properly configured inside your .env file.'
    );
}

// Inisialisasi client tunggal (Singleton) dengan jaminan Type-Safe non-null (!)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
    },
});