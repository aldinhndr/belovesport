// Path: src/components/admin/MatchScheduling.tsx
'use client';

import { useEffect, useState } from 'react';
import { Calendar, Filter, Loader2, Save, Play, Clock, X } from 'lucide-react';

interface Match {
    id: string;
    stage: string;
    groupName: string | null;
    roundNumber: number;
    matchNumber: number;
    matchStatus: string;
    scheduledTime: string;
    homeTeam: { teamName: string } | null;
    awayTeam: { teamName: string } | null;
}

export default function MatchScheduling() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<string>('A');
    const [isLoading, setIsLoading] = useState(true);

    // State internal form pengeditan per baris match
    const [editingMatchId, setEditingMatchId] = useState<string | null>(null);
    const [inputTime, setInputTime] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);

    const groupNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];

    const fetchSchedules = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/admin/match-schedule?groupName=${selectedGroup}`);
            const data = await res.json();
            if (data.success) {
                setMatches(data.data || []);
            }
        } catch (error) {
            console.error('Gagal memuat jadwal:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, [selectedGroup]);

    const startEditing = (match: Match) => {
        setEditingMatchId(match.id);
        // Format date string ke format yang dikenali input datetime-local (YYYY-MM-DDTHH:MM)
        const dateObj = new Date(match.scheduledTime);
        const tzOffset = dateObj.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(dateObj.getTime() - tzOffset)).toISOString().slice(0, 16);
        setInputTime(localISOTime);
    };

    const handleSaveSchedule = async (matchId: string, startNow: boolean = false) => {
        if (!inputTime) return alert('Silakan tentukan waktu pertandingan terlebih dahulu!');

        setIsSaving(true);
        try {
            const res = await fetch('/api/admin/match-schedule', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    matchId,
                    scheduledTime: new Date(inputTime).toISOString(),
                    startNow
                })
            });
            const data = await res.json();

            if (data.success) {
                alert(data.message);
                setEditingMatchId(null);
                fetchSchedules(); // Refresh data terbaru
            } else {
                alert(data.message || 'Gagal mengubah jadwal.');
            }
        } catch (error) {
            alert('Terjadi kesalahan sistem.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* HEADER */}
            <div className="pb-4 border-b border-brand-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black uppercase font-jetbrains text-brand-dark tracking-tight">
                        Modul A-05: <span className="text-brand-primary">Kalender & Penjadwalan Match</span>
                    </h2>
                    <p className="text-brand-muted text-sm mt-1">
                        Atur jam Kick-off sirkuit dan aktivasi ruang tanding (Match Center Room) para player Belovesport.
                    </p>
                </div>
            </div>

            {/* SELEKTOR PILIHAN GRUP (A - P) */}
            <div className="bg-brand-bg-light border border-brand-border rounded-2xl p-4 flex flex-col gap-3">
                <span className="text-xs font-black font-jetbrains text-brand-dark uppercase tracking-wider flex items-center gap-1.5">
                    <Filter size={14} className="text-brand-primary" /> Saring Berdasarkan Kelompok Grup:
                </span>
                <div className="flex flex-wrap gap-1.5">
                    {groupNames.map((g) => (
                        <button
                            key={g}
                            onClick={() => { setSelectedGroup(g); setEditingMatchId(null); }}
                            className={`w-10 h-10 rounded-xl font-jetbrains font-black text-xs border transition-all ${selectedGroup === g
                                ? 'bg-brand-primary text-white border-brand-primary shadow-md shadow-brand'
                                : 'bg-white text-brand-dark border-brand-border hover:bg-brand-bg-surface'
                                }`}
                        >
                            {g}
                        </button>
                    ))}
                </div>
            </div>

            {/* LIST DAFTAR 6 PERTANDINGAN ROUND-ROBIN PER GRUP */}
            {isLoading ? (
                <div className="flex justify-center py-16 text-brand-gold"><Loader2 className="animate-spin" size={32} /></div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {matches.map((match) => {
                        const isEditing = editingMatchId === match.id;
                        const formattedDate = new Date(match.scheduledTime).toLocaleString('id-ID', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                        });

                        return (
                            <div key={match.id} className="bg-white border border-brand-border rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all hover:border-brand-primary/20">

                                {/* KIRI: URUTAN MATCH */}
                                <div className="space-y-1.5 min-w-[150px]">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black font-jetbrains bg-brand-primary/5 text-brand-primary border border-brand-primary/10 px-2 py-0.5 rounded">
                                            Match #{match.matchNumber}
                                        </span>
                                        <span className="text-[10px] font-bold font-jetbrains text-brand-muted">
                                            Round {match.roundNumber}
                                        </span>
                                    </div>
                                    <div className="text-xs font-bold text-brand-dark flex items-center gap-1.5">
                                        <Clock size={13} className="text-brand-muted" />
                                        {match.matchStatus === 'PLAYING' ? (
                                            <span className="text-emerald-600 font-jetbrains font-black animate-pulse uppercase tracking-wider text-[11px]">🔴 LIVE NOW</span>
                                        ) : (
                                            <span className="text-brand-muted font-jetbrains">{formattedDate} WIB</span>
                                        )}
                                    </div>
                                </div>

                                {/* TENGAH: DETAIL TIM */}
                                <div className="flex-1 flex items-center gap-3 bg-brand-bg-surface border border-brand-border px-4 py-3 rounded-xl max-w-xl">
                                    <span className="font-bold text-xs text-brand-dark truncate flex-1 text-right">{match.homeTeam?.teamName || 'TBD'}</span>
                                    <span className="font-jetbrains font-black text-[10px] text-brand-muted/40 px-2 shrink-0">VS</span>
                                    <span className="font-bold text-xs text-brand-dark truncate flex-1 text-left">{match.awayTeam?.teamName || 'TBD'}</span>
                                </div>

                                {/* KANAN: AKSI FORM INPUT JADWAL */}
                                <div className="shrink-0 flex items-center gap-2 lg:justify-end">
                                    {isEditing ? (
                                        <div className="flex items-center gap-2 w-full lg:w-auto">
                                            <input
                                                type="datetime-local"
                                                value={inputTime}
                                                onChange={(e) => setInputTime(e.target.value)}
                                                className="bg-brand-bg-surface border border-brand-border rounded-xl px-3 py-2 text-xs font-bold font-jetbrains text-brand-dark focus:ring-2 focus:ring-brand-primary focus:outline-none"
                                            />
                                            <button
                                                onClick={() => handleSaveSchedule(match.id, false)}
                                                disabled={isSaving}
                                                className="bg-brand-primary text-white p-2.5 rounded-xl hover:bg-brand-secondary transition-all shadow-sm"
                                                title="Simpan Waktu"
                                            >
                                                {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                            </button>
                                            <button
                                                onClick={() => handleSaveSchedule(match.id, true)}
                                                disabled={isSaving}
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black font-jetbrains px-3 py-2.5 rounded-xl text-[11px] uppercase tracking-wider flex items-center gap-1 transition-all"
                                                title="Mulai Laga Sekarang"
                                            >
                                                <Play size={12} fill="currentColor" /> START
                                            </button>
                                            <button
                                                onClick={() => setEditingMatchId(null)}
                                                className="bg-brand-bg-light border border-brand-border text-brand-muted p-2.5 rounded-xl hover:bg-brand-bg-surface transition-all"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => startEditing(match)}
                                            disabled={match.matchStatus === 'COMPLETED'}
                                            className="w-full lg:w-auto bg-brand-bg-light border border-brand-border text-brand-dark hover:border-brand-primary hover:text-brand-primary font-black font-jetbrains text-[11px] uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            <Calendar size={13} />
                                            {match.matchStatus === 'COMPLETED' ? 'Laga Selesai' : 'Atur Jadwal / Start'}
                                        </button>
                                    )}
                                </div>

                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}