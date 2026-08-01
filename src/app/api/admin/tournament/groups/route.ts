// Path: src/app/api/admin/tournament/groups/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        console.log('📡 API FETCH: Menarik data 8 klasemen grup resmi dari database...');

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

        const formattedStandings = groupsData.map((g: any) => ({
            groupId: g.id,
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