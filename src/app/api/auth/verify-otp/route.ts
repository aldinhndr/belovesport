// Path: src/app/api/auth/verify-otp/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyOtp } from '@/lib/otp';

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    // 1. Validasi Input Kebocoran Data
    if (!email || !code) {
      return NextResponse.json(
        { success: false, message: 'Email dan kode OTP wajib diisi.' },
        { status: 400 }
      );
    }

    // 2. Eksekusi Verifikasi Khusus Lewat Mesin Library OTP (Idempotency Guard)
    const isValid = await verifyOtp(email, code, 'REGISTRATION');

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Kode OTP salah atau sudah kedaluwarsa.' },
        { status: 400 }
      );
    }

    // 3. Update Database Sesi Pengguna di PostgreSQL Supabase
    await prisma.participant.update({
      where: { email },
      data: { isVerified: true },
    });

    return NextResponse.json(
      { success: true, message: 'Verifikasi berhasil. Silakan login.' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Verify OTP API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan internal server.' },
      { status: 500 }
    );
  }
}