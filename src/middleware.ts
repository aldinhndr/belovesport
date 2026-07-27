// Path: src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();
    const pathname = url.pathname;

    const participantToken = request.cookies.get('participant_session')?.value;
    const hasSupabaseSession = request.cookies.getAll().some(
        (c) => c.name.startsWith('sb-') && c.name.endsWith('-auth-token')
    );

    const isAuthenticated = Boolean(participantToken || hasSupabaseSession);

    // 🔑 BARIKADE 1: Protected Routes (/dashboard, /profil, /admin)
    if (!isAuthenticated && (pathname.startsWith('/dashboard') || pathname.startsWith('/profil') || pathname.startsWith('/admin'))) {
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // 🔑 BARIKADE 2: Guest-Only Routes (/login & /signup saja)
    // Catatan: /register sengaja dibebaskan agar pengguna terautentikasi tetap bisa daftar tim
    if (isAuthenticated && (pathname === '/login' || pathname === '/signup')) {
        url.pathname = '/profil';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

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