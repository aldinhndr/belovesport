// Path: src/app/api/tournament/bracket/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getParticipantSession } from '@/lib/participant-auth';

export async function GET() {
  // 🛡️ Proteksi Sesi Participant
  const session = await getParticipantSession();
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Tarik seluruh pertandingan fase Knockout dari database
    const dbMatches = await prisma.match.findMany({
      where: {
        stage: {
          not: 'GROUP'
        }
      },
      include: {
        homeTeam: true,
        awayTeam: true
      },
      orderBy: {
        matchNumber: 'asc'
      }
    });

    // 2. Map ke format komponen Bracket Node Visualizer
    const formattedMatches = dbMatches.map((match: any) => {
      
      const hL1 = match.homeScoreLeg1 ?? 0;
      const aL1 = match.awayScoreLeg1 ?? 0;
      const hL2 = match.homeScoreLeg2 ?? 0;
      const aL2 = match.awayScoreLeg2 ?? 0;

      const totalHome = hL1 + hL2;
      const totalAway = aL1 + aL2;

      const isCompleted = match.matchStatus === 'COMPLETED';
      const isFinal = match.stage === 'FINAL';

      // Tampilan skor: Jika Grand Final (1 Leg Murni), tampilkan skor murni Leg 1
      let homeDisplayScore: string | undefined = undefined;
      let awayDisplayScore: string | undefined = undefined;

      if (match.homeScoreLeg1 !== null && match.homeScoreLeg1 !== undefined) {
        if (isFinal) {
          homeDisplayScore = String(hL1);
          awayDisplayScore = String(aL1);
        } else if (match.homeScoreLeg2 !== null && match.homeScoreLeg2 !== undefined) {
          homeDisplayScore = `${totalHome} (${hL1}-${hL2})`;
          awayDisplayScore = `${totalAway} (${aL1}-${aL2})`;
        } else {
          homeDisplayScore = String(hL1);
          awayDisplayScore = String(aL1);
        }
      }

      // Penomoran Ronde untuk 32-Tim (Dimulai dari Round of 16 / KNOCKOUT_16)
      const stageLabels: Record<string, string> = {
        KNOCKOUT_16: '1',   // Babak 16 Besar (16 Tim -> 8 Match)
        QUARTER_FINAL: '2', // Perempat Final (8 Tim -> 4 Match)
        SEMI_FINAL: '3',    // Semi Final (4 Tim -> 2 Match)
        FINAL: '4',         // Grand Final (2 Tim -> 1 Match Murni)
      };

      return {
        id: match.id,
        name: isFinal ? 'Grand Final (1 Leg)' : `Babak ${match.stage.replace('KNOCKOUT_', '')}`,
        nextMatchId: (match as any).nextMatchId || null,
        tournamentRoundText: stageLabels[match.stage] || '1',
        startTime: match.matchStatus === 'COMPLETED' ? 'Selesai' : match.matchStatus === 'WAITING_VERIFICATION' ? 'VERIFIKASI' : 'SCHEDULED',
        state: match.matchStatus === 'COMPLETED' ? 'DONE' : 'SCHEDULED',
        participants: [
          {
            id: match.homeTeamId ?? `placeholder-home-${match.id}`,
            name: match.homeTeam?.teamName ?? 'TBD',
            resultText: homeDisplayScore,
            isWinner: isCompleted && match.winnerId === match.homeTeamId,
            status: isCompleted ? 'PLAYED' : null
          },
          {
            id: match.awayTeamId ?? `placeholder-away-${match.id}`,
            name: match.awayTeam?.teamName ?? 'TBD',
            resultText: awayDisplayScore,
            isWinner: isCompleted && match.winnerId === match.awayTeamId,
            status: isCompleted ? 'PLAYED' : null
          }
        ]
      };
    });

    return NextResponse.json({ success: true, data: formattedMatches }, { status: 200 });

  } catch (error) {
    console.error('Bracket Sync Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menyelaraskan data bagan sirkuit dari database.' },
      { status: 500 }
    );
  }
}