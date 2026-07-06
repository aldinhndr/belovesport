'use client'

/**
 * Footer
 * ======
 * Premium responsive footer displaying:
 * - Brand intro and logo reference
 * - Quick navigation links (NAV_ITEMS)
 * - Social media links with icons (SOCIAL_LINKS)
 * - Legal compliance details and copywrite
 */

import { MessageCircle, Instagram, Twitter, Youtube, Music, Mail, ShieldCheck, LucideIcon } from 'lucide-react'
import { TOURNAMENT_CONFIG, SOCIAL_LINKS, NAV_ITEMS, IconName } from '@/lib/constants'

// Map IconName to Lucide components
const iconMap: Record<IconName, LucideIcon> = {
  MessageCircle,
  Instagram,
  Twitter,
  Youtube,
  Music,
  Mail,
  ShieldCheck,
  // Fallbacks
  Users: MessageCircle,
  Trophy: MessageCircle,
  Gift: MessageCircle,
  MapPin: MessageCircle,
  GitBranch: MessageCircle,
  Award: MessageCircle,
  Crown: MessageCircle,
  UserCheck: MessageCircle,
  Swords: MessageCircle,
  Zap: MessageCircle,
  Scale: MessageCircle,
  Eye: MessageCircle,
  CheckCircle: MessageCircle,
  Star: MessageCircle,
  Gamepad2: MessageCircle,
}

export function Footer(): React.JSX.Element {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative z-10 bg-brand-bg-dark border-t border-white/5 pt-16 pb-10">
      
      {/* Decorative accent glow above footer */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-brand-pink/50 to-transparent opacity-50"
      />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 items-start mb-12">
          
          {/* Column 1: Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <span className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              <span className="bg-gradient-to-r from-brand-pink via-brand-orange to-brand-gold bg-clip-text text-transparent font-sans">
                {TOURNAMENT_CONFIG.shortName}
              </span>
              <span className="text-xs font-semibold text-gray-500 font-jetbrains tracking-wider">
                {TOURNAMENT_CONFIG.edition}
              </span>
            </span>

            <p className="text-gray-400 text-sm leading-relaxed max-w-sm font-sans">
              Platform kompetisi eFootball Mobile terkemuka di Indonesia.
              Diselenggarakan oleh {TOURNAMENT_CONFIG.organizer} untuk menyajikan ajang yang bersih,
              terverifikasi anti-cheat, dan penuh kejayaan di 34 provinsi.
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold font-jetbrains tracking-wider uppercase text-white">
              Navigasi
            </h4>
            <ul className="grid grid-cols-2 gap-2 text-sm font-sans">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-gray-400 hover:text-brand-pink transition-colors duration-200"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact & Support */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-bold font-jetbrains tracking-wider uppercase text-white">
              Kontak & Bantuan
            </h4>
            <p className="text-gray-400 text-sm leading-normal font-sans">
              Untuk pertanyaan kemitraan atau kendala pendaftaran:
            </p>
            <div className="space-y-2 text-sm font-sans">
              <a
                href={`mailto:${TOURNAMENT_CONFIG.supportEmail}`}
                className="flex items-center gap-2 text-gray-400 hover:text-brand-orange transition-colors duration-200 font-jetbrains"
              >
                <Mail className="w-4 h-4 text-brand-orange" />
                <span>{TOURNAMENT_CONFIG.supportEmail}</span>
              </a>
              <div className="flex items-center gap-2 text-gray-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Bantuan Anti-Cheat Aktif</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Social Row & Copyright */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <p className="text-xs text-gray-500 font-jetbrains text-center sm:text-left">
            &copy; {currentYear} {TOURNAMENT_CONFIG.shortName}. Hak cipta dilindungi undang-undang.
            Diselenggarakan oleh {TOURNAMENT_CONFIG.organizer}.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map((social) => {
              const Icon = iconMap[social.icon] || MessageCircle
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all duration-300"
                >
                  <Icon className="w-4.5 h-4.5" />
                </a>
              )
            })}
          </div>
        </div>

      </div>
    </footer>
  )
}
