// Path: src/app/api/tournament/schedule/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/supabase/requireUser';

export async function GET(request: Request) {
    // 🔍 TANGKAP PARAMETER DULU
    const { searchParams } = new URL(request.url);
    const isPersonal = searchParams.get('scope') === 'personal';

    try {
        let whereCondition = {};

        // 🛡️ JIKA SCOPE PERSONAL: Aktifkan proteksi guard ketat
        if (isPersonal) {
            const authResult = await requireUser();
            if (authResult.unauthorized || !authResult.user) {
                return authResult.unauthorized || NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
            }
            
            const user = authResult.user;

            // Filter hanya jadwal milik tim user yang login
            const myTeam = await prisma.registration.findFirst({
                where: { 
                    participantId: user.id,
                    status: 'APPROVED' 
                }
            });

            if (myTeam) {
                whereCondition = {
                    OR: [
                        { homeTeamId: myTeam.id },
                        { awayTeamId: myTeam.id }
                    ]
                };
            } else {
                // Jika user belum punya tim / belum di-approve, kembalikan jadwal kosong
                return NextResponse.json({ success: true, data: [] }, { status: 200 });
            }
        }

        // 🎯 Tarik pertandingan dari database (Fleksibel: Publik atau Personal)
        const matches = await prisma.match.findMany({
            where: whereCondition,
            include: {
                // Sertakan select data lengkap agar match-verify dan schedule page dapet property-nya
                homeTeam: { select: { id: true, teamName: true, leaderName: true, participantId: true } },
                awayTeam: { select: { id: true, teamName: true, leaderName: true, participantId: true } },
            },
            orderBy: {
                matchNumber: 'asc',
            },
        });

        return NextResponse.json({ success: true, data: matches }, { status: 200 });
    } catch (error) {
        console.error('Error Schedule Engine:', error);
        return NextResponse.json(
            { success: false, message: 'Gagal memuat jadwal pertandingan sirkuit.' },
            { status: 500 }
        );
    }
}