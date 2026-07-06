// Path: src/app/api/tournament/chat/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getParticipantSession } from '@/lib/participant-auth'; // Menggunakan Auth Lokal Koko

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const matchId = searchParams.get('matchId');

    if (!matchId) {
        return NextResponse.json({ success: false, message: 'Match ID tidak ditemukan.' }, { status: 400 });
    }

    try {
        const chats = await prisma.matchChat.findMany({
            where: { matchId },
            orderBy: { createdAt: 'asc' } // Urutkan dari yang terlama ke terbaru
        });
        return NextResponse.json({ success: true, data: chats }, { status: 200 });
    } catch (error) {
        console.error('GET Chat Error:', error);
        return NextResponse.json({ success: false, message: 'Gagal memuat obrolan.' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    // 🛡️ 1. Validasi Sesi Lokal Koko
    const session = await getParticipantSession();
    
    if (!session) {
        return NextResponse.json(
            { success: false, message: 'AKSES DITOLAK: Sesi tidak valid atau telah berakhir.' },
            { status: 401 }
        );
    }

    try {
        const body = await request.json();
        const { matchId, message } = body;

        if (!matchId || !message) {
            return NextResponse.json({ success: false, message: 'Pesan tidak boleh kosong.' }, { status: 400 });
        }

        // 2. Tarik username peserta dari database (untuk ditampilkan di bubble chat)
        const participant = await prisma.participant.findUnique({
            where: { id: session.participantId },
            select: { username: true }
        });

        if (!participant) {
            return NextResponse.json({ success: false, message: 'User tidak ditemukan.' }, { status: 404 });
        }

        // 3. Simpan pesan ke database dengan ID dan Nama Pengirim yang sah
        const newChat = await prisma.matchChat.create({
            data: {
                matchId,
                senderId: session.participantId,
                senderName: participant.username,
                message: message
            }
        });

        return NextResponse.json({ success: true, data: newChat }, { status: 200 });

    } catch (error) {
        console.error('POST Chat Error:', error);
        return NextResponse.json(
            { success: false, message: 'Terjadi kesalahan sistem saat mengirim pesan.' },
            { status: 500 }
        );
    }
}