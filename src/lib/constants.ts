/**
 * BELOVEsPORT – Centralised Application Constants
 * ================================================
 * Single source of truth for all data-driven UI.
 * All objects use `as const` so consuming components
 * get narrowly typed literals rather than wide primitives.
 */

// ─────────────────────────────────────────────────────────
// 1. Shared Type Primitives
// ─────────────────────────────────────────────────────────

export type IconName =
  | 'Users'
  | 'Trophy'
  | 'Gift'
  | 'MapPin'
  | 'GitBranch'
  | 'Award'
  | 'Crown'
  | 'UserCheck'
  | 'Swords'
  | 'Zap'
  | 'ShieldCheck'
  | 'Scale'
  | 'Eye'
  | 'CheckCircle'
  | 'MessageCircle'
  | 'Instagram'
  | 'Twitter'
  | 'Youtube'
  | 'Music'
  | 'Mail'
  | 'Star'
  | 'Gamepad2'

export type StageStatus = 'active' | 'upcoming' | 'completed'

export type BrandColor =
  | 'brand-pink'
  | 'brand-orange'
  | 'brand-gold'
  | 'gray-400'
  | 'white'

// ─────────────────────────────────────────────────────────
// 2. Tournament Configuration
// ─────────────────────────────────────────────────────────

export interface TournamentConfig {
  readonly name: string
  readonly shortName: string
  readonly tagline: string
  readonly edition: string
  readonly slots: number
  readonly slotsRemaining: number
  readonly prizePoolRupiah: string
  readonly prizePoolNumeric: number
  readonly voucherAmount: number
  readonly voucherAmountFormatted: string
  readonly provinces: number
  readonly game: string
  readonly gameVersion: string
  readonly organizer: string
  readonly website: string
  readonly supportEmail: string
  readonly discordUrl: string
  readonly registrationEnabled: boolean
  readonly sponsorInquiryEnabled: boolean
  readonly registrationDeadline: string
  readonly tournamentStartDate: string
  readonly grandFinalsDate: string
}

export const TOURNAMENT_CONFIG: TournamentConfig = {
  name: 'Turnamen Nasional BELOVEsPORT eFootball Mobile',
  shortName: 'BELOVEsPORT',
  tagline: 'Platform Turnamen eFootball Mobile Terkemuka di Indonesia',
  edition: '2026',
  slots: 64,
  slotsRemaining: 12,
  prizePoolRupiah: 'Rp 500.000.000+',
  prizePoolNumeric: 500_000_000,
  voucherAmount: 50_000,
  voucherAmountFormatted: 'Rp 50.000',
  provinces: 34,
  game: 'eFootball™',
  gameVersion: '2025 Mobile',
  organizer: 'Belovecorp',
  website: 'https://belovesport.id',
  supportEmail: 'support@belovesport.id',
  discordUrl: 'https://discord.gg/belovesport',
  registrationEnabled: true,
  sponsorInquiryEnabled: true,
  registrationDeadline: '2026-07-15T23:59:59+07:00',
  tournamentStartDate: '2026-07-20T10:00:00+07:00',
  grandFinalsDate: '2026-08-10T14:00:00+07:00',
} as const

// ─────────────────────────────────────────────────────────
// 3. Stats Bar
// ─────────────────────────────────────────────────────────

export interface StatItem {
  readonly id: string
  readonly value: number
  readonly prefix?: string
  readonly suffix: string
  readonly label: string
  readonly icon: IconName
  readonly locale?: string
}

export const STATS_ITEMS: readonly StatItem[] = [
  {
    id: 'slots',
    value: 64,
    suffix: '',
    label: 'Slot Kompetitif',
    icon: 'Users',
  },
  {
    id: 'prize',
    value: 500,
    suffix: 'M+',
    label: 'Total Hadiah (Rp)',
    icon: 'Trophy',
  },
  {
    id: 'voucher',
    value: 100,
    suffix: '%',
    label: 'Tingkat Klaim Voucher',
    icon: 'Gift',
  },
  {
    id: 'provinces',
    value: 34,
    suffix: '',
    label: 'Provinsi Terjangkau',
    icon: 'MapPin',
  },
] as const

