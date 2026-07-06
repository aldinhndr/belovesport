'use client'

/**
 * RegistrationModal — Multi-Step Tournament Lifecycle Edition (P-01 to her P-05)
 * =========================================================================
 * Integrated Multi-Step form handling user creation, verification, 
 * tournament data registration, and payment simulation with receipt upload.
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Smartphone, Mail, QrCode, Upload, CheckCircle2, Ticket, ArrowRight, Loader2, Award } from 'lucide-react'

interface RegistrationModalProps {
  isOpen: boolean
  onClose: () => void
}

type Step = 'AUTH' | 'VERIFY' | 'DETAILS' | 'PAYMENT' | 'SUCCESS'

export function RegistrationModal({ isOpen, onClose }: RegistrationModalProps): React.JSX.Element | null {
  const [currentStep, setCurrentStep] = useState<Step>('AUTH')
  const [loading, setLoading] = useState(false)

  // Form State Definitions
  const [authMethod, setAuthMethod] = useState<'EMAIL' | 'WA'>('EMAIL')
  const [authIdentifier, setAuthIdentifier] = useState('')
  const [otp, setOtp] = useState('')

  const [fullName, setFullName] = useState('')
  const [eFootballId, setEFootballId] = useState('')
  const [selectedProvince, setSelectedProvince] = useState('')

  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null)
  const [generatedVoucher, setGeneratedVoucher] = useState('')

  // Reset steps on close
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep('AUTH')
      setAuthIdentifier('')
      setOtp('')
      setFullName('')
      setEFootballId('')
      setSelectedProvince('')
      setReceiptFile(null)
      setReceiptPreview(null)
    }
  }, [isOpen])

  if (!isOpen) return null

  // Action Handlers
  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault()
    if (!authIdentifier) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setCurrentStep('VERIFY') // P-01: Verifikasi OTP Lifecycle Trigger
    }, 1200)
  }

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length < 4) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setCurrentStep('DETAILS') // P-02: Auth Verified -> Move to Registration Form
    }, 1000)
  }

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName || !eFootballId || !selectedProvince) return
    setCurrentStep('PAYMENT') // Move to P-04/P-05 Gateway Interface
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setReceiptFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFinalSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: authMethod === 'EMAIL' ? authIdentifier : `${eFootballId}@belovesport.id`,
          fullName,
          eFootballId,
        }),
      })
      const data = await response.json()
      if (data.success) {
        setGeneratedVoucher(data.voucherCode || 'BEL-PROMAX26')
        setCurrentStep('SUCCESS') // P-09: Voucher Otomatis Generation Step
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop glass blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Sheet Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
          className="relative w-full max-w-md bg-[#141416] border border-white/10 rounded-3xl overflow-hidden shadow-2xl z-10"
        >
          {/* Top Frame Glow Highlight */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#FF2E8A] via-[#FF9A00] to-[#FFC537]" />

          {/* Close button frame */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors p-2 rounded-lg bg-white/5 border border-white/5 cursor-pointer z-20"
          >
            <X size={18} />
          </button>

          <div className="p-6 sm:p-8">
            {/* ── STEP 1: AUTHENTICATION SOURCE (P-01 / P-02) ── */}
            {currentStep === 'AUTH' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">Registrasi Akun</h3>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">Langkah awal masuk ke ekosistem turnamen nasional.</p>
                </div>

                <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                  <button
                    type="button"
                    onClick={() => { setAuthMethod('EMAIL'); setAuthIdentifier('') }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${authMethod === 'EMAIL' ? 'bg-gradient-to-r from-[#FF2E8A] to-[#FF9A00] text-white shadow-md' : 'text-gray-400'}`}
                  >
                    <Mail size={14} /> Email
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAuthMethod('WA'); setAuthIdentifier('') }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${authMethod === 'WA' ? 'bg-gradient-to-r from-[#FF2E8A] to-[#FF9A00] text-white shadow-md' : 'text-gray-400'}`}
                  >
                    <Smartphone size={14} /> WhatsApp
                  </button>
                </div>

                <form onSubmit={handleRequestOtp} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black tracking-wider uppercase text-gray-400 font-jetbrains">
                      {authMethod === 'EMAIL' ? 'Alamat Email Resmi' : 'Nomor WhatsApp Aktif'}
                    </label>
                    <input
                      required
                      type={authMethod === 'EMAIL' ? 'email' : 'tel'}
                      placeholder={authMethod === 'EMAIL' ? 'koko@example.com' : '0812XXXXXXXX'}
                      value={authIdentifier}
                      onChange={(e) => setAuthIdentifier(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#FF2E8A]/50 font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-white text-black font-extrabold text-sm py-4 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>KIRIM KODE OTP</span><ArrowRight size={16} /></>}
                  </button>
                </form>
              </motion.div>
            )}

            {/* ── STEP 2: OTP VERIFICATION LOCK (P-01 / P-02) ── */}
            {currentStep === 'VERIFY' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">Verifikasi Keamanan</h3>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">Masukkan kode OTP yang dikirimkan ke <span className="text-white font-semibold">{authIdentifier}</span>.</p>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black tracking-wider uppercase text-gray-400 font-jetbrains text-center block">Kode OTP 4-Digit</label>
                    <input
                      required
                      type="text"
                      maxLength={4}
                      placeholder="0000"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      className="w-32 mx-auto block bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-center text-xl font-black tracking-[0.4em] text-white focus:outline-none focus:border-[#FF9A00]/50 font-jetbrains"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.length < 4}
                    className="w-full bg-gradient-to-r from-[#FF2E8A] to-[#FF9A00] text-white font-extrabold text-sm py-4 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>VERIFIKASI & LANJUT</span>}
                  </button>
                </form>
              </motion.div>
            )}

            {/* ── STEP 3: TOURNAMENT METADATA REGISTRATION (P-03) ── */}
            {currentStep === 'DETAILS' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">Form Pendaftaran</h3>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">Isi data akun eFootball kompetitif Koko dengan valid.</p>
                </div>

                <form onSubmit={handleDetailsSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold tracking-wider uppercase text-gray-400 font-jetbrains">Nama Lengkap Sesuai ID</label>
                    <input
                      required
                      type="text"
                      placeholder="Aldin Handrian"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF2E8A]/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold tracking-wider uppercase text-gray-400 font-jetbrains">eFootball Mobile ID</label>
                    <input
                      required
                      type="text"
                      placeholder="XXX-XXX-XXX"
                      value={eFootballId}
                      onChange={(e) => setEFootballId(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF9A00]/50 font-jetbrains"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold tracking-wider uppercase text-gray-400 font-jetbrains">Provinsi Domisili</label>
                    <input
                      required
                      type="text"
                      placeholder="Lampung"
                      value={selectedProvince}
                      onChange={(e) => setSelectedProvince(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FFC537]/50"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-white text-black font-extrabold text-sm py-4 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 cursor-pointer mt-4"
                  >
                    <span>MENUJU PEMBAYARAN</span>
                    <ArrowRight size={16} />
                  </button>
                </form>
              </motion.div>
            )}

            {/* ── STEP 4: ONLINE GATEWAY & RECEIPT UPLOAD (P-04 / P-05) ── */}
            {currentStep === 'PAYMENT' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <div className="text-center">
                  <span className="text-[10px] font-bold font-jetbrains tracking-widest bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full uppercase">Biaya Pendaftaran: Rp 25.000</span>
                  <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mt-3">Metode Pembayaran</h3>
                </div>

                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col items-center justify-center space-y-3">
                  <div className="bg-white p-3 rounded-xl shadow-xl">
                    <QrCode size={130} className="text-black" />
                  </div>
                  <p className="text-[11px] text-gray-400 font-jetbrains tracking-wider uppercase text-center">PINDAI QRIS DI ATAS MENGGUNAKAN E-WALLET ATAU BANKING</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-wider uppercase text-gray-400 font-jetbrains block">Upload Bukti Transfer (Verifikasi Manual V1)</label>
                  <div className="relative border border-dashed border-white/20 hover:border-[#FF9A00]/50 rounded-xl p-4 transition-all bg-white/[0.01] flex flex-col items-center justify-center min-h-[90px] cursor-pointer">
                    <input
                      required
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    {receiptPreview ? (
                      <div className="flex items-center gap-3 w-full">
                        <img src={receiptPreview} alt="Preview Bukti" className="w-12 h-12 object-cover rounded-lg border border-white/10" />
                        <span className="text-xs text-emerald-400 font-bold font-sans truncate">{receiptFile?.name}</span>
                      </div>
                    ) : (
                      <>
                        <Upload size={20} className="text-gray-500 mb-1" />
                        <span className="text-xs text-gray-400 text-center font-sans">Pilih / Seret screenshot bukti pembayaran Koko</span>
                      </>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={loading || !receiptFile}
                  onClick={handleFinalSubmit}
                  className="w-full bg-gradient-to-r from-[#FF2E8A] via-[#FF9A00] to-[#FFC537] text-white font-extrabold text-sm py-4 rounded-xl hover:opacity-95 transition-opacity flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>SUBMIT & KLIK VERIFIKASI</span>}
                </button>
              </motion.div>
            )}

            {/* ── STEP 5: AUTOMATED VOUCHER SYSTEM ARRIVAL (P-09) ── */}
            {currentStep === 'SUCCESS' && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6 py-4">
                <div className="mx-auto w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={32} className="text-emerald-400" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">Pendaftaran Sukses!</h3>
                  <p className="text-xs sm:text-sm text-gray-400 max-w-sm mx-auto font-sans leading-relaxed">
                    Data dan bukti bayar Anda berhasil masuk antrean verifikasi manual. Sesuai jaminan turnamen, berikut kode voucher instan Koko:
                  </p>
                </div>

                {/* Voucher Ticket UI Display Box */}
                <div className="relative bg-gradient-to-r from-[#FF2E8A]/10 to-[#FF9A00]/10 border border-dashed border-[#FF9A00]/30 rounded-2xl p-5 overflow-hidden group shadow-inner">
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#FF9A00]/40 to-transparent" />
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#141416] rounded-full border-r border-white/10" />
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#141416] rounded-full border-l border-white/10" />

                  <span className="text-[10px] font-black uppercase font-jetbrains tracking-[0.2em] text-[#FFC537] block mb-1.5">BELOVECORP EXCLUSIVE VOUCHER</span>
                  <div className="flex items-center justify-center gap-2 text-xl sm:text-2xl font-black tracking-wider text-white font-jetbrains uppercase select-all">
                    <Award className="w-5 h-5 text-[#FF2E8A] shrink-0" />
                    {generatedVoucher}
                  </div>
                  <span className="text-[11px] text-gray-500 block mt-2 font-sans">Diskon Rp 50.000 Terbuka Otomatis setelah Verifikasi Selesai.</span>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-3 bg-white/5 border border-white/10 text-xs font-bold text-gray-300 rounded-xl hover:text-white hover:bg-white/10 transition-all cursor-pointer font-jetbrains"
                >
                  SELESAI & KEMBALI KEPADA DASHBOARD
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}