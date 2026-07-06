-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('SCHEDULED', 'PLAYING', 'WAITING_VERIFICATION', 'COMPLETED');

-- CreateTable
CREATE TABLE "registrations" (
    "id" TEXT NOT NULL,
    "team_name" TEXT NOT NULL,
    "leader_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "whatsapp_number" TEXT NOT NULL,
    "efootball_id" TEXT NOT NULL,
    "domisili" TEXT NOT NULL,
    "device" TEXT NOT NULL,
    "instagram_handle" TEXT NOT NULL,
    "payment_method" TEXT NOT NULL,
    "payment_proof_url" TEXT NOT NULL,
    "status" "RegistrationStatus" NOT NULL DEFAULT 'PENDING',
    "rejection_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vouchers" (
    "id" BIGSERIAL NOT NULL,
    "registration_id" TEXT NOT NULL,
    "voucher_code" TEXT NOT NULL DEFAULT 'BLS50K',
    "is_used" BOOLEAN NOT NULL DEFAULT false,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vouchers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matches" (
    "id" TEXT NOT NULL,
    "round_number" INTEGER NOT NULL,
    "match_number" INTEGER NOT NULL,
    "home_team_id" TEXT,
    "away_team_id" TEXT,
    "home_score" INTEGER,
    "away_score" INTEGER,
    "winner_id" TEXT,
    "match_status" "MatchStatus" NOT NULL DEFAULT 'SCHEDULED',
    "scheduled_time" TIMESTAMP(3) NOT NULL,
    "screenshot_result_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "vouchers" ADD CONSTRAINT "vouchers_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "registrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_home_team_id_fkey" FOREIGN KEY ("home_team_id") REFERENCES "registrations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_away_team_id_fkey" FOREIGN KEY ("away_team_id") REFERENCES "registrations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_winner_id_fkey" FOREIGN KEY ("winner_id") REFERENCES "registrations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
