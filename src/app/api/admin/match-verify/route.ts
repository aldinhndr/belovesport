// Path: src/app/api/admin/match-verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MatchStatus, MatchStage } from '@prisma/client';

// 1. GET: Ambil semua match yang berstatus WAITING_VERIFICATION
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

// 2. POST: Approve atau Reject Laporan Skor Peserta (Mendukung Group & Knockout)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { matchId, action } = body; // action: 'APPROVE' | 'REJECT'

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
          matchStatus: MatchStatus.SCHEDULED, // Kembali ke jadwal awal
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

    if (isGroupStage) {
      // Logika Fase Grup: Hanya menghitung skor tunggal Leg 1
      if (hL1 > aL1) winnerId = match.homeTeamId;
      else if (aL1 > hL1) winnerId = match.awayTeamId;
      // Jika seri, winnerId tetap null (standar poin klasemen seri +1)
    } else {
      // Logika Fase Gugur (Knockout): Akumulasi Agregat Leg 1 + Leg 2
      const totalHome = hL1 + hL2;
      const totalAway = aL1 + aL2;

      if (totalHome > totalAway) {
        winnerId = match.homeTeamId;
      } else if (totalAway > totalHome) {
        winnerId = match.awayTeamId;
      } else {
        // Fallback jika agregat murni seri (bisa ditentukan adu penalti dll)
        winnerId = match.homeTeamId; 
      }
    }

    // UPDATE MATCH INI MENJADI COMPLETED
    await prisma.match.update({
      where: { id: matchId },
      data: {
        matchStatus: MatchStatus.COMPLETED,
        winnerId: winnerId,
      },
    });

    // ── AUTOMATION MAJU KE BAGAN BRACKET KNOCKOUT BERIKUTNYA ──
    // Karena di schema.prisma tidak ada kolom 'nextMatchId', kita hitung target id match berikutnya menggunakan matematika sirkuit
    if (!isGroupStage) {
      const currentId = match.matchNumber; // Memanfaatkan urutan nomor match sirkuit Koko
      let nextMatchNumber = 0;
      let nextStage: MatchStage = MatchStage.FINAL;

      // Kalkulasi nomor match tujuan berdasarkan rentang babak knockout
      if (currentId >= 1 && currentId <= 16) {
        nextMatchNumber = 16 + Math.ceil(currentId / 2); // Menuju 16 Besar
        nextStage = MatchStage.KNOCKOUT_16;
      } else if (currentId >= 17 && currentId <= 24) {
        nextMatchNumber = 24 + Math.ceil((currentId - 16) / 2); // Menuju Perempat Final
        nextStage = MatchStage.QUARTER_FINAL;
      } else if (currentId >= 25 && currentId <= 28) {
        nextMatchNumber = 28 + Math.ceil((currentId - 24) / 2); // Menuju Semi Final
        nextStage = MatchStage.SEMI_FINAL;
      } else if (currentId >= 29 && currentId <= 30) {
        nextMatchNumber = 31; // Menuju Grand Final murni
        nextStage = MatchStage.FINAL;
      }

      if (nextMatchNumber > 0 && winnerId) {
        // Cari match di database yang berada di stage berikutnya dengan nomor match yang cocok
        const nextMatchObj = await prisma.match.findFirst({
          where: { 
            stage: nextStage,
            matchNumber: nextMatchNumber
          },
        });

        if (nextMatchObj) {
          // Aturan: Jika nomor match asal ganjil mengisi slot Home, jika genap mengisi slot Away di match tujuan
          const isHomeSlot = currentId % 2 !== 0;

          await prisma.match.update({
            where: { id: nextMatchObj.id },
            data: isHomeSlot ? { homeTeamId: winnerId } : { awayTeamId: winnerId },
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Pertandingan berhasil diverifikasi! Sistem sirkuit otomatis diperbarui.',
    }, { status: 200 });

  } catch (error) {
    console.error('Error Verifying Match:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan sistem internal.' }, { status: 500 });
  }
}