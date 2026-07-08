// Path: src/app/api/admin/match-verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MatchStatus, MatchStage } from '@prisma/client';

export async function GET() {
  try {
    const pendingMatches = await prisma.match.findMany({
      where: { matchStatus: MatchStatus.WAITING_VERIFICATION },
      include: {
        homeTeam: { select: { id: true, teamName: true } },
        awayTeam: { select: { id: true, teamName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: pendingMatches }, { status: 200 });
  } catch (error) {
    console.error('Error Fetching Pending Matches:', error);
    return NextResponse.json({ success: false, message: 'Gagal memuat data verifikasi.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { matchId, action } = body;

    if (!matchId || !action) {
      return NextResponse.json({ success: false, message: 'Data matchId dan action wajib diisi.' }, { status: 400 });
    }

    const match = await prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      return NextResponse.json({ success: false, message: 'Pertandingan tidak ditemukan.' }, { status: 404 });
    }

    // ── JIKA ADMIN MENOLAK (REJECT) LAPORAN ──
    if (action === 'REJECT') {
      await prisma.match.update({
        where: { id: matchId },
        data: {
          matchStatus: MatchStatus.SCHEDULED,
          homeScoreLeg1: null,
          awayScoreLeg1: null,
          homeScoreLeg2: null,
          awayScoreLeg2: null,
          screenshotResultUrl: null,
          reportedById: null
        },
      });
      return NextResponse.json({ success: true, message: 'Laporan skor ditolak. Status dikembalikan ke SCHEDULED.' });
    }

    // ── JIKA ADMIN MENYETUJUI (APPROVE) LAPORAN ──
    const hL1 = match.homeScoreLeg1 ?? 0;
    const aL1 = match.awayScoreLeg1 ?? 0;
    const hL2 = match.homeScoreLeg2 ?? 0;
    const aL2 = match.awayScoreLeg2 ?? 0;

    let winnerId: string | null = null;
    const isGroupStage = match.stage === MatchStage.GROUP;

    // Hitung Pemenang Pertandingan
    if (isGroupStage) {
      if (hL1 > aL1) winnerId = match.homeTeamId;
      else if (aL1 > hL1) winnerId = match.awayTeamId;
    } else {
      const totalHome = hL1 + hL2;
      const totalAway = aL1 + aL2;
      if (totalHome > totalAway) winnerId = match.homeTeamId;
      else if (totalAway > totalHome) winnerId = match.awayTeamId;
      else winnerId = match.homeTeamId; // Fallback agregat seri murni
    }

    // 🎯 ATOMIC TRANSACTION ENGINE: Eksekusi seluruh mutasi sekaligus secara aman
    await prisma.$transaction(async (tx) => {
      
      // 1. Kunci status match saat ini menjadi COMPLETED
      await tx.match.update({
        where: { id: matchId },
        data: {
          matchStatus: MatchStatus.COMPLETED,
          winnerId: winnerId,
        },
      });

      // 2. JIKA FASE GRUP: Hitung dan suntik poin klasemen ke tabel group_teams secara berkala
      if (isGroupStage && match.groupName && match.homeTeamId && match.awayTeamId) {
        
        // Cari baris induk group di DB untuk mendapatkan groupId asli
        const targetGroup = await (tx as any)['group'].findUnique({
          where: { groupName: match.groupName }
        });

        if (targetGroup) {
          // Tentukan distribusi alokasi matematika poin tanding
          const homeWon = hL1 > aL1 ? 1 : 0;
          const homeDraw = hL1 === aL1 ? 1 : 0;
          const homeLost = hL1 < aL1 ? 1 : 0;
          const homePoints = homeWon * 3 + homeDraw * 1;

          const awayWon = aL1 > hL1 ? 1 : 0;
          const awayDraw = aL1 === hL1 ? 1 : 0;
          const awayLost = aL1 < hL1 ? 1 : 0;
          const awayPoints = awayWon * 3 + awayDraw * 1;

          // A. Mutasi live update stat tim HOME menggunakan operator increment database atomik
          await (tx as any)['groupTeam'].update({
            where: {
              groupId_teamId: { groupId: targetGroup.id, teamId: match.homeTeamId }
            },
            data: {
              played: { increment: 1 },
              won: { increment: homeWon },
              drawn: { increment: homeDraw },
              lost: { increment: homeLost },
              goalsFor: { increment: hL1 },
              goalsAgainst: { increment: aL1 },
              goalDifference: { increment: hL1 - aL1 },
              points: { increment: homePoints }
            }
          });

          // B. Mutasi live update stat tim AWAY menggunakan operator increment database atomik
          await (tx as any)['groupTeam'].update({
            where: {
              groupId_teamId: { groupId: targetGroup.id, teamId: match.awayTeamId }
            },
            data: {
              played: { increment: 1 },
              won: { increment: awayWon },
              drawn: { increment: awayDraw },
              lost: { increment: awayLost },
              goalsFor: { increment: aL1 },
              goalsAgainst: { increment: hL1 },
              goalDifference: { increment: aL1 - hL1 },
              points: { increment: awayPoints }
            }
          });
        }
      }

      // 3. JIKA FASE GUGUR: Jalankan otomatisasi sirkuit lompatan bagan bracket berikutnya
      if (!isGroupStage && winnerId) {
        const currentId = match.matchNumber;
        let nextMatchNumber = 0;
        let nextStage: MatchStage = MatchStage.FINAL;

        if (currentId >= 1 && currentId <= 16) {
          nextMatchNumber = 16 + Math.ceil(currentId / 2);
          nextStage = MatchStage.KNOCKOUT_16;
        } else if (currentId >= 17 && currentId <= 24) {
          nextMatchNumber = 24 + Math.ceil((currentId - 16) / 2);
          nextStage = MatchStage.QUARTER_FINAL;
        } else if (currentId >= 25 && currentId <= 28) {
          nextMatchNumber = 28 + Math.ceil((currentId - 24) / 2);
          nextStage = MatchStage.SEMI_FINAL;
        } else if (currentId >= 29 && currentId <= 30) {
          nextMatchNumber = 31;
          nextStage = MatchStage.FINAL;
        }

        if (nextMatchNumber > 0) {
          const nextMatchObj = await tx.match.findFirst({
            where: { 
              stage: nextStage,
              matchNumber: nextMatchNumber
            },
          });

          if (nextMatchObj) {
            const isHomeSlot = currentId % 2 !== 0;
            await tx.match.update({
              where: { id: nextMatchObj.id },
              data: isHomeSlot ? { homeTeamId: winnerId } : { awayTeamId: winnerId },
            });
          }
        }
      }

    }, {
      timeout: 15000 // Jatah waktu 15 detik eksekusi agar terhindar dari kendala kedaluwarsa koneksi
    });

    return NextResponse.json({
      success: true,
      message: 'Pertandingan berhasil diverifikasi! Papan skor klasemen live sirkuit resmi diperbarui.',
    }, { status: 200 });

  } catch (error) {
    console.error('Error Verifying Match:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan sistem internal.' }, { status: 500 });
  }
}