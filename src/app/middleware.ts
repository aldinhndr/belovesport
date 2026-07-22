import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const PROTECTED_PAGE_PREFIXES = ['/bracket', '/profil', '/tournament'];
const PROTECTED_API_PREFIXES = ['/api/tournament'];
const PUBLIC_PAGE_PREFIXES = ['/login', '/signup', '/verify-otp', '/forgot-password', '/auth', '/api/auth/callback'];

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    if (PUBLIC_PAGE_PREFIXES.some((p) => path.startsWith(p))) {
        return NextResponse.next();
    }

    let response = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
                    response = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    const isProtectedPage = PROTECTED_PAGE_PREFIXES.some((p) => path.startsWith(p));
    const isProtectedApi = PROTECTED_API_PREFIXES.some((p) => path.startsWith(p));

    if (!user && (isProtectedPage || isProtectedApi)) {
        if (isProtectedApi) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized. Silakan login terlebih dahulu.' },
                { status: 401 }
            );
        }
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', path);
        return NextResponse.redirect(loginUrl);
    }

    return response;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};