// Path: src/app/api/participant/profile/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getParticipantSession } from '@/lib/participant-auth';

export async function GET() {
    // 🛡️ 1. Cek sesi login peserta
    const session = await getParticipantSession();
    if (!session) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const participantId = session.participantId;

        // 🛡️ 2. Tarik data dasar participant & registrasinya secara valid
        const participant = await prisma.participant.findUnique({
            where: { id: participantId },
            select: {
                id: true,
                username: true,
                email: true,
                isVerified: true,
                createdAt: true,
                updatedAt: true,
                registrations: {
                    include: {
                        vouchers: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });

        if (!participant) {
            return NextResponse.json({ success: false, message: 'Profil tidak ditemukan.' }, { status: 404 });
        }

        // 🛡️ 3. Ambil daftar ID registrasi milik peserta ini
        const registrationIds = participant.registrations.map((reg) => reg.id);

        // 🛡️ 4. Tarik data match berdasarkan registrationIds (homeTeamId / awayTeamId)
        let matches: any[] = [];
        if (registrationIds.length > 0) {
            matches = await prisma.match.findMany({
                where: {
                    OR: [
                        { homeTeamId: { in: registrationIds } },
                        { awayTeamId: { in: registrationIds } }
                    ]
                },
                include: {
                    homeTeam: true,
                    awayTeam: true
                },
                orderBy: {
                    scheduledTime: 'desc'
                }
            });
        }

        // 🛡️ 5. Gabungkan datanya agar struktur respons tetap kompatibel dengan frontend Koko
        const profileData = {
            ...participant,
            matches: matches
        };

        return NextResponse.json({ success: true, data: profileData }, { status: 200 });

    } catch (error: any) {
        console.error('Error fetching participant profile:', error);
        return NextResponse.json(
            { success: false, message: 'Terjadi kesalahan internal pada server database.' },
            { status: 500 }
        );
    }
}