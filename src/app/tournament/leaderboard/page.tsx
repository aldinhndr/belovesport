// Path: src/app/tournament/leaderboard/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr'; // 🚀 IMPORT SWR UNTUK SINKRONISASI KLASEMEN LIVE
import { ArrowLeft, Bell, Trophy, Loader2, ShieldAlert, Award, Search, RefreshCw } from 'lucide-react';
import LogoutButtonParticipant from '@/components/participant/LogoutButton';

// Fetcher standar sirkuit turnamen BELOVEsPORT dengan credentials session
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

    // 🚀 LIVE POLLING CLASSIFICATION ENGINE: Ambil pembaruan klasemen grup otomatis tiap 30 detik
    const { data: resData, error, isLoading, mutate } = useSWR('/api/tournament/leaderboard', fetcher, {
        refreshInterval: 30000,
        revalidateOnFocus: true
    });

    const leaderboard = resData?.success ? resData.data : [];

    // Filter pencarian nama klub eFootball atau manajer
    const filteredLeaderboard = leaderboard.filter((team: any) =>
        team.teamName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-brand-bg-light text-brand-dark relative overflow-hidden pb-20 flex flex-col">
            {/* BACKGROUND EFFECTS */}
            <div className="fixed top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent z-40" />
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full opacity-[0.08] pointer-events-none blur-[110px]" style={{ background: 'radial-gradient(ellipse, #FCB335 0%, #82403B 55%, transparent 70%)' }} aria-hidden />
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #561B1D 0, #561B1D 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />

            {/* TOP NAVBAR */}
            <nav className="sticky top-0 z-50 border-b border-brand-border bg-brand-bg-light/85 backdrop-blur-xl shadow-sm">
                <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/profil" className="flex items-center gap-2 group">
                            <div className="w-7 h-7 rounded-md overflow-hidden flex items-center justify-center bg-brand-dark shadow-sm">
                                <img src="/logos/logo_BELOVESPORT.png" alt="Belovesport" className="w-full h-full object-cover" />
                            </div>
                            <span className="font-black text-sm tracking-widest uppercase text-brand-dark group-hover:text-brand-primary transition-colors">Belovesport</span>
                        </Link>
                        <span className="text-brand-muted/40 text-xs">/</span>
                        <span className="text-brand-primary text-xs font-black tracking-widest uppercase">Leaderboard</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button aria-label="Notifikasi" className="relative p-2 rounded-lg text-brand-muted hover:text-brand-dark hover:bg-brand-bg-surface transition-all">
                            <Bell size={16} />
                            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-gold" />
                        </button>
                        <LogoutButtonParticipant />
                    </div>
                </div>
            </nav>

            {/* SUB-HEADER */}
            <div className="relative z-20 border-b border-brand-border pt-8 pb-6 bg-gradient-to-b from-white to-brand-bg-light/40 px-4 md:px-8">
                <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
                    <div className="flex flex-col items-center sm:items-start">
                        <div className="flex items-center gap-3 mb-2">
                            <Link href="/profil" className="p-2 rounded-xl transition-all bg-white border border-brand-border hover:border-brand-gold shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50">
                                <ArrowLeft size={18} className="text-brand-secondary" />
                            </Link>
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-brand-dark shadow-lg">
                                <Award size={18} className="text-brand-gold" />
                            </div>
                            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight font-jetbrains text-brand-dark">
                                Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-gold">Leaderboard</span>
                            </h1>
                        </div>
                        <p className="text-brand-muted text-xs flex items-center gap-1.5 font-bold uppercase tracking-wider text-center sm:text-left">
                            <Trophy size={13} className="text-brand-gold" /> Akumulasi statistik performa seluruh tim arena
                        </p>
                    </div>

                    {/* LIVE CONNECTION STATUS BUTTON */}
                    <div className="flex items-center gap-3 px-4 py-2 rounded-xl text-[11px] font-black font-jetbrains tracking-wider shadow-sm border border-brand-primary/20 bg-brand-primary/5 text-brand-primary select-none shrink-0">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
                        </span>
                        LIVE CONNECTED
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="relative z-10 w-full max-w-4xl mx-auto px-4 mt-6 flex-1 flex flex-col">
                {isLoading && leaderboard.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-brand-primary">
                        <Loader2 size={40} className="animate-spin mb-4" />
                        <p className="font-jetbrains text-sm font-bold uppercase tracking-widest text-brand-muted">Sinkronisasi Papan Peringkat...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-2xl text-center flex flex-col items-center shadow-sm max-w-md mx-auto">
                        <ShieldAlert size={32} className="mb-3" />
                        <p className="font-bold text-xs uppercase tracking-wide">Jalur Sinkronisasi Terputus</p>
                        <p className="text-[11px] text-brand-muted mt-1">Gagal terhubung dengan database arena turnamen Belovesport.</p>
                    </div>
                ) : (
                    <>
                        {/* CONTROLS BAR */}
                        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mb-6">
                            <div className="relative shadow-sm flex-1 max-w-md">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Search size={16} className="text-brand-gold" />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari nama tim / manager..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-brand-border rounded-xl text-xs font-medium text-brand-dark placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-all"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() => mutate()}
                                disabled={isLoading}
                                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all bg-white border border-brand-border text-brand-dark hover:border-brand-primary/40 active:scale-95 disabled:opacity-50 shrink-0 shadow-sm"
                            >
                                <RefreshCw size={13} className={`text-brand-muted ${isLoading ? 'animate-spin text-brand-primary' : ''}`} />
                                {isLoading ? 'Menyelaraskan...' : 'Refresh'}
                            </button>
                        </div>

                        {/* TABEL RESPONSIVE DENGAN STICKY COLUMNS */}
                        <div className="bg-white rounded-2xl overflow-hidden border border-brand-border shadow-sm mb-12">
                            <div className="overflow-x-auto custom-scrollbar relative">
                                <table className="w-full text-left border-collapse min-w-[550px]">
                                    <thead>
                                        <tr className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 font-jetbrains border-b border-brand-border">
                                            <th className="py-3 px-3 font-bold text-center w-12 sticky left-0 bg-slate-50 z-20 shadow-[1px_0_0_#e5e7eb]">Rank</th>
                                            <th className="py-3 px-3 font-bold sticky left-[48px] bg-slate-50 z-20 shadow-[1px_0_0_#e5e7eb]">Klub / Manager</th>
                                            <th className="py-3 px-2 font-bold text-center w-10">M</th>
                                            <th className="py-3 px-2 font-bold text-center w-8">W</th>
                                            <th className="py-3 px-2 font-bold text-center w-8">D</th>
                                            <th className="py-3 px-2 font-bold text-center w-8">L</th>
                                            <th className="py-3 px-2 font-bold text-center w-10">GD</th>
                                            <th className="py-3 px-4 font-black text-brand-dark text-center w-14 bg-amber-50">PTS</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {filteredLeaderboard.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className="text-center py-12 text-xs font-medium text-brand-muted">
                                                    Tidak ada klub/manager yang cocok dengan pencarian Koko.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredLeaderboard.map((team: any, index: number) => {
                                                const rank = index + 1;

                                                // Efek Podium Top 3
                                                const rankBadge =
                                                    rank === 1 ? 'bg-amber-400 text-amber-950 shadow-sm font-black' :
                                                        rank === 2 ? 'bg-slate-300 text-slate-800 shadow-sm font-black' :
                                                            rank === 3 ? 'bg-amber-600 text-white shadow-sm font-black' :
                                                                'bg-slate-100 text-slate-500 border border-slate-200';

                                                return (
                                                    <tr key={team.id} className="border-b border-brand-border last:border-b-0 hover:bg-slate-50/50 transition-colors bg-white">
                                                        {/* Rank Sticky */}
                                                        <td className="py-2.5 px-3 text-center sticky left-0 z-10 bg-white shadow-[1px_0_0_#e5e7eb]">
                                                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-[11px] font-jetbrains ${rankBadge}`}>
                                                                {rank}
                                                            </span>
                                                        </td>

                                                        {/* Klub Sticky */}
                                                        <td className="py-2.5 px-3 sticky left-[48px] z-10 bg-white shadow-[1px_0_0_#e5e7eb] font-bold text-brand-dark truncate max-w-[150px]">
                                                            {team.teamName}
                                                        </td>

                                                        <td className="py-2.5 px-2 text-center text-slate-600 font-jetbrains text-xs font-semibold">{team.main}</td>
                                                        <td className="py-2.5 px-2 text-center text-emerald-600 font-jetbrains text-xs font-bold">{team.menang}</td>
                                                        <td className="py-2.5 px-2 text-center text-slate-500 font-jetbrains text-xs font-bold">{team.seri}</td>
                                                        <td className="py-2.5 px-2 text-center text-red-500 font-jetbrains text-xs font-bold">{team.kalah}</td>

                                                        <td className="py-2.5 px-2 text-center text-brand-dark font-jetbrains font-black text-xs">
                                                            {team.gd > 0 ? `+${team.gd}` : team.gd}
                                                        </td>

                                                        {/* PTS Highlight */}
                                                        <td className="py-2.5 px-4 text-center font-black text-brand-dark font-jetbrains text-sm bg-amber-50/60 shadow-[inset_1px_0_0_#fde68a,inset_-1px_0_0_#fde68a]">
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