// Path: src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'belovesport-secret-key-2026';
const secretKey = new TextEncoder().encode(JWT_SECRET);

// 🛡️ Helper Verifikasi Token Ringan untuk Edge Middleware
async function isParticipantTokenValid(token: string | undefined): Promise<boolean> {
    if (!token) return false;
    try {
        const { payload } = await jwtVerify(token, secretKey);
        // Validasi Casing Role & Presensi participantId
        return payload.role === 'participant' && Boolean(payload.participantId);
    } catch {
        return false;
    }
}

export async function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();
    const pathname = url.pathname;

    const participantToken = request.cookies.get('participant_session')?.value;
    const hasSupabaseSession = request.cookies.getAll().some(
        (c) => c.name.startsWith('sb-') && c.name.endsWith('-auth-token')
    );

    // ⚡ BUKAN BLIND TRUST: Verifikasi keabsahan isi token
    const isTokenValid = await isParticipantTokenValid(participantToken);
    const isAuthenticated = isTokenValid || hasSupabaseSession;

    // 🔑 CIRCUIT BREAKER 1: Jika Cookie ADA tapi TIDAK VALID (Token lama/rusak)
    // Hapus cookie busuk secara paksa & biarkan user masuk /login dengan bersih!
    if (participantToken && !isTokenValid && !hasSupabaseSession) {
        if (pathname.startsWith('/dashboard') || pathname.startsWith('/profil') || pathname.startsWith('/admin')) {
            url.pathname = '/login';
            const response = NextResponse.redirect(url);
            response.cookies.delete('participant_session');
            return response;
        }
    }

    // 🔑 BARIKADE 2: Protected Routes (/dashboard, /profil, /admin)
    if (!isAuthenticated && (pathname.startsWith('/dashboard') || pathname.startsWith('/profil') || pathname.startsWith('/admin'))) {
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // 🔑 BARIKADE 3: Guest-Only Routes (/login & /signup)
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