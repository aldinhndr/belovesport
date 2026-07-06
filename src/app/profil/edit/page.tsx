// Path: src/app/profil/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Save, Bell, Loader2, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import LogoutButtonParticipant from '@/components/participant/LogoutButton';

export default function EditProfilPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // State Data Profil
    const [formData, setFormData] = useState({
        username: '',
        email: '', // Email biasanya di-lock, tapi kita tampilkan
        // Silakan tambah state lain jika ada di DB (misal: phone, nama lengkap)
    });

    // Tarik data profil saat ini
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Endpoint ini opsional, gunakan endpoint get profile Koko saat ini
                // Atau kita bisa asumsikan ambil dari API get participant
                const res = await fetch('/api/participant/profile', { credentials: 'include' });

                if (res.status === 401) {
                    window.location.href = '/login';
                    return;
                }

                const data = await res.json();
                if (data.success && data.data) {
                    setFormData({
                        username: data.data.username || '',
                        email: data.data.email || '',
                    });
                }
            } catch (error) {
                console.error("Gagal memuat profil:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setStatusMsg(null);

        try {
            // Panggil API update profil Koko di sini
            const res = await fetch('/api/participant/update-profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ username: formData.username })
            });

            const data = await res.json();

            if (data.success) {
                setStatusMsg({ type: 'success', text: 'Profil berhasil diperbarui!' });
                setTimeout(() => {
                    router.push('/profil');
                    router.refresh(); // Memaksa halaman profil menarik data terbaru
                }, 1500);
            } else {
                setStatusMsg({ type: 'error', text: data.message || 'Gagal memperbarui profil.' });
            }
        } catch (error) {
            setStatusMsg({ type: 'error', text: 'Terjadi kesalahan sistem.' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-bg-light text-brand-dark relative overflow-hidden pb-20 flex flex-col">
            {/* 🌟 EFEK CAHAYA & BACKGROUND PREMIUM */}
            <div className="fixed top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent z-40" />
            <div
                className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full opacity-[0.08] pointer-events-none blur-[110px]"
                style={{ background: 'radial-gradient(ellipse, #FCB335 0%, #82403B 55%, transparent 70%)' }}
                aria-hidden
            />
            {/* Tekstur Grid Halus */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
                backgroundImage: 'repeating-linear-gradient(45deg, #561B1D 0, #561B1D 1px, transparent 0, transparent 50%)',
                backgroundSize: '20px 20px'
            }} />

            {/* 🌟 TOP NAVBAR GLOBAL */}
            <nav className="sticky top-0 z-50 border-b border-brand-border bg-brand-bg-light/85 backdrop-blur-xl shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/profil" className="flex items-center gap-2 group focus-visible:outline-none">
                            <div className="w-7 h-7 rounded-md overflow-hidden flex items-center justify-center bg-gradient-to-br from-brand-gold to-brand-bronze shadow-sm group-hover:scale-105 transition-transform">
                                <img
                                    src="/logos/logo_BELOVESPORT.png"
                                    alt="Belovesport"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <span className="font-black text-sm tracking-widest uppercase text-brand-dark group-hover:text-brand-primary transition-colors">Belovesport</span>
                        </Link>
                        <span className="text-brand-muted/40 text-xs" aria-hidden>/</span>
                        <Link href="/profil" className="text-brand-muted text-xs font-medium hover:text-brand-primary transition-colors">Profil</Link>
                        <span className="text-brand-muted/40 text-xs" aria-hidden>/</span>
                        <span className="text-brand-primary text-xs font-black uppercase tracking-widest">Edit</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            aria-label="Notifikasi"
                            className="relative p-2 rounded-lg text-brand-muted hover:text-brand-dark hover:bg-brand-bg-surface transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50"
                        >
                            <Bell size={16} />
                            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-gold" aria-hidden />
                        </button>
                        <LogoutButtonParticipant />
                    </div>
                </div>
            </nav>

            {/* 🌟 SUB-HEADER */}
            <div className="relative z-20 pt-10 pb-6 px-5 max-w-2xl mx-auto w-full text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <Link href="/profil" className="p-2.5 rounded-xl transition-all group bg-white border border-brand-border hover:border-brand-gold shadow-sm hidden md:block">
                        <ArrowLeft size={20} className="text-brand-secondary group-hover:text-brand-primary transition-colors" />
                    </Link>
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-brand shadow-brand mx-auto md:mx-0">
                        <User size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight font-jetbrains text-brand-dark">
                            Edit <span className="text-brand-primary">Profil</span>
                        </h1>
                        <p className="text-brand-muted text-xs md:text-sm font-medium mt-1">
                            Mutakhirkan informasi akun Koko untuk kebutuhan administrasi turnamen.
                        </p>
                    </div>
                </div>
            </div>

            {/* 🌟 KONTEN FORM */}
            <div className="relative z-10 w-full flex-1 max-w-2xl mx-auto px-4 sm:px-6 mt-4">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 size={32} className="animate-spin text-brand-primary mb-3" />
                        <span className="text-xs font-bold uppercase tracking-widest text-brand-muted font-jetbrains">Menyiapkan Form...</span>
                    </div>
                ) : (
                    <div className="bg-white border border-brand-border rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-sm">
                        <form onSubmit={handleSave} className="space-y-6">

                            {/* Input Username */}
                            <div className="space-y-2">
                                <label className="text-xs font-black tracking-widest uppercase text-brand-dark font-jetbrains flex items-center gap-2">
                                    <User size={14} className="text-brand-primary" /> Username / Nickname
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-brand-bg-surface border border-brand-border rounded-xl px-4 py-3.5 text-sm text-brand-dark font-medium focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                                    placeholder="Masukkan Nickname"
                                />
                            </div>

                            {/* Input Email (Read Only - Opsional) */}
                            <div className="space-y-2">
                                <label className="text-xs font-black tracking-widest uppercase text-brand-dark font-jetbrains flex items-center gap-2">
                                    <Mail size={14} className="text-brand-muted" /> Alamat Email <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full ml-auto">Terkunci</span>
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-500 font-medium cursor-not-allowed"
                                />
                            </div>

                            {/* Notifikasi Sukses/Error */}
                            {statusMsg && (
                                <div className={`flex items-start gap-2 p-4 rounded-xl text-xs font-bold animate-in fade-in zoom-in-95 duration-200 ${statusMsg.type === 'success'
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                        : 'bg-red-50 text-red-600 border border-red-200'
                                    }`}>
                                    {statusMsg.type === 'success' ? <CheckCircle2 size={16} className="shrink-0 mt-0.5" /> : <AlertCircle size={16} className="shrink-0 mt-0.5" />}
                                    <span className="leading-relaxed">{statusMsg.text}</span>
                                </div>
                            )}

                            {/* Tombol Aksi */}
                            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-brand-border">
                                <button
                                    type="button"
                                    onClick={() => router.push('/profil')}
                                    disabled={isSaving}
                                    className="flex-1 px-4 py-3.5 rounded-xl text-xs font-black tracking-widest uppercase transition-all bg-white border border-brand-border text-brand-dark hover:bg-brand-bg-surface disabled:opacity-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-1 px-4 py-3.5 rounded-xl text-xs font-black tracking-widest uppercase transition-all bg-gradient-brand text-white shadow-brand hover:brightness-105 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                    {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>

                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}