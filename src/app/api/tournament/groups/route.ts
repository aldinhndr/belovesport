// Path: src/app/api/tournament/groups/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getParticipantSession } from '@/lib/participant-auth';

// 🎯 Tepat 8 Grup (A - H) untuk 32 Tim
const GROUP_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const TEAMS_PER_GROUP = 4;

export async function GET() {
    // 🛡️ 1. Proteksi Sesi Participant
    const session = await getParticipantSession();
    if (!session) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
        // 2. Ambil seluruh data grup beserta statistik tim dari database
        const groupsFromDb = await (prisma as any)['group'].findMany({
            orderBy: { groupName: 'asc' },
            include: {
                teams: {
                    include: {
                        registration: {
                            select: { profilePictureUrl: true }
                        }
                    },
                    orderBy: [
                        { points: 'desc' },
                        { goalDifference: 'desc' },
                        { goalsFor: 'desc' },
                        { teamName: 'asc' }
                    ]
                }
            }
        });

        // 3. Format respons menjadi Array [{ groupName: 'A', teams: [...] }] agar cocok dengan UI Frontend
        const formattedData = GROUP_LETTERS.map((letter) => {
            const foundGroup = groupsFromDb.find((g: any) => g.groupName.toUpperCase() === letter);
            
            let teams = foundGroup ? foundGroup.teams.map((t: any) => ({
                teamId: t.teamId,
                teamName: t.teamName,
                logoUrl: t.registration?.profilePictureUrl || null,
                played: t.played,
                won: t.won,
                drawn: t.drawn,
                lost: t.lost,
                goalsFor: t.goalsFor,
                goalsAgainst: t.goalsAgainst,
                goalDifference: t.goalDifference,
                points: t.points
            })) : [];

            // Jika slot tim belum penuh 4, isi dengan placeholder TBD
            let tbdCounter = 1;
            while (teams.length < TEAMS_PER_GROUP) {
                teams.push({
                    teamId: `tbd-${letter}-${tbdCounter++}`,
                    teamName: 'TBD',
                    logoUrl: null,
                    played: 0,
                    won: 0,
                    drawn: 0,
                    lost: 0,
                    goalsFor: 0,
                    goalsAgainst: 0,
                    goalDifference: 0,
                    points: 0
                });
            }

            return {
                groupName: letter,
                teams
            };
        });

        return NextResponse.json({ success: true, data: formattedData }, { status: 200 });

    } catch (error) {
        console.error('Error Group Standings API:', error);
        return NextResponse.json({ success: false, message: 'Gagal memproses data klasemen grup.' }, { status: 500 });
    }
}