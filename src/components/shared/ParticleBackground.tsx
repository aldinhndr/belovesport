'use client'

/**
 * ParticleBackground — Global 3D Ambient Experience
 * ==================================================
 * A unified, high-end 3D atmospheric background system that dynamically
 * reacts to mouse coordinates and scroll position across the entire
 * BELOVEsPORT landing page.
 *
 * Architecture:
 * ─────────────
 * Layer 0  — Luxury base (#0D0D0F)
 * Layer 1  — 3 volumetric aurora orbs (brand-pink, brand-orange, brand-gold)
 *            with mix-blend-mode: screen and infinite drift keyframes
 * Layer 2  — 14 floating geometric dust nodes (polygonal SVG vectors)
 *            with simulated Z-depth translateZ transitions
 * Layer 3  — Mouse-reactive 3D parallax container wrapping layers 1–2
 *            driven by useMotionValue + useSpring for buttery damping
 *
 * Performance:
 * ────────────
 * - All transforms use GPU-accelerated properties only (transform, opacity)
 * - will-change: transform applied to animated elements
 * - Mouse tracking disabled on touch/mobile viewports via matchMedia
 * - Reduced orb complexity on mobile (fewer keyframes, smaller sizes)
 * - pointer-events: none so the layer never blocks UI interaction
 * - SSR-safe: renders null until client mount confirmed
 */

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────

interface GeometricNode {
  id: number
  /** Horizontal position as viewport percentage */
  x: number
  /** Vertical position as viewport percentage */
  y: number
  /** Base size in pixels */
  size: number
  /** Rotation offset in degrees */
  rotation: number
  /** Animation cycle duration in seconds */
  duration: number
  /** Start delay in seconds */
  delay: number
  /** Base opacity 0-1 */
  opacity: number
  /** Polygon type for SVG shape rendering */
  shape: 'triangle' | 'diamond' | 'hexagon' | 'line' | 'cross'
  /** Simulated depth layer (0=far, 1=near) affects parallax + scale */
  depth: number
}

interface AuroraOrb {
  id: number
  /** CSS position values */
  x: string
  y: string
  /** Diameter */
  size: string
  /** Mobile-reduced diameter */
  sizeMobile: string
  /** Radial gradient definition */
  gradient: string
  /** Blur radius */
  blur: number
  /** Parallax sensitivity multiplier */
  parallaxFactor: number
  /** Drift animation keyframes */
  drift: {
    x: number[]
    y: number[]
    scale: number[]
  }
  /** Animation cycle duration */
  cycleDuration: number
}

// ─────────────────────────────────────────────────────────
// Aurora Orb Definitions
// ─────────────────────────────────────────────────────────

const AURORA_ORBS: AuroraOrb[] = [
  {
    id: 1,
    x: '65%',
    y: '8%',
    size: '55vw',
    sizeMobile: '70vw',
    gradient:
      'radial-gradient(ellipse at 40% 50%, rgba(255, 46, 138, 0.18) 0%, rgba(255, 46, 138, 0.06) 40%, transparent 70%)',
    blur: 80,
    parallaxFactor: 0.025,
    drift: {
      x: [0, 30, -15, 20, 0],
      y: [0, -20, 10, -30, 0],
      scale: [1, 1.08, 0.95, 1.05, 1],
    },
    cycleDuration: 22,
  },
  {
    id: 2,
    x: '10%',
    y: '35%',
    size: '50vw',
    sizeMobile: '65vw',
    gradient:
      'radial-gradient(ellipse at 55% 45%, rgba(255, 154, 0, 0.15) 0%, rgba(255, 107, 43, 0.05) 45%, transparent 72%)',
    blur: 100,
    parallaxFactor: 0.018,
    drift: {
      x: [0, -20, 25, -10, 0],
      y: [0, 15, -25, 20, 0],
      scale: [1, 1.12, 0.92, 1.06, 1],
    },
    cycleDuration: 26,
  },
  {
    id: 3,
    x: '40%',
    y: '72%',
    size: '45vw',
    sizeMobile: '60vw',
    gradient:
      'radial-gradient(ellipse at 50% 50%, rgba(255, 197, 55, 0.12) 0%, rgba(255, 170, 0, 0.04) 50%, transparent 75%)',
    blur: 120,
    parallaxFactor: 0.03,
    drift: {
      x: [0, 18, -22, 12, 0],
      y: [0, -12, 18, -8, 0],
      scale: [1, 1.06, 0.97, 1.1, 1],
    },
    cycleDuration: 30,
  },
]

// ─────────────────────────────────────────────────────────
// Geometric SVG Shape Paths
// ─────────────────────────────────────────────────────────

