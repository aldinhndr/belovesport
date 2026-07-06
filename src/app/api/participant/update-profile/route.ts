// Path: src/app/api/participant/update-profile/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getParticipantSession } from '@/lib/participant-auth';

export async function PUT(request: Request) {
    // 🛡️ 1. Proteksi Sesi: Pastikan yang menembak API sudah login
    const session = await getParticipantSession();
    if (!session) {
        return NextResponse.json(
            { success: false, message: 'AKSES DITOLAK: Sesi login Koko telah berakhir.' },
            { status: 401 }
        );
    }

    try {
        const body = await request.json();
        const { username } = body;

        // 🛡️ 2. Validasi Input Dasar
        if (!username || username.trim().length < 3) {
            return NextResponse.json(
                { success: false, message: 'Username minimal harus terdiri dari 3 karakter.' },
                { status: 400 }
            );
        }

        const cleanUsername = username.trim();

        // 🛡️ 3. Validasi Keunikan: Pastikan username tidak bentrok dengan peserta lain
        const existingUser = await prisma.participant.findFirst({
            where: {
                username: {
                    equals: cleanUsername,
                    mode: 'insensitive' // Tidak sensitif huruf kapital (case-insensitive)
                },
                NOT: {
                    id: session.participantId // Kecuali ID milik user ini sendiri
                }
            }
        });

        if (existingUser) {
            return NextResponse.json(
                { success: false, message: 'Username/Nickname sudah digunakan oleh peserta lain.' },
                { status: 400 }
            );
        }

        // 🚀 4. Eksekusi Pembaruan ke Database
        const updatedParticipant = await prisma.participant.update({
            where: { id: session.participantId },
            data: { username: cleanUsername },
            select: {
                id: true,
                username: true,
                email: true
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Profil sukses diperbarui!',
            data: updatedParticipant
        }, { status: 200 });

    } catch (error: any) {
        console.error('Error PUT Update Profile:', error);
        return NextResponse.json(
            { success: false, message: 'Terjadi kegagalan sistem internal saat memperbarui data.' },
            { status: 500 }
        );
    }
}