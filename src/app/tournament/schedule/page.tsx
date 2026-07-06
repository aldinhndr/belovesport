// Path: src/app/tournament/schedule/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr'; // 🚀 IMPORT SWR UNTUK LIVE SINKRONISASI JADWAL
import { Calendar, Clock, Loader2, ArrowLeft, ShieldAlert, Trophy, Filter, Swords, Bell, RefreshCw } from 'lucide-react';
import LogoutButtonParticipant from '@/components/participant/LogoutButton';
import MatchActionModal from '@/components/tournament/MatchActionModal';

interface Match {
    id: string;
    stage: string;
    groupName: string | null;
    matchNumber: number;
    homeTeamId: string | null;
    awayTeamId: string | null;
    homeTeam: { teamName: string } | null;
    awayTeam: { teamName: string } | null;
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

// Fetcher standard sirkuit BELOVEsPORT dengan credentials session
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
    const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);

    // 🚀 LIVE POLLING SCHEDULE ENGINE: Ambil pembaruan jadwal sirkuit otomatis tiap 15 detik
    const { data: resData, error, isLoading, mutate } = useSWR('/api/tournament/schedule', fetcher, {
        refreshInterval: 15000,
        revalidateOnFocus: true
    });

    const matches: Match[] = resData?.success ? resData.data : [];
    const errorMsg = error ? 'Gagal terhubung ke server API sirkuit.' : (!resData?.success && resData?.message ? resData.message : '');

    const filteredMatches = activeStageFilter === 'ALL'
        ? matches
        : matches.filter(m => m.stage === activeStageFilter);

    return (
        <div className="min-h-screen bg-brand-bg-light text-brand-dark relative overflow-hidden pb-20 flex flex-col">
            {/* EFEK CAHAYA & BACKGROUND PREMIUM */}
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

            {/* TOP NAVBAR GLOBAL */}
            <nav className="sticky top-0 z-50 border-b border-brand-border bg-brand-bg-light/85 backdrop-blur-xl shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/profil" className="flex items-center gap-2 group focus-visible:outline-none">
                            <div className="w-7 h-7 rounded-md overflow-hidden flex items-center justify-center bg-gradient-to-br from-brand-gold to-brand-bronze shadow-sm group-hover:scale-105 transition-transform">
                                <img src="/logos/logo_BELOVESPORT.png" alt="Belovesport" className="w-full h-full object-cover" />
                            </div>
                            <span className="font-black text-sm tracking-widest uppercase text-brand-dark group-hover:text-brand-primary transition-colors">Belovesport</span>
                        </Link>
                        <span className="text-brand-muted/40 text-xs" aria-hidden>/</span>
                        <span className="text-brand-muted text-xs font-medium">Jadwal Pertandingan</span>
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

            {/* SUB-HEADER HALAMAN */}
            <div className="relative z-20 border-b border-brand-border pt-7 sm:pt-8 pb-6 px-5 sm:px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4 bg-brand-bg-light/80 backdrop-blur-md">
                <div className="w-full md:w-auto">
                    <div className="flex items-center gap-3 mb-3 justify-center md:justify-start">
                        <Link href="/profil" className="p-2 rounded-xl transition-all group mr-1 sm:mr-2 shrink-0 bg-brand-bg-surface border border-brand-border hover:border-brand-gold shadow-sm">
                            <ArrowLeft size={18} className="text-brand-secondary group-hover:text-brand-primary transition-colors" />
                        </Link>
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-gradient-brand shadow-brand">
                            <Calendar size={18} className="text-white" />
                        </div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight font-jetbrains text-brand-dark">
                            Match <span className="text-brand-primary">Schedules</span>
                        </h1>
                    </div>
                    <p className="text-brand-muted text-xs text-center md:text-left flex items-center justify-center md:justify-start gap-1.5 font-medium">
                        <Trophy size={13} className="text-brand-gold shrink-0" />
                        Jadwal tanding, status agregat sirkuit, dan pelaporan skor real-time Belovesport.
                    </p>
                </div>

                {/* CONTROLS AREA WITH LIVE INDICATOR */}
                <div className="flex items-center gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={() => mutate()}
                        disabled={isLoading}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all bg-white border border-brand-border text-brand-dark hover:border-brand-primary/40 active:scale-95 disabled:opacity-50 shadow-sm"
                    >
                        <RefreshCw size={13} className={`text-brand-muted ${isLoading ? 'animate-spin text-brand-primary' : ''}`} />
                        {isLoading ? 'Sinkronisasi...' : 'Perbarui Jadwal'}
                    </button>

                    <div className="flex items-center gap-2 bg-brand-bg-surface border border-brand-border px-4 py-2.5 rounded-xl text-[11px] sm:text-xs font-bold font-jetbrains shadow-sm text-brand-primary">
                        <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse shrink-0" /> TIMEZONE: WIB (GMT+7)
                    </div>
                </div>
            </div>

            <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-6 md:px-8 mt-8 flex-1 flex flex-col">
                <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar snap-x snap-mandatory pb-4 mb-6">
                    <div className="flex items-center gap-1.5 text-xs font-black uppercase font-jetbrains text-brand-muted pr-2 border-r border-brand-border shrink-0 hidden md:flex">
                        <Filter size={14} /> Stage:
                    </div>
                    {STAGE_TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveStageFilter(tab.id)}
                            className={`shrink-0 snap-start px-4 py-2 rounded-full text-xs font-black font-jetbrains tracking-wider uppercase transition-all border ${activeStageFilter === tab.id ? 'bg-gradient-brand border-transparent text-white shadow-brand' : 'bg-white border-brand-border text-brand-muted hover:border-brand-gold/50 hover:text-brand-dark'}`}
                        >
                            <span className="sm:hidden">{tab.short}</span>
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {isLoading && matches.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-brand-primary flex-1">
                        <Loader2 size={40} className="animate-spin mb-4" />
                        <p className="font-jetbrains text-sm font-bold uppercase tracking-widest text-brand-muted text-center">Sinkronisasi Kalender Arena...</p>
                    </div>
                ) : errorMsg ? (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-2xl text-center max-w-md mx-auto mt-20 flex flex-col items-center shadow-sm">
                        <ShieldAlert size={32} className="mb-3" />
                        <p className="font-bold text-sm">{errorMsg}</p>
                    </div>
                ) : filteredMatches.length === 0 ? (
                    <div className="text-center py-20 sm:py-24 border border-dashed border-brand-border rounded-3xl bg-brand-bg-surface shadow-sm max-w-3xl mx-auto w-full">
                        <Swords size={44} className="mx-auto text-brand-secondary/50 mb-4" />
                        <h3 className="text-lg font-bold text-brand-dark uppercase font-jetbrains mb-1">Belum Ada Jadwal</h3>
                        <p className="text-xs text-brand-muted px-6">Tidak ada pertandingan aktif yang terjadwal untuk kategori babak ini.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-16 animate-in fade-in duration-300">
                        {filteredMatches.map((match) => {
                            const isGroupStage = match.stage === 'GROUP';
                            const isCompleted = match.matchStatus === 'COMPLETED';
                            const isWaiting = match.matchStatus === 'WAITING_VERIFICATION';
                            const homeTotalScore = (match.homeScoreLeg1 ?? 0) + (match.homeScoreLeg2 ?? 0);
                            const awayTotalScore = (match.awayScoreLeg1 ?? 0) + (match.awayScoreLeg2 ?? 0);

                            return (
                                <div key={match.id} className="bg-white border border-brand-border rounded-2xl p-4 md:p-5 shadow-[0_1px_3px_rgba(24,24,27,0.06),0_8px_20px_-10px_rgba(24,24,27,0.1)] transition-all duration-200 hover:border-brand-gold/50 hover:-translate-y-0.5 hover:shadow-[0_1px_3px_rgba(24,24,27,0.08),0_16px_32px_-12px_rgba(86,27,29,0.18)] flex flex-col justify-between relative overflow-hidden group">
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
                                            <span className="text-[10px] font-bold text-brand-muted font-jetbrains">
                                                Match #{match.matchNumber}
                                            </span>
                                        </div>
                                        <span className={`text-[9px] font-black uppercase font-jetbrains tracking-widest whitespace-nowrap ${isCompleted ? 'text-emerald-600' : isWaiting ? 'text-amber-500 animate-pulse' : 'text-brand-muted'}`}>
                                            {isCompleted ? '● Selesai' : isWaiting ? '● Menunggu Verifikasi' : '○ Terjadwal'}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-3 items-center text-center py-2 gap-1.5 sm:gap-2">
                                        <div className="text-right truncate pr-1">
                                            <p className="text-[11px] sm:text-xs md:text-sm font-black uppercase tracking-wide text-brand-dark group-hover:text-brand-primary transition-colors truncate">
                                                {match.homeTeam?.teamName || 'TBD'}
                                            </p>
                                            {!isGroupStage && match.homeScoreLeg1 !== null && (
                                                <p className="text-[9px] text-brand-muted font-jetbrains mt-0.5">
                                                    L1: {match.homeScoreLeg1} | L2: {match.homeScoreLeg2 ?? 0}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex flex-col items-center justify-center">
                                            {match.homeScoreLeg1 !== null ? (
                                                <div className="bg-brand-bg-surface border border-brand-border rounded-xl px-3 sm:px-4 py-1.5 font-jetbrains font-black text-sm sm:text-base text-brand-primary tracking-tight shadow-inner">
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
                                            {!isGroupStage && match.homeScoreLeg1 !== null && (
                                                <span className="text-[8px] font-black font-jetbrains text-brand-bronze uppercase tracking-widest mt-1">Agg Score</span>
                                            )}
                                        </div>

                                        <div className="text-left truncate pl-1">
                                            <p className="text-[11px] sm:text-xs md:text-sm font-black uppercase tracking-wide text-brand-dark group-hover:text-brand-primary transition-colors truncate">
                                                {match.awayTeam?.teamName || 'TBD'}
                                            </p>
                                            {!isGroupStage && match.awayScoreLeg1 !== null && (
                                                <p className="text-[9px] text-brand-muted font-jetbrains mt-0.5">
                                                    L1: {match.awayScoreLeg1} | L2: {match.awayScoreLeg2 ?? 0}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* INFO JADWAL / TOMBOL AKSI */}
                                    <div className="mt-4 pt-3 border-t border-brand-border flex flex-col gap-3">
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

                                        {/* Tampilkan Tombol Lapor Skor HANYA jika status masih SCHEDULED */}
                                        {match.matchStatus === 'SCHEDULED' && (
                                            <button
                                                type="button"
                                                onClick={() => setSelectedMatchId(match.id)}
                                                className="w-full bg-brand-gold/10 hover:bg-brand-gold/20 border border-brand-gold/40 text-brand-primary font-bold py-2.5 rounded-lg text-xs transition-all flex items-center justify-center gap-2"
                                            >
                                                <Swords size={14} /> Lapor Skor Pertandingan
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 🚀 MODAL KETIKA TOMBOL "LAPOR SKOR" DITEKAN DENGAN SWR CALLBACK MUTATE INSTAN */}
            {selectedMatchId && (
                <MatchActionModal
                    matchId={selectedMatchId}
                    onClose={() => setSelectedMatchId(null)}
                    onSuccess={() => mutate()}
                />
            )}
        </div>
    );
}