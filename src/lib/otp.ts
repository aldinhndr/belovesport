import { prisma } from './prisma';

const OTP_EXPIRY_MINUTES = 5;

function generateOtpCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export async function createOtp(identifier: string, purpose: 'REGISTRATION' | 'PASSWORD_RESET') {
  const code = generateOtpCode();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await prisma.otpCode.create({ data: { identifier, code, purpose, expiresAt } });
  return code;
}

export async function verifyOtp(
  identifier: string,
  code: string,
  purpose: 'REGISTRATION' | 'PASSWORD_RESET'
): Promise<boolean> {
  const otp = await prisma.otpCode.findFirst({
    where: { identifier, code, purpose, isUsed: false, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: 'desc' },
  });

  if (!otp) return false;

  await prisma.otpCode.update({ where: { id: otp.id }, data: { isUsed: true } });
  return true;
}