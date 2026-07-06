'use client'

/**
 * BELOVESPORT — Pusat Bantuan
 * Satu tempat untuk dua tutorial: cara mendaftar, dan cara memakai
 * Command Center (dasbor tim) setelah terverifikasi.
 */

import { useRouter } from 'next/navigation'
import {
    UserPlus,
    FileText,
    Upload,
    ShieldCheck,
    LayoutDashboard,
    KeyRound,
    Calendar,
    PlayCircle,
    ClipboardList,
    BarChart3,
    MessageCircle,
    Zap,
} from 'lucide-react'
import { Eyebrow, SkewButton, PremiumNavbar, Footer } from '@/components/site/SiteChrome'

// ─────────────────────────────────────────────────────────
// Content
// ─────────────────────────────────────────────────────────

const DAFTAR_STEPS = [
    {
        icon: UserPlus,
        title: 'Buka Form Pendaftaran',
        desc: 'Klik tombol "Daftar Tim" di navbar atau halaman utama. Kamu akan diarahkan ke form pendaftaran resmi BELOVESPORT.',
    },
    {
        icon: FileText,
        title: 'Isi Data Tim & ID Pemain',
        desc: 'Masukkan nama tim/pemain, ID eFootball Mobile yang aktif, dan nomor WhatsApp yang bisa dihubungi admin.',
    },
    {
        icon: Zap,
        title: 'Lakukan Pembayaran Rp 25.000',
        desc: 'Transfer sesuai instruksi rekening / e-wallet yang tertera pada form, lalu simpan screenshot bukti pembayarannya.',
    },
    {
        icon: Upload,
        title: 'Unggah Bukti Transfer',
        desc: 'Upload screenshot bukti bayar langsung di form pendaftaran sebelum menekan tombol submit.',
    },
    {
        icon: ShieldCheck,
        title: 'Tunggu Verifikasi Admin',
        desc: 'Admin mengecek data & pembayaran maksimal 1x24 jam. Status berubah jadi "Terverifikasi", kamu dapat notifikasi WhatsApp, dan akun Command Center langsung aktif.',
    },
]

const SISTEM_STEPS = [
    {
        icon: KeyRound,
        title: 'Login ke Command Center',
        desc: 'Gunakan ID/email yang didaftarkan saat verifikasi untuk masuk ke dasbor privat tim kamu.',
    },
    {
        icon: Calendar,
        title: 'Cek Jadwal Pertandingan',
        desc: 'Lihat jadwal Leg 1 & Leg 2 lawanmu di tab Fixtures pada dashboard — lengkap dengan tanggal dan lawan tanding.',
    },
    {
        icon: PlayCircle,
        title: 'Mainkan & Rekam Pertandingan',
        desc: 'Mainkan sesuai jadwal, lalu rekam layar sebagai bukti resmi sesuai rulebook anti-kecurangan.',
    },
    {
        icon: ClipboardList,
        title: 'Lapor Skor Pertandingan',
        desc: 'Input skor akhir di dashboard, lampirkan bukti (screenshot/rekaman) sebelum batas waktu yang ditentukan.',
    },
    {
        icon: BarChart3,
        title: 'Pantau Klasemen & Bagan',
        desc: 'Klasemen grup dan bagan knockout ter-update otomatis begitu skor pertandingan terverifikasi kedua tim.',
    },
]

// ─────────────────────────────────────────────────────────
// Shared step-list block
// ─────────────────────────────────────────────────────────

