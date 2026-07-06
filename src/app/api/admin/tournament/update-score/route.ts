// Path: src/app/api/admin/tournament/update-score/route.ts
import { NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma'; // Hubungkan ke Prisma jika migrasi push sudah siap

export async function PUT(request: Request) {
  try {
    const { matchId, score1, score2, isDone } = await request.json();

    if (!matchId || score1 === undefined || score2 === undefined) {
      return NextResponse.json(
        { success: false, message: 'ID Pertandingan dan Skor wajib diisi.' },
        { status: 400 }
      );
    }

    // Kalkulasi logika penentuan pemenang otomatis
    const s1 = parseInt(score1);
    const s2 = parseInt(score2);
    const team1IsWinner = isDone ? s1 > s2 : false;
    const team2IsWinner = isDone ? s2 > s1 : false;

    // LOGIKA UPDATE PRISMA DATABASE
    // const updatedMatch = await prisma.match.update({
    //   where: { id: Number(matchId) },
    //   data: {
    //     team1Score: score1.toString(),
    //     team2Score: score2.toString(),
    //     team1IsWinner,
    //     team2IsWinner,
    //     state: isDone ? 'DONE' : 'LIVE',
    //     startTime: isDone ? 'Selesai' : 'LIVE'
    //   }
    // });

    return NextResponse.json({
      success: true,
      message: `Skor Match #${matchId} berhasil diperbarui! status: ${isDone ? 'Selesai' : 'Live'}.`,
    }, { status: 200 });

  } catch (error) {
    console.error('Error Admin Update Score:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui skor di server internal.' },
      { status: 500 }
    );
  }
}