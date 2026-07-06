// Path: src/app/api/tournament/generate-groups/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Jalur inisialisasi prisma Koko
import { Prisma } from '@prisma/client';

export async function POST(request: Request) {
  try {
    // 1. Ambil semua pendaftar yang statusnya sudah APPROVED
    const participants = await prisma.registration.findMany({
      where: { status: 'APPROVED' },
    });

    // Validasi: Pastikan kuota terpenuhi (64 Player)
    // Untuk testing, Koko bisa turunkan angka ini jika pendaftar belum sampai 64
    if (participants.length < 64) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Pendaftar baru ada ${participants.length}. Dibutuhkan minimal 64 player berstatus APPROVED untuk mengocok grup.` 
        },
        { status: 400 }
      );
    }

    // 2. Algoritma Fisher-Yates: Kocok urutan player secara acak (Random Seed)
    const shuffled = [...participants];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // 3. Inisialisasi Nama 16 Grup (A sampai P)
    const groupNames = Array.from({ length: 16 }, (_, i) => String.fromCharCode(65 + i)); // ['A', 'B', ..., 'P']
    
    const matchDataToCreate: Prisma.MatchCreateManyInput[] = [];

    // 4. Distribusikan 4 Player ke masing-masing Grup & Buat Jadwal Pertandingannya
    for (let g = 0; g < 16; g++) {
      const groupName = groupNames[g];
      // Ambil 4 player secara berurutan dari hasil kocokan acak tadi
      const groupPlayers = shuffled.slice(g * 4, (g * 4) + 4);

      // Buat simulasi pertandingan Round Robin di dalam grup (Setiap player bertemu 1 kali)
      // Kombinasi 4 tim: P1 vs P2, P3 vs P4, P1 vs P3, P2 vs P4, P1 vs P4, P2 vs P3 (Total 6 Match per Grup)
      const pairings = [
        [groupPlayers[0], groupPlayers[1]],
        [groupPlayers[2], groupPlayers[3]],
        [groupPlayers[0], groupPlayers[2]],
        [groupPlayers[1], groupPlayers[3]],
        [groupPlayers[0], groupPlayers[3]],
        [groupPlayers[1], groupPlayers[2]],
      ];

      pairings.forEach((pair, index) => {
        const [home, away] = pair;
        
        matchDataToCreate.push({
          stage: 'GROUP',
          groupName: groupName,
          roundNumber: Math.ceil((index + 1) / 2), // Round 1, 2, atau 3 di fase grup
          matchNumber: index + 1,
          homeTeamId: home.id,
          awayTeamId: away.id,
          matchStatus: 'SCHEDULED',
          scheduledTime: new Date(Date.now() + (g * 600000)), // Simulasi interval waktu kick-off
        });
      });
    }

    // 5. Simpan seluruh jadwal pertandingan grup ke database secara sekaligus (Bulk Insert)
    // Pakai Transaction untuk memastikan keamanan data: jika satu gagal, batalkan semua.
    await prisma.$transaction([
      prisma.match.createMany({
        data: matchDataToCreate,
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: `Sukses mengocok grup! 64 Player berhasil dibagi rata ke dalam 16 Grup (A-P). Total ${matchDataToCreate.length} pertandingan grup telah dijadwalkan otomatis.`,
    }, { status: 200 });

  } catch (error) {
    console.error('Error Group Generator Engine:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menjalankan mesin generator sirkuit internal.' },
      { status: 500 }
    );
  }
}