// ─────────────────────────────────────────────────────────
// 4. Regional Breakdown (34 Provinces)
// ─────────────────────────────────────────────────────────

export interface ProvinceSlot {
  readonly province: string
  readonly island: string
  readonly slots: number
}

export const PROVINCE_BREAKDOWN: readonly ProvinceSlot[] = [
  // Jawa
  { province: 'DKI Jakarta', island: 'Jawa', slots: 6 },
  { province: 'Jawa Barat', island: 'Jawa', slots: 5 },
  { province: 'Jawa Tengah', island: 'Jawa', slots: 4 },
  { province: 'Jawa Timur', island: 'Jawa', slots: 4 },
  { province: 'DI Yogyakarta', island: 'Jawa', slots: 2 },
  { province: 'Banten', island: 'Jawa', slots: 2 },
  // Sumatera
  { province: 'Sumatera Utara', island: 'Sumatera', slots: 3 },
  { province: 'Sumatera Selatan', island: 'Sumatera', slots: 2 },
  { province: 'Riau', island: 'Sumatera', slots: 2 },
  { province: 'Lampung', island: 'Sumatera', slots: 2 },
  { province: 'Sumatera Barat', island: 'Sumatera', slots: 1 },
  { province: 'Jambi', island: 'Sumatera', slots: 1 },
  { province: 'Bengkulu', island: 'Sumatera', slots: 1 },
  { province: 'Kep. Bangka Belitung', island: 'Sumatera', slots: 1 },
  { province: 'Kep. Riau', island: 'Sumatera', slots: 1 },
  { province: 'Aceh', island: 'Sumatera', slots: 1 },
  // Kalimantan
  { province: 'Kalimantan Timur', island: 'Kalimantan', slots: 2 },
  { province: 'Kalimantan Selatan', island: 'Kalimantan', slots: 1 },
  { province: 'Kalimantan Barat', island: 'Kalimantan', slots: 1 },
  { province: 'Kalimantan Tengah', island: 'Kalimantan', slots: 1 },
  { province: 'Kalimantan Utara', island: 'Kalimantan', slots: 1 },
  // Sulawesi
  { province: 'Sulawesi Selatan', island: 'Sulawesi', slots: 2 },
  { province: 'Sulawesi Tengah', island: 'Sulawesi', slots: 1 },
  { province: 'Sulawesi Utara', island: 'Sulawesi', slots: 1 },
  { province: 'Sulawesi Tenggara', island: 'Sulawesi', slots: 1 },
  { province: 'Gorontalo', island: 'Sulawesi', slots: 1 },
  { province: 'Sulawesi Barat', island: 'Sulawesi', slots: 1 },
  // Bali & Nusa Tenggara
  { province: 'Bali', island: 'Bali & Nusa Tenggara', slots: 2 },
  { province: 'Nusa Tenggara Barat', island: 'Bali & Nusa Tenggara', slots: 1 },
  { province: 'Nusa Tenggara Timur', island: 'Bali & Nusa Tenggara', slots: 1 },
  // Maluku & Papua
  { province: 'Maluku', island: 'Maluku & Papua', slots: 1 },
  { province: 'Maluku Utara', island: 'Maluku & Papua', slots: 1 },
  { province: 'Papua', island: 'Maluku & Papua', slots: 1 },
  { province: 'Papua Barat', island: 'Maluku & Papua', slots: 1 },
] as const

// ─────────────────────────────────────────────────────────
// 5. Prize Distribution
// ─────────────────────────────────────────────────────────

export interface PrizeTier {
  readonly rank: string
  readonly label: string
  readonly amount: number
  readonly amountFormatted: string
  readonly percentage: number
}

