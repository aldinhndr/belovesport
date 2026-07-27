// Path: src/app/api/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getParticipantSession } from '@/lib/participant-auth';
import { RegistrationStatus } from '@prisma/client';

const MAX_TEAM_SLOTS = 2; // Batas slot tim per akun

export async function POST(req: NextRequest) {
    try {
        // 🛡️ 1. Proteksi Sesi Login
        const session = await getParticipantSession();
        if (!session || !session.participantId) {
            return NextResponse.json(
                { success: false, message: 'Sesi Anda telah berakhir. Silakan login kembali.' },
                { status: 401 }
            );
        }

        // 🛡️ 2. Cari Data Participant di Database
        const participant = await prisma.participant.findUnique({
            where: { id: session.participantId }
        });

        if (!participant) {
            return NextResponse.json(
                { success: false, message: 'Akun pengguna tidak ditemukan.' },
                { status: 404 }
            );
        }

        // 🛡️ 3. Parse Body Request
        const body = await req.json().catch(() => null);
        if (!body) {
            return NextResponse.json(
                { success: false, message: 'Format data pendaftaran tidak valid.' },
                { status: 400 }
            );
        }

        const {
            leaderName,
            whatsappNumber,
            teamName,
            efootballId,
            domisili,
            device,
            instagramHandle,
            paymentMethod,
            paymentProofUrl,
            profilePictureUrl
        } = body;

        // 🛡️ 4. Validasi Field Wajib (Sesuai schema.prisma)
        if (!teamName || typeof teamName !== 'string' || !teamName.trim()) {
            return NextResponse.json({ success: false, message: 'Nama Tim wajib diisi.' }, { status: 400 });
        }
        if (!efootballId || typeof efootballId !== 'string' || !efootballId.trim()) {
            return NextResponse.json({ success: false, message: 'eFootball ID wajib diisi.' }, { status: 400 });
        }
        if (!whatsappNumber || typeof whatsappNumber !== 'string' || !whatsappNumber.trim()) {
            return NextResponse.json({ success: false, message: 'Nomor WhatsApp wajib diisi.' }, { status: 400 });
        }
        if (!paymentProofUrl) {
            return NextResponse.json({ success: false, message: 'Bukti pembayaran wajib diunggah.' }, { status: 400 });
        }

        // 🛡️ 5. Cek Kuota Slot Tim Akun
        const existingTeamsCount = await prisma.registration.count({
            where: { participantId: participant.id }
        });

        if (existingTeamsCount >= MAX_TEAM_SLOTS) {
            return NextResponse.json(
                { success: false, message: `Anda sudah mencapai batas maksimal ${MAX_TEAM_SLOTS} slot tim.` },
                { status: 400 }
            );
        }

        // 🛡️ 6. Cek Duplikasi Nama Tim
        const existingTeam = await prisma.registration.findFirst({
            where: { teamName: teamName.trim() }
        });

        if (existingTeam) {
            return NextResponse.json(
                { success: false, message: 'Nama Tim ini sudah terdaftar. Silakan pilih nama tim lain.' },
                { status: 400 }
            );
        }

        // 🚀 7. Simpan Registrasi Tim Baru ke Database
        const newRegistration = await prisma.registration.create({
            data: {
                participantId: participant.id,
                teamName: teamName.trim(),
                leaderName: leaderName?.trim() || participant.username,
                email: participant.email, // Menggunakan email participant
                whatsappNumber: whatsappNumber.trim(),
                efootballId: efootballId.trim(),
                domisili: domisili?.trim() || 'Indonesia',
                device: device?.trim() || 'Android',
                instagramHandle: instagramHandle?.trim() || '@',
                paymentMethod: paymentMethod || 'QRIS',
                paymentProofUrl,
                profilePictureUrl: profilePictureUrl || null,
                status: RegistrationStatus.PENDING,
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Pendaftaran tim berhasil dikirim! Menunggu verifikasi admin.',
            data: newRegistration
        }, { status: 201 });

    } catch (error: any) {
        console.error('API Register Team Error:', error);
        return NextResponse.json(
            { success: false, message: 'Terjadi kesalahan sistem internal.' },
            { status: 500 }
        );
    }
}