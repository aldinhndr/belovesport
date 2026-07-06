import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE } from '@/lib/auth';

function safeCompare(input: string, secret: string): boolean {
  const inputBuf = Buffer.from(input);
  const secretBuf = Buffer.from(secret);

  if (inputBuf.length !== secretBuf.length) {
    // Tetap jalankan timingSafeEqual dgn panjang sama agar waktu respons konsisten
    timingSafeEqual(inputBuf, inputBuf);
    return false;
  }
  return timingSafeEqual(inputBuf, secretBuf);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (typeof username !== 'string' || typeof password !== 'string' || !username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username dan password wajib diisi.' },
        { status: 400 }
      );
    }

    const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
      console.error('ADMIN_USERNAME / ADMIN_PASSWORD belum di-set di .env');
      return NextResponse.json(
        { success: false, message: 'Konfigurasi server admin bermasalah.' },
        { status: 500 }
      );
    }

    const isValid = safeCompare(username, ADMIN_USERNAME) && safeCompare(password, ADMIN_PASSWORD);

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Username atau password salah.' },
        { status: 401 }
      );
    }

    const token = await createSessionToken({ username: ADMIN_USERNAME, role: 'admin' });
    const response = NextResponse.json({ success: true, message: 'Login berhasil.' }, { status: 200 });

    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE,
    });

    return response;
  } catch (error) {
    console.error('API /admin/login Error:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan server.' }, { status: 500 });
  }
}