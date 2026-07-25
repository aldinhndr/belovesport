/**
 * BELOVESPORT — WhatsApp Mass Credential Dispatcher
 * 
 * Path: backend/prisma/send-wa-credentials.ts
 * Engine: Fonnte WhatsApp Gateway API (https://api.fonnte.com/send)
 */

import dotenv from 'dotenv';
import path from 'path';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

// 1. Pemuatan Variabel Lingkungan
const rootEnvPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: rootEnvPath });
dotenv.config();

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) throw new Error(`[CRITICAL] DATABASE_URL tidak ditemukan pada: ${rootEnvPath}`);

const waApiKey = process.env.WHATSAPP_API_KEY;
if (!waApiKey) {
  throw new Error('❌ [CRITICAL ERROR] WHATSAPP_API_KEY (Fonnte) tidak ditemukan di file .env!');
}

// 2. Setup PostgreSQL Native Connection Pool & Prisma v7 Driver Adapter
const pool = new Pool({ connectionString: dbUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const DEFAULT_PLAIN_PASSWORD = 'BeloveSport2026!';
const LOGIN_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://belovesport.com/login';

// Helper: Format Nomor HP ke standar Internasional (62...)
function formatPhone(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  }
  return cleaned;
}

// Helper: Delay acak untuk meniru perilaku manusia (Human Typing Simulation)
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Helper: Pengirim HTTP Request ke Fonnte API
async function sendFonnteWA(to: string, message: string): Promise<boolean> {
  const formattedPhone = formatPhone(to);

  try {
    const response = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        Authorization: waApiKey!,
      },
      body: new URLSearchParams({
        target: formattedPhone,
        message: message,
        countryCode: '62',
      }),
    });

    const result = await response.json();
    if (!result.status) {
      console.error(`❌ [FONNTE REJECTED] (${formattedPhone}):`, result.reason || result);
      return false;
    }
    return true;
  } catch (error) {
    console.error(`💥 [NETWORK ERROR] Gagal menghubungi Fonnte API untuk ${formattedPhone}:`, error);
    return false;
  }
}

async function main() {
  console.log('🔌 [DATABASE] Terhubung ke PostgreSQL via Prisma v7 Driver Adapter.');
  console.log('🚀 [WA DISPATCHER] Mengambil seluruh data pendaftar dari database...\n');

  // Query seluruh Participant beserta Registrasi Tim
  const participants = await prisma.participant.findMany({
    include: {
      registrations: true,
    },
  });

  if (participants.length === 0) {
    console.log('⚠️ Tidak ada data peserta yang ditemukan di database.');
    return;
  }

  console.log(`📊 Ditemukan total ${participants.length} akun peserta di database.`);
  console.log('────────────────────────────────────────────────────────────');

  let successCount = 0;
  let failCount = 0;
  let skipCount = 0;

  for (let i = 0; i < participants.length; i++) {
    const user = participants[i];
    let registeredTeams = user.registrations;

    // Fallback query jika relasi belum terikat sempurna
    if (registeredTeams.length === 0) {
      registeredTeams = await prisma.registration.findMany({
        where: { email: user.email },
      });
    }

    if (registeredTeams.length === 0) {
      console.warn(`⚠️ [SKIP ${i + 1}/${participants.length}] User ${user.email} tidak memiliki data tim.`);
      skipCount++;
      continue;
    }

    // Ambil detail kontak dari registrasi pertama
    const primaryReg = registeredTeams[0];
    const rawPhone = primaryReg.whatsappNumber;
    const leaderName = primaryReg.leaderName || 'Manager';
    const teamNames = registeredTeams.map((t) => t.teamName).join(' & ');

    if (!rawPhone || rawPhone.trim() === '') {
      console.warn(`⚠️ [SKIP ${i + 1}/${participants.length}] User ${user.email} tidak memiliki nomor WA.`);
      skipCount++;
      continue;
    }

    // Susun Template Pesan WhatsApp Resmi BELOVESPORT
    const waMessage =
      `*TOURNAMENT BELOVESPORT 2026 — S1*\n\n` +
      `Halo *${leaderName}*,\n` +
      `Selamat! Pendaftaran Tim *${teamNames}* telah resmi *TERVERIFIKASI* oleh Admin.\n\n` +
      `Slot turnamen nasional Anda telah aman. Saat ini akun Command Center Anda telah aktif sepenuhnya.\n\n` +
      `🔑 *KREDENSIAL AKSES LOGIN PORTAL:*\n` +
      `• Username: \`@${user.username.replace('@', '')}\`\n` +
      `• Email: \`${user.email}\`\n` +
      `• Password: \`${DEFAULT_PLAIN_PASSWORD}\`\n\n` +
      `_Catatan: Silakan gunakan Email/Username dan Password di atas untuk masuk._\n\n` +
      `🌐 *LINK AKSES DASBOR:* \n` +
      `${LOGIN_URL}\n\n` +
      `⚠️ *PENTING:* Demi keamanan akun tim Anda, segera ganti password default di atas melalui menu *Edit Profil* setelah berhasil masuk pertama kali.\n\n` +
      `_Pesan ini dikirim otomatis oleh sistem keamanan BELOVESPORT._`;

    const isSuccess = await sendFonnteWA(rawPhone, waMessage);

    if (isSuccess) {
      console.log(
        `✅ [WA TERKIRIM ${i + 1}/${participants.length}] Ke: ${rawPhone} (${leaderName}) | Tim: ${teamNames}`
      );
      successCount++;
    } else {
      console.error(
        `❌ [WA GAGAL ${i + 1}/${participants.length}] Ke: ${rawPhone} (${user.email})`
      );
      failCount++;
    }

    // Rate limiting: Jeda 2.5 - 3.5 detik per pesan (Random delay)
    const delay = Math.floor(Math.random() * 1000) + 2500;
    await sleep(delay);
  }

  console.log(`\n🎉 [SELESAI BROADCAST WHATSAPP]`);
  console.log(`   - Berhasil Terkirim : ${successCount}`);
  console.log(`   - Gagal Terkirim    : ${failCount}`);
  console.log(`   - Terlewati (Skip)  : ${skipCount}`);
}

main()
  .catch((e) => console.error('💥 [CRITICAL WA MAILER ERROR]', e))
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
    console.log('🧹 [TEARDOWN] Disconnect DB dan Fonnte runner aman.');
  });