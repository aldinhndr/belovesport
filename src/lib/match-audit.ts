import { randomUUID } from 'crypto';
import { prisma } from '@/lib/prisma';

export type MatchAuditAction =
  | 'SCORE_SUBMITTED'
  | 'SCORE_APPROVED'
  | 'SCORE_REJECTED'
  | 'SCHEDULE_UPDATED'
  | 'MATCH_STARTED'
  | 'CHAT_MESSAGE_SENT';

export type MatchAuditActorRole = 'participant' | 'admin' | 'system';

export interface MatchAuditEntry {
  matchId: string;
  action: MatchAuditAction;
  actorId?: string | null;
  actorRole: MatchAuditActorRole;
  details?: string | null;
}

export async function createMatchAuditLog(entry: MatchAuditEntry) {
  try {
    await (prisma as any).$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "match_audit_logs" (
        "id" TEXT PRIMARY KEY,
        "match_id" TEXT NOT NULL,
        "action" TEXT NOT NULL,
        "actor_id" TEXT,
        "actor_role" TEXT NOT NULL,
        "details" TEXT,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch {
    // Ignore table creation errors and let Prisma create fallback path below.
  }

  try {
    await (prisma as any).matchAuditLog.create({
      data: {
        id: randomUUID(),
        matchId: entry.matchId,
        action: entry.action,
        actorId: entry.actorId ?? null,
        actorRole: entry.actorRole,
        details: entry.details ?? null,
      },
    });
  } catch (error) {
    console.error('Failed to write match audit log:', error);
  }
}
