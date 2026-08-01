// Path: src/app/api/tournament/generate-groups/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function POST(request: Request) {
  try {
    // 1. Ambil semua pendaftar yang statusnya sudah APPROVED
    const participants = await prisma.registration.findMany({
      where: { status: 'APPROVED' },
    });

    // 🎯 VALIDASI KUOTA: 32 Tim Resmi Belovesport 2026
    if (participants.length < 32) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Pendaftar baru ada ${participants.length}. Dibutuhkan minimal 32 tim berstatus APPROVED untuk mengocok grup.` 
        },
        { status: 400 }
      );
    }

    // 2. Algoritma Fisher-Yates: Kocok urutan tim secara acak
    const shuffled = [...participants];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // 🎯 3. Inisialisasi 8 Grup (A sampai H)
    const groupNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const matchDataToCreate: Prisma.MatchCreateManyInput[] = [];

    // 4. Distribusikan 4 Player ke masing-masing Grup (8 Grup x 4 Player = 32 Player)
    for (let g = 0; g < 8; g++) {
      const groupName = groupNames[g];
      const groupPlayers = shuffled.slice(g * 4, (g * 4) + 4);

      // Kombinasi 4 tim Round Robin 2 Leg (Home & Away)
      const pairings = [
        [groupPlayers[0], groupPlayers[1]],
        [groupPlayers[2], groupPlayers[3]],
        [groupPlayers[0], groupPlayers[2]],
        [groupPlayers[1], groupPlayers[3]],
        [groupPlayers[0], groupPlayers[3]],
        [groupPlayers[1], groupPlayers[2]],
      ];

      pairings.forEach((pair, index) => {
        const [home, away] = pair;
        
        // Leg 1
        matchDataToCreate.push({
          stage: 'GROUP',
          groupName: groupName,
          roundNumber: Math.ceil((index + 1) / 2),
          matchNumber: 0, // Akan di-numbering ulang
          homeTeamId: home.id,
          awayTeamId: away.id,
          matchStatus: 'SCHEDULED',
          scheduledTime: new Date(Date.now() + (g * 600000)),
        });

        // Leg 2 (Tukar posisi Home & Away)
        matchDataToCreate.push({
          stage: 'GROUP',
          groupName: groupName,
          roundNumber: Math.ceil((index + 1) / 2) + 3,
          matchNumber: 0,
          homeTeamId: away.id,
          awayTeamId: home.id,
          matchStatus: 'SCHEDULED',
          scheduledTime: new Date(Date.now() + ((g + 1) * 600000)),
        });
      });
    }

    // 5. Bersihkan Match & Group lama sebelum generator menyuntikkan jadwal baru
    await prisma.$transaction([
      prisma.matchChat.deleteMany(),
      prisma.matchAuditLog.deleteMany(),
      prisma.match.deleteMany(),
      prisma.groupTeam.deleteMany(),
      prisma.group.deleteMany(),
      prisma.match.createMany({
        data: matchDataToCreate,
      }),
    ]);

    // 6. Penataan Nomor Urut Match Global
    const allMatches = await prisma.match.findMany({ orderBy: { id: 'asc' } });
    await prisma.$transaction(
      allMatches.map((match, idx) =>
        prisma.match.update({
          where: { id: match.id },
          data: { matchNumber: idx + 1 },
        })
      )
    );

    return NextResponse.json({
      success: true,
      message: `Sukses mengocok grup! 32 Player berhasil dibagi ke dalam 8 Grup (A-H). Total ${matchDataToCreate.length} pertandingan grup (Home & Away) dijadwalkan otomatis.`,
    }, { status: 200 });

  } catch (error) {
    console.error('Error Group Generator Engine:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menjalankan mesin generator grup internal.' },
      { status: 500 }
    );
  }
}