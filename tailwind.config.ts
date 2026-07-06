import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#561B1D',   // Maroon (Untuk tombol utama, header solid, garis aktif)
          secondary: '#82403B', // Coklat Pudar (Untuk hover state)
          gold: '#FCB335',      // Kuning Emas (Untuk badge, ikon, notifikasi)
          bronze: '#CD8133',    // Emas Gelap (Border aksen)
          
          // PALET TEMA TERANG (LIGHT MODE)
          dark: '#18181B',         // Zinc-900 (Warna teks utama, menggantikan putih)
          muted: '#71717A',        // Zinc-500 (Warna teks deskripsi/sekunder)
          'bg-light': '#FFFFFF',   // Putih Bersih (Background dasar halaman)
          'bg-surface': '#F8FAFC', // Abu-abu Slate Terang (Background untuk Card/Kotak agar tidak menyatu dengan background dasar)
          border: '#E2E8F0',       // Slate-200 (Warna garis tepi card yang soft)
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        jetbrains: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      backgroundImage: {
        // UPDATE: Gradien disesuaikan dengan warna Brand
        'gradient-brand': 'linear-gradient(135deg, #82403B 0%, #FCB335 50%, #CD8133 100%)',
        'gradient-brand-reverse': 'linear-gradient(135deg, #CD8133 0%, #FCB335 50%, #82403B 100%)',
        'gradient-dark': 'linear-gradient(180deg, #3B0E11 0%, #561B1D 100%)',
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
      },
      animation: {
        shimmer: 'animate-shimmer 2s linear infinite',
        'gradient-x': 'animate-gradient-x 3s ease infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 6s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite alternate',
        'spin-slow': 'spin 8s linear infinite',
        'orbit-spin': 'orbitSpin 10s linear infinite',
        'halo-pulse': 'haloPulse 3s ease-in-out infinite',
      },
      keyframes: {
        'animate-shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'animate-gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          // UPDATE: Efek glow disesuaikan dengan warna Gold
          '0%': { boxShadow: '0 0 5px rgba(252, 179, 53, 0.2), 0 0 20px rgba(252, 179, 53, 0.1)' },
          '100%': { boxShadow: '0 0 20px rgba(252, 179, 53, 0.4), 0 0 40px rgba(252, 179, 53, 0.2)' },
        },
        orbitSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        haloPulse: {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.08)' },
        },
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        // UPDATE: Shadow glow disesuaikan dengan warna Gold & Secondary
        'brand': '0 0 20px rgba(252, 179, 53, 0.15)',
        'brand-lg': '0 0 40px rgba(252, 179, 53, 0.25)',
        'brand-glow': '0 0 60px rgba(252, 179, 53, 0.3), 0 0 120px rgba(130, 64, 59, 0.15)',
      },
    },
  },
  plugins: [],
}

export default config