// Path: src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    // 1. Inisialisasi Supabase Server Client untuk membaca sesi otentikasi secara real-time
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    );
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // Ambil data user yang sedang aktif dari sesi cookie
    const { data: { user } } = await supabase.auth.getUser();
    const url = request.nextUrl.clone();

    // 🔑 BARKADE 1: Gembok Pra-Peluncuran (Matikan sakelar jika sudah rilis resmi)
    const isLockedBeforeLaunch = true; 

    if (isLockedBeforeLaunch) {
        // Jika web dikunci, block akses ke halaman dalam dan paksa ke halaman login/penangguhan
        if (url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/admin')) {
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }
    }

    // 🔑 BARIKADE 2: Route Guard Otentikasi (Mencegah Tembak Rute Folder)
    // Jika user MENCOBA MENGETIK rute internal tapi BELUM LOGIN, tendang balik ke /login
    if (!user && (url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/admin'))) {
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // Jika user SUDAH LOGIN tapi mencoba mengakses halaman /login lagi, lempar langsung ke dashboard
    if (user && url.pathname === '/login') {
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
    }

    return response;
}

// ⚙️ FILTER FILTERING: Tentukan folder mana saja yang wajib dilindungi oleh middleware ini
export const config = {
    matcher: [
        '/dashboard/:path*', 
        '/api/:path*', 
        '/login',
        '/forgot-password',
        '/register',
        '/signup',
        '/tournament/:path*',
        '/profil/:path*',
    ],
};