"use client"

import { motion } from "framer-motion"
import { ShieldCheck, Scale, Eye, CheckCircle } from "lucide-react"
import { INTEGRITY_FEATURES } from "@/lib/constants"

const iconMap = {
  ShieldCheck: ShieldCheck,
  Scale: Scale,
  Eye: Eye,
  CheckCircle: CheckCircle,
}

export function CompetitiveIntegrity() {
  return (
    <section id="integrity" className="py-24 relative overflow-hidden bg-black">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-96 bg-[#FF2E8A]/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter"
          >
            Integritas <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E8A] to-[#FF9A00]">Tanpa Kompromi</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-400 max-w-2xl mx-auto"
          >
            Kami menanggapi permainan adil dengan sangat serius. Infrastruktur keamanan multi-layer kami memastikan arena kompetisi yang jujur untuk seluruh peserta.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
          {INTEGRITY_FEATURES.map((feature, idx) => {
            const IconComponent = iconMap[feature.icon as keyof typeof iconMap] || ShieldCheck
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[#FF2E8A]/20 to-[#FF9A00]/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <IconComponent className="text-[#FF9A00]" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed font-sans">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
