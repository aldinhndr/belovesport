// Path: src/app/api/participant/profile/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getParticipantSession } from '@/lib/participant-auth';

export async function GET() {
    try {
        // 🛡️ 1. Cek sesi login peserta
        const session: any = await getParticipantSession();
        if (!session) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        // Ambil ID peserta secara fleksibel (mendukung participantId, id, userId, atau sub)
        const participantId = session.participantId || session.id || session.userId || session.sub;

        if (!participantId) {
            return NextResponse.json(
                { success: false, message: 'Sesi tidak valid / ID tidak ditemukan.' },
                { status: 401 }
            );
        }

        // 🛡️ 2. Tarik data dasar participant & registrasinya secara valid
        const participant = await prisma.participant.findUnique({
            where: { id: participantId },
            select: {
                id: true,
                username: true,
                email: true,
                isVerified: true,
                profilePictureUrl: true,
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

        // 🛡️ 3. Tarik data match dengan Try-Catch terisolasi agar tidak menggagalkan seluruh API jika belum ada match
        let matches: any[] = [];
        try {
            matches = await prisma.match.findMany({
                where: {
                    OR: [
                        { homeTeam: { participantId: participantId } },
                        { awayTeam: { participantId: participantId } }
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
        } catch (matchError) {
            console.warn('[Profile Warning] Match query skipped or empty:', matchError);
            matches = [];
        }

        // 🛡️ 4. Gabungkan datanya
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