export const PRIZE_DISTRIBUTION: readonly PrizeTier[] = [
  {
    rank: 'Juara 1',
    label: 'Pemenang Utama',
    amount: 200_000_000,
    amountFormatted: 'Rp 200.000.000',
    percentage: 40,
  },
  {
    rank: 'Juara 2',
    label: 'Runner-up',
    amount: 100_000_000,
    amountFormatted: 'Rp 100.000.000',
    percentage: 20,
  },
  {
    rank: 'Juara 3–4',
    label: 'Semi-Finalis',
    amount: 50_000_000,
    amountFormatted: 'Rp 50.000.000 masing-masing',
    percentage: 10,
  },
  {
    rank: 'Juara 5–8',
    label: 'Perempat Finalis',
    amount: 12_500_000,
    amountFormatted: 'Rp 12.500.000 masing-masing',
    percentage: 5,
  },
  {
    rank: 'Semua 64',
    label: 'Voucher Partisipasi',
    amount: 50_000,
    amountFormatted: 'Rp 50.000',
    percentage: 100,
  },
] as const

// ─────────────────────────────────────────────────────────
// 6. Ecosystem Feature Grid
// ─────────────────────────────────────────────────────────

export interface EcosystemFeature {
  readonly id: string
  readonly icon: IconName
  readonly title: string
  readonly description: string
  readonly gradientFrom: string
  readonly gradientTo: string
}

export const ECOSYSTEM_FEATURES: readonly EcosystemFeature[] = [
  {
    id: 'bracket',
    icon: 'GitBranch',
    title: 'Bracket Transparan',
    description:
      'Pembaruan bracket real-time yang dapat dilihat oleh semua peserta. Tidak ada pertandingan tersembunyi, tidak ada penempatan jalur belakang — integritas penuh.',
    gradientFrom: '#FF2E8A',
    gradientTo: '#FF9A00',
  },
  {
    id: 'voucher',
    icon: 'Gift',
    title: 'Voucher Dijamin',
    description:
      'Setiap pemain yang terdaftar menerima voucher eksklusif Rp 50.000 saat slot mereka dikonfirmasi.',
    gradientFrom: '#FF9A00',
    gradientTo: '#FFC537',
  },
  {
    id: 'certificate',
    icon: 'Award',
    title: 'Sertifikat Terverifikasi',
    description:
      'Sertifikat partisipasi dan pencapaian yang tahan manipulasi. Bangun portofolio eFootball kompetitif Anda.',
    gradientFrom: '#FFC537',
    gradientTo: '#FF2E8A',
  },
  {
    id: 'trophy',
    icon: 'Crown',
    title: 'Kejayaan Kejuaraan',
    description:
      'Bersaing untuk gelar utama dan tempat permanen di Indonesian eFootball Hall of Fame.',
    gradientFrom: '#FF2E8A',
    gradientTo: '#FFC537',
  },
] as const

// ─────────────────────────────────────────────────────────
// 7. Tournament Timeline / Flow
// ─────────────────────────────────────────────────────────

export interface TimelineStep {
  readonly id: string
  readonly stage: number
  readonly title: string
  readonly subtitle: string
  readonly description: string
  readonly icon: IconName
  readonly status: StageStatus
  readonly dateRange: string
}

