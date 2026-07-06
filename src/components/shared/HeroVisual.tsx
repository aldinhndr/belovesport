'use client'

/**
 * HeroVisual
 * ==========
 * The flagship 3D layered composition for the above-the-fold section of
 * BELOVEsPORT. Designed to communicate elite esports energy.
 *
 * Layer stack (back → front)
 * --------------------------
 * 1. Ambient background radial glow
 * 2. Outermost wireframe ring (slow spin, large)
 * 3. Middle wireframe ring (opposite spin, medium)
 * 4. Inner pulse ring (ping animation)
 * 5. Centre trophy silhouette (SVG + animated glow)
 * 6. Floating shields (left & right, staggered float)
 * 7. Orbiting eFootball geometries (small diamond particles)
 * 8. Mouse parallax layer — entire composition reacts to cursor
 *
 * Performance
 * -----------
 * - Only transform + opacity (no layout properties)
 * - All SVGs are inline (no network requests)
 * - pointer-events: none on decorative elements
 * - Reduced-motion: rings and floats are disabled, only trophy shown
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'
import { cn } from '@/lib/cn'

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────

interface HeroVisualProps {
  className?: string
  /** Overall composition size in px. Default: 480 */
  size?: number
}

interface OrbitalGeometry {
  id: number
  angle: number  // degrees, starting angle
  radius: number
  size: number
  color: string
  duration: number
  delay: number
}

// ─────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────

const ORBITAL_GEMS: OrbitalGeometry[] = [
  { id: 1, angle: 0,   radius: 170, size: 10, color: '#FF2E8A', duration: 8,  delay: 0 },
  { id: 2, angle: 72,  radius: 155, size: 7,  color: '#FF9A00', duration: 10, delay: 0.5 },
  { id: 3, angle: 144, radius: 175, size: 8,  color: '#FFC537', duration: 9,  delay: 1 },
  { id: 4, angle: 216, radius: 160, size: 6,  color: '#FF2E8A', duration: 11, delay: 1.5 },
  { id: 5, angle: 288, radius: 165, size: 9,  color: '#FF9A00', duration: 7,  delay: 2 },
]

// ─────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────

/** Inline SVG trophy silhouette */
function TrophySVG({ size }: { size: number }): React.JSX.Element {
  const s = size * 0.55
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="trophy-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF2E8A" />
          <stop offset="50%" stopColor="#FF9A00" />
          <stop offset="100%" stopColor="#FFC537" />
        </linearGradient>
        <filter id="trophy-glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Cup body */}
      <path
        d="M25 5 H75 V50 C75 70 60 80 50 83 C40 80 25 70 25 50 Z"
        fill="url(#trophy-grad)"
        filter="url(#trophy-glow)"
        opacity="0.9"
      />
      {/* Handles */}
      <path
        d="M25 15 C10 15 8 35 25 35"
        stroke="url(#trophy-grad)"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M75 15 C90 15 92 35 75 35"
        stroke="url(#trophy-grad)"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      {/* Stem */}
      <rect x="44" y="83" width="12" height="18" fill="url(#trophy-grad)" rx="2" />
      {/* Base */}
      <rect x="32" y="101" width="36" height="8" fill="url(#trophy-grad)" rx="4" />
      {/* Star highlight */}
      <circle cx="50" cy="38" r="6" fill="rgba(255,255,255,0.6)" />
    </svg>
  )
}

