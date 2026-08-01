// Path: src/app/api/tournament/draw/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { RegistrationStatus, MatchStage, MatchStatus } from '@prisma/client';

export async function POST() {
    try {
        console.log('🏁 ENGINE BACKEND: Memulai Pengundian 8 Grup Resmi (32 Tim)...');

        // 1. Ambil semua tim yang APPROVED
        const approvedTeams = await prisma.registration.findMany({
            where: { status: RegistrationStatus.APPROVED },
            select: { id: true, teamName: true }
        });

        // Validasi minimal tim
        if (approvedTeams.length < 8) {
            return NextResponse.json({ 
                success: false, 
                message: `Gagal! Jumlah tim APPROVED minimal harus 8 tim untuk memulainya. (Saat ini: ${approvedTeams.length} tim).` 
            }, { status: 400 });
        }

        // 2. Acak tim menggunakan Fisher-Yates
        const shuffled = [...approvedTeams];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        // 🎯 Tepat 8 Grup (A - H) untuk 32 Tim
        const groupNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        
        // 3. WIPE OUT DATA BRACKET & MATCH LAMA
        await prisma.matchChat.deleteMany();
        await prisma.matchAuditLog.deleteMany();
        await prisma.match.deleteMany();
        await (prisma as any)['groupTeam'].deleteMany();
        await (prisma as any)['group'].deleteMany();

        const matchesToCreate: any[] = [];

        // 4. TRANSACTION ENGINE
        await prisma.$transaction(async (tx) => {
            
            for (let i = 0; i < groupNames.length; i++) {
                const currentGroupName = groupNames[i];
                // Bagikan tim secara merata ke 8 grup
                const groupTeamsChunk = shuffled.filter((_, idx) => idx % groupNames.length === i);

                if (groupTeamsChunk.length < 2) continue;

                // A. Buat Induk Grup Baru (Grup A - H)
                const newGroup = await (tx as any)['group'].create({
                    data: { groupName: currentGroupName }
                });

                // B. Daftarkan Tim ke tabel GroupTeam
                for (const team of groupTeamsChunk) {
                    await (tx as any)['groupTeam'].create({
                        data: {
                            groupId: newGroup.id,
                            teamId: team.id,
                            teamName: team.teamName,
                            played: 0,
                            won: 0,
                            drawn: 0,
                            lost: 0,
                            goalsFor: 0,
                            goalsAgainst: 0,
                            goalDifference: 0,
                            points: 0
                        }
                    });
                }

                // C. Rancang Laga Round-Robin 2 Leg (Home & Away)
                let roundCounter = 1;
                for (let j = 0; j < groupTeamsChunk.length; j++) {
                    for (let k = j + 1; k < groupTeamsChunk.length; k++) {
                        // Leg 1
                        matchesToCreate.push({
                            stage: MatchStage.GROUP,
                            groupName: currentGroupName,
                            roundNumber: roundCounter,
                            matchNumber: 0,
                            homeTeamId: groupTeamsChunk[j].id,
                            awayTeamId: groupTeamsChunk[k].id,
                            matchStatus: MatchStatus.SCHEDULED,
                            scheduledTime: new Date()
                        });

                        // Leg 2 (Tukar Home & Away)
                        matchesToCreate.push({
                            stage: MatchStage.GROUP,
                            groupName: currentGroupName,
                            roundNumber: roundCounter + 1,
                            matchNumber: 0,
                            homeTeamId: groupTeamsChunk[k].id,
                            awayTeamId: groupTeamsChunk[j].id,
                            matchStatus: MatchStatus.SCHEDULED,
                            scheduledTime: new Date()
                        });

                        roundCounter += 2;
                    }
                }
            }

            // D. BULK INSERT MATCH
            if (matchesToCreate.length > 0) {
                await tx.match.createMany({
                    data: matchesToCreate
                });
            }

        }, {
            maxWait: 10000,
            timeout: 30000
        });

        // 5. AUTO-INCREMENT NOMOR MATCH GLOBAL
        const allCreatedMatches = await prisma.match.findMany({ orderBy: { id: 'asc' } });
        await prisma.$transaction(
            allCreatedMatches.map((match, idx) => 
                prisma.match.update({
                    where: { id: match.id },
                    data: { matchNumber: idx + 1 }
                })
            ), {
                timeout: 20000
            }
        );

        return NextResponse.json({ 
            success: true, 
            message: `Pengundian Sukses! 8 Grup (A-H) & ${matchesToCreate.length} Jadwal Laga Resmi Dibuat!` 
        });

    } catch (error: any) {
        console.error('❌ CRITICAL ERROR DRAW ENGINE:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}