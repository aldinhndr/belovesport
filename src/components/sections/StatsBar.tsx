'use client'

/**
 * StatsBar
 * ========
 * A sleek, semi-transparent statistics container displaying key metrics.
 * Responsive layout that wraps beautifully into a 2x2 grid on mobile viewports.
 */

import { motion } from 'framer-motion'
import { Users, Trophy, Gift, MapPin } from 'lucide-react'
import { AnimatedCounter } from '@/components/shared/AnimatedCounter'
import { STATS_ITEMS, IconName } from '@/lib/constants'

// Map IconName strings to actual Lucide components
const iconComponents: Record<IconName, React.ComponentType<{ className?: string }>> = {
  Users,
  Trophy,
  Gift,
  MapPin,
  // Default fallbacks for interface compliance
  GitBranch: Users,
  Award: Trophy,
  Crown: Trophy,
  UserCheck: Users,
  Swords: Trophy,
  Zap: Trophy,
  ShieldCheck: Trophy,
  Scale: Trophy,
  Eye: Trophy,
  CheckCircle: Trophy,
  MessageCircle: Trophy,
  Instagram: Trophy,
  Twitter: Trophy,
  Youtube: Trophy,
  Music: Trophy,
  Mail: Trophy,
  Star: Trophy,
  Gamepad2: Trophy,
}

// ─────────────────────────────────────────────────────────
// Motion Variants
// ─────────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
}

export function StatsBar(): React.JSX.Element {
  return (
    <section id="stats" className="relative z-20 px-4 sm:px-6 lg:px-8 py-10">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="w-full max-w-6xl mx-auto rounded-2xl border border-white/10 bg-brand-bg-surface/40 backdrop-blur-xl px-6 py-8 md:py-6 shadow-xl relative overflow-hidden"
      >
        {/* Glow effect at the bottom-right of the bar */}
        <div
          className="absolute right-0 bottom-0 w-48 h-48 rounded-full pointer-events-none filter blur-3xl opacity-10"
          style={{
            background: 'radial-gradient(circle, #FF9A00 0%, transparent 70%)',
          }}
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 items-center justify-center relative z-10">
          {STATS_ITEMS.map((stat, idx) => {
            const Icon = iconComponents[stat.icon] || Users

            // Determine custom accent color scheme based on item type
            let colorClass = 'text-brand-pink bg-brand-pink/15 border border-brand-pink/20'
            if (stat.id === 'prize') {
              colorClass = 'text-brand-gold bg-brand-gold/15 border border-brand-gold/20'
            } else if (stat.id === 'voucher') {
              colorClass = 'text-brand-orange bg-brand-orange/15 border border-brand-orange/20'
            } else if (stat.id === 'provinces') {
              colorClass = 'text-emerald-400 bg-emerald-400/15 border border-emerald-400/20'
            }

            return (
              <motion.div
                key={stat.id}
                variants={itemVariants}
                className={`flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 p-4 rounded-xl hover:bg-white/[0.02] transition-colors duration-300 ${
                  idx !== STATS_ITEMS.length - 1 ? 'lg:border-r lg:border-white/5' : ''
                }`}
              >
                {/* Icon Container */}
                <div className={`p-3 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                  <Icon className="w-6 h-6" />
                </div>

                {/* Counter & Label */}
                <div className="flex flex-col space-y-1">
                  <span className="flex items-baseline justify-center sm:justify-start">
                    <AnimatedCounter
                      to={stat.value}
                      prefix={stat.prefix || ''}
                      suffix={stat.suffix || ''}
                      duration={2.0}
                      className="text-3xl sm:text-4xl font-black tracking-tight text-white font-jetbrains"
                    />
                  </span>
                  <span className="text-xs sm:text-sm text-gray-400 font-semibold uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}
