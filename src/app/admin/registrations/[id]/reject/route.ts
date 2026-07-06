import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const reason = typeof body?.reason === 'string' ? body.reason : 'Tidak ada alasan yang diberikan.';

    const registration = await prisma.registration.findUnique({ where: { id } });

    if (!registration) {
      return NextResponse.json({ success: false, message: 'Registrasi tidak ditemukan.' }, { status: 404 });
    }
    if (registration.status !== 'PENDING') {
      return NextResponse.json(
        { success: false, message: 'Registrasi ini sudah pernah diproses sebelumnya.' },
        { status: 409 }
      );
    }

    const updated = await prisma.registration.update({
      where: { id },
      data: { status: 'REJECTED', rejectionReason: reason },
    });

    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (error) {
    console.error('Reject Registration Error:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan server.' }, { status: 500 });
  }
}