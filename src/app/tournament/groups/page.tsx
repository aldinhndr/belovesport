// Path: src/app/tournament/groups/page.tsx
'use client';

import useSWR from 'swr';
import Link from 'next/link';
import { LayoutGrid, Loader2, ArrowLeft, Trophy, Info, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

interface TeamStanding {
    id: string;
    name: string;
    isTbd: boolean;
    main: number;
    menang: number;
    seri: number;
    kalah: number;
    gf: number;
    ga: number;
    gd: number;
    poin: number;
    form: ('W' | 'D' | 'L')[];
}

const MAX_MATCHES_PER_TEAM = 3;

const getInitials = (name: string) => {
    if (!name || name === 'TBD') return '?';
    const words = name.trim().split(/\s+/);
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
};

const CREST_PALETTE = ['#561B1D', '#82403B', '#CD8133', '#B45309', '#0F766E', '#1D4ED8', '#7C3AED', '#BE185D'];
const getCrestColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return CREST_PALETTE[Math.abs(hash) % CREST_PALETTE.length];
};

const FormBadge = ({ result }: { result: 'W' | 'D' | 'L' }) => {
    const style = {
        W: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        D: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
        L: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    }[result];
    return (
        <span className={`w-5 h-5 rounded-md border flex items-center justify-center text-[10px] font-black font-mono shadow-sm ${style}`}>
            {result}
        </span>
    );
};

const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then((res) => {
    if (res.status === 401) {
        window.location.href = '/login';
        return;
    }
    return res.json();
});

