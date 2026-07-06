"use client"

import { motion } from "framer-motion"

export function Dynamic3DLogo() {
  return (
    <div className="relative w-32 h-32 md:w-48 md:h-48 perspective-1000 flex items-center justify-center">
      <motion.div
        animate={{
          rotateY: [0, 360],
          y: [-10, 10, -10],
        }}
        transition={{
          rotateY: { duration: 15, repeat: Infinity, ease: "linear" },
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        }}
        className="w-full h-full relative preserve-3d"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-[#FF2E8A] to-[#FF9A00] rounded-2xl shadow-[0_0_40px_rgba(255,46,138,0.5)] border border-white/30 backdrop-blur-md flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-white/10 opacity-50 mix-blend-overlay"></div>
          <span className="text-white font-black text-2xl md:text-3xl tracking-tighter drop-shadow-lg z-10">
            BELOVE
          </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-white font-black text-lg md:text-xl tracking-widest z-10">
            SPORT
          </span>
          {/* Inner 3D depth elements */}
          <div 
            className="absolute inset-2 border-2 border-white/20 rounded-xl rounded-tr-3xl"
            style={{ transform: "translateZ(20px)" }}
          />
        </div>
      </motion.div>
    </div>
  )
}
