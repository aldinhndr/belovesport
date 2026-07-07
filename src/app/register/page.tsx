'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Smartphone, ArrowRight, Loader2, MapPin, User, Gamepad2,
    CheckCircle2, Ticket, ShieldCheck, Upload, Instagram,
    Users, MonitorSmartphone, Image as ImageIcon, QrCode, Building,
    AlertCircle, Check
} from 'lucide-react'
import Link from 'next/link'

type Step = 'DETAILS' | 'PAYMENT' | 'SUCCESS'

const STEPS: { id: Step; label: string }[] = [
    { id: 'DETAILS', label: 'Profil Tim' },
    { id: 'PAYMENT', label: 'Pembayaran' },
    { id: 'SUCCESS', label: 'Selesai' },
]

const MAX_FILE_SIZE_MB = 5
const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

function validateImageFile(file: File): string | null {
    if (!ACCEPTED_TYPES.includes(file.type)) {
        return 'Format file harus JPG, PNG, atau WEBP.'
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        return `Ukuran file maksimal ${MAX_FILE_SIZE_MB}MB.`
    }
    return null
}

function StepIndicator({ currentStep }: { currentStep: Step }) {
    const currentIndex = STEPS.findIndex((s) => s.id === currentStep)
    return (
        <div className="flex items-center gap-2 mb-8" aria-label="Progres pendaftaran">
            {STEPS.map((step, i) => {
                const isDone = i < currentIndex
                const isActive = i === currentIndex
                return (
                    <div key={step.id} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center gap-1.5">
                            <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-jetbrains shrink-0 transition-colors ${isDone
                                    ? 'bg-brand-gold text-brand-bg-dark'
                                    : isActive
                                        ? 'bg-brand-gold/15 border-2 border-brand-gold text-brand-gold'
                                        : 'bg-brand-bg-dark border border-brand-secondary/50 text-brand-gold/80'
                                    }`}
                                aria-current={isActive ? 'step' : undefined}
                            >
                                {isDone ? <Check size={14} /> : i + 1}
                            </div>
                            <span
                                className={`text-[10px] font-bold uppercase tracking-wide whitespace-nowrap hidden sm:block ${isActive ? 'text-brand-white' : 'text-brand-gold/80'
                                    }`}
                            >
                                {step.label}
                            </span>
                        </div>
                        {i < STEPS.length - 1 && (
                            <div
                                className={`h-px flex-1 mx-2 transition-colors ${isDone ? 'bg-brand-gold' : 'bg-brand-secondary/40'
                                    }`}
                                aria-hidden
                            />
                        )}
                    </div>
                )
            })}
        </div>
    )
}

function ErrorAlert({ message }: { message: string }) {
    return (
        <div
            role="alert"
            className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/25 text-red-400 text-sm rounded-xl px-4 py-3"
        >
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{message}</span>
        </div>
    )
}

function FileUploadField({
    label,
    icon: Icon,
    preview,
    fileName,
    onFileSelected,
    stepLabel,
}: {
    label: string
    icon: React.ElementType
    preview: string | null
    fileName?: string
    onFileSelected: (file: File) => void
    stepLabel?: string
}) {
    const [fileError, setFileError] = useState<string | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const issue = validateImageFile(file)
        if (issue) {
            setFileError(issue)
            if (inputRef.current) inputRef.current.value = ''
            return
        }
        setFileError(null)
        onFileSelected(file)
    }

    return (
        <div className="space-y-2">
            <label className="text-xs font-bold tracking-wider uppercase text-brand-gold-300 font-jetbrains flex items-center gap-2">
                <Icon size={12} className="text-brand-gold" /> {stepLabel ? `${stepLabel}: ` : ''}{label}
            </label>
            <div
                className={`relative border border-dashed rounded-xl p-4 transition-all bg-brand-bg-dark/50 flex flex-col items-center justify-center min-h-[100px] cursor-pointer ${fileError ? 'border-red-500/50' : 'border-brand-secondary hover:border-brand-gold/50'
                    }`}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept={ACCEPTED_TYPES.join(',')}
                    onChange={handleChange}
                    aria-label={label}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                {preview ? (
                    <div className="flex items-center gap-3 w-full">
                        <img src={preview} alt={`Preview ${label}`} className="w-14 h-14 object-cover rounded-lg border border-brand-secondary" />
                        <div className="flex flex-col min-w-0">
                            <span className="text-xs text-brand-gold font-bold font-sans truncate max-w-[200px]">{fileName}</span>
                            <span className="text-[10px] text-brand-gold-400">Klik untuk mengganti gambar</span>
                        </div>
                    </div>
                ) : (
                    <>
                        <Upload size={24} className="text-brand-gold/50 mb-2" />
                        <span className="text-xs text-brand-gold-400 text-center font-sans">Sentuh atau pilih file gambar (maks. {MAX_FILE_SIZE_MB}MB)</span>
                    </>
                )}
            </div>
            {fileError && (
                <p className="text-xs text-red-400 flex items-center gap-1.5">
                    <AlertCircle size={12} className="shrink-0" /> {fileError}
                </p>
            )}
        </div>
    )
}

export default function RegisterPage() {
    const [selectedMethod, setSelectedMethod] = useState<string>('')
    const [currentStep, setCurrentStep] = useState<Step>('DETAILS')
    const [loading, setLoading] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)
    const [showLockAlert, setShowLockAlert] = useState(false);

    // ── Data CRM & Profil eFootball ──
    const [fullName, setFullName] = useState('')
    const [whatsappNumber, setWhatsappNumber] = useState('')
    const [teamName, setTeamName] = useState('')
    const [eFootballId, setEFootballId] = useState('')
    const [domisili, setDomisili] = useState('')
    const [device, setDevice] = useState('')
    const [instagramHandle, setInstagramHandle] = useState('')

    // ── Data File Upload (Bukti Transfer / Profil) ──
    const [screenshotFile, setScreenshotFile] = useState<File | null>(null)
    const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null)
    const [generatedVoucher, setGeneratedVoucher] = useState('')

    const handleFileChange = (file: File) => {
        setScreenshotFile(file)
        const reader = new FileReader()
        reader.onloadend = () => {
            setScreenshotPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
    }

    const handleDetailsSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setServerError(null)

        if (!fullName || !whatsappNumber || !teamName || !eFootballId || !domisili || !device || !instagramHandle || !screenshotFile) {
            setServerError('Mohon lengkapi semua data dan unggah screenshot profil eFootball Anda.')
            return
        }

        setScreenshotFile(null)
        setScreenshotPreview(null)
        setCurrentStep('PAYMENT')
    }

    const handleManualPaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedMethod || !screenshotPreview) {
            setServerError('Silakan pilih metode pembayaran dan unggah bukti transfer valid Anda.')
            return
        }

        setLoading(true)
        setServerError(null)

        try {
            const payloadData = {
                fullName,
                whatsappNumber,
                teamName,
                eFootballId,
                domisili,
                device,
                instagramHandle,
                paymentMethod: selectedMethod,
                screenshotBase64: screenshotPreview
            }

            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payloadData),
            })

            const data = await response.json()
            if (!response.ok) throw new Error(data.error || 'Gagal mengirim data pendaftaran manual.')

            setGeneratedVoucher(data.voucherCode)
            setCurrentStep('SUCCESS')
        } catch (err: any) {
            setServerError(err.message ?? 'Terjadi kesalahan tak terduga. Silakan coba lagi.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-brand-bg-dark flex items-center justify-center p-4 sm:p-8 relative overflow-hidden text-brand-white">
            {/* ── Background Ambient ── */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-secondary/[0.15] blur-[150px] rounded-full pointer-events-none" aria-hidden />
            <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-brand-gold/[0.06] blur-[120px] rounded-full pointer-events-none" aria-hidden />

            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 relative z-10">

                {/* ── Kolom Kiri: Informasi Turnamen ── */}
                <div className="hidden lg:flex flex-col justify-center space-y-8 pr-8">
                    <div>
                        <Link href="/profil" className="inline-block text-2xl font-black tracking-tighter uppercase mb-8 hover:opacity-80 transition-opacity text-brand-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60 rounded">
                            BELOVE<span className="text-brand-gold">s</span>PORT
                        </Link>
                        <h1 className="text-4xl xl:text-5xl font-black uppercase tracking-tight leading-[1.1] mb-6">
                            Jalan Menuju <br />
                            <span className="bg-gradient-to-r from-brand-gold to-brand-bronze bg-clip-text text-transparent">Supremasi 2026</span>
                        </h1>
                        <p className="text-brand-gold-300 text-lg leading-relaxed mb-8">
                            Pendaftaran turnamen eFootball Mobile Nasional resmi dibuka. Amankan bracket Anda dan klaim voucher eksklusif Belovecorp sekarang.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-brand-bg-surface border border-brand-secondary/40 shadow-lg">
                            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-brand-white uppercase text-sm tracking-wide">Validasi Manual Aman</h4>
                                <p className="text-xs text-brand-gold-300 mt-1">Tim admin melakukan pengecekan real-time 1x24 jam untuk menjamin keaslian slot pendaftar.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-brand-bg-surface border border-brand-secondary/40 shadow-lg">
                            <Ticket className="w-6 h-6 text-brand-gold shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-brand-white uppercase text-sm tracking-wide">Voucher Otomatis</h4>
                                <p className="text-xs text-brand-gold-300 mt-1">Sistem menerbitkan voucher senilai Rp 50.000 pasca verifikasi pembayaran.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Kolom Kanan: Form Multi-Step ── */}
                <div className="bg-brand-bg-surface border border-brand-secondary/50 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-black/50 relative overflow-hidden w-full max-w-md mx-auto lg:mx-0">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-secondary via-brand-gold to-brand-bronze" />

                    {/* Mobile-only brand mark, since the left column is hidden below lg */}
                    <Link href="/profil" className="lg:hidden inline-block text-lg font-black tracking-tighter uppercase mb-6 hover:opacity-80 transition-opacity text-brand-white">
                        BELOVE<span className="text-brand-gold">s</span>PORT
                    </Link>

                    <StepIndicator currentStep={currentStep} />

                    <AnimatePresence mode="wait">
                        {/* ── STEP 1: DETAILS ── */}
                        {currentStep === 'DETAILS' && (
                            <motion.div key="step-3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                <div>
                                    <h3 className="text-2xl font-black text-brand-white uppercase tracking-tight">Profil eFootball</h3>
                                    <p className="text-sm text-brand-gold-300 mt-1">Lengkapi data tim dan identitas Anda secara valid.</p>
                                </div>
                                <form onSubmit={handleDetailsSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar pb-4" noValidate>

                                    <div className="space-y-1.5">
                                        <label htmlFor="fullName" className="text-xs font-bold tracking-wider uppercase text-brand-gold-300 font-jetbrains flex items-center gap-2">
                                            <User size={12} className="text-brand-gold" /> Nama Lengkap
                                        </label>
                                        <input id="fullName" required type="text" autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Sesuai Identitas Asli" className="w-full bg-brand-bg-dark border border-brand-secondary/60 rounded-lg px-4 py-3 text-sm text-brand-white placeholder:text-brand-gold-500 focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold transition" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <label htmlFor="teamName" className="text-xs font-bold tracking-wider uppercase text-brand-gold-300 font-jetbrains flex items-center gap-2">
                                                <Users size={12} className="text-brand-gold" /> Nama Team
                                            </label>
                                            <input id="teamName" required type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="In-Game Team" className="w-full bg-brand-bg-dark border border-brand-secondary/60 rounded-lg px-4 py-3 text-sm text-brand-white placeholder:text-brand-gold-500 focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold transition" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label htmlFor="efootballId" className="text-xs font-bold tracking-wider uppercase text-brand-gold-300 font-jetbrains flex items-center gap-2">
                                                <Gamepad2 size={12} className="text-brand-gold" /> eFootball ID
                                            </label>
                                            <input id="efootballId" required type="text" value={eFootballId} onChange={(e) => setEFootballId(e.target.value)} placeholder="XXX-XXX-XXX" className="w-full bg-brand-bg-dark border border-brand-secondary/60 rounded-lg px-4 py-3 text-sm text-brand-white placeholder:text-brand-gold-500 focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold transition font-jetbrains" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <label htmlFor="domisili" className="text-xs font-bold tracking-wider uppercase text-brand-gold-300 font-jetbrains flex items-center gap-2">
                                                <MapPin size={12} className="text-brand-gold" /> Domisili
                                            </label>
                                            <input id="domisili" required type="text" value={domisili} onChange={(e) => setDomisili(e.target.value)} placeholder="Kota/Kabupaten" className="w-full bg-brand-bg-dark border border-brand-secondary/60 rounded-lg px-4 py-3 text-sm text-brand-white placeholder:text-brand-gold-500 focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold transition" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label htmlFor="whatsapp" className="text-xs font-bold tracking-wider uppercase text-brand-gold-300 font-jetbrains flex items-center gap-2">
                                                <Smartphone size={12} className="text-brand-gold" /> Nomor WA Aktif
                                            </label>
                                            <input id="whatsapp" required type="tel" inputMode="numeric" autoComplete="tel" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value.replace(/\D/g, ''))} placeholder="08XXXXXXXXX" className="w-full bg-brand-bg-dark border border-brand-secondary/60 rounded-lg px-4 py-3 text-sm text-brand-white placeholder:text-brand-gold-500 focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold transition" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <label htmlFor="device" className="text-xs font-bold tracking-wider uppercase text-brand-gold-300 font-jetbrains flex items-center gap-2">
                                                <MonitorSmartphone size={12} className="text-brand-gold" /> Perangkat
                                            </label>
                                            <input id="device" required type="text" value={device} onChange={(e) => setDevice(e.target.value)} placeholder="Android / iOS" className="w-full bg-brand-bg-dark border border-brand-secondary/60 rounded-lg px-4 py-3 text-sm text-brand-white placeholder:text-brand-gold-500 focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold transition" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label htmlFor="instagram" className="text-xs font-bold tracking-wider uppercase text-brand-gold-300 font-jetbrains flex items-center gap-2">
                                                <Instagram size={12} className="text-brand-gold" /> Nama IG
                                            </label>
                                            <input id="instagram" required type="text" value={instagramHandle} onChange={(e) => setInstagramHandle(e.target.value)} placeholder="@username" className="w-full bg-brand-bg-dark border border-brand-secondary/60 rounded-lg px-4 py-3 text-sm text-brand-white placeholder:text-brand-gold-500 focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold transition" />
                                        </div>
                                    </div>

                                    <FileUploadField
                                        label="Upload Screenshot Profil"
                                        icon={ImageIcon}
                                        preview={screenshotPreview}
                                        fileName={screenshotFile?.name}
                                        onFileSelected={handleFileChange}
                                    />

                                    {serverError && <ErrorAlert message={serverError} />}

                                    <button type="submit" className="w-full bg-brand-gold text-brand-bg-dark font-bold text-sm py-3.5 rounded-lg hover:brightness-105 active:brightness-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 shadow-lg shadow-brand-gold/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg-surface">
                                        <span>Lanjut ke Pembayaran</span><ArrowRight size={16} />
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {/* ── STEP 2: PAYMENT ── */}
                        {currentStep === 'PAYMENT' && (
                            <motion.div key="step-4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                <div className="text-center">
                                    <span className="text-[10px] font-bold font-jetbrains tracking-widest bg-brand-gold/10 border border-brand-gold/20 text-brand-gold px-3 py-1 rounded-full uppercase mb-2 inline-block">Metode Pembayaran</span>
                                    <h3 className="text-2xl font-black text-brand-white uppercase tracking-tight">Pilih Jalur Bayar</h3>
                                    <p className="text-xs text-brand-gold-300 mt-1">Biaya Pendaftaran Slot: <span className="text-brand-gold font-bold text-sm">Rp 25.000</span></p>
                                </div>

                                <form onSubmit={handleManualPaymentSubmit} className="space-y-5 max-h-[68vh] overflow-y-auto pr-1 custom-scrollbar pb-2" noValidate>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black tracking-wider uppercase text-brand-gold-300 font-jetbrains block">Langkah 1: Pilih Tipe Bayar</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedMethod('QRIS')
                                                    setServerError(null)
                                                }}
                                                aria-pressed={selectedMethod === 'QRIS'}
                                                className={`p-3.5 rounded-xl border text-center font-jetbrains transition-all flex flex-col items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50 ${selectedMethod === 'QRIS'
                                                    ? 'border-brand-gold bg-brand-gold/10 text-brand-gold shadow-md shadow-brand-gold/10'
                                                    : 'border-brand-secondary/50 bg-brand-bg-dark hover:border-brand-secondary text-brand-gold-300'
                                                    }`}
                                            >
                                                <QrCode size={20} className={selectedMethod === 'QRIS' ? 'text-brand-gold' : 'text-brand-gold-300'} />
                                                <span className="text-xs font-black">Scan QRIS</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedMethod('TRANSFER_DIRECT')
                                                    setScreenshotFile(null)
                                                    setScreenshotPreview(null)
                                                    setServerError(null)
                                                }}
                                                aria-pressed={!!selectedMethod && selectedMethod !== 'QRIS'}
                                                className={`p-3.5 rounded-xl border text-center font-jetbrains transition-all flex flex-col items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50 ${selectedMethod && selectedMethod !== 'QRIS'
                                                    ? 'border-brand-gold bg-brand-gold/10 text-brand-gold shadow-md shadow-brand-gold/10'
                                                    : 'border-brand-secondary/50 bg-brand-bg-dark hover:border-brand-secondary text-brand-gold-300'
                                                    }`}
                                            >
                                                <Building size={20} className={selectedMethod && selectedMethod !== 'QRIS' ? 'text-brand-gold' : 'text-brand-gold-300'} />
                                                <span className="text-xs font-black">Transfer Manual</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* ── SUB-STEP 2: AKSI BAYAR DINAMIS (PINDAI QRIS) ── */}
                                    {selectedMethod === 'QRIS' && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                                            <label className="text-[10px] font-black tracking-wider uppercase text-brand-gold-300 font-jetbrains block">Langkah 2: Pindai Barcode QRIS</label>
                                            <div className="p-4 rounded-2xl bg-white text-black text-center space-y-3 relative overflow-hidden shadow-xl max-w-[240px] mx-auto border-4 border-brand-primary">
                                                <div className="flex justify-center pt-1">
                                                    <img src="/img/QRIS_Logo.svg" alt="Logo QRIS Resmi" className="h-5 w-auto object-contain" onError={(e) => { (e.target as HTMLElement).style.display = 'none' }} />
                                                </div>
                                                <div className="w-full aspect-square bg-slate-100 rounded-xl flex items-center justify-center p-2 border border-gray-200">
                                                    <img src="/img/QRIS.jpg" alt="QRIS Pendaftaran" className="w-full h-full object-contain" onError={(e) => {
                                                        (e.target as HTMLElement).style.display = 'none'
                                                    }} />
                                                </div>
                                                <p className="text-[9px] text-brand-gold-300 font-medium leading-tight">Pindai kode QR di atas via aplikasi pembayaran apa saja.</p>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* ── SUB-STEP 2: PILIH BRAND BANK ── */}
                                    {selectedMethod && selectedMethod !== 'QRIS' && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                                            <label className="text-[10px] font-black tracking-wider uppercase text-brand-gold-400 font-jetbrains block">Langkah 2: Pilih Brand Bank / E-Wallet</label>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-brand-bg-dark border border-brand-secondary/40 p-3 rounded-2xl">
                                                {[
                                                    { id: 'BRI', name: 'BANK BRI', activeClass: 'border-[#00529C] bg-[#00529C]/10 text-[#00529C]' },
                                                    { id: 'SEABANK', name: 'SEABANK', activeClass: 'border-[#FF5722] bg-[#FF5722]/10 text-[#FF5722]' },
                                                    { id: 'DANA', name: 'DANA', activeClass: 'border-[#118EEA] bg-[#118EEA]/10 text-[#118EEA]' },
                                                    { id: 'GOPAY', name: 'GOPAY', activeClass: 'border-[#00AED6] bg-[#00AED6]/10 text-[#00AED6]' },
                                                    { id: 'OVO', name: 'OVO', activeClass: 'border-[#4C2A86] bg-[#4C2A86]/10 text-[#4C2A86]' },
                                                    { id: 'SPAY', name: 'SHOPEEPAY', activeClass: 'border-[#EE4D2D] bg-[#EE4D2D]/10 text-[#EE4D2D]' }
                                                ].map((subMethod) => {
                                                    const isCurrent = selectedMethod === subMethod.id
                                                    return (
                                                        <button
                                                            key={subMethod.id}
                                                            type="button"
                                                            onClick={() => setSelectedMethod(subMethod.id)}
                                                            aria-pressed={isCurrent}
                                                            className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2 min-h-[82px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50 ${isCurrent
                                                                ? subMethod.activeClass + ' shadow-lg scale-[1.02]'
                                                                : 'border-brand-secondary/30 bg-brand-bg-surface hover:border-brand-secondary text-brand-gold-500'
                                                                }`}
                                                        >
                                                            <img
                                                                src={`/logos/${subMethod.id.toLowerCase()}.png`}
                                                                alt={subMethod.name}
                                                                className={`h-6 w-auto object-contain max-w-[70px] transition-all duration-200 ${isCurrent ? 'brightness-110' : 'opacity-50 grayscale hover:grayscale-0 hover:opacity-100'
                                                                    }`}
                                                                onError={(e) => { (e.target as HTMLElement).style.display = 'none' }}
                                                            />
                                                            <span className={`text-[9px] font-black font-jetbrains tracking-tight uppercase ${isCurrent ? 'text-brand-white' : 'text-brand-gold-300'
                                                                }`}>
                                                                {subMethod.name}
                                                            </span>
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Tampilan Output Detail Rekening */}
                                    {selectedMethod && !['QRIS', 'TRANSFER_DIRECT'].includes(selectedMethod) && (
                                        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="p-4 rounded-xl bg-brand-bg-dark border border-brand-secondary/50 space-y-1 font-jetbrains relative overflow-hidden shadow-inner">
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-[0.03] font-black text-4xl select-none tracking-tighter text-brand-white">
                                                {selectedMethod}
                                            </div>
                                            <p className="text-[9px] text-brand-gold-300 uppercase tracking-wider">Salin Nomor Rekening Tujuan</p>
                                            <p className="text-lg font-bold text-brand-gold tracking-wider select-all">
                                                {selectedMethod === 'BRI' && '0176-0103-7457-536'}
                                                {selectedMethod === 'SEABANK' && 'Segera Tersedia:)'}
                                                {['DANA', 'GOPAY', 'OVO', 'SPAY'].includes(selectedMethod) && '082225700427'}
                                            </p>
                                            <p className="text-[11px] text-brand-gold-300 font-medium">a.n. Aldin Handrian Halawa</p>
                                        </motion.div>
                                    )}

                                    {/* ── SUB-STEP 3: UPLOAD BUKTI TRANSFER ── */}
                                    {selectedMethod && selectedMethod !== 'TRANSFER_DIRECT' && (
                                        <FileUploadField
                                            label="Unggah Bukti Resi Sukses"
                                            icon={ImageIcon}
                                            preview={screenshotPreview}
                                            fileName={screenshotFile?.name}
                                            onFileSelected={handleFileChange}
                                            stepLabel="Langkah 3"
                                        />
                                    )}

                                    {serverError && <ErrorAlert message={serverError} />}

                                    {/* Tombol Kirim Form */}
                                    <button
                                        type="submit"
                                        disabled={loading || !selectedMethod || selectedMethod === 'TRANSFER_DIRECT' || !screenshotPreview}
                                        className="w-full bg-brand-gold text-brand-bg-dark font-bold text-sm py-3.5 rounded-lg hover:brightness-105 active:brightness-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-brand-gold/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg-surface"
                                    >
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Kirim Data Registrasi</span>}
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {/* ── STEP 3: SUCCESS ── */}
                        {currentStep === 'SUCCESS' && (
                            <motion.div
                                key="step-5"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center space-y-6 py-2"
                            >
                                {/* Ikon Sukses */}
                                <div className="mx-auto w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mb-2">
                                    <CheckCircle2 size={24} className="text-emerald-400" />
                                </div>

                                {/* Judul & Deskripsi */}
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black text-brand-white uppercase tracking-tight">Pendaftaran Dikirim!</h3>
                                    <p className="text-xs text-brand-gold-300">
                                        Admin akan memvalidasi pendaftaran Anda dalam 1x24 jam. Pastikan Nomor WA yang anda input Aktif.
                                    </p>
                                </div>

                                {/* Navigasi Kembali ke Profil (Dikunci Sementara hingga 10 Juli) */}
                                <div className="w-full max-w-xl mx-auto mt-2 space-y-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowLockAlert(!showLockAlert)}
                                        className="block w-full px-8 py-3.5 bg-brand-bg-dark border border-brand-secondary text-xs font-bold text-brand-white rounded-lg hover:bg-brand-secondary/50 transition-all cursor-pointer font-mono text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60"
                                    >
                                        Lihat Profil Anda
                                    </button>

                                    {/* ── BANNER NOTIFIKASI PENGUNCIAN PREMIUM ── */}
                                    {showLockAlert && (
                                        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="flex items-start gap-3 text-left">
                                                <div className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-1.5 shrink-0 animate-pulse" />
                                                <div className="space-y-3 w-full">
                                                    <div className="space-y-1">
                                                        <p className="text-xs font-black uppercase tracking-wider font-mono text-brand-gold">
                                                            Akses Profil Ditangguhkan Sementara
                                                        </p>
                                                        <p className="text-[11px] font-medium leading-relaxed text-zinc-400 dark:text-zinc-500">
                                                            Halaman profil baru bisa diakses mulai tanggal <strong>10 Juli 2026</strong> saat gerbang turnamen dibuka. Detail kredensial akun login Anda akan dikirimkan otomatis ke nomor WhatsApp pribadi Anda.
                                                        </p>
                                                    </div>

                                                    {/* 🌐 TOMBOL KEMBALI KE LANDING PAGE */}
                                                    <div className="pt-1">
                                                        <Link
                                                            href="/"
                                                            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[11px] font-bold text-zinc-700 dark:text-zinc-300 hover:text-brand-primary hover:border-brand-primary/40 transition-all shadow-sm"
                                                        >
                                                            Kembali ke Landing Page
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </main>
    )
}