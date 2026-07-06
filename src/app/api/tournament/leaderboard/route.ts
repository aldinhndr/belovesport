// Path: src/app/api/tournament/leaderboard/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getParticipantSession } from '@/lib/participant-auth';

// 🛡️ Interface khusus untuk menjamin konsistensi tipe data di level compiler
interface LeaderboardRow {
    id: string;
    teamName: string;
    main: number;
    menang: number;
    seri: number;
    kalah: number;
    gf: number;
    ga: number;
    gd: number;
    poin: number;
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
            },
            include: {
                homeTeam: true,
                awayTeam: true
            }
        });

        // 3. FIX ERROR: Tarik dari tabel 'registration' yang statusnya APPROVED (Tim Aktif Turnamen)
        const activeTeams = await prisma.registration.findMany({
            where: {
                status: 'APPROVED'
            }
        });

        // 4. Map & Kalkulasi Statistik secara Real-time dengan Tipe Data Eksplisit
        const leaderboardData: LeaderboardRow[] = activeTeams.map((team: any) => {
            let main = 0;
            let menang = 0;
            let seri = 0;
            let kalah = 0;
            let gf = 0;
            let ga = 0;

            completedMatches.forEach((match: any) => {
                const isHome = match.homeTeamId === team.id;
                const isAway = match.awayTeamId === team.id;

                if (isHome || isAway) {
                    main++;
                    const hScore = match.homeScoreLeg1 ?? 0;
                    const aScore = match.awayScoreLeg1 ?? 0;

                    if (isHome) {
                        gf += hScore;
                        ga += aScore;
                        if (hScore > aScore) menang++;
                        else if (hScore === aScore) seri++;
                        else kalah++;
                    } else {
                        gf += aScore;
                        ga += hScore;
                        if (aScore > hScore) menang++;
                        else if (aScore === hScore) seri++;
                        else kalah++;
                    }
                }
            });

            const gd = gf - ga;
            const poin = (menang * 3) + (seri * 1);

            return {
                id: team.id,
                teamName: team.teamName,
                main,
                menang,
                seri,
                kalah,
                gf,
                ga,
                gd,
                poin
            };
        });

        // 5. FIX ERROR 7006: Berikan Tipe Data Eksplisit pada Parameter Fungsi Sort
        leaderboardData.sort((a: LeaderboardRow, b: LeaderboardRow) => {
            if (b.poin !== a.poin) return b.poin - a.poin;
            if (b.gd !== a.gd) return b.gd - a.gd;
            return b.gf - a.gf;
        });

        return NextResponse.json({ success: true, data: leaderboardData }, { status: 200 });

    } catch (error) {
        console.error('Leaderboard API Error:', error);
        return NextResponse.json({ success: false, message: 'Gagal memuat papan peringkat global.' }, { status: 500 });
    }
}