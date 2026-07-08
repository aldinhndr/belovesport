// Path: src/components/admin/DashboardOverview.tsx
'use client';

import { useEffect, useState } from 'react';
import { Users, DollarSign, GitFork, MessageSquareWarning, Activity, Loader2 } from 'lucide-react';

interface StatsData {
    pesertaAktif: number;
    kuotaTotal: number;
    pendingRegistrations: number;
    pendapatan: number;
    statusBracket: string;
    tiketOpen: number;
    matchBerjalan: number;
}

export default function DashboardOverview() {
    const [stats, setStats] = useState<StatsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // KONEKSI REAL-TIME: Ambil data agregat asli dari database PostgreSQL
    const fetchDashboardStats = async () => {
        try {
            const res = await fetch('/api/admin/dashboard-stats');
            const data = await res.json();
            if (data.success) {
                setStats(data.data);
            }
        } catch (error) {
            console.error('Gagal memuat statistik database hq:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-brand-gold gap-3">
                <Loader2 size={32} className="animate-spin" />
                <p className="font-jetbrains text-xs font-bold uppercase tracking-widest text-brand-bronze animate-pulse">
                    Sinkronisasi Pusat Kendali Database...
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* HEADER MODUL */}
            <div>
                <h2 className="text-2xl font-black uppercase font-jetbrains text-brand-dark tracking-tight">
                    Modul A-01: <span className="text-brand-primary">Dashboard Utama</span>
                </h2>
                <p className="text-brand-muted text-sm mt-1">
                    Ringkasan real-time aktivitas database dan status operasional turnamen Belovesport.
                </p>
            </div>

            {/* 4 KARTU METRIK DATABASE SEJATI */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                {/* Kartu 1: Total Skuad APPROVED */}
                <div className="bg-brand-bg-light border border-brand-border rounded-2xl p-5 shadow-sm hover:shadow-brand transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2.5 rounded-xl bg-brand-gold/10 border border-brand-gold/20">
                            <Users size={18} className="text-brand-gold" />
                        </div>
                        <span className="text-[10px] font-black px-2 py-1 rounded bg-brand-bg-surface border border-brand-border text-brand-gold font-jetbrains tracking-wider animate-pulse">
                            LIVE
                        </span>
                    </div>
                    <p className="text-xs font-black font-jetbrains tracking-widest text-brand-muted uppercase mb-1">Klub Terverifikasi</p>
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-3xl font-black text-brand-dark">{stats?.pesertaAktif || 0}</h2>
                        <span className="text-sm text-brand-muted">/ {stats?.kuotaTotal || 64} Slot</span>
                    </div>
                </div>

                {/* Kartu 2: Pendapatan Akurat (Approved Tim * Rp 25.000) */}
                <div className="bg-brand-bg-light border border-brand-border rounded-2xl p-5 shadow-sm hover:shadow-brand transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                            <DollarSign size={18} className="text-emerald-600" />
                        </div>
                    </div>
                    <p className="text-xs font-black font-jetbrains tracking-widest text-brand-muted uppercase mb-1">Kas Masuk Bergaransi</p>
                    <h2 className="text-2xl font-black text-emerald-600">
                        Rp {stats?.pendapatan.toLocaleString('id-ID') || 0}
                    </h2>
                </div>

                {/* Kartu 3: Fase Status Kerja Turnamen */}
                <div className="bg-brand-bg-light border border-brand-border rounded-2xl p-5 shadow-sm hover:shadow-brand transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2.5 rounded-xl bg-brand-primary/10 border border-brand-primary/20">
                            <GitFork size={18} className="text-brand-primary" />
                        </div>
                        <span className="flex items-center gap-1 text-[10px] font-bold text-brand-gold font-jetbrains tracking-wider">
                            <Activity size={10} className="animate-pulse" /> ENGINE
                        </span>
                    </div>
                    <p className="text-xs font-black font-jetbrains tracking-widest text-brand-muted uppercase mb-1">Fase Kompetisi</p>
                    <h2 className="text-base font-black text-brand-gold uppercase tracking-wider truncate font-jetbrains">
                        {stats?.statusBracket}
                    </h2>
                </div>

                {/* Kartu 4: Laporan Menunggu Verifikasi (Sengketa Skor) */}
                <div className="bg-brand-bg-light border border-brand-border rounded-2xl p-5 shadow-sm hover:shadow-brand transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2.5 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary">
                            <MessageSquareWarning size={18} />
                        </div>
                        {stats && stats.tiketOpen > 0 && (
                            <span className="flex items-center gap-1 text-[9px] font-black font-jetbrains bg-brand-primary px-2 py-0.5 rounded text-white shadow-sm animate-pulse">
                                ACTION
                            </span>
                        )}
                    </div>
                    <p className="text-xs font-black font-jetbrains tracking-widest text-brand-muted uppercase mb-1">Validasi Skor Masuk</p>
                    <h2 className="text-3xl font-black text-brand-dark">
                        {stats?.tiketOpen || 0} <span className="text-xs font-normal text-brand-muted font-sans">Laga</span>
                    </h2>
                </div>

            </div>

            {/* LIVE ACTION MONITORING LOG PANEL */}
            <div className="bg-brand-bg-light border border-brand-border rounded-2xl overflow-hidden shadow-sm">
                <div className="p-5 border-b border-brand-border flex justify-between items-center bg-brand-bg-surface/60">
                    <h3 className="font-jetbrains font-black uppercase text-brand-primary tracking-widest text-sm">
                        Status Alur Sinkronisasi Sirkuit
                    </h3>
                </div>
                <div className="p-5 flex flex-col gap-3 text-xs font-medium text-brand-muted leading-relaxed font-jetbrains">
                    <p className="flex items-center gap-2 text-brand-dark">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shadow-brand" />
                        Pendaftaran PENDING di Modul A-02: <span className="text-brand-primary font-black">{stats?.pendingRegistrations} Tim Baru</span>
                    </p>
                    <p className="flex items-center gap-2 text-brand-muted">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary" />
                        Total Pertandingan Selesai Dimainkan (COMPLETED): <span className="text-brand-dark font-bold">{stats?.matchBerjalan} Laga</span>
                    </p>
                </div>
            </div>
        </div>
    );
}