import { NextRequest, NextResponse } from 'next/server';
import { createOtp, verifyOtp } from '@/lib/otp';
import { sendOtpEmail } from '@/lib/email';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST: generate & kirim OTP
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: 'Alamat email tidak valid.' }, { status: 400 });
    }

    const code = await createOtp(email, 'REGISTRATION');
    await sendOtpEmail(email, code, 'REGISTRATION');

    return NextResponse.json(
      { success: true, message: 'Kode OTP berhasil dikirim ke email kamu.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Send OTP Error:', error);
    return NextResponse.json({ error: 'Gagal mengirim kode OTP.' }, { status: 500 });
  }
}

// PUT: verifikasi OTP
export async function PUT(request: NextRequest) {
  try {
    const { email, userInputOtp } = await request.json();

    if (!email || !userInputOtp) {
      return NextResponse.json({ error: 'Data verifikasi tidak lengkap.' }, { status: 400 });
    }

    const isValid = await verifyOtp(email, userInputOtp, 'REGISTRATION');
    if (!isValid) {
      return NextResponse.json({ error: 'Kode OTP salah atau sudah kedaluwarsa.' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Email berhasil diverifikasi!' }, { status: 200 });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}