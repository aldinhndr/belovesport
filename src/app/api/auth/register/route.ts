// Path: src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { 
    createParticipantSessionToken, 
    PARTICIPANT_SESSION_COOKIE, 
    PARTICIPANT_SESSION_MAX_AGE 
} from '@/lib/participant-auth';

// Validasi Zod untuk pembuatan akun pengguna
const registerSchema = z.object({
  username: z.string()
    .min(3, { message: 'Username minimal harus 3 karakter.' })
    .max(20, { message: 'Username maksimal 20 karakter.' })
    .regex(/^[a-zA-Z0-9_]+$/, { message: 'Username hanya boleh huruf, angka, dan underscore.' }),
  email: z.string().email({ message: 'Format email tidak valid.' }),
  password: z.string()
    .min(8, { message: 'Password minimal 8 karakter.' })
    .regex(/[A-Z]/, { message: 'Password wajib mengandung minimal 1 huruf besar.' })
    .regex(/[0-9]/, { message: 'Password wajib mengandung minimal 1 angka.' }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ success: false, message: 'Payload JSON tidak valid.' }, { status: 400 });
    }

    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error.issues[0].message }, 
        { status: 400 }
      );
    }

    const { username, email, password } = validation.data;

    // Cek duplikasi di database
    const existingEmail = await prisma.participant.findUnique({ where: { email } });
    if (existingEmail) {
      return NextResponse.json(
        { success: false, message: 'Email ini sudah terdaftar. Silakan langsung login.' }, 
        { status: 409 }
      );
    }

    const existingUsername = await prisma.participant.findFirst({ where: { username } });
    if (existingUsername) {
      return NextResponse.json(
        { success: false, message: 'Username/Nickname sudah terpakai. Pilih username lain.' }, 
        { status: 409 }
      );
    }

    // Hash Password & Simpan Participant Baru
    const passwordHash = await bcrypt.hash(password, 10);
    const participant = await prisma.participant.create({
      data: {
        username,
        email,
        passwordHash,
        isVerified: true,
      },
    });

    // 🚀 Terbitkan Token Sesi Konsisten via SSOT helper
    const token = await createParticipantSessionToken({
      participantId: participant.id,
      username: participant.username,
      role: 'participant',
    });

    const response = NextResponse.json(
      {
        success: true,
        message: 'Akun berhasil dibuat!',
        data: { participantId: participant.id, email: participant.email },
      },
      { status: 201 }
    );

    response.cookies.set(PARTICIPANT_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: PARTICIPANT_SESSION_MAX_AGE,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Register Participant Error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan sistem internal.' }, 
      { status: 500 }
    );
  }
}