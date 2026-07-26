// Path: src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();
    const pathname = url.pathname;

    // 1. Ambil Session Cookie (Prisma Participant JWT & Supabase Auth Cookie)
    const participantToken = request.cookies.get('participant_session')?.value;
    
    // Cek keberadaan cookie Supabase tanpa memanggil SDK heavy-fetch
    const hasSupabaseSession = request.cookies.getAll().some(
        (c) => c.name.startsWith('sb-') && c.name.endsWith('-auth-token')
    );

    const isAuthenticated = Boolean(participantToken || hasSupabaseSession);

    // 🔑 BARIKADE 1: Gembok Pra-Peluncuran (Ubah ke false jika aplikasi sudah rilis)
    const isLockedBeforeLaunch = false; 

    if (isLockedBeforeLaunch) {
        if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }
    }

    // 🔑 BARIKADE 2: Route Guard /admin & /dashboard /profil
    if (!isAuthenticated && (pathname.startsWith('/dashboard') || pathname.startsWith('/profil') || pathname.startsWith('/admin'))) {
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // Redirect jika user sudah login tetapi mencoba membuka halaman /login /register /signup
    if (isAuthenticated && (pathname === '/login' || pathname === '/register' || pathname === '/signup')) {
        url.pathname = '/profil';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

// ⚙️ MATCHER: Tentukan halaman mana saja yang melewati guard ini
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