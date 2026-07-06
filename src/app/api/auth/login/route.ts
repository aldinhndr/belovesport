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

    // 🚀 ENGINE OPTIMIZATION: Kueri pencarian akun di Supabase Pooler
    const participant = await prisma.participant.findFirst({
      where: { 
        OR: [
          { username: identifier.trim() }, 
          { email: identifier.trim().toLowerCase() }
        ] 
      },
    });

    // 🛠️ FIX SINTAKSIS: Menghapus kurung kurawal bocor di ujung baris lama
    if (!participant) {
      return NextResponse.json(
        { success: false, message: 'Akun tidak ditemukan.' }, 
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, participant.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Password salah.' }, 
        { status: 401 }
      );
    }

    if (!participant.isVerified) {
      return NextResponse.json(
        { success: false, message: 'Akun belum diverifikasi. Cek email kamu untuk kode OTP.' },
        { status: 403 }
      );
    }

    const token = await createParticipantSessionToken({
      participantId: participant.id,
      username: participant.username,
      role: 'participant',
    });

    // Cek jumlah pendaftaran tim untuk menentukan arah navigasi frontend
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