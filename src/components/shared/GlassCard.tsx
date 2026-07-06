'use client'

/**
 * GlassCard
 * =========
 * Premium soft-glass card with dynamic 3D tilt and cursor-tracked shiny
 * reflection. Inspired by high-end SaaS product landing pages.
 *
 * Technique
 * ---------
 * 1. Mouse move → compute rotateX / rotateY relative to card centre
 * 2. Framer Motion spring smooths the tilt for a natural inertia feel
 * 3. A radial gradient "shine" overlay follows the cursor inside the card
 * 4. CSS perspective wrapper enables the 3D transform
 * 5. All transforms are GPU-composited (transform, opacity only)
 *
 * Accessibility: motion is disabled when prefers-reduced-motion is set
 */

import {
  useRef,
  useState,
  useCallback,
  type ReactNode,
  type MouseEvent,
} from 'react'
import { motion, useSpring, type SpringOptions } from 'framer-motion'
import { cn } from '@/lib/cn'

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────

interface GlassCardProps {
  children: ReactNode
  /** Max tilt angle in degrees. Default: 10 */
  maxTilt?: number
  /** Whether to render the shine overlay. Default: true */
  shine?: boolean
  /** Whether to render the brand gradient border. Default: true */
  gradientBorder?: boolean
  /** Extra classes on the outer perspective wrapper */
  className?: string
  /** Extra classes on the glass panel itself */
  panelClassName?: string
  /** Click handler */
  onClick?: () => void
  /** aria-label for the card */
  'aria-label'?: string
}

// ─────────────────────────────────────────────────────────
// Spring config
// ─────────────────────────────────────────────────────────

const TILT_SPRING: SpringOptions = {
  stiffness: 200,
  damping: 20,
  mass: 0.8,
}

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

export function GlassCard({
  children,
  maxTilt = 10,
  shine = true,
  gradientBorder = true,
  className,
  panelClassName,
  onClick,
  'aria-label': ariaLabel,
}: GlassCardProps): React.JSX.Element {
  const cardRef = useRef<HTMLDivElement>(null)

  // Motion values for tilt
  const rotX = useSpring(0, TILT_SPRING)
  const rotY = useSpring(0, TILT_SPRING)

  // Shine position (percentage from top-left corner)
  const [shinePos, setShinePos] = useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = useState(false)

  // Reduced-motion guard
  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current || reducedMotion) return

      const { left, top, width, height } =
        cardRef.current.getBoundingClientRect()

      // Normalised position -0.5 → 0.5
      const nx = (e.clientX - left) / width - 0.5
      const ny = (e.clientY - top) / height - 0.5

      // rotateY: positive = tilt right, rotateX: positive = tilt up
      rotY.set(nx * maxTilt * 2)
      rotX.set(-ny * maxTilt * 2)

      // Shine follows raw cursor %
      setShinePos({
        x: ((e.clientX - left) / width) * 100,
        y: ((e.clientY - top) / height) * 100,
      })
    },
    [maxTilt, reducedMotion, rotX, rotY],
  )

  const handleMouseEnter = useCallback(() => setIsHovered(true), [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    rotX.set(0)
    rotY.set(0)
    setShinePos({ x: 50, y: 50 })
  }, [rotX, rotY])

  return (
    /* Perspective wrapper */
    <div
      className={cn('relative', className)}
      style={{ perspective: '1000px' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Gradient border glow */}
      {gradientBorder && (
        <motion.div
          aria-hidden="true"
          className="absolute -inset-px rounded-2xl pointer-events-none"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,46,138,0.5) 0%, rgba(255,154,0,0.3) 50%, rgba(255,197,55,0.5) 100%)',
            borderRadius: 'inherit',
            opacity: isHovered ? 1 : 0.4,
          }}
          animate={{ opacity: isHovered ? 1 : 0.4 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Glass panel */}
      <motion.div
        ref={cardRef}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        aria-label={ariaLabel}
        onClick={onClick}
        onKeyDown={
          onClick
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') onClick()
              }
            : undefined
        }
        className={cn(
          'relative overflow-hidden rounded-2xl',
          'bg-[rgba(28,28,30,0.7)]',
          'border border-white/10',
          onClick ? 'cursor-pointer' : 'cursor-default',
          panelClassName,
        )}
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          rotateX: reducedMotion ? 0 : rotX,
          rotateY: reducedMotion ? 0 : rotY,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        {/* Shine reflection overlay */}
        {shine && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 rounded-2xl transition-opacity duration-300"
            style={{
              opacity: isHovered ? 1 : 0,
              background: `radial-gradient(
                circle at ${shinePos.x}% ${shinePos.y}%,
                rgba(255, 255, 255, 0.07) 0%,
                transparent 60%
              )`,
            }}
          />
        )}

        {/* Top edge shimmer */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
          }}
        />

        {/* Content */}
        <div className="relative z-20">{children}</div>
      </motion.div>
    </div>
  )
}
