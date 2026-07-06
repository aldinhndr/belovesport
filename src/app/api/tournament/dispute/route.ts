// Path: src/app/api/tournament/dispute/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getParticipantSession } from '@/lib/participant-auth';

export async function POST(request: Request) {
    const session = await getParticipantSession();
    if (!session) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { matchId, reason, evidenceUrl } = body;

        if (!matchId || !reason) {
            return NextResponse.json({ success: false, message: 'Match ID dan alasan sengketa wajib diisi.' }, { status: 400 });
        }

        // 1. Validasi apakah match tersebut memang melibatkan tim dari participant ini
        const myRegistrations = await prisma.registration.findMany({
            where: { participantId: session.participantId },
            select: { id: true }
        });
        const myTeamIds = myRegistrations.map(r => r.id);

        const targetMatch = await prisma.match.findUnique({
            where: { id: matchId }
        });

        if (!targetMatch) {
            return NextResponse.json({ success: false, message: 'Pertandingan tidak ditemukan.' }, { status: 404 });
        }

        const isParticipantMatch = myTeamIds.includes(targetMatch.homeTeamId || '') || myTeamIds.includes(targetMatch.awayTeamId || '');
        if (!isParticipantMatch) {
            return NextResponse.json({ success: false, message: 'Koko tidak memiliki hak atas pertandingan ini.' }, { status: 403 });
        }

        // 2. Update status pertandingan menjadi WAITING_VERIFICATION dengan catatan sengketa
        // Menggunakan reportedById sebagai penanda siapa yang menaikkan tiket sengketa
        await prisma.match.update({
            where: { id: matchId },
            data: {
                matchStatus: 'WAITING_VERIFICATION', // Admin akan meninjau langsung
                reportedById: session.participantId,
                screenshotResultUrl: evidenceUrl || targetMatch.screenshotResultUrl,
                // Kita manfaatkan field pendukung atau log chat untuk detailnya
            }
        });

        // 3. Otomatis kirim pesan sistem ke MatchChat sebagai rekaman riwayat sengketa
        await prisma.matchChat.create({
            data: {
                matchId: matchId,
                senderId: 'SYSTEM',
                senderName: 'SISTEM SIRKUIT',
                message: `⚠️ PERTANDINGAN INI TELAH DIAJUKAN SENGKETA/KOMPLAIN oleh Manager. Alasan: "${reason}". Menunggu keputusan akhir panel arbitrase Admin.`
            }
        });

        return NextResponse.json({ 
            success: true, 
            message: 'Tiket sengketa berhasil diajukan. Status laga ditahan untuk peninjauan Admin.' 
        }, { status: 200 });

    } catch (error) {
        console.error('Dispute API Error:', error);
        return NextResponse.json({ success: false, message: 'Gagal mengajukan sengketa.' }, { status: 500 });
    }
}