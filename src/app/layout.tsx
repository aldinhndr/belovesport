import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
// @ts-ignore
import './globals.css'

/* ========================================
   Font Configuration
   ======================================== */

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800', '900'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
  weight: ['400', '500', '600', '700'],
})

/* ========================================
   Metadata & SEO
   ======================================== */

export const metadata: Metadata = {
  title: 'BELOVEsPORT | Platform Turnamen eFootball Mobile Terkemuka di Indonesia',
  description:
    'Bergabunglah dengan turnamen eFootball mobile paling terpercaya di Indonesia. 64 slot kompetitif, total hadiah Rp 500 juta+, terverifikasi anti-cheat. Daftar sekarang dan klaim voucher eksklusif Anda.',
  keywords: [
    'eFootball',
    'turnamen',
    'Indonesia',
    'esports',
    'BELOVEsPORT',
    'Belovecorp',
    'gaming',
    'kompetitif',
    'hadiah',
    'voucher gratis',
  ],
  authors: [{ name: 'Belovecorp', url: 'https://belovecorp.id' }],
  openGraph: {
    title: 'BELOVEsPORT | Turnamen eFootball Mobile Terkemuka Indonesia',
    description:
      'Bergabunglah bersama 64 pemain elite yang bersaing memperebutkan hadiah Rp 500 juta+. Terverifikasi anti-cheat, bracket transparan, dan hadiah eksklusif.',
    url: 'https://belovesport.id',
    siteName: 'BELOVEsPORT',
    type: 'website',
    locale: 'id_ID',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BELOVEsPORT | Turnamen eFootball Mobile Terkemuka Indonesia',
    description:
      'Bergabunglah bersama 64 pemain elite, hadiah Rp 500 juta+. Daftar sekarang!',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

/* ========================================
   Root Layout
   ======================================== */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#FFFFFF" />
      </head>
      <body className="bg-brand-bg-light text-brand-dark font-sans antialiased">
        {/* Skip to content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-brand-pink focus:text-white focus:rounded-lg focus:text-sm focus:font-semibold"
        >
          Skip to main content
        </a>

        <main id="main-content">{children}</main>
      </body>
    </html>
  )
}
