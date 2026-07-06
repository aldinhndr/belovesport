// Path: src/lib/supabase/requireUser.ts
import { NextResponse } from 'next/server';
import { getParticipantSession } from '@/lib/participant-auth';

export async function requireUser() {
    const session = await getParticipantSession();

    if (!session) {
        return {
            user: null,
            unauthorized: NextResponse.json(
                { success: false, message: 'AKSES DITOLAK: Sesi tidak valid atau telah berakhir.' },
                { status: 401 }
            )
        };
    }

    // Cukup kembalikan id saja, karena email tidak ada di dalam payload token lokal
    return { 
        user: { 
            id: session.participantId 
        }, 
        unauthorized: null 
    };
}