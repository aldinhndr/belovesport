'use client';

import { useState, useEffect, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Mail, Lock, LogIn, Eye, EyeOff, AlertCircle } from 'lucide-react';
// 1. Impor createClient langsung dari modul supabase-js untuk inisialisasi dinamis
import { createClient } from '@supabase/supabase-js';

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

    // Surface OAuth errors that bounced back from /auth/callback.
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

    // 2. Pembaruan fungsi klik login Google dengan penanganan ketat runtime browser
    const handleGoogleLogin = async () => {
        // Interseptor Keamanan Tanggal 10 Juli (Gembok Sementara)
        if (isLockedBeforeLaunch) {
            setError('Akses login Google ditangguhkan sementara.');
            return;
        }

        setError(null);
        setIsGoogleLoading(true);

        try {
            const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

            // 🛡️ Deteksi Error "No API Key" sebelum ditembakkan ke Supabase
            if (!url || !anonKey) {
                setError('Kunci API Supabase gagal dimuat. Sila restart server dev Koko (npm run dev) atau periksa file .env.');
                setIsGoogleLoading(false);
                return;
            }

            const directSupabase = createClient(url, anonKey, {
                auth: {
                    persistSession: true,
                    autoRefreshToken: true,
                    detectSessionInUrl: true
                }
            });

            const { error: oauthError } = await directSupabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
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
        <div className="min-h-screen bg-brand-bg-light flex items-center justify-center px-4 py-10 relative overflow-hidden text-brand-dark">
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-primary/[0.07] blur-[150px] rounded-full pointer-events-none"
                aria-hidden
            />

            <div className="w-full max-w-md relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link
                        href="/"
                        className="inline-block text-xl font-black tracking-tighter uppercase mb-4 text-brand-dark hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60 rounded"
                    >
                        BELOVE<span className="text-brand-gold">s</span>PORT
                    </Link>
                    <h1 className="text-3xl font-black tracking-tight uppercase">
                        Login <span className="text-brand-primary">Peserta</span>
                    </h1>
                    <p className="text-brand-muted text-sm mt-2">
                        Akses dasbor komando dan kelola tim Anda.
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-brand-bg-surface border border-brand-border rounded-3xl p-8 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-primary via-brand-gold to-brand-bronze" />

                    {error && (
                        <div
                            role="alert"
                            className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-500/25 bg-red-500/[0.08] px-4 py-3 text-sm text-red-600"
                        >
                            <AlertCircle size={16} className="mt-0.5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                        {/* Identifier */}
                        <div className="space-y-1.5">
                            <label
                                htmlFor="identifier"
                                className="text-xs font-bold tracking-wide uppercase text-brand-muted flex items-center gap-1.5"
                            >
                                <Mail size={14} className="text-brand-gold" /> Email atau Username
                            </label>
                            <input
                                id="identifier"
                                type="text"
                                autoComplete="username"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                required
                                placeholder="nama@email.com"
                                className="w-full bg-white border border-brand-border rounded-xl px-4 py-3.5 text-[15px] text-brand-dark placeholder:text-brand-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold transition-colors"
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label
                                    htmlFor="password"
                                    className="text-xs font-bold tracking-wide uppercase text-brand-muted flex items-center gap-1.5"
                                >
                                    <Lock size={14} className="text-brand-gold" /> Password
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-xs text-brand-primary hover:text-brand-gold hover:underline transition-colors"
                                >
                                    Lupa password?
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
                                    className="w-full bg-white border border-brand-border rounded-xl px-4 py-3.5 pr-11 text-[15px] text-brand-dark placeholder:text-brand-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-dark transition-colors p-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/40"
                                >
                                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading || isGoogleLoading}
                            className="w-full bg-brand-gold hover:brightness-105 active:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed text-brand-bg-dark font-black tracking-wide rounded-xl py-3.5 transition-all flex items-center justify-center gap-2 shadow-md shadow-brand-gold/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60 focus-visible:ring-offset-2"
                        >
                            {isLoading ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <>
                                    <LogIn size={18} /> Masuk ke Dasbor
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <hr className="flex-1 border-brand-border" />
                        <span className="text-[11px] font-bold text-brand-muted uppercase tracking-widest">Atau</span>
                        <hr className="flex-1 border-brand-border" />
                    </div>

                    {/* Google Login */}
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={isGoogleLoading || isLoading}
                        className="w-full bg-white hover:bg-zinc-50 active:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-800 font-semibold rounded-xl py-3.5 border border-brand-border transition-colors flex items-center justify-center gap-3 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/40"
                    >
                        {isGoogleLoading ? (
                            <Loader2 size={18} className="animate-spin text-zinc-500" />
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5" aria-hidden>
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

                {/* Footer link */}
                <p className="text-center text-brand-muted text-sm mt-6">
                    Belum memiliki akun?{' '}
                    <Link href="/signup" className="text-brand-primary font-bold hover:underline transition-colors">
                        Daftar akses baru
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