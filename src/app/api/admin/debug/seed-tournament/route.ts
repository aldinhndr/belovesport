// Path: src/app/api/admin/debug/seed-tournament/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function POST() {
  try {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ success: false, message: 'Seeder dinonaktifkan di mode Produksi.' }, { status: 403 });
    }

    // ── OPSI BERSIH-BERSIH: Hapus data bot lama agar tidak terkena Unique Constraint ──
    // Ini akan menghapus semua partisipan yang usernamenya diawali dengan "bot_"
    await prisma.participant.deleteMany({
      where: {
        username: {
          startsWith: 'bot_'
        }
      }
    });

    const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const createdTeams = [];
    // Menggunakan kombinasi acak agar batchId benar-benar unik setiap kali cURL ditembak
    const batchId = Math.floor(100000 + Math.random() * 900000).toString(); 

    // 1. GENERATE 32 PESERTA & REGISTRASI TIM
    for (let i = 0; i < 32; i++) {
      const groupIndex = Math.floor(i / 4); 
      const groupName = groups[groupIndex];
      const teamNumber = (i % 4) + 1;

      const participant = await prisma.participant.create({
        data: {
          username: `bot_${groupName}${teamNumber}_${batchId}`,
          email: `bot${i}_${batchId}@belovesport.com`,
          passwordHash: 'hashed_dummy_password', 
          isVerified: true
        }
      });

      const team = await prisma.registration.create({
        data: {
          participantId: participant.id,
          teamName: `FC Elite ${groupName}${teamNumber}`,
          leaderName: `Manager ${groupName}${teamNumber}`,
          email: `team${i}_${batchId}@dummy.com`,
          whatsappNumber: `08120000${10 + i}`,
          efootballId: `EFO-${batchId}-${i}`,
          domisili: 'Bandar Lampung',
          device: 'Mobile',
          instagramHandle: `@team_${groupName}${teamNumber}`,
          paymentMethod: 'TRANSFER_BANK',
          paymentProofUrl: 'https://placehold.co/600x400/png?text=Bukti+Transfer+Dummy',
          status: 'APPROVED',
        }
      });

      createdTeams.push({ ...team, groupName });
    }

    // 2. GENERATE JADWAL FASE GRUP & SKOR ACAK
    const matchInsertData: Prisma.MatchCreateManyInput[] = [];
    let matchNumber = 1;

    for (const group of groups) {
      const groupTeams = createdTeams.filter(t => t.groupName === group);
      
      const pairs = [
        [0, 1], [2, 3],
        [0, 2], [1, 3],
        [0, 3], [1, 2]
      ];

      for (const pair of pairs) {
        const home = groupTeams[pair[0]];
        const away = groupTeams[pair[1]];

        const homeScore = Math.floor(Math.random() * 5);
        const awayScore = Math.floor(Math.random() * 5);

        matchInsertData.push({
          stage: 'GROUP', 
          groupName: group,
          matchNumber: matchNumber++,
          roundNumber: 1,
          homeTeamId: home.id,
          awayTeamId: away.id,
          homeScoreLeg1: homeScore,
          awayScoreLeg1: awayScore,
          matchStatus: 'COMPLETED', 
          scheduledTime: new Date(), 
        });
      }
    }

    await prisma.match.createMany({
      data: matchInsertData
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Simulasi Fase Grup berhasil di-generate! Data bot lama dibersihkan, 32 Tim baru dan 48 Pertandingan telah dibuat.' 
    }, { status: 200 });

  } catch (error) {
    console.error('Seeder Error:', error);
    return NextResponse.json({ success: false, message: 'Gagal menjalankan simulasi.' }, { status: 500 });
  }
}