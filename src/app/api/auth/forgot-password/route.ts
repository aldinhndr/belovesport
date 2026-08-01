// Path: src/app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { success: false, message: 'Payload data tidak valid.' },
        { status: 400 }
      );
    }

    const { email } = body;

    if (!email || typeof email !== 'string' || !email.trim()) {
      return NextResponse.json(
        { success: false, message: 'Email wajib diisi.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Cek keberadaan email di database
    const participant = await prisma.participant.findUnique({
      where: { email: cleanEmail },
      select: { id: true, email: true },
    });

    if (!participant) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email ini tidak terdaftar di sistem Belovesport.',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Email terdaftar! Silakan masukkan password baru kamu.',
      data: { email: participant.email },
    }, { status: 200 });

  } catch (error) {
    console.error('Forgot Password Check API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan sistem internal.' },
      { status: 500 }
    );
  }
}