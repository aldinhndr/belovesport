// Path: src/app/tournament/groups/page.tsx
'use client';

import useSWR from 'swr'; // 🚀 IMPORT SWR UNTUK LIVE STANDINGS
import Link from 'next/link';
import { LayoutGrid, Loader2, ArrowLeft, Bell, ShieldAlert, Trophy, Info, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import LogoutButtonParticipant from '@/components/participant/LogoutButton';

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

const MAX_MATCHES_PER_TEAM = 3; // round robin 4 tim = 3 laga per tim

// Ambil inisial nama tim untuk "crest" bulat (maks 2 huruf)
const getInitials = (name: string) => {
    if (!name || name === 'TBD') return '?';
    const words = name.trim().split(/\s+/);
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
};

// Warna crest deterministik dari nama, biar tiap tim punya warna beda tapi konsisten
const CREST_PALETTE = ['#561B1D', '#82403B', '#CD8133', '#B45309', '#0F766E', '#1D4ED8', '#7C3AED', '#BE185D'];
const getCrestColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return CREST_PALETTE[Math.abs(hash) % CREST_PALETTE.length];
};

const FormBadge = ({ result }: { result: 'W' | 'D' | 'L' }) => {
    const style = {
        W: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        D: 'bg-slate-100 text-slate-500 border-slate-200',
        L: 'bg-red-50 text-red-600 border-red-200',
    }[result];
    return (
        <span className={`w-5 h-5 rounded-md border flex items-center justify-center text-[9px] font-black font-jetbrains ${style}`}>
            {result}
        </span>
    );
};

// Fetcher Standard Sirkuit BELOVEsPORT dengan Kredensial Kuki
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then((res) => {
    if (res.status === 401) {
        window.location.href = '/login';
        return;
    }
    return res.json();
});

