import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET belum di-set di .env');

const secretKey = new TextEncoder().encode(JWT_SECRET);

export const PARTICIPANT_SESSION_COOKIE = 'participant_session';
export const PARTICIPANT_SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 hari

export interface ParticipantSessionPayload {
  participantId: string;
  username: string;
  role: 'participant';
}

export async function createParticipantSessionToken(payload: ParticipantSessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${PARTICIPANT_SESSION_MAX_AGE}s`)
    .sign(secretKey);
}

export async function verifyParticipantSessionToken(token: string): Promise<ParticipantSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    if (payload.role !== 'participant') return null; // cegah token admin disalahgunakan di sini
    return payload as unknown as ParticipantSessionPayload;
  } catch {
    return null;
  }
}

export async function getParticipantSession(): Promise<ParticipantSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(PARTICIPANT_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyParticipantSessionToken(token);
}