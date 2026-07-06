'use client'

/**
 * EcosystemGrid
 * =============
 * Modern, asymmetric Bento Grid layout utilizing the GlassCard primitives.
 * Distributes the 4 core business value propositions across desktop and mobile screens.
 */

import { motion } from 'framer-motion'
import { Gift, ShieldCheck, GitBranch, Trophy, ArrowUpRight } from 'lucide-react'
import { GlassCard } from '@/components/shared/GlassCard'
import { ScrollReveal, ScrollRevealItem } from '@/components/shared/ScrollReveal'
import { TOURNAMENT_CONFIG } from '@/lib/constants'

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────

interface BentoItem {
  id: string
  title: string
  description: string
  highlightText: string
  icon: React.ComponentType<{ className?: string }>
  colSpan: string // Grid column span class
  gradientFrom: string
  gradientTo: string
  accentColor: string
}

export function EcosystemGrid(): React.JSX.Element {
  // Configured with content mapping directly to the requested core value propositions
  const BENTO_ITEMS: BentoItem[] = [
    {
      id: 'voucher',
      title: 'Jaminan Voucher Rp 50 Ribu',
      description: `Setiap peserta terdaftar akan menerima voucher ${TOURNAMENT_CONFIG.voucherAmountFormatted} yang dikonfirmasi saat pendaftaran diverifikasi. Gunakan langsung untuk mata uang dalam game atau kredit game mitra.`,
      highlightText: '100% Klaim Dijamin',
      icon: Gift,
      colSpan: 'lg:col-span-2 md:col-span-2',
      gradientFrom: '#FF9A00',
      gradientTo: '#FFC537',
      accentColor: 'text-brand-orange border-brand-orange/20 bg-brand-orange/10',
    },
    {
      id: 'anti-cheat',
      title: 'Anti-Cheat Sangat Ketat',
      description: 'Kebijakan toleransi nol terhadap kecurangan. Pemantauan pertandingan bertenaga AI dan verifikasi ID manual memastikan persaingan yang sepenuhnya adil.',
      highlightText: 'Jaminan Fair Play',
      icon: ShieldCheck,
      colSpan: 'lg:col-span-1 md:col-span-1',
      gradientFrom: '#FF2E8A',
      gradientTo: '#FF9A00',
      accentColor: 'text-brand-pink border-brand-pink/20 bg-brand-pink/10',
    },
    {
      id: 'bracket',
      title: 'Sistem Bracket Langsung',
      description: 'Pelacakan turnamen secara real-time dengan penempatan ELO terbuka dan pertandingan yang transparan. Tidak ada manipulasi, murni kompetisi.',
      highlightText: 'Pembaruan Real-Time',
      icon: GitBranch,
      colSpan: 'lg:col-span-1 md:col-span-1',
      gradientFrom: '#FFC537',
      gradientTo: '#FF2E8A',
      accentColor: 'text-emerald-400 border-emerald-400/20 bg-emerald-400/10',
    },
    {
      id: 'glory',
      title: 'Kejayaan Nasional & Hadiah',
      description: `Berjuanglah menuju puncak dan klaim bagian Anda dari total hadiah ${TOURNAMENT_CONFIG.prizePoolRupiah}. Juara berhak membawa pulang trofi nasional resmi dan peringkat permanen di Hall of Fame.`,
      highlightText: 'Hadiah Rp 500 Juta+',
      icon: Trophy,
      colSpan: 'lg:col-span-2 md:col-span-2',
      gradientFrom: '#FF2E8A',
      gradientTo: '#FFC537',
      accentColor: 'text-brand-gold border-brand-gold/20 bg-brand-gold/10',
    },
  ]

  return (
    <section id="ecosystem" className="relative z-10 py-16 sm:py-24 lg:py-32">
      {/* Background radial highlight */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none filter blur-3xl opacity-[0.03] select-none"
        style={{
          background: 'radial-gradient(circle, #FF2E8A 0%, #FF9A00 50%, transparent 100%)',
        }}
      />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <p className="text-xs font-black tracking-[0.25em] uppercase text-brand-pink font-jetbrains mb-3">
            Kenapa Bertanding Bersama Kami
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-6">
            Ekosistem & Platform <br />
            <span className="bg-gradient-to-r from-brand-pink via-brand-orange to-brand-gold bg-clip-text text-transparent">
              Turnamen yang Tiada Tanding
            </span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed font-sans">
            Kami mendefinisikan ulang turnamen eFootball mobile. Mulai dari pembagian voucher otomatis hingga perlindungan anti-cheat yang ketat, setiap detail dirancang khusus untuk pemain kompetitif.
          </p>
        </div>

        {/* Bento Grid */}
        <ScrollReveal direction="up" stagger staggerDelay={0.12}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENTO_ITEMS.map((item) => {
              const Icon = item.icon

              return (
                <ScrollRevealItem key={item.id} className={item.colSpan}>
                  <GlassCard
                    className="h-full group"
                    panelClassName="p-8 h-full flex flex-col justify-between min-h-[300px] hover:bg-white/[0.03] transition-all duration-500 relative"
                  >
                    {/* Top corner gradient glow line */}
                    <div
                      className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r transition-all duration-500 origin-left scale-x-0 group-hover:scale-x-100"
                      style={{
                        backgroundImage: `linear-gradient(90deg, ${item.gradientFrom}, ${item.gradientTo})`,
                      }}
                    />

                    {/* Top Content Row */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        {/* Custom Animated Icon container */}
                        <div className={`p-3 rounded-xl flex items-center justify-center shrink-0 border ${item.accentColor} transition-transform duration-300 group-hover:scale-110`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        
                        {/* Accent Pill badge */}
                        <span className="text-[10px] font-bold tracking-widest uppercase font-jetbrains text-gray-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
                          {item.highlightText}
                        </span>
                      </div>

                      {/* Header & Body */}
                      <div className="space-y-3">
                        <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-colors duration-300">
                          {item.title}
                        </h3>
                        <p className="text-gray-400 text-sm sm:text-base leading-relaxed font-normal font-sans">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Bottom hover indicator */}
                    <div className="pt-6 flex items-center gap-1.5 text-xs font-bold text-gray-500 group-hover:text-brand-pink transition-colors duration-300 font-jetbrains uppercase tracking-wider mt-auto cursor-pointer" onClick={() => {
                      const el = document.getElementById("faq")
                      if (el) el.scrollIntoView({ behavior: "smooth" })
                    }}>
                      <span>Pelajari Selengkapnya</span>
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </GlassCard>
                </ScrollRevealItem>
              )
            })}
          </div>
        </ScrollReveal>

      </div>
    </section>
  )
}
