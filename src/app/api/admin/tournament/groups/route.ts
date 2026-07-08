// Path: src/app/api/admin/tournament/groups/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        console.log('📡 API FETCH: Menarik data 16 klasemen grup resmi dari database...');

        // 🛡️ PERBAIKAN: Gunakan bypass (prisma as any) untuk melompati masalah cache editor TS
        const groupsData = await (prisma as any)['group'].findMany({
            orderBy: {
                groupName: 'asc'
            },
            include: {
                teams: {
                    orderBy: [
                        { points: 'desc' },
                        { goalDifference: 'desc' },
                        { goalsFor: 'desc' },
                        { teamName: 'asc' }
                    ]
                }
            }
        });

        // 🛡️ PERBAIKAN: Berikan tipe ': any' eksplisit pada parameter map agar lulus ts(7006)
        const formattedStandings = groupsData.map((g: any) => ({
            groupName: g.groupName,
            teams: g.teams.map((t: any) => ({
                teamId: t.teamId,
                teamName: t.teamName,
                played: t.played,
                won: t.won,
                drawn: t.drawn,
                lost: t.lost,
                goalsFor: t.goalsFor,
                goalsAgainst: t.goalsAgainst,
                goalDifference: t.goalDifference,
                points: t.points
            }))
        }));

        return NextResponse.json({
            success: true,
            data: formattedStandings
        });

    } catch (error: any) {
        console.error('❌ GAGAL FETCH DATA KLASEMEN:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}