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

    // 🎯 Email khusus Ko Aldin sebagai Super Admin
    const SUPER_ADMIN_EMAIL = "aldinhalawa2023@gmail.com"; 
    const isSuperAdmin = user?.email === SUPER_ADMIN_EMAIL;

    // 🔑 BARKADE 1: Gembok Pra-Peluncuran (Matikan sakelar jika sudah rilis resmi)
    const isLockedBeforeLaunch = true; 

    if (isLockedBeforeLaunch) {
        // Jika web dikunci, block akses ke halaman dalam dan paksa ke halaman login/penangguhan
        if (url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/admin')) {
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }
    }

    // 🔑 BARIKADE 2: Route Guard Otentikasi
    // Jika ada yang coba masuk ke /admin, wajib login DAN wajib memiliki email Ko Aldin
    if (url.pathname.startsWith('/admin')) {
        if (!user || !isSuperAdmin) {
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }
    }

    // Perlindungan umum untuk /dashboard biasa (user umum wajib login)
    if (!user && url.pathname.startsWith('/dashboard')) {
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    if (user && url.pathname === '/login') {
        // Jika yang login adalah Koko, lempar ke /admin, jika user biasa lempar ke /dashboard
        url.pathname = isSuperAdmin ? '/admin' : '/dashboard';
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