/** Rotating wireframe ring */
function WireframeRing({
  size,
  strokeColor,
  strokeDash,
  duration,
  direction = 1,
  opacity = 0.4,
}: {
  size: number
  strokeColor: string
  strokeDash: string
  duration: number
  direction?: 1 | -1
  opacity?: number
}): React.JSX.Element {
  return (
    <motion.div
      aria-hidden="true"
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      animate={{ rotate: direction === 1 ? 360 : -360 }}
      transition={{ duration, repeat: Infinity, ease: 'linear' }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        style={{ opacity }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 2}
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeDasharray={strokeDash}
        />
      </svg>
    </motion.div>
  )
}

/** Floating esports shield */
function EsportsShield({
  x,
  y,
  color,
  size: s,
  delay,
}: {
  x: string
  y: string
  color: string
  size: number
  delay: number
}): React.JSX.Element {
  return (
    <motion.div
      aria-hidden="true"
      className="absolute pointer-events-none"
      style={{ left: x, top: y }}
      animate={{ y: [0, -14, 0], rotate: [-3, 3, -3] }}
      transition={{ duration: 4, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg
        width={s}
        height={s * 1.15}
        viewBox="0 0 40 46"
        fill="none"
        style={{ filter: `drop-shadow(0 0 8px ${color})` }}
      >
        <path
          d="M20 2 L36 8 V22 C36 32 28 40 20 44 C12 40 4 32 4 22 V8 Z"
          fill={color}
          fillOpacity="0.15"
          stroke={color}
          strokeWidth="1.5"
        />
        <path
          d="M20 9 L28 12 V21 C28 27 24 32 20 34 C16 32 12 27 12 21 V12 Z"
          fill={color}
          fillOpacity="0.25"
        />
      </svg>
    </motion.div>
  )
}

/** Diamond orbital gem */
function DiamondGem({
  gem,
  containerSize,
  reducedMotion,
}: {
  gem: OrbitalGeometry
  containerSize: number
  reducedMotion: boolean
}): React.JSX.Element {
  const centre = containerSize / 2
  const rad = (gem.angle * Math.PI) / 180
  const startX = centre + Math.cos(rad) * gem.radius - gem.size / 2
  const startY = centre + Math.sin(rad) * gem.radius - gem.size / 2

  return (
    <motion.div
      aria-hidden="true"
      className="absolute pointer-events-none"
      style={{
        left: `${Math.round(startX)}px`,
        top: `${Math.round(startY)}px`,
        width: `${gem.size}px`,
        height: `${gem.size}px`,
        background: gem.color,
        transform: 'rotate(45deg)',
        boxShadow: `0 0 ${gem.size * 2}px ${gem.color}`,
        borderRadius: '2px',
        willChange: 'transform, opacity',
      }}
      animate={
        reducedMotion
          ? {}
          : {
              opacity: [0.8, 0.3, 0.8],
              scale: [1, 1.5, 1],
            }
      }
      transition={{
        duration: gem.duration,
        delay: gem.delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}

// ─────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────

export function HeroVisual({
  className,
  size = 480,
}: HeroVisualProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  // Spring-smoothed mouse parallax
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const springX = useSpring(rawX, { stiffness: 30, damping: 20 })
  const springY = useSpring(rawY, { stiffness: 30, damping: 20 })

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!containerRef.current) return
      const { left, top, width, height } =
        containerRef.current.getBoundingClientRect()
      // Move opposite to cursor for depth illusion
      rawX.set(((e.clientX - left) / width - 0.5) * -24)
      rawY.set(((e.clientY - top) / height - 0.5) * -24)
    },
    [rawX, rawY],
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => {
      mq.removeEventListener('change', handler)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [handleMouseMove])

  const centre = size / 2

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        'relative select-none pointer-events-none overflow-visible',
        className,
      )}
      style={{ width: size, height: size }}
    >
      {/* ── Layer 0: Ambient background glow ── */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(255,46,138,0.18) 0%, rgba(255,154,0,0.10) 35%, transparent 70%)',
          filter: 'blur(40px)',
          transform: 'scale(1.3)',
        }}
      />

      {/* ── Layer 1: Outer wireframe ring (slow clockwise) ── */}
      {!reducedMotion && (
        <WireframeRing
          size={size * 0.95}
          strokeColor="#FF2E8A"
          strokeDash="4 12"
          duration={30}
          direction={1}
          opacity={0.25}
        />
      )}

      {/* ── Layer 2: Middle wireframe ring (anti-clockwise) ── */}
      {!reducedMotion && (
        <WireframeRing
          size={size * 0.72}
          strokeColor="#FF9A00"
          strokeDash="8 6"
          duration={20}
          direction={-1}
          opacity={0.35}
        />
      )}

      {/* ── Layer 3: Inner pulse ping ring ── */}
      {!reducedMotion && (
        <motion.div
          className="absolute"
          style={{
            width: size * 0.45,
            height: size * 0.45,
            left: '50%',
            top: '50%',
            translateX: '-50%',
            translateY: '-50%',
            borderRadius: '50%',
            border: '1.5px solid rgba(255,197,55,0.5)',
          }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
        />
      )}

      {/* ── Mouse parallax wrapper for depth layers ── */}
      <motion.div
        className="absolute inset-0"
        style={{
          x: reducedMotion ? 0 : springX,
          y: reducedMotion ? 0 : springY,
        }}
      >
        {/* ── Layer 4: Floating esports shields ── */}
        {!reducedMotion && (
          <>
            <EsportsShield
              x={`${centre * 0.08}px`}
              y={`${centre * 0.7}px`}
              color="#FF2E8A"
              size={42}
              delay={0}
            />
            <EsportsShield
              x={`${centre * 1.6}px`}
              y={`${centre * 0.55}px`}
              color="#FF9A00"
              size={36}
              delay={1.2}
            />
            <EsportsShield
              x={`${centre * 0.2}px`}
              y={`${centre * 1.45}px`}
              color="#FFC537"
              size={28}
              delay={0.6}
            />
          </>
        )}

        {/* ── Layer 5: Orbiting diamond gems ── */}
        {!reducedMotion &&
          ORBITAL_GEMS.map((gem) => (
            <DiamondGem
              key={gem.id}
              gem={gem}
              containerSize={size}
              reducedMotion={reducedMotion}
            />
          ))}
      </motion.div>

      {/* ── Layer 6: Centre trophy (deepest parallax = 0, always stable) ── */}
      <motion.div
        className="absolute flex items-center justify-center"
        style={{
          inset: 0,
          x: reducedMotion ? 0 : springX,
          y: reducedMotion ? 0 : springY,
          scale: 1.0,
        }}
      >
        {/* Trophy glow halo */}
        <div
          className="absolute"
          style={{
            width: size * 0.42,
            height: size * 0.42,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(255,197,55,0.3) 0%, rgba(255,46,138,0.15) 50%, transparent 75%)',
            filter: 'blur(20px)',
          }}
        />

        {/* Trophy SVG */}
        <motion.div
          animate={reducedMotion ? {} : { y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <TrophySVG size={size} />
        </motion.div>
      </motion.div>

      {/* ── Layer 7: BELOVEsPORT text badge beneath trophy ── */}
      <motion.div
        className="absolute"
        style={{
          bottom: size * 0.05,
          left: '50%',
          translateX: '-50%',
        }}
        animate={reducedMotion ? {} : { opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span
          className="text-xs font-bold tracking-[0.2em] uppercase font-jetbrains"
          style={{
            background:
              'linear-gradient(135deg, #FF2E8A, #FF9A00, #FFC537)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: 'none',
          }}
        >
          BELOVEsPORT 2026
        </span>
      </motion.div>
    </div>
  )
}
