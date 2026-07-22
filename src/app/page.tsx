/**
 * BELOVESPORT — eFootball Mobile National Tournament 2026
 * V3.0 — Rombak total.
 *
 * Perubahan besar dari versi sebelumnya:
 *  1. Server Component murni. 'use client' HANYA ada di site-interactive.tsx
 *     (tombol CTA, mobile nav, FAQ accordion). Sisanya di-render di server:
 *     lebih cepat sampai ke layar, lebih baik untuk SEO, JS lebih ringan
 *     untuk HP kelas menengah-bawah yang jadi target turnamen mobile ini.
 *  2. `export const metadata` sekarang bisa dipakai langsung (butuh Server
 *     Component) — title, description, dan Open Graph sudah diisi.
 *  3. Data "LIVE" yang dulu statis tapi diberi badge LIVE (slot terisi,
 *     klasemen) sudah DIHAPUS labelnya. Angka ditampilkan apa adanya
 *     sebagai contoh/placeholder, bukan diklaim real-time — sampai memang
 *     disambungkan ke sumber data asli.
 *  4. Trust & legal: kontak resmi (WhatsApp, Instagram) dan link
 *     Syarat & Ketentuan + Kebijakan Privasi sekarang ada di halaman,
 *     bukan cuma disebut sekilas di teks.
 *  5. Video hero: ditambah `poster` + `preload="metadata"` supaya tidak
 *     blank saat loading dan tidak membebani LCP di koneksi lambat.
 *  6. Aksesibilitas: FAQ accordion punya aria-expanded/aria-controls,
 *     kontras teks kecil dinaikkan (tidak ada lagi text-white/40 di teks
 *     yang perlu dibaca), fokus keyboard terlihat di semua tombol/link.
 *  7. Bug class Tailwind yang saling membatalkan (`skew-x-2 -skew-x-6`
 *     dobel di ScheduleSection) sudah diperbaiki.
 *  8. Kode voucher contoh diberi label "Contoh" agar tidak dikira kode asli.
 *  9. Pengulangan dirapikan: satu sumber komponen "InfoStrip"/"Card" dipakai
 *     ulang, bukan style inline berulang di banyak tempat.
 */

import type { Metadata } from 'next'
import Image from 'next/image'
import {
  Trophy,
  Gift,
  ShieldCheck,
  Zap,
  Users,
  Calendar,
  ChevronRight,
  Swords,
  CheckCircle2,
  ArrowRight,
  LayoutDashboard,
  BarChart3,
  Lock,
  Wallet,
  UserPlus,
  FileText,
  Grid3x3,
  Flame,
  Ticket,
  ExternalLink,
  MessageCircle,
  Instagram,
  Crown,
  Medal,
  Award
} from 'lucide-react'
import { SignupButton, LinkButton, MobileNav, FaqAccordion } from './site-interactive'

// ─────────────────────────────────────────────────────────
// Metadata (hanya bisa dilakukan di Server Component)
// ─────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'BELOVESPORT — Turnamen Nasional eFootball Mobile 2026',
  description:
    'Daftar tim eFootball Mobile-mu di BELOVESPORT Season 1. Biaya Rp 25.000/tim, kuota 64 tim, format grup + knockout, E-Voucher otomatis dari BELOVECORP INDONESIA.',
  openGraph: {
    title: 'BELOVESPORT — Turnamen Nasional eFootball Mobile 2026',
    description:
      'Daftar tim eFootball Mobile-mu. Biaya Rp 25.000/tim, kuota 64 tim, format grup + knockout.',
    type: 'website',
    locale: 'id_ID',
  },
}

// ─────────────────────────────────────────────────────────
// Kontak resmi & legal — sumber tunggal, dipakai di navbar/footer
// ─────────────────────────────────────────────────────────

const OFFICIAL_CONTACT = {
  whatsapp: { label: '+62 895-3277-6121-6', href: 'https://wa.me/62895327761216' },
  instagram: { label: '@belovesport.officiall', href: 'https://instagram.com/belovesport.officiall' },
  email: 'admin@belovesport.com',
}

// ─────────────────────────────────────────────────────────
// Static content
// ─────────────────────────────────────────────────────────

const REGISTRATION_TUTORIAL = [
  {
    icon: UserPlus,
    step: '01',
    title: 'Klik "Daftar Tim"',
    desc: 'Tekan tombol Daftar Tim di halaman ini — kamu diarahkan ke form pendaftaran resmi BELOVESPORT.',
  },
  {
    icon: FileText,
    step: '02',
    title: 'Isi Data & Unggah Bukti Bayar',
    desc: 'Lengkapi data tim & ID pemain, lalu unggah bukti transfer Rp 25.000 sesuai instruksi pada form.',
  },
  {
    icon: ShieldCheck,
    step: '03',
    title: 'Verifikasi oleh Admin',
    desc: 'Admin memverifikasi data & pembayaran maksimal 1x24 jam. Kamu dihubungi via WhatsApp resmi begitu slot dikonfirmasi.',
  },
  {
    icon: LayoutDashboard,
    step: '04',
    title: 'Akses Command Center',
    desc: 'Dasbor tim aktif otomatis — pantau jadwal, lapor skor pertandingan, dan cek klasemen di sana.',
  },
]

const REG_RULES = [
  { icon: Wallet, label: 'Biaya Pendaftaran', value: 'Rp 25.000 / Tim' },
  { icon: Users, label: 'Maksimal', value: '2 Slot per Orang' },
  { icon: Ticket, label: 'Kuota Total', value: '64 Slot Tim' },
  { icon: Swords, label: 'Format', value: 'Grup + Knockout' },
]

