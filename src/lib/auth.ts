import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET belum di-set di .env');
}

const secretKey = new TextEncoder().encode(JWT_SECRET);

export const SESSION_COOKIE_NAME = 'admin_session';
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 jam (detik)

export interface AdminSessionPayload {
  username: string;
  role: 'admin';
}

export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function createSessionToken(payload: AdminSessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secretKey);
}

export async function verifySessionToken(token: string): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    if (payload.role !== 'admin') return null; // ← tambahkan baris ini
    return payload as unknown as AdminSessionPayload;
  } catch {
    // Token invalid, expired, atau di-tampering — anggap tidak login
    return null;
  }
}