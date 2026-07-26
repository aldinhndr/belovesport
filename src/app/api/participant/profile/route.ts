// Path: src/app/api/participant/profile/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getParticipantSession } from '@/lib/participant-auth';

export async function GET() {
    try {
        // 🛡️ 1. Cek Sesi Login
        const session: any = await getParticipantSession();
        if (!session) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        // Ambil ID peserta secara fleksibel dari berbagai bentuk JWT Payload
        const participantId = session.participantId || session.id || session.userId || session.sub;

        if (!participantId) {
            return NextResponse.json(
                { success: false, message: 'Sesi tidak valid / ID tidak ditemukan.' },
                { status: 401 }
            );
        }

        // 🛡️ 2. Query Utama: Ambil DATA DASAR PARTICIPANT SAJA (Diisolasi agar anti-crash)
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
            }
        });

        if (!participant) {
            return NextResponse.json({ success: false, message: 'Profil tidak ditemukan.' }, { status: 404 });
        }

        // 🛡️ 3. Query Tambahan 1: Ambil Registrations (Safe Try-Catch)
        let registrations: any[] = [];
        try {
            registrations = await prisma.registration.findMany({
                where: { participantId: participantId },
                include: {
                    vouchers: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        } catch (regError) {
            console.warn('[Profile Warning] Registrations query skipped:', regError);
        }

        // 🛡️ 4. Query Tambahan 2: Ambil Matches (Safe Try-Catch)
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
            console.warn('[Profile Warning] Match query skipped:', matchError);
        }

        // 🛡️ 5. Gabungkan menjadi satu respons JSON utuh
        const profileData = {
            ...participant,
            registrations,
            matches
        };

        return NextResponse.json({ success: true, data: profileData }, { status: 200 });

    } catch (error: any) {
        console.error('CRITICAL ERROR in GET /api/participant/profile:', error);
        return NextResponse.json(
            { success: false, message: 'Terjadi kesalahan server saat mengambil data profil.' },
            { status: 500 }
        );
    }
}