export default function GroupsPage() {
    const { data: resData, error, isLoading, mutate } = useSWR('/api/tournament/groups', fetcher, {
        refreshInterval: 30000,
        revalidateOnFocus: true
    });

    const standings = resData?.success ? resData.data : {};
    const errorMsg = error ? 'Gagal terhubung ke server arena.' : (!resData?.success && resData?.message ? resData.message : '');
    const groupNames = Object.keys(standings);

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-[#0c0a09] text-zinc-900 dark:text-zinc-50 pb-24 flex flex-col antialiased">

            {/* ── BACKGROUND GLOW LAYER PREMIUM ── */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-gradient-to-b from-brand-primary/5 via-brand-gold/5 to-transparent pointer-events-none blur-3xl z-0" />

            {/* ── SUB-HEADER BARIS UTAMA ── */}
            <div className="relative z-10 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/profil"
                            className="p-2.5 rounded-xl transition-all bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-brand-gold dark:hover:border-brand-gold shadow-sm group">
                            <ArrowLeft size={16} className="text-zinc-500 group-hover:text-brand-primary transition-colors" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <LayoutGrid size={18} className="text-brand-primary" />
                                <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-zinc-900 dark:text-white font-mono">
                                    Group <span className="text-brand-primary">Stage</span>
                                </h1>
                            </div>
                            <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-1 flex items-center gap-1.5 font-medium">
                                <Trophy size={12} className="text-brand-gold shrink-0" />
                                16 Grup • 4 tim per grup • Top 2 Melaju ke Knockout
                            </p>
                        </div>
                    </div>

                    {/* INTERACTIVE CONTROLS BOX */}
                    <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                        <button
                            type="button"
                            onClick={() => mutate()}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 active:scale-95 disabled:opacity-50 shadow-sm"
                        >
                            <RefreshCw size={12} className={`${isLoading ? 'animate-spin text-brand-primary' : ''}`} />
                            {isLoading ? 'Sync...' : 'Refresh'}
                        </button>

                        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm border border-emerald-500/20 bg-emerald-500/5 text-emerald-500">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            LIVE POLLING
                        </div>
                    </div>
                </div>
            </div>

            {/* ── MAIN CONTENT ARENA ── */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 flex-1">

                {isLoading && groupNames.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-40 text-brand-primary">
                        <Loader2 size={36} className="animate-spin mb-4" />
                        <p className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-400">Menyelaraskan Papan Klasemen...</p>
                    </div>
                ) : errorMsg ? (
                    <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 p-6 rounded-2xl text-center max-w-md mx-auto mt-16 shadow-sm">
                        <p className="text-sm font-bold">{errorMsg}</p>
                    </div>
                ) : (
                    <>
                        {/* LEGEND PENJELASAN POSISI */}
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5 mb-6 text-xs font-medium bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl shadow-sm text-zinc-500 dark:text-zinc-400">
                            <div className="flex items-center gap-1.5 font-bold text-zinc-900 dark:text-white">
                                <Info size={14} className="text-brand-primary" /> Keterangan:
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-sm"></div> Lolos Fase Gugur (Top 2)
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 bg-zinc-300 dark:bg-zinc-700 rounded-sm"></div> Tereliminasi
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-4 h-4 rounded border border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-[9px]">?</span> Belum Diundi
                            </div>
                        </div>

                        {/* GRID 16 GRUP UTAMA */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-8 animate-in fade-in duration-300">
                            {groupNames.map((gName) => {
                                const teams = standings[gName] || [];
                                const matchesPlayed = teams.reduce((sum: number, t: TeamStanding) => sum + t.main, 0) / 2;
                                const totalMatches = 6;
                                const isGroupComplete = matchesPlayed >= totalMatches;

                                return (
                                    <div key={gName} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200">

                                        {/* Header Tabel Grup */}
                                        <div className="bg-zinc-50 dark:bg-zinc-900 px-5 py-3.5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                                            <h2 className="text-sm font-black uppercase font-mono text-zinc-900 dark:text-white tracking-wider flex items-center gap-2">
                                                <span className="w-1.5 h-3 bg-brand-primary rounded-sm block"></span>
                                                GRUP {gName}
                                            </h2>
                                            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wide bg-zinc-200/60 dark:bg-zinc-800 px-2 py-0.5 rounded">
                                                {matchesPlayed} / {totalMatches} LAGA
                                            </span>
                                        </div>

                                        {/* Tabel Responsif */}
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse min-w-[600px]">
                                                <thead>
                                                    <tr className="bg-zinc-50/50 dark:bg-zinc-900/50 text-[10px] uppercase tracking-wider text-zinc-400 font-bold border-b border-zinc-200 dark:border-zinc-800">
                                                        <th className="py-2 px-3 text-center w-10">Pos</th>
                                                        <th className="py-2 px-3">Klub</th>
                                                        <th className="py-2 px-2 text-center w-8" title="Main">M</th>
                                                        <th className="py-2 px-2 text-center w-8" title="Menang">W</th>
                                                        <th className="py-2 px-2 text-center w-8" title="Seri">D</th>
                                                        <th className="py-2 px-2 text-center w-8" title="Kalah">L</th>
                                                        <th className="py-2 px-2 text-center w-8" title="Gol Memasukkan">GF</th>
                                                        <th className="py-2 px-2 text-center w-8" title="Gol Kemasukan">GA</th>
                                                        <th className="py-2 px-2 text-center w-10" title="Selisih Gol">GD</th>
                                                        <th className="py-2 px-3 text-center w-12 text-brand-primary font-black bg-zinc-50/30 dark:bg-zinc-800/30" title="Poin">PTS</th>
                                                        <th className="py-2 px-3 text-center w-24" title="Form 3 Laga Terakhir">FORM</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-xs font-medium">
                                                    {teams.map((team: TeamStanding, index: number) => {
                                                        const isQualified = index < 2;
                                                        const isEliminated = index >= 2 && isGroupComplete;

                                                        return (
                                                            <tr key={team.id} className={`relative border-b border-zinc-100 dark:border-zinc-800/60 last:border-b-0 transition-colors hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40 ${team.isTbd ? 'opacity-40' : ''
                                                                }`}>

                                                                {/* Garis Kiri Status */}
                                                                {!team.isTbd && (
                                                                    <td className={`absolute left-0 top-0 bottom-0 w-[3px] ${isQualified ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-700'
                                                                        }`} />
                                                                )}

                                                                {/* Posisi */}
                                                                <td className="py-3 px-3 text-center">
                                                                    <span className={`inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-black font-mono ${isQualified && !team.isTbd
                                                                            ? 'bg-emerald-500 text-white'
                                                                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500'
                                                                        }`}>
                                                                        {index + 1}
                                                                    </span>
                                                                </td>

                                                                {/* Nama Klub */}
                                                                <td className="py-3 px-3">
                                                                    <div className="flex items-center gap-2.5">
                                                                        {team.isTbd ? (
                                                                            <span className="w-6 h-6 rounded-full border border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-[9px] text-zinc-400 font-mono shrink-0">?</span>
                                                                        ) : (
                                                                            <span
                                                                                className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black font-mono text-white shrink-0 shadow-sm"
                                                                                style={{ backgroundColor: getCrestColor(team.name) }}
                                                                            >
                                                                                {getInitials(team.name)}
                                                                            </span>
                                                                        )}
                                                                        <span className={`font-bold truncate max-w-[130px] ${team.isTbd ? 'text-zinc-400 italic' : 'text-zinc-800 dark:text-zinc-200'
                                                                            }`}>
                                                                            {team.name}
                                                                        </span>
                                                                        {!team.isTbd && isQualified && isGroupComplete && (
                                                                            <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                                                                        )}
                                                                        {!team.isTbd && isEliminated && (
                                                                            <XCircle size={13} className="text-zinc-400 dark:text-zinc-500 shrink-0" />
                                                                        )}
                                                                    </div>
                                                                </td>

                                                                {/* Statistik Gol & Laga */}
                                                                <td className="py-3 px-2 text-center text-zinc-600 dark:text-zinc-400 font-mono font-semibold">
                                                                    {team.main}
                                                                </td>
                                                                <td className="py-3 px-2 text-center text-zinc-500 dark:text-zinc-400 font-mono">
                                                                    {team.menang}
                                                                </td>
                                                                <td className="py-3 px-2 text-center text-zinc-500 dark:text-zinc-400 font-mono">
                                                                    {team.seri}
                                                                </td>
                                                                <td className="py-3 px-2 text-center text-zinc-500 dark:text-zinc-400 font-mono">
                                                                    {team.kalah}
                                                                </td>
                                                                <td className="py-3 px-2 text-center text-zinc-500 dark:text-zinc-400 font-mono">
                                                                    {team.gf}
                                                                </td>
                                                                <td className="py-3 px-2 text-center text-zinc-500 dark:text-zinc-400 font-mono">
                                                                    {team.ga}
                                                                </td>
                                                                <td className={`py-3 px-2 text-center font-mono font-bold ${team.gd > 0 ? 'text-emerald-500' : team.gd < 0 ? 'text-rose-500' : 'text-zinc-400'
                                                                    }`}>
                                                                    {team.gd > 0 ? `+${team.gd}` : team.gd}
                                                                </td>

                                                                {/* Poin Utama (Highlight) */}
                                                                <td className="py-3 px-3 text-center font-black font-mono text-sm bg-zinc-50/40 dark:bg-zinc-800/30 text-zinc-900 dark:text-white border-x border-zinc-100 dark:border-zinc-800/60">
                                                                    {team.poin}
                                                                </td>

                                                                {/* Form terakhir */}
                                                                <td className="py-3 px-3">
                                                                    <div className="flex items-center justify-center gap-1">
                                                                        {team.form.length === 0 ? (
                                                                            <span className="text-zinc-400 font-mono">-</span>
                                                                        ) : (
                                                                            team.form.map((r, i) => <FormBadge key={i} result={r} />)
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}