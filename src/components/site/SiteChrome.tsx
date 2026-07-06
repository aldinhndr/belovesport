'use client'

/**
 * BELOVEsPORT — Shared site chrome
 * Eyebrow, SkewButton, PremiumNavbar and Footer live here so every page
 * (landing page, Pusat Bantuan, dan halaman lain nanti) memakai desain
 * yang persis sama tanpa duplikasi kode.
 */

import Image from 'next/image'
import { useEffect, useState } from 'react'
import {
    Menu,
    X,
    Zap,
    FileText,
    ScrollText,
    MessageCircle,
    Instagram,
    MapPin,
    ExternalLink,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────
// Nav config
// ─────────────────────────────────────────────────────────

export const NAV_LINKS = [
    { label: 'Format', href: '/#format' },
    { label: 'Cara Daftar', href: '/#daftar' },
    { label: 'Standings', href: '/#standings' },
    { label: 'Fixtures', href: '/#schedule' },
    { label: 'Panduan', href: '/panduan' },
    { label: 'FAQ', href: '/#faq' },
]

// ─────────────────────────────────────────────────────────
// Eyebrow
// ─────────────────────────────────────────────────────────

export function Eyebrow({
    children,
    tone = 'light',
}: {
    children: React.ReactNode
    tone?: 'light' | 'dark'
}) {
    const styles =
        tone === 'dark'
            ? 'border-brand-gold/40 bg-brand-gold/10 text-brand-gold'
            : 'border-brand-primary/25 bg-brand-primary/[0.06] text-brand-primary'

    return (
        <span
            className={`inline-flex items-center gap-2 -skew-x-6 border px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] ${styles}`}
        >
            <span className="inline-block skew-x-6">{children}</span>
        </span>
    )
}

// ─────────────────────────────────────────────────────────
// SkewButton
// ─────────────────────────────────────────────────────────

/** Skewed button wrapper — outer carries the skew, inner counter-skews content upright. */
export function SkewButton({
    children,
    onClick,
    href,
    target,
    variant = 'primary',
    className = '',
}: {
    children: React.ReactNode
    onClick?: () => void
    href?: string
    target?: string
    variant?: 'primary' | 'secondary' | 'ghost-light' | 'outline-dark'
    className?: string
}) {
    const base =
        'group relative inline-flex -skew-x-6 items-center overflow-hidden transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]'
    const styles: Record<string, string> = {
        primary: 'bg-gradient-brand shadow-brand-lg ring-1 ring-white/20',
        secondary: 'border-2 border-brand-primary/20 bg-white hover:border-brand-gold/50',
        'ghost-light': 'border-2 border-white bg-white',
        'outline-dark': 'border-2 border-white/25 bg-white/5 backdrop-blur-sm hover:border-brand-gold/60',
    }
    const Comp = href ? 'a' : 'button'

    return (
        <Comp
            {...(href
                ? { href, target, rel: target === '_blank' ? 'noopener noreferrer' : undefined }
                : { onClick, type: 'button' as const })}
            className={`${base} ${styles[variant]} ${className}`}
        >
            <span className="absolute inset-0 -translate-x-full bg-white/25 transition-transform duration-700 group-hover:translate-x-full" />
            <span className="relative flex skew-x-6 items-center gap-2.5 px-8 py-4">{children}</span>
        </Comp>
    )
}

// ─────────────────────────────────────────────────────────
// Navbar
// ─────────────────────────────────────────────────────────

export function PremiumNavbar({ onSignup }: { onSignup: () => void }) {
    const [scrolled, setScrolled] = useState(false)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12)
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <header
            className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled
                    ? 'bg-white/85 shadow-[0_2px_28px_rgba(86,27,29,0.1)] backdrop-blur-xl'
                    : 'bg-white/30 backdrop-blur-md'
                }`}
        >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8">
                <a href="/" className="flex items-center gap-2.5">
                    <Image
                        src="/logos/logo_BELOVESPORT.png"
                        alt="BELOVEsPORT"
                        width={40}
                        height={40}
                        className="h-10 w-10 object-contain"
                        priority
                    />
                    <div className="flex flex-col leading-none">
                        <span className="font-jetbrains text-[10px] font-bold uppercase tracking-[0.22em] text-brand-bronze">
                            BELOVECORP presents
                        </span>
                        <span className="text-lg font-black italic tracking-tight text-brand-bg-dark">
                            BELOVE<span className="text-brand-secondary">s</span>PORT
                        </span>
                    </div>
                </a>

                <nav className="hidden items-center gap-8 lg:flex">
                    {NAV_LINKS.map((l) => (
                        <a
                            key={l.href}
                            href={l.href}
                            className="text-sm font-bold text-brand-bg-dark/70 transition-colors hover:text-brand-primary"
                        >
                            {l.label}
                        </a>
                    ))}
                </nav>

                <div className="hidden lg:flex">
                    <SkewButton onClick={onSignup} variant="primary">
                        <Zap className="h-4 w-4" />
                        <span className="text-sm font-extrabold uppercase tracking-wide">Daftar Tim</span>
                    </SkewButton>
                </div>

                <button
                    aria-label="Buka menu"
                    onClick={() => setOpen((v) => !v)}
                    className="rounded-lg p-2 text-brand-bg-dark lg:hidden"
                >
                    {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {open && (
                <div className="border-t border-brand-secondary/10 bg-white px-5 py-4 lg:hidden">
                    <div className="flex flex-col gap-3">
                        {NAV_LINKS.map((l) => (
                            <a
                                key={l.href}
                                href={l.href}
                                onClick={() => setOpen(false)}
                                className="py-1.5 text-sm font-bold text-brand-bg-dark/80"
                            >
                                {l.label}
                            </a>
                        ))}
                        <button
                            onClick={() => {
                                setOpen(false)
                                onSignup()
                            }}
                            className="mt-2 inline-flex -skew-x-6 items-center justify-center gap-2 bg-gradient-brand px-6 py-3 text-sm font-extrabold uppercase tracking-wide text-brand-bg-light shadow-brand"
                        >
                            <span className="flex skew-x-6 items-center gap-2">
                                <Zap className="h-4 w-4" />
                                Daftar Tim
                            </span>
                        </button>
                    </div>
                </div>
            )}
        </header>
    )
}

// ─────────────────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────────────────

export function Footer() {
    return (
        <footer className="border-t border-brand-border bg-brand-bg-surface px-5 py-12 sm:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Image
                            src="/logos/logo_BELOVESPORT.png"
                            alt="BELOVEsPORT"
                            width={40}
                            height={40}
                            className="h-10 w-10 object-contain"
                        />
                        <div>
                            <p className="font-black italic text-brand-dark">BELOVEsPORT</p>
                            <a
                                href="https://www.belovecorp.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-medium text-brand-muted transition-colors hover:text-brand-primary hover:underline"
                            >
                                Divisi Esports BELOVECORP INDONESIA
                            </a>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-x-3 gap-y-3 text-sm font-bold text-brand-muted">
                        <a href="/panduan" className="flex items-center gap-1.5 hover:text-brand-primary">
                            <FileText className="h-3.5 w-3.5" /> Pusat Bantuan
                        </a>
                        <span className="text-brand-border">·</span>
                        <a href="/rulebook" className="flex items-center gap-1.5 hover:text-brand-primary">
                            <ScrollText className="h-3.5 w-3.5" /> Rulebook Resmi
                        </a>
                        <span className="text-brand-border">·</span>
                        <a href="https://wa.me/" className="flex items-center gap-1.5 hover:text-brand-primary">
                            <MessageCircle className="h-3.5 w-3.5" /> Admin WhatsApp
                        </a>
                    </div>

                    <div className="space-y-2 text-sm font-medium text-brand-muted">
                        <p className="flex items-center gap-2">
                            <Instagram className="h-4 w-4 text-brand-primary" /> @belovesport.id
                        </p>
                        <p className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-brand-primary" /> Bandar Lampung, Indonesia
                        </p>
                    </div>
                </div>

                <div className="mt-10 flex flex-col items-center gap-3 border-t border-brand-border pt-6 text-center">
                    <a
                        href="https://www.belovecorp.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand-bronze transition-colors hover:text-brand-primary"
                    >
                        Didukung oleh BELOVECORP INDONESIA — Konveksi &amp; Percetakan
                        <ExternalLink className="h-3 w-3" />
                    </a>
                    <p className="text-xs font-medium text-brand-muted">
                        © 2026 BELOVECORP INDONESIA. Seluruh hak dilindungi.
                    </p>
                </div>
            </div>
        </footer>
    )
}