export default function GroupsPage() {
    // 🚀 LIVE POLLING ENGINE: Ambil pembaruan struktur 16 grup otomatis tiap 30 detik
    const { data: resData, error, isLoading, mutate } = useSWR('/api/tournament/groups', fetcher, {
        refreshInterval: 30000,
        revalidateOnFocus: true
    });

    const standings = resData?.success ? resData.data : {};
    const errorMsg = error ? 'Gagal terhubung ke server arena.' : (!resData?.success && resData?.message ? resData.message : '');
    const groupNames = Object.keys(standings);

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
                        <span className="text-brand-muted text-xs font-medium">Group Stage</span>
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

            {/* 🌟 SUB-HEADER HALAMAN SPESIFIK */}
            <div className="relative z-20 border-b border-brand-border pt-8 pb-6 bg-brand-bg-light/40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-5">
                    <div>
                        <div className="flex items-center gap-3 mb-3 justify-center md:justify-start">
                            <Link href="/profil"
                                className="p-2 rounded-xl transition-all group mr-2 bg-brand-bg-surface border border-brand-border hover:border-brand-gold shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50">
                                <ArrowLeft size={18} className="text-brand-secondary group-hover:text-brand-primary transition-colors" />
                            </Link>

                            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-gradient-brand shadow-brand">
                                <LayoutGrid size={18} className="text-white" />
                            </div>

                            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight font-jetbrains text-brand-dark">
                                Group <span className="text-brand-primary">Stage</span>
                            </h1>
                        </div>
                        <p className="text-brand-muted text-xs text-center md:text-left flex items-center justify-center md:justify-start gap-1.5 font-medium">
                            <Trophy size={13} className="text-brand-gold shrink-0" />
                            16 Grup · 4 tim per grup · Top 2 klasemen berhak melaju ke Babak Knockout.
                        </p>
                    </div>

                    {/* INTERACTIVE CONTROLS BOX */}
                    <div className="flex items-center gap-3 shrink-0">
                        <button
                            type="button"
                            onClick={() => mutate()}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all bg-white border border-brand-border text-brand-dark hover:border-brand-primary/40 active:scale-95 disabled:opacity-50 shadow-sm"
                        >
                            <RefreshCw size={13} className={`text-brand-muted ${isLoading ? 'animate-spin text-brand-primary' : ''}`} />
                            {isLoading ? 'Menyelaraskan...' : 'Perbarui Klasemen'}
                        </button>

                        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-black font-jetbrains tracking-widest shadow-sm border border-brand-primary/20 bg-brand-primary/5 text-brand-primary transition-all hover:scale-105 cursor-default">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-60"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-primary"></span>
                            </span>
                            LIVE STANDINGS
                        </div>
                    </div>
                </div>
            </div>

            {/* KONTEN KLASEMEN */}
            <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 md:px-8 mt-8 flex-1">

                {isLoading && groupNames.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-brand-primary">
                        <Loader2 size={40} className="animate-spin mb-4" />
                        <p className="font-jetbrains text-sm font-bold uppercase tracking-widest text-brand-muted">Memuat Papan Klasemen...</p>
                    </div>
                ) : errorMsg ? (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-2xl text-center max-w-md mx-auto mt-20 flex flex-col items-center shadow-sm">
                        <ShieldAlert size={32} className="mb-3" />
                        <p className="font-bold">{errorMsg}</p>
                    </div>
                ) : groupNames.length === 0 ? (
                    <div className="text-center py-32 border border-dashed border-brand-border rounded-3xl bg-brand-bg-surface shadow-sm">
                        <LayoutGrid size={48} className="mx-auto text-brand-secondary/60 mb-4" />
                        <h3 className="text-xl font-bold text-brand-dark uppercase font-jetbrains mb-2">Data Grup Tidak Tersedia</h3>
                        <p className="text-sm text-brand-muted">Terjadi kendala saat memuat struktur grup. Coba muat ulang halaman.</p>
                    </div>
                ) : (
                    <>
                        {/* LEGEND PENJELASAN POSISI */}
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 mb-6 text-xs font-jetbrains bg-white border border-brand-border p-4 rounded-xl shadow-sm">
                            <div className="flex items-center gap-2 font-bold text-brand-dark">
                                <Info size={14} className="text-brand-primary" /> Keterangan:
                            </div>
                            <div className="flex items-center gap-2 text-brand-muted">
                                <div className="w-3 h-3 bg-emerald-500 rounded-sm"></div> Lolos ke Fase Gugur (Top 2)
                            </div>
                            <div className="flex items-center gap-2 text-brand-muted">
                                <div className="w-3 h-3 bg-red-400 rounded-sm"></div> Tereliminasi
                            </div>
                            <div className="flex items-center gap-2 text-brand-muted">
                                <span className="w-5 h-5 rounded-md border border-dashed border-slate-300 flex items-center justify-center text-[8px]">?</span> Tim Belum Diundi
                            </div>
                        </div>

                        {/* GRID 16 GRUP */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 xl:gap-8 animate-in fade-in duration-300">
                            {groupNames.map((gName) => {
                                const teams = standings[gName] || [];
                                const matchesPlayed = teams.reduce((sum: number, t: TeamStanding) => sum + t.main, 0) / 2;
                                const totalMatches = 6;
                                const isGroupComplete = matchesPlayed >= totalMatches;

                                return (
                                    <div key={gName} className="bg-white border border-brand-border rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(24,24,27,0.06),0_8px_24px_-8px_rgba(24,24,27,0.08)] transition-all duration-300 hover:shadow-[0_1px_3px_rgba(24,24,27,0.08),0_16px_40px_-12px_rgba(86,27,29,0.18)] hover:-translate-y-0.5">

                                        {/* Header Tabel Grup */}
                                        <div className="bg-gradient-brand px-5 py-3 flex items-center justify-between">
                                            <h2 className="text-base font-black uppercase font-jetbrains text-white tracking-widest flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-brand-gold"></div>
                                                GRUP {gName}
                                            </h2>
                                            <span className="text-[10px] font-jetbrains font-bold text-white/70 uppercase tracking-wide">
                                                {matchesPlayed}/{totalMatches} Laga
                                            </span>
                                        </div>

                                        {/* Tabel Responsif */}
                                        <div className="overflow-x-auto custom-scrollbar">
                                            <table className="w-full text-left border-collapse min-w-[560px]">
                                                <thead>
                                                    <tr className="bg-brand-bg-surface text-[10px] uppercase tracking-wider text-brand-muted font-jetbrains border-b border-brand-border">
                                                        <th className="py-2.5 px-4 font-bold text-center w-10">Pos</th>
                                                        <th className="py-2.5 px-3 font-bold">Klub</th>
                                                        <th className="py-2.5 px-2 font-bold text-center w-8" title="Main">M</th>
                                                        <th className="py-2.5 px-2 font-bold text-center w-8" title="Menang">W</th>
                                                        <th className="py-2.5 px-2 font-bold text-center w-8" title="Seri">D</th>
                                                        <th className="py-2.5 px-2 font-bold text-center w-8" title="Kalah">L</th>
                                                        <th className="py-2.5 px-2 font-bold text-center w-8" title="Gol Memasukkan">GF</th>
                                                        <th className="py-2.5 px-2 font-bold text-center w-8" title="Gol Kemasukan">GA</th>
                                                        <th className="py-2.5 px-2 font-bold text-center w-10" title="Selisih Gol">GD</th>
                                                        <th className="py-2.5 px-4 font-black text-brand-primary text-center w-12" title="Poin">PTS</th>
                                                        <th className="py-2.5 px-3 font-bold text-center w-24" title="Form 3 Laga Terakhir">FORM</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-sm">
                                                    {teams.map((team: TeamStanding, index: number) => {
                                                        const isQualified = index < 2;
                                                        const isEliminated = index >= 2 && isGroupComplete;

                                                        return (
                                                            <tr key={team.id} className={`relative border-b border-brand-border last:border-b-0 transition-colors hover:bg-brand-bg-surface ${team.isTbd ? 'opacity-50' : isQualified ? 'bg-emerald-50/50' : isEliminated ? 'bg-red-50/40' : ''
                                                                }`}>

                                                                {/* Garis Kiri Status: hijau lolos, merah tereliminasi */}
                                                                {!team.isTbd && isQualified && (
                                                                    <td className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></td>
                                                                )}
                                                                {!team.isTbd && isEliminated && (
                                                                    <td className="absolute left-0 top-0 bottom-0 w-1 bg-red-400"></td>
                                                                )}

                                                                <td className="py-3 px-4 text-center">
                                                                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-xs font-black font-jetbrains ${isQualified && !team.isTbd ? 'bg-emerald-500 text-white shadow-sm' : 'bg-brand-bg-surface border border-brand-border text-brand-muted'}`}>
                                                                        {index + 1}
                                                                    </span>
                                                                </td>
                                                                <td className="py-3 px-3">
                                                                    <div className="flex items-center gap-2.5">
                                                                        {team.isTbd ? (
                                                                            <span className="w-7 h-7 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400 font-jetbrains shrink-0">?</span>
                                                                        ) : (
                                                                            <span
                                                                                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black font-jetbrains text-white shrink-0 shadow-sm"
                                                                                style={{ backgroundColor: getCrestColor(team.name) }}
                                                                            >
                                                                                {getInitials(team.name)}
                                                                            </span>
                                                                        )}
                                                                        <span className={`font-bold truncate max-w-[140px] ${team.isTbd ? 'text-slate-400 italic' : isQualified ? 'text-brand-dark' : 'text-brand-muted'}`}>
                                                                            {team.name}
                                                                        </span>
                                                                        {!team.isTbd && isQualified && isGroupComplete && (
                                                                            <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                                                                        )}
                                                                        {!team.isTbd && isEliminated && (
                                                                            <XCircle size={14} className="text-red-600 shrink-0" />
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td className="py-3 px-2 text-center text-black font-semibold font-jetbrains text-sm">
                                                                    {team.main}/{MAX_MATCHES_PER_TEAM}
                                                                </td>
                                                                <td className="py-3 px-2 text-center text-black font-medium font-jetbrains text-sm">
                                                                    {team.menang}
                                                                </td>
                                                                <td className="py-3 px-2 text-center text-black font-medium font-jetbrains text-sm">
                                                                    {team.seri}
                                                                </td>
                                                                <td className="py-3 px-2 text-center text-black font-medium font-jetbrains text-sm">
                                                                    {team.kalah}
                                                                </td>
                                                                <td className="py-3 px-2 text-center text-black font-medium font-jetbrains text-sm">
                                                                    {team.gf}
                                                                </td>
                                                                <td className="py-3 px-2 text-center text-black font-medium font-jetbrains text-sm">
                                                                    {team.ga}
                                                                </td>
                                                                <td className="py-3 px-2 text-center text-neutral-900 font-jetbrains font-bold text-sm">
                                                                    {team.gd > 0 ? `+${team.gd}` : team.gd}
                                                                </td>
                                                                <td className="py-3 px-4 text-center font-black text-black font-jetbrains text-base bg-amber-100">
                                                                    {team.poin}
                                                                </td>
                                                                <td className="py-3 px-3">
                                                                    <div className="flex items-center justify-center gap-1">
                                                                        {team.form.length === 0 ? (
                                                                            <span className="text-sm text-black font-bold font-jetbrains">-</span>
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