// ⚠️ GANTI SEBELUM GO-LIVE: angka di bawah ini PLACEHOLDER, belum final.
// Cari "GANTI SEBELUM GO-LIVE" di file ini untuk semua titik yang perlu diisi.
const PRIZE_POOL = [
  {
    place: 'Juara 1',
    icon: Crown,
    amount: 'Rp 500.000',
    note: 'Uang tunai + trofi + merchandise BELOVECORP',
    tone: 'gold' as const,
  },
  {
    place: 'Juara 2',
    icon: Medal,
    amount: 'Rp 300.000',
    note: 'Uang tunai + merchandise BELOVECORP',
    tone: 'silver' as const,
  },
  {
    place: 'Juara 3',
    icon: Award,
    amount: 'Rp 200.000',
    note: 'Uang tunai + merchandise BELOVECORP',
    tone: 'bronze' as const,
  },
]

const COMPETITION_FORMAT = [
  {
    icon: Grid3x3,
    title: 'Fase Grup',
    desc: '64 tim dibagi ke beberapa grup kecil. Sistem round-robin dengan Poin, Goal Difference & Goal Made standar FIFA menentukan peringkat grup.',
  },
  {
    icon: Flame,
    title: 'Fase Knockout',
    desc: 'Tim terbaik tiap grup lolos ke babak gugur — sekali kalah, langsung tersingkir — bertarung hingga Grand Final.',
  },
]

const USP_FEATURES = [
  {
    icon: BarChart3,
    title: 'Automated Engine',
    tag: '01 — Engine',
    desc: 'Bagan dan klasemen ter-update otomatis dengan standar perhitungan FIFA: Poin, Goal Difference, dan Goal Made.',
  },
  {
    icon: Lock,
    title: 'Keamanan Terjamin',
    tag: '02 — Security',
    desc: 'Setiap laporan skor melewati validasi OTP dan JWT Auth. Sistem anti-kecurangan aktif di setiap pertandingan.',
  },
  {
    icon: LayoutDashboard,
    title: 'Command Center',
    tag: '03 — Dashboard',
    desc: 'Setiap tim mendapat dasbor privat untuk memantau performa, agregat gol, dan statistik Menang / Seri / Kalah.',
  },
]

const SCHEDULE = [
  { date: '08–20 Jul', title: 'Pendaftaran & Verifikasi Tim', tag: 'DIBUKA' },
  { date: '22–23 Jul', title: 'Technical Meeting & Bracket Draw', tag: 'WAJIB HADIR' },
  { date: '25–28 Jul', title: 'Fase Grup — Kick-off', tag: 'PERTANDINGAN' },
  { date: '29–30 Jul', title: 'Babak 8 Besar & Semifinal', tag: 'PERTANDINGAN' },
  { date: '31 Jul', title: 'Grand Final', tag: 'FINAL' },
]

// Contoh tampilan klasemen — BUKAN data real-time. Ganti dengan fetch()
// ke sumber data asli begitu backend klasemen tersedia, dan baru saat itu
// badge "berjalan otomatis" boleh dimunculkan lagi.
const STANDINGS_EXAMPLE = [
  { team: 'Tim A', p: 3, w: 3, d: 0, l: 0, gd: '+7', pts: 9 },
  { team: 'Tim B', p: 3, w: 2, d: 1, l: 0, gd: '+4', pts: 7 },
  { team: 'Tim C', p: 3, w: 1, d: 1, l: 1, gd: '+1', pts: 4 },
  { team: 'Tim D', p: 3, w: 0, d: 0, l: 3, gd: '-5', pts: 0 },
]

const FAQS = [
  {
    q: 'Berapa biaya pendaftaran turnamen?',
    a: 'Rp 25.000 per tim yang didaftarkan — bukan per orang. Jika kamu mendaftarkan 2 tim (maksimal per orang), total biayanya Rp 50.000. Setiap tim yang lolos verifikasi otomatis mendapat E-Voucher eksklusif dari BELOVECORP INDONESIA.',
  },
  {
    q: 'Satu orang boleh daftar berapa slot?',
    a: 'Maksimal 2 slot tim per orang. Total kuota turnamen dibatasi hanya 64 slot tim — begitu penuh, pendaftaran otomatis ditutup sampai season berikutnya.',
  },
  {
    q: 'Bagaimana sistem pertandingannya?',
    a: '64 tim dibagi ke beberapa grup untuk fase round-robin. Peringkat terbaik tiap grup lolos ke babak knockout (sistem gugur) hingga Grand Final.',
  },
  {
    q: 'Bagaimana sistem keamanan anti-kecurangan bekerja?',
    a: 'Setiap laporan skor wajib melalui validasi OTP dan JWT Auth, ditambah rekaman pertandingan sebagai bukti resmi. Pelanggaran berakibat diskualifikasi langsung.',
  },
  {
    q: 'Bisa lihat statistik tim secara langsung?',
    a: 'Ya. Setiap tim memiliki Command Center — dasbor privat berisi agregat gol, Goal Difference, dan statistik Menang/Seri/Kalah yang bisa dipantau tim masing-masing.',
  },
  {
    q: 'Kapan dan bagaimana E-Voucher dicairkan?',
    a: 'E-Voucher dikirim otomatis via WhatsApp setelah tim lolos verifikasi admin, dan dapat ditukar di gerai BELOVECORP INDONESIA atau melalui link penukaran online yang disertakan.',
  },
  {
    q: 'Bagaimana jika pembayaran sudah dikirim tapi verifikasi ditolak?',
    a: 'Tim akan dihubungi via WhatsApp resmi untuk klarifikasi. Jika data/bukti bayar tidak valid dan tidak bisa dilengkapi, dana akan dikembalikan penuh maksimal 3 hari kerja setelah konfirmasi.',
  },
  {
    q: 'Bagaimana cara memastikan ini bukan penipuan?',
    a: 'Semua komunikasi resmi hanya melalui WhatsApp dan Instagram yang tercantum di halaman ini, dan pembayaran hanya ke rekening/QRIS resmi yang muncul di form pendaftaran. Jika ada pihak lain mengatasnamakan panitia di luar kanal ini, laporkan ke kontak resmi kami.',
  },
]

