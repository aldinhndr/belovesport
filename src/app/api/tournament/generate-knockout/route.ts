// Path: src/app/api/tournament/generate-knockout/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function POST(request: Request) {
  try {
    // 1. Ambil semua match fase grup yang statusnya COMPLETED
    const groupMatches = await prisma.match.findMany({
      where: { stage: 'GROUP', matchStatus: 'COMPLETED' },
      include: { homeTeam: true, awayTeam: true },
    });

    // Periksa apakah pertandingan grup sudah jalan. 
    // Total match untuk 16 grup @ 6 pertandingan adalah 96 matches.
    if (groupMatches.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Belum ada data pertandingan grup yang selesai untuk dikalkulasi.' },
        { status: 400 }
      );
    }

    // 2. Kalkulasi Klasemen Internal untuk mencari Top 2 dari setiap Grup
    const groupStandings: Record<string, Record<string, any>> = {};

    groupMatches.forEach((match) => {
      const gName = match.groupName || 'UNKNOWN';
      if (!groupStandings[gName]) groupStandings[gName] = {};

      [match.homeTeamId, match.awayTeamId].forEach((id) => {
        if (id && !groupStandings[gName][id]) {
          const isHome = id === match.homeTeamId;
          groupStandings[gName][id] = {
            id,
            name: isHome ? match.homeTeam?.teamName : match.awayTeam?.teamName,
            poin: 0, gd: 0, gm: 0
          };
        }
      });

      if (match.homeTeamId && match.awayTeamId) {
        const hScore = match.homeScoreLeg1 ?? 0;
        const aScore = match.awayScoreLeg1 ?? 0;
        const pHome = groupStandings[gName][match.homeTeamId];
        const pAway = groupStandings[gName][match.awayTeamId];

        pHome.gm += hScore;
        pAway.gm += aScore;
        pHome.gd += (hScore - aScore);
        pAway.gd += (aScore - hScore);

        if (hScore > aScore) pHome.poin += 3;
        else if (aScore > hScore) pAway.poin += 3;
        else {
          pHome.poin += 1;
          pAway.poin += 1;
        }
      }
    });

    // 3. Ekstrak Juara (Rank 1) & Runner-up (Rank 2) dari Grup A sampai P
    const qualifiedTeams: Record<string, { rank1: string; rank2: string }> = {};
    
    Object.keys(groupStandings).forEach((gName) => {
      const sorted = Object.values(groupStandings[gName]).sort((a, b) => {
        if (b.poin !== a.poin) return b.poin - a.poin;
        if (b.gd !== a.gd) return b.gd - a.gd;
        return b.gm - a.gm; // Tie-breaker ke-3: Produktivitas Gol (GM)
      });

      if (sorted.length >= 2) {
        qualifiedTeams[gName] = {
          rank1: sorted[0].id,
          rank2: sorted[1].id
        };
      }
    });

    // Pastikan seluruh 16 grup telah memiliki perwakilan kelulusan
    const groupKeys = Object.keys(qualifiedTeams);
    if (groupKeys.length < 16) {
      return NextResponse.json(
        { success: false, message: `Baru ${groupKeys.length}/16 grup yang menyelesaikan pertandingan secara lengkap.` },
        { status: 400 }
      );
    }

    // 4. Struktur Pasangan Silang Babak 32 Besar (Knockout Stage)
    // Contoh Format: Juara Grup A vs Runner-up Grup B, Juara Grup B vs Runner-up Grup A, dst.
    const groupPairs = [
      { hGrup: 'A', aGrup: 'B' }, { hGrup: 'B', aGrup: 'A' },
      { hGrup: 'C', aGrup: 'D' }, { hGrup: 'D', aGrup: 'C' },
      { hGrup: 'E', aGrup: 'F' }, { hGrup: 'F', aGrup: 'E' },
      { hGrup: 'G', aGrup: 'H' }, { hGrup: 'H', aGrup: 'G' },
      { hGrup: 'I', aGrup: 'J' }, { hGrup: 'J', aGrup: 'I' },
      { hGrup: 'K', aGrup: 'L' }, { hGrup: 'L', aGrup: 'K' },
      { hGrup: 'M', aGrup: 'N' }, { hGrup: 'N', aGrup: 'M' },
      { hGrup: 'O', aGrup: 'P' }, { hGrup: 'P', aGrup: 'O' },
    ];

    const knockoutMatchesToCreate: Prisma.MatchCreateManyInput[] = [];

    // Lakukan mapping pembentukan 16 baris match baru untuk babak 32 besar
    groupPairs.forEach((pair, idx) => {
      const homeTeamId = qualifiedTeams[pair.hGrup]?.rank1; // Juara grup asal
      const awayTeamId = qualifiedTeams[pair.aGrup]?.rank2; // Runner-up grup lawan

      knockoutMatchesToCreate.push({
        stage: 'ROUND_OF_32',
        matchNumber: idx + 1,
        roundNumber: 1,
        homeTeamId,
        awayTeamId,
        matchStatus: 'SCHEDULED',
        // Mengosongkan skor & relasi bagan selanjutnya agar siap diisi dinamis oleh admin verify
        homeScoreLeg1: null,
        awayScoreLeg1: null,
        homeScoreLeg2: null,
        awayScoreLeg2: null,
      });
    });

    // 5. Eksekusi Bulk Insert ke database
    await prisma.$transaction([
      prisma.match.createMany({
        data: knockoutMatchesToCreate
      })
    ]);

    return NextResponse.json({
      success: true,
      message: `Sukses menutup Fase Grup! 32 Tim terbaik berhasil disilangkan ke Babak Knockout. ${knockoutMatchesToCreate.length} pertandingan baru telah dijadwalkan.`
    }, { status: 200 });

  } catch (error) {
    console.error('Error Knockout Generator Engine:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memproses transisi ke babak gugur.' },
      { status: 500 }
    );
  }
}