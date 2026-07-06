// Path: src/app/api/tournament/match-action/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/supabase/requireUser';

export async function POST(request: Request) {
    // 🛡️ 1. Pastikan user sudah login
    const { user, unauthorized } = await requireUser();
    if (unauthorized || !user) return unauthorized;

    try {
        const body = await request.json();
        const { matchId, homeScoreLeg1, awayScoreLeg1, homeScoreLeg2, awayScoreLeg2, screenshotBase64 } = body;

        // Validasi payload dasar
        if (!matchId || homeScoreLeg1 === undefined || isNaN(homeScoreLeg1) || awayScoreLeg1 === undefined || isNaN(awayScoreLeg1) || !screenshotBase64) {
            return NextResponse.json({ success: false, message: 'Data skor tidak valid atau bukti screenshot kosong.' }, { status: 400 });
        }

        // 2. Tarik data pertandingan beserta data timnya
        const match = await prisma.match.findUnique({
            where: { id: matchId },
            include: { homeTeam: true, awayTeam: true }
        });

        if (!match) {
            return NextResponse.json({ success: false, message: 'Pertandingan tidak ditemukan.' }, { status: 404 });
        }

        // 🛡️ 3. OTORISASI KETAT: Cek apakah ID User sama dengan ID Pemilik Tim Home atau Away
        const isHomeOwner = match.homeTeam?.participantId === user.id;
        const isAwayOwner = match.awayTeam?.participantId === user.id;

        if (!isHomeOwner && !isAwayOwner) {
            return NextResponse.json(
                { success: false, message: 'AKSES DITOLAK: Anda tidak memiliki wewenang melaporkan skor di pertandingan ini.' },
                { status: 403 }
            );
        }

        // 4. Jika lolos, simpan data dan ubah status menjadi Menunggu Verifikasi
        await prisma.match.update({
            where: { id: matchId },
            data: {
                homeScoreLeg1,
                awayScoreLeg1,
                homeScoreLeg2: homeScoreLeg2 ?? null,
                awayScoreLeg2: awayScoreLeg2 ?? null,
                screenshotResultUrl: screenshotBase64, // Menyimpan gambar Base64 sebagai bukti (Tipe text di Prisma)
                matchStatus: 'WAITING_VERIFICATION',
                reportedById: user.id
            }
        });

        return NextResponse.json({ success: true, message: 'Laporan berhasil dikirim. Menunggu verifikasi Admin.' });
    } catch (error: any) {
        console.error('Match Action API Error:', error);
        return NextResponse.json({ success: false, message: 'Terjadi kesalahan sistem internal saat menyimpan laporan.' }, { status: 500 });
    }
}