// Path: src/app/forgot-password/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Mail, Lock, ShieldAlert, ArrowRight, KeyRound } from 'lucide-react';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2>(1);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // STEP 1: Minta OTP[cite: 4]
    const handleRequestOtp = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                setError(data.message ?? 'Gagal memproses permintaan.');
                return;
            }
            setInfo('Kode reset telah dikirim ke email kamu.');
            setStep(2); // Pindah ke form input password baru[cite: 4]
        } catch {
            setError('Tidak dapat terhubung ke server.');
        } finally {
            setIsLoading(false);
        }
    };

    // STEP 2: Eksekusi Reset Password[cite: 4]
    const handleResetPassword = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code, newPassword }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                setError(data.message ?? 'Gagal memperbarui password.');
                return;
            }
            alert('Password berhasil diganti! Mengalihkan ke halaman login...');
            router.push('/login');
        } catch {
            setError('Tidak dapat terhubung ke server.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-bg-dark flex items-center justify-center px-4 py-10 relative overflow-hidden text-brand-white">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-secondary/20 blur-[150px] rounded-full pointer-events-none" />

            <div className="w-full max-w-md relative z-10">

                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-bg-surface border border-brand-secondary/40 shadow-xl shadow-brand-gold/5 mb-4">
                        <ShieldAlert size={32} className="text-brand-gold" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight uppercase">
                        Reset <span className="text-brand-gold">Password</span>
                    </h1>
                    <p className="text-zinc-400 text-sm mt-2 font-sans">
                        {step === 1
                            ? 'Masukkan email akun Belovesport Anda untuk pemulihan.'
                            : `Masukkan kode OTP dan sandi baru untuk ${email}`}
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-brand-bg-surface border border-brand-secondary/50 rounded-3xl p-8 shadow-2xl shadow-black/50 relative overflow-hidden">
                    {/* Top Accent Line */}
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-secondary via-brand-gold to-brand-bronze" />

                    {/* Alert Messages */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-sans rounded-lg px-4 py-3 mb-6 text-center animate-in fade-in duration-300">
                            {error}
                        </div>
                    )}
                    {info && (
                        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-sans rounded-lg px-4 py-3 mb-6 text-center animate-in fade-in duration-300">
                            {info}
                        </div>
                    )}

                    {step === 1 ? (
                        /* FORM STEP 1: INPUT EMAIL */
                        <form onSubmit={handleRequestOtp} className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold tracking-wider uppercase text-zinc-300 font-jetbrains flex items-center gap-2">
                                    <Mail size={14} className="text-brand-gold" /> Email Terdaftar
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="email@domain.com"
                                    className="w-full bg-brand-bg-dark border border-brand-secondary/60 rounded-xl px-4 py-3.5 text-sm text-brand-white focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-brand-gold hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed text-brand-bg-dark font-black tracking-wide rounded-xl py-3.5 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-gold/20 mt-2"
                            >
                                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <>KIRIM KODE OTP <ArrowRight size={18} /></>}
                            </button>
                        </form>
                    ) : (
                        /* FORM STEP 2: INPUT OTP & PASSWORD BARU */
                        <form onSubmit={handleResetPassword} className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold tracking-wider uppercase text-zinc-300 font-jetbrains flex items-center gap-2">
                                    <KeyRound size={14} className="text-brand-gold" /> Kode OTP (6 Digit)
                                </label>
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    required
                                    maxLength={6}
                                    placeholder="•• •• ••"
                                    className="w-full bg-brand-bg-dark border border-brand-secondary/60 rounded-xl px-4 py-3.5 text-xl text-center tracking-[0.5em] font-black text-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all uppercase"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold tracking-wider uppercase text-zinc-300 font-jetbrains flex items-center gap-2">
                                    <Lock size={14} className="text-brand-gold" /> Password Baru
                                </label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    minLength={8}
                                    placeholder="Minimal 8 karakter"
                                    className="w-full bg-brand-bg-dark border border-brand-secondary/60 rounded-xl px-4 py-3.5 text-sm text-brand-white focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-brand-gold hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed text-brand-bg-dark font-black tracking-wide rounded-xl py-3.5 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-gold/20 mt-2"
                            >
                                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <>GANTI PASSWORD <ArrowRight size={18} /></>}
                            </button>
                        </form>
                    )}
                </div>

                {/* Footer Link */}
                <p className="text-center text-zinc-400 text-xs mt-6 font-sans">
                    Teringat password Anda?{' '}
                    <Link href="/login" className="text-brand-gold font-bold hover:underline transition-all">
                        Kembali ke Login
                    </Link>
                </p>
            </div>
        </div>
    );
}