'use client';

import { useState, useEffect, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, Mail, Lock, LogIn, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr'

const OAUTH_ERROR_MESSAGES: Record<string, string> = {
    oauth_failed: 'Login Google gagal diproses. Silakan coba lagi.',
    oauth_missing_code: 'Sesi Google tidak valid. Silakan coba lagi.',
};

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const isLockedBeforeLaunch = false;

    useEffect(() => {
        const oauthError = searchParams.get('error');
        if (oauthError) {
            setError(OAUTH_ERROR_MESSAGES[oauthError] ?? 'Terjadi kesalahan saat login. Coba lagi.');
        }
    }, [searchParams]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier, password }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                setError(data.message ?? 'Login gagal. Periksa kembali email/username dan password.');
                return;
            }
            router.push(data.hasTeam ? '/profil' : '/register');
            router.refresh();
        } catch {
            setError('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        if (isLockedBeforeLaunch) {
            setError('Akses login Google ditangguhkan sementara.');
            return;
        }

        setError(null);
        setIsGoogleLoading(true);

        try {
            const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

            if (!url || !anonKey) {
                setError('Kunci API Supabase gagal dimuat. Sila restart server dev Koko (npm run dev) atau periksa file .env.');
                setIsGoogleLoading(false);
                return;
            }

            // 🚀 KUNCI KEMENANGAN: Gunakan Browser Client resmi dari @supabase/ssr
            // Ini otomatis mengelola cookie PKCE code verifier tanpa perlu kodingan manual yang rentan bug!
            const directSupabase = createBrowserClient(url, anonKey)

            const { error: oauthError } = await directSupabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/api/auth/callback`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    }
                },
            });

            if (oauthError) {
                setError(`Gagal memuat OAuth Google: ${oauthError.message}`);
                setIsGoogleLoading(false);
            }
        } catch (err) {
            console.error('OAuth Initialization Error:', err);
            setError('Terjadi kesalahan tak terduga saat memuat Google Auth.');
            setIsGoogleLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-bg-light flex items-center justify-center px-4 sm:px-6 py-12 relative overflow-hidden text-brand-dark select-none">
            {/* Ambient Background Glow Premium[cite: 2] */}
            <div className="fixed top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent z-40" />
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[600px] md:w-[900px] h-[320px] sm:h-[500px] rounded-full opacity-[0.07] pointer-events-none blur-[60px] sm:blur-[120px]"
                style={{ background: 'radial-gradient(ellipse, #FCB335 0%, #82403B 55%, transparent 70%)' }}
                aria-hidden
            />

            <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-300">

                {/* BRAND LOGO MINIMALIST & HEADER */}
                <div className="text-center mb-8 flex flex-col items-center">
                    <Link
                        href="/"
                        className="group flex items-center gap-2.5 mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60 rounded-xl p-1 transition-all"
                    >
                        <div className="w-8 h-8 sm:w-9 sm:h-9 relative transition-transform duration-300 group-hover:scale-105">
                            <Image
                                src="/logos/logo_BELOVESPORT.png"
                                alt="BELOVESPORT Logo"
                                width={36}
                                height={36}
                                className="w-full h-full object-contain"
                                priority
                            />
                        </div>
                        <span className="font-black text-sm sm:text-base tracking-widest uppercase text-brand-dark transition-colors">
                            BELOVESPORT
                        </span>
                    </Link>

                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase text-brand-dark">
                        Login <span className="text-transparent bg-clip-text bg-gradient-brand">Peserta</span>
                    </h1>
                </div>

                {/* FORM CONTAINER (Menggunakan border-slate-300 bawaan agar garis kotak tegas) */}
                <div className="bg-white/70 backdrop-blur-xl border border-slate-300 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-xl shadow-black/[0.02] relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />

                    {error && (
                        <div
                            role="alert"
                            className="mb-6 flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3.5 text-xs sm:text-sm text-red-600 font-medium animate-in fade-in slide-in-from-top-2 duration-200"
                        >
                            <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-500" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                        <div className="space-y-1.5">
                            <label htmlFor="identifier" className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-brand-muted flex items-center gap-1.5">
                                <Mail size={13} className="text-brand-gold" /> Email atau Username
                            </label>
                            <input
                                id="identifier"
                                type="text"
                                autoComplete="username"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                required
                                placeholder="nama@email.com"
                                className="w-full bg-brand-bg-surface/50 border border-slate-300 rounded-xl px-4 py-3 sm:py-3.5 text-sm text-brand-dark placeholder:text-brand-muted/40 focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold focus:bg-white transition-all font-medium"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label htmlFor="password" className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-brand-muted flex items-center gap-1.5">
                                    <Lock size={13} className="text-brand-gold" /> Password
                                </label>
                                <Link href="/forgot-password" className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-brand-secondary hover:text-brand-primary transition-colors">
                                    Lupa Password?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="w-full bg-brand-bg-surface/50 border border-slate-300 rounded-xl px-4 py-3 sm:py-3.5 pr-11 text-sm text-brand-dark placeholder:text-brand-muted/40 focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold focus:bg-white transition-all font-medium"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-dark transition-colors p-1.5 rounded-lg"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || isGoogleLoading}
                            className="w-full mt-2 bg-gradient-brand text-white hover:brightness-105 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed font-black font-jetbrains text-xs uppercase tracking-widest rounded-xl py-3.5 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-gold/10"
                        >
                            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <><LogIn size={15} /> Masuk ke Dasbor</>}
                        </button>
                    </form>

                    <div className="flex items-center gap-4 my-6">
                        <hr className="flex-1 border-slate-300" />
                        <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest font-jetbrains">Atau</span>
                        <hr className="flex-1 border-slate-300" />
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={isGoogleLoading || isLoading}
                        className="w-full bg-white hover:bg-brand-bg-surface active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-zinc-700 font-bold text-xs uppercase tracking-wider rounded-xl py-3.5 border border-slate-300 transition-all flex items-center justify-center gap-3 shadow-sm"
                    >
                        {isGoogleLoading ? (
                            <Loader2 size={16} className="animate-spin text-zinc-400" />
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4 shrink-0" aria-hidden>
                                    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                                    <path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
                                    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.222 0-9.654-3.343-11.303-8l-6.571 4.819C9.656 39.663 16.318 44 24 44z" />
                                    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
                                </svg>
                                Lanjutkan via Google
                            </>
                        )}
                    </button>
                </div>

                <p className="text-center text-brand-muted text-xs sm:text-sm mt-6 font-medium">
                    Belum memiliki akun?{' '}
                    <Link href="/signup" className="text-brand-primary font-bold hover:text-brand-secondary transition-colors underline-offset-4 hover:underline">
                        Buat Akun Baru
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center bg-brand-bg-light text-brand-dark">
                <Loader2 size={24} className="animate-spin text-brand-gold" />
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}