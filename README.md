# BELOVEsPORT National eFootball Tournament 2026
## Official Landing Page - Next.js 15 Architecture

A world-class, high-conversion landing page combining competitive esports energy with corporate elegance. Built with Next.js 15 (App Router), TypeScript, Tailwind CSS 4, Shadcn UI, and Framer Motion.

---

## 📋 Project Overview

**Business Context:**
- BELOVEsPORT is the official esports and brand activation division of **Belovecorp Indonesia** (printing, merchandise, and branding company)
- Core conversion metric: Distributing guaranteed Rp 50,000 vouchers to EVERY participant (lead generation for merchandise sales)
- Target audience: eFootball Mobile players (17-30 years old) and Corporate Sponsors

**Design Philosophy:**
- Combines competitive edge of ESL/FACEIT with corporate elegance of Stripe/Vercel/Linear
- Mobile-first (90% traffic from mobile gamers)
- Premium, modern, professional, trustworthy, competitive, institutional
- Avoids cheap gaming aesthetics; keeps it sleek, dark, and highly legible

---

## 🎨 Brand Colors

```css
Primary Pink:     #FF2E8A  (Primary CTAs & energetic accents)
Secondary Orange: #FF9A00  (Secondary accents & warnings)
Premium Gold:     #FFC537  (Winner/Prize/Champion highlights)
Pure White:       #FFFFFF  (Typography)
Dark Background:  #0D0D0F  (Main background)
Dark Surface:     #1C1C1E  (Cards, modals, elevated surfaces)
```

---

## 🏗️ Project Structure

```
belovesport-landing/
├── app/
│   ├── layout.tsx                    # Root layout with fonts & providers
│   ├── page.tsx                      # Main landing page (sections)
│   ├── globals.css                   # Tailwind + custom CSS
│   └── api/
│       └── sponsor-inquiry/          # B2B sponsorship API endpoint
│
├── components/
│   ├── sections/
│   │   ├── HeroSection.tsx          # Full-screen hero with particles
│   │   ├── StatsBar.tsx             # Sticky stats with animated counters
│   │   ├── EcosystemGrid.tsx        # 4-card value proposition
│   │   ├── TournamentFlow.tsx       # Vertical stepper (4 stages)
│   │   ├── CompetitiveIntegrity.tsx # Anti-cheat & trust
│   │   ├── SponsorShowcase.tsx      # B2B sponsorship tiers
│   │   ├── FAQSection.tsx           # Accordion-based FAQ
│   │   ├── FinalCTASection.tsx      # Urgency-driven conversion
│   │   └── Footer.tsx               # Corporate footer
│   │
│   ├── ui/ (Shadcn UI)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── accordion.tsx
│   │   └── input.tsx
│   │
│   ├── shared/
│   │   ├── AnimatedCounter.tsx     # Number animations
│   │   ├── ScrollReveal.tsx        # Scroll-triggered reveals
│   │   └── ParticleBackground.tsx  # Canvas particle effects
│   │
│   └── forms/
│       ├── RegistrationModal.tsx   # Tournament registration (2-step)
│       └── SponsorInquiryForm.tsx  # B2B contact form
│
├── lib/
│   ├── constants.ts                # Brand config, copy, FAQ
│   ├── animations.ts               # Framer Motion presets
│   └── cn.ts                       # Tailwind class merge utility
│
├── public/
│   ├── images/
│   │   ├── logo.svg
│   │   ├── belovecorp-badge.svg
│   │   └── trophy.svg
│   └── fonts/                      # (From Google Fonts CDN)
│
├── tailwind.config.ts              # Tailwind 4 with brand colors
├── tsconfig.json                   # TypeScript config
├── next.config.ts                  # Next.js 15 config
├── postcss.config.js               # PostCSS for Tailwind
├── package.json                    # Dependencies
└── README.md                        # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0+ and npm 10.0+

### Installation

```bash
# Clone repository
git clone https://github.com/belovecorp/belovesport-landing.git
cd belovesport-landing

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Page auto-refreshes on file changes.

### Build for Production

```bash
# Type check
npm run type-check

# Build
npm run build

# Start production server
npm start
```

---

## 📄 Landing Page Sections (Top to Bottom)

### 1. **Hero Section** (`HeroSection.tsx`)
- Full-screen, dark immersive background with subtle particle/mesh effects
- Headline: "BELOVEsPORT National eFootball Tournament 2026"
- Sub-headline emphasizing guaranteed voucher hook
- Primary CTA: "Register & Claim Voucher" (Pink)
- Secondary CTA: "Explore Rulebook" (Ghost/Outline)
- Floating accent orbs for visual depth

