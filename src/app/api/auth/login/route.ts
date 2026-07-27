// Path: src/app/api/auth/login/route.ts
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
        const { identifier, password } = await req.json();

        if (!identifier || !password) {
            return NextResponse.json(
                { success: false, message: 'Email/Username dan password wajib diisi.' },
                { status: 400 }
            );
        }

        // 1. Cari Peserta berdasarkan Email atau Username
        const participant = await prisma.participant.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { username: identifier }
                ]
            }
        });

        if (!participant) {
            return NextResponse.json(
                { success: false, message: 'Akun tidak ditemukan. Periksa kembali email/username Anda.' },
                { status: 401 }
            );
        }

        // 2. Verifikasi Password Hash
        const isPasswordValid = await bcrypt.compare(password, participant.passwordHash);
        if (!isPasswordValid) {
             return NextResponse.json(
                { success: false, message: 'Password salah. Silakan coba lagi.' },
                { status: 401 }
            );
        }

        // 3. Cek apakah peserta sudah terdaftar di tabel Registration (memiliki tim)
        const userRegistration = await prisma.registration.findFirst({
            where: { participantId: participant.id }
        });

        // 🚀 KUNCI KONSISTENSI SSOT: Gunakan createParticipantSessionToken
        const token = await createParticipantSessionToken({
            participantId: participant.id,
            username: participant.username,
            role: 'participant'
        });

        const response = NextResponse.json({
            success: true,
            message: 'Login berhasil.',
            hasTeam: Boolean(userRegistration),
            data: {
                id: participant.id,
                username: participant.username,
                email: participant.email
            }
        });

        // Set cookie
        response.cookies.set(PARTICIPANT_SESSION_COOKIE, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: PARTICIPANT_SESSION_MAX_AGE,
            path: '/',
        });

        return response;

    } catch (error) {
        console.error('Login Error:', error);
        return NextResponse.json(
            { success: false, message: 'Terjadi kesalahan sistem internal.' },
            { status: 500 }
        );
    }
}