'use client'

/**
 * BELOVESPORT — eFootball Mobile National Tournament 2026
 * V2.0 — Premium upgrade pass.
 * Light-mode body, two dark "broadcast" moments (Hero + Pusat Bantuan band),
 * skewed/angled sporty cuts, italic-bold headlines, FOMO status bar.
 * Brand: BELOVECORP INDONESIA (Konveksi & Percetakan).
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  Trophy,
  Gift,
  ShieldCheck,
  Zap,
  Users,
  Calendar,
  ChevronDown,
  ChevronRight,
  Swords,
  CheckCircle2,
  ArrowRight,
  LayoutDashboard,
  KeyRound,
  BarChart3,
  Lock,
  Radio,
  Wallet,
  UserPlus,
  FileText,
  Grid3x3,
  Flame,
  Ticket,
  ExternalLink,
  Sparkles,
} from 'lucide-react'
import { Eyebrow, SkewButton, PremiumNavbar, Footer } from '@/components/site/SiteChrome'

// ─────────────────────────────────────────────────────────
// Static content
// ─────────────────────────────────────────────────────────

const FLOATING_STATS = [
  { label: 'Prize Pool', value: 'Rp 1.000.000', icon: Trophy, rotate: '-3deg' },
  { label: 'Biaya Daftar', value: 'Rp 25.000', icon: Wallet, rotate: '2deg' },
]

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
    desc: 'Admin memverifikasi data & pembayaran maksimal 1x24 jam. Kamu dihubungi via WhatsApp begitu slot dikonfirmasi.',
  },
  {
    icon: LayoutDashboard,
    step: '04',
    title: 'Akses Command Center',
    desc: 'Dasbor tim aktif otomatis — pantau jadwal, lapor skor pertandingan, dan cek klasemen real-time di sana.',
  },
]

const REG_RULES = [
  { icon: Wallet, label: 'Biaya Pendaftaran', value: 'Rp 25.000 / Tim' },
  { icon: Users, label: 'Maksimal', value: '2 Slot per Orang' },
  { icon: Ticket, label: 'Kuota Total', value: '64 Slot Tim' },
  { icon: Swords, label: 'Format', value: 'Grup + Knockout' },
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
    desc: 'Bagan dan klasemen ter-update otomatis real-time dengan standar perhitungan FIFA: Poin, Goal Difference, dan Goal Made.',
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
    desc: 'Setiap tim mendapat dasbor privat untuk memantau performa, agregat gol, dan statistik Win / Draw / Lose secara langsung.',
  },
]

const SCHEDULE = [
  { date: '08–20 Jul', title: 'Pendaftaran & Verifikasi Tim', tag: 'OPEN' },
  { date: '22–23 Jul', title: 'Technical Meeting & Bracket Draw', tag: 'WAJIB' },
  { date: '25–28 Jul', title: 'Fase Grup — Kick-off', tag: 'LIVE' },
  { date: '29–30 Jul', title: 'Babak 8 Besar & Semifinal', tag: 'LIVE' },
  { date: '31 Jul', title: 'Grand Final', tag: 'FINAL' },
]

const STANDINGS_PREVIEW = [
  { team: 'GARUDA ESPORT', p: 3, w: 3, d: 0, l: 0, gd: '+7', pts: 9 },
  { team: 'NUSANTARA FC', p: 3, w: 2, d: 1, l: 0, gd: '+4', pts: 7 },
  { team: 'INDOPRIME FC', p: 3, w: 1, d: 1, l: 1, gd: '+1', pts: 4 },
  { team: 'NIAS PRIME FC', p: 3, w: 0, d: 0, l: 3, gd: '-5', pts: 0 },
]

const FAQS = [
  {
    q: 'Berapa biaya pendaftaran turnamen?',
    a: 'Biaya pendaftaran Rp 25.000 per tim / per orang. Setiap tim yang lolos verifikasi otomatis mendapat E-Voucher eksklusif dari BELOVECORP INDONESIA.',
  },
  {
    q: 'Satu orang boleh daftar berapa slot?',
    a: 'Maksimal 2 slot per orang. Total kuota turnamen dibatasi hanya 64 slot tim — begitu penuh, pendaftaran otomatis ditutup sampai season berikutnya.',
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
    a: 'Ya. Setiap tim memiliki Command Center — dasbor privat berisi agregat gol, Goal Difference, dan statistik Win/Draw/Lose yang ter-update real-time.',
  },
  {
    q: 'Kapan dan bagaimana E-Voucher dicairkan?',
    a: 'E-Voucher dikirim otomatis setelah tim lolos verifikasi admin, dan dapat ditukar langsung di gerai BELOVECORP INDONESIA terdekat.',
  },
]

// ─────────────────────────────────────────────────────────
// Decorative primitives — the visual "thread" tying every
// section together (BELOVECORP is a konveksi/garment brand,
// so a stitch-seam motif + faint pitch-line watermark recur
// throughout instead of flat, disconnected color blocks).
// ─────────────────────────────────────────────────────────

function SectionSeam({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const line = tone === 'dark' ? 'bg-white/15' : 'bg-brand-bg-dark/10'
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 z-20 flex -translate-y-1/2 items-center justify-center px-6"
    >
      <span className={`h-px flex-1 ${line}`} style={{ backgroundImage: 'repeating-linear-gradient(90deg, currentColor 0 6px, transparent 6px 11px)' }} />
      <span className="mx-3 flex h-2.5 w-2.5 shrink-0 rotate-45 bg-gradient-brand shadow-brand" />
      <span className={`h-px flex-1 ${line}`} style={{ backgroundImage: 'repeating-linear-gradient(90deg, currentColor 0 6px, transparent 6px 11px)' }} />
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
        backgroundImage:
          'repeating-linear-gradient(-45deg, rgba(252,179,53,0.16) 0 2px, transparent 2px 16px)',
      }}
    />
  )
}

/**
 * MeshGlow — the fix for "monoton putih": two large, soft, blurred
 * brand-color blobs (maroon + gold) per section, sized down on mobile
 * so they read as atmosphere, not clutter. Each section gets its own
 * `variant` so consecutive sections never look identical.
 */
