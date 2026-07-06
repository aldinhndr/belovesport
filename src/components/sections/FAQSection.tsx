'use client'

/**
 * FAQSection
 * ==========
 * Displays general, rules, and technical questions utilizing the Radix UI / Shadcn Accordion pattern.
 * Data is fed dynamically from the FAQ_ITEMS array in constants.
 */

import * as Accordion from '@radix-ui/react-accordion'
import { motion } from 'framer-motion'
import { ChevronDown, MessageCircle, Mail, HelpCircle, LifeBuoy } from 'lucide-react'
import { FAQ_ITEMS, TOURNAMENT_CONFIG } from '@/lib/constants'

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.08,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

export function FAQSection(): React.JSX.Element {
  return (
    <section id="faq" className="relative z-10 py-16 sm:py-24 lg:py-32">
      
      {/* Glow behind FAQ */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full pointer-events-none filter blur-[120px] opacity-[0.03] select-none"
        style={{
          background: 'radial-gradient(circle, #FF2E8A 0%, #FF9A00 50%, transparent 100%)',
        }}
      />

      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-black tracking-[0.25em] uppercase text-brand-pink font-jetbrains mb-3">
            Informasi Instan
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-6">
            Pertanyaan yang Sering <br />
            <span className="bg-gradient-to-r from-brand-pink via-brand-orange to-brand-gold bg-clip-text text-transparent">
              Diajukan (FAQ)
            </span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed font-sans">
            Punya pertanyaan tentang pendaftaran, anti-cheat, jadwal pertandingan, atau klaim hadiah? Berikut adalah semua hal yang perlu Anda ketahui untuk memulai.
          </p>
        </div>

        {/* Accordion Container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="space-y-6"
        >
          <Accordion.Root type="single" collapsible className="w-full space-y-4">
            {FAQ_ITEMS.map((faq) => (
              <motion.div key={faq.id} variants={itemVariants}>
                <Accordion.Item
                  value={faq.id}
                  className="border border-white/10 bg-brand-bg-surface/30 backdrop-blur-lg rounded-2xl overflow-hidden transition-all duration-300 hover:border-brand-pink/20"
                >
                  <Accordion.Header className="flex">
                    <Accordion.Trigger className="flex flex-1 items-center justify-between px-6 py-5 text-left text-sm sm:text-base font-bold text-white transition-all hover:bg-white/[0.02] group focus:outline-none cursor-pointer">
                      <span className="flex items-center gap-3 pr-4 font-sans">
                        <HelpCircle className="w-4.5 h-4.5 text-brand-orange shrink-0" />
                        <span>{faq.question}</span>
                      </span>
                      <ChevronDown className="h-4.5 w-4.5 text-gray-400 transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180 group-hover:text-white shrink-0" />
                    </Accordion.Trigger>
                  </Accordion.Header>

                  <Accordion.Content className="overflow-hidden text-gray-400 text-xs sm:text-sm border-t border-white/5 bg-white/[0.01] transition-all data-[state=closed]:animate-collapse-content data-[state=open]:animate-expand-content">
                    <div className="px-6 py-5 leading-relaxed font-normal font-sans">
                      {faq.answer}
                    </div>
                  </Accordion.Content>
                </Accordion.Item>
              </motion.div>
            ))}
          </Accordion.Root>
        </motion.div>

        {/* ── Additional Support CTA ── */}
        <div className="mt-16 text-center border-t border-white/5 pt-12 space-y-6">
          <div className="inline-flex items-center justify-center gap-2 text-xs font-bold font-jetbrains text-brand-orange uppercase tracking-wider">
            <LifeBuoy className="w-4.5 h-4.5" />
            <span>Masih Butuh Bantuan?</span>
          </div>
          <p className="text-gray-400 text-sm max-w-md mx-auto font-sans">
            Tim wasit dan panitia turnamen kami tersedia 7 hari seminggu di Discord dan email.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
              whileTap={{ scale: 0.98 }}
              href={TOURNAMENT_CONFIG.discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-white/5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white transition-all font-jetbrains"
            >
              <MessageCircle className="w-4.5 h-4.5 text-[#5865F2]" />
              <span>Hubungi Lewat Discord</span>
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
              whileTap={{ scale: 0.98 }}
              href={`mailto:${TOURNAMENT_CONFIG.supportEmail}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-white/5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white transition-all font-jetbrains"
            >
              <Mail className="w-4.5 h-4.5 text-brand-pink" />
              <span>Kirim Email Dukungan</span>
            </motion.a>
          </div>
        </div>

      </div>
    </section>
  )
}