export const TOURNAMENT_STAGES: readonly TimelineStep[] = [
  {
    id: 'registration',
    stage: 1,
    title: 'Pendaftaran & Verifikasi',
    subtitle: '1 – 15 Juli 2026',
    description:
      'Daftar dengan eFootball ID Anda. Sistem anti-cheat kami memverifikasi integritas akun sebelum mengonfirmasi slot Anda dan mengirimkan voucher Rp 50.000 Anda.',
    icon: 'UserCheck',
    status: 'active',
    dateRange: '1–15 Jul 2026',
  },
  {
    id: 'group-stage',
    stage: 2,
    title: 'Pertempuran Babak Grup',
    subtitle: '20 – 27 Juli 2026',
    description:
      '64 pemain dibagi menjadi 16 grup yang terdiri dari 4 pemain. Format round-robin penuh — setiap pertandingan penting. 2 teratas dari setiap grup melaju ke bracket sistem gugur.',
    icon: 'Swords',
    status: 'upcoming',
    dateRange: '20–27 Jul 2026',
  },
  {
    id: 'knockout',
    stage: 3,
    title: 'Babak Sistem Gugur',
    subtitle: '1 – 7 Agustus 2026',
    description:
      '32 pemain yang bertahan masuk ke eliminasi tunggal. Setiap pertandingan disiarkan langsung dengan komentar profesional. Tidak ada kesempatan kedua, intensitas maksimal.',
    icon: 'Zap',
    status: 'upcoming',
    dateRange: '1–7 Aug 2026',
  },
  {
    id: 'grand-finals',
    stage: 4,
    title: 'Grand Final & Seremoni',
    subtitle: '10 Agustus 2026',
    description:
      'Dua pemain terbaik bertarung dalam pertunjukan best-of-5. Seremoni langsung, penyerahan hadiah Rp 200 juta, dan penobatan juara nasional.',
    icon: 'Trophy',
    status: 'upcoming',
    dateRange: '10 Aug 2026',
  },
] as const

// ─────────────────────────────────────────────────────────
// 8. Competitive Integrity
// ─────────────────────────────────────────────────────────

export interface IntegrityFeature {
  readonly id: string
  readonly icon: IconName
  readonly title: string
  readonly description: string
}

export const INTEGRITY_FEATURES: readonly IntegrityFeature[] = [
  {
    id: 'anti-cheat',
    icon: 'ShieldCheck',
    title: 'Anti-Cheat Canggih',
    description:
      'Pemantauan real-time bertenaga AI mendeteksi dan menandai kejanggalan di setiap pertandingan. Toleransi nol — sekali melanggar langsung gugur.',
  },
  {
    id: 'fair-matchmaking',
    icon: 'Scale',
    title: 'Matchmaking Adil',
    description:
      'Penempatan berbasis ELO memastikan grup seimbang. Tidak ada keuntungan tidak adil saat penempatan bracket.',
  },
  {
    id: 'live-monitoring',
    icon: 'Eye',
    title: 'Pemantauan Pertandingan Langsung',
    description:
      'Setiap pertandingan direkam penuh dan ditinjau. Perselisihan diselesaikan secara transparan dalam waktu 24 jam.',
  },
  {
    id: 'verified-results',
    icon: 'CheckCircle',
    title: 'Hasil Terverifikasi',
    description:
      'Verifikasi hasil multi-sistem yang aman dari manipulasi. Semua skor diperiksa silang sebelum pembaruan bracket.',
  },
] as const

// ─────────────────────────────────────────────────────────
// 9. Sponsor Tiers
// ─────────────────────────────────────────────────────────

export interface SponsorTier {
  readonly id: string
  readonly name: string
  readonly color: BrandColor
  readonly badgeColor: string
  readonly highlighted: boolean
  readonly perks: readonly string[]
}

export const SPONSOR_TIERS: readonly SponsorTier[] = [
  {
    id: 'platinum',
    name: 'Platinum',
    color: 'brand-pink',
    badgeColor: '#FF2E8A',
    highlighted: true,
    perks: [
      'Logo di semua siaran & media penyiaran',
      'Panggung turnamen bermerek eksklusif',
      'Akses VIP ke grand final',
      'Segmen merek 60 detik khusus',
      'Siaran pers bersama',
      'Amplifikasi media sosial prioritas',
    ],
  },
  {
    id: 'gold',
    name: 'Gold',
    color: 'brand-gold',
    badgeColor: '#FFC537',
    highlighted: false,
    perks: [
      'Logo di overlay siaran',
      'Fitur media sosial (3×)',
      'Akses acara VIP',
      'Stan sampel produk di final',
    ],
  },
  {
    id: 'silver',
    name: 'Silver',
    color: 'gray-400',
    badgeColor: '#9CA3AF',
    highlighted: false,
    perks: [
      'Logo di situs web resmi',
      'Penyebutan media sosial (1×)',
      'Kehadiran merek pada hari acara',
    ],
  },
] as const