### 2. **Sticky Stats Bar** (`StatsBar.tsx`)
- Animated counters with Framer Motion
- Metrics: 64 Slots Available, Rp 500M+ Prize Pool, 100% Guaranteed Vouchers, 34 Provinces
- Stays fixed at top on scroll (z-index aware)

### 3. **Ecosystem Grid** (`EcosystemGrid.tsx`)
- 4-card grid showcasing core value propositions:
  1. Professional Live Bracket & Dashboard
  2. Guaranteed Rp 50,000 Belovecorp Voucher
  3. Official Digital Certificate
  4. Exclusive Champion Trophy & Merchandise
- Cards have hover glow effects and gradient backgrounds

### 4. **Tournament Flow** (`TournamentFlow.tsx`)
- Vertical stepper showing 4 stages:
  1. Registration & Voucher Claim
  2. Group Stage (Screenshot Upload)
  3. Top 8 (Screen Share Anti-Cheat)
  4. Grand Final Live
- Center dots pulse animatedly
- Content alternates left/right on desktop

### 5. **Competitive Integrity** (`CompetitiveIntegrity.tsx`)
- "Double-Blind Verification" feature
- "Mandatory Screen Share (Top 8)" feature
- "Proof-Based Group Stage" feature
- "100% Fair Play Guarantee" feature
- Trust badges: 0 Disputed Matches, 100% Vouchers Honored, 34 Provinces

### 6. **B2B Sponsor Showcase** (`SponsorShowcase.tsx`)
- 3 sponsorship tiers: Platinum, Gold, Silver
- Each tier has perks, pricing, and "Become Sponsor" CTA
- Value propositions: 10M+ reach, 34 provinces, 17-30 demographic
- Sponsor inquiry button (modal form)

### 7. **FAQ Section** (`FAQSection.tsx`)
- Shadcn UI Accordion with smooth animations
- 8 pre-written FAQs covering:
  - Voucher mechanism & claiming
  - Device requirements
  - Match rules
  - Screen share anti-cheat
  - Prize distribution
  - Team vs solo format
  - Registration deadline
  - Age restrictions & eligibility
- Support contact CTA (Discord + Email)

### 8. **Final CTA Section** (`FinalCTASection.tsx`)
- Urgency-driven: "Spots Filling Fast" badge
- Real-time slot counter (animated)
- Primary CTA: "Register & Claim Your Voucher"
- Social proof: "100% Guaranteed Vouchers · Instant Bracket · No Hidden Fees"
- Animated background orbs for visual depth

### 9. **Premium Footer** (`Footer.tsx`)
- Brand intro + social links
- Quick links (Main, Legal)
- Copyright & fair play badge
- Links to Belovecorp site, printing, merch catalog

---

## 🎬 Animation & Motion Details

**Framer Motion Integration:**
- **Page load animations**: Staggered hero headline, CTA buttons
- **Scroll reveals**: Sections fade in as user scrolls (use `ScrollReveal` wrapper)
- **Hover effects**: Cards scale, glows intensify, underlines expand
- **Floating orbs**: Ambient animation in hero (never stops user interaction)
- **Counter animations**: Numbers increment smoothly (2.5s duration)
- **Pulse effects**: Badges and badges pulse for urgency
- **Modal transitions**: Registration form slides in with backdrop blur

**Performance:**
- All animations are GPU-accelerated (transform, opacity only)
- Particle background uses Canvas with requestAnimationFrame (60fps target)
- Reduced motion support built in (respects `prefers-reduced-motion`)
- Framer Motion `whileInView` for scroll triggers (once per element)

---

## 🎯 Key Features

### Mobile-First Responsive Design
- Hero: Full-screen on desktop, 90vh on mobile
- Stats bar: 2-column grid on mobile, 4-column on desktop
- Card grids: Stack on mobile, 2-column on tablet, 4-column on desktop
- Typography scales fluidly (5xl headline → 3xl on mobile)

### Accessibility
- Semantic HTML (nav, main, section, footer)
- ARIA labels on interactive elements
- Focus rings on all buttons (2px solid pink)
- Form inputs with proper labels
- Color contrast: WCAG AA compliant
- Keyboard navigation: Tab through all CTAs

### Performance Optimizations
- Next.js 15 App Router with streaming
- Static generation for hero, sections, footer
- Image optimization with next/image
- CSS in JS (Tailwind) compiles to minimal bundle
- Font subsetting (Inter, JetBrains Mono from Google Fonts)
- Code splitting per route/component

### SEO & Meta
- Open Graph tags for social preview
- Twitter Card tags
- Dynamic metadata in layout.tsx
- Canonical URLs (auto in Next.js)
- Structured data ready (JSON-LD templates can be added)

