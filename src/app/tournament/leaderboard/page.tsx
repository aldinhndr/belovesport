// Path: src/app/tournament/leaderboard/page.tsx
'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr'; // 🚀 IMPORT SWR UNTUK SINKRONISASI KLASEMEN LIVE
import { ArrowLeft, Trophy, Loader2, ShieldAlert, Award, Search, RefreshCw, Bell, Crown, Layers } from 'lucide-react';
import LogoutButtonParticipant from '@/components/participant/LogoutButton';

const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then((res) => {
    if (res.status === 401) {
        window.location.href = '/login';
        return;
    }
    if (!res.ok) throw new Error('Gagal memuat data peringkat sirkuit.');
    return res.json();
});

type TabKey = 'grup' | 'keseluruhan' | 'statistik';

const TABS: { key: TabKey; label: string }[] = [
    { key: 'grup', label: 'Grup' },
    { key: 'keseluruhan', label: 'Keseluruhan' },
    { key: 'statistik', label: 'Statistik' },
];

// Kartu statistik kecil (M / W / D / L / GD) yang tampil di sisi kanan setiap baris tim
function StatChip({ label, value, valueClass = 'text-brand-dark' }: { label: string; value: any; valueClass?: string }) {
    return (
        <span className="flex flex-col items-center w-6">
            <span className={`font-bold ${valueClass}`}>{value ?? '-'}</span>
            <span className="text-[8px] text-brand-muted/70 tracking-wider mt-0.5">{label}</span>
        </span>
    );
}

