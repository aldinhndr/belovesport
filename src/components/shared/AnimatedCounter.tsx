'use client'

/**
 * AnimatedCounter
 * ===============
 * Smoothly animates a numeric value from 0 (or `from`) to `to` using
 * Framer Motion's imperative `animate` utility.
 *
 * Features
 * --------
 * - Triggers only when scrolled into viewport (Intersection Observer via useInView)
 * - Locale-aware number formatting (Indonesian default: 'id-ID')
 * - Optional prefix / suffix strings
 * - Easing and duration fully customisable
 * - Hardware-accelerated (no layout properties touched)
 * - `prefers-reduced-motion` guard — shows final value immediately
 */

import { useEffect, useRef } from 'react'
import {
  useMotionValue,
  useTransform,
  animate,
  motion,
  useInView,
  type MotionValue,
} from 'framer-motion'

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────

interface AnimatedCounterProps {
  /** Target number to animate to */
  to: number
  /** Starting number. Default: 0 */
  from?: number
  /** String prepended to the number (e.g. 'Rp ') */
  prefix?: string
  /** String appended after the number (e.g. 'M+', '%') */
  suffix?: string
  /** Animation duration in seconds. Default: 2 */
  duration?: number
  /** Fraction of element visible before animation starts. Default: 0.5 */
  threshold?: number
  /** Locale for Intl.NumberFormat. Default: 'id-ID' */
  locale?: string
  /** Intl.NumberFormat options override */
  formatOptions?: Intl.NumberFormatOptions
  /** Class name on the displayed <span> */
  className?: string
}

// ─────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────

function useAnimatedNumber(
  mv: MotionValue<number>,
  locale: string,
  formatOptions?: Intl.NumberFormatOptions,
): MotionValue<string> {
  return useTransform(mv, (latest: number) => {
    const formatter = new Intl.NumberFormat(locale, {
      maximumFractionDigits: 0,
      ...formatOptions,
    })
    return formatter.format(Math.round(latest))
  })
}

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

export function AnimatedCounter({
  to,
  from = 0,
  prefix = '',
  suffix = '',
  duration = 2,
  threshold = 0.5,
  locale = 'id-ID',
  formatOptions,
  className,
}: AnimatedCounterProps): React.JSX.Element {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(from)
  const displayValue = useAnimatedNumber(motionValue, locale, formatOptions)

  // Trigger only when the element is visible in the viewport
  const isInView = useInView(ref, {
    once: true,
    amount: threshold,
  })

  useEffect(() => {
    if (!isInView) return

    // Skip animation if user prefers reduced motion
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced) {
      motionValue.set(to)
      return
    }

    const controls = animate(motionValue, to, {
      duration,
      ease: [0.33, 1, 0.68, 1], // easeOutCubic
    })

    return () => controls.stop()
  }, [isInView, to, duration, motionValue])

  return (
    <motion.span ref={ref} className={className}>
      {prefix}
      <motion.span>{displayValue}</motion.span>
      {suffix}
    </motion.span>
  )
}
