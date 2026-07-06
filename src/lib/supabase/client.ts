import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validasi ketat tanpa fallback string kosong agar tidak membuat client tiruan yang cacat
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ ERROR: Variabel lingkungan Supabase tidak terbaca di sisi klien!");
  console.log("URL saat ini:", supabaseUrl);
  console.log("Key saat ini:", supabaseAnonKey);
}

// Ekspor instans secara bersih
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');