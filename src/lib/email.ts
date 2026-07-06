import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOtpEmail(
  to: string,
  code: string,
  purpose: 'REGISTRATION' | 'PASSWORD_RESET'
) {
  const subject =
    purpose === 'REGISTRATION'
      ? `[OTP] Kode Verifikasi Turnamen BELOVEsPORT - ${code}`
      : 'Reset Password Belovesport';

  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM ?? 'BELOVEsPORT <onboarding@resend.dev>',
    to,
    subject,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; border: 1px solid #E4E4E7; border-radius: 24px; background-color: #ffffff; color: #18181B;">
        <h2 style="color: #FF2E8A; text-transform: uppercase; letter-spacing: -0.05em; font-weight: 900; margin-bottom: 4px;">BELOVE<span style="color: #FF9A00;">s</span>PORT 2026</h2>
        <p style="font-size: 14px; line-height: 1.5; color: #71717A; margin-top: 0;">
          ${purpose === 'REGISTRATION'
            ? 'Berikut adalah kode OTP keamanan Anda untuk melanjutkan proses registrasi turnamen nasional:'
            : 'Berikut adalah kode OTP untuk reset password akun Anda:'}
        </p>
        <div style="background-color: #F4F4F5; padding: 16px; text-align: center; font-size: 32px; font-weight: 800; letter-spacing: 0.25em; color: #09090B; margin: 24px 0; border-radius: 16px; border: 1px solid #E4E4E7; font-family: monospace;">
          ${code}
        </div>
        <p style="font-size: 12px; line-height: 1.5; color: #A1A1AA; margin-bottom: 0;">Kode ini hanya berlaku selama <strong>5 menit</strong>. Jangan pernah membagikan kode ini kepada siapa pun.</p>
      </div>
    `,
  });

  if (error) {
    console.error('Gagal mengirim email OTP:', error);
    throw new Error('Gagal mengirim email verifikasi.');
  }
}