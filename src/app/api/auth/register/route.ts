// Path: src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { createOtp } from '@/lib/otp';
import { sendOtpEmail } from '@/lib/email';

// 1. Definisikan Schema Validasi Ketat dengan Zod
const registerSchema = z.object({
  username: z.string()
    .min(3, { message: 'Username minimal harus 3 karakter.' })
    .max(20, { message: 'Username maksimal 20 karakter.' })
    .regex(/^[a-zA-Z0-9_]+$/, { message: 'Username hanya boleh mengandung huruf, angka, dan underscore.' }),
  email: z.string()
    .email({ message: 'Format email tidak valid.' }),
  password: z.string()
    .min(8, { message: 'Password minimal 8 karakter.' })
    .regex(/[A-Z]/, { message: 'Password wajib mengandung minimal 1 huruf besar.' })
    .regex(/[0-9]/, { message: 'Password wajib mengandung minimal 1 angka.' }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 2. Eksekusi Sensor Validasi Zod
    const validation = registerSchema.safeParse(body);
    
    if (!validation.success) {
      // Tangkap pesan error pertama yang paling spesifik berdasarkan aturan di atas
      const firstErrorMessage = validation.error.issues[0].message;
      return NextResponse.json({ success: false, message: firstErrorMessage }, { status: 400 });
    }

    // Ekstrak data yang sudah 100% steril dan valid
    const { username, email, password } = validation.data;

    // 3. Cek duplikasi akun pada model participant
    const existing = await prisma.participant.findFirst({ 
      where: { OR: [{ username }, { email }] } 
    });
    
    if (existing) {
      return NextResponse.json({ success: false, message: 'Username atau email sudah terdaftar.' }, { status: 409 });
    }

    // 4. Proses Hashing & Simpan ke Database
    const passwordHash = await bcrypt.hash(password, 12);
    const participant = await prisma.participant.create({
      data: { username, email, passwordHash, isVerified: false },
    });

    // 5. Trigger Sistem OTP & Email
    const code = await createOtp(email, 'REGISTRATION');
    await sendOtpEmail(email, code, 'REGISTRATION');

    return NextResponse.json(
      {
        success: true,
        message: 'Akun dibuat. Cek email kamu untuk kode verifikasi.',
        data: { participantId: participant.id, email: participant.email },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register Participant Error:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan server.' }, { status: 500 });
  }
}