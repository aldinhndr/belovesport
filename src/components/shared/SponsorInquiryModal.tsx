"use client"

import { useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { motion, AnimatePresence } from "framer-motion"
import { X, Building2, Mail, Phone, ArrowRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SponsorInquiryModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
}

export function SponsorInquiryModal({ open: propsOpen, onOpenChange: propsOnOpenChange, trigger }: SponsorInquiryModalProps) {
  const [localOpen, setLocalOpen] = useState(false)
  const [step, setStep] = useState(1)

  const isControlled = propsOpen !== undefined
  const isOpen = isControlled ? propsOpen : localOpen
  const setIsOpen = isControlled ? propsOnOpenChange : setLocalOpen

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(2) // Move to success step
  }

  const resetAndClose = () => {
    setIsOpen?.(false)
    setTimeout(() => setStep(1), 300)
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      {trigger ? (
        <Dialog.Trigger asChild>
          {trigger}
        </Dialog.Trigger>
      ) : !isControlled ? (
        <Dialog.Trigger asChild>
          <Button variant="premium" size="lg" className="shadow-[0_0_30px_rgba(255,46,138,0.3)] cursor-pointer">
            Menjadi Sponsor & Jangkau Jutaan Gamers
          </Button>
        </Dialog.Trigger>
      ) : null}
      
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-[#111] border border-white/10 rounded-2xl shadow-2xl z-50 p-0 overflow-hidden">
          
          <div className="relative p-6 md:p-8">
            <Dialog.Close asChild>
              <button 
                onClick={resetAndClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-2 cursor-pointer"
                aria-label="Tutup"
              >
                <X size={20} />
              </button>
            </Dialog.Close>

            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <h2 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight">
                    Bermitra Dengan <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E8A] to-[#FF9A00]">Kami</span>
                  </h2>
                  <p className="text-gray-400 mb-8 text-sm md:text-base font-sans">
                    Bergabunglah dengan ekosistem eFootball terbesar di Indonesia. Isi formulir di bawah ini dan tim B2B kami akan segera menghubungi Anda.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Nama Perusahaan</label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#FF2E8A] transition-colors" placeholder="PT Contoh Sukses" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Email Kerja</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input required type="email" className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#FF2E8A] transition-colors" placeholder="nama@perusahaan.com" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Nomor Telepon</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input required type="tel" className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#FF2E8A] transition-colors" placeholder="+62 812 3456 7890" />
                      </div>
                    </div>
                    <div className="pt-4">
                      <Button type="submit" className="w-full cursor-pointer" variant="premium" size="lg">
                        Kirim Pengajuan <ArrowRight className="ml-2" size={18} />
                      </Button>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 flex flex-col items-center text-center"
                >
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="text-green-500" size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Pengajuan Berhasil Dikirim!</h3>
                  <p className="text-gray-400 mb-8 max-w-sm font-sans">
                    Terima kasih atas ketertarikan Anda. Tim kemitraan kami akan meninjau detail Anda dan menghubungi Anda kembali dalam waktu 24 jam.
                  </p>
                  <Button variant="outline" className="cursor-pointer" onClick={resetAndClose}>
                    Tutup Jendela
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
