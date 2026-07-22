import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    
    // Target akhir pengalihan: Banting ke /register setelah sukses
    const next = '/register'; 

    if (code) {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            );
                        } catch {
                            // Dilewati jika dipanggil dari Server Component
                        }
                    },
                },
            }
        );

        // 🎯 EKSEKUSI UTAMA: Tukar 'code' dari Google menjadi session resmi di dalam Cookies
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        
        if (!error) {
            // ✅ SUKSES: Alihkan secara paksa ke /register dengan URL yang bersih dari parameter apapun!
            return NextResponse.redirect(`${origin}${next}`);
        }
        
        console.error('Exchange error:', error.message);
    }

    // Fallback jika proses otentikasi gagal
    return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
}