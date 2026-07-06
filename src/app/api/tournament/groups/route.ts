// Path: src/app/api/tournament/groups/route.ts
import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/supabase/requireUser';
import { prisma } from '@/lib/prisma';

// 16 Grup: A - P, masing-masing diisi 4 tim (Round Robin: 3 laga per tim, 6 laga per grup)
const GROUP_LETTERS = Array.from({ length: 16 }, (_, i) => String.fromCharCode(65 + i));
const TEAMS_PER_GROUP = 4;
const FORM_LIMIT = 3; // jumlah hasil terakhir yang ditampilkan (W/D/L)

interface TeamStanding {
    id: string;
    name: string;
    isTbd: boolean;
    main: number;
    menang: number;
    seri: number;
    kalah: number;
    gf: number;
    ga: number;
    gd: number;
    poin: number;
    formRaw: ('W' | 'D' | 'L')[]; // urutan kronologis, dipotong jadi `form` sebelum dikirim ke client
}

export async function GET(request: Request) {
    const { unauthorized } = await requireUser();
    if (unauthorized) return unauthorized;
    
    try {
        // 1. Ambil semua pertandingan fase grup, urut kronologis untuk keperluan hitung Form
        const groupMatches = await prisma.match.findMany({
            where: { stage: 'GROUP' },
            include: {
                homeTeam: true,
                awayTeam: true,
            },
            orderBy: [
                { scheduledTime: 'asc' },
                { id: 'asc' },
            ],
        });

        // 2. Siapkan wadah 16 grup, masing-masing 4 slot placeholder "TBD" —
        //    supaya bagan klasemen SELALU tampil penuh walau tim belum diundi / belum ada match.
        const groupTeams: Record<string, Record<string, TeamStanding>> = {};
        const groupOrder: Record<string, string[]> = {}; // urutan tim asli (real) masuk ke grup, maks 4

        const ensureGroup = (letter: string) => {
            if (!groupTeams[letter]) {
                groupTeams[letter] = {};
                groupOrder[letter] = [];
            }
        };
        GROUP_LETTERS.forEach(ensureGroup);

        const ensureTeamSlot = (letter: string, teamId: string, teamName: string) => {
            ensureGroup(letter);
            if (groupTeams[letter][teamId]) return; // sudah ada
            if (groupOrder[letter].length >= TEAMS_PER_GROUP) return; // grup sudah penuh 4 tim asli

            groupTeams[letter][teamId] = {
                id: teamId,
                name: teamName || 'TBD',
                isTbd: false,
                main: 0, menang: 0, seri: 0, kalah: 0, gf: 0, ga: 0, gd: 0, poin: 0,
                formRaw: [],
            };
            groupOrder[letter].push(teamId);
        };

        // Peta head-to-head untuk tie-break: headToHead[groupLetter][teamA][teamB] = poin teamA vs teamB
        const headToHead: Record<string, Record<string, Record<string, number>>> = {};
        const addH2H = (letter: string, teamId: string, vsTeamId: string, poin: number) => {
            if (!headToHead[letter]) headToHead[letter] = {};
            if (!headToHead[letter][teamId]) headToHead[letter][teamId] = {};
            headToHead[letter][teamId][vsTeamId] = (headToHead[letter][teamId][vsTeamId] || 0) + poin;
        };

        // 3. Proses tiap match: daftarkan slot tim, lalu akumulasi statistik kalau sudah COMPLETED
        groupMatches.forEach((match) => {
            const gName = (match.groupName || '').toUpperCase();
            if (!gName) return; // match tanpa groupName diabaikan (data tidak lengkap)

            if (match.homeTeamId) ensureTeamSlot(gName, match.homeTeamId, match.homeTeam?.teamName || 'TBD');
            if (match.awayTeamId) ensureTeamSlot(gName, match.awayTeamId, match.awayTeam?.teamName || 'TBD');

            if (match.matchStatus === 'COMPLETED' && match.homeTeamId && match.awayTeamId) {
                const pHome = groupTeams[gName][match.homeTeamId];
                const pAway = groupTeams[gName][match.awayTeamId];
                if (!pHome || !pAway) return; // slot penuh / data tidak konsisten, skip aman

                const hScore = match.homeScoreLeg1 ?? 0;
                const aScore = match.awayScoreLeg1 ?? 0;

                pHome.main += 1;
                pAway.main += 1;
                pHome.gf += hScore; pHome.ga += aScore;
                pAway.gf += aScore; pAway.ga += hScore;

                if (hScore > aScore) {
                    pHome.menang += 1; pHome.poin += 3; pAway.kalah += 1;
                    pHome.formRaw.push('W'); pAway.formRaw.push('L');
                    addH2H(gName, match.homeTeamId, match.awayTeamId, 3);
                    addH2H(gName, match.awayTeamId, match.homeTeamId, 0);
                } else if (aScore > hScore) {
                    pAway.menang += 1; pAway.poin += 3; pHome.kalah += 1;
                    pAway.formRaw.push('W'); pHome.formRaw.push('L');
                    addH2H(gName, match.awayTeamId, match.homeTeamId, 3);
                    addH2H(gName, match.homeTeamId, match.awayTeamId, 0);
                } else {
                    pHome.seri += 1; pAway.seri += 1;
                    pHome.poin += 1; pAway.poin += 1;
                    pHome.formRaw.push('D'); pAway.formRaw.push('D');
                    addH2H(gName, match.homeTeamId, match.awayTeamId, 1);
                    addH2H(gName, match.awayTeamId, match.homeTeamId, 1);
                }

                pHome.gd = pHome.gf - pHome.ga;
                pAway.gd = pAway.gf - pAway.ga;
            }
        });

        // 4. Rakit hasil akhir: gabungkan tim asli + TBD placeholder sampai genap 4 slot per grup,
        //    urutkan dengan komparator profesional (Poin → GD → GF → Head-to-Head → Abjad).
        const formattedStandings: Record<string, any[]> = {};

        Object.keys(groupTeams).sort().forEach((gName) => {
            const realTeams = groupOrder[gName].map((id) => groupTeams[gName][id]);

            const paddedSlots: TeamStanding[] = [...realTeams];
            let tbdCounter = 1;
            while (paddedSlots.length < TEAMS_PER_GROUP) {
                paddedSlots.push({
                    id: `tbd-${gName}-${tbdCounter++}`,
                    name: 'TBD',
                    isTbd: true,
                    main: 0, menang: 0, seri: 0, kalah: 0, gf: 0, ga: 0, gd: 0, poin: 0,
                    formRaw: [],
                });
            }

            const h2h = headToHead[gName] || {};
            paddedSlots.sort((a, b) => {
                if (b.poin !== a.poin) return b.poin - a.poin;             // 1. Poin tertinggi
                if (b.gd !== a.gd) return b.gd - a.gd;                     // 2. Selisih gol tertinggi
                if (b.gf !== a.gf) return b.gf - a.gf;                     // 3. Gol memasukkan tertinggi
                const h2hA = h2h[a.id]?.[b.id] ?? 0;                       // 4. Head-to-head
                const h2hB = h2h[b.id]?.[a.id] ?? 0;
                if (h2hB !== h2hA) return h2hB - h2hA;
                return a.name.localeCompare(b.name);                      // 5. Abjad (fallback stabil)
            });

            formattedStandings[gName] = paddedSlots.map((t) => ({
                id: t.id,
                name: t.name,
                isTbd: t.isTbd,
                main: t.main,
                menang: t.menang,
                seri: t.seri,
                kalah: t.kalah,
                gf: t.gf,
                ga: t.ga,
                gd: t.gd,
                poin: t.poin,
                form: t.formRaw.slice(-FORM_LIMIT), // hasil kronologis, terbaru di paling kanan
            }));
        });

        return NextResponse.json({ success: true, data: formattedStandings }, { status: 200 });
    } catch (error) {
        console.error('Error Group Standings Engine:', error);
        return NextResponse.json({ success: false, message: 'Gagal memproses data mesin klasemen.' }, { status: 500 });
    }
}