'use client'

/**
 * TournamentFlow
 * ==============
 * Visual interactive timeline showing the progression of the tournament.
 * - Desktop: Vertical alternating zig-zag layout with center progress line and pulsing indicators.
 * - Mobile: Collapses gracefully into a touch-friendly 2x2 grid (or 1x1 on small devices).
 */

import { motion } from 'framer-motion'
import { UserCheck, Swords, Zap, Trophy, type LucideIcon } from 'lucide-react'
import { TOURNAMENT_STAGES, TimelineStep, IconName } from '@/lib/constants'

// Map IconName to Lucide components
const iconMap: Record<IconName, LucideIcon> = {
  UserCheck,
  Swords,
  Zap,
  Trophy,
  // Fallbacks
  Users: UserCheck,
  Gift: UserCheck,
  MapPin: UserCheck,
  GitBranch: UserCheck,
  Award: Trophy,
  Crown: Trophy,
  ShieldCheck: UserCheck,
  Scale: UserCheck,
  Eye: UserCheck,
  CheckCircle: UserCheck,
  MessageCircle: UserCheck,
  Instagram: UserCheck,
  Twitter: UserCheck,
  Youtube: UserCheck,
  Music: UserCheck,
  Mail: UserCheck,
  Star: UserCheck,
  Gamepad2: UserCheck,
}

// ─────────────────────────────────────────────────────────
// Motion Variants
// ─────────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

export function TournamentFlow(): React.JSX.Element {
  return (
    <section id="tournament-flow" className="relative z-10 py-16 sm:py-24 lg:py-32 bg-brand-bg-dark/40">
      
      {/* Background glow behind the timeline section */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none filter blur-[100px] opacity-5 select-none"
        style={{
          background: 'radial-gradient(circle, #FF9A00 0%, #FF2E8A 50%, transparent 100%)',
        }}
      />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <p className="text-xs font-black tracking-[0.25em] uppercase text-brand-orange font-jetbrains mb-3">
            Jalan Menuju Kejuaraan
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-6">
            Jadwal Turnamen & <br />
            <span className="bg-gradient-to-r from-brand-pink via-brand-orange to-brand-gold bg-clip-text text-transparent">
              Alur Perjalanan
            </span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed font-sans">
            Ikuti alur perjalanan dari pendaftaran hingga grand final. Tandai kalender Anda dan bersiaplah untuk pertarungan eFootball kompetitif yang sesungguhnya.
          </p>
        </div>

        {/* Timeline Container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="relative"
        >
          {/* ────────────────── DESKTOP TIMELINE (md and up) ────────────────── */}
          <div className="hidden md:block relative">
            {/* Center vertical line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 top-4 bottom-4 w-0.5 bg-gradient-to-b from-brand-pink via-brand-orange to-brand-gold/20" />

            <div className="space-y-16">
              {TOURNAMENT_STAGES.map((stage: TimelineStep, index: number) => {
                const Icon = iconMap[stage.icon] || UserCheck
                const isEven = index % 2 === 0
                const isActive = stage.status === 'active'

                return (
                  <motion.div
                    key={stage.id}
                    variants={itemVariants}
                    className="relative grid grid-cols-2 gap-16 items-center"
                  >
                    {isEven ? (
                      <>
                        {/* Column 1: Card content (Even = Left) */}
                        <div className="flex justify-end pr-8">
                          <div className="w-full max-w-md bg-brand-bg-surface/50 border border-white/10 p-6 rounded-2xl backdrop-blur-md text-right shadow-xl hover:border-brand-pink/30 transition-all duration-300">
                            <span className="text-xs font-bold font-jetbrains text-brand-pink tracking-wider block mb-1">
                              {stage.dateRange}
                            </span>
                            <h3 className="text-xl font-bold text-white mb-2">{stage.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed font-sans">{stage.description}</p>
                          </div>
                        </div>
                        
                        {/* Column 2: Empty Spacer */}
                        <div className="w-full" />
                      </>
                    ) : (
                      <>
                        {/* Column 1: Empty Spacer */}
                        <div className="w-full" />

                        {/* Column 2: Card content (Odd = Right) */}
                        <div className="flex justify-start pl-8">
                          <div className="w-full max-w-md bg-brand-bg-surface/50 border border-white/10 p-6 rounded-2xl backdrop-blur-md text-left shadow-xl hover:border-brand-orange/30 transition-all duration-300">
                            <span className="text-xs font-bold font-jetbrains text-brand-orange tracking-wider block mb-1">
                              {stage.dateRange}
                            </span>
                            <h3 className="text-xl font-bold text-white mb-2">{stage.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed font-sans">{stage.description}</p>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Center point indicator */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center z-10">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                        isActive
                          ? 'border-brand-pink bg-brand-bg-dark shadow-[0_0_20px_rgba(255,46,138,0.5)]'
                          : 'border-white/20 bg-brand-bg-surface'
                      }`}>
                        <Icon className={`w-5 h-5 ${isActive ? 'text-brand-pink' : 'text-gray-500'}`} />
                      </div>
                      {/* Pulsing glow ring for active status */}
                      {isActive && (
                        <span className="absolute w-14 h-14 rounded-full border border-brand-pink/40 animate-ping opacity-75 pointer-events-none" />
                      )}
                    </div>

                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* ────────────────── MOBILE GRID (under md) ────────────────── */}
          <div className="block md:hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-center">
              {TOURNAMENT_STAGES.map((stage: TimelineStep) => {
                const Icon = iconMap[stage.icon] || UserCheck
                const isActive = stage.status === 'active'

                return (
                  <motion.div
                    key={stage.id}
                    variants={itemVariants}
                    className={`flex flex-col p-6 rounded-2xl border backdrop-blur-md shadow-lg transition-all duration-300 ${
                      isActive
                        ? 'border-brand-pink bg-brand-pink/5 shadow-brand/10'
                        : 'border-white/10 bg-brand-bg-surface/40'
                    }`}
                  >
                    {/* Header: Stage Badge + Date */}
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2.5 rounded-xl flex items-center justify-center shrink-0 border ${
                        isActive
                          ? 'text-brand-pink border-brand-pink/20 bg-brand-pink/10'
                          : 'text-gray-400 border-white/10 bg-white/5'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>

                      <span className={`text-xs font-bold font-jetbrains tracking-wider px-3 py-1 rounded-full ${
                        isActive
                          ? 'text-brand-pink bg-brand-pink/10 border border-brand-pink/20'
                          : 'text-gray-400 bg-white/5 border border-white/10'
                      }`}>
                        {stage.dateRange}
                      </span>
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-bold text-white mb-2">{stage.title}</h3>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed font-sans">{stage.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>

        </motion.div>

      </div>
    </section>
  )
}
