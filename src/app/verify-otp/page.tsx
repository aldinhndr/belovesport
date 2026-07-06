'use client';

import { useState, useRef, FormEvent, KeyboardEvent, ClipboardEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

function VerifyOtpForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') ?? '';

    // Menggunakan array untuk 4 digit OTP murni
    const [otp, setOtp] = useState<string[]>(['', '', '', '']);
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Kontrol referensi untuk memindahkan fokus kotak input otomatis
    const inputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ];

    // HANDLER 1: Menangani input karakter angka dan lompat otomatis
    const handleChange = (value: string, index: number) => {
        if (isNaN(Number(value))) return; // Proteksi agar hanya menerima angka murni

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1); // Ambil karakter terakhir
        setOtp(newOtp);

        // Jika user mengetik angka, otomatis lompat ke kotak setelahnya
        if (value && index < 3) {
            inputRefs[index + 1].current?.focus();
        }
    };

    // HANDLER 2: Menangani aksi tombol Backspace untuk mundur kotak
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    // HANDLER 3: Mengizinkan fitur copas (Paste) langsung 4 angka sekaligus
    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const data = e.clipboardData.getData('text').trim();
        if (!/^\d{4}$/.test(data)) return; // Validasi harus tepat 4 digit angka

        const digits = data.split('');
        setOtp(digits);
        inputRefs[3].current?.focus(); // Langsung lempar fokus ke kotak terakhir
    };

    // HANDLER 4: Pengiriman data gabungan 4 digit ke API Auth
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setInfo(null);

        const combinedCode = otp.join('');
        if (combinedCode.length !== 4) {
            setError('Silakan isi seluruh kode OTP 4 digit.');
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code: combinedCode }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                setError(data.message ?? 'Verifikasi gagal.');
                return;
            }
            router.push('/login');
        } catch {
            setError('Tidak dapat terhubung ke server.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        setError(null);
        setInfo(null);
        try {
            const res = await fetch('/api/auth/resend-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                setError(data.message ?? 'Gagal mengirim ulang kode.');
                return;
            }
            setInfo('Kode baru telah dikirim ke email kamu.');
            setOtp(['', '', '', '']); // Reset kotak ke kosong semula
            inputRefs[0].current?.focus(); // Kembalikan kursor ke kotak awal
        } catch {
            setError('Tidak dapat terhubung ke server.');
        }
    };

    return (
        <div className="min-h-screen bg-brand-bg-light flex items-center justify-center px-4 py-10 relative overflow-hidden text-brand-dark">
            {/* Ambient background glow — sama seperti halaman login */}
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-primary/[0.07] blur-[150px] rounded-full pointer-events-none"
                aria-hidden
            />

            <div className="w-full max-w-md relative z-10">
                {/* Header — wordmark + judul, identik dengan halaman login */}
                <div className="text-center mb-8">
                    <Link
                        href="/"
                        className="inline-block text-xl font-black tracking-tighter uppercase mb-4 text-brand-dark hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60 rounded"
                    >
                        BELOVE<span className="text-brand-gold">s</span>PORT
                    </Link>
                    <h1 className="text-3xl font-black tracking-tight uppercase">
                        Verifikasi <span className="text-brand-primary">OTP</span>
                    </h1>
                    <p className="text-brand-muted text-sm mt-2 max-w-xs mx-auto leading-normal">
                        Kami telah mengirimkan 4 digit kode akses ke{' '}
                        <span className="text-brand-dark font-semibold break-all">{email || 'email kamu'}</span>
                    </p>
                </div>

                {/* Form Card — struktur sama dengan card login (top gradient bar, shadow-lg) */}
                <div className="bg-brand-bg-surface border border-brand-border rounded-3xl p-8 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-primary via-brand-gold to-brand-bronze" />

                    {/* Error alert — pola identik dengan login (AlertCircle + border merah tipis) */}
                    {error && (
                        <div
                            role="alert"
                            className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-500/25 bg-red-500/[0.08] px-4 py-3 text-sm text-red-600"
                        >
                            <AlertCircle size={16} className="mt-0.5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Info alert — varian sukses dengan pola visual yang sama */}
                    {info && (
                        <div
                            role="status"
                            className="mb-5 flex items-start gap-2.5 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.08] px-4 py-3 text-sm text-emerald-600"
                        >
                            <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                            <span>{info}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                        {/* INPUT 4 KOTAK SEGMEN DIGITAL */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold tracking-wide uppercase text-brand-muted flex items-center justify-center gap-1.5">
                                <ShieldCheck size={14} className="text-brand-gold" /> Kode Keamanan
                            </label>
                            <div className="flex justify-center gap-3" onPaste={handlePaste}>
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={inputRefs[index]}
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleChange(e.target.value, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        required
                                        className="w-14 h-16 bg-white border border-brand-border rounded-xl text-center text-2xl font-black text-brand-dark placeholder:text-brand-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold transition-colors"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Submit — warna & bentuk sama persis dengan tombol utama login */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-brand-gold hover:brightness-105 active:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed text-brand-dark font-black tracking-wide rounded-xl py-3.5 transition-all flex items-center justify-center gap-2 shadow-md shadow-brand-gold/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60 focus-visible:ring-offset-2"
                        >
                            {isLoading ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <>
                                    <ShieldCheck size={18} /> Konfirmasi Kode
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer link — pola sama dengan "Belum memiliki akun?" di login */}
                <p className="text-center text-brand-muted text-sm mt-6">
                    Tidak menerima kode OTP?{' '}
                    <button
                        type="button"
                        onClick={handleResend}
                        className="text-brand-primary font-bold hover:underline transition-colors focus-visible:outline-none"
                    >
                        Kirim ulang
                    </button>
                </p>
            </div>
        </div>
    );
}

export default function VerifyOtpPage() {
    return (
        <Suspense>
            <VerifyOtpForm />
        </Suspense>
    );
}