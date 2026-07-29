// Path: src/app/api/admin/match-schedule/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MatchStage } from '@prisma/client';
import { getAdminSession } from '@/lib/auth';
import { createMatchAuditLog } from '@/lib/match-audit';

// 1. GET: Ambil daftar semua match untuk dijadwalkan (Bisa difilter per Grup)
export async function GET(request: NextRequest) {
    try {
        const adminSession = await getAdminSession();
        if (!adminSession) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }
        const { searchParams } = new URL(request.url);
        const groupFilter = searchParams.get('groupName'); // Misal: A, B, C...

        const whereClause: any = {
            stage: MatchStage.GROUP
        };

        if (groupFilter) {
            whereClause.groupName = groupFilter;
        }

        const matches = await prisma.match.findMany({
            where: whereClause,
            include: {
                homeTeam: { select: { teamName: true } },
                awayTeam: { select: { teamName: true } }
            },
            orderBy: [
                { groupName: 'asc' },
                { roundNumber: 'asc' },
                { matchNumber: 'asc' }
            ]
        });

        return NextResponse.json({ success: true, data: matches });
    } catch (error: any) {
        console.error('Error Fetching Schedule:', error);
        return NextResponse.json({ success: false, message: 'Gagal memuat jadwal.' }, { status: 500 });
    }
}

// 2. PUT: Update Waktu Pertandingan & Geser Status jika diperlukan
export async function PUT(request: NextRequest) {
    try {
        const adminSession = await getAdminSession();
        if (!adminSession) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }
        const body = await request.json();
        const { matchId, scheduledTime, startNow } = body;

        if (!matchId || !scheduledTime) {
            return NextResponse.json({ success: false, message: 'Data matchId dan waktu wajib diisi.' }, { status: 400 });
        }

        const updateData: any = {
            scheduledTime: new Date(scheduledTime)
        };

        // Jika admin menceklis "Mulai Pertandingan Sekarang", geser status ke PLAYING
        if (startNow) {
            updateData.matchStatus = 'PLAYING';
        } else {
            // Jika dijadwalkan ulang, kembalikan ke SCHEDULED dari PLAYING jika tadinya salah input
            updateData.matchStatus = 'SCHEDULED';
        }

        const updatedMatch = await prisma.match.update({
            where: { id: matchId },
            data: updateData
        });

        await createMatchAuditLog({
            matchId,
            action: startNow ? 'MATCH_STARTED' : 'SCHEDULE_UPDATED',
            actorId: adminSession.username,
            actorRole: 'admin',
            details: startNow ? 'Admin memulai pertandingan secara manual' : 'Admin memperbarui jadwal pertandingan'
        });

        return NextResponse.json({ 
            success: true, 
            message: startNow 
                ? 'Jadwal diperbarui dan pertandingan RESMI DIMULAI (Status: PLAYING)!' 
                : 'Jadwal pertandingan berhasil diperbarui!' 
        });
    } catch (error: any) {
        console.error('Error Updating Schedule:', error);
        return NextResponse.json({ success: false, message: 'Gagal menyimpan perubahan jadwal.' }, { status: 500 });
    }
}