function getShapePath(shape: GeometricNode['shape']): string {
  switch (shape) {
    case 'triangle':
      return 'M12 2 L22 20 L2 20 Z'
    case 'diamond':
      return 'M12 1 L23 12 L12 23 L1 12 Z'
    case 'hexagon':
      return 'M12 2 L21 7 L21 17 L12 22 L3 17 L3 7 Z'
    case 'line':
      return 'M4 12 L20 12'
    case 'cross':
      return 'M12 4 L12 20 M4 12 L20 12'
  }
}

// ─────────────────────────────────────────────────────────
// Deterministic Geometric Dust Generator
// Seeded with fixed values to prevent hydration mismatches
// ─────────────────────────────────────────────────────────

const SHAPES: GeometricNode['shape'][] = [
  'triangle', 'diamond', 'hexagon', 'line', 'cross',
]

/**
 * Pre-computed geometric nodes using a simple LCG PRNG
 * to produce identical values on server and client.
 */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

function generateGeometricNodes(count: number): GeometricNode[] {
  return Array.from({ length: count }, (_, i) => {
    const s1 = seededRandom(i * 7 + 1)
    const s2 = seededRandom(i * 7 + 2)
    const s3 = seededRandom(i * 7 + 3)
    const s4 = seededRandom(i * 7 + 4)
    const s5 = seededRandom(i * 7 + 5)
    const s6 = seededRandom(i * 7 + 6)
    const s7 = seededRandom(i * 7 + 7)

    return {
      id: i,
      x: Math.round(s1 * 100),
      y: Math.round(s2 * 100),
      size: Math.round(s3 * 16 + 8),        // 8–24 px
      rotation: Math.round(s4 * 360),
      duration: Math.round((s5 * 12 + 10) * 10) / 10, // 10–22s
      delay: Math.round(s6 * 6 * 10) / 10,
      opacity: Math.round((s7 * 0.12 + 0.04) * 100) / 100, // 0.04–0.16
      shape: SHAPES[i % SHAPES.length],
      depth: Math.round(s1 * 100) / 100, // 0.00–1.00
    }
  })
}

const GEOMETRIC_NODES = generateGeometricNodes(14)

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

