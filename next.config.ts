import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // ─── KUNCI LOCK PRISMA JANGKA PANJANG ───
  // Memaksa Next.js mengeksekusi Prisma secara native menggunakan Node.js biner,
  // bukan membungkusnya sebagai serverless/edge client. Ini menyelesaikan error engine!
  serverExternalPackages: ['@prisma/client'],
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    optimizeCss: true,
  },
}

export default nextConfig