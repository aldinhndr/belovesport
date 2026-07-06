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

  // Await params sesuai standar Next.js 15
  const { id } = await params;

  try {
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

    // Update status registrasi menjadi APPROVED
    const updated = await prisma.registration.update({
      where: { id },
      data: { status: 'APPROVED' },
    });

    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (error) {
    console.error('Approve Registration Error:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan server.' }, { status: 500 });
  }
}