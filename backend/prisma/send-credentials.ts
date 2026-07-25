/**
 * BELOVESPORT — Resend Mass Credential Dispatcher
 * 
 * Path: backend/prisma/send-credentials.ts
 * Deskripsi: Mengambil seluruh data peserta dari DB dan mengirimkan 1 email per Gmail
 * menggunakan Resend API driver.
 */

import dotenv from 'dotenv';
import path from 'path';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { sendCredentialsEmail } from '../../src/lib/email';

// 1. Load Environment Variables
const rootEnvPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: rootEnvPath });
dotenv.config();

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) throw new Error(`[CRITICAL] DATABASE_URL tidak ditemukan pada: ${rootEnvPath}`);

// 2. Setup Driver Adapter Prisma v7
const pool = new Pool({ connectionString: dbUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const DEFAULT_PLAIN_PASSWORD = 'BeloveSport2026!';

// Delay 600ms per email untuk mematuhi Rate Limit Resend API (Maks 2 req/detik)
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  console.log('🔌 [DATABASE] Terhubung ke PostgreSQL via Prisma v7 Driver Adapter.');
  console.log('🚀 [RESEND MAILER] Mengambil seluruh data peserta per akun Gmail...\n');

  // Ambil peserta beserta daftar tim yang didaftarkan
  const participants = await prisma.participant.findMany({
    include: {
      registrations: true,
    },
  });

  if (participants.length === 0) {
    console.log('⚠️ Tidak ada data peserta yang ditemukan di database.');
    return;
  }

  console.log(`📊 Ditemukan total ${participants.length} akun Gmail di database.`);
  console.log('────────────────────────────────────────────────────────────');

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < participants.length; i++) {
    const user = participants[i];
    const registeredTeams = user.registrations.map((r) => ({
      teamName: r.teamName,
      efootballId: r.efootballId,
    }));

    if (registeredTeams.length === 0) {
      console.warn(`⚠️ [SKIP] User ${user.email} tidak memiliki registrasi tim.`);
      continue;
    }

    try {
      // Kirim via Resend SDK
      await sendCredentialsEmail(
        user.email,
        user.username,
        DEFAULT_PLAIN_PASSWORD,
        registeredTeams
      );

      console.log(`✅ [TERKIRIM ${i + 1}/${participants.length}] Email: ${user.email} | User: @${user.username} | Slot: ${registeredTeams.length}`);
      successCount++;

      // Jeda rate-limit Resend
      await sleep(600);
    } catch (err) {
      console.error(`❌ [GAGAL ${i + 1}/${participants.length}] Email: ${user.email}:`, err);
      failCount++;
    }
  }

  console.log(`\n🎉 [SELESAI PENGIRIMAN EMAIL]`);
  console.log(`   - Sukses Terkirim : ${successCount}`);
  console.log(`   - Gagal Terkirim  : ${failCount}`);
}

main()
  .catch((e) => console.error('💥 [CRITICAL MAILER ERROR]', e))
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
    console.log('🧹 [TEARDOWN] Koneksi database dan Resend runner diselesaikan secara aman.');
  });