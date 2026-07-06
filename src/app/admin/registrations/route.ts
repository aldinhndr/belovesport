import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

const VALID_STATUSES = ['PENDING', 'APPROVED', 'REJECTED'] as const;

export async function GET(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get('status');

  const isValidStatus = statusParam && VALID_STATUSES.includes(statusParam as any);

  try {
    const registrations = await prisma.registration.findMany({
      where: isValidStatus ? { status: statusParam as (typeof VALID_STATUSES)[number] } : undefined,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        teamName: true,
        leaderName: true,
        email: true,
        whatsappNumber: true,
        efootballId: true,
        domisili: true,
        device: true,
        instagramHandle: true,
        paymentMethod: true,
        paymentProofUrl: true,
        status: true,
        rejectionReason: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, data: registrations }, { status: 200 });
  } catch (error) {
    console.error('List Registrations Error:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan server.' }, { status: 500 });
  }
}