// ─────────────────────────────────────────────────────────
// Decorative primitives
// ─────────────────────────────────────────────────────────

function SectionSeam({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const line = tone === 'dark' ? 'bg-white/15' : 'bg-brand-bg-dark/10'
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 z-20 flex -translate-y-1/2 items-center justify-center px-6"
    >
      <span
        className={`h-px flex-1 ${line}`}
        style={{ backgroundImage: 'repeating-linear-gradient(90deg, currentColor 0 6px, transparent 6px 11px)' }}
      />
      <span className="mx-3 flex h-2.5 w-2.5 shrink-0 rotate-45 bg-gradient-brand shadow-brand" />
      <span
        className={`h-px flex-1 ${line}`}
        style={{ backgroundImage: 'repeating-linear-gradient(90deg, currentColor 0 6px, transparent 6px 11px)' }}
      />
    </div>
  )
}

function PitchWatermark({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 400 400"
      className={`pointer-events-none absolute -z-10 h-56 w-56 opacity-[0.07] sm:h-80 sm:w-80 lg:h-[380px] lg:w-[380px] ${className}`}
    >
      <circle cx="200" cy="200" r="130" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="200" cy="200" r="4" fill="currentColor" />
      <path d="M200 70 V330" stroke="currentColor" strokeWidth="2" />
      <path d="M70 130 h60 v140 h-60 Z" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M330 130 h-60 v140 h60 Z" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function DotGrid({ className = '', tint = 'rgba(86,27,29,0.09)' }: { className?: string; tint?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute -z-10 ${className}`}
      style={{ backgroundImage: `radial-gradient(${tint} 1px, transparent 1px)`, backgroundSize: '18px 18px' }}
    />
  )
}

