// Path: src/components/user/MyMatchSchedule.tsx
'use client';

import { useState, useEffect } from 'react';
import { Swords, Loader2, Clock, CheckCircle2, AlertCircle, Edit3 } from 'lucide-react';
import MatchCenterModal from './MatchCenterModal'; // Import Modal Ruang Ganti

interface MyMatch {
    id: string;
    stage: string;
    groupName: string | null;
    matchNumber: number;
    homeTeam: { teamName: string; leaderName: string } | null;
    awayTeam: { teamName: string; leaderName: string } | null;
    homeScoreLeg1: number | null;
    awayScoreLeg1: number | null;
    homeScoreLeg2: number | null;
    awayScoreLeg2: number | null;
    matchStatus: string;
    scheduledTime: string | null;
}

export default function MyMatchSchedule() {
    const [matches, setMatches] = useState<MyMatch[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null); // State pembuka modal

    const fetchMyMatches = async () => {
        setIsLoading(true);
        try {
            // Tarik jadwal menggunakan API Schedule dengan scope personal
            const res = await fetch('/api/tournament/schedule?scope=personal');
            const data = await res.json();
            if (data.success) {
                setMatches(data.data || []);
            }
        } catch (error) {
            console.error('Gagal mengambil jadwal tim:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMyMatches();
    }, []);

    return (
        <div className="bg-brand-bg-light border border-brand-border rounded-3xl overflow-hidden shadow-sm animate-in fade-in duration-500">
            {/* HEADER DASBOR JADWAL */}
            <div className="p-5 bg-brand-bg-surface/60 border-b border-brand-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20">
                        <Swords size={20} className="text-brand-primary" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black font-jetbrains text-brand-dark uppercase tracking-wider">
                            Jadwal Tanding Saya
                        </h3>
                        <p className="text-[10px] text-brand-muted font-medium mt-0.5">
                            Buka Match Center untuk koordinasi lawan dan lapor skor.
                        </p>
                    </div>
                </div>
                <button
                    onClick={fetchMyMatches}
                    disabled={isLoading}
                    className="text-[10px] font-black font-jetbrains bg-white border border-brand-border px-3 py-1.5 rounded-lg text-brand-muted hover:text-brand-dark hover:border-brand-primary/30 transition-all shadow-sm disabled:opacity-50"
                >
                    REFRESH
                </button>
            </div>

            {/* LIST PERTANDINGAN */}
            <div className="p-6">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 text-brand-primary gap-3">
                        <Loader2 className="animate-spin" size={28} />
                        <span className="text-xs font-bold font-jetbrains tracking-widest uppercase">Menarik Data Jadwal...</span>
                    </div>
                ) : matches.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-brand-muted text-center border-2 border-dashed border-brand-border rounded-2xl bg-brand-bg-surface/50">
                        <Clock size={32} className="mb-3 opacity-30 text-brand-primary" />
                        <p className="text-sm font-black text-brand-dark">Belum Ada Jadwal</p>
                        <p className="text-xs mt-1 font-medium">Admin Belovesport belum merilis jadwal atau tim Anda belum lolos ke fase berikutnya.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {matches.map((match) => {
                            const isCompleted = match.matchStatus === 'COMPLETED';
                            const isWaiting = match.matchStatus === 'WAITING_VERIFICATION';
                            const isGroupStage = match.stage === 'GROUP';

                            // Hitung Agregat Skor Sementara
                            const homeTotal = (match.homeScoreLeg1 ?? 0) + (match.homeScoreLeg2 ?? 0);
                            const awayTotal = (match.awayScoreLeg1 ?? 0) + (match.awayScoreLeg2 ?? 0);

                            return (
                                <div key={match.id} className="border border-brand-border rounded-2xl p-4 md:p-5 bg-white hover:border-brand-gold/50 hover:shadow-brand transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group">

                                    {/* INFO MATCH KIRI */}
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-[10px] font-black font-jetbrains text-brand-primary bg-brand-primary/5 px-2 py-0.5 rounded border border-brand-primary/10 uppercase tracking-widest">
                                                {match.stage} {isGroupStage && match.groupName ? `- GRUP ${match.groupName}` : ''}
                                            </span>
                                            <span className="text-[10px] font-bold font-jetbrains text-brand-muted">
                                                Match #{match.matchNumber}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-brand-muted font-medium">
                                            <span className="font-bold text-brand-dark truncate max-w-[150px]">{match.homeTeam?.teamName || 'TBD'}</span>
                                            <span className="text-[10px] font-black font-jetbrains px-1.5 bg-slate-100 rounded">VS</span>
                                            <span className="font-bold text-brand-dark truncate max-w-[150px]">{match.awayTeam?.teamName || 'TBD'}</span>
                                        </div>
                                    </div>

                                    {/* SKOR & AKSI KANAN */}
                                    <div className="flex items-center gap-4 sm:gap-6 justify-between md:justify-end">

                                        {/* Tampilan Skor */}
                                        <div className="flex flex-col items-center justify-center">
                                            {match.homeScoreLeg1 !== null ? (
                                                <div className="flex items-center gap-2 text-base font-black font-jetbrains text-brand-primary bg-brand-bg-surface px-3 py-1 rounded-xl border border-brand-border shadow-inner">
                                                    <span>{isGroupStage ? match.homeScoreLeg1 : homeTotal}</span>
                                                    <span className="text-brand-muted/40">-</span>
                                                    <span>{isGroupStage ? match.awayScoreLeg1 : awayTotal}</span>
                                                </div>
                                            ) : (
                                                <span className="text-[11px] font-black font-jetbrains text-brand-muted bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 uppercase tracking-widest">
                                                    Belum Main
                                                </span>
                                            )}
                                        </div>

                                        {/* Tombol Buka Match Center atau Status */}
                                        <div className="w-40 flex justify-end shrink-0">
                                            {isCompleted ? (
                                                <span className="flex items-center gap-1.5 text-[10px] font-black font-jetbrains text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl uppercase tracking-widest w-full justify-center">
                                                    <CheckCircle2 size={14} /> Selesai
                                                </span>
                                            ) : isWaiting ? (
                                                <span className="flex items-center gap-1.5 text-[10px] font-black font-jetbrains text-amber-600 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl uppercase tracking-widest w-full justify-center text-center leading-tight">
                                                    <AlertCircle size={14} className="shrink-0" /> Verifikasi Admin
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => setSelectedMatchId(match.id)}
                                                    className="w-full bg-brand-primary hover:bg-brand-secondary text-white text-[11px] font-black font-jetbrains px-3 py-2 rounded-xl uppercase tracking-widest shadow-sm flex items-center justify-center gap-1.5 transition-colors group-hover:scale-105"
                                                >
                                                    <Edit3 size={14} /> Match Center
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 🔥 POP-UP MATCH CENTER (RUANG GANTI) */}
            {selectedMatchId && (
                <MatchCenterModal
                    matchId={selectedMatchId}
                    onClose={() => setSelectedMatchId(null)}
                    onSuccess={fetchMyMatches} // Refresh data otomatis setelah skor dikirim
                />
            )}
        </div>
    );
}