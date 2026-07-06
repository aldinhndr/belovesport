import { NextResponse } from 'next/server';
import { PARTICIPANT_SESSION_COOKIE } from '@/lib/participant-auth';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(PARTICIPANT_SESSION_COOKIE, '', { path: '/', maxAge: 0 });
  return response;
}