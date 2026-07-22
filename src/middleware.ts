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
                    cookiesToSet.forEach(({ name, value }) =>
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

    // 🔑 BARIKADE 1: Protection untuk Halaman Admin
    if (url.pathname.startsWith('/admin')) {
        if (!user || !isSuperAdmin) {
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }
    }

    // 🔑 BARIKADE 2: Protection untuk Halaman Dashboard / Profile
    if (!user && (url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/profil'))) {
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // 🔑 BARIKADE 3: Jika User Sudah Login, Cegah Buka Halaman Login/Register lagi
    if (user && (url.pathname === '/login' || url.pathname === '/register' || url.pathname === '/signup')) {
        url.pathname = isSuperAdmin ? '/admin' : '/dashboard';
        return NextResponse.redirect(url);
    }

    return response;
}

// ⚙️ MATCHER PRESISI: Lindungi HANYA Rute yang Membutuhkan Proteksi
export const config = {
    matcher: [
        '/dashboard/:path*', 
        '/admin/:path*',
        '/profil/:path*',
        '/login',
        '/register',
        '/signup',
    ],
};