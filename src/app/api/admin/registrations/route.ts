// Path file: src/app/api/admin/registrations/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { RegistrationStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const validStatuses = ['PENDING', 'APPROVED', 'REJECTED'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: `Status tidak valid.` },
        { status: 400 }
      );
    }

    const whereClause: any = {};
    if (status) {
      whereClause.status = status as RegistrationStatus;
    }
    if (search) {
      whereClause.OR = [
        { teamName: { contains: search, mode: 'insensitive' } },
        { leaderName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const registrations = await prisma.registration.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        vouchers: true,
      },
    });

    // FIX SERIALIZATION BUG: Ubah tipe data BigInt di dalam array vouchers menjadi string biasa
    const safeRegistrations = registrations.map((reg) => ({
      ...reg,
      vouchers: reg.vouchers.map((v) => ({
        ...v,
        id: v.id.toString(), // Konversi BigInt ke String sebelum dibungkus ke JSON
      })),
    }));

    return NextResponse.json({
      success: true,
      count: safeRegistrations.length,
      data: safeRegistrations,
    });

  } catch (error: any) {
    console.error('Get Registrations API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan internal server.' },
      { status: 500 }
    );
  }
}