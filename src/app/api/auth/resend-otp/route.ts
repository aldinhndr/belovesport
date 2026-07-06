// Path: src/app/api/auth/resend-otp/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createOtp } from '@/lib/otp';
import { sendOtpEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    // 1. Validasi Input Email
    if (!email) {
      return NextResponse.json({ success: false, message: 'Email wajib diisi.' }, { status: 400 });
    }

    // 2. Cek Apakah Peserta Benar-Benar Ada di Database Supabase
    const participant = await prisma.participant.findUnique({ where: { email } });
    if (!participant) {
      return NextResponse.json({ success: false, message: 'Email tidak ditemukan.' }, { status: 404 });
    }

    // 3. Jika Akun Sudah Aktif/Terverifikasi, Jangan Kirim OTP Lagi (Idempotency Guard)
    if (participant.isVerified) {
      return NextResponse.json({ success: false, message: 'Akun sudah terverifikasi.' }, { status: 409 });
    }

    // 4. Generate Kode OTP Baru dan Kirim Ulang via Resend
    const code = await createOtp(email, 'REGISTRATION');
    await sendOtpEmail(email, code, 'REGISTRATION');

    return NextResponse.json({ 
      success: true, 
      message: 'Kode OTP baru telah berhasil dikirim ke email kamu.' 
    }, { status: 200 });

  } catch (error: any) {
    console.error('Resend OTP Error:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan server.' }, { status: 500 });
  }
}