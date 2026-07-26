// Path: src/app/api/participant/update-profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma'; // Gunakan instance prisma terpusat agar koneksi stabil

const JWT_SECRET = process.env.JWT_SECRET || 'belovesport-secret-key-2026';

interface JwtPayloadCustom {
  id?: string;
  participantId?: string;
  userId?: string;
  sub?: string;
  email?: string;
}

export async function PUT(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('participant_session')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Sesi tidak ditemukan, silakan login.' },
        { status: 401 }
      );
    }

    // Decode token JWT
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayloadCustom;

    // Ambil ID peserta secara fleksibel dari berbagai standar payload JWT
    const participantId = decoded.id || decoded.participantId || decoded.userId || decoded.sub;

    if (!participantId) {
      return NextResponse.json(
        { success: false, message: 'Sesi tidak valid. Silakan login kembali.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { username, currentPassword, newPassword } = body;

    // Cari participant berdasarkan ID yang terverifikasi
    const participant = await prisma.participant.findUnique({
      where: { id: participantId },
    });

    if (!participant) {
      return NextResponse.json(
        { success: false, message: 'Peserta tidak ditemukan.' },
        { status: 404 }
      );
    }

    const updateData: { username?: string; passwordHash?: string } = {};

    if (username) {
      updateData.username = username;
    }

    // Logic Ubah Password
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { success: false, message: 'Password saat ini wajib diisi untuk mengubah password.' },
          { status: 400 }
        );
      }

      // 1. Verifikasi Password Lama (Mendukung Hashing Bcrypt & Fallback String Direct)
      let isCurrentValid = false;
      if (participant.passwordHash.startsWith('$2a$') || participant.passwordHash.startsWith('$2b$')) {
        isCurrentValid = await bcrypt.compare(currentPassword, participant.passwordHash);
      } else {
        isCurrentValid = participant.passwordHash === currentPassword;
      }

      if (!isCurrentValid) {
        return NextResponse.json(
          { success: false, message: 'Password saat ini salah.' },
          { status: 400 }
        );
      }

      // 2. Hash Password Baru dengan Bcrypt
      updateData.passwordHash = await bcrypt.hash(newPassword, 12);
    }

    // Eksekusi Update Data
    await prisma.participant.update({
      where: { id: participantId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: 'Profil dan password berhasil diperbarui!',
    });
  } catch (error) {
    console.error('Error updating participant profile:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan sistem saat memperbarui profil.' },
      { status: 500 }
    );
  }
}