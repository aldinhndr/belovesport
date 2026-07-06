'use client'

/**
 * Floating3DOrb
 * =============
 * Reusable Vercel/Apple-style glass sphere component.
 *
 * Visual technique
 * ----------------
 * 1. Outer shell — large radial gradient going from light at top-left to
 *    transparent, giving the illusion of a curved translucent surface.
 * 2. Inner highlight — small bright specular spot (top-left) simulating
 *    a light source reflection.
 * 3. Soft shadow ring at the bottom edge for depth grounding.
 * 4. backdrop-blur for the frosted-glass interior.
 * 5. Infinite Framer Motion float animation (translateY loop).
 */

import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────

type OrbVariant = 'pink' | 'orange' | 'gold' | 'multi' | 'neutral'

interface Floating3DOrbProps {
  /** Size of the orb in pixels. Default: 200 */
  size?: number
  /** Brand colour preset. Default: 'pink' */
  variant?: OrbVariant
  /** Float travel distance in px. Default: 20 */
  floatDistance?: number
  /** Float animation duration in seconds. Default: 6 */
  floatDuration?: number
  /** Animation delay in seconds. Default: 0 */
  delay?: number
  /** Extra classes on the wrapper */
  className?: string
}

// ─────────────────────────────────────────────────────────
// Colour maps
// ─────────────────────────────────────────────────────────

const VARIANT_STYLES: Record<
  OrbVariant,
  { primary: string; secondary: string; glow: string }
> = {
  pink: {
    primary: 'rgba(255, 46, 138, 0.25)',
    secondary: 'rgba(255, 46, 138, 0.05)',
    glow: '0 0 60px rgba(255, 46, 138, 0.35), 0 0 120px rgba(255, 46, 138, 0.15)',
  },
  orange: {
    primary: 'rgba(255, 154, 0, 0.25)',
    secondary: 'rgba(255, 154, 0, 0.05)',
    glow: '0 0 60px rgba(255, 154, 0, 0.35), 0 0 120px rgba(255, 154, 0, 0.15)',
  },
  gold: {
    primary: 'rgba(255, 197, 55, 0.25)',
    secondary: 'rgba(255, 197, 55, 0.05)',
    glow: '0 0 60px rgba(255, 197, 55, 0.35), 0 0 120px rgba(255, 197, 55, 0.15)',
  },
  multi: {
    primary: 'rgba(255, 46, 138, 0.2)',
    secondary: 'rgba(255, 154, 0, 0.1)',
    glow: '0 0 60px rgba(255, 46, 138, 0.3), 0 0 120px rgba(255, 154, 0, 0.2)',
  },
  neutral: {
    primary: 'rgba(255, 255, 255, 0.08)',
    secondary: 'rgba(255, 255, 255, 0.02)',
    glow: '0 0 60px rgba(255, 255, 255, 0.1)',
  },
}

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

export function Floating3DOrb({
  size = 200,
  variant = 'pink',
  floatDistance = 20,
  floatDuration = 6,
  delay = 0,
  className,
}: Floating3DOrbProps): React.JSX.Element {
  const styles = VARIANT_STYLES[variant]
  const radius = size / 2

  return (
    <motion.div
      aria-hidden="true"
      className={cn('relative flex-shrink-0 select-none pointer-events-none', className)}
      style={{ width: size, height: size }}
      animate={{ y: [0, -floatDistance, 0] }}
      transition={{
        duration: floatDuration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {/* ── Outer glass shell ── */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          borderRadius: '50%',
          background: `
            radial-gradient(
              circle at 30% 25%,
              rgba(255,255,255,0.18) 0%,
              ${styles.primary} 30%,
              ${styles.secondary} 65%,
              transparent 100%
            )
          `,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: styles.glow,
        }}
      />

      {/* ── Inner specular highlight (top-left) ── */}
      <div
        className="absolute"
        style={{
          top: '12%',
          left: '15%',
          width: size * 0.35,
          height: size * 0.22,
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse at center, rgba(255,255,255,0.45) 0%, transparent 70%)',
          filter: 'blur(3px)',
          transform: 'rotate(-30deg)',
        }}
      />

      {/* ── Secondary micro-highlight ── */}
      <div
        className="absolute"
        style={{
          top: '20%',
          left: '22%',
          width: size * 0.12,
          height: size * 0.08,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.7)',
          filter: 'blur(2px)',
        }}
      />

      {/* ── Bottom shadow grounding ── */}
      <div
        className="absolute"
        style={{
          bottom: '-12%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: size * 0.7,
          height: size * 0.12,
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.35)',
          filter: `blur(${radius * 0.3}px)`,
        }}
      />

      {/* ── Rim light (right edge for depth) ── */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          borderRadius: '50%',
          background: `
            radial-gradient(
              circle at 80% 70%,
              ${styles.primary.replace('0.25', '0.15')} 0%,
              transparent 50%
            )
          `,
        }}
      />
    </motion.div>
  )
}
