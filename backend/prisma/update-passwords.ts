/**
 * BELOVESPORT — Bulk Password Synchronizer
 * 
 * Path: backend/prisma/update-passwords.ts
 * Deskripsi: Memperbarui seluruh password participant di DB menjadi Bcrypt Hash 'BeloveSport2026!'
 */

import dotenv from 'dotenv';
import path from 'path';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Load Environment Variables
const rootEnvPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: rootEnvPath });
dotenv.config();

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) throw new Error(`[CRITICAL] DATABASE_URL tidak ditemukan di: ${rootEnvPath}`);

const pool = new Pool({ connectionString: dbUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const TARGET_PLAIN_PASSWORD = 'BeloveSport2026!';

async function main() {
  console.log('🔌 [DATABASE] Terhubung ke PostgreSQL.');
  console.log('🚀 [UPDATE] Memulai sinkronisasi massal password participant...\n');

  // 🛡️ 1. Generate Bcrypt Hash dari Password Plaintext
  const hashedPassword = await bcrypt.hash(TARGET_PLAIN_PASSWORD, 10);

  // 🛡️ 2. Update seluruh baris di tabel Participant secara serentak menggunakan Hash
  const result = await prisma.participant.updateMany({
    data: {
      passwordHash: hashedPassword,
      isVerified: true,
    },
  });

  console.log(`✅ [BERHASIL] Total ${result.count} akun participant telah diperbarui dengan Bcrypt Hash!`);
  console.log(`🔑 Password Plaintext Login Peserta: ${TARGET_PLAIN_PASSWORD}`);
}

main()
  .catch((e) => console.error('💥 [ERROR]', e))
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
    console.log('🧹 [TEARDOWN] Disconnect DB aman.');
  });