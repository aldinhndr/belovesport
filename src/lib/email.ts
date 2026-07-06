import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOtpEmail(
  to: string,
  code: string,
  purpose: 'REGISTRATION' | 'PASSWORD_RESET'
) {
  const isReg = purpose === 'REGISTRATION';
  
  const subject = isReg
    ? `[BELOVEsPORT] Kode OTP Verifikasi Pendaftaran Turnamen - ${code}`
    : `[BELOVEsPORT] Permintaan Reset Password Akun - ${code}`;

  // Menyusun komponen HTML Email dengan desain Premium Esports Dark/Gold Theme
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${subject}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0B0A0A; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
      <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #0B0A0A; padding: 40px 0;">
        <tr>
          <td align="center">
            <table role="presentation" style="max-width: 520px; width: 100%; border-collapse: collapse; border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 24px; background-color: #121111; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.7);">
              
              <!-- TOP GRADIENT BAR -->
              <tr>
                <td style="background: linear-gradient(90deg, #FF2E8A 0%, #D4AF37 50%, #8C6239 100%); height: 4px;"></td>
              </tr>

              <!-- HEADER LOGO BRANDS -->
              <tr>
                <td align="center" style="padding: 40px 40px 20px 40px;">
                  <h1 style="font-size: 26px; font-weight: 900; letter-spacing: -0.05em; text-transform: uppercase; color: #FFFFFF; margin: 0; padding: 0; font-style: italic;">
                    BELOVE<span style="color: #D4AF37;">S</span>PORT
                  </h1>
                  <p style="font-size: 11px; font-weight: 700; color: #D4AF37; letter-spacing: 0.3em; text-transform: uppercase; margin: 6px 0 0 0; padding: 0;">
                    E-Sports Tournament Circuit
                  </p>
                </td>
              </tr>

              <!-- LIVE CONTENT ACCENT -->
              <tr>
                <td align="center" style="padding: 0 40px;">
                  <div style="display: inline-block; background-color: rgba(212, 175, 55, 0.1); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 30px; padding: 4px 14px;">
                    <span style="font-size: 10px; font-weight: 800; color: #D4AF37; letter-spacing: 0.05em; text-transform: uppercase;">
                      ${isReg ? 'PILOT SEASON • REGISTRASI TIM' : 'SECURITY ALERT • RESET ACCESS'}
                    </span>
                  </div>
                </td>
              </tr>

              <!-- MAIN MESSAGE BODY -->
              <tr>
                <td style="padding: 30px 40px 20px 40px; text-align: left;">
                  <h3 style="font-size: 18px; font-weight: 800; color: #FFFFFF; margin: 0 0 12px 0;">
                    Halo Calon Komandan Lapangan,
                  </h3>
                  <p style="font-size: 14px; line-height: 1.6; color: #A1A1AA; margin: 0;">
                    ${isReg 
                      ? 'Langkah pengamanan slot turnamen tinggal sedikit lagi. Gunakan kode One-Time Password (OTP) di bawah ini untuk memverifikasi email aktif dan mengaktifkan dasbor manajemen tim Anda.' 
                      : 'Kami menerima permintaan untuk menyetel ulang kata sandi akun Anda. Jika Anda tidak merasa melakukan tindakan ini, abaikan email ini dengan aman.'}
                  </p>
                </td>
              </tr>

              <!-- CODE OTP SHOWCASE BLOCK -->
              <tr>
                <td align="center" style="padding: 10px 40px 20px 40px;">
                  <table role="presentation" style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="background-color: #1A1818; border: 1px solid rgba(212, 175, 55, 0.15); padding: 24px; text-align: center; border-radius: 16px;">
                        <span style="display: block; font-size: 11px; font-weight: 700; color: #71717A; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px;">
                          KODE OTP VERIFIKASIANDA
                        </span>
                        <div style="font-family: 'Courier New', monospace; font-size: 38px; font-weight: 900; letter-spacing: 0.2em; color: #FFFFFF; text-shadow: 0 0 12px rgba(212,175,55,0.4); padding-left: 0.2em;">
                          ${code}
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- RULES & EXPIRATION DETAIL LIST -->
              <tr>
                <td style="padding: 0 40px 30px 40px;">
                  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: rgba(24, 24, 27, 0.4); border-radius: 12px; padding: 16px;">
                    <tr>
                      <td style="padding: 16px;">
                        <h4 style="font-size: 12px; font-weight: 700; color: #FFFFFF; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.05em;">
                          Informasi Penting Keamanan:
                        </h4>
                        <ul style="margin: 0; padding: 0 0 0 16px; font-size: 12px; color: #71717A; line-height: 1.6;">
                          <li style="margin-bottom: 4px;">Kode OTP di atas hanya berlaku selama <strong style="color: #D4AF37;">5 Menit</strong> dari sekarang.</li>
                          <li style="margin-bottom: 4px;">Tim panitia BELOVEsPORT tidak pernah meminta password atau kode OTP Anda dalam bentuk apa pun.</li>
                          <li style="margin-bottom: 0;">Jangan membagikan atau meneruskan pesan ini ke anggota tim atau pihak eksternal lainnya.</li>
                        </ul>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- SPONSOR & FOOTER AREA -->
              <tr>
                <td align="center" style="padding: 30px 40px; background-color: #0A0909; border-top: 1px solid rgba(255,255,255,0.03); text-align: center;">
                  <p style="font-size: 11px; color: #52525B; margin: 0 0 6px 0;">
                    Sistem Otomatis Distribusi Tiket Keamanan Turnamen.
                  </p>
                  <p style="font-size: 11px; font-weight: 700; color: #71717A; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">
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