export default function GlobalLeaderboardPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<TabKey>('grup');
    const [selectedGroup, setSelectedGroup] = useState<string>('semua');

    const { data: resData, error, isLoading, mutate } = useSWR('/api/tournament/leaderboard', fetcher, {
        refreshInterval: 30000,
        revalidateOnFocus: true
    });

    const leaderboard = resData?.success ? resData.data : [];

    // Ambil label grup tim secara defensif — sesuaikan urutan field ini jika nama field API berbeda
    const getGroup = (team: any): string | null => team?.grup ?? team?.group ?? team?.pool ?? null;

    const groups = useMemo(() => {
        const set = new Set<string>();
        leaderboard.forEach((team: any) => {
            const g = getGroup(team);
            if (g) set.add(String(g));
        });
        return Array.from(set).sort((a, b) => a.localeCompare(b));
    }, [leaderboard]);

    const hasGroups = groups.length > 0;

    // Dataset dasar mengikuti tab aktif: per-grup, gabungan, atau diurutkan ulang berdasarkan selisih gol
    const baseList = useMemo(() => {
        if (activeTab === 'statistik') {
            return [...leaderboard].sort((a: any, b: any) => (b.gd ?? 0) - (a.gd ?? 0));
        }
        if (activeTab === 'grup' && hasGroups && selectedGroup !== 'semua') {
            return leaderboard.filter((team: any) => String(getGroup(team)) === selectedGroup);
        }
        return leaderboard;
    }, [leaderboard, activeTab, selectedGroup, hasGroups]);

    const filteredLeaderboard = baseList.filter((team: any) =>
        (team.teamName ?? '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Status pill dinamis: mengikuti state sinkronisasi SWR yang sesungguhnya
    const statusLabel = error ? 'TERPUTUS' : isLoading ? 'SINKRONISASI' : 'LIVE CONNECTED';
    const statusColor = error
        ? 'border-red-200 bg-red-50 text-red-600'
        : 'border-brand-primary/20 bg-brand-primary/5 text-brand-primary';
    const statusDot = error ? 'bg-red-500' : 'bg-brand-primary';

    const heading = {
        grup: {
            title: 'Klasemen Grup',
            subtitle: hasGroups && selectedGroup !== 'semua'
                ? `Peringkat tim di Grup ${selectedGroup}`
                : 'Peringkat tim pada masing-masing grup penyisihan.'
        },
        keseluruhan: {
            title: 'Klasemen Keseluruhan',
            subtitle: 'Akumulasi peringkat seluruh tim lintas grup di arena Belovesport.'
        },
        statistik: {
            title: 'Statistik Tim',
            subtitle: 'Diurutkan berdasarkan selisih gol (GD) terbaik musim ini.'
        }
    }[activeTab];

    return (
        <div className="min-h-screen bg-brand-bg-light text-brand-dark relative overflow-hidden pb-24 flex flex-col">

            {/* 🌟 EFEK CAHAYA & BACKGROUND PREMIUM — konsisten dengan halaman Bracket */}
            <div className="fixed top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/70 to-transparent z-40" />
            <div
                className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full opacity-[0.09] pointer-events-none blur-[110px]"
                style={{ background: 'radial-gradient(ellipse, #FCB335 0%, #82403B 55%, transparent 70%)' }}
                aria-hidden
            />
            <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{
                backgroundImage: 'repeating-linear-gradient(45deg, #561B1D 0, #561B1D 1px, transparent 0, transparent 50%)',
                backgroundSize: '20px 20px'
            }} />

            {/* 🌟 TOP NAVBAR GLOBAL (Konsisten di seluruh halaman tournament) */}
            <nav className="sticky top-0 z-50 border-b border-brand-border bg-brand-bg-light/85 backdrop-blur-xl shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/profil" className="flex items-center gap-2 group focus-visible:outline-none">
                            <div className="w-7 h-7 rounded-md overflow-hidden flex items-center justify-center bg-gradient-brand shadow-brand group-hover:scale-105 transition-transform">
                                <img
                                    src="/logos/logo_BELOVESPORT.png"
                                    alt="Belovesport"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <span className="font-black text-sm tracking-widest uppercase text-brand-dark group-hover:text-brand-primary transition-colors">Belovesport</span>
                        </Link>
                        <span className="text-brand-muted/40 text-xs" aria-hidden>/</span>
                        <span className="text-brand-muted text-xs font-bold font-jetbrains uppercase tracking-wider">Leaderboard</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            aria-label="Notifikasi"
                            className="relative p-2 rounded-lg text-brand-muted hover:text-brand-dark hover:bg-brand-bg-surface transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50"
                        >
                            <Bell size={16} />
                            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-gold shadow-[0_0_6px_rgba(252,179,53,0.8)]" aria-hidden />
                        </button>
                        <LogoutButtonParticipant />
                    </div>
                </div>
            </nav>

            {/* 🌟 SUB-HEADER HALAMAN SPESIFIK — judul & subjudul mengikuti tab aktif */}
            <div className="relative z-20 border-b border-brand-border pt-8 pb-6 bg-brand-bg-light/40">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-5">
                    <div>
                        <div className="flex items-center gap-3 mb-3 justify-center md:justify-start">
                            <Link href="/profil"
                                className="p-2 rounded-xl transition-all group mr-2 bg-brand-bg-surface border border-brand-border hover:border-brand-gold shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50">
                                <ArrowLeft size={18} className="text-brand-secondary group-hover:text-brand-primary transition-colors" />
                            </Link>

                            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-gradient-brand shadow-brand-lg">
                                <Award size={18} className="text-white" />
                            </div>

                            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight font-jetbrains text-brand-dark">
                                {heading.title}
                            </h1>
                        </div>
                        <p className="text-brand-muted text-xs text-center md:text-left flex items-center justify-center md:justify-start gap-1.5 font-medium">
                            <Trophy size={13} className="text-brand-gold shrink-0" />
                            {heading.subtitle}
                        </p>
                    </div>

                    {/* INDIKATOR LIVE KONEKSI UTAMA */}
                    <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-black font-jetbrains tracking-widest shadow-sm border transition-all hover:scale-105 hover:shadow-brand cursor-default shrink-0 ${statusColor}`}>
                        <span className="relative flex h-2.5 w-2.5">
                            {!error && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${statusDot}`}></span>}
                            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${statusDot}`}></span>
                        </span>
                        {statusLabel}
                    </div>
                </div>
            </div>

            {/* ── MAIN CONTENT ARENA ── */}
            <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex-1 flex flex-col">
                {isLoading && leaderboard.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-40 text-brand-primary">
                        <Loader2 size={40} className="animate-spin mb-4" />
                        <p className="font-jetbrains text-xs font-bold uppercase tracking-widest text-brand-muted">Sinkronisasi Papan Peringkat...</p>
                    </div>
                ) : error ? (
                    <div className="bg-white border border-red-200 text-red-600 p-8 rounded-2xl text-center flex flex-col items-center shadow-sm max-w-md mx-auto mt-16">
                        <ShieldAlert size={30} className="mb-3 text-red-500" />
                        <p className="font-black text-xs uppercase tracking-wide font-jetbrains">Jalur Sinkronisasi Terputus</p>
                        <p className="text-[11px] text-brand-muted mt-1.5">Gagal terhubung dengan database arena turnamen Belovesport.</p>
                        <button
                            type="button"
                            onClick={() => mutate()}
                            className="mt-5 flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-brand text-white shadow-brand hover:shadow-brand-lg active:scale-95 transition-all"
                        >
                            <RefreshCw size={13} /> Coba Sambungkan Ulang
                        </button>
                    </div>
                ) : (
                    <>
                        {/* SEGMENTED TAB SWITCHER — Grup / Keseluruhan / Statistik */}
                        <div className="bg-brand-bg-surface p-1.5 rounded-full mb-5 flex items-center gap-1 border border-brand-border">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`flex-1 py-2.5 rounded-full text-xs sm:text-sm font-bold font-jetbrains uppercase tracking-wide transition-all duration-300 ${activeTab === tab.key
                                        ? 'bg-gradient-brand text-white shadow-brand'
                                        : 'text-brand-muted hover:text-brand-dark'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* FILTER GRUP — hanya tampil di tab Grup, dan hanya bila API mengirim data grup */}
                        {activeTab === 'grup' && hasGroups && (
                            <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                <button
                                    type="button"
                                    onClick={() => setSelectedGroup('semua')}
                                    className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-bold font-jetbrains uppercase tracking-wide border transition-all ${selectedGroup === 'semua'
                                        ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                                        : 'bg-white text-brand-muted border-brand-border hover:border-brand-gold hover:text-brand-dark'
                                        }`}
                                >
                                    <Layers size={12} /> Semua Grup
                                </button>
                                {groups.map((g) => (
                                    <button
                                        key={g}
                                        type="button"
                                        onClick={() => setSelectedGroup(g)}
                                        className={`shrink-0 px-4 py-2 rounded-full text-[11px] font-bold font-jetbrains uppercase tracking-wide border transition-all ${selectedGroup === g
                                            ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                                            : 'bg-white text-brand-muted border-brand-border hover:border-brand-gold hover:text-brand-dark'
                                            }`}
                                    >
                                        Grup {g}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* CONTROLS BAR */}
                        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mb-6">
                            <div className="relative flex-1 max-w-md">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Search size={14} className="text-brand-muted" />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari nama tim..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-brand-border rounded-xl text-xs font-medium text-brand-dark placeholder:text-brand-muted/70 focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-all shadow-sm"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() => mutate()}
                                disabled={isLoading}
                                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all bg-white border border-brand-border text-brand-dark hover:border-brand-gold hover:text-brand-primary active:scale-95 disabled:opacity-50 shrink-0 shadow-sm"
                            >
                                <RefreshCw size={12} className={isLoading ? 'animate-spin text-brand-primary' : ''} />
                                {isLoading ? 'Sync...' : 'Refresh'}
                            </button>
                        </div>

                        {/* DAFTAR KARTU TIM */}
                        {filteredLeaderboard.length === 0 ? (
                            <div className="text-center py-16 px-6 rounded-2xl border border-dashed border-brand-border bg-white/60 mb-12">
                                <p className="text-sm font-bold text-brand-dark mb-1">Tidak ada tim ditemukan</p>
                                <p className="text-xs text-brand-muted">Coba ubah kata kunci pencarian atau pilih grup lain.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2.5 mb-12">
                                {filteredLeaderboard.map((team: any, index: number) => {
                                    const rank = index + 1;
                                    const isTop3 = rank <= 3;

                                    const rankBadge =
                                        rank === 1 ? 'bg-gradient-to-br from-brand-gold to-brand-bronze text-white shadow-brand' :
                                            rank === 2 ? 'bg-gradient-to-br from-zinc-300 to-zinc-400 text-zinc-900' :
                                                rank === 3 ? 'bg-gradient-to-br from-brand-bronze to-brand-secondary text-white' :
                                                    'bg-brand-bg-surface text-brand-muted border border-brand-border';

                                    const gd = team.gd ?? 0;
                                    const gdColor = gd > 0 ? 'text-emerald-600' : gd < 0 ? 'text-red-500' : 'text-brand-muted';
                                    const gdDisplay = gd > 0 ? `+${gd}` : `${gd}`;
                                    const teamGroup = getGroup(team);

                                    const highlightValue = activeTab === 'statistik' ? gdDisplay : team.poin;
                                    const highlightLabel = activeTab === 'statistik' ? 'GD' : 'PTS';

                                    return (
                                        <div
                                            key={team.id}
                                            className={`relative overflow-hidden rounded-2xl border p-3.5 sm:p-4 flex items-center gap-3 sm:gap-4 transition-all hover:shadow-sm ${isTop3 ? 'bg-white border-brand-border shadow-[0_1px_2px_rgba(24,24,27,0.04)]' : 'bg-brand-bg-surface/40 border-brand-border'
                                                }`}
                                        >
                                            {isTop3 && (
                                                <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-gold to-brand-bronze" aria-hidden />
                                            )}

                                            {/* Rank */}
                                            <span className={`inline-flex items-center justify-center w-7 h-7 shrink-0 rounded-lg text-[11px] font-jetbrains font-black ${rankBadge}`}>
                                                {rank === 1 ? <Crown size={12} className="fill-current" /> : rank}
                                            </span>

                                            {/* Crest tim */}
                                            <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-brand-border bg-white flex items-center justify-center overflow-hidden shrink-0">
                                                {team.logoUrl ? (
                                                    <img src={team.logoUrl} alt={team.teamName} className="w-full h-full object-contain" />
                                                ) : (
                                                    <span className="font-jetbrains font-black text-brand-primary text-[10px]">
                                                        {(team.teamName ?? '?').slice(0, 2).toUpperCase()}
                                                    </span>
                                                )}
                                            </span>

                                            {/* Nama tim */}
                                            <span className="flex-1 min-w-0">
                                                <span className={`block truncate text-sm ${isTop3 ? 'font-black text-brand-dark' : 'font-bold text-brand-dark/90'}`}>
                                                    {team.teamName}
                                                </span>
                                                {activeTab !== 'grup' && teamGroup && (
                                                    <span className="block text-[10px] font-jetbrains uppercase tracking-wide text-brand-muted mt-0.5">
                                                        Grup {teamGroup}
                                                    </span>
                                                )}
                                            </span>

                                            {/* Statistik ringkas (M / W / D / L / GD) — tersembunyi di layar sempit */}
                                            <span className="hidden md:flex items-center gap-3 font-jetbrains text-[11px] text-brand-muted shrink-0">
                                                <StatChip label="M" value={team.main} />
                                                <StatChip label="W" value={team.menang} valueClass="text-emerald-600" />
                                                <StatChip label="D" value={team.seri} />
                                                <StatChip label="L" value={team.kalah} valueClass="text-red-500" />
                                                {activeTab !== 'statistik' && (
                                                    <StatChip label="GD" value={gdDisplay} valueClass={gdColor} />
                                                )}
                                            </span>

                                            {/* Kotak nilai utama (PTS atau GD tergantung tab) */}
                                            <span className="text-center px-3 py-1.5 rounded-xl bg-brand-gold/10 border border-brand-gold/20 shrink-0 min-w-[52px]">
                                                <span className={`block font-jetbrains font-black text-sm leading-none ${activeTab === 'statistik' ? gdColor : 'text-brand-primary'}`}>
                                                    {highlightValue}
                                                </span>
                                                <span className="block text-[8px] uppercase tracking-wider text-brand-muted font-bold mt-1">
                                                    {highlightLabel}
                                                </span>
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}