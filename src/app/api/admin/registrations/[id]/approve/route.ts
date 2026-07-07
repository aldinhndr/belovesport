// Path file: src/app/api/admin/registrations/[id]/approve/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
// Import fungsi notifikasi WhatsApp Fonnte yang sudah kita buat
import { sendWaNotification } from '@/lib/whatsapp';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Ambil ID registrasi langsung dari parameter URL dinamis Next.js
    const { id: registrationId } = await params;

    // 1. Validasi Keberadaan Data Registrasi
    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
    });

    if (!registration) {
      return NextResponse.json(
        { success: false, message: 'Data pendaftaran tidak ditemukan.' },
        { status: 404 }
      );
    }

    // Keamanan Ganda: Jika sudah APPROVED, jangan diproses lagi
    if (registration.status === 'APPROVED') {
      return NextResponse.json(
        { success: false, message: 'Pendaftaran tim ini sudah disetujui sebelumnya.' },
        { status: 400 }
      );
    }

    // 2. Eksekusi Sistem Transaksi Database (Prisma ACID Transaction)
    const result = await prisma.$transaction(async (tx) => {
      // Langkah A: Kunci dan update status pendaftaran menjadi APPROVED
      const updatedReg = await tx.registration.update({
        where: { id: registrationId },
        data: { status: 'APPROVED' },
      });

      // Langkah B: Generate string acak unik 6 karakter untuk kode voucher
      const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
      const generatedVoucherCode = `BEL-${randomString}`;

      // Langkah C: Buat data voucher baru yang mengikat mati ke registrationId ini
      const newVoucher = await tx.voucher.create({
        data: {
          voucherCode: generatedVoucherCode,
          registrationId: registrationId,
        },
      });

      return { updatedReg, newVoucher };
    });

    // 3. EKSKUSI OTOMATISASI NOTIFIKASI WA FONNTE
    // Dijalankan secara non-blocking agar dashboard admin tetap terasa responsif
    sendWaNotification(
      result.updatedReg.whatsappNumber, // Sesuai dengan kolom whatsappNumber di schema Koko!
      result.updatedReg.teamName,
      result.newVoucher.voucherCode,
      result.updatedReg.leaderName,
      result.updatedReg.email
    );

    // 4. Kembalikan Response Sukses ke Dashboard Admin Frontend
    return NextResponse.json({
      success: true,
      message: `Pendaftaran tim ${result.updatedReg.teamName} berhasil disetujui. Voucher ${result.newVoucher.voucherCode} telah diterbitkan dan dikirim ke WhatsApp!`,
      data: {
        registrationId: result.updatedReg.id,
        teamName: result.updatedReg.teamName,
        status: result.updatedReg.status,
        voucherCode: result.newVoucher.voucherCode
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error('Admin Approve API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan internal server saat menyetujui pendaftaran.' },
      { status: 500 }
    );
  }
}