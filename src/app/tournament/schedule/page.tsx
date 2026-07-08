// Path: src/app/tournament/schedule/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { Calendar, Clock, Loader2, ArrowLeft, ShieldAlert, Trophy, Filter, Swords, Bell, RefreshCw, Gamepad2, CheckSquare, Search, X } from 'lucide-react';
import LogoutButtonParticipant from '@/components/participant/LogoutButton';

interface Match {
    id: string;
    stage: string;
    groupName: string | null;
    matchNumber: number;
    homeTeam: { teamName: string; participantId: string | null } | null;
    awayTeam: { teamName: string; participantId: string | null } | null;
    homeScoreLeg1: number | null;
    awayScoreLeg1: number | null;
    homeScoreLeg2: number | null;
    awayScoreLeg2: number | null;
    matchStatus: string;
    scheduledTime: string | null;
}

const STAGE_TABS = [
    { id: 'ALL', label: 'Semua Match', short: 'Semua' },
    { id: 'GROUP', label: 'Fase Grup', short: 'Grup' },
    { id: 'KNOCKOUT_32', label: '32 Besar', short: '32B' },
    { id: 'KNOCKOUT_16', label: '16 Besar', short: '16B' },
    { id: 'QUARTER_FINAL', label: '8 Besar', short: '8B' },
    { id: 'FINAL', label: 'Finals', short: 'Final' },
];

const stageLabels: Record<string, string> = {
    GROUP: 'Fase Grup',
    KNOCKOUT_32: '32 Besar (2 Leg)',
    KNOCKOUT_16: '16 Besar (2 Leg)',
    QUARTER_FINAL: 'Perempat Final',
    SEMI_FINAL: 'Semi Final',
    FINAL: 'Grand Final',
    THIRD_PLACE: 'Juara 3 & 4',
};

// ✨ Urutan prioritas status — laga LIVE & butuh validasi selalu muncul duluan
const STATUS_PRIORITY: Record<string, number> = {
    PLAYING: 0,
    WAITING_VERIFICATION: 1,
    SCHEDULED: 2,
    COMPLETED: 3,
};

// ✨ Crest inisial tim — konsisten dengan tab Klasemen Grup & Leaderboard Global
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

const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then((res) => {
    if (res.status === 401) {
        window.location.href = '/login';
        return;
    }
    if (!res.ok) throw new Error('Gagal menarik data jadwal dari server.');
    return res.json();
});

