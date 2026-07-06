// Path: src/app/api/auth/reset-password/route.ts

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { verifyOtp } from '@/lib/otp';

export async function POST(request: NextRequest) {
  try {
    const { email, code, newPassword } = await request.json();

    if (!email || !code || !newPassword) {
      return NextResponse.json({ success: false, message: 'Semua field wajib diisi.' }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ success: false, message: 'Password baru minimal 8 karakter.' }, { status: 400 });
    }

    // 1. Validasi Kode OTP untuk PASSWORD_RESET
    const isValid = await verifyOtp(email, code, 'PASSWORD_RESET');
    if (!isValid) {
      return NextResponse.json({ success: false, message: 'Kode OTP salah atau sudah kedaluwarsa.' }, { status: 400 });
    }

    // 2. Hash Password Baru
    const passwordHash = await bcrypt.hash(newPassword, 12);

    // 3. Update Password Baru di Database Supabase
    await prisma.participant.update({
      where: { email },
      data: { passwordHash },
    });

    return NextResponse.json({
      success: true,
      message: 'Password berhasil diperbarui. Silakan login kembali.',
    });
  } catch (error) {
    console.error('Reset Password API Error:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan server.' }, { status: 500 });
  }
}