function StitchTexture({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute -z-10 ${className}`}
      style={{
        backgroundImage: 'repeating-linear-gradient(-45deg, rgba(252,179,53,0.16) 0 2px, transparent 2px 16px)',
      }}
    />
  )
}

function Eyebrow({ children, tone = 'light' }: { children: React.ReactNode; tone?: 'light' | 'dark' }) {
  return (
    <span
      className={`inline-flex -skew-x-6 items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest ${tone === 'dark'
        ? 'border-brand-gold/40 bg-brand-gold/10 text-brand-gold'
        : 'border-brand-primary/20 bg-brand-primary/5 text-brand-primary'
        }`}
    >
      <span className="block skew-x-6">{children}</span>
    </span>
  )
}

// Kartu info generik — dipakai ulang di beberapa section supaya tidak
// ada 4-5 potongan JSX kartu yang nyaris identik ditulis manual berulang.
function InfoCard({
  icon: Icon,
  title,
  desc,
  tag,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  desc: string
  tag?: string
}) {
  return (
    <div className="group relative -skew-x-3 border border-brand-secondary/10 bg-white p-8 shadow-brand transition-all hover:-translate-y-1.5 hover:border-brand-gold/40 hover:shadow-brand-lg">
      <div className="skew-x-3">
        {tag && (
          <span className="font-jetbrains text-xs font-bold uppercase tracking-widest text-brand-bronze">{tag}</span>
        )}
        <div className={`flex h-12 w-12 items-center justify-center -skew-x-6 bg-gradient-brand text-white shadow-brand ${tag ? 'mt-4' : ''}`}>
          <Icon className="h-6 w-6 skew-x-6" />
        </div>
        <h3 className="mt-5 text-lg font-black text-brand-bg-dark">{title}</h3>
        <p className="mt-2 text-sm font-medium leading-relaxed text-brand-bg-dark/60">{desc}</p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Navbar
// ─────────────────────────────────────────────────────────

function PremiumNavbar() {
  return (
    // ── CONTAINER UTAMA: Melayang di tengah atas dengan padding ringkas
    <header className="fixed inset-x-0 top-4 z-50 mx-auto w-full max-w-4xl px-4 sm:px-0 select-none">
      <div className="relative flex h-16 items-center justify-between border border-white/10 bg-[#150a0d]/85 px-6 shadow-2xl shadow-black/40 backdrop-blur-md rounded-2xl sm:rounded-full">

        {/* ── BAGIAN KIRI: Logo & Brand Mark ── */}
        <div className="flex items-center gap-4">
          <a href="#hero" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <Image
              src="/logos/logo_BELOVESPORT.png"
              alt="BELOVESPORT"
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
            <span className="text-sm font-black tracking-tight text-white">BELOVESPORT</span>
          </a>

          {/* Garis Pembatas Kiri (Hanya muncul di desktop) */}
          <div className="hidden h-6 w-px bg-white/10 sm:block" aria-hidden="true" />
        </div>

        {/* ── BAGIAN TENGAH: Menu Navigasi Bergaya Dock ── */}
        <nav className="hidden items-center gap-1.5 sm:flex" aria-label="Navigasi utama">
          {[
            { href: '#daftar', label: 'Cara Daftar' },
            { href: '#format', label: 'Format' },
            { href: '#prize', label: 'Hadiah' },
            { href: '#schedule', label: 'Jadwal' },
            { href: '#faq', label: 'FAQ' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-xs font-bold text-white/70 transition-all duration-200 hover:bg-white/5 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* ── BAGIAN KANAN: Tombol Aksi & Pembatas ── */}
        <div className="flex items-center gap-4">
          {/* Garis Pembatas Kanan (Hanya muncul di desktop) */}
          <div className="hidden h-6 w-px bg-white/10 sm:block" aria-hidden="true" />

          {/* Tombol Daftar Tim -> Redirect ke Google Form */}
          <div className="hidden sm:block">
            <a
              href="https://forms.gle/chyLHXbWgoTtPxpP6"
              target="_blank"
              rel="noopener noreferrer"
            >
            </a>
          </div>

          {/* Navigasi Mobile (Burger Menu) */}
          <div className="sm:hidden">
            <MobileNav />
          </div>
        </div>

      </div>
    </header>
  )
}

// ─────────────────────────────────────────────────────────
// Hero
// ─────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-dark px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(252,179,53,0.18) 0%, transparent 60%), radial-gradient(ellipse 40% 35% at 90% 75%, rgba(252,179,53,0.08) 0%, transparent 60%)',
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute -left-24 top-16 -z-10 h-[420px] w-[420px] -skew-x-12 border-l-[3px] border-brand-gold/15" aria-hidden />
      <div className="pointer-events-none absolute -right-24 bottom-0 -z-10 h-[380px] w-[380px] -skew-x-12 border-r-[3px] border-brand-gold/10" aria-hidden />

      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow tone="dark">Turnamen Nasional eFootball Mobile · Season 1</Eyebrow>
      </div>

      <div className="relative mx-auto mt-14 w-full max-w-3xl">
        <div
          aria-hidden
          className="absolute -inset-10 -z-10 rounded-[3rem] bg-gradient-to-b from-brand-gold/25 via-brand-gold/10 to-transparent blur-[100px] animate-pulse [animation-duration:4s]"
        />
        <div
          aria-hidden
          className="absolute left-1/2 top-[-20%] -z-10 h-[150%] w-[65%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,_rgba(244,215,124,0.35),_transparent_65%)]"
        />

        <div className="relative rounded-[2rem] bg-gradient-to-br from-brand-gold via-[#f4d77c] to-brand-gold p-[2px] shadow-brand-glow">
          <div className="rounded-[1.9rem] bg-gradient-to-br from-[#3a0d16] via-brand-primary to-[#3a0d16] p-[1px]">
            <div className="overflow-hidden rounded-[1.85rem] bg-[#f7f3ea]">
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                poster="/videos/logo-animasi-poster.jpg"
                className="aspect-video w-full object-contain"
              >
                <source src="/videos/logo-animasi.mp4" type="video/mp4" />
                Browser Anda tidak mendukung tag video.
              </video>
            </div>
          </div>
        </div>

        {[
          'left-0 top-0 -translate-x-2 -translate-y-2 border-l-2 border-t-2',
          'right-0 top-0 translate-x-2 -translate-y-2 border-r-2 border-t-2',
          'left-0 bottom-0 -translate-x-2 translate-y-2 border-l-2 border-b-2',
          'right-0 bottom-0 translate-x-2 translate-y-2 border-r-2 border-b-2',
        ].map((pos) => (
          <span key={pos} aria-hidden className={`absolute hidden h-6 w-6 border-brand-gold/60 sm:block ${pos}`} />
        ))}
      </div>

      <div className="mx-auto mt-7 flex max-w-lg divide-x divide-brand-gold/15 overflow-hidden rounded-2xl border border-brand-gold/25 bg-[#0f0710]/70 backdrop-blur-sm">
        <div className="flex flex-1 flex-col items-center gap-1 px-3 py-3">
          <Wallet className="h-4 w-4 text-brand-gold" aria-hidden />
          <span className="text-[11px] font-extrabold text-white/90">Rp 25.000</span>
          <span className="text-[9px] font-bold uppercase tracking-wide text-white/55">Per Tim</span>
        </div>
        <div className="flex flex-1 flex-col items-center gap-1 px-3 py-3">
          <Ticket className="h-4 w-4 text-brand-gold" aria-hidden />
          <span className="text-[11px] font-extrabold text-white/90">64 Slot</span>
          <span className="text-[9px] font-bold uppercase tracking-wide text-white/55">Kuota</span>
        </div>
        <div className="flex flex-1 flex-col items-center gap-1 px-3 py-3">
          <Users className="h-4 w-4 text-brand-gold" aria-hidden />
          <span className="text-[11px] font-extrabold text-white/90">Maks. 2</span>
          <span className="text-[9px] font-bold uppercase tracking-wide text-white/55">Slot/Orang</span>
        </div>
      </div>

      <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <SignupButton variant="primary" animatePulse className="text-white">
          <Zap className="h-4 w-4" />
          <span className="text-base font-extrabold uppercase tracking-wider">Daftar Sekarang</span>
        </SignupButton>
        <LinkButton href="#schedule" variant="outline-dark" className="text-white">
          <span className="text-sm font-bold uppercase tracking-wider">Lihat Jadwal Turnamen</span>
          <ChevronRight className="h-4 w-4" aria-hidden />
        </LinkButton>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────
// Status bar — kuota ditampilkan sebagai info, bukan klaim "live"
// ─────────────────────────────────────────────────────────

function StatusBar() {
  return (
    <section className="relative z-20 -mt-6 px-0">
      <div className="relative -skew-y-1 bg-brand-bg-surface py-4 shadow-md">
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand-gold to-transparent" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" aria-hidden />
        <div className="skew-y-1">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row sm:px-10">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400" />
              </span>
              <span className="font-jetbrains text-sm font-extrabold uppercase tracking-widest text-emerald-600">
                Pendaftaran Dibuka
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs font-bold uppercase tracking-wide text-brand-muted sm:text-sm">
              <span className="flex items-center gap-2">
                <Swords className="h-4 w-4 text-brand-gold" aria-hidden />
                Format: Grup → Knockout
              </span>
              <span className="hidden text-brand-border sm:inline" aria-hidden>|</span>
              <span className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-brand-gold" aria-hidden />
                Rp 25.000 / Tim · Maks 2 Slot
              </span>
              <span className="hidden text-brand-border sm:inline" aria-hidden>|</span>
              <span className="flex items-center gap-2 text-brand-gold">
                <Ticket className="h-4 w-4" aria-hidden />
                Kuota terbatas 64 tim
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────
// Tutorial Pendaftaran
// ─────────────────────────────────────────────────────────

function RegistrationTutorialSection() {
  return (
    <section id="daftar" className="relative overflow-hidden bg-white px-5 py-24 sm:px-8">
      <SectionSeam />
      <PitchWatermark className="-right-24 -top-16 text-brand-primary" />
      <DotGrid className="inset-x-0 bottom-0 h-64" tint="rgba(86,27,29,0.05)" />

      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Tutorial Pendaftaran</Eyebrow>
          <h2 className="mt-5 text-3xl font-black italic tracking-tight text-brand-bg-dark sm:text-4xl">
            4 Langkah, Slotmu Aman
          </h2>
          <p className="mt-3 font-semibold text-brand-bg-dark/55">
            Dari klik pertama sampai akun Command Center aktif — semuanya bisa selesai dalam hitungan menit.
          </p>
        </div>

        <div className="relative mt-16 grid gap-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          <div
            className="pointer-events-none absolute left-0 right-0 top-[52px] hidden h-px bg-gradient-to-r from-transparent via-brand-border to-transparent lg:block"
            aria-hidden
          />

          {REGISTRATION_TUTORIAL.map((s) => (
            <div key={s.step} className="relative flex flex-col items-center text-center">
              <div className="relative flex h-[104px] w-[104px] items-center justify-center">
                <div className="absolute inset-0 -skew-x-6 rounded-2xl bg-gradient-brand shadow-brand" />
                <span className="relative skew-x-6 font-jetbrains text-2xl font-black text-white">{s.step}</span>
                <div className="absolute -bottom-3 -right-3 flex h-9 w-9 items-center justify-center rounded-full border-4 border-white bg-brand-dark text-white shadow-md">
                  <s.icon className="h-4 w-4" aria-hidden />
                </div>
              </div>
              <h3 className="mt-5 text-base font-black text-brand-bg-dark">{s.title}</h3>
              <p className="mt-2 text-sm font-medium leading-relaxed text-brand-bg-dark/60">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="https://forms.gle/chyLHXbWgoTtPxpP6"
            target="_blank"
            rel="noopener noreferrer"
          >
          </a>
          <a href="/panduan#daftar" className="inline-flex items-center gap-1.5 text-sm font-extrabold text-brand-primary hover:underline">
            Lihat panduan lengkap bergambar <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────
// Format Kompetisi
// ─────────────────────────────────────────────────────────

function FormatSection() {
  return (
    <section id="format" className="relative overflow-hidden bg-zinc-50 px-5 py-24 sm:px-8">
      <SectionSeam />
      <div className="pointer-events-none absolute -right-24 top-10 -z-10 h-[420px] w-[420px] -skew-x-12 border-l-[3px] border-brand-primary/10" aria-hidden />
      <PitchWatermark className="-left-28 bottom-0 text-brand-primary" />

      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Format Kompetisi</Eyebrow>
          <h2 className="mt-5 text-3xl font-black italic tracking-tight text-brand-bg-dark sm:text-4xl">
            Grup, Lalu Sistem Gugur
          </h2>
          <p className="mt-3 font-semibold text-brand-bg-dark/55">
            Simpel dan transparan — diwasiti otomatis oleh sistem, tanpa rekap manual yang rawan salah.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {REG_RULES.map((r) => (
            <div
              key={r.label}
              className="-skew-x-3 border border-brand-secondary/10 bg-white p-5 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-brand-gold/40 hover:shadow-brand"
            >
              <div className="skew-x-3">
                <r.icon className="mx-auto h-6 w-6 text-brand-primary" aria-hidden />
                <p className="mt-3 font-jetbrains text-lg font-black text-brand-bg-dark sm:text-xl">{r.value}</p>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-brand-bg-dark/50">{r.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {COMPETITION_FORMAT.map((f) => (
            <InfoCard key={f.title} icon={f.icon} title={f.title} desc={f.desc} />
          ))}
        </div>

        <div className="relative mt-16 -skew-y-1 overflow-hidden bg-gradient-brand px-8 py-10 shadow-brand-glow sm:px-14">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{ backgroundImage: 'repeating-linear-gradient(-45deg, rgba(0,0,0,0.12) 0 2px, transparent 2px 16px)' }}
          />
          <div className="skew-y-1 flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <span className="font-jetbrains text-xs font-bold uppercase tracking-[0.2em] text-brand-dark/70">
                Biaya Pendaftaran
              </span>
              <p className="mt-1 font-jetbrains text-4xl font-black tracking-tight text-brand-dark sm:text-5xl">
                Rp 25.000
                <span className="ml-2 text-base font-bold text-brand-dark/70">/ tim</span>
              </p>
              <p className="mt-2 text-sm font-bold text-brand-dark/80">
                Maks. 2 slot per orang · Kuota terbatas 64 tim
              </p>
            </div>
            <LinkButton href="#prize" variant="ghost-light">
              <Trophy className="h-4 w-4" />
              <span className="text-sm font-extrabold uppercase tracking-wider">Lihat Total Hadiah</span>
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────
// Prize Pool — breakdown hadiah, bukan cuma diklaim "nasional"
// tanpa rincian. Angka masih placeholder, lihat PRIZE_POOL di atas.
// ─────────────────────────────────────────────────────────

const PRIZE_TONE_STYLES: Record<'gold' | 'silver' | 'bronze', string> = {
  gold: 'border-brand-gold/50 bg-gradient-to-b from-brand-gold/10 to-transparent',
  silver: 'border-brand-border bg-brand-bg-surface',
  bronze: 'border-brand-bronze/30 bg-gradient-to-b from-brand-bronze/[0.06] to-transparent',
}

const PRIZE_ICON_TONE: Record<'gold' | 'silver' | 'bronze', string> = {
  gold: 'bg-gradient-brand text-white shadow-brand-glow',
  silver: 'bg-brand-dark text-white',
  bronze: 'bg-brand-bronze text-white',
}

function PrizePoolSection() {
  return (
    <section id="prize" className="relative overflow-hidden bg-white px-5 py-24 sm:px-8">
      <SectionSeam />
      <PitchWatermark className="-left-24 -top-10 text-brand-primary" />

      <div className="w-full mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center flex flex-col items-center">

          {/* 🚀 FIX: Memaksa piala dan teks sejajar horizontal secara presisi */}
          <Eyebrow>
            <span className="flex items-center justify-center gap-1.5 font-semibold text-xs tracking-wider uppercase">
              <Trophy className="h-3.5 w-3.5 text-brand-gold shrink-0" aria-hidden />
              Total Hadiah
            </span>
          </Eyebrow>

          <h2 className="mt-5 text-2xl sm:text-4xl font-black italic tracking-tight text-brand-dark uppercase px-2 leading-tight">
            Yang Diperebutkan di Grand Final
          </h2>

          {/* Baris 778 - 780 sesuai file Koko */}
          <p className="mt-3 text-sm sm:text-base font-medium text-brand-muted max-w-prose text-center px-2 w-full break-words">
            Meeting. Total hadiah dapat bertambah mengikuti jumlah tim yang lolos verifikasi.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {PRIZE_POOL.map((p) => (
            <div
              key={p.place}
              className={`relative -skew-x-3 rounded-2xl border p-8 text-center shadow-sm transition-all hover:-translate-y-1.5 hover:shadow-brand ${PRIZE_TONE_STYLES[p.tone]}`}
            >
              <div className="skew-x-3">
                <div
                  className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full -skew-x-6 ${PRIZE_ICON_TONE[p.tone]}`}
                >
                  <p.icon className="h-7 w-7 skew-x-6" aria-hidden />
                </div>
                <p className="mt-5 font-jetbrains text-xs font-bold uppercase tracking-widest text-brand-bronze">
                  {p.place}
                </p>
                <p className="mt-2 font-jetbrains text-2xl font-black tracking-tight text-brand-bg-dark sm:text-3xl">
                  {p.amount}
                </p>
                <p className="mt-3 text-xs font-medium leading-relaxed text-brand-bg-dark/55">{p.note}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs font-medium text-brand-bg-dark/45">
          Nominal final diumumkan resmi melalui kanal WhatsApp &amp; Instagram BELOVESPORT sebelum Technical
          Meeting. Total hadiah dapat bertambah mengikuti jumlah tim yang lolos verifikasi.
        </p>
      </div >
    </section >
  )
}