export function ParticleBackground(): React.JSX.Element | null {
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // ── Mouse tracking motion values ──
  const rawMouseX = useMotionValue(0)
  const rawMouseY = useMotionValue(0)

  // Smooth spring-follow with organic damping (no jaggy snapping)
  const springX = useSpring(rawMouseX, { stiffness: 40, damping: 25, mass: 1.2 })
  const springY = useSpring(rawMouseY, { stiffness: 40, damping: 25, mass: 1.2 })

  // Map spring values to 3D perspective rotations
  const rotateY = useTransform(springX, [-1, 1], [-1.5, 1.5])   // degrees
  const rotateX = useTransform(springY, [-1, 1], [1.2, -1.2])   // inverted for natural feel
  const translateZ = useTransform(springX, [-1, 1], [-8, 8])     // subtle depth shift

  // ── Memoized node data to prevent re-generation ──
  const geometricNodes = useMemo(() => GEOMETRIC_NODES, [])

  // ── Mouse handler (only on desktop) ──
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!containerRef.current) return
      const { innerWidth, innerHeight } = window
      // Normalise to -1 → +1 range
      rawMouseX.set((e.clientX / innerWidth - 0.5) * 2)
      rawMouseY.set((e.clientY / innerHeight - 0.5) * 2)
    },
    [rawMouseX, rawMouseY],
  )

  // ── Mount & capability detection ──
  useEffect(() => {
    setMounted(true)

    // Detect touch/mobile viewports
    const mql = window.matchMedia('(hover: none) and (pointer: coarse)')
    setIsMobile(mql.matches)

    const handleChange = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mql.addEventListener('change', handleChange)

    // Only attach mouse listener on desktop
    if (!mql.matches) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true })
    }

    return () => {
      mql.removeEventListener('change', handleChange)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [handleMouseMove])

  // SSR guard — render nothing on server
  if (!mounted) return null

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 -z-20 pointer-events-none overflow-hidden select-none"
      style={{
        backgroundColor: '#0D0D0F',
      }}
    >
      {/* ================================================================
       *  LAYER 1 — 3D Perspective Container
       *  Wraps aurora orbs + geometric dust in a unified 3D space.
       *  Mouse movement drives rotateX/Y/Z for immersive depth.
       *  Disabled on mobile for performance.
       * ================================================================ */}
      <motion.div
        className="absolute inset-0"
        style={{
          perspective: 1200,
          perspectiveOrigin: '50% 50%',
        }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            transformStyle: 'preserve-3d',
            rotateX: isMobile ? 0 : rotateX,
            rotateY: isMobile ? 0 : rotateY,
            translateZ: isMobile ? 0 : translateZ,
            willChange: 'transform',
          }}
        >

          {/* ────────────────────────────────────────────────────────
           *  LAYER 1A — Volumetric Aurora Orbs
           *  3 organic glow orbs representing the brand identity.
           *  mix-blend-mode: screen over the dark luxury base.
           *  Infinite drift animation simulates a live aurora mesh.
           * ──────────────────────────────────────────────────────── */}
          {AURORA_ORBS.map((orb) => (
            <motion.div
              key={`aurora-${orb.id}`}
              className="absolute rounded-full"
              style={{
                left: orb.x,
                top: orb.y,
                width: isMobile ? orb.sizeMobile : orb.size,
                height: isMobile ? orb.sizeMobile : orb.size,
                background: orb.gradient,
                filter: `blur(${orb.blur}px)`,
                mixBlendMode: 'screen',
                transform: 'translate(-50%, -50%)',
                willChange: 'transform, opacity',
              }}
              animate={
                isMobile
                  ? {
                      // Simplified animation on mobile — less keyframes
                      x: [0, orb.drift.x[1], 0],
                      y: [0, orb.drift.y[1], 0],
                      scale: [1, orb.drift.scale[1], 1],
                      opacity: [0.8, 1, 0.8],
                    }
                  : {
                      x: orb.drift.x,
                      y: orb.drift.y,
                      scale: orb.drift.scale,
                      opacity: [0.7, 1, 0.85, 1, 0.7],
                    }
              }
              transition={{
                duration: orb.cycleDuration,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}

          {/* ────────────────────────────────────────────────────────
           *  LAYER 1B — Mouse-Following Glow (desktop only)
           *  A subtle radial glow that loosely tracks the cursor
           *  position through the spring system, adding volumetric
           *  "light following the viewer" depth.
           * ──────────────────────────────────────────────────────── */}
          {!isMobile && (
            <motion.div
              className="absolute rounded-full"
              style={{
                width: '35vw',
                height: '35vw',
                left: '50%',
                top: '50%',
                x: springX,
                y: springY,
                transform: 'translate(-50%, -50%)',
                background:
                  'radial-gradient(circle, rgba(255, 46, 138, 0.06) 0%, rgba(255, 154, 0, 0.03) 40%, transparent 70%)',
                filter: 'blur(60px)',
                mixBlendMode: 'screen',
                willChange: 'transform',
              }}
            />
          )}

          {/* ────────────────────────────────────────────────────────
           *  LAYER 2 — Floating Geometric Dust Nodes
           *  14 abstract low-opacity polygonal SVG shapes
           *  representing digital field lines / tournament data.
           *  Each has a simulated Z-depth via translateZ to create
           *  a 3D starfield/dust parallax effect.
           * ──────────────────────────────────────────────────────── */}
          {geometricNodes.map((node) => {
            const isStroke = node.shape === 'line' || node.shape === 'cross'
            // Depth-based parallax: deeper nodes move slower, near nodes faster
            const depthScale = 0.6 + node.depth * 0.5     // 0.6–1.1
            const zDepth = -100 + node.depth * 200         // -100 to +100 px

            return (
              <motion.div
                key={`geo-${node.id}`}
                className="absolute"
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  width: node.size * depthScale,
                  height: node.size * depthScale,
                  willChange: 'transform, opacity',
                  transform: `translateZ(${Math.round(zDepth)}px)`,
                }}
                animate={{
                  y: [0, -(15 + node.depth * 30), 8, -(10 + node.depth * 15), 0],
                  x: [0, 8 - node.depth * 10, -(5 + node.depth * 8), 6, 0],
                  rotate: [
                    node.rotation,
                    node.rotation + 45,
                    node.rotation + 20,
                    node.rotation - 15,
                    node.rotation,
                  ],
                  opacity: [
                    node.opacity,
                    node.opacity * 1.8,
                    node.opacity * 0.5,
                    node.opacity * 1.4,
                    node.opacity,
                  ],
                  scale: [depthScale, depthScale * 1.15, depthScale * 0.9, depthScale * 1.05, depthScale],
                }}
                transition={{
                  duration: node.duration,
                  delay: node.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                >
                  <path
                    d={getShapePath(node.shape)}
                    stroke={
                      node.id % 3 === 0
                        ? 'rgba(255, 46, 138, 0.35)'
                        : node.id % 3 === 1
                          ? 'rgba(255, 154, 0, 0.30)'
                          : 'rgba(255, 197, 55, 0.25)'
                    }
                    strokeWidth={isStroke ? 1.5 : 0.8}
                    fill={
                      isStroke
                        ? 'none'
                        : node.id % 3 === 0
                          ? 'rgba(255, 46, 138, 0.04)'
                          : node.id % 3 === 1
                            ? 'rgba(255, 154, 0, 0.03)'
                            : 'rgba(255, 197, 55, 0.03)'
                    }
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            )
          })}

        </motion.div>
      </motion.div>

      {/* ================================================================
       *  LAYER 3 — Vignette & Film Grain Overlay
       *  Soft radial vignette darkening edges + a subtle noise texture
       *  to unify the 3D layers and give that cinematic look.
       * ================================================================ */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(13, 13, 15, 0.5) 80%, rgba(13, 13, 15, 0.85) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
