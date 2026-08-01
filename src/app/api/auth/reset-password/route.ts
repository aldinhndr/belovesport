// Path: src/app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { success: false, message: 'Payload data tidak valid.' },
        { status: 400 }
      );
    }

    const { email, newPassword } = body;

    // 1. Validasi Input Dasar
    if (!email || typeof email !== 'string' || !email.trim()) {
      return NextResponse.json(
        { success: false, message: 'Email wajib diisi.' },
        { status: 400 }
      );
    }

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Password baru minimal 8 karakter.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 2. Cek apakah Email Peserta terdaftar di Database
    const participant = await prisma.participant.findUnique({
      where: { email: cleanEmail },
    });

    if (!participant) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email tidak ditemukan. Pastikan email yang kamu masukkan sudah terdaftar saat signup.',
        },
        { status: 404 }
      );
    }

    // 3. Hash Password Baru
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // 4. Update Password Baru di PostgreSQL via Prisma
    await prisma.participant.update({
      where: { id: participant.id },
      data: { passwordHash },
    });

    return NextResponse.json({
      success: true,
      message: 'Password berhasil diperbarui! Silakan login menggunakan password baru kamu.',
    }, { status: 200 });

  } catch (error) {
    console.error('Direct Reset Password Error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan sistem saat memperbarui password.' },
      { status: 500 }
    );
  }
}