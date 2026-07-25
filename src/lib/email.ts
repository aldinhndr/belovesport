import { Resend } from 'resend';

// Helper Lazy-Initialization untuk mencegah error saat module import
function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error(
      '❌ [CRITICAL ERROR] RESEND_API_KEY tidak ditemukan di environment variables (.env)!'
    );
  }
  return new Resend(apiKey);
}

export async function sendOtpEmail(
  to: string,
  code: string,
  purpose: 'REGISTRATION' | 'PASSWORD_RESET'
) {
  const isReg = purpose === 'REGISTRATION';

  const subject = isReg
    ? `[BELOVEsPORT] Kode OTP Verifikasi Pendaftaran Turnamen - ${code}`
    : `[BELOVEsPORT] Permintaan Reset Password Akun - ${code}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${subject}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0B0A0A; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #0B0A0A; padding: 40px 0;">
        <tr>
          <td align="center">
            <table role="presentation" style="max-width: 520px; width: 100%; border-collapse: collapse; border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 24px; background-color: #121111; overflow: hidden;">
              <tr>
                <td style="background: linear-gradient(90deg, #FF2E8A 0%, #D4AF37 50%, #8C6239 100%); height: 4px;"></td>
              </tr>
              <tr>
                <td align="center" style="padding: 40px 40px 20px 40px;">
                  <h1 style="font-size: 26px; font-weight: 900; letter-spacing: -0.05em; text-transform: uppercase; color: #FFFFFF; margin: 0; font-style: italic;">
                    BELOVE<span style="color: #D4AF37;">S</span>PORT
                  </h1>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding: 10px 40px 20px 40px;">
                  <div style="background-color: #1A1818; border: 1px solid rgba(212, 175, 55, 0.15); padding: 24px; text-align: center; border-radius: 16px;">
                    <span style="display: block; font-size: 11px; font-weight: 700; color: #71717A; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px;">
                      KODE OTP VERIFIKASI ANDA
                    </span>
                    <div style="font-family: 'Courier New', monospace; font-size: 38px; font-weight: 900; letter-spacing: 0.2em; color: #FFFFFF;">
                      ${code}
                    </div>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const resend = getResendClient();
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM ?? 'BELOVEsPORT OTP <otp@belovesport.com>',
    to,
    subject,
    html: htmlContent,
  });

  if (error) {
    console.error('Gagal mengirim email OTP:', error);
    throw new Error('Gagal mengirim email verifikasi.');
  }
}

export interface RegisteredTeamDetail {
  teamName: string;
  efootballId: string | null;
}

export async function sendCredentialsEmail(
  to: string,
  username: string,
  password: string,
  teams: RegisteredTeamDetail[]
) {
  const subject = `[BELOVEsPORT] Kredensial Akses Akun Command Center Turnamen`;
  const totalSlots = teams.length;

  const teamListHtml = teams
    .map(
      (t, i) => `
      <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
        <td style="padding: 10px 12px; font-size: 13px; color: #FFFFFF; font-weight: 700;">
          Slot #${i + 1}: <span style="color: #D4AF37;">${t.teamName}</span>
        </td>
        <td style="padding: 10px 12px; font-size: 12px; color: #A1A1AA; font-family: monospace; text-align: right;">
          ID: ${t.efootballId || '-'}
        </td>
      </tr>
    `
    )
    .join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${subject}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0B0A0A; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #0B0A0A; padding: 40px 0;">
        <tr>
          <td align="center">
            <table role="presentation" style="max-width: 540px; width: 100%; border-collapse: collapse; border: 1px solid rgba(212, 175, 55, 0.25); border-radius: 24px; background-color: #121111; overflow: hidden;">
              <tr>
                <td style="background: linear-gradient(90deg, #FF2E8A 0%, #D4AF37 50%, #8C6239 100%); height: 4px;"></td>
              </tr>
              <tr>
                <td align="center" style="padding: 36px 40px 16px 40px;">
                  <h1 style="font-size: 26px; font-weight: 900; letter-spacing: -0.05em; text-transform: uppercase; color: #FFFFFF; margin: 0; font-style: italic;">
                    BELOVE<span style="color: #D4AF37;">S</span>PORT
                  </h1>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding: 0 40px;">
                  <div style="display: inline-block; background-color: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 30px; padding: 6px 16px;">
                    <span style="font-size: 10px; font-weight: 800; color: #4ADE80; letter-spacing: 0.08em; text-transform: uppercase;">
                      ✓ REGISTRASI TERVERIFIKASI (${totalSlots} SLOT AKTIF)
                    </span>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding: 28px 40px 16px 40px; text-align: left;">
                  <h3 style="font-size: 18px; font-weight: 800; color: #FFFFFF; margin: 0 0 10px 0;">
                    Halo Komandan Lapangan,
                  </h3>
                  <p style="font-size: 13px; line-height: 1.6; color: #A1A1AA; margin: 0;">
                    Pendaftaran tim Anda via Google Form telah diverifikasi resmi oleh panitia. Akun Command Center Anda siap digunakan.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 40px 20px 40px;">
                  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #1A1818; border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; overflow: hidden;">
                    ${teamListHtml}
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding: 0 40px 24px 40px;">
                  <div style="background-color: #1A1818; border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 16px; padding: 20px;">
                    <span style="display: block; font-size: 10px; font-weight: 800; color: #D4AF37; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 12px;">
                      KREDENSIAL LOGIN PORTAL
                    </span>
                    <table role="presentation" style="width: 100%; border-collapse: collapse; font-size: 13px; color: #E4E4E7; line-height: 1.8;">
                      <tr>
                        <td style="width: 110px; color: #71717A;">Email Login</td>
                        <td style="color: #FFFFFF; font-family: monospace; font-weight: bold;">: ${to}</td>
                      </tr>
                      <tr>
                        <td style="color: #71717A;">Username</td>
                        <td style="color: #D4AF37; font-family: monospace; font-weight: bold;">: @${username}</td>
                      </tr>
                      <tr>
                        <td style="color: #71717A;">Password</td>
                        <td style="color: #FFFFFF; font-family: monospace; font-weight: bold;">
                          : <span style="background-color: rgba(212, 175, 55, 0.15); border: 1px solid rgba(212, 175, 55, 0.3); padding: 2px 8px; border-radius: 4px; color: #D4AF37;">${password}</span>
                        </td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding: 0 40px 28px 40px;">
                  <a href="https://belovesport.com/login" target="_blank" style="background: linear-gradient(135deg, #FF2E8A 0%, #D4AF37 100%); color: #FFFFFF; text-decoration: none; padding: 14px 32px; font-weight: 900; font-size: 12px; border-radius: 100px; display: inline-block; text-transform: uppercase; letter-spacing: 0.1em; box-shadow: 0 8px 20px rgba(212, 175, 55, 0.25);">
                    Masuk ke Dasbor Peserta &rarr;
                  </a>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding: 24px 40px; background-color: #0A0909; border-top: 1px solid rgba(255,255,255,0.03); text-align: center;">
                  <p style="font-size: 11px; font-weight: 700; color: #71717A; margin: 0; text-transform: uppercase;">
                    © 2026 <span style="color: #D4AF37;">BELOVEsPORT</span> • All Rights Reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const resend = getResendClient();
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM ?? 'BELOVEsPORT <onboarding@resend.dev>',
    to,
    subject,
    html: htmlContent,
  });

  if (error) {
    console.error(`Gagal mengirim email kredensial ke ${to}:`, error);
    throw new Error(`Gagal mengirim email ke ${to}`);
  }
}