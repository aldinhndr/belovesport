// Path: src/app/api/tournament/leaderboard/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getParticipantSession } from '@/lib/participant-auth';

interface LeaderboardRow {
    id: string;
    teamName: string;
    grup: string;
    main: number;
    menang: number;
    seri: number;
    kalah: number;
    gm: number;
    gk: number;
    gd: number;
    poin: number;
    logoUrl: string | null;
}

export async function GET() {
    // 🛡️ 1. Proteksi Sesi
    const session = await getParticipantSession();
    if (!session) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
        // 2. Tarik seluruh pertandingan fase grup yang sudah SELESAI
        const completedMatches = await prisma.match.findMany({
            where: {
                stage: 'GROUP',
                matchStatus: 'COMPLETED'
            }
        });

        // 3. Tarik data klasemen resmi dari tabel GroupTeam
        const groupTeams = await (prisma as any)['groupTeam'].findMany({
            include: {
                group: {
                    select: { groupName: true }
                },
                registration: {
                    select: { profilePictureUrl: true }
                }
            }
        });

        // 4. Kalkulasi ulang / petakan statistik secara presisi
        const leaderboardData: LeaderboardRow[] = groupTeams.map((gt: any) => {
            const teamId = gt.teamId;
            let main = 0;
            let menang = 0;
            let seri = 0;
            let kalah = 0;
            let gm = 0;
            let gk = 0;

            completedMatches.forEach((match: any) => {
                const isHome = match.homeTeamId === teamId;
                const isAway = match.awayTeamId === teamId;

                if (isHome || isAway) {
                    main++;
                    // Hitung total skor agregat (Leg 1 + Leg 2)
                    const hScore = (match.homeScoreLeg1 ?? 0) + (match.homeScoreLeg2 ?? 0);
                    const aScore = (match.awayScoreLeg1 ?? 0) + (match.awayScoreLeg2 ?? 0);

                    if (isHome) {
                        gm += hScore;
                        gk += aScore;
                        if (hScore > aScore) menang++;
                        else if (hScore === aScore) seri++;
                        else kalah++;
                    } else {
                        gm += aScore;
                        gk += hScore;
                        if (aScore > hScore) menang++;
                        else if (aScore === hScore) seri++;
                        else kalah++;
                    }
                }
            });

            const gd = gm - gk;
            const poin = (menang * 3) + (seri * 1);

            return {
                id: teamId,
                teamName: gt.teamName,
                grup: gt.group?.groupName || 'A',
                main,
                menang,
                seri,
                kalah,
                gm,
                gk,
                gd,
                poin,
                logoUrl: gt.registration?.profilePictureUrl || null
            };
        });

        // 5. Urutkan berdasarkan Poin -> Selisih Gol (GD) -> Gol Memasukkan (GM)
        leaderboardData.sort((a: LeaderboardRow, b: LeaderboardRow) => {
            if (b.poin !== a.poin) return b.poin - a.poin;
            if (b.gd !== a.gd) return b.gd - a.gd;
            return b.gm - a.gm;
        });

        return NextResponse.json({ success: true, data: leaderboardData }, { status: 200 });

    } catch (error) {
        console.error('Leaderboard API Error:', error);
        return NextResponse.json({ success: false, message: 'Gagal memuat papan peringkat global.' }, { status: 500 });
    }
}