// ─────────────────────────────────────────────────────────
// 10. FAQ Items
// ─────────────────────────────────────────────────────────

export interface FaqItem {
  readonly id: string
  readonly question: string
  readonly answer: string
  readonly category: 'general' | 'registration' | 'prizes' | 'rules' | 'technical'
}

export const FAQ_ITEMS: readonly FaqItem[] = [
  {
    id: 'what-is-belovesport',
    category: 'general',
    question: 'Apa itu BELOVEsPORT?',
    answer:
      'BELOVEsPORT adalah platform turnamen eFootball mobile kompetitif terkemuka di Indonesia, diselenggarakan oleh Belovecorp. Kami menghadirkan lingkungan yang adil, transparan, dan sangat kompetitif bagi para pemain di seluruh 34 provinsi di Indonesia, dengan total hadiah Rp 500 juta+.',
  },
  {
    id: 'how-to-register',
    category: 'registration',
    question: 'Bagaimana cara mendaftar?',
    answer:
      'Klik tombol "Daftar Sekarang" dan lengkapi formulir 2 langkah dengan nama lengkap, eFootball ID, dan email aktif Anda. Setelah verifikasi, Anda akan menerima konfirmasi beserta voucher Rp 50.000 gratis Anda dalam waktu 24 jam.',
  },
  {
    id: 'registration-fee',
    category: 'registration',
    question: 'Apakah ada biaya pendaftaran?',
    answer:
      'Pendaftaran gratis tanpa dipungut biaya. Setiap peserta yang terkonfirmasi secara otomatis menerima voucher game atau mitra sebesar Rp 50.000 — tanpa syarat.',
  },
  {
    id: 'prize-distribution',
    category: 'prizes',
    question: 'Bagaimana pembagian total hadiahnya?',
    answer:
      'Juara 1 membawa pulang Rp 200 juta (40%), Runner-up Rp 100 juta (20%), Semi-finalis masing-masing Rp 50 juta, Perempat finalis masing-masing Rp 12,5 juta. Setiap peserta mendapatkan voucher Rp 50.000 tanpa memandang peringkat.',
  },
  {
    id: 'anti-cheat-policy',
    category: 'rules',
    question: 'Bagaimana cara Anda mencegah kecurangan?',
    answer:
      'Kami menggunakan sistem berlapis: analisis perilaku AI pada saat pertandingan, verifikasi akun sebelum turnamen, pemantauan wasit langsung, dan peninjauan rekaman ulang pasca-pertandingan. Setiap pelanggaran yang terkonfirmasi akan mengakibatkan diskualifikasi instan dan larangan permanen.',
  },
  {
    id: 'eligibility',
    category: 'registration',
    question: 'Siapa saja yang memenuhi syarat untuk berpartisipasi?',
    answer:
      'Semua pemain eFootball dengan akun valid yang berdomisili di Indonesia. Tidak ada batasan usia, meskipun peserta di bawah 18 tahun harus menyerahkan persetujuan orang tua/wali sebelum slot mereka dikonfirmasi.',
  },
  {
    id: 'schedule',
    category: 'general',
    question: 'Bagaimana jadwal turnamennya?',
    answer:
      'Pendaftaran: 1–15 Juli 2026. Babak Grup: 20–27 Juli. Babak Sistem Gugur: 1–7 Agustus. Grand Final & Seremoni: 10 Agustus 2026. Semua jadwal pertandingan akan dikirimkan kepada peserta terdaftar satu minggu sebelum setiap fase.',
  },
  {
    id: 'device-requirements',
    category: 'technical',
    question: 'Perangkat apa yang saya butuhkan?',
    answer:
      'Smartphone Android or iOS apa pun yang mampu menjalankan eFootball™ 2025 dengan stabil pada 60 FPS. Pertandingan hanya dimainkan di HP — tidak ada PC atau konsol. Koneksi internet yang stabil (minimal 10 Mbps) wajib dimiliki selama pertandingan resmi.',
  },
  {
    id: 'dispute-resolution',
    category: 'rules',
    question: 'Bagaimana perselisihan ditangani?',
    answer:
      'Kirimkan tiket perselisihan melalui Discord atau email dalam waktu 1 jam setelah pertandingan selesai. Tim wasit kami akan meninjau rekaman lengkap pertandingan dan mengeluarkan keputusan dalam waktu 24 jam. Semua keputusan oleh kepala wasit bersifat final.',
  },
  {
    id: 'support',
    category: 'general',
    question: 'Di mana saya bisa mendapatkan bantuan?',
    answer:
      'Bergabunglah dengan server Discord kami untuk bantuan komunitas dan staf secara real-time. Atau email ke support@belovesport.id. Selama fase turnamen, tim kami tersedia pukul 07:00–23:00 WIB, 7 hari seminggu.',
  },
] as const

