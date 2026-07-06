// Path: src/app/api/admin/dashboard-stats/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { RegistrationStatus, MatchStatus, MatchStage } from '@prisma/client';

export async function GET() {
    try {
        // 1. Tarik data status pendaftaran murni dari database
        const allRegistrations = await prisma.registration.findMany({
            select: { status: true }
        });

        // TEPAT: Slot terisi dan dana HANYA dihitung dari yang berstatus APPROVED
        const totalApproved = allRegistrations.filter(r => r.status === RegistrationStatus.APPROVED).length;
        
        // PENDING/WAITING dimasukkan ke antrean verifikasi modul A-02, tidak memotong slot kuota
        const totalPending = allRegistrations.filter(r => r.status === RegistrationStatus.PENDING).length;

        // KAS REAL-TIME: Rp 25.000 hanya dikali dengan tim yang sudah APPROVED (SAH)
        const slotPrice = 25000; 
        const totalRevenue = totalApproved * slotPrice;

        // 2. Deteksi jumlah match berjalan & sengketa
        const activeMatchesCount = await prisma.match.count({
            where: { matchStatus: MatchStatus.COMPLETED }
        });

        const disputeTickets = await prisma.match.count({
            where: { matchStatus: MatchStatus.WAITING_VERIFICATION }
        });

        // 3. Status Alur Sirkuit Dinamis
        let currentStageLabel = 'REGISTRASI';
        const totalMatches = await prisma.match.count();
        
        if (totalMatches > 0) {
            const completedCount = await prisma.match.count({ where: { matchStatus: MatchStatus.COMPLETED } });
            if (completedCount === totalMatches) {
                currentStageLabel = 'SELESAI';
            } else {
                const hasKnockout = await prisma.match.findFirst({
                    where: { stage: { not: MatchStage.GROUP } }
                });
                currentStageLabel = hasKnockout ? 'KNOCKOUT STAGE' : 'FASE GRUP';
            }
        }

        return NextResponse.json({
            success: true,
            data: {
                pesertaAktif: totalApproved,       // TEPAT: Hanya yang APPROVED
                kuotaTotal: 64,                    // Batas kuota sirkuit Belovesport
                pendingRegistrations: totalPending, // Antrean untuk masuk ke modul A-02
                pendapatan: totalRevenue,          // TEPAT: Poin kas murni dari APPROVED
                statusBracket: currentStageLabel,
                tiketOpen: disputeTickets,
                matchBerjalan: activeMatchesCount
            }
        }, { status: 200 });

    } catch (error) {
        console.error('Error Dashboard Stats Engine:', error);
        return NextResponse.json({ 
            success: false, 
            message: 'Gagal memproses kalkulasi statistik dashboard.' 
        }, { status: 500 });
    }
}