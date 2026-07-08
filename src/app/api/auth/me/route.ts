// Path: src/app/api/auth/me/route.ts
import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/supabase/requireUser';

export async function GET() {
    try {
        const authResult = await requireUser();
        
        if (authResult.unauthorized || !authResult.user) {
            return NextResponse.json({ success: false, user: null }, { status: 401 });
        }

        return NextResponse.json({ 
            success: true, 
            user: { id: authResult.user.id } 
        });
    } catch (error) {
        return NextResponse.json({ success: false, user: null }, { status: 500 });
    }
}