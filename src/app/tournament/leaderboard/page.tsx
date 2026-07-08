// Path: src/app/tournament/leaderboard/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr'; // 🚀 IMPORT SWR UNTUK SINKRONISASI KLASEMEN LIVE
import { ArrowLeft, Trophy, Loader2, ShieldAlert, Award, Search, RefreshCw, Bell, Crown } from 'lucide-react';
import LogoutButtonParticipant from '@/components/participant/LogoutButton';

const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then((res) => {
    if (res.status === 401) {
        window.location.href = '/login';
        return;
    }
    if (!res.ok) throw new Error('Gagal memuat data peringkat sirkuit.');
    return res.json();
});

export default function GlobalLeaderboardPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const { data: resData, error, isLoading, mutate } = useSWR('/api/tournament/leaderboard', fetcher, {
        refreshInterval: 30000,
        revalidateOnFocus: true
    });

    const leaderboard = resData?.success ? resData.data : [];

    const filteredLeaderboard = leaderboard.filter((team: any) =>
        team.teamName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Status pill dinamis: mengikuti state sinkronisasi SWR yang sesungguhnya
    const statusLabel = error ? 'TERPUTUS' : isLoading ? 'SINKRONISASI' : 'LIVE CONNECTED';
    const statusColor = error
        ? 'border-red-200 bg-red-50 text-red-600'
        : 'border-brand-primary/20 bg-brand-primary/5 text-brand-primary';
    const statusDot = error ? 'bg-red-500' : 'bg-brand-primary';

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

            {/* 🌟 SUB-HEADER HALAMAN SPESIFIK */}
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
                                Global <span className="text-brand-primary">Leaderboard</span>
                            </h1>
                        </div>
                        <p className="text-brand-muted text-xs text-center md:text-left flex items-center justify-center md:justify-start gap-1.5 font-medium">
                            <Trophy size={13} className="text-brand-gold shrink-0" />
                            Akumulasi klasifikasi seluruh tim di arena turnamen Belovesport.
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

                        {/* TABEL RESPONSIVE DENGAN STICKY COLUMNS */}
                        <div className="bg-white border border-brand-border rounded-2xl overflow-hidden shadow-[0_1px_2px_rgba(24,24,27,0.05),0_10px_30px_-12px_rgba(86,27,29,0.12)] mb-12">
                            <div className="overflow-x-auto relative">
                                <table className="w-full text-left border-collapse min-w-[560px]">
                                    <thead>
                                        <tr className="bg-brand-bg-surface text-[10px] uppercase tracking-wider text-brand-muted font-black font-jetbrains border-b border-brand-border">
                                            <th className="py-3.5 px-3 text-center w-12 sticky left-0 bg-brand-bg-surface z-20 border-r border-brand-border">Rank</th>
                                            <th className="py-3.5 px-4 sticky left-[48px] bg-brand-bg-surface z-20 border-r border-brand-border">Klub / Tim</th>
                                            <th className="py-3.5 px-2 text-center w-10">M</th>
                                            <th className="py-3.5 px-2 text-center w-8">W</th>
                                            <th className="py-3.5 px-2 text-center w-8">D</th>
                                            <th className="py-3.5 px-2 text-center w-8">L</th>
                                            <th className="py-3.5 px-2 text-center w-10">GD</th>
                                            <th className="py-3.5 px-4 text-center w-14 font-black text-brand-primary bg-brand-gold/10">PTS</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-xs font-medium">
                                        {filteredLeaderboard.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className="text-center py-16 text-brand-muted font-medium">
                                                    Tidak ada klub yang cocok dengan kata kunci pencarian.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredLeaderboard.map((team: any, index: number) => {
                                                const rank = index + 1;

                                                // ✨ Rank Podium Premium — gradient emas/perak/perunggu sesuai brand
                                                const rankBadge =
                                                    rank === 1 ? 'bg-gradient-to-br from-brand-gold to-brand-bronze text-white font-black shadow-brand' :
                                                        rank === 2 ? 'bg-gradient-to-br from-zinc-300 to-zinc-400 text-zinc-900 font-black shadow-sm' :
                                                            rank === 3 ? 'bg-gradient-to-br from-brand-bronze to-brand-secondary text-white font-black shadow-sm' :
                                                                'bg-brand-bg-surface text-brand-muted border border-brand-border';

                                                const rowAccent = rank <= 3 ? 'bg-brand-gold/[0.03]' : '';

                                                return (
                                                    <tr key={team.id} className={`border-b border-brand-border last:border-b-0 hover:bg-brand-bg-surface/60 transition-colors ${rowAccent}`}>

                                                        {/* Rank Sticky Column */}
                                                        <td className="py-3 px-3 text-center sticky left-0 z-10 bg-white border-r border-brand-border">
                                                            <span className={`inline-flex items-center justify-center gap-0.5 w-6 h-6 rounded-lg text-[10px] font-jetbrains ${rankBadge}`}>
                                                                {rank === 1 ? <Crown size={11} className="fill-current" /> : rank}
                                                            </span>
                                                        </td>

                                                        {/* Klub Sticky Column */}
                                                        <td className="py-3 px-4 sticky left-[48px] z-10 bg-white border-r border-brand-border font-bold text-brand-dark truncate max-w-[160px]">
                                                            {team.teamName}
                                                        </td>

                                                        {/* Statistik */}
                                                        <td className="py-3 px-2 text-center text-brand-muted font-jetbrains font-semibold">{team.main}</td>
                                                        <td className="py-3 px-2 text-center text-emerald-600 font-jetbrains font-bold">{team.menang}</td>
                                                        <td className="py-3 px-2 text-center text-brand-muted font-jetbrains">{team.seri}</td>
                                                        <td className="py-3 px-2 text-center text-red-500 font-jetbrains">{team.kalah}</td>

                                                        <td className={`py-3 px-2 text-center font-jetbrains font-bold ${team.gd > 0 ? 'text-emerald-600' : team.gd < 0 ? 'text-red-500' : 'text-brand-muted'
                                                            }`}>
                                                            {team.gd > 0 ? `+${team.gd}` : team.gd}
                                                        </td>

                                                        {/* PTS Column (Highlighted) */}
                                                        <td className="py-3 px-4 text-center font-black font-jetbrains text-sm bg-brand-gold/[0.06] text-brand-primary border-l border-brand-border">
                                                            {team.poin}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}