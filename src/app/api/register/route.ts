import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const JWT_SECRET = process.env.JWT_SECRET || 'belovesport-secret-key-2026';

export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Username, email, dan password wajib diisi.' },
        { status: 400 }
      );
    }

    // 1. Cek Spesifik Duplikasi Email
    const existingEmail = await prisma.participant.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return NextResponse.json(
        { success: false, message: 'Email ini sudah terdaftar. Silakan langsung login.' },
        { status: 400 }
      );
    }

    // 2. Cek Spesifik Duplikasi Username
    const existingUsername = await prisma.participant.findFirst({
      where: { username },
    });

    if (existingUsername) {
      return NextResponse.json(
        { success: false, message: 'Username/Nickname sudah terpakai. Pilih username lain.' },
        { status: 400 }
      );
    }

    // 3. Buat Account Baru (Langsung isVerified: true, tanpa panggil Resend OTP)
    const newParticipant = await prisma.participant.create({
      data: {
        username,
        email,
        passwordHash: password,
        isVerified: true,
      },
    });

    // 4. Generate Token Cookie Session
    const token = jwt.sign(
      {
        id: newParticipant.id,
        email: newParticipant.email,
        username: newParticipant.username,
        role: 'PARTICIPANT',
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const response = NextResponse.json({
      success: true,
      message: 'Registrasi berhasil dan langsung login.',
      data: {
        id: newParticipant.id,
        username: newParticipant.username,
        email: newParticipant.email,
      },
    });

    response.cookies.set('participant_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Register Error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan sistem.' },
      { status: 500 }
    );
  }
}