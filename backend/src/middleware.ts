import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';
import { verifyParticipantSessionToken, PARTICIPANT_SESSION_COOKIE } from '@/lib/participant-auth';

const PARTICIPANT_PROTECTED_PREFIXES = ['/profil', '/jadwal', '/klasemen'];
const PARTICIPANT_AUTH_PAGES = ['/login', '/signup', '/verify-otp', '/forgot-password', '/reset-password'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ===== ADMIN GUARD =====
  if (pathname.startsWith('/admin')) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = sessionCookie ? await verifySessionToken(sessionCookie) : null;
    const isLoggedIn = !!session;
    const isLoginPage = pathname === '/admin/login';

    if (!isLoggedIn && !isLoginPage) return NextResponse.redirect(new URL('/admin/login', request.url));
    if (isLoggedIn && isLoginPage) return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    return NextResponse.next();
  }

  // ===== PESERTA GUARD =====
  const isParticipantProtected = PARTICIPANT_PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isParticipantAuthPage = PARTICIPANT_AUTH_PAGES.includes(pathname);

  if (isParticipantProtected || isParticipantAuthPage) {
    const participantCookie = request.cookies.get(PARTICIPANT_SESSION_COOKIE)?.value;
    const session = participantCookie ? await verifyParticipantSessionToken(participantCookie) : null;
    const isLoggedIn = !!session;

    if (isParticipantProtected && !isLoggedIn) return NextResponse.redirect(new URL('/login', request.url));
    if (isParticipantAuthPage && isLoggedIn && pathname !== '/verify-otp') {
      return NextResponse.redirect(new URL('/profil', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/profil/:path*', '/jadwal/:path*', '/klasemen/:path*', '/login', '/signup', '/verify-otp', '/forgot-password', '/reset-password'],
};