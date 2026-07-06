// Path file: src/app/api/admin/registrations/[id]/reject/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Wajib await params di Next.js terbaru
    const resolvedParams = await params;
    const registrationId = resolvedParams.id;

    // 2. Tangkap Alasan Penolakan dari Body Request
    const body = await request.json();
    const { rejectionReason } = body;

    if (!rejectionReason || rejectionReason.trim() === '') {
      return NextResponse.json(
        { success: false, message: 'Alasan penolakan wajib diisi agar peserta tahu kesalahannya.' },
        { status: 400 }
      );
    }

    // 3. Validasi Keberadaan Data
    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
    });

    if (!registration) {
      return NextResponse.json(
        { success: false, message: 'Data pendaftaran tidak ditemukan.' },
        { status: 404 }
      );
    }

    if (registration.status === 'REJECTED') {
      return NextResponse.json(
        { success: false, message: 'Pendaftaran ini sudah berstatus DITOLAK.' },
        { status: 400 }
      );
    }

    // 4. Eksekusi Penolakan (Update Status & Rejection Reason)
    const updatedReg = await prisma.registration.update({
      where: { id: registrationId },
      data: { 
        status: 'REJECTED',
        rejectionReason: rejectionReason 
      },
    });

    return NextResponse.json({
      success: true,
      message: `Pendaftaran tim ${updatedReg.teamName} resmi ditolak.`,
      data: updatedReg,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Admin Reject API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan internal server saat menolak pendaftaran.' },
      { status: 500 }
    );
  }
}