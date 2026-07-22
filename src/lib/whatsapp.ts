export async function sendWaNotification(
  to: string,
  teamName: string,
  voucherCode: string,
  leaderName: string,
  participantEmail: string,
  // 🚀 UPDATE: Tambahkan parameter username dan password di akhir agar tidak merusak alur parameter lama
  username: string,
  password: string
) {
  // 1. Standarisasi format nomor HP ke kode negara '62'
  let formattedPhone = to.replace(/[^0-9]/g, '');
  if (formattedPhone.startsWith('0')) {
    formattedPhone = '62' + formattedPhone.slice(1);
  }

  // 2. Template pesan resmi dengan kapitalisasi brand BELOVESPORT yang benar
  const message = `*TOURNAMENT BELOVESPORT 2026 — S1*\n\n` +
    `Halo *${leaderName}*,\n` +
    `Selamat! Pendaftaran Tim *${teamName}* telah resmi *TERVERIFIKASI* oleh Admin.\n\n` +
    `Slot turnamen nasional Anda telah aman. Saat ini akun Command Center Anda telah aktif sepenuhnya.\n\n` +
    `🔑 *KREDENSIAL AKSES LOGIN:* \n` +
    `• Username: \`@${username.replace('@', '')}\`\n` +
    `• Email: \`${participantEmail}\`\n` +
    `• Password: \`${password}\`\n\n` +
    `_Catatan: Silakan gunakan Email/Username dan Password di atas untuk masuk._\n\n` +
    `🎫 *KODE VOUCHER ANDA:* \n` +
    `\`${voucherCode}\`\n\n` +
    `🌐 *LINK AKSES UTAMA:* \n` +
    `Silakan masuk ke dasbor profil Anda melalui tautan resmi berikut:\n` +
    `https://belovesport.com/login\n\n` +
    `Silakan salin voucher Anda di dalam dasbor untuk melihat detail pembagian grup serta jadwal pertandingan.\n\n` +
    `_Pesan ini dikirim otomatis oleh sistem keamanan BELOVESPORT._`;

  try {
    // 3. Eksekusi request POST ke server Fonnte
    const response = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        'Authorization': process.env.WHATSAPP_API_KEY || '',
      },
      body: new URLSearchParams({
        target: formattedPhone,
        message: message,
        countryCode: '62'
      })
    });

    const result = await response.json();
    
    if (!result.status) {
      console.error('Gagal mengirim WhatsApp via Fonnte:', result.reason);
    } else {
      console.log(`Notifikasi WA & Voucher sukses terkirim ke Tim: ${teamName}`);
    }
  } catch (error) {
    console.error('Sistem error saat mengeksekusi fungsi WA Fonnte:', error);
  }
}