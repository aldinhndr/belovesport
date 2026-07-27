// Path: src/app/register/page.tsx
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

// 🛡️ HELPER: Kompresi Gambar Otomatis di Browser (Mencegah Payload Limit Vercel)
const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 1024; // Lebar maks 1024px
                const scale = MAX_WIDTH / img.width;

                canvas.width = scale < 1 ? MAX_WIDTH : img.width;
                canvas.height = scale < 1 ? img.height * scale : img.height;

                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

                // Kompresi JPEG dengan kualitas 0.75
                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.75);
                resolve(compressedBase64);
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
};

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

    // Form inputs
    const [fullName, setFullName] = useState('')
    const [whatsappNumber, setWhatsappNumber] = useState('')
    const [teamName, setTeamName] = useState('')
    const [eFootballId, setEFootballId] = useState('')
    const [domisili, setDomisili] = useState('')
    const [device, setDevice] = useState('')
    const [instagramHandle, setInstagramHandle] = useState('')

    // Upload Files
    const [screenshotFile, setScreenshotFile] = useState<File | null>(null)
    const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null)

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
            setServerError('Mohon lengkapi semua data dan unggah foto profil / screenshot terlebih dahulu.')
            return
        }

        setCurrentStep('PAYMENT')
    }

    const handleManualPaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedMethod || !screenshotFile) {
            setServerError('Silakan pilih metode pembayaran dan unggah bukti transfer valid Anda.')
            return
        }

        setLoading(true)
        setServerError(null)

        try {
            // Kompresi foto sebelum dikirim
            const compressedProofBase64 = await compressImage(screenshotFile)

            // 🎯 Payload JSON yang 100% cocok dengan nama field schema.prisma & API
            const payloadData = {
                leaderName: fullName,
                whatsappNumber,
                teamName,
                efootballId: eFootballId, // Sesuai efootballId
                domisili,
                device,
                instagramHandle,
                paymentMethod: selectedMethod,
                paymentProofUrl: compressedProofBase64, // Sesuai paymentProofUrl
            }

            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payloadData),
            })

            const data = await response.json()
            if (!response.ok) {
                throw new Error(data.message || 'Gagal mengirim data pendaftaran team.')
            }

            setCurrentStep('SUCCESS')
        } catch (err: any) {
            setServerError(err.message ?? 'Terjadi kesalahan tak terduga.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-brand-bg-dark flex items-center justify-center p-4 sm:p-8 relative overflow-hidden text-brand-white">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-secondary/[0.15] blur-[150px] rounded-full pointer-events-none" aria-hidden />
            <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-brand-gold/[0.06] blur-[120px] rounded-full pointer-events-none" aria-hidden />

            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 relative z-10">

                {/* Kolom Kiri: Info Turnamen */}
                <div className="hidden lg:flex flex-col justify-center space-y-8 pr-8">
                    <div>
                        <Link href="/profil" className="inline-block text-2xl font-black tracking-tighter uppercase mb-8 hover:opacity-80 transition-opacity text-brand-white">
                            BELOVE<span className="text-brand-gold">s</span>PORT
                        </Link>
                        <h1 className="text-4xl xl:text-5xl font-black uppercase tracking-tight leading-[1.1] mb-6">
                            Jalan Menuju <br />
                            <span className="bg-gradient-to-r from-brand-gold to-brand-bronze bg-clip-text text-transparent">Supremasi 2026</span>
                        </h1>
                        <p className="text-brand-gold-300 text-lg leading-relaxed mb-8">
                            Pendaftaran turnamen eFootball Mobile Nasional resmi dibuka. Amankan slot tim Anda sekarang.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-brand-bg-surface border border-brand-secondary/40 shadow-lg">
                            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-brand-white uppercase text-sm tracking-wide">Validasi Manual Aman</h4>
                                <p className="text-xs text-brand-gold-300 mt-1">Tim admin melakukan pengecekan real-time untuk menjamin keaslian slot pendaftar.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-brand-bg-surface border border-brand-secondary/40 shadow-lg">
                            <Ticket className="w-6 h-6 text-brand-gold shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-brand-white uppercase text-sm tracking-wide">Voucher Otomatis</h4>
                                <p className="text-xs text-brand-gold-300 mt-1">Sistem menerbitkan voucher setelah pendaftaran disetujui admin.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Kolom Kanan: Form Multi-Step */}
                <div className="bg-brand-bg-surface border border-brand-secondary/50 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-black/50 relative overflow-hidden w-full max-w-md mx-auto lg:mx-0">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-secondary via-brand-gold to-brand-bronze" />

                    <Link href="/profil" className="lg:hidden inline-block text-lg font-black tracking-tighter uppercase mb-6 hover:opacity-80 transition-opacity text-brand-white">
                        BELOVE<span className="text-brand-gold">s</span>PORT
                    </Link>

                    <StepIndicator currentStep={currentStep} />

                    <AnimatePresence mode="wait">
                        {/* STEP 1: DETAILS */}
                        {currentStep === 'DETAILS' && (
                            <motion.div key="step-1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                <div>
                                    <h3 className="text-2xl font-black text-brand-white uppercase tracking-tight">Profil eFootball</h3>
                                    <p className="text-sm text-brand-gold-300 mt-1">Lengkapi data tim dan identitas Anda secara valid.</p>
                                </div>
                                <form onSubmit={handleDetailsSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar pb-4" noValidate>

                                    <div className="space-y-1.5">
                                        <label htmlFor="fullName" className="text-xs font-bold tracking-wider uppercase text-brand-gold-300 font-jetbrains flex items-center gap-2">
                                            <User size={12} className="text-brand-gold" /> Nama Lengkap / Kapten
                                        </label>
                                        <input id="fullName" required type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Sesuai Identitas Asli" className="w-full bg-brand-bg-dark border border-brand-secondary/60 rounded-lg px-4 py-3 text-sm text-brand-white placeholder:text-brand-gold-500 focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold transition" />
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
                                            <input id="whatsapp" required type="tel" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value.replace(/\D/g, ''))} placeholder="08XXXXXXXXX" className="w-full bg-brand-bg-dark border border-brand-secondary/60 rounded-lg px-4 py-3 text-sm text-brand-white placeholder:text-brand-gold-500 focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold transition" />
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
                                        label="Upload Screenshot Profil / Logo"
                                        icon={ImageIcon}
                                        preview={screenshotPreview}
                                        fileName={screenshotFile?.name}
                                        onFileSelected={handleFileChange}
                                    />

                                    {serverError && <ErrorAlert message={serverError} />}

                                    <button type="submit" className="w-full bg-brand-gold text-brand-bg-dark font-bold text-sm py-3.5 rounded-lg hover:brightness-105 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 shadow-lg">
                                        <span>Lanjut ke Pembayaran</span><ArrowRight size={16} />
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {/* STEP 2: PAYMENT */}
                        {currentStep === 'PAYMENT' && (
                            <motion.div key="step-2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
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
                                                className={`p-3.5 rounded-xl border text-center font-jetbrains transition-all flex flex-col items-center justify-center gap-1.5 ${selectedMethod === 'QRIS'
                                                    ? 'border-brand-gold bg-brand-gold/10 text-brand-gold'
                                                    : 'border-brand-secondary/50 bg-brand-bg-dark text-brand-gold-300'
                                                    }`}
                                            >
                                                <QrCode size={20} />
                                                <span className="text-xs font-black">Scan QRIS</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedMethod('BRI')
                                                    setServerError(null)
                                                }}
                                                className={`p-3.5 rounded-xl border text-center font-jetbrains transition-all flex flex-col items-center justify-center gap-1.5 ${selectedMethod && selectedMethod !== 'QRIS'
                                                    ? 'border-brand-gold bg-brand-gold/10 text-brand-gold'
                                                    : 'border-brand-secondary/50 bg-brand-bg-dark text-brand-gold-300'
                                                    }`}
                                            >
                                                <Building size={20} />
                                                <span className="text-xs font-black">Transfer Bank</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* QRIS / Transfer Box */}
                                    {selectedMethod === 'QRIS' && (
                                        <div className="p-4 rounded-2xl bg-white text-black text-center space-y-3 shadow-xl max-w-[240px] mx-auto border-4 border-brand-primary">
                                            <div className="w-full aspect-square bg-slate-100 rounded-xl flex items-center justify-center p-2">
                                                <img src="/img/QRIS.jpg" alt="QRIS Pendaftaran" className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLElement).style.display = 'none' }} />
                                            </div>
                                            <p className="text-[9px] text-gray-600 font-medium">Pindai QR via GoPay, OVO, DANA, BCA, BRI, dll.</p>
                                        </div>
                                    )}

                                    {selectedMethod && selectedMethod !== 'QRIS' && (
                                        <div className="p-4 rounded-xl bg-brand-bg-dark border border-brand-secondary/50 space-y-1 font-jetbrains">
                                            <p className="text-[9px] text-brand-gold-300 uppercase">Rekening Tujuan (BANK BRI)</p>
                                            <p className="text-lg font-bold text-brand-gold tracking-wider select-all">0176-0103-7457-536</p>
                                            <p className="text-[11px] text-brand-gold-300 font-medium">a.n. Aldin Handrian Halawa</p>
                                        </div>
                                    )}

                                    {selectedMethod && (
                                        <FileUploadField
                                            label="Unggah Bukti Transfer Resi Sukses"
                                            icon={ImageIcon}
                                            preview={screenshotPreview}
                                            fileName={screenshotFile?.name}
                                            onFileSelected={handleFileChange}
                                            stepLabel="Langkah 2"
                                        />
                                    )}

                                    {serverError && <ErrorAlert message={serverError} />}

                                    <button
                                        type="submit"
                                        disabled={loading || !selectedMethod || !screenshotPreview}
                                        className="w-full bg-brand-gold text-brand-bg-dark font-bold text-sm py-3.5 rounded-lg hover:brightness-105 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shadow-lg"
                                    >
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Kirim Data Registrasi</span>}
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {/* STEP 3: SUCCESS */}
                        {currentStep === 'SUCCESS' && (
                            <motion.div key="step-3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6 py-2">
                                <div className="mx-auto w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mb-2">
                                    <CheckCircle2 size={24} className="text-emerald-400" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black text-brand-white uppercase tracking-tight">Pendaftaran Dikirim!</h3>
                                    <p className="text-xs text-brand-gold-300">
                                        Admin akan memvalidasi pendaftaran Anda. Cek status tim Anda di halaman Profil.
                                    </p>
                                </div>
                                <Link
                                    href="/profil"
                                    className="block w-full px-8 py-3.5 bg-brand-gold text-brand-bg-dark text-xs font-bold rounded-lg hover:brightness-105 transition-all text-center font-mono"
                                >
                                    Lihat Profil Anda
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </main>
    )
}