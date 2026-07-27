/**
 * BELOVESPORT — Seed Participants Script (Production Ready)
 * 
 * Path: backend/prisma/seed-participants.ts
 * Engine: Native Prisma ORM v7 Driver Adapter (@prisma/adapter-pg + pg.Pool)
 */

import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, RegistrationStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

// 1. Pemuatan Variabel Lingkungan
const rootEnvPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: rootEnvPath });
dotenv.config();

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error(`[CRITICAL ERROR] DATABASE_URL tidak ditemukan pada path: ${rootEnvPath}`);
}

// 2. Inisialisasi PostgreSQL Native Connection Pool & Prisma v7 Driver Adapter
const pool = new Pool({ 
  connectionString: dbUrl,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Password default standar sistem
const DEFAULT_PLAIN_PASSWORD = 'BeloveSport2026!';

// Helper: Sanitasi input dari berkas CSV
function clean(text: string | undefined): string {
  if (!text) return '';
  return text.replace(/^"(.*)"$/, '$1').trim();
}

// Helper: Generator Username Unik (Bebas Bentrokan/Collision)
async function generateUniqueUsername(leaderName: string, email: string): Promise<string> {
  let baseUsername = leaderName.trim().split(/\s+/)[0].toLowerCase().replace(/[^a-z0-9]/g, '');
  if (baseUsername.length < 3) {
    baseUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  let uniqueUsername = baseUsername;
  let counter = 1;

  // Cek keberadaan di DB, jika bentrok tambahkan sufiks angka (misal: rian1, rian2)
  while (await prisma.participant.findUnique({ where: { username: uniqueUsername } })) {
    uniqueUsername = `${baseUsername}${counter}`;
    counter++;
  }

  return uniqueUsername;
}

async function main() {
  console.log('🔌 [DATABASE] Pool koneksi PostgreSQL native terhubung via Prisma v7 Driver Adapter.');
  console.log('🚀 [INGESTION] Memuat berkas CSV pendaftaran...\n');

  const csvPath = path.join(__dirname, 'Formulir Pendaftaran Turnamen eFootball.csv');
  if (!fs.existsSync(csvPath)) {
    throw new Error(`[FILE NOT FOUND] Berkas CSV tidak ditemukan pada: ${csvPath}`);
  }

  const content = fs.readFileSync(csvPath, 'utf-8');
  const rawLines = content.split(/\r?\n/);
  const dataRows = rawLines.filter((line) => line.startsWith('"2026/'));

  // 🛡️ Pre-generate Bcrypt Hash sekali di awal untuk performa maksimal
  const hashedPassword = await bcrypt.hash(DEFAULT_PLAIN_PASSWORD, 10);

  let createdParticipants = 0;
  let createdRegistrations = 0;

  for (let idx = 0; idx < dataRows.length; idx++) {
    const row = dataRows[idx];
    const columns = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || row.split(',');

    const email = clean(columns[1]).toLowerCase();
    const leaderName = clean(columns[2]);
    const whatsappNumber = clean(columns[3]);
    const domisili = clean(columns[4]);
    const team1 = clean(columns[5]);
    const team2 = clean(columns[6]);
    const efootballId = clean(columns[7]);
    const device = clean(columns[8]);
    const instagramHandle = clean(columns[9]);
    const profilePictureUrl = clean(columns[10]);
    const paymentMethod = clean(columns[11]) || 'QRIS';
    const paymentProofUrl = clean(columns[12]);

    if (!email || !team1) {
      console.warn(`⚠️ [SKIP] Baris ${idx + 1}: Field utama (Email/Nama Tim 1) kosong.`);
      continue;
    }

    try {
      // A. Cari atau Buat Akun Participant
      let participant = await prisma.participant.findUnique({
        where: { email },
      });

      if (!participant) {
        // Generate username unik yang aman dari constraint violation
        const username = await generateUniqueUsername(leaderName, email);

        participant = await prisma.participant.create({
          data: {
            email,
            username,
            passwordHash: hashedPassword, // 🛡️ Bcrypt Hash Aman!
            isVerified: true,
          },
        });
        createdParticipants++;
      }

      // Helper pendaftaran entri tim
      const registerTeam = async (teamName: string) => {
        const existingReg = await prisma.registration.findFirst({
          where: { teamName },
        });

        if (!existingReg) {
          await prisma.registration.create({
            data: {
              teamName,
              leaderName,
              email,
              whatsappNumber,
              efootballId,
              domisili,
              device,
              instagramHandle,
              paymentMethod,
              paymentProofUrl,
              profilePictureUrl,
              participantId: participant!.id,
              status: RegistrationStatus.APPROVED,
            },
          });
          createdRegistrations++;
        }
      };

      // B. Registrasi Slot Utama (Tim 1)
      await registerTeam(team1);

      // C. Registrasi Slot Tambahan (Tim 2)
      if (team2 && team2 !== '-' && team2.toLowerCase() !== 'nan') {
        await registerTeam(team2);
      }

      console.log(`✅ [BERHASIL] ${leaderName} (${email}) -> Username: @${participant.username} | Tim: ${team1}`);
    } catch (err) {
      console.error(`❌ [ERROR] Gagal memproses baris ${idx + 1} (${email}):`, err);
    }
  }

  console.log(`\n🎉 [SELESAI SINKRONISASI]`);
  console.log(`   - Akun Participant Baru : ${createdParticipants}`);
  console.log(`   - Registrasi Tim Baru    : ${createdRegistrations}`);
  console.log(`   - Password Default      : ${DEFAULT_PLAIN_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error('💥 [CRITICAL SEEDER ERROR]', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
    console.log('🧹 [TEARDOWN] Disconnect DB dan pg.Pool aman.');
  });