function MeshGlow({ variant }: { variant: 'ivory' | 'blush' | 'citrus' | 'dusk' | 'pearl' }) {
  const variants: Record<string, { pos: string; size: string; color: string }[]> = {
    ivory: [
      { pos: '-right-16 -top-20 sm:-right-24 sm:-top-28', size: 'h-52 w-52 sm:h-80 sm:w-80', color: 'bg-brand-primary/[0.07]' },
      { pos: '-left-20 bottom-0 sm:-left-28', size: 'h-44 w-44 sm:h-72 sm:w-72', color: 'bg-brand-gold/[0.10]' },
    ],
    blush: [
      { pos: '-left-16 -top-16 sm:-left-24 sm:-top-24', size: 'h-52 w-52 sm:h-80 sm:w-80', color: 'bg-brand-gold/[0.10]' },
      { pos: '-right-20 bottom-10 sm:-right-28', size: 'h-48 w-48 sm:h-72 sm:w-72', color: 'bg-brand-primary/[0.08]' },
    ],
    citrus: [
      { pos: 'left-1/3 -top-24 sm:-top-32', size: 'h-56 w-56 sm:h-96 sm:w-96', color: 'bg-brand-gold/[0.09]' },
      { pos: '-right-16 bottom-0 sm:-right-20', size: 'h-40 w-40 sm:h-64 sm:w-64', color: 'bg-brand-primary/[0.07]' },
    ],
    dusk: [
      { pos: '-right-14 top-1/4 sm:-right-20', size: 'h-44 w-44 sm:h-72 sm:w-72', color: 'bg-brand-primary/[0.08]' },
      { pos: 'left-1/4 -bottom-20 sm:-bottom-28', size: 'h-48 w-48 sm:h-80 sm:w-80', color: 'bg-brand-gold/[0.08]' },
    ],
    pearl: [
      { pos: '-left-10 -top-14 sm:-left-16 sm:-top-20', size: 'h-40 w-40 sm:h-64 sm:w-64', color: 'bg-brand-gold/[0.10]' },
      { pos: 'right-0 bottom-0', size: 'h-56 w-56 sm:h-80 sm:w-80', color: 'bg-brand-primary/[0.06]' },
    ],
  }

  return (
    <>
      {variants[variant].map((b, idx) => (
        <div
          key={idx}
          aria-hidden
          className={`pointer-events-none absolute -z-10 rounded-full blur-2xl sm:blur-3xl ${b.pos} ${b.size} ${b.color}`}
        />
      ))}
    </>
  )
}

// ─────────────────────────────────────────────────────────
// B — Hero Section (video-led)
// ─────────────────────────────────────────────────────────

