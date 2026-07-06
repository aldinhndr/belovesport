'use client'

/**
 * ScrollReveal
 * ============
 * Framer Motion wrapper that fades-and-slides content into view when the
 * element enters the viewport.
 *
 * Features
 * --------
 * - Hardware-accelerated (transform + opacity only → zero layout shift)
 * - Respects `prefers-reduced-motion` system preference
 * - `mobileDisable` prop skips animation on small viewports for 60 FPS on
 *   lower-end Android devices
 * - Supports stagger children mode for list reveals
 */

import React, { useRef, type ReactNode } from 'react'
import {
  motion,
  useInView,
  type Variants,
  type Transition,
} from 'framer-motion'

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

interface ScrollRevealProps {
  /** Content to reveal */
  children: ReactNode
  /** Direction from which the element slides in. Default: 'up' */
  direction?: Direction
  /** Animation delay in seconds. Default: 0 */
  delay?: number
  /** Animation duration in seconds. Default: 0.6 */
  duration?: number
  /** Distance (px) the element travels. Default: 32 */
  distance?: number
  /** When true applies staggerChildren to child variants */
  stagger?: boolean
  /** Stagger delay between children in seconds. Default: 0.12 */
  staggerDelay?: number
  /** Fraction of element visible before triggering. Default: 0.15 */
  threshold?: number
  /** Fire once only (default) or every time element enters view */
  once?: boolean
  /** Skip animation entirely on mobile viewports (< 768 px) */
  mobileDisable?: boolean
  /** Additional className on the wrapper */
  className?: string
  /** Allows arbitrary data-* or aria-* passthrough */
  [key: `data-${string}`]: unknown
}

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────

function getInitialOffset(direction: Direction, distance: number): Record<string, number> {
  switch (direction) {
    case 'up':    return { y: distance }
    case 'down':  return { y: -distance }
    case 'left':  return { x: distance }
    case 'right': return { x: -distance }
    case 'none':  return {}
  }
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function isMobileViewport(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768
}

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

export function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  distance = 32,
  stagger = false,
  staggerDelay = 0.12,
  threshold = 0.15,
  once = true,
  mobileDisable = false,
  className,
  ...rest
}: ScrollRevealProps): React.JSX.Element {
  const ref = useRef<HTMLDivElement>(null)

  const isInView = useInView(ref, {
    once,
    amount: threshold,
    margin: '-40px',
  })

  // Respect system accessibility preference or mobile perf flag
  const skip = prefersReducedMotion() || (mobileDisable && isMobileViewport())

  const offset = getInitialOffset(direction, distance)

  const transition: Transition = {
    duration,
    delay,
    ease: [0.25, 0.46, 0.45, 0.94],
  }

  // Stagger container variant
  const containerVariants: Variants = stagger
    ? {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delay,
          },
        },
      }
    : {
        hidden: { opacity: 0, ...offset },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          transition,
        },
      }

  if (skip) {
    return (
      <div ref={ref} className={className} {...rest}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
      {...rest}
    >
      {stagger
        ? React.Children.map(children, (child) => (
            <motion.div
              variants={{
                hidden: { opacity: 0, ...offset },
                visible: { opacity: 1, x: 0, y: 0, transition },
              }}
            >
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  )
}

/**
 * Convenience child-item variant for use when the parent is a stagger
 * ScrollReveal and you want full control over the child wrapper element.
 */
export function ScrollRevealItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}): React.JSX.Element {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
        },
      }}
    >
      {children}
    </motion.div>
  )
}
