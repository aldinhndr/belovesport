'use client';

import { useState, useEffect } from 'react';
import { Check, X, Swords, Loader2 } from 'lucide-react';

interface Match {
    id: string;
    stage: string;
    groupName: string | null;
    matchNumber: number;
    homeTeam: { teamName: string } | null;
    awayTeam: { teamName: string } | null;
    homeScoreLeg1: number | null;
    awayScoreLeg1: number | null;
    reportedById: string | null;
}

export default function MatchMonitoring() {
    const [pendingMatches, setPendingMatches] = useState<Match[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPendingMatches = async () => {
        try {
            const res = await fetch('/api/tournament/schedule'); // Tarik dari sirkuit kalender jadwal utama
            const data = await res.json();
            if (data.success) {
                // Saring match yang statusnya WAITING_VERIFICATION
                const filtered = (data.data || []).filter((m: any) => m.matchStatus === 'WAITING_VERIFICATION');
                setPendingMatches(filtered);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchPendingMatches(); }, []);

    const handleVerifyAction = async (matchId: string, actionType: 'APPROVE' | 'REJECT') => {
        try {
            const res = await fetch('/api/admin/match-verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ matchId, action: actionType })
            });
            const data = await res.json();
            if (data.success) {
                setPendingMatches(prev => prev.filter(m => m.id !== matchId));
                alert(data.message);
            }
        } catch (error) {
            alert('Gagal mengeksekusi verifikasi skor.');
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h2 className="text-2xl font-black uppercase font-jetbrains text-brand-white tracking-tight">
                    Modul A-04: <span className="text-brand-gold">Monitoring Match</span>
                </h2>
                <p className="text-brand-bronze text-sm mt-1">Sahkan hasil skor pertandingan atau tolak laporan yang bersengketa.</p>
            </div>

            <div className="bg-brand-bg-surface border border-brand-secondary/40 rounded-2xl overflow-hidden shadow-brand-lg">
                <div className="p-4 bg-black/20 border-b border-brand-secondary/40 flex items-center gap-2">
                    <Swords size={16} className="text-brand-gold" />
                    <h3 className="text-sm font-black font-jetbrains text-brand-gold uppercase tracking-wider">Antrean Verifikasi Skor</h3>
                </div>

                <div className="p-6">
                    {isLoading ? (
                        <div className="flex justify-center py-12 text-brand-gold"><Loader2 className="animate-spin" /></div>
                    ) : pendingMatches.length === 0 ? (
                        <div className="text-center py-12 border border-dashed border-brand-secondary/40 rounded-2xl text-brand-secondary font-jetbrains text-xs">
                            Antrean bersih! Belum ada laporan skor baru dari kapten tim.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {pendingMatches.map((match) => (
                                <div key={match.id} className="bg-brand-bg-dark border border-brand-secondary/60 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                                    <div className="flex justify-between items-center border-b border-brand-secondary/30 pb-2 text-[10px] font-black font-jetbrains tracking-wider text-brand-bronze uppercase">
                                        <span>{match.stage} {match.groupName ? `- GRUP ${match.groupName}` : ''} (Match #{match.matchNumber})</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs font-bold font-jetbrains px-4">
                                        <div className="text-center w-28 truncate text-brand-white">{match.homeTeam?.teamName || 'TBD'}</div>
                                        <div className="bg-brand-bg-surface border border-brand-secondary rounded-lg px-4 py-1 text-base font-black text-brand-gold">
                                            {match.homeScoreLeg1} – {match.awayScoreLeg1}
                                        </div>
                                        <div className="text-center w-28 truncate text-brand-white">{match.awayTeam?.teamName || 'TBD'}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleVerifyAction(match.id, 'APPROVE')} className="flex-1 bg-emerald-500 hover:brightness-110 text-brand-bg-dark font-black font-jetbrains py-2 rounded-xl text-[11px] uppercase tracking-widest flex items-center justify-center gap-1">
                                            <Check size={12} /> SAHKAN SKOR
                                        </button>
                                        <button onClick={() => handleVerifyAction(match.id, 'REJECT')} className="px-4 bg-brand-primary border border-brand-secondary text-brand-white font-black font-jetbrains py-2 rounded-xl text-[11px] uppercase tracking-widest">
                                            TOLAK
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}