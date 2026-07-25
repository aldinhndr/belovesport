/**
 * BELOVESPORT — Bulk Password Synchronizer
 * 
 * Path: backend/prisma/update-passwords.ts
 * Deskripsi: Memperbarui seluruh password participant di DB menjadi 'Blv2026!'
 */

import dotenv from 'dotenv';
import path from 'path';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

// Load Environment Variables
const rootEnvPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: rootEnvPath });
dotenv.config();

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) throw new Error(`[CRITICAL] DATABASE_URL tidak ditemukan di: ${rootEnvPath}`);

const pool = new Pool({ connectionString: dbUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const TARGET_PASSWORD = 'BeloveSport2026!';

async function main() {
  console.log('🔌 [DATABASE] Terhubung ke PostgreSQL.');
  console.log('🚀 [UPDATE] Memulai sinkronisasi massal password participant...\n');

  // Update seluruh baris di tabel Participant secara serentak
  const result = await prisma.participant.updateMany({
    data: {
      passwordHash: TARGET_PASSWORD,
      isVerified: true,
    },
  });

  console.log(`✅ [BERHASIL] Total ${result.count} akun participant telah diperbarui!`);
  console.log(`🔑 Password Login Terbaru : ${TARGET_PASSWORD}`);
}

main()
  .catch((e) => console.error('💥 [ERROR]', e))
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
    console.log('🧹 [TEARDOWN] Disconnect DB aman.');
  });