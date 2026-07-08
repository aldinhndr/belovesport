// Path: backend/prisma/seed.ts
import { PrismaClient, RegistrationStatus } from '@prisma/client';

// 🎯 PAKSA PRISMA BACA URL: Masukkan datasource URL langsung ke konstruktor
const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Memulai proses injeksi 64 Tim Dummy...');

    // 1. Bersihkan data Match & Registrasi lama agar simulasi bersih
    await prisma.matchChat.deleteMany();
    await prisma.match.deleteMany();
    await prisma.voucher.deleteMany();
    await prisma.registration.deleteMany();
    console.log('🧹 Database dibersihkan dari data uji coba sebelumnya.');

    // 2. Siapkan Array Data 64 Tim
    const dummyTeams = [];
    for (let i = 1; i <= 64; i++) {
        dummyTeams.push({
            teamName: `Tim Esports ${i}`,
            leaderName: `Kapten Dummy ${i}`,
            email: `dummy${i}@belovesport.com`,
            whatsappNumber: `081234567${i.toString().padStart(3, '0')}`,
            efootballId: `EFOOT-${i.toString().padStart(4, '0')}`,
            domisili: 'Bandar Lampung',
            device: i % 2 === 0 ? 'MOBILE' : 'PC/CONSOLE',
            instagramHandle: `@timsports${i}`,
            paymentMethod: 'DUMMY_SEED',
            paymentProofUrl: 'https://placehold.co/600x400/png?text=Bukti+Dummy',
            status: RegistrationStatus.APPROVED,
        });
    }

    // 3. Masukkan ke Database secara Massal (Bulk Insert)
    const result = await prisma.registration.createMany({
        data: dummyTeams,
        skipDuplicates: true,
    });

    console.log(`✅ Berhasil menyuntikkan ${result.count} tim ke database!`);

    // 4. Buat 1 Tim Khusus (Milik Koko)
    await prisma.registration.create({
        data: {
            teamName: 'BELOVE PRIME FC',
            leaderName: 'Aldin Halawa',
            email: 'aldinhalawa2023@gmail.com', // GANTI DENGAN EMAIL LOGIN KOKO!
            whatsappNumber: '0811111111',
            efootballId: 'ALDIN-PRIME',
            domisili: 'Bandar Lampung',
            device: 'MOBILE',
            instagramHandle: '@aldin.halawa',
            paymentMethod: 'BYPASS_ADMIN',
            paymentProofUrl: 'https://placehold.co/600x400/png?text=Bukti+Admin',
            status: RegistrationStatus.APPROVED,
        }
    });
    console.log('👑 Tim Utama (Belove Prime FC) berhasil dibuat untuk pengujian Profil!')
}

main()
    .catch((e) => {
        console.error('❌ Gagal menjalankan seeder:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });