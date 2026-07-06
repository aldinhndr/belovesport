// Path: src/app/api/participant/notifications/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getParticipantSession } from '@/lib/participant-auth';

export async function GET() {
    const session = await getParticipantSession();
    if (!session) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const notifications: any[] = [];

        // 1. Ambil data registrasi tim milik participant untuk mengecek status slot
        const myRegistrations = await prisma.registration.findMany({
            where: { participantId: session.participantId },
            orderBy: { updatedAt: 'desc' }
        });

        myRegistrations.forEach((reg) => {
            if (reg.status === 'APPROVED') {
                notifications.push({
                    id: `reg-app-${reg.id}`,
                    type: 'SUCCESS',
                    title: 'Slot Turnamen Diamankan!',
                    message: `Pendaftaran tim "${reg.teamName}" telah disetujui Admin. Sila cek e-voucher eksklusif di profil Koko.`,
                    time: reg.updatedAt
                });
            } else if (reg.status === 'REJECTED') {
                notifications.push({
                    id: `reg-rej-${reg.id}`,
                    type: 'DANGER',
                    title: 'Pendaftaran Slot Ditolak',
                    message: `Mohon maaf, pendaftaran "${reg.teamName}" ditolak. Alasan: ${reg.rejectionReason || '-'}`,
                    time: reg.updatedAt
                });
            } else {
                notifications.push({
                    id: `reg-pen-${reg.id}`,
                    type: 'INFO',
                    title: 'Pendaftaran Sedang Ditinjau',
                    message: `Data tim "${reg.teamName}" sedang dalam proses verifikasi pembayaran oleh Admin.`,
                    time: reg.createdAt
                });
            }
        });

        // 2. Ambil data pertandingan aktif yang melibatkan tim participant
        const teamIds = myRegistrations.map(t => t.id);
        if (teamIds.length > 0) {
            const myMatches = await prisma.match.findMany({
                where: {
                    OR: [
                        { homeTeamId: { in: teamIds } },
                        { awayTeamId: { in: teamIds } }
                    ]
                },
                include: {
                    homeTeam: { select: { teamName: true } },
                    awayTeam: { select: { teamName: true } }
                },
                orderBy: { scheduledTime: 'asc' }
            });

            myMatches.forEach((match) => {
                if (match.matchStatus === 'SCHEDULED') {
                    notifications.push({
                        id: `match-sch-${match.id}`,
                        type: 'WARNING',
                        title: 'Jadwal Tanding Dirilis!',
                        message: `Tim Koko dijadwalkan bertanding di babak ${match.stage} (Match #${match.matchNumber}). Sila koordinasi di Room Chat modal.`,
                        time: match.createdAt
                    });
                } else if (match.matchStatus === 'WAITING_VERIFICATION') {
                    notifications.push({
                        id: `match-wait-${match.id}`,
                        type: 'INFO',
                        title: 'Skor Menunggu Verifikasi',
                        message: `Laporan hasil skor pertandingan #${match.matchNumber} berhasil dikirim dan sedang ditinjau Admin sirkuit.`,
                        time: match.createdAt
                    });
                }
            });
        }

        // Urutkan berdasarkan waktu terbaru
        notifications.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

        return NextResponse.json({ success: true, data: notifications }, { status: 200 });
    } catch (error) {
        console.error('Notification API Error:', error);
        return NextResponse.json({ success: false, message: 'Gagal memuat notifikasi.' }, { status: 500 });
    }
}