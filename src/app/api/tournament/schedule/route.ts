// Path: src/app/api/tournament/schedule/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/supabase/requireUser';

export async function GET(request: Request) {
  // 🛡️ PROTEKSI LAPIS KEDUA: Guard API
  // Mencegah hacker / pihak luar menarik jadwal menggunakan Postman tanpa sesi yang sah
  const { unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  try {
    // Tarik semua pertandingan dari database beserta nama timnya
    const matches = await prisma.match.findMany({
      include: {
        homeTeam: { select: { id: true, teamName: true } },
        awayTeam: { select: { id: true, teamName: true } },
      },
      orderBy: {
        scheduledTime: 'asc', // Urutkan dari jadwal terdekat
      },
    });

    return NextResponse.json({ success: true, data: matches }, { status: 200 });
  } catch (error) {
    console.error('Error Schedule Engine:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat jadwal pertandingan sirkuit.' },
      { status: 500 }
    );
  }
}