// Path: src/app/api/auth/forgot-password/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createOtp } from '@/lib/otp';
import { sendOtpEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ success: false, message: 'Email wajib diisi.' }, { status: 400 });
    }

    // 1. Cek apakah email peserta terdaftar
    const participant = await prisma.participant.findUnique({ where: { email } });
    if (!participant) {
      // Demi keamanan (Cegah User Enumeration), kita tetap kembalikan status 200 seolah sukses
      // agar hacker tidak tahu email mana saja yang terdaftar.
      return NextResponse.json({ 
        success: true, 
        message: 'Jika email terdaftar, kode reset password telah dikirim.' 
      });
    }

    // 2. Buat OTP khusus untuk PASSWORD_RESET
    const code = await createOtp(email, 'PASSWORD_RESET');

    // 3. Kirim email OTP via Resend
    await sendOtpEmail(email, code, 'PASSWORD_RESET');

    return NextResponse.json({
      success: true,
      message: 'Kode reset password telah dikirim ke email kamu.',
    });
  } catch (error) {
    console.error('Forgot Password API Error:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan server.' }, { status: 500 });
  }
}