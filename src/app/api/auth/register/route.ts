// Path: src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'belovesport-secret-key-2026';

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
      const firstErrorMessage = validation.error.issues[0].message;
      return NextResponse.json({ success: false, message: firstErrorMessage }, { status: 400 });
    }

    // Ekstrak data yang sudah steril dan valid
    const { username, email, password } = validation.data;

    // 3. Cek spesifik duplikasi email / username
    const existingEmail = await prisma.participant.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return NextResponse.json(
        { success: false, message: 'Email ini sudah terdaftar. Silakan langsung login.' },
        { status: 409 }
      );
    }

    const existingUsername = await prisma.participant.findFirst({
      where: { username },
    });

    if (existingUsername) {
      return NextResponse.json(
        { success: false, message: 'Username/Nickname sudah terpakai. Pilih username lain.' },
        { status: 409 }
      );
    }

    // 4. Hashing Password & Simpan ke Database (Directly Verified)
    const passwordHash = await bcrypt.hash(password, 12);
    const participant = await prisma.participant.create({
      data: {
        username,
        email,
        passwordHash,
        isVerified: true, // Auto-verified tanpa OTP
      },
    });

    // 5. Generate Token Cookie Session untuk Instant Auto-Login
    const token = jwt.sign(
      {
        id: participant.id,
        email: participant.email,
        username: participant.username,
        role: 'PARTICIPANT',
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 6. Respon & Set Cookie Session
    const response = NextResponse.json(
      {
        success: true,
        message: 'Akun berhasil dibuat! Mengalihkan ke dasbor...',
        data: { participantId: participant.id, email: participant.email },
      },
      { status: 201 }
    );

    response.cookies.set('participant_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // Valid 7 Hari
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Register Participant Error:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan server.' }, { status: 500 });
  }
}