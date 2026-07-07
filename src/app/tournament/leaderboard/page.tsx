// Path: src/app/tournament/leaderboard/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr'; // 🚀 IMPORT SWR UNTUK SINKRONISASI KLASEMEN LIVE
import { ArrowLeft, Trophy, Loader2, ShieldAlert, Award, Search, RefreshCw } from 'lucide-react';

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

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-[#0c0a09] text-zinc-900 dark:text-zinc-50 pb-24 flex flex-col antialiased">

            {/* ── BACKGROUND GLOW LAYER PREMIUM ── */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-gradient-to-b from-brand-primary/5 via-brand-gold/5 to-transparent pointer-events-none blur-3xl z-0" />

            {/* ── SUB-HEADER BARIS UTAMA ── */}
            <div className="relative z-10 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md">
                <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/profil"
                            className="p-2.5 rounded-xl transition-all bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-brand-gold dark:hover:border-brand-gold shadow-sm group">
                            <ArrowLeft size={16} className="text-zinc-500 group-hover:text-brand-primary transition-colors" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <Award size={18} className="text-brand-primary" />
                                <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-zinc-900 dark:text-white font-mono">
                                    Global <span className="text-brand-primary">Leaderboard</span>
                                </h1>
                            </div>
                            <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-1 flex items-center gap-1.5 font-medium">
                                <Trophy size={12} className="text-brand-gold shrink-0" />
                                Akumulasi Klasifikasi Seluruh Tim Arena Turnamen
                            </p>
                        </div>
                    </div>

                    {/* LIVE CONNECTION STATUS BUTTON */}
                    <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm border border-brand-primary/20 bg-brand-primary/5 text-brand-primary self-end sm:self-auto">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
                        </span>
                        LIVE CONNECTED
                    </div>
                </div>
            </div>

            {/* ── MAIN CONTENT ARENA ── */}
            <div className="relative z-10 w-full max-w-4xl mx-auto px-4 mt-6 flex-1 flex flex-col">
                {isLoading && leaderboard.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-40 text-brand-primary">
                        <Loader2 size={36} className="animate-spin mb-4" />
                        <p className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-400">Sinkronisasi Papan Peringkat...</p>
                    </div>
                ) : error ? (
                    <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 p-6 rounded-2xl text-center flex flex-col items-center shadow-sm max-w-md mx-auto mt-16">
                        <ShieldAlert size={28} className="mb-3 text-rose-500" />
                        <p className="font-bold text-xs uppercase tracking-wide">Jalur Sinkronisasi Terputus</p>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">Gagal terhubung dengan database arena turnamen BELOVESPORT.</p>
                    </div>
                ) : (
                    <>
                        {/* CONTROLS BAR */}
                        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mb-6">
                            <div className="relative flex-1 max-w-md">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Search size={14} className="text-zinc-400" />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari nama tim..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-medium text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-brand-primary dark:focus:border-brand-primary transition-all shadow-sm"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() => mutate()}
                                disabled={isLoading}
                                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 active:scale-95 disabled:opacity-50 shrink-0 shadow-sm"
                            >
                                <RefreshCw size={12} className={`${isLoading ? 'animate-spin text-brand-primary' : ''}`} />
                                {isLoading ? 'Sync...' : 'Refresh'}
                            </button>
                        </div>

                        {/* TABEL RESPONSIVE DENGAN STICKY COLUMNS */}
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm mb-12">
                            <div className="overflow-x-auto relative">
                                <table className="w-full text-left border-collapse min-w-[550px]">
                                    <thead>
                                        <tr className="bg-zinc-50 dark:bg-zinc-900 text-[10px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-bold border-b border-zinc-200 dark:border-zinc-800">
                                            <th className="py-3 px-3 text-center w-12 sticky left-0 bg-zinc-50 dark:bg-zinc-900 z-20 border-r border-zinc-200 dark:border-zinc-800">Rank</th>
                                            <th className="py-3 px-4 sticky left-[48px] bg-zinc-50 dark:bg-zinc-900 z-20 border-r border-zinc-200 dark:border-zinc-800">Klub / Tim</th>
                                            <th className="py-3 px-2 text-center w-10 font-mono">M</th>
                                            <th className="py-3 px-2 text-center w-8 font-mono">W</th>
                                            <th className="py-3 px-2 text-center w-8 font-mono">D</th>
                                            <th className="py-3 px-2 text-center w-8 font-mono">L</th>
                                            <th className="py-3 px-2 text-center w-10 font-mono">GD</th>
                                            <th className="py-3 px-4 text-center w-14 font-mono font-black text-brand-primary bg-zinc-50/40 dark:bg-zinc-800/40">PTS</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-xs font-medium">
                                        {filteredLeaderboard.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className="text-center py-16 text-zinc-400 dark:text-zinc-500 font-medium">
                                                    Tidak ada klub yang cocok dengan kata kunci pencarian.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredLeaderboard.map((team: any, index: number) => {
                                                const rank = index + 1;

                                                // ✨ Desain Premium Efek Medal Podium Top 3
                                                const rankBadge =
                                                    rank === 1 ? 'bg-amber-400 dark:bg-amber-500 text-amber-950 font-black' :
                                                        rank === 2 ? 'bg-zinc-300 dark:bg-zinc-400 text-zinc-950 font-black' :
                                                            rank === 3 ? 'bg-amber-700 dark:bg-amber-700 text-white font-black' :
                                                                'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 border border-zinc-200 dark:border-zinc-700';

                                                return (
                                                    <tr key={team.id} className="border-b border-zinc-100 dark:border-zinc-800/60 last:border-b-0 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40 transition-colors">

                                                        {/* Rank Sticky Column */}
                                                        <td className="py-3 px-3 text-center sticky left-0 z-10 bg-white dark:bg-zinc-900 border-r border-zinc-100 dark:border-zinc-800/60">
                                                            <span className={`inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-mono ${rankBadge}`}>
                                                                {rank}
                                                            </span>
                                                        </td>

                                                        {/* Klub Sticky Column */}
                                                        <td className="py-3 px-4 sticky left-[48px] z-10 bg-white dark:bg-zinc-900 border-r border-zinc-100 dark:border-zinc-800/60 font-bold text-zinc-800 dark:text-zinc-200 truncate max-w-[160px]">
                                                            {team.teamName}
                                                        </td>

                                                        {/* Statistik */}
                                                        <td className="py-3 px-2 text-center text-zinc-600 dark:text-zinc-400 font-mono font-semibold">{team.main}</td>
                                                        <td className="py-3 px-2 text-center text-emerald-500 font-mono font-bold">{team.menang}</td>
                                                        <td className="py-3 px-2 text-center text-zinc-400 dark:text-zinc-500 font-mono">{team.seri}</td>
                                                        <td className="py-3 px-2 text-center text-rose-500 font-mono">{team.kalah}</td>

                                                        <td className={`py-3 px-2 text-center font-mono font-bold ${team.gd > 0 ? 'text-emerald-500' : team.gd < 0 ? 'text-rose-500' : 'text-zinc-400'
                                                            }`}>
                                                            {team.gd > 0 ? `+${team.gd}` : team.gd}
                                                        </td>

                                                        {/* PTS Column (Highlighted) */}
                                                        <td className="py-3 px-4 text-center font-black font-mono text-sm bg-zinc-50/30 dark:bg-zinc-800/30 text-zinc-900 dark:text-white border-l border-zinc-100 dark:border-zinc-800/60">
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