// ─────────────────────────────────────────────────────────
// 11. Social Links & Navigation
// ─────────────────────────────────────────────────────────

export interface SocialLink {
  readonly name: string
  readonly url: string
  readonly icon: IconName
  readonly handle: string
}

export const SOCIAL_LINKS: readonly SocialLink[] = [
  {
    name: 'Discord',
    url: 'https://discord.gg/belovesport',
    icon: 'MessageCircle',
    handle: 'BELOVEsPORT',
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com/belovesport',
    icon: 'Instagram',
    handle: '@belovesport',
  },
  {
    name: 'Twitter / X',
    url: 'https://twitter.com/belovesport',
    icon: 'Twitter',
    handle: '@belovesport',
  },
  {
    name: 'YouTube',
    url: 'https://youtube.com/@belovesport',
    icon: 'Youtube',
    handle: '@belovesport',
  },
  {
    name: 'TikTok',
    url: 'https://tiktok.com/@belovesport',
    icon: 'Music',
    handle: '@belovesport',
  },
] as const

export interface NavItem {
  readonly label: string
  readonly href: string
}

export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Beranda', href: '#hero' },
  { label: 'Fitur', href: '#ecosystem' },
  { label: 'Turnamen', href: '#format' },
  { label: 'Integritas', href: '#integrity' },
  { label: 'Sponsor', href: '#sponsors' },
  { label: 'FAQ', href: '#faq' },
] as const

// ─────────────────────────────────────────────────────────
// 12. UI Status & Labels (Shared)
// ─────────────────────────────────────────────────────────

import { Clock, CheckCircle2, XCircle } from 'lucide-react';

export const REGISTRATION_STATUS_MAP = {
    PENDING: { label: 'Sedang Ditinjau Admin', dot: 'bg-amber-400', text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', icon: Clock },
    APPROVED: { label: 'Slot Diamankan', dot: 'bg-emerald-400', text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: CheckCircle2 },
    REJECTED: { label: 'Ditolak Admin', dot: 'bg-red-400', text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', icon: XCircle },
} as const;

export const MATCH_STATUS_LABEL = {
    SCHEDULED: 'Terjadwal',
    PLAYING: 'Sedang Berlangsung',
    WAITING_VERIFICATION: 'Menunggu Verifikasi',
    COMPLETED: 'Selesai',
} as const;

export const MATCH_RESULT_CONFIG = {
    WIN: { label: 'Menang', text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    DRAW: { label: 'Seri', text: 'text-brand-bronze', bg: 'bg-brand-gold/10', border: 'border-brand-gold/30' },
    LOSS: { label: 'Kalah', text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
} as const;
