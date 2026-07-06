import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// MENGAMBIL DAFTAR VOUCHER
export async function GET() {
  try {
    const vouchers = await prisma.voucher.findMany({
      include: {
        registration: { select: { teamName: true, leaderName: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Amankan BigInt agar tidak error JSON.stringify
    const safeVouchers = vouchers.map(v => ({
      ...v,
      id: v.id.toString(), // Konversi BigInt ke String
    }));

    return NextResponse.json({ success: true, data: safeVouchers });
  } catch (error: any) {
    console.error('GET Vouchers Error:', error);
    return NextResponse.json({ success: false, message: 'Gagal memuat data voucher.' }, { status: 500 });
  }
}

// MASS GENERATE VOUCHER BARU KUSTOM
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { registrationId, code } = body;

    if (!registrationId) {
      return NextResponse.json({ success: false, message: 'Registration ID wajib diisi.' }, { status: 400 });
    }

    const newVoucher = await prisma.voucher.create({
      data: {
        registrationId,
        voucherCode: code || 'BLS50K', // Fallback kode default sesuai schema 
        isUsed: false
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Voucher berhasil didistribusikan ke tim!',
      data: { ...newVoucher, id: newVoucher.id.toString() }
    });
  } catch (error: any) {
    console.error('POST Voucher Error:', error);
    return NextResponse.json({ success: false, message: 'Gagal membuat voucher baru.' }, { status: 500 });
  }
}