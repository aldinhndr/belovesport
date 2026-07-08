// Path: src/app/api/tournament/draw/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { RegistrationStatus, MatchStage, MatchStatus } from '@prisma/client';

export async function POST() {
    try {
        console.log('🏁 ENGINE BACKEND: Memulai pembuatan Jadwal & Tabel Klasemen Grup Resmi...');

        // 1. Ambil semua tim yang APPROVED
        const approvedTeams = await prisma.registration.findMany({
            where: { status: RegistrationStatus.APPROVED },
            select: { id: true, teamName: true }
        });

        if (approvedTeams.length < 4) {
            return NextResponse.json({ 
                success: false, 
                message: `Gagal! Jumlah tim APPROVED tidak mencukupi untuk membuat grup (${approvedTeams.length} tim).` 
            }, { status: 400 });
        }

        // 2. Acak tim menggunakan Fisher-Yates
        const shuffled = [...approvedTeams];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        const groupNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];
        
        // 3. WIPE OUT DATA LAMA
        await prisma.matchChat.deleteMany();
        await prisma.match.deleteMany();
        await (prisma as any)['groupTeam'].deleteMany();
        await (prisma as any)['group'].deleteMany();

        // Array penampung untuk bulk insert match di akhir agar performa melesat
        const matchesToCreate: any[] = [];

        // 4. TRANSACTION ENGINE (Ditambahkan Parameter Timeout Keamanan 30 Detik)
        await prisma.$transaction(async (tx) => {
            
            for (let i = 0; i < groupNames.length; i++) {
                const currentGroupName = groupNames[i];
                const groupTeamsChunk = shuffled.filter((_, idx) => idx % groupNames.length === i);

                if (groupTeamsChunk.length < 2) continue;

                // A. Buat Induk Grup Baru
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

                // C. Rancang Struktur Jadwal Round-Robin Laga (Kumpulkan di Array Memori)
                let roundCounter = 1;
                for (let j = 0; j < groupTeamsChunk.length; j++) {
                    for (let k = j + 1; k < groupTeamsChunk.length; k++) {
                        matchesToCreate.push({
                            stage: MatchStage.GROUP,
                            groupName: currentGroupName,
                            roundNumber: roundCounter++,
                            matchNumber: 0, // Di-update berurutan di bawah
                            homeTeamId: groupTeamsChunk[j].id,
                            awayTeamId: groupTeamsChunk[k].id,
                            matchStatus: MatchStatus.SCHEDULED,
                            scheduledTime: new Date()
                        });
                    }
                }
            }

            // D. EKSEKUSI BULK INSERT MATCH: Menyuntikkan seluruh jadwal sekaligus dalam 1 query tunggal!
            if (matchesToCreate.length > 0) {
                await tx.match.createMany({
                    data: matchesToCreate
                });
            }

        }, {
            maxWait: 10000, // Maksimal waktu tunggu alokasi koneksi (10 detik)
            timeout: 30000  // Menaikkan batas waktu eksekusi transaksi menjadi 30 detik! (Menyelesaikan P2028)
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
                timeout: 20000 // Berikan nafas waktu ekstra untuk penataan nomor urut
            }
        );

        return NextResponse.json({ 
            success: true, 
            message: 'Sirkuit Berhasil Dikunci! 16 Tabel Grup dan Jadwal Pertandingan resmi berstatus LIVE!' 
        });

    } catch (error: any) {
        console.error('❌ CRITICAL ERROR DRAW ENGINE:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}