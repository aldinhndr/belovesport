// Path: src/app/api/tournament/bracket/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getParticipantSession } from '@/lib/participant-auth'; // 🛡️ MENGGUNAKAN AUTH LOKAL KOKO

export async function GET() {
  // 🛡️ PROTEKSI LAPIS KEDUA: Guard API Lokal
  const session = await getParticipantSession();
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Tarik seluruh pertandingan fase Knockout dari database secara riil
    const dbMatches = await prisma.match.findMany({
      where: {
        stage: {
          not: 'GROUP' // Filter hanya untuk merender bagan babak gugur (Knockout)
        }
      },
      include: {
        homeTeam: true,
        awayTeam: true
      },
      orderBy: {
        matchNumber: 'asc' // Diurutkan berdasarkan nomor pertandingan agar struktur urutannya konsisten
      }
    });

    // 2. Transformasikan data database Prisma ke struktur node-edge @g-loot
    const formattedMatches = dbMatches.map((match: any) => {
      
      const hL1 = match.homeScoreLeg1 ?? 0; //[cite: 5]
      const aL1 = match.awayScoreLeg1 ?? 0; //[cite: 5]
      const hL2 = match.homeScoreLeg2 ?? 0; //[cite: 5]
      const aL2 = match.awayScoreLeg2 ?? 0; //[cite: 5]

      // Hitung akumulasi Agregat otomatis[cite: 5]
      const totalHome = hL1 + hL2; //[cite: 5]
      const totalAway = aL1 + aL2; //[cite: 5]

      const isCompleted = match.matchStatus === 'COMPLETED'; //[cite: 5]

      // Format string skor untuk ditampilkan di box bagan[cite: 5]
      let homeDisplayScore = match.homeScoreLeg1 !== null && match.homeScoreLeg1 !== undefined ? String(match.homeScoreLeg1) : undefined; //[cite: 5]
      let awayDisplayScore = match.awayScoreLeg1 !== null && match.awayScoreLeg1 !== undefined ? String(match.awayScoreLeg1) : undefined; //[cite: 5]

      // Jika ada Leg 2, tampilkan akumulasi total agregatnya[cite: 5]
      if (match.homeScoreLeg2 !== null && match.awayScoreLeg2 !== null && match.homeScoreLeg2 !== undefined) {
        homeDisplayScore = `${totalHome} (${hL1}-${hL2})`; //[cite: 5]
        awayDisplayScore = `${totalAway} (${aL1}-${aL2})`; //[cite: 5]
      }

      // Menentukan teks ronde berdasarkan status stage
      const stageLabels: Record<string, string> = {
        KNOCKOUT_32: '1',
        KNOCKOUT_16: '2',
        QUARTER_FINAL: '3',
        SEMI_FINAL: '4',
        FINAL: '5',
        THIRD_PLACE: '5'
      };

      return {
        id: match.id, //[cite: 5]
        name: match.stage === 'FINAL' ? 'Grand Final' : `Babak ${match.stage.replace('KNOCKOUT_', '')}`, //[cite: 5]
        nextMatchId: match.nextMatchId || null, //[cite: 5]
        tournamentRoundText: stageLabels[match.stage] || '1', // Konversi string stage ke nomor urut ronde untuk engine @g-loot
        startTime: match.matchStatus === 'COMPLETED' ? 'Selesai' : match.matchStatus === 'WAITING_VERIFICATION' ? 'VERIFIKASI' : 'LIVE / SCHEDULED', //[cite: 5]
        state: match.matchStatus === 'COMPLETED' ? 'DONE' : 'SCHEDULED', //[cite: 5]
        participants: [
          {
            id: match.homeTeamId ?? `placeholder-home-${match.id}`, //[cite: 5]
            name: match.homeTeam?.teamName ?? 'To Be Decided', //[cite: 5]
            resultText: homeDisplayScore, //[cite: 5]
            isWinner: isCompleted && match.winnerId === match.homeTeamId, //[cite: 5]
            status: isCompleted ? 'PLAYED' : null //[cite: 5]
          },
          {
            id: match.awayTeamId ?? `placeholder-away-${match.id}`, //[cite: 5]
            name: match.awayTeam?.teamName ?? 'To Be Decided', //[cite: 5]
            resultText: awayDisplayScore, //[cite: 5]
            isWinner: isCompleted && match.winnerId === match.awayTeamId, //[cite: 5]
            status: isCompleted ? 'PLAYED' : null //[cite: 5]
          }
        ]
      };
    });

    return NextResponse.json({ success: true, data: formattedMatches }, { status: 200 }); //[cite: 5]

  } catch (error) {
    console.error('Prisma Bracket Sync Error:', error); //[cite: 5]
    return NextResponse.json(
      { success: false, message: 'Gagal menyelaraskan data sirkuit dari database.' }, //[cite: 5]
      { status: 500 }
    );
  }
}