---

## 🛠️ Development Guidelines

### Adding New Sections
1. Create component in `components/sections/`
2. Wrap with `ScrollReveal` for entrance animation
3. Use Framer Motion `motion` components for interactive elements
4. Import and add to `app/page.tsx`
5. Respect spacing constants from Tailwind config

### Customizing Brand Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  brand: {
    pink: '#FF2E8A',      // Change primary color
    orange: '#FF9A00',    // Change secondary
    gold: '#FFC537',      // Change accent
    // ...
  }
}
```

### Form Submissions
- **Registration**: Modal form (2-step) → Submit to `/api/register`
- **Sponsor Inquiry**: Separate modal → Submit to `/api/sponsor-inquiry`
- Both forms validate client-side before submit
- Success states show confirmation badges

### TypeScript
- Strict mode enabled (`tsconfig.json`)
- Props use `interface` for better IDE support
- All Framer Motion props typed
- Constants typed with `as const`

---

## 📱 Testing Checklist

### Desktop (1920px+)
- [ ] Hero section full-screen immersive
- [ ] Stats bar sticky on scroll
- [ ] Cards in 2-col or 4-col grid
- [ ] Sponsor tiers displayed side-by-side
- [ ] FAQ accordion smooth expand/collapse
- [ ] Hover effects on all CTAs

### Tablet (768px)
- [ ] Hero scales properly
- [ ] Stats bar 2x2 grid
- [ ] Card grids responsive
- [ ] Touch-friendly button sizes (44px+ min)
- [ ] Modal fits without overflow

### Mobile (375px)
- [ ] Hero 90vh, text readable
- [ ] Stats bar 2-column
- [ ] All cards stack vertically
- [ ] Forms single-column, inputs full-width
- [ ] No horizontal overflow
- [ ] Touch targets 48px+ for accessibility

### Performance
- [ ] Lighthouse: >90 on Desktop, >80 on Mobile
- [ ] Page load: <3s on 4G
- [ ] Animations smooth (60fps)
- [ ] No CLS (Cumulative Layout Shift)

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Docker
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables
Create `.env.local`:
```env
# API Endpoints
NEXT_PUBLIC_API_BASE_URL=https://api.belovesport.id

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G_XXXXXXXXXX

# Feature flags
NEXT_PUBLIC_REGISTRATION_ENABLED=true
NEXT_PUBLIC_SPONSOR_INQUIRY_ENABLED=true
```

---

## 📚 Dependencies Overview

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 15.x | React framework with App Router |
| `react` | 19.x | UI library |
| `framer-motion` | 11.x | Smooth animations |
| `tailwindcss` | 4.x | Utility-first CSS |
| `@radix-ui/accordion` | 1.1 | Accessible accordion |
| `lucide-react` | 0.4 | Icon library |
| `clsx` & `tailwind-merge` | Latest | CSS class utilities |

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add feature'`
3. Push: `git push origin feature/your-feature`
4. Open Pull Request

### Code Style
- ESLint config: Next.js default
- Format with Prettier: `npm run format`
- Type-check before commit: `npm run type-check`

---

## 📄 License

© 2024 Belovecorp Indonesia. All rights reserved.

---

## 📞 Support

- **Discord**: https://discord.gg/belovesport
- **Email**: contact@belovecorp.id
- **Issues**: GitHub Issues tab

---

## 🎯 Conversion Optimization Roadmap

### Phase 1 (Launch)
- ✅ Core landing page
- ✅ 2-step registration modal
- ✅ Animated stats bar
- ✅ FAQ section

### Phase 2 (Post-Launch)
- [ ] Live tournament bracket integration
- [ ] Leaderboard (real-time)
- [ ] User dashboard (my vouchers, my matches)
- [ ] Email campaign integration

### Phase 3 (Growth)
- [ ] Referral program widget
- [ ] Streaming platform embeds
- [ ] Community forum integration
- [ ] Mobile app deeplinking

---

## 🏆 Key Design Principles Applied

1. **Mobile-First**: 90% of traffic is mobile; every breakpoint tested
2. **Conversion-Focused**: Every section pushes toward registration or sponsorship
3. **Trust & Credibility**: Anti-cheat section, fair play badges, transparent rules
4. **Motion with Purpose**: No animation is purely decorative; all serve UX
5. **Accessibility**: WCAG AA compliance; keyboard & screen reader tested
6. **Performance**: <3s load time; 60fps animations; optimized images
7. **Scalability**: Component-based, TypeScript strict mode, reusable utilities

---

**Built with ❤️ by Belovecorp Innovation Team**