// ─────────────────────────────────────────────────────────
// Jadwal
// ─────────────────────────────────────────────────────────

function ScheduleSection() {
  return (
    <section id="schedule" className="relative overflow-hidden bg-zinc-50 px-5 py-24 sm:px-8">
      <SectionSeam />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-brand-primary/10 to-transparent"
      />
      <PitchWatermark className="-right-24 top-1/2 -translate-y-1/2 text-brand-primary" />

      <div className="mx-auto max-w-4xl">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Fixtures</Eyebrow>
          <h2 className="mt-5 text-3xl font-black italic tracking-tight text-brand-bg-dark sm:text-4xl">
            Jadwal Pilot Season
          </h2>
        </div>

        <ol className="mt-12 space-y-3">
          {SCHEDULE.map((item) => (
            <li
              key={item.title}
              className="flex flex-col gap-3 -skew-x-2 border border-brand-secondary/10 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex skew-x-2 items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center -skew-x-6 bg-brand-primary/10 text-brand-primary">
                  <Calendar className="h-5 w-5 skew-x-6" aria-hidden />
                </div>
                <div>
                  <p className="font-jetbrains text-xs font-bold uppercase tracking-wide text-brand-bronze">{item.date}</p>
                  <p className="font-bold text-brand-bg-dark">{item.title}</p>
                </div>
              </div>
              {/* Perbaikan: sebelumnya elemen ini punya class `skew-x-2 -skew-x-6`
                  sekaligus (saling membatalkan). Sekarang cukup satu skew konsisten
                  yang benar-benar netral terhadap parent -skew-x-2 di atas. */}
              <span className="skew-x-2 self-start bg-brand-gold/15 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-brand-bronze sm:self-center">
                {item.tag}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────
// Reward & BELOVECORP Branding
// ─────────────────────────────────────────────────────────

function RewardSection() {
  return (
    <section id="reward" className="relative overflow-hidden bg-brand-bg-light px-5 py-24 sm:px-8">
      <SectionSeam />
      <StitchTexture className="inset-y-0 right-0 w-48 opacity-40" />
      <div className="pointer-events-none absolute -left-16 bottom-0 -z-10 h-72 w-72 rounded-full bg-brand-gold/10 blur-3xl" aria-hidden />

      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
        <div>
          <Eyebrow tone="dark">
            <Gift className="h-3.5 w-3.5" aria-hidden />
            Value Added
          </Eyebrow>
          <h2 className="mt-5 text-3xl font-black italic tracking-tight text-brand-dark sm:text-4xl">
            Tiap Tim yang Lolos Verifikasi
            <span className="block text-brand-gold">Langsung Dapat E-Voucher.</span>
          </h2>
          <p className="mt-4 font-medium text-brand-muted">
            E-Voucher eksklusif dari BELOVECORP INDONESIA dikirim otomatis setelah admin memverifikasi tim — bisa
            langsung ditukar di gerai konveksi &amp; percetakan kami.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 rounded-xl border border-brand-border bg-brand-bg-surface px-5 py-3">
              <Image src="/logos/logo_BELOVESPORT.png" alt="BELOVESPORT" width={36} height={36} className="h-9 w-9 object-contain" />
              <span className="text-sm font-bold text-brand-dark">BELOVESPORT</span>
            </div>
            <span className="text-xl font-black text-brand-border" aria-hidden>×</span>
            <a
              href="https://www.belovecorp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-brand-border bg-brand-bg-surface px-5 py-3 transition-colors hover:border-brand-gold/50"
            >
              <Image
                src="/logos/Belovecorp.png"
                alt="BELOVECORP — Get Your Choice"
                width={140}
                height={40}
                className="h-7 w-auto object-contain"
              />
            </a>
          </div>

          <p className="mt-5 max-w-sm text-xs font-medium leading-relaxed text-brand-muted">
            BELOVECORP INDONESIA adalah usaha konveksi &amp; percetakan yang juga menaungi jersey resmi dan
            merchandise turnamen ini.
          </p>
          <a
            href="https://www.belovecorp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-extrabold text-brand-primary hover:underline"
          >
            Kunjungi BELOVECORP.com <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </a>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-brand opacity-30 blur-2xl" aria-hidden />
          <div className="relative -skew-x-3 overflow-hidden rounded-2xl border border-brand-border bg-gradient-brand p-1 shadow-md">
            <div className="skew-x-3 rounded-xl bg-brand-bg-surface p-7">
              <div className="flex items-center justify-between">
                <span className="font-jetbrains text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold">
                  E-Voucher Resmi
                </span>
                <Gift className="h-6 w-6 text-brand-gold" aria-hidden />
              </div>
              <p className="mt-6 font-jetbrains text-4xl font-black tracking-tight text-brand-dark">Rp 50.000</p>
              <p className="text-xs font-bold uppercase tracking-widest text-brand-muted">
                Belanja Merchandise BELOVECORP
              </p>
              <div className="mt-6 flex items-center justify-between border-t border-dashed border-brand-border pt-4">
                <span className="font-jetbrains text-[10px] text-brand-muted">
                  CODE: BLV-EFM-2026 <span className="text-brand-muted/70">(contoh)</span>
                </span>
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden /> Terbit Otomatis
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────
// Pusat Bantuan + Kontak Resmi (trust band)
// ─────────────────────────────────────────────────────────

function HelpCenterBand() {
  return (
    <section className="relative overflow-hidden bg-gradient-dark px-5 py-20 sm:px-8">
      <SectionSeam tone="dark" />
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(252,179,53,0.12) 0%, transparent 70%)' }}
        aria-hidden
      />
      <div className="pointer-events-none absolute -left-20 bottom-0 -z-10 h-[360px] w-[360px] -skew-x-12 border-l-[3px] border-brand-gold/10" aria-hidden />
      <div className="pointer-events-none absolute -right-20 top-0 -z-10 h-[320px] w-[320px] -skew-x-12 border-r-[3px] border-brand-gold/10" aria-hidden />

      <div className="mx-auto max-w-5xl text-center">
        <Eyebrow tone="dark">Pusat Bantuan &amp; Kontak Resmi</Eyebrow>
        <h2 className="mt-5 text-3xl font-black italic tracking-tight text-white sm:text-4xl">
          Bingung Harus Mulai dari Mana?
        </h2>
        <p className="mx-auto mt-3 max-w-xl font-semibold text-white/75">
          Semua panduan bergambar — dari cara daftar sampai cara pakai Command Center — sudah kami kumpulkan di
          satu tempat. Butuh bantuan langsung? Hubungi kanal resmi di bawah, bukan pihak lain yang mengatasnamakan
          panitia.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <a
            href="/panduan#daftar"
            className="group relative -skew-x-3 overflow-hidden border border-white/10 bg-white/5 p-7 text-left transition-all hover:-translate-y-1.5 hover:border-brand-gold/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-gold"
          >
            <div className="skew-x-3">
              <div className="flex h-11 w-11 items-center justify-center -skew-x-6 bg-gradient-brand shadow-brand">
                <UserPlus className="h-5 w-5 skew-x-6 text-white" aria-hidden />
              </div>
              <h3 className="mt-4 text-lg font-black text-white">Cara Mendaftar</h3>
              <p className="mt-2 text-sm font-medium leading-relaxed text-white/70">
                Panduan langkah-demi-langkah, mulai dari isi form sampai tim kamu resmi terverifikasi.
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-extrabold text-brand-gold">
                Baca panduan <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </span>
            </div>
          </a>

          <a
            href="/panduan#sistem"
            className="group relative -skew-x-3 overflow-hidden border border-white/10 bg-white/5 p-7 text-left transition-all hover:-translate-y-1.5 hover:border-brand-gold/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-gold"
          >
            <div className="skew-x-3">
              <div className="flex h-11 w-11 items-center justify-center -skew-x-6 bg-gradient-brand shadow-brand">
                <LayoutDashboard className="h-5 w-5 skew-x-6 text-white" aria-hidden />
              </div>
              <h3 className="mt-4 text-lg font-black text-white">Cara Pakai Sistem</h3>
              <p className="mt-2 text-sm font-medium leading-relaxed text-white/70">
                Tutorial memakai Command Center: lapor skor, pantau bagan, dan baca klasemen tim.
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-extrabold text-brand-gold">
                Baca panduan <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </span>
            </div>
          </a>
        </div>

        {/* Kontak resmi — sebelumnya cuma disebut sekilas di teks tutorial,
            sekarang tampil jelas dan bisa langsung diklik/disimpan. */}
        <div className="mx-auto mt-8 flex max-w-lg flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-6 sm:flex-row sm:justify-center sm:gap-6">
          <a
            href={OFFICIAL_CONTACT.whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-bold text-white hover:text-brand-gold"
          >
            <MessageCircle className="h-4 w-4 text-emerald-400" aria-hidden />
            {OFFICIAL_CONTACT.whatsapp.label}
          </a>
          <span className="hidden h-4 w-px bg-white/15 sm:block" aria-hidden />
          <a
            href={OFFICIAL_CONTACT.instagram.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-bold text-white hover:text-brand-gold"
          >
            <Instagram className="h-4 w-4 text-brand-gold" aria-hidden />
            {OFFICIAL_CONTACT.instagram.label}
          </a>
        </div>
        <p className="mt-3 text-xs font-medium text-white/50">
          Kanal ini adalah satu-satunya jalur komunikasi resmi panitia BELOVESPORT.
        </p>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────────────────

function FAQSection() {
  return (
    <section id="faq" className="relative overflow-hidden bg-zinc-50 px-5 py-24 sm:px-8">
      <SectionSeam />
      <DotGrid className="inset-x-0 top-0 h-56" tint="rgba(86,27,29,0.05)" />

      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="mt-5 text-3xl font-black italic tracking-tight text-brand-bg-dark sm:text-4xl">
            Yang Sering Ditanyakan
          </h2>
        </div>

        <FaqAccordion faqs={FAQS} />
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────
// Final CTA
// ─────────────────────────────────────────────────────────

function FinalCTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-zinc-50 via-zinc-50 to-white px-5 py-20 sm:px-8">
      <SectionSeam />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-gold/15 blur-[110px]"
      />

      <div className="relative mx-auto max-w-5xl -skew-y-1 overflow-hidden bg-gradient-brand px-8 py-16 text-center shadow-brand-glow sm:px-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.15]"
          style={{ backgroundImage: 'repeating-linear-gradient(-45deg, rgba(0,0,0,0.12) 0 2px, transparent 2px 16px)' }}
        />
        <div className="skew-y-1">
          <Trophy className="mx-auto h-12 w-12 text-brand-primary" aria-hidden />
          <h2 className="mt-5 text-3xl font-black italic tracking-tight text-brand-dark sm:text-5xl">
            Siap Merebut Gelar Juara?
          </h2>
          <p className="mx-auto mt-3 max-w-lg font-medium text-brand-muted">
            64 slot tim. Sekali bracket ditutup, gerbang itu tertutup sampai season berikutnya.
          </p>
          <div className="mt-8 flex justify-center">
            <a
              href="https://forms.gle/chyLHXbWgoTtPxpP6"
              target="_blank"
              rel="noopener noreferrer"
            >
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────
// Footer — dulu tidak diketahui isinya (import dari file terpisah),
// sekarang dibuat eksplisit dengan link legal yang wajib ada.
// ─────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-gradient-dark px-5 py-14 text-white/80 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <Image src="/logos/logo_BELOVESPORT.png" alt="BELOVESPORT" width={28} height={28} className="h-7 w-7 object-contain" />
              <span className="text-sm font-black tracking-tight text-white">BELOVESPORT</span>
            </div>
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-white/65">
              Turnamen Nasional eFootball Mobile, diselenggarakan oleh BELOVECORP INDONESIA.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-gold">Navigasi</h3>
            <ul className="mt-3 space-y-2 text-sm text-white/75">
              <li><a href="#daftar" className="transition-colors hover:text-white">Cara Daftar</a></li>
              <li><a href="#format" className="transition-colors hover:text-white">Format Kompetisi</a></li>
              <li><a href="#prize" className="transition-colors hover:text-white">Hadiah</a></li>
              <li><a href="#schedule" className="transition-colors hover:text-white">Jadwal</a></li>
              <li><a href="#faq" className="transition-colors hover:text-white">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-gold">Kontak &amp; Legal</h3>
            <ul className="mt-3 space-y-2 text-sm text-white/75">
              <li>
                <a href={OFFICIAL_CONTACT.whatsapp.href} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
                  WhatsApp: {OFFICIAL_CONTACT.whatsapp.label}
                </a>
              </li>
              <li>
                <a href={`mailto:${OFFICIAL_CONTACT.email}`} className="transition-colors hover:text-white">
                  {OFFICIAL_CONTACT.email}
                </a>
              </li>
              <li><a href="/syarat-ketentuan" className="transition-colors hover:text-white">Syarat &amp; Ketentuan</a></li>
              <li><a href="/kebijakan-privasi" className="transition-colors hover:text-white">Kebijakan Privasi</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/55 sm:flex-row">
          <p>© 2026 BELOVECORP INDONESIA. Seluruh hak cipta dilindungi.</p>
          <p>BELOVESPORT adalah unit turnamen di bawah BELOVECORP INDONESIA.</p>
        </div>
      </div>
    </footer>
  )
}

// ─────────────────────────────────────────────────────────
// Page (Server Component)
// ─────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-brand-bg-light text-brand-dark selection:bg-brand-gold/30">
      <style>{`
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(252, 179, 53, 0.45), 0 10px 30px -8px rgba(86, 27, 29, 0.35); }
          50% { box-shadow: 0 0 0 10px rgba(252, 179, 53, 0), 0 10px 30px -8px rgba(86, 27, 29, 0.35); }
        }
        .animate-pulse-glow {
          animation: pulseGlow 2.2s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-pulse-glow { animation: none; }
        }
      `}</style>

      <PremiumNavbar />
      <HeroSection />
      <StatusBar />
      <RegistrationTutorialSection />
      <FormatSection />
      <PrizePoolSection />
      <ScheduleSection />
      <RewardSection />
      <HelpCenterBand />
      <FAQSection />
      <FinalCTASection />
      <Footer />
    </main>
  )
}