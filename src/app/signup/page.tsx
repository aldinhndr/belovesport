// Path: src/app/register/page.tsx
'use client';

import { useState, useEffect, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Mail, Lock, User, UserPlus, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

const OAUTH_ERROR_MESSAGES: Record<string, string> = {
    oauth_failed: 'Login Google gagal diproses. Silakan coba lagi.',
    oauth_missing_code: 'Sesi Google tidak valid. Silakan coba lagi.',
};

function passwordIssue(password: string): string | null {
    if (password.length === 0) return null;
    if (password.length < 8) return 'Password minimal 8 karakter.';
    if (!/\d/.test(password)) return 'Password harus mengandung minimal 1 angka.';
    return null;
}

// 1. Pindahkan seluruh logika dan UI pendaftaran ke komponen terpisah ini
function RegisterContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // State Form
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // State Status
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    useEffect(() => {
        const oauthError = searchParams.get('error');
        if (oauthError) {
            setError(OAUTH_ERROR_MESSAGES[oauthError] ?? 'Terjadi kesalahan saat login. Coba lagi.');
        }
    }, [searchParams]);

    const pwIssue = passwordIssue(password);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccessMsg(null);

        if (pwIssue) {
            setError(pwIssue);
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });
            const data = await res.json();

            if (!res.ok || !data.success) {
                setError(data.message ?? 'Registrasi gagal. Periksa kembali data Anda.');
                setIsLoading(false);
                return;
            }

            setSuccessMsg('Akun berhasil dibuat! Mengalihkan ke verifikasi...');
            setTimeout(() => {
                router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
            }, 1500);
        } catch {
            setError('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError(null);
        setIsGoogleLoading(true);
        const { error: oauthError } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        if (oauthError) {
            setError('Tidak bisa membuka pendaftaran Google. Coba lagi sebentar lagi.');
            setIsGoogleLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-bg-dark flex items-center justify-center px-4 py-10 relative overflow-hidden text-brand-white">
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-secondary/[0.12] blur-[150px] rounded-full pointer-events-none"
                aria-hidden
            />

            <div className="w-full max-w-md relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link
                        href="/"
                        className="inline-block text-xl font-black tracking-tighter uppercase mb-4 hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60 rounded"
                    >
                        BELOVE<span className="text-brand-gold">s</span>PORT
                    </Link>
                    <h1 className="text-3xl font-black tracking-tight uppercase">
                        Daftar <span className="text-brand-gold">Peserta</span>
                    </h1>
                    <p className="text-brand-gold-400 text-sm mt-2">Buat akun untuk mengamankan slot tim Anda.</p>
                </div>

                {/* Form Card */}
                <div className="bg-brand-bg-surface border border-brand-secondary/50 rounded-3xl p-8 shadow-2xl shadow-black/50 relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-secondary via-brand-gold to-brand-bronze" />

                    {error && (
                        <div
                            role="alert"
                            className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                        >
                            <AlertCircle size={16} className="mt-0.5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}
                    {successMsg && (
                        <div
                            role="status"
                            className="mb-5 flex items-start gap-2.5 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400"
                        >
                            <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                            <span>{successMsg}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                        {/* Username */}
                        <div className="space-y-1.5">
                            <label
                                htmlFor="username"
                                className="text-xs font-bold tracking-wide uppercase text-brand-gold-300 flex items-center gap-1.5"
                            >
                                <User size={14} className="text-brand-gold" /> Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                autoComplete="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                placeholder="Misal: aldin_prime"
                                className="w-full bg-brand-bg-dark border border-brand-secondary/60 rounded-xl px-4 py-3.5 text-[15px] text-brand-white placeholder:text-brand-gold-300 focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold transition-colors"
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label
                                htmlFor="email"
                                className="text-xs font-bold tracking-wide uppercase text-brand-gold-300 flex items-center gap-1.5"
                            >
                                <Mail size={14} className="text-brand-gold" /> Email Aktif
                            </label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="email@domain.com"
                                className="w-full bg-brand-bg-dark border border-brand-secondary/60 rounded-xl px-4 py-3.5 text-[15px] text-brand-white placeholder:text-brand-gold-300 focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold transition-colors"
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label
                                htmlFor="password"
                                className="text-xs font-bold tracking-wide uppercase text-brand-gold-300 flex items-center gap-1.5"
                            >
                                <Lock size={14} className="text-brand-gold" /> Password Keamanan
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="Min 8 karakter & 1 angka"
                                    aria-describedby="password-hint"
                                    className="w-full bg-brand-bg-dark border border-brand-secondary/60 rounded-xl px-4 py-3.5 pr-11 text-[15px] text-brand-white placeholder:text-brand-gold-300 focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gold-400 hover:text-white transition-colors p-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/40"
                                >
                                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                            <p
                                id="password-hint"
                                className={`text-xs pl-0.5 ${pwIssue ? 'text-amber-400' : 'text-brand-gold-300'}`}
                            >
                                {pwIssue ?? 'Minimal 8 karakter dan mengandung 1 angka.'}
                            </p>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading || isGoogleLoading}
                            className="w-full bg-brand-gold hover:brightness-105 active:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed text-brand-bg-dark font-black tracking-wide rounded-xl py-3.5 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-gold/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg-surface"
                        >
                            {isLoading ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <>
                                    <UserPlus size={18} /> Buat Akun
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <hr className="flex-1 border-brand-secondary/40" />
                        <span className="text-[11px] font-bold text-brand-gold-300 uppercase tracking-widest">Atau</span>
                        <hr className="flex-1 border-brand-secondary/40" />
                    </div>

                    {/* Google Login/Register */}
                    <button
                        type="button"
                        onClick={() => alert("FITUR INI AKAN SEGERA TERSEDIA")}
                        disabled={isGoogleLoading || isLoading}
                        className="w-full bg-white hover:bg-zinc-50 active:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed text-brand-gold-800 font-semibold rounded-xl py-3.5 transition-colors flex items-center justify-center gap-3 shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/40"
                    >
                        {isGoogleLoading ? (
                            <Loader2 size={18} className="animate-spin text-brand-gold-500" />
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/xl" viewBox="0 0 48 48" className="w-5 h-5" aria-hidden>
                                    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                                    <path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
                                    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.222 0-9.654-3.343-11.303-8l-6.571 4.819C9.656 39.663 16.318 44 24 44z" />
                                    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
                                </svg>
                                Lanjutkan dengan Google
                            </>
                        )}
                    </button>
                </div>

                {/* Footer */}
                <p className="text-center text-brand-gold-400 text-sm mt-6">
                    Sudah memiliki akun?{' '}
                    <Link href="/login" className="text-brand-gold font-bold hover:underline transition-colors">
                        Login ke Dasbor
                    </Link>
                </p>
            </div>
        </div >
    );
}

// 2. Komponen default export utama pembungkus Suspense Boundary
export default function RegisterPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center bg-brand-bg-dark text-brand-white">
                <Loader2 size={24} className="animate-spin text-brand-gold" />
            </div>
        }>
            <RegisterContent />
        </Suspense>
    );
}