// Path: src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import {
  createParticipantSessionToken,
  PARTICIPANT_SESSION_COOKIE,
  PARTICIPANT_SESSION_MAX_AGE,
} from '@/lib/participant-auth';

export async function POST(request: NextRequest) {
  try {
    const { identifier, password } = await request.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, message: 'Username/email dan password wajib diisi.' }, 
        { status: 400 }
      );
    }

    // 1. Kueri pencarian akun berdasarkan Username atau Email
    const participant = await prisma.participant.findFirst({
      where: { 
        OR: [
          { username: identifier.trim() }, 
          { email: identifier.trim().toLowerCase() }
        ] 
      },
    });

    if (!participant) {
      return NextResponse.json(
        { success: false, message: 'Akun tidak ditemukan.' }, 
        { status: 401 }
      );
    }

    // 2. Hybrid Password Matching (Plaintext & Bcrypt Hash Support)
    let isPasswordValid = password === participant.passwordHash;

    // Fallback: Jika tidak cocok langsung & format string di DB adalah Hash Bcrypt
    if (!isPasswordValid && participant.passwordHash && participant.passwordHash.startsWith('$2')) {
      try {
        isPasswordValid = await bcrypt.compare(password, participant.passwordHash);
      } catch {
        isPasswordValid = false;
      }
    }

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Password salah.' }, 
        { status: 401 }
      );
    }

    // 3. Cek Status Verifikasi
    if (!participant.isVerified) {
      return NextResponse.json(
        { success: false, message: 'Akun belum diverifikasi. Cek email kamu untuk kode OTP.' },
        { status: 403 }
      );
    }

    // 4. Buat JWT Session Token
    const token = await createParticipantSessionToken({
      participantId: participant.id,
      username: participant.username,
      role: 'participant',
    });

    // 5. Cek jumlah pendaftaran tim
    const teamCount = await prisma.registration.count({
      where: { participantId: participant.id },
    });

    const response = NextResponse.json({
      success: true,
      message: 'Login berhasil.',
      hasTeam: teamCount > 0,
    });

    response.cookies.set(PARTICIPANT_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: PARTICIPANT_SESSION_MAX_AGE,
    });

    return response;
  } catch (error) {
    console.error('Login Participant Error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server saat mencoba terhubung.' }, 
      { status: 500 }
    );
  }
}