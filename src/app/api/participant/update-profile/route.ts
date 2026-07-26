// Path: src/app/api/participant/update-profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'belovesport-secret-key-2026';

export async function PUT(req: NextRequest) {
    try {
        // 1. Ambil Token dari Cookies secara Aman
        const cookieStore = await cookies();
        const token = cookieStore.get('participant_session')?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: 'Sesi login tidak ditemukan. Silakan login kembali.' },
                { status: 401 }
            );
        }

        // 2. Decode Token JWT
        let decoded: any;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch {
            return NextResponse.json(
                { success: false, message: 'Sesi telah kadaluarsa. Silakan login kembali.' },
                { status: 401 }
            );
        }

        // Ambil ID peserta secara fleksibel dari berbagai bentuk payload
        const participantId = decoded.participantId || decoded.id || decoded.userId || decoded.sub;

        if (!participantId) {
            return NextResponse.json(
                { success: false, message: 'Sesi tidak valid / ID peserta tidak ditemukan.' },
                { status: 400 }
            );
        }

        // 3. Baca Body Request
        const body = await req.json();
        const { username, currentPassword, newPassword } = body;

        // 4. Cari Data Peserta di Database
        const participant = await prisma.participant.findUnique({
            where: { id: participantId },
        });

        if (!participant) {
            return NextResponse.json(
                { success: false, message: 'Data peserta tidak ditemukan di database.' },
                { status: 404 }
            );
        }

        // 5. Cek Duplikasi Username Jika Username Diubah
        if (username && username !== participant.username) {
            const existingUsername = await prisma.participant.findFirst({
                where: { username },
            });

            if (existingUsername) {
                return NextResponse.json(
                    { success: false, message: 'Username/Nickname tersebut sudah digunakan akun lain.' },
                    { status: 400 }
                );
            }
        }

        // 6. Siapkan Data Update
        const updateData: { username?: string; passwordHash?: string } = {};

        if (username) {
            updateData.username = username;
        }

        // 7. Logic Perubahan Password
        if (newPassword) {
            if (!currentPassword) {
                return NextResponse.json(
                    { success: false, message: 'Password saat ini wajib diisi jika ingin mengubah password.' },
                    { status: 400 }
                );
            }

            // Verifikasi Password Lama
            let isPasswordValid = false;
            if (participant.passwordHash.startsWith('$2a$') || participant.passwordHash.startsWith('$2b$')) {
                isPasswordValid = await bcrypt.compare(currentPassword, participant.passwordHash);
            } else {
                // Fallback untuk akun testing lama bertipe plain-text
                isPasswordValid = participant.passwordHash === currentPassword;
            }

            if (!isPasswordValid) {
                return NextResponse.json(
                    { success: false, message: 'Password saat ini yang Koko masukkan salah.' },
                    { status: 400 }
                );
            }

            // Hash Password Baru
            updateData.passwordHash = await bcrypt.hash(newPassword, 12);
        }

        // 8. Eksekusi Update ke Database Prisma/Neon
        const updatedParticipant = await prisma.participant.update({
            where: { id: participantId },
            data: updateData,
        });

        // 9. Re-generate Cookie Session Baru jika Username Berubah
        const newToken = jwt.sign(
            {
                id: updatedParticipant.id,
                participantId: updatedParticipant.id,
                email: updatedParticipant.email,
                username: updatedParticipant.username,
                role: 'PARTICIPANT',
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        const response = NextResponse.json({
            success: true,
            message: 'Profil dan password berhasil diperbarui!',
            data: {
                username: updatedParticipant.username,
                email: updatedParticipant.email,
            },
        });

        response.cookies.set('participant_session', newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        });

        return response;

    } catch (error: any) {
        console.error('ERROR in PUT /api/participant/update-profile:', error);
        return NextResponse.json(
            { success: false, message: 'Terjadi kesalahan server saat memperbarui profil.' },
            { status: 500 }
        );
    }
}