export default function SchedulePage() {
    const [activeStageFilter, setActiveStageFilter] = useState<string>('ALL');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    // Ambil data session user saat runtime client
    useEffect(() => {
        async function getSession() {
            try {
                const res = await fetch('/api/auth/me');
                const data = await res.json();
                if (data?.user?.id) {
                    setCurrentUserId(data.user.id);
                }
            } catch (err) {
                console.error("Gagal memetakan sesi login player:", err);
            }
        }
        getSession();
    }, []);

    // LIVE POLLING SCHEDULE ENGINE
    const { data: resData, error, isLoading, mutate } = useSWR('/api/tournament/schedule', fetcher, {
        refreshInterval: 15000,
        revalidateOnFocus: true
    });

    const matches: Match[] = resData?.success ? resData.data : [];
    const errorMsg = error ? 'Gagal terhubung ke server API sirkuit.' : (!resData?.success && resData?.message ? resData.message : '');

    const filteredMatches = matches
        .filter(m => activeStageFilter === 'ALL' || m.stage === activeStageFilter)
        .filter(m => {
            if (!searchQuery.trim()) return true;
            const q = searchQuery.trim().toLowerCase();
            return (m.homeTeam?.teamName?.toLowerCase().includes(q)) || (m.awayTeam?.teamName?.toLowerCase().includes(q));
        });

    // ✨ Sortir cerdas: LIVE & butuh validasi mengambang di atas, lalu terjadwal (waktu terdekat), selesai di bawah
    const sortedMatches = [...filteredMatches].sort((a, b) => {
        const pa = STATUS_PRIORITY[a.matchStatus] ?? 2;
        const pb = STATUS_PRIORITY[b.matchStatus] ?? 2;
        if (pa !== pb) return pa - pb;
        const ta = a.scheduledTime ? new Date(a.scheduledTime).getTime() : Infinity;
        const tb = b.scheduledTime ? new Date(b.scheduledTime).getTime() : Infinity;
        return ta - tb;
    });

    // ✨ Status koneksi live — konsisten dengan tab Grup & Leaderboard
    const statusLabel = errorMsg ? 'TERPUTUS' : isLoading ? 'SINKRONISASI' : 'LIVE POLLING';
    const statusColor = errorMsg
        ? 'border-red-200 bg-red-50 text-red-600'
        : 'border-brand-primary/20 bg-brand-primary/5 text-brand-primary';
    const statusDot = errorMsg ? 'bg-red-500' : 'bg-brand-primary';

    return (
        <div className="min-h-screen bg-brand-bg-light text-brand-dark relative overflow-hidden pb-20 flex flex-col">
            {/* EFEK BACKGROUND PREMIUM */}
            <div className="fixed top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/70 to-transparent z-40" />
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full opacity-[0.09] pointer-events-none blur-[110px]" style={{ background: 'radial-gradient(ellipse, #FCB335 0%, #82403B 55%, transparent 70%)' }} aria-hidden />
            <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #561B1D 0, #561B1D 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />

            {/* TOP NAVBAR */}
            <nav className="sticky top-0 z-50 border-b border-brand-border bg-brand-bg-light/85 backdrop-blur-xl shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/profil" className="flex items-center gap-2 group focus-visible:outline-none">
                            <div className="w-7 h-7 rounded-md overflow-hidden flex items-center justify-center bg-gradient-brand shadow-brand group-hover:scale-105 transition-transform">
                                <img src="/logos/logo_BELOVESPORT.png" alt="Belovesport" className="w-full h-full object-cover" />
                            </div>
                            <span className="font-black text-sm tracking-widest uppercase text-brand-dark group-hover:text-brand-primary transition-colors">Belovesport</span>
                        </Link>
                        <span className="text-brand-muted/40 text-xs" aria-hidden>/</span>
                        <span className="text-brand-muted text-xs font-bold font-jetbrains uppercase tracking-wider">Jadwal Pertandingan</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button aria-label="Notifikasi" className="relative p-2 rounded-lg text-brand-muted hover:text-brand-dark hover:bg-brand-bg-surface transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50">
                            <Bell size={16} />
                            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-gold shadow-[0_0_6px_rgba(252,179,53,0.8)]" />
                        </button>
                        <LogoutButtonParticipant />
                    </div>
                </div>
            </nav>

            {/* 🌟 SUB-HEADER HALAMAN SPESIFIK */}
            <div className="relative z-20 border-b border-brand-border pt-8 pb-6 bg-brand-bg-light/40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-5">
                    <div>
                        <div className="flex items-center gap-3 mb-3 justify-center sm:justify-start">
                            <Link href="/profil"
                                className="p-2 rounded-xl transition-all group mr-2 bg-brand-bg-surface border border-brand-border hover:border-brand-gold shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50">
                                <ArrowLeft size={18} className="text-brand-secondary group-hover:text-brand-primary transition-colors" />
                            </Link>

                            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-gradient-brand shadow-brand-lg">
                                <Calendar size={18} className="text-white" />
                            </div>

                            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight font-jetbrains text-brand-dark">
                                Global <span className="text-brand-primary">Schedules</span>
                            </h1>
                        </div>
                        <p className="text-brand-muted text-xs text-center sm:text-left flex items-center justify-center sm:justify-start gap-1.5 font-medium">
                            <Trophy size={13} className="text-brand-gold shrink-0" />
                            Pantau seluruh bagan jadwal dan hasil akhir sirkuit Belovesport secara live.
                        </p>
                    </div>

                    {/* INTERACTIVE CONTROLS BOX */}
                    <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end shrink-0 flex-wrap">
                        <button
                            type="button"
                            onClick={() => mutate()}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all bg-white border border-brand-border text-brand-dark hover:border-brand-gold hover:text-brand-primary active:scale-95 disabled:opacity-50 shadow-sm"
                        >
                            <RefreshCw size={13} className={isLoading ? 'animate-spin text-brand-primary' : ''} />
                            {isLoading ? 'Sinkronisasi...' : 'Perbarui Jadwal'}
                        </button>

                        {/* Status koneksi live — konsisten dengan Klasemen Grup & Leaderboard */}
                        <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11px] sm:text-xs font-black font-jetbrains tracking-widest shadow-sm border transition-all hover:scale-105 hover:shadow-brand cursor-default ${statusColor}`}>
                            <span className="relative flex h-2 w-2 shrink-0">
                                {!errorMsg && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${statusDot}`} />}
                                <span className={`relative inline-flex rounded-full h-2 w-2 ${statusDot}`} />
                            </span>
                            {statusLabel}
                        </div>

                        {/* Info zona waktu — sekunder, tetap ditampilkan untuk kejelasan */}
                        <div className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-[10px] font-bold font-jetbrains tracking-wider uppercase text-brand-muted bg-brand-bg-surface border border-brand-border">
                            <Clock size={11} className="text-brand-gold" />
                            WIB (GMT+7)
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT CONTAINER */}
            <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-6 md:px-8 mt-8 flex-1 flex flex-col">
                {/* FILTER TAB & SEARCH COMPONENT */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                    <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar snap-x snap-mandatory pb-1 sm:pb-0 flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 text-xs font-black uppercase font-jetbrains text-brand-muted pr-2 border-r border-brand-border shrink-0 hidden md:flex">
                            <Filter size={14} /> Stage:
                        </div>
                        {STAGE_TABS.map((tab) => (
                            <button key={tab.id} onClick={() => setActiveStageFilter(tab.id)} className={`relative shrink-0 snap-start px-4 py-2 rounded-full text-xs font-black font-jetbrains tracking-wider uppercase transition-all border ${activeStageFilter === tab.id ? 'bg-gradient-brand border-transparent text-white shadow-brand-lg' : 'bg-white border-brand-border text-brand-muted hover:border-brand-gold/50 hover:text-brand-dark'}`}>
                                <span className="sm:hidden">{tab.short}</span>
                                <span className="hidden sm:inline">{tab.label}</span>
                                {activeStageFilter === tab.id && (
                                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-brand-gold shadow-[0_0_6px_rgba(252,179,53,0.9)]" aria-hidden />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* SEARCH TIM */}
                    <div className="relative w-full sm:w-64 shrink-0">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <Search size={14} className="text-brand-muted" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari nama tim..."
                            className="w-full pl-10 pr-9 py-2.5 bg-white border border-brand-border rounded-xl text-xs font-medium text-brand-dark placeholder:text-brand-muted/70 focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-all shadow-sm"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                aria-label="Hapus pencarian"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-brand-muted hover:text-brand-primary transition-colors"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </div>

                {/* COUNTER HASIL */}
                {!isLoading && !errorMsg && matches.length > 0 && (
                    <p className="text-[11px] font-jetbrains font-bold text-brand-muted uppercase tracking-wide mb-4 px-1">
                        {filteredMatches.length} Pertandingan {activeStageFilter !== 'ALL' || searchQuery.trim() ? 'Ditemukan' : 'Terjadwal'}
                    </p>
                )}

                {/* LOGIC GRAPH GRID */}
                {isLoading && matches.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-brand-primary flex-1">
                        <div className="p-5 rounded-2xl bg-brand-bg-surface border border-brand-border shadow-sm mb-5">
                            <Loader2 size={36} className="animate-spin" />
                        </div>
                        <p className="font-jetbrains text-sm font-bold uppercase tracking-widest text-brand-muted text-center">Sinkronisasi Kalender Arena...</p>
                    </div>
                ) : errorMsg ? (
                    <div className="bg-white border border-red-200 text-red-600 p-8 rounded-2xl text-center max-w-md mx-auto mt-20 flex flex-col items-center shadow-sm">
                        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 mb-4">
                            <ShieldAlert size={30} />
                        </div>
                        <p className="font-black text-sm font-jetbrains uppercase tracking-wide">{errorMsg}</p>
                        <button
                            type="button"
                            onClick={() => mutate()}
                            className="mt-5 flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-brand text-white shadow-brand hover:shadow-brand-lg active:scale-95 transition-all"
                        >
                            <RefreshCw size={13} /> Coba Sambungkan Ulang
                        </button>
                    </div>
                ) : sortedMatches.length === 0 ? (
                    <div className="text-center py-20 sm:py-24 border border-dashed border-brand-border rounded-3xl bg-brand-bg-surface shadow-sm max-w-3xl mx-auto w-full">
                        {searchQuery.trim() ? (
                            <>
                                <Search size={44} className="mx-auto text-brand-secondary/50 mb-4" />
                                <h3 className="text-lg font-bold text-brand-dark uppercase font-jetbrains mb-1">Tim Tidak Ditemukan</h3>
                                <p className="text-xs text-brand-muted px-6">Tidak ada tim yang cocok dengan kata kunci &ldquo;{searchQuery}&rdquo;.</p>
                            </>
                        ) : (
                            <>
                                <Swords size={44} className="mx-auto text-brand-secondary/50 mb-4" />
                                <h3 className="text-lg font-bold text-brand-dark uppercase font-jetbrains mb-1">Belum Ada Jadwal</h3>
                                <p className="text-xs text-brand-muted px-6">Tidak ada pertandingan aktif yang terjadwal untuk kategori babak ini.</p>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-16 animate-in fade-in duration-300">
                        {sortedMatches.map((match) => {
                            const isGroupStage = match.stage === 'GROUP';
                            const isCompleted = match.matchStatus === 'COMPLETED';
                            const isPlaying = match.matchStatus === 'PLAYING';
                            const isWaiting = match.matchStatus === 'WAITING_VERIFICATION';
                            const hasScore = match.homeScoreLeg1 !== null;
                            const homeTotalScore = (match.homeScoreLeg1 ?? 0) + (match.homeScoreLeg2 ?? 0);
                            const awayTotalScore = (match.awayScoreLeg1 ?? 0) + (match.awayScoreLeg2 ?? 0);
                            const homeFinalScore = isGroupStage ? match.homeScoreLeg1 : homeTotalScore;
                            const awayFinalScore = isGroupStage ? match.awayScoreLeg1 : awayTotalScore;
                            const hasBothLegs = !isGroupStage && match.homeScoreLeg1 !== null && match.homeScoreLeg2 !== null;

                            // ✨ Penentuan pemenang untuk laga yang sudah selesai
                            const homeIsWinner = isCompleted && hasScore && homeFinalScore !== null && awayFinalScore !== null && homeFinalScore > awayFinalScore;
                            const awayIsWinner = isCompleted && hasScore && homeFinalScore !== null && awayFinalScore !== null && awayFinalScore > homeFinalScore;

                            // GUARD PEMILIK TIM: Cek keterlibatan player login
                            const isOwnHomeTeam = !!currentUserId && match.homeTeam?.participantId === currentUserId;
                            const isOwnAwayTeam = !!currentUserId && match.awayTeam?.participantId === currentUserId;
                            const isParticipantInMatch = isOwnHomeTeam || isOwnAwayTeam;

                            const nameClass = (isOwn: boolean, isWinner: boolean, isLoserSide: boolean) => {
                                if (isOwn) return 'text-brand-primary underline decoration-2 decoration-brand-gold/70';
                                if (isLoserSide) return 'text-brand-muted/50';
                                if (isWinner) return 'text-brand-dark';
                                return 'text-brand-dark group-hover:text-brand-primary';
                            };

                            // ✨ Penekanan visual untuk laga LIVE — lebih kuat lagi kalau ini laga milik sendiri
                            const liveRing = isPlaying
                                ? (isParticipantInMatch ? 'ring-2 ring-brand-gold/50 ring-offset-2 ring-offset-brand-bg-light' : 'ring-2 ring-red-400/30 ring-offset-2 ring-offset-brand-bg-light')
                                : '';

                            return (
                                <div key={match.id} className={`bg-white border border-brand-border rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(24,24,27,0.06),0_8px_20px_-10px_rgba(24,24,27,0.1)] transition-all duration-200 hover:border-brand-gold/50 hover:-translate-y-0.5 hover:shadow-brand flex flex-col justify-between relative group ${liveRing}`}>
                                    <div className={`h-[3px] w-full shrink-0 ${isCompleted ? 'bg-gradient-brand' : isPlaying ? 'bg-red-500 animate-pulse-slow' : isWaiting ? 'bg-amber-400' : 'bg-brand-border'}`} />
                                    <div className="p-4 md:p-5 flex flex-col justify-between flex-1">

                                        {/* STATUS BAR */}
                                        <div className="flex items-center justify-between gap-2 mb-4 border-b border-brand-border pb-3 flex-wrap">
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                <span className="text-[10px] font-black uppercase font-jetbrains tracking-wider px-2 py-0.5 rounded bg-brand-gold/10 text-brand-primary border border-brand-gold/30">
                                                    {stageLabels[match.stage] || match.stage}
                                                </span>
                                                {isGroupStage && match.groupName && (
                                                    <span className="text-[10px] font-black uppercase font-jetbrains tracking-wider px-2 py-0.5 rounded bg-brand-bg-surface text-brand-dark border border-brand-border">
                                                        Grup {match.groupName}
                                                    </span>
                                                )}
                                            </div>
                                            <span className={`text-[9px] font-black uppercase font-jetbrains tracking-widest whitespace-nowrap px-2 py-0.5 rounded-full ${isCompleted ? 'text-emerald-700 bg-emerald-50' : isPlaying ? 'text-red-600 bg-red-50 font-bold animate-pulse' : isWaiting ? 'text-amber-600 bg-amber-50 animate-pulse' : 'text-brand-muted bg-brand-bg-surface'}`}>
                                                {isCompleted ? '● Selesai' : isPlaying ? '● LIVE PLAYING' : isWaiting ? '● Validasi Admin' : '○ Terjadwal'}
                                            </span>
                                        </div>

                                        {/* DISPLAY KLUB & SKOR */}
                                        <div className="grid grid-cols-[1fr_auto_1fr] items-center text-center py-2 gap-2 sm:gap-3">
                                            <div className="text-right pr-1 min-w-0">
                                                <div className="flex items-center justify-end gap-1.5 mb-1.5">
                                                    {isCompleted && homeIsWinner && (
                                                        <Trophy size={10} className="text-brand-gold shrink-0" />
                                                    )}
                                                    <span
                                                        className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black font-jetbrains text-white shrink-0 shadow-sm"
                                                        style={{ backgroundColor: getCrestColor(match.homeTeam?.teamName || 'TBD') }}
                                                    >
                                                        {getInitials(match.homeTeam?.teamName || 'TBD')}
                                                    </span>
                                                </div>
                                                <p
                                                    title={match.homeTeam?.teamName || 'TBD'}
                                                    className={`text-[11px] sm:text-xs md:text-sm font-black uppercase tracking-wide leading-snug break-words line-clamp-2 transition-colors ${nameClass(isOwnHomeTeam, homeIsWinner, isCompleted && awayIsWinner)}`}
                                                >
                                                    {match.homeTeam?.teamName || 'TBD'}
                                                </p>
                                            </div>

                                            <div className="flex flex-col items-center justify-center shrink-0">
                                                {hasScore ? (
                                                    <div className="bg-brand-bg-surface border border-brand-border rounded-xl px-3 sm:px-4 py-1.5 font-jetbrains font-black text-sm sm:text-base text-brand-primary tracking-tight shadow-inner whitespace-nowrap">
                                                        {isGroupStage ? (
                                                            `${match.homeScoreLeg1} – ${match.awayScoreLeg1}`
                                                        ) : (
                                                            `${homeTotalScore} – ${awayTotalScore}`
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="bg-brand-bg-surface border border-brand-border rounded-lg px-3 py-1 font-jetbrains font-black text-xs text-brand-muted">
                                                        VS
                                                    </div>
                                                )}
                                                {/* ✨ Rincian per-leg untuk babak gugur 2 leg */}
                                                {hasBothLegs && (
                                                    <p className="text-[8.5px] text-brand-muted font-jetbrains mt-1 tracking-wide whitespace-nowrap">
                                                        L1: {match.homeScoreLeg1}-{match.awayScoreLeg1} • L2: {match.homeScoreLeg2}-{match.awayScoreLeg2}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="text-left pl-1 min-w-0">
                                                <div className="flex items-center justify-start gap-1.5 mb-1.5">
                                                    <span
                                                        className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black font-jetbrains text-white shrink-0 shadow-sm"
                                                        style={{ backgroundColor: getCrestColor(match.awayTeam?.teamName || 'TBD') }}
                                                    >
                                                        {getInitials(match.awayTeam?.teamName || 'TBD')}
                                                    </span>
                                                    {isCompleted && awayIsWinner && (
                                                        <Trophy size={10} className="text-brand-gold shrink-0" />
                                                    )}
                                                </div>
                                                <p
                                                    title={match.awayTeam?.teamName || 'TBD'}
                                                    className={`text-[11px] sm:text-xs md:text-sm font-black uppercase tracking-wide leading-snug break-words line-clamp-2 transition-colors ${nameClass(isOwnAwayTeam, awayIsWinner, isCompleted && homeIsWinner)}`}
                                                >
                                                    {match.awayTeam?.teamName || 'TBD'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* ACTION BUTTON & INFO WAKTU */}
                                        <div className="mt-4 pt-3 border-t border-brand-border flex flex-col gap-2.5">
                                            {isParticipantInMatch && isPlaying && (
                                                <Link
                                                    href={`/tournament/match-action?matchId=${match.id}`}
                                                    className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-black font-jetbrains text-[10px] tracking-wider uppercase py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-brand/20"
                                                >
                                                    <Gamepad2 size={13} /> MASUK MATCH HUB & LAPOR SKOR
                                                </Link>
                                            )}

                                            {isParticipantInMatch && isWaiting && (
                                                <div className="w-full bg-brand-bg-surface border border-brand-border text-brand-muted font-jetbrains text-[10px] font-bold py-2 rounded-xl flex items-center justify-center gap-1.5">
                                                    <CheckSquare size={13} className="text-brand-gold animate-pulse" /> LAPORAN SEDANG DIVALIDASI ADMIN
                                                </div>
                                            )}

                                            {match.scheduledTime && (
                                                <div className="flex items-center justify-between text-[10px] text-brand-muted font-medium font-jetbrains">
                                                    <div className="flex items-center gap-1">
                                                        <Clock size={11} className="text-brand-gold" />
                                                        {new Date(match.scheduledTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                                                    </div>
                                                    <div>
                                                        {new Date(match.scheduledTime).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}