function HeroSection({ onSignup }: { onSignup: () => void }) {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-gradient-dark px-5 pb-24 pt-32 sm:px-8 sm:pt-40"
    >
      {/* Ambient glow field */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(252,179,53,0.18) 0%, transparent 60%), radial-gradient(ellipse 40% 35% at 90% 75%, rgba(252,179,53,0.08) 0%, transparent 60%)',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 top-16 -z-10 h-[420px] w-[420px] -skew-x-12 border-l-[3px] border-brand-gold/15"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-0 -z-10 h-[380px] w-[380px] -skew-x-12 border-r-[3px] border-brand-gold/10"
        aria-hidden
      />

      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow tone="dark">Turnamen Nasional eFootball Mobile · Season 1</Eyebrow>
      </div>

      {/* ── THE VIDEO — hero centerpiece: plakat juara di panggung spotlight ── */}
      <div className="relative mx-auto mt-14 w-full max-w-3xl">
        {/* Ambient gold glow di belakang panggung */}
        <div
          aria-hidden
          className="absolute -inset-10 -z-10 rounded-[3rem] bg-gradient-to-b from-brand-gold/25 via-brand-gold/10 to-transparent blur-[100px] animate-pulse [animation-duration:4s]"
        />
        {/* Spotlight cone dari atas */}
        <div
          aria-hidden
          className="absolute left-1/2 top-[-20%] -z-10 h-[150%] w-[65%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,_rgba(244,215,124,0.35),_transparent_65%)]"
        />

        {/* Bingkai foil emas — "display case" (ini yang menentukan tinggi container) */}
        <div className="relative rounded-[2rem] bg-gradient-to-br from-brand-gold via-[#f4d77c] to-brand-gold p-[2px] shadow-brand-glow">
          <div className="rounded-[1.9rem] bg-gradient-to-br from-[#3a0d16] via-brand-primary to-[#3a0d16] p-[1px]">
            <div className="overflow-hidden rounded-[1.85rem] bg-[#f7f3ea]">
              <video autoPlay loop muted playsInline className="aspect-video w-full object-contain">
                <source src="/videos/logo-animasi.mp4" type="video/mp4" />
                Browser Anda tidak mendukung tag video.
              </video>
            </div>
          </div>
        </div>

        {/* Bracket sudut ala pigura museum — nempel ke sudut panel, bukan ke container */}
        {[
          'left-0 top-0 -translate-x-2 -translate-y-2 border-l-2 border-t-2',
          'right-0 top-0 translate-x-2 -translate-y-2 border-r-2 border-t-2',
          'left-0 bottom-0 -translate-x-2 translate-y-2 border-l-2 border-b-2',
          'right-0 bottom-0 translate-x-2 translate-y-2 border-r-2 border-b-2',
        ].map((pos, idx) => (
          <span
            key={idx}
            aria-hidden
            className={`absolute hidden h-6 w-6 border-brand-gold/60 sm:block ${pos}`}
          />
        ))}

        {/* Aksen sparkle */}
        <Sparkles aria-hidden className="absolute -top-3 left-8 h-4 w-4 text-brand-gold/70 animate-pulse [animation-duration:3s]" />
        <Sparkles aria-hidden className="absolute -bottom-2 right-10 h-3 w-3 text-brand-gold/50 animate-pulse [animation-duration:2.5s]" />

        {/* Refleksi lantai — sekarang absolute, TIDAK menambah tinggi container */}
        <div
          aria-hidden
          className="absolute -bottom-5 left-1/2 -z-10 h-8 w-[65%] -translate-x-1/2 rounded-full bg-brand-gold/10 blur-2xl"
        />

        {/* Floating stat badges — sekarang nempel presisi ke sudut panel */}
        {FLOATING_STATS.map((s, i) => (
          <div
            key={s.label}
            className="absolute hidden rounded-2xl border border-brand-gold/30 bg-[#0f0710]/90 px-5 py-3.5 shadow-brand backdrop-blur-sm sm:block"
            style={{
              transform: `rotate(${s.rotate})`,
              top: i === 0 ? '-8%' : undefined,
              bottom: i === 1 ? '-10%' : undefined,
              left: i === 0 ? '-4%' : undefined,
              right: i === 1 ? '-4%' : undefined,
            }}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gold/15">
                <s.icon className="h-4 w-4 text-brand-gold" />
              </span>
              <div className="text-left">
                <p className="font-jetbrains text-sm font-black text-white">{s.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-wide text-white/45">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile fallback untuk badge di atas (hidden di sm+) */}
      <div className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-2.5 sm:hidden">
        {FLOATING_STATS.map((s) => (
          <span
            key={s.label}
            className="inline-flex items-center gap-1.5 rounded-full border border-brand-gold/25 bg-white/5 px-3.5 py-1.5 text-xs font-extrabold text-white/80"
          >
            <s.icon className="h-3.5 w-3.5 text-brand-gold" /> {s.value} · {s.label}
          </span>
        ))}
      </div>

      <div className="mx-auto mt-12 max-w-2xl text-center">
        {/* Ornamen crest kecil — menjembatani plakat video ke headline */}
        <div className="mx-auto mb-5 flex items-center justify-center gap-3">
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-brand-gold/70" />
          <span className="h-2 w-2 rotate-45 bg-gradient-brand" />
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-brand-gold/70" />
        </div>

        <h1 className="text-[2.5rem] font-black italic leading-[0.98] tracking-tighter text-white sm:text-6xl">
          THE PITCH
          <span className="mt-1 block bg-gradient-brand bg-clip-text text-transparent drop-shadow-[0_2px_16px_rgba(212,168,63,0.35)]">
            IS YOURS.
          </span>
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-base font-semibold leading-relaxed text-white/65 sm:text-lg">
          BELOVESPORT hadirkan turnamen eFootball Mobile resmi by BELOVECORP
          INDONESIA. Format Grup lalu Knockout, klasemen otomatis, dan
          keamanan anti-kecurangan kelas nasional — hanya{' '}
          <span className="font-black text-brand-gold">Rp 25.000</span> per tim untuk
          memperebutkan tahta.
        </p>

        {/* Bar info "tiket resmi" — pengganti 3 pill lepas, kesannya lebih satu-kesatuan & premium */}
        <div className="mx-auto mt-7 flex max-w-lg divide-x divide-brand-gold/15 overflow-hidden rounded-2xl border border-brand-gold/25 bg-[#0f0710]/70 backdrop-blur-sm">
          <div className="flex flex-1 flex-col items-center gap-1 px-3 py-3">
            <Wallet className="h-4 w-4 text-brand-gold" />
            <span className="text-[11px] font-extrabold text-white/80">Rp 25.000</span>
            <span className="text-[9px] font-bold uppercase tracking-wide text-white/40">Per Tim</span>
          </div>
          <div className="flex flex-1 flex-col items-center gap-1 px-3 py-3">
            <Ticket className="h-4 w-4 text-brand-gold" />
            <span className="text-[11px] font-extrabold text-white/80">64 Slot</span>
            <span className="text-[9px] font-bold uppercase tracking-wide text-white/40">Kuota</span>
          </div>
          <div className="flex flex-1 flex-col items-center gap-1 px-3 py-3">
            <Users className="h-4 w-4 text-brand-gold" />
            <span className="text-[11px] font-extrabold text-white/80">Maks. 2</span>
            <span className="text-[9px] font-bold uppercase tracking-wide text-white/40">Slot/Orang</span>
          </div>
        </div>

        <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <SkewButton onClick={onSignup} variant="primary" className="animate-pulse-glow text-white">
            <Zap className="h-5 w-5" />
            <span className="text-base font-extrabold uppercase tracking-wider">Daftar Sekarang — Rp 25K</span>
          </SkewButton>
          <SkewButton href="/tournament/bracket" variant="outline-dark" className="text-white">
            <span className="text-sm font-bold uppercase tracking-wider">Lihat Bagan Turnamen</span>
            <ChevronRight className="h-4 w-4" />
          </SkewButton>
        </div>

        {/* Garis pemisah tipis — seperti segel sertifikasi sebelum trust row */}
        <div className="mx-auto mt-8 h-px w-32 bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-bold text-white/45">
          <span className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            OTP + JWT Verified
          </span>
          <span className="flex items-center gap-2">
            <Gift className="h-4 w-4 text-brand-gold" />
            E-Voucher Otomatis
          </span>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────
// C — Live Status Bar (FOMO)
// ─────────────────────────────────────────────────────────

function LiveStatusBar() {
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
              <span className="font-jetbrains text-sm font-extrabold uppercase tracking-widest text-emerald-400">
                Pendaftaran Dibuka
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs font-bold uppercase tracking-wide text-brand-muted sm:text-sm">
              <span className="flex items-center gap-2">
                <Swords className="h-4 w-4 text-brand-gold" />
                Format: Grup → Knockout
              </span>
              <span className="hidden text-brand-border sm:inline">|</span>
              <span className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-brand-gold" />
                Rp 25.000 / Tim · Maks 2 Slot
              </span>
              <span className="hidden text-brand-border sm:inline">|</span>
              <span className="flex items-center gap-2 text-brand-gold">
                <Radio className="h-4 w-4" />
                18 / 64 Slot Terisi
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────
// D0 — Registration Tutorial (NEW)
// ─────────────────────────────────────────────────────────

function RegistrationTutorialSection({ onSignup }: { onSignup: () => void }) {
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
            Dari klik pertama sampai akun Command Center aktif — semuanya bisa
            selesai dalam hitungan menit.
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
                  <s.icon className="h-4 w-4" />
                </div>
              </div>
              <h3 className="mt-5 text-base font-black text-brand-bg-dark">{s.title}</h3>
              <p className="mt-2 text-sm font-medium leading-relaxed text-brand-bg-dark/60">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <SkewButton onClick={onSignup} variant="primary" className="text-white">
            <Zap className="h-4 w-4" />
            <span className="text-sm font-extrabold uppercase tracking-wider">Mulai Daftar Sekarang</span>
          </SkewButton>
          <a
            href="/panduan#daftar"
            className="inline-flex items-center gap-1.5 text-sm font-extrabold text-brand-primary hover:underline"
          >
            Lihat panduan lengkap bergambar <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────
// D1 — Format Kompetisi
// ─────────────────────────────────────────────────────────

function FormatSection() {
  return (
    <section id="format" className="relative overflow-hidden bg-zinc-50 px-5 py-24 sm:px-8">
      <SectionSeam />
      <div
        className="pointer-events-none absolute -right-24 top-10 -z-10 h-[420px] w-[420px] -skew-x-12 border-l-[3px] border-brand-primary/10"
        aria-hidden
      />
      <PitchWatermark className="-left-28 bottom-0 text-brand-primary" />

      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Format Kompetisi</Eyebrow>
          <h2 className="mt-5 text-3xl font-black italic tracking-tight text-brand-bg-dark sm:text-4xl">
            Grup, Lalu Sistem Gugur
          </h2>
          <p className="mt-3 font-semibold text-brand-bg-dark/55">
            Simpel dan transparan — diwasiti otomatis oleh sistem, tanpa rekap
            manual yang rawan salah.
          </p>
        </div>

        {/* Quick rules strip */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {REG_RULES.map((r) => (
            <div
              key={r.label}
              className="-skew-x-3 border border-brand-secondary/10 bg-white p-5 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-brand-gold/40 hover:shadow-brand"
            >
              <div className="skew-x-3">
                <r.icon className="mx-auto h-6 w-6 text-brand-primary" />
                <p className="mt-3 font-jetbrains text-lg font-black text-brand-bg-dark sm:text-xl">{r.value}</p>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-brand-bg-dark/45">{r.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Two format stages */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {COMPETITION_FORMAT.map((f) => (
            <div
              key={f.title}
              className="group relative -skew-x-3 border border-brand-secondary/10 bg-white p-8 shadow-brand transition-all hover:-translate-y-1.5 hover:border-brand-gold/40 hover:shadow-brand-lg"
            >
              <div className="skew-x-3">
                <div className="flex h-12 w-12 items-center justify-center -skew-x-6 bg-gradient-brand text-brand-bg-light shadow-brand">
                  <f.icon className="skew-x-6 h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-black text-brand-bg-dark">{f.title}</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-brand-bg-dark/60">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing / CTA card */}
        <div className="relative mt-16 -skew-y-1 overflow-hidden bg-gradient-brand px-8 py-10 shadow-brand-glow sm:px-14">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'repeating-linear-gradient(-45deg, rgba(0,0,0,0.12) 0 2px, transparent 2px 16px)',
            }}
          />
          <div className="skew-y-1 flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <span className="font-jetbrains text-xs font-bold uppercase tracking-[0.2em] text-brand-dark/60">
                Biaya Pendaftaran
              </span>
              <p className="mt-1 font-jetbrains text-4xl font-black tracking-tight text-brand-dark sm:text-5xl">
                Rp 25.000
                <span className="ml-2 text-base font-bold text-brand-dark/60">/ tim</span>
              </p>
              <p className="mt-2 text-sm font-bold text-brand-dark/70">
                Maks. 2 slot per orang · Kuota terbatas 64 tim
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────
// D2 — USP / Fitur Sirkuit
// ─────────────────────────────────────────────────────────

function FeaturesSection() {
  return (
    <section id="features" className="relative overflow-hidden bg-white px-5 py-24 sm:px-8">
      <SectionSeam />
      <DotGrid className="inset-0" tint="rgba(86,27,29,0.06)" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-brand-gold/[0.06] to-transparent" aria-hidden />

      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Kenapa Sirkuit Ini</Eyebrow>
          <h2 className="mt-5 text-3xl font-black italic tracking-tight text-brand-bg-dark sm:text-4xl">
            Bukan Sekadar Turnamen Biasa
          </h2>
          <p className="mt-3 font-semibold text-brand-bg-dark/55">
            Infrastruktur kompetisi level profesional, dirancang agar setiap
            tim bisa fokus pada satu hal: bermain.
          </p>
        </div>

        <div className="mt-14 grid gap-7 sm:grid-cols-3">
          {USP_FEATURES.map((f) => (
            <div
              key={f.title}
              className="group relative -skew-x-3 border border-brand-secondary/10 bg-zinc-50/80 p-8 backdrop-blur-sm transition-all hover:-translate-y-1.5 hover:border-brand-gold/40 hover:shadow-brand-lg"
            >
              <div className="skew-x-3">
                <span className="font-jetbrains text-xs font-bold uppercase tracking-widest text-brand-bronze">
                  {f.tag}
                </span>
                <div className="mt-4 flex h-12 w-12 items-center justify-center -skew-x-6 bg-gradient-brand text-brand-bg-light shadow-brand">
                  <f.icon className="skew-x-6 h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-black text-brand-bg-dark">{f.title}</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-brand-bg-dark/60">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 font-jetbrains text-xs font-bold uppercase tracking-widest text-brand-bronze">
              <KeyRound className="h-3.5 w-3.5" />
              Live Preview — Standings Engine
            </span>
            <h3 className="mt-3 text-2xl font-black italic tracking-tight text-brand-bg-dark sm:text-3xl">
              Klasemen Real-Time, Standar FIFA
            </h3>
            <p className="mt-3 font-medium text-brand-bg-dark/60">
              Setiap laporan skor langsung terhitung otomatis ke Poin, Goal
              Difference (GD), dan Goal Made (GM) — tidak ada lagi rekap
              manual yang rawan salah.
            </p>
            <a href="#standings" className="mt-5 inline-flex items-center gap-1.5 text-sm font-extrabold text-brand-primary hover:underline">
              Lihat klasemen penuh <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div id="standings" className="overflow-hidden rounded-2xl border border-brand-border bg-white shadow-brand">
            <div className="flex items-center justify-between bg-brand-bg-surface px-5 py-3">
              <span className="font-jetbrains text-xs font-bold uppercase tracking-widest text-brand-dark">
                Grup A — Klasemen
              </span>
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> LIVE
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-brand-secondary/10 text-brand-bg-dark/45">
                    <th className="px-4 py-2.5 font-bold">Tim</th>
                    <th className="px-2 py-2.5 text-center font-bold">P</th>
                    <th className="px-2 py-2.5 text-center font-bold">M</th>
                    <th className="px-2 py-2.5 text-center font-bold">S</th>
                    <th className="px-2 py-2.5 text-center font-bold">K</th>
                    <th className="px-2 py-2.5 text-center font-bold">GD</th>
                    <th className="px-4 py-2.5 text-center font-bold">PTS</th>
                  </tr>
                </thead>
                <tbody>
                  {STANDINGS_PREVIEW.map((row, i) => (
                    <tr key={row.team} className={i % 2 === 0 ? 'bg-brand-gold/[0.03]' : ''}>
                      <td className="whitespace-nowrap px-4 py-2.5 font-bold text-brand-bg-dark">
                        <span className="mr-1.5 text-brand-bg-dark/30">{i + 1}.</span>
                        {row.team}
                      </td>
                      <td className="px-2 py-2.5 text-center text-brand-bg-dark/60">{row.p}</td>
                      <td className="px-2 py-2.5 text-center text-brand-bg-dark/60">{row.w}</td>
                      <td className="px-2 py-2.5 text-center text-brand-bg-dark/60">{row.d}</td>
                      <td className="px-2 py-2.5 text-center text-brand-bg-dark/60">{row.l}</td>
                      <td className="px-2 py-2.5 text-center font-jetbrains text-brand-bg-dark/60">{row.gd}</td>
                      <td className="px-4 py-2.5 text-center font-jetbrains font-black text-brand-primary">{row.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────
// Schedule / Fixtures
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

        <div className="mt-12 space-y-3">
          {SCHEDULE.map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-3 -skew-x-2 border border-brand-secondary/10 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex skew-x-2 items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center -skew-x-6 bg-brand-primary/10 text-brand-primary">
                  <Calendar className="skew-x-6 h-5 w-5" />
                </div>
                <div>
                  <p className="font-jetbrains text-xs font-bold uppercase tracking-wide text-brand-bronze">
                    {item.date}
                  </p>
                  <p className="font-bold text-brand-bg-dark">{item.title}</p>
                </div>
              </div>
              <span className="skew-x-2 self-start -skew-x-6 bg-brand-gold/15 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-brand-bronze sm:self-center">
                <span className="skew-x-6 block">{item.tag}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────
// E — Reward & BELOVECORP Branding Section
// ─────────────────────────────────────────────────────────

function RewardSection() {
  return (
    <section id="reward" className="relative overflow-hidden bg-brand-bg-light px-5 py-24 sm:px-8">
      <SectionSeam />
      <StitchTexture className="inset-y-0 right-0 w-48 opacity-40" />
      <div className="pointer-events-none absolute -left-16 bottom-0 -z-10 h-72 w-72 rounded-full bg-brand-gold/10 blur-3xl" aria-hidden />

      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 -skew-x-6 border border-brand-gold/40 bg-brand-gold/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-brand-gold">
            <Gift className="skew-x-6 h-3.5 w-3.5" />
            <span className="skew-x-6 block">Value Added</span>
          </span>
          <h2 className="mt-5 text-3xl font-black italic tracking-tight text-brand-dark sm:text-4xl">
            Tiap Tim yang Lolos Verifikasi
            <span className="block text-brand-gold">Langsung Dapat E-Voucher.</span>
          </h2>
          <p className="mt-4 font-medium text-brand-muted">
            E-Voucher eksklusif dari BELOVECORP INDONESIA dikirim otomatis
            setelah admin memverifikasi tim — bisa langsung ditukar di gerai
            konveksi &amp; percetakan kami.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 rounded-xl border border-brand-border bg-brand-bg-surface px-5 py-3">
              <Image src="/logos/logo_BELOVESPORT.png" alt="BELOVESPORT" width={36} height={36} className="h-9 w-9 object-contain" />
              <span className="text-sm font-bold text-brand-dark">BELOVESPORT</span>
            </div>
            <span className="text-xl font-black text-brand-border">×</span>
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
            BELOVECORP INDONESIA adalah usaha konveksi &amp; percetakan yang
            juga menaungi jersey resmi dan merchandise turnamen ini.
          </p>
          <a
            href="https://www.belovecorp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-extrabold text-brand-primary hover:underline"
          >
            Kunjungi BELOVECORP.com <ExternalLink className="h-3.5 w-3.5" />
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
                <Gift className="h-6 w-6 text-brand-gold" />
              </div>
              <p className="mt-6 font-jetbrains text-4xl font-black tracking-tight text-brand-dark">Rp 50.000</p>
              <p className="text-xs font-bold uppercase tracking-widest text-brand-muted">
                Belanja Merchandise BELOVECORP
              </p>
              <div className="mt-6 flex items-center justify-between border-t border-dashed border-brand-border pt-4">
                <span className="font-jetbrains text-[10px] text-brand-muted">CODE: BLV-EFM-2026</span>
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Auto-Issued
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
// F — Pusat Bantuan teaser band (NEW)
// ─────────────────────────────────────────────────────────

function HelpCenterBand() {
  return (
    <section className="relative overflow-hidden bg-gradient-dark px-5 py-20 sm:px-8">
      <SectionSeam tone="dark" />
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(252,179,53,0.12) 0%, transparent 70%)',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-20 bottom-0 -z-10 h-[360px] w-[360px] -skew-x-12 border-l-[3px] border-brand-gold/10"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 top-0 -z-10 h-[320px] w-[320px] -skew-x-12 border-r-[3px] border-brand-gold/10"
        aria-hidden
      />

      <div className="mx-auto max-w-5xl text-center">
        <Eyebrow tone="dark">Pusat Bantuan</Eyebrow>
        <h2 className="mt-5 text-3xl font-black italic tracking-tight text-white sm:text-4xl">
          Bingung Harus Mulai dari Mana?
        </h2>
        <p className="mx-auto mt-3 max-w-xl font-semibold text-white/60">
          Semua panduan bergambar — dari cara daftar sampai cara pakai
          Command Center — sudah kami kumpulkan di satu tempat.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <a
            href="/panduan#daftar"
            className="group relative -skew-x-3 overflow-hidden border border-white/10 bg-white/5 p-7 text-left transition-all hover:-translate-y-1.5 hover:border-brand-gold/40"
          >
            <div className="skew-x-3">
              <div className="flex h-11 w-11 items-center justify-center -skew-x-6 bg-gradient-brand shadow-brand">
                <UserPlus className="skew-x-6 h-5 w-5 text-white" />
              </div>
              <h3 className="mt-4 text-lg font-black text-white">Cara Mendaftar</h3>
              <p className="mt-2 text-sm font-medium leading-relaxed text-white/55">
                Panduan langkah-demi-langkah, mulai dari isi form sampai tim
                kamu resmi terverifikasi.
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-extrabold text-brand-gold">
                Baca panduan <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </a>

          <a
            href="/panduan#sistem"
            className="group relative -skew-x-3 overflow-hidden border border-white/10 bg-white/5 p-7 text-left transition-all hover:-translate-y-1.5 hover:border-brand-gold/40"
          >
            <div className="skew-x-3">
              <div className="flex h-11 w-11 items-center justify-center -skew-x-6 bg-gradient-brand shadow-brand">
                <LayoutDashboard className="skew-x-6 h-5 w-5 text-white" />
              </div>
              <h3 className="mt-4 text-lg font-black text-white">Cara Pakai Sistem</h3>
              <p className="mt-2 text-sm font-medium leading-relaxed text-white/55">
                Tutorial memakai Command Center: lapor skor, pantau bagan, dan
                baca klasemen tim.
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-extrabold text-brand-gold">
                Baca panduan <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────────────────

function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

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

        <div className="mt-10 space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = openIdx === i
            return (
              <div key={f.q} className="overflow-hidden rounded-2xl border border-brand-secondary/10 bg-white shadow-sm">
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-bold text-brand-bg-dark">{f.q}</span>
                  <ChevronDown className={`h-5 w-5 shrink-0 text-brand-primary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-sm font-medium leading-relaxed text-brand-bg-dark/60">{f.a}</div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────
// Final CTA
// ─────────────────────────────────────────────────────────

function FinalCTASection({ onSignup }: { onSignup: () => void }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-zinc-50 via-zinc-50 to-white px-5 py-20 sm:px-8">
      <SectionSeam />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-gold/15 blur-[110px]"
      />
      {[
        { pos: 'left-[12%] top-[8%]', size: 'h-2 w-2', delay: '0s' },
        { pos: 'right-[15%] top-[18%]', size: 'h-1.5 w-1.5', delay: '0.4s' },
        { pos: 'left-[20%] bottom-[14%]', size: 'h-1.5 w-1.5', delay: '0.8s' },
        { pos: 'right-[10%] bottom-[10%]', size: 'h-2 w-2', delay: '1.2s' },
      ].map((p, idx) => (
        <span
          key={idx}
          aria-hidden
          className={`absolute hidden rotate-45 rounded-[2px] bg-brand-gold/50 sm:block ${p.pos} ${p.size} animate-pulse`}
          style={{ animationDelay: p.delay, animationDuration: '2.6s' }}
        />
      ))}

      <div className="relative mx-auto max-w-5xl -skew-y-1 overflow-hidden bg-gradient-brand px-8 py-16 text-center shadow-brand-glow sm:px-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: 'repeating-linear-gradient(-45deg, rgba(0,0,0,0.12) 0 2px, transparent 2px 16px)',
          }}
        />
        <div className="skew-y-1">
          <Trophy className="mx-auto h-12 w-12 text-brand-primary" />
          <h2 className="mt-5 text-3xl font-black italic tracking-tight text-brand-dark sm:text-5xl">
            Siap Merebut Gelar Juara?
          </h2>
          <p className="mx-auto mt-3 max-w-lg font-medium text-brand-muted">
            64 slot tim. Sekali bracket ditutup, gerbang itu tertutup sampai
            season berikutnya.
          </p>
          <div className="mt-8 flex justify-center">
            <SkewButton onClick={onSignup} variant="ghost-light" className="text-brand-primary">
              <Zap className="h-4 w-4" />
              <span className="text-sm font-extrabold uppercase tracking-wider">Amankan Slot Sekarang</span>
            </SkewButton>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────

export default function Home() {
  const router = useRouter()
  const handleNavigateSignup = () => router.push('/signup')

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-brand-bg-light text-brand-dark selection:bg-brand-gold/30">
      <style jsx global>{`
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
      <PremiumNavbar onSignup={handleNavigateSignup} />
      <HeroSection onSignup={handleNavigateSignup} />
      <LiveStatusBar />
      <RegistrationTutorialSection onSignup={handleNavigateSignup} />
      <FormatSection />
      <FeaturesSection />
      <ScheduleSection />
      <RewardSection />
      <HelpCenterBand />
      <FAQSection />
      <FinalCTASection onSignup={handleNavigateSignup} />
      <Footer />
    </main>
  )
}