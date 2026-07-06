// Path: middleware.ts  (taruh di ROOT project, sejajar dengan folder src/)
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Halaman yang WAJIB login untuk diakses. Sesuaikan daftarnya dengan rute asli kamu.
const PROTECTED_PAGE_PREFIXES = ['/bracket', '/profil', '/tournament'];

// API yang WAJIB login untuk dipanggil (mencegah "ditembak" langsung via curl/Postman).
const PROTECTED_API_PREFIXES = ['/api/tournament'];

// Halaman auth sendiri jangan ikut diblokir, supaya tidak infinite redirect.
const PUBLIC_PAGE_PREFIXES = ['/login', '/signup', '/verify-otp', '/forgot-password', '/auth'];

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Rute publik dilewati begitu saja.
    if (PUBLIC_PAGE_PREFIXES.some((p) => path.startsWith(p))) {
        return NextResponse.next();
    }

    let response = NextResponse.next({ request });

    // Client Supabase versi server, baca/tulis sesi lewat cookies request.
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

    // INI KUNCINYA: validasi sesi langsung ke server Supabase, bukan cuma baca cookie mentah.
    const { data: { user } } = await supabase.auth.getUser();

    const isProtectedPage = PROTECTED_PAGE_PREFIXES.some((p) => path.startsWith(p));
    const isProtectedApi = PROTECTED_API_PREFIXES.some((p) => path.startsWith(p));

    if (!user && (isProtectedPage || isProtectedApi)) {
        // Kalau yang ditembak API → balas 401 JSON, jangan redirect (fetch() di client tidak butuh HTML redirect).
        if (isProtectedApi) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized. Silakan login terlebih dahulu.' },
                { status: 401 }
            );
        }
        // Kalau yang diakses halaman → lempar ke /login, bawa info tujuan awal biar bisa balik lagi setelah login.
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', path);
        return NextResponse.redirect(loginUrl);
    }

    return response;
}

export const config = {
    matcher: [
        // Jalankan middleware untuk semua rute KECUALI file statis/asset.
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};