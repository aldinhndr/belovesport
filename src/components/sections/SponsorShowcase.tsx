'use client'

/**
 * SponsorShowcase
 * ===============
 * Premium B2B sponsor showcase section displaying:
 * - A seamless horizontal infinite marquee loop of partner logos using Framer Motion.
 * - Glassmorphic tier cards mapping the Platinum, Gold, and Silver tiers from constants.
 * - A high-conversion B2B CTA button to contact the sponsorship team.
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Check, Send, Award, Handshake } from 'lucide-react'
import { GlassCard } from '@/components/shared/GlassCard'
import { ScrollReveal, ScrollRevealItem } from '@/components/shared/ScrollReveal'
import { SPONSOR_TIERS, SponsorTier } from '@/lib/constants'
import { SponsorInquiryModal } from '@/components/shared/SponsorInquiryModal'

interface SponsorShowcaseProps {
  onOpenSponsor: () => void;
}

const PARTNER_PLACEHOLDERS = [
  'BELOVECORP',
  'ALPHA GAMING',
  'PULSE ENERGY',
  'ROG GEAR',
  'VERTEX MEDIA',
  'NEXUS TELECOM',
  'APEX SPORTS',
  'INDOSPORT',
]

// Double the items to allow seamless infinite loop
const MARQUEE_ITEMS = [...PARTNER_PLACEHOLDERS, ...PARTNER_PLACEHOLDERS]

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

export function SponsorShowcase({ onOpenSponsor }: SponsorShowcaseProps): React.JSX.Element {
  const [modalOpen, setModalOpen] = useState(false)

  const handleSponsorClick = () => {
    onOpenSponsor()
  }

  return (
    <section id="sponsors" className="relative z-10 py-16 sm:py-24 lg:py-32 overflow-hidden bg-brand-bg-dark/20">

      {/* Background ambient highlights */}
      <div
        className="absolute top-1/4 left-10 w-[400px] h-[400px] rounded-full pointer-events-none filter blur-[120px] opacity-[0.02] select-none"
        style={{ background: 'radial-gradient(circle, #FF2E8A 0%, transparent 100%)' }}
      />
      <div
        className="absolute bottom-1/4 right-10 w-[400px] h-[400px] rounded-full pointer-events-none filter blur-[120px] opacity-[0.02] select-none"
        style={{ background: 'radial-gradient(circle, #FF9A00 0%, transparent 100%)' }}
      />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-black tracking-[0.25em] uppercase text-brand-pink font-jetbrains mb-3">
            Kemitraan & Merek
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-6">
            Sponsor Resmi & <br />
            <span className="bg-gradient-to-r from-brand-pink via-brand-orange to-brand-gold bg-clip-text text-transparent">
              Etalase Kemitraan
            </span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed font-sans">
            Bermitra dengan jaringan gaming terkemuka dan merek gaya hidup Indonesia untuk menghadirkan kompetisi eFootball ke jutaan rumah tangga.
          </p>
        </div>

        {/* ── 1. Infinite Horizontal Marquee ── */}
        <div className="relative w-full overflow-hidden py-10 bg-white/[0.01] border-y border-white/5 mb-24 rounded-xl">
          {/* Left and Right Fade overlays */}
          <div className="absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-brand-bg-dark to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-brand-bg-dark to-transparent z-10 pointer-events-none" />

          {/* Marquee Row */}
          <motion.div
            className="flex whitespace-nowrap gap-16 select-none w-max"
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: 22,
                ease: 'linear',
              },
            }}
          >
            {MARQUEE_ITEMS.map((logo, index) => (
              <div
                key={`${logo}-${index}`}
                className="inline-flex items-center justify-center text-gray-500 font-jetbrains font-extrabold text-xl sm:text-2xl tracking-[0.2em] hover:text-white transition-colors duration-300 pointer-events-none"
              >
                <Award className="w-5 h-5 mr-3 text-brand-orange/40" />
                {logo}
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── 2. Sponsor Tier Cards ── */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-white mb-2">Paket Sponsor yang Tersedia</h3>
            <p className="text-gray-400 text-sm">Berdayakan talenta esports dan tingkatkan visibilitas perusahaan Anda</p>
          </div>

          <ScrollReveal direction="up" stagger staggerDelay={0.15}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              {SPONSOR_TIERS.map((tier: SponsorTier) => {
                const isPlatinum = tier.id === 'platinum'
                const isGold = tier.id === 'gold'

                // Map border and badge colors
                let colorStyle = 'border-white/10'
                let textGlow = 'text-white'
                if (isPlatinum) {
                  colorStyle = 'border-brand-pink/30 shadow-brand/10 shadow-2xl'
                  textGlow = 'text-brand-pink'
                } else if (isGold) {
                  colorStyle = 'border-brand-gold/20'
                  textGlow = 'text-brand-gold'
                }

                return (
                  <ScrollRevealItem key={tier.id} className="h-full">
                    <GlassCard
                      className="h-full relative group"
                      panelClassName={`p-8 h-full flex flex-col justify-between border ${colorStyle} bg-brand-bg-surface/30 backdrop-blur-lg hover:border-white/20 transition-all duration-300`}
                    >
                      {/* Featured Accent Tag */}
                      {tier.highlighted && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-pink to-brand-orange text-[10px] font-bold font-jetbrains tracking-widest uppercase text-white px-4 py-1 rounded-full shadow-lg flex items-center gap-1 z-20">
                          <Sparkles className="w-3 h-3 fill-white animate-spin-slow" />
                          Paling Populer
                        </div>
                      )}

                      <div className="space-y-6">
                        {/* Header */}
                        <div className="text-center border-b border-white/5 pb-6">
                          <span className={`text-xs font-black uppercase tracking-widest font-jetbrains ${textGlow}`}>
                            Paket {tier.name}
                          </span>
                          <h4 className="text-3xl font-black text-white mt-2 font-sans tracking-tight">
                            {isPlatinum ? 'Tingkat Platinum' : isGold ? 'Tingkat Gold' : 'Tingkat Silver'}
                          </h4>
                        </div>

                        {/* Perks checklist */}
                        <ul className="space-y-3">
                          {tier.perks.map((perk, perkIdx) => (
                            <li key={perkIdx} className="flex items-start text-xs sm:text-sm text-gray-400 leading-tight font-sans">
                              <Check className={`w-4 h-4 mr-2.5 shrink-0 mt-0.5 ${isPlatinum ? 'text-brand-pink' : isGold ? 'text-brand-gold' : 'text-gray-400'
                                }`} />
                              <span>{perk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Card Button */}
                      <div className="pt-8">
                        <button
                          onClick={handleSponsorClick}
                          className={`w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 font-jetbrains border flex items-center justify-center gap-2 cursor-pointer ${isPlatinum
                            ? 'bg-gradient-to-r from-brand-pink to-brand-orange text-white border-transparent hover:shadow-brand/20 hover:shadow-lg'
                            : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
                            }`}
                        >
                          <span>Ajukan Penawaran</span>
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </GlassCard>
                  </ScrollRevealItem>
                )
              })}
            </div>
          </ScrollReveal>
        </div>

        {/* ── 3. High-End B2B Call To Action ── */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="w-full max-w-4xl mx-auto text-center"
        >
          <div className="bg-gradient-to-r from-brand-pink/5 via-brand-orange/5 to-brand-gold/5 border border-white/10 rounded-2xl p-8 sm:p-12 backdrop-blur-md relative overflow-hidden shadow-2xl">
            {/* Ambient visual line inside */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-pink/40 to-transparent" />

            <div className="relative z-10 space-y-6">
              <div className="mx-auto w-12 h-12 rounded-full bg-brand-pink/10 border border-brand-pink/20 flex items-center justify-center mb-2">
                <Handshake className="w-6 h-6 text-brand-pink" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Beriklan di Turnamen eFootball Terkemuka
              </h3>
              <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-sans">
                Hubungkan bisnis Anda secara langsung dengan demografi mobile gaming Indonesia yang penuh gairah dan sangat aktif. Integrasi kustom, sampel produk, dan spot siaran langsung tersedia.
              </p>

              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: '0 0 25px rgba(255, 154, 0, 0.35)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSponsorClick}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider text-white bg-gradient-to-r from-brand-orange to-brand-gold hover:opacity-95 shadow-lg shadow-brand-orange/20 transition-all cursor-pointer font-jetbrains"
                >
                  <span>Menjadi Sponsor & Jangkau Jutaan Gamers</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

      </div>

      <SponsorInquiryModal open={modalOpen} onOpenChange={setModalOpen} />
    </section>
  )
}
