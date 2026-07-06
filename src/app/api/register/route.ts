// Path: src/app/api/register/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getParticipantSession } from '@/lib/participant-auth';

export async function POST(request: NextRequest) {
  try {
    // 1. Amankan Sesi Peserta (Siapa yang sedang mencoba mendaftar?)
    const session = await getParticipantSession();
    if (!session || !session.participantId) {
      return NextResponse.json(
        { error: 'Sesi tidak valid. Silakan login kembali.' },
        { status: 401 }
      );
    }

    // 2. Tarik Data Profil Asli Koko dari Database (Untuk mendapatkan email)
    const currentUser = await prisma.participant.findUnique({
      where: { id: session.participantId },
      select: { email: true }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'Akun tidak ditemukan di sistem.' }, { status: 404 });
    }

    // 3. Tangkap Payload dari Frontend (Sudah TIDAK ADA variabel email dari frontend)
    const body = await request.json();
    const {
      fullName,
      whatsappNumber,
      teamName,
      eFootballId,
      domisili,
      device,
      instagramHandle,
      paymentMethod,
      screenshotBase64,
    } = body;

    // 4. Validasi Kelengkapan Data Baru (Tanpa mengecek !email)
    if (!fullName || !whatsappNumber || !teamName || !eFootballId || !domisili || !device || !instagramHandle || !paymentMethod || !screenshotBase64) {
      return NextResponse.json(
        { error: 'Data registrasi tidak lengkap. Pastikan semua field dan bukti transfer telah diunggah.' },
        { status: 400 }
      );
    }

    const orderId = `BLV-${Date.now()}`;

    // 5. Masukkan ke Database & Ikat dengan Profil User
    // (Voucher TIDAK dibuat di sini, menunggu Admin Approve)
    const newRegistration = await prisma.registration.create({
      data: {
        teamName,
        leaderName: fullName,
        email: currentUser.email, // Menggunakan email asli yang didapat dari sesi database!
        whatsappNumber,
        efootballId: eFootballId,
        domisili,
        device,
        instagramHandle,
        paymentMethod,
        paymentProofUrl: screenshotBase64,
        status: 'PENDING',
        participantId: session.participantId, // ── IKATAN RELASI PROFIL ──
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Pendaftaran berhasil diterima. Menunggu verifikasi pembayaran oleh admin (estimasi 1x24 jam).',
        orderId,
        data: {
          id: newRegistration.id,
          teamName: newRegistration.teamName,
          status: newRegistration.status,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('API /register Error (Manual System):', error);
    return NextResponse.json({ error: 'Gagal memproses data pendaftaran di server.' }, { status: 500 });
  }
}