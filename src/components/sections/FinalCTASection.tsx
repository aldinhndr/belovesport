"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Timer, Trophy, Zap } from "lucide-react"
import { TOURNAMENT_CONFIG } from "@/lib/constants"

// 1. Tambahkan kontrak interface props di sini
interface FinalCTASectionProps {
  onOpenRegister: () => void;
}

export function FinalCTASection({ onOpenRegister }: FinalCTASectionProps) {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black to-[#0A0A0A]" />

      {/* Dynamic Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full bg-gradient-to-r from-[#FF2E8A]/20 to-[#FF9A00]/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-16 relative overflow-hidden shadow-2xl shadow-[#FF2E8A]/10"
        >
          {/* Urgency Badge */}
          <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-400 px-4 py-2 rounded-full font-bold text-sm mb-8 border border-red-500/30">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            Slot Terbatas Tersisa
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter uppercase leading-tight">
            Klaim Tempat Anda <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E8A] to-[#FF9A00]">
              Dalam Sejarah
            </span>
          </h2>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            Jalan menuju 2026 dimulai di sini. Daftar sekarang untuk mengklaim voucher eksklusif Anda, amankan bracket Anda, dan berjuanglah untuk kejuaraan nasional.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            {/* 2. Hubungkan langsung aksi klik ke callback props state global */}
            <Button
              size="lg"
              variant="premium"
              className="w-full sm:w-auto min-w-[200px] text-lg cursor-pointer"
              onClick={onOpenRegister}
            >
              <Zap className="mr-2" size={20} /> Daftar & Klaim Voucher
            </Button>

            <Button size="lg" variant="glass" className="w-full sm:w-auto min-w-[200px] text-lg cursor-pointer" onClick={() => {
              const el = document.getElementById("format")
              if (el) el.scrollIntoView({ behavior: "smooth" })
            }}>
              <Trophy className="mr-2" size={20} /> Lihat Jadwal Acara
            </Button>
          </div>

          {/* Stats Footer */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-white/10">
            {[
              { label: "Total Hadiah", value: TOURNAMENT_CONFIG.prizePoolRupiah },
              { label: "Sisa Slot", value: `${TOURNAMENT_CONFIG.slotsRemaining || 12} / ${TOURNAMENT_CONFIG.slots}` },
              { label: "Provinsi", value: `${TOURNAMENT_CONFIG.provinces || 34}` },
              { label: "Pendaftaran Ditutup", value: "15 Juli", icon: Timer }
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-white flex items-center gap-2">
                  {stat.icon && <stat.icon className="text-[#FF9A00]" size={20} />}
                  {stat.value}
                </span>
                <span className="text-sm text-gray-400 font-medium uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}