function StepList({ steps }: { steps: typeof DAFTAR_STEPS }) {
    return (
        <div className="mt-12 space-y-4">
            {steps.map((s, i) => (
                <div
                    key={s.title}
                    className="flex gap-5 -skew-x-2 border border-brand-border bg-brand-bg-surface p-6 transition-colors hover:border-brand-gold/40"
                >
                    <div className="flex w-full skew-x-2 gap-5">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center -skew-x-6 bg-gradient-brand text-white shadow-brand">
                            <s.icon className="skew-x-6 h-5 w-5" />
                        </div>
                        <div>
                            <span className="font-jetbrains text-xs font-bold uppercase tracking-widest text-brand-bronze">
                                Langkah {i + 1}
                            </span>
                            <h3 className="mt-1 text-lg font-black text-brand-bg-dark">{s.title}</h3>
                            <p className="mt-2 text-sm font-medium leading-relaxed text-brand-bg-dark/60">{s.desc}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

// ─────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────

export default function PanduanPage() {
    const router = useRouter()
    const handleNavigateSignup = () => router.push('/signup')

    return (
        <main className="relative min-h-screen w-full overflow-x-hidden bg-brand-bg-light text-brand-dark selection:bg-brand-gold/30">
            <PremiumNavbar onSignup={handleNavigateSignup} />

            {/* Header */}
            <section className="relative overflow-hidden bg-gradient-dark px-5 pb-16 pt-32 text-center sm:px-8 sm:pt-40">
                <div
                    className="pointer-events-none absolute inset-0 -z-10"
                    style={{
                        background:
                            'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(252,179,53,0.16) 0%, transparent 60%)',
                    }}
                    aria-hidden
                />
                <Eyebrow tone="dark">Pusat Bantuan</Eyebrow>
                <h1 className="mx-auto mt-5 max-w-2xl text-4xl font-black italic tracking-tight text-white sm:text-5xl">
                    Panduan BELOVESPORT
                </h1>
                <p className="mx-auto mt-3 max-w-xl font-semibold text-white/60">
                    Semua yang perlu kamu tahu — dari daftar tim sampai lapor skor
                    pertandingan — ada di sini.
                </p>

                <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <a
                        href="#daftar"
                        className="group inline-flex items-center gap-2 -skew-x-6 border border-white/15 bg-white/5 px-5 py-2.5 backdrop-blur-sm transition-colors hover:border-brand-gold/50"
                    >
                        <span className="flex skew-x-6 items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-white/80 group-hover:text-brand-gold">
                            <UserPlus className="h-3.5 w-3.5" /> Cara Mendaftar
                        </span>
                    </a>
                    <a
                        href="#sistem"
                        className="group inline-flex items-center gap-2 -skew-x-6 border border-white/15 bg-white/5 px-5 py-2.5 backdrop-blur-sm transition-colors hover:border-brand-gold/50"
                    >
                        <span className="flex skew-x-6 items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-white/80 group-hover:text-brand-gold">
                            <LayoutDashboard className="h-3.5 w-3.5" /> Cara Pakai Sistem
                        </span>
                    </a>
                </div>
            </section>

            {/* Bagian 1 — Cara Mendaftar */}
            <section id="daftar" className="bg-white px-5 py-24 sm:px-8">
                <div className="mx-auto max-w-3xl">
                    <Eyebrow>Bagian 1</Eyebrow>
                    <h2 className="mt-5 text-3xl font-black italic tracking-tight text-brand-bg-dark sm:text-4xl">
                        Cara Mendaftar Tim
                    </h2>
                    <p className="mt-3 font-semibold text-brand-bg-dark/55">
                        5 langkah dari klik pertama sampai akun Command Center kamu aktif.
                    </p>

                    <StepList steps={DAFTAR_STEPS} />

                    <div className="mt-10 flex justify-center">
                        <SkewButton onClick={handleNavigateSignup} variant="primary" className="text-white">
                            <Zap className="h-4 w-4" />
                            <span className="text-sm font-extrabold uppercase tracking-wider">Daftar Tim Sekarang</span>
                        </SkewButton>
                    </div>
                </div>
            </section>

            {/* Bagian 2 — Cara Pakai Sistem */}
            <section id="sistem" className="bg-zinc-50 px-5 py-24 sm:px-8">
                <div className="mx-auto max-w-3xl">
                    <Eyebrow>Bagian 2</Eyebrow>
                    <h2 className="mt-5 text-3xl font-black italic tracking-tight text-brand-bg-dark sm:text-4xl">
                        Cara Pakai Command Center
                    </h2>
                    <p className="mt-3 font-semibold text-brand-bg-dark/55">
                        Dasbor privat timmu untuk jadwal, lapor skor, dan klasemen —
                        begini cara pakainya.
                    </p>

                    <StepList steps={SISTEM_STEPS} />
                </div>
            </section>

            {/* Masih butuh bantuan? */}
            <section className="bg-white px-5 py-20 text-center sm:px-8">
                <div className="mx-auto max-w-lg">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-primary/10">
                        <MessageCircle className="h-6 w-6 text-brand-primary" />
                    </div>
                    <h3 className="mt-5 text-2xl font-black italic tracking-tight text-brand-bg-dark">
                        Masih Bingung?
                    </h3>
                    <p className="mt-2 font-medium text-brand-bg-dark/60">
                        Tim admin kami siap bantu langsung lewat WhatsApp — dari kendala
                        pendaftaran sampai teknis pelaporan skor.
                    </p>
                    <div className="mt-6 flex justify-center">
                        <SkewButton href="https://wa.me/" target="_blank" variant="secondary" className="text-brand-bg-dark">
                            <MessageCircle className="h-4 w-4 text-brand-primary" />
                            <span className="text-sm font-bold uppercase tracking-wider">Chat Admin WhatsApp</span>
                        </SkewButton>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}