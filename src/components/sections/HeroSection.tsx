'use client'

/**
 * HeroSection — Premium Centered-Stack Tournament Registration Edition
 * ====================================================================
 * A high-end esports landing hero section for BELOVEsPORT eFootball Mobile 2026.
 * Formatted as a centered stack to avoid layout overlapping across all viewports.
 * 
 * Layout Hierarchy (top to bottom):
 *  1. ParticleBackground (flow-through canvas layer)
 *  2. HeroVisual (Trophy with perspective tilting)
 *  3. H1 Headline (TURNAMEN NASIONAL / eFOOTBALL MOBILE with strict leading-[1.1] & mb-6)
 *  4. Sub-hook Accent (MEREBUT SUPREMASI JUARA 2026. in Belove Gold)
 *  5. Description (Buktikan kemampuan taktis Koko...)
 *  6. CTAs Row (Daftar & Klaim Voucher vs Buku Panduan)
 *  7. Trust Indicators Row (Voucher Rp 50.000 Dijamin | Terverifikasi Anti-Cheat)
 *  8. Floating Urgency Pill (Sleek red pill block at the bottom)
 *  9. Animated Scroll Down Chevron
 */

import { useEffect, useState, useCallback, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Zap, BookOpen, Gift, ShieldCheck, ChevronDown } from 'lucide-react'
import { HeroVisual } from '@/components/shared/HeroVisual'
import { ParticleBackground } from '@/components/shared/ParticleBackground'

// ─────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────

interface HeroSectionProps {
  /** Callback when "Daftar & Klaim Voucher" is clicked (compatible with both name patterns) */
  onSignupClick?: () => void
  onOpenSignup?: () => void
  /** Callback when "Buku Panduan" is clicked */
  onRulebookClick?: () => void
}

// ─────────────────────────────────────────────────────────
// Motion Variants
// ─────────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

const fadeSlideUp = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

