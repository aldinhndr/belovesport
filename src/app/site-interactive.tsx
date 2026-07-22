'use client'

/**
 * site-interactive.tsx
 * -----------------------------------------------------------------------
 * Satu-satunya tempat 'use client' dibutuhkan di seluruh halaman.
 * Semua bagian lain (hero, format, features, schedule, reward, dst) adalah
 * Server Component murni — lebih cepat di-load, lebih baik untuk SEO,
 * dan tidak mengirim JS yang tidak perlu ke perangkat mobile low-end
 * (target utama turnamen eFootball Mobile).
 *
 * Isi file ini:
 *  - useNavigateSignup(): helper navigasi ke /signup
 *  - MobileMenuButton: tombol buka/tutup menu navbar di layar kecil
 *  - SignupButton: tombol CTA yang butuh onClick + router
 *  - FaqAccordion: accordion FAQ dengan aria-expanded yang benar
 *  - AuthInterceptor: penangkap token tersembunyi untuk handle Google Auth
 * -----------------------------------------------------------------------
 */

import { useState, useId, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, Zap, Menu, X } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

// ─────────────────────────────────────────────────────────
// Tombol CTA yang perlu client-side navigation
// ─────────────────────────────────────────────────────────

type SkewButtonVariant = 'primary' | 'outline-dark' | 'ghost-light'

const VARIANT_CLASSES: Record<SkewButtonVariant, string> = {
    primary:
        'bg-gradient-brand text-white shadow-brand hover:shadow-brand-lg hover:-translate-y-0.5',
    'outline-dark':
        'border border-white/25 bg-white/5 text-white backdrop-blur-sm hover:border-white/50 hover:bg-white/10',
    'ghost-light':
        'bg-white text-brand-primary shadow-md hover:-translate-y-0.5 hover:shadow-lg',
}

export function SignupButton({
    variant = 'primary',
    className = '',
    children,
    animatePulse = false,
}: {
    variant?: SkewButtonVariant
    className?: string
    children: React.ReactNode
    animatePulse?: boolean
}) {
    const router = useRouter()
    return (
        <button
            type="button"
            onClick={() => router.push('/signup')}
            className={`group inline-flex -skew-x-6 items-center gap-2 rounded-lg px-7 py-3.5 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold ${VARIANT_CLASSES[variant]} ${animatePulse ? 'animate-pulse-glow' : ''} ${className}`}
        >
            <span className="flex skew-x-6 items-center gap-2">{children}</span>
        </button>
    )
}

export function LinkButton({
    href,
    variant = 'outline-dark',
    className = '',
    children,
}: {
    href: string
    variant?: SkewButtonVariant
    className?: string
    children: React.ReactNode
}) {
    return (
        <a
            href={href}
            className={`group inline-flex -skew-x-6 items-center gap-2 rounded-lg px-7 py-3.5 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold ${VARIANT_CLASSES[variant]} ${className}`}
        >
            <span className="flex skew-x-6 items-center gap-2">{children}</span>
        </a>
    )
}

// ─────────────────────────────────────────────────────────
// Navbar mobile menu toggle
// ─────────────────────────────────────────────────────────

const NAV_LINKS = [
    { href: '#daftar', label: 'Cara Daftar' },
    { href: '#format', label: 'Format' },
    { href: '#schedule', label: 'Jadwal' },
    { href: '#faq', label: 'FAQ' },
]

export function MobileNav() {
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const menuId = useId()

    return (
        <div className="sm:hidden">
            <button
                type="button"
                aria-expanded={open}
                aria-controls={menuId}
                aria-label={open ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
                onClick={() => setOpen((v) => !v)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-white"
            >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {open && (
                <div
                    id={menuId}
                    className="absolute inset-x-0 top-full z-40 border-t border-white/10 bg-[#150a0d]/98 px-5 py-6 backdrop-blur-md"
                >
                    <nav className="flex flex-col gap-1">
                        {NAV_LINKS.map((l) => (
                            <a
                                key={l.href}
                                href={l.href}
                                onClick={() => setOpen(false)}
                                className="rounded-lg px-3 py-3 text-sm font-bold text-white/80 hover:bg-white/5 hover:text-white"
                            >
                                {l.label}
                            </a>
                        ))}
                    </nav>
                    <button
                        type="button"
                        onClick={() => {
                            setOpen(false)
                            router.push('/signup')
                        }}
                        className="mt-4 flex w-full -skew-x-6 items-center justify-center gap-2 rounded-lg bg-gradient-brand px-6 py-3 text-white shadow-brand"
                    >
                        <span className="flex skew-x-6 items-center gap-2">
                            <Zap className="h-4 w-4" />
                            <span className="text-sm font-extrabold uppercase tracking-wider">Daftar Sekarang</span>
                        </span>
                    </button>
                </div>
            )}
        </div>
    )
}

// ─────────────────────────────────────────────────────────
// FAQ Accordion — accessible (aria-expanded + aria-controls)
// ─────────────────────────────────────────────────────────

export function FaqAccordion({ faqs }: { faqs: { q: string; a: string }[] }) {
    const [openIdx, setOpenIdx] = useState<number | null>(0)
    const baseId = useId()

    return (
        <div className="mt-10 space-y-3">
            {faqs.map((f, i) => {
                const isOpen = openIdx === i
                const panelId = `${baseId}-panel-${i}`
                const buttonId = `${baseId}-button-${i}`
                return (
                    <div key={f.q} className="overflow-hidden rounded-2xl border border-brand-secondary/10 bg-white shadow-sm">
                        <h3>
                            <button
                                id={buttonId}
                                aria-expanded={isOpen}
                                aria-controls={panelId}
                                onClick={() => setOpenIdx(isOpen ? null : i)}
                                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-primary"
                            >
                                <span className="font-bold text-brand-bg-dark">{f.q}</span>
                                <ChevronDown
                                    aria-hidden
                                    className={`h-5 w-5 shrink-0 text-brand-primary transition-transform ${isOpen ? 'rotate-180' : ''}`}
                                />
                            </button>
                        </h3>
                        <div
                            id={panelId}
                            role="region"
                            aria-labelledby={buttonId}
                            hidden={!isOpen}
                            className="px-6 pb-5 text-sm font-medium leading-relaxed text-brand-bg-dark/60"
                        >
                            {f.a}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}