import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// CETAK LOG UNTUK MEMASTIKAN DI TELEPON BROWSER / TERMINAL
console.log("=== DEBUG KONEKSI SUPABASE BELOVESPORT ===");
console.log("URL:", supabaseUrl ? "TERDETEKSI (AMAN)" : "KOSONG/UNDEFINED ❌");
console.log("ANON KEY:", supabaseAnonKey ? "TERDETEKSI (AMAN)" : "KOSONG/UNDEFINED ❌");
console.log("==========================================");

export const supabase = createClient(supabaseUrl, supabaseAnonKey);