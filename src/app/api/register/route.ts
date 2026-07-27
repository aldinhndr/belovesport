// Path: src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { 
    createParticipantSessionToken, 
    PARTICIPANT_SESSION_COOKIE, 
    PARTICIPANT_SESSION_MAX_AGE 
} from '@/lib/participant-auth';

export async function POST(req: NextRequest) {
    try {
        const { username, email, password } = await req.json();

        // 🛡️ 1. Validasi Input Dasar
        if (!username || !email || !password) {
            return NextResponse.json(
                { success: false, message: 'Username, email, dan password wajib diisi.' },
                { status: 400 }
            );
        }

        // 🛡️ 2. Cek Duplikasi Email
        const existingEmail = await prisma.participant.findUnique({
            where: { email },
        });

        if (existingEmail) {
            return NextResponse.json(
                { success: false, message: 'Email ini sudah terdaftar. Silakan langsung login.' },
                { status: 400 }
            );
        }

        // 🛡️ 3. Cek Duplikasi Username
        const existingUsername = await prisma.participant.findFirst({
            where: { username },
        });

        if (existingUsername) {
            return NextResponse.json(
                { success: false, message: 'Username/Nickname sudah terpakai. Pilih username lain.' },
                { status: 400 }
            );
        }

        // 🛡️ 4. Mitigasi OWASP A02: Hash Password secara aman
        const hashedPassword = await bcrypt.hash(password, 10);

        // 🛡️ 5. Buat Akun Peserta Baru
        const newParticipant = await prisma.participant.create({
            data: {
                username,
                email,
                passwordHash: hashedPassword,
                isVerified: true,
            },
        });

        // 🚀 KUNCI PERBAIKAN BUG 1 & 2:
        // Gunakan fungsi SSOT dari participant-auth.ts agar payload key (participantId)
        // dan role casing ('participant') terjamin 100% konsisten secara terpusat!
        const token = await createParticipantSessionToken({
            participantId: newParticipant.id,
            username: newParticipant.username,
            role: 'participant',
        });

        const response = NextResponse.json({
            success: true,
            message: 'Registrasi berhasil dan langsung login.',
            data: {
                id: newParticipant.id,
                username: newParticipant.username,
                email: newParticipant.email,
            },
        });

        // 🛡️ 6. Set Cookie Sesi Menggunakan Konstanta Terpusat
        response.cookies.set(PARTICIPANT_SESSION_COOKIE, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: PARTICIPANT_SESSION_MAX_AGE,
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Register Error:', error);
        return NextResponse.json(
            { success: false, message: 'Terjadi kesalahan sistem internal.' },
            { status: 500 }
        );
    }
}