const visualVariants = {
  hidden: { opacity: 0, scale: 0.85, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 1.0,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

// ─────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────

export function HeroSection({
  onSignupClick,
  onOpenSignup,
  onRulebookClick,
}: HeroSectionProps): React.JSX.Element {
  const sectionRef = useRef<HTMLElement>(null)
  const [isDesktop, setIsDesktop] = useState(false)

  // ── Mouse coordinates (normalised -1 to 1) for 3D parallax ──
  const rawMouseX = useMotionValue(0)
  const rawMouseY = useMotionValue(0)

  // Smooth springs to eliminate jagged movement
  const springX = useSpring(rawMouseX, { stiffness: 35, damping: 28, mass: 1 })
  const springY = useSpring(rawMouseY, { stiffness: 35, damping: 28, mass: 1 })

  // Map mouse positions to 3D perspective rotation values
  const rotateX = useTransform(springY, [-1, 1], [3.5, -3.5])
  const rotateY = useTransform(springX, [-1, 1], [-4, 4])
  const translateZ = useTransform(springX, [-1, 1], [-6, 6])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!sectionRef.current || !isDesktop) return
      const { left, top, width, height } = sectionRef.current.getBoundingClientRect()
      rawMouseX.set(((e.clientX - left) / width - 0.5) * 2)
      rawMouseY.set(((e.clientY - top) / height - 0.5) * 2)
    },
    [rawMouseX, rawMouseY, isDesktop],
  )

  useEffect(() => {
    const mql = window.matchMedia('(hover: hover) and (pointer: fine)')
    setIsDesktop(mql.matches)

    const handleChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mql.addEventListener('change', handleChange)

    if (mql.matches) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true })
    }

    return () => {
      mql.removeEventListener('change', handleChange)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [handleMouseMove])

  // Compatible CTA register click handler
  const handleSignClick = () => {
    if (onOpenSignup) {
      onOpenSignup()
    } else if (onSignupClick) {
      onSignupClick()
    }
  }

  // Handle secondary rulebook CTA behavior
  const handleRulebookClick = () => {
    if (onRulebookClick) {
      onRulebookClick()
    } else {
      const el = document.getElementById('faq')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleScrollDown = () => {
    const el = document.getElementById('stats')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6 py-24 pt-28 sm:pt-32"
    >
      {/* ── Seamless 3D Particle Background ── */}
      <ParticleBackground />

      {/* ── Center vignette glow for atmospheric lighting ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255,46,138,0.04) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* ── Main centered content stack ── */}
      <motion.div
        className="relative z-10 flex flex-col items-center w-full max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ════════════════════════════════════
            LAYER 1 — HeroVisual Focal Point
            ════════════════════════════════════ */}
        <motion.div
          variants={visualVariants}
          className="w-full flex items-center justify-center pb-8 md:pb-12 pt-4 overflow-visible"
        >
          <div className="relative flex items-center justify-center" style={{ perspective: 1000 }}>
            {/* Ground reflection gradient below the visual */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-12 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(255,46,138,0.2) 0%, transparent 70%)',
                filter: 'blur(12px)',
                transform: 'scaleY(-1) translateY(8px)',
              }}
              aria-hidden="true"
            />
            {/* Responsive scaling of HeroVisual to prevent overlaps */}
            <HeroVisual size={220} className="sm:hidden" />
            <HeroVisual size={300} className="hidden sm:flex lg:hidden" />
            <HeroVisual size={380} className="hidden lg:flex" />
          </div>
        </motion.div>

        {/* ════════════════════════════════════
            LAYER 2 — Typography & Description (3D Parallax Tilt)
            ════════════════════════════════════ */}
        <motion.div
          style={{
            perspective: 1200,
            transformStyle: 'preserve-3d',
          }}
          className="w-full text-center"
        >
          <motion.div
            style={{
              rotateX: isDesktop ? rotateX : 0,
              rotateY: isDesktop ? rotateY : 0,
              translateZ: isDesktop ? translateZ : 0,
              transformStyle: 'preserve-3d',
              willChange: 'transform',
            }}
            className="flex flex-col items-center justify-center"
          >
            {/* H1 Heading: Line 1 & Line 2 stacked with strict line height to avoid collision */}
            <motion.h1
              variants={fadeSlideUp}
              className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-center leading-[1.1] mb-6 text-white uppercase"
            >
              TURNAMEN NASIONAL
              <span
                className="block mt-2"
                style={{
                  background: 'linear-gradient(90deg, #FF2E8A 0%, #FF9A00 50%, #FFC537 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 20px rgba(255,46,138,0.35))',
                }}
              >
                eFOOTBALL MOBILE
              </span>
            </motion.h1>

            {/* Sub-hook Accent (Italicized Belove Gold) */}
            <motion.p
              variants={fadeSlideUp}
              className="text-lg sm:text-xl md:text-2xl font-black italic tracking-widest uppercase mb-6 text-[#FFC537]"
              style={{
                textShadow: '0 0 15px rgba(255,197,55,0.4)',
              }}
            >
              PLAY, COMPETE, CREATE IMPACT.
            </motion.p>

            {/* Concise description */}
            <motion.p
              variants={fadeSlideUp}
              className="text-white/70 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl text-center mb-10 font-sans"
            >
              Buktikan kemampuan taktis Koko di arena sepak bola virtual paling bergengsi. Klaim voucher gratis Rp 50.000 otomatis setelah mendaftar terverifikasi.
            </motion.p>
          </motion.div>
        </motion.div>

        {/* ════════════════════════════════════
            LAYER 3 — Functional Components & CTAs
            ════════════════════════════════════ */}
        <motion.div
          variants={fadeSlideUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 w-full sm:w-auto z-10"
        >
          {/* Primary CTA Button (Daftar & Klaim Voucher) */}
          <motion.button
            whileHover={{
              scale: 1.04,
              boxShadow: '0 0 35px rgba(255,46,138,0.45), 0 0 70px rgba(255,46,138,0.18)',
            }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSignClick}
            className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-2xl text-sm font-extrabold uppercase tracking-wider text-white overflow-hidden cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #FF2E8A 0%, #FF9A00 50%, #FFC537 100%)',
              boxShadow: '0 0 24px rgba(255,46,138,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
            }}
          >
            {/* Hover reflection overlay */}
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
              style={{
                background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)',
              }}
              aria-hidden="true"
            />
            <Zap className="w-4 h-4 fill-white shrink-0 animate-pulse" aria-hidden="true" />
            <span>DAFTAR &amp; KLAIM VOUCHER</span>
          </motion.button>

          {/* Secondary CTA Button (Buku Panduan glassmorphism) */}
          <motion.button
            whileHover={{
              scale: 1.03,
              backgroundColor: 'rgba(255,255,255,0.08)',
              borderColor: 'rgba(255,255,255,0.22)',
            }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRulebookClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-2xl text-sm font-bold uppercase tracking-wider text-gray-300 border border-white/10 bg-white/[0.04] backdrop-blur-md transition-colors duration-200 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 shrink-0 text-gray-400" aria-hidden="true" />
            <span>BUKU PANDUAN</span>
          </motion.button>
        </motion.div>

        {/* ════════════════════════════════════
            LAYER 4 — Trust Indicators Row
            ════════════════════════════════════ */}
        <motion.div
          variants={fadeSlideUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-400 font-jetbrains"
        >
          <span className="flex items-center gap-2">
            <Gift className="w-4.5 h-4.5 text-[#FFC537]" />
            <span className="text-gray-300">Voucher Rp 50.000 Dijamin</span>
          </span>
          <span className="hidden sm:inline text-white/10">|</span>
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4.5 h-4.5 text-emerald-400" />
            <span className="text-gray-300">Terverifikasi Anti-Cheat</span>
          </span>
        </motion.div>
      </motion.div>

      {/* ── Animated scroll indicator button ── */}
      <motion.button
        type="button"
        aria-label="Gulir ke bawah"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        onClick={handleScrollDown}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-600 hover:text-gray-400 transition-colors cursor-pointer z-20"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.button>

      {/* ── Bottom fade overlay for sections blending ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(13,13,15,0.9), transparent)',
        }}
        aria-hidden="true"
      />
    </section>
  )
}
