// Path: src/components/admin/MatchMonitoring.tsx
'use client';

import { useState, useEffect } from 'react';
import { Check, Swords, Loader2, X, Eye, AlertCircle } from 'lucide-react';

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
    screenshotResultUrl: string | null; // 🚀 Amankan properti URL bukti
}

export default function MatchMonitoring() {
    const [pendingMatches, setPendingMatches] = useState<Match[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null); // 📺 State Modal Pop-up

    const fetchPendingMatches = async () => {
        try {
            // Tarik dari endpoint admin verifikasi langsung agar datanya komplit beserta relasi tim
            const res = await fetch('/api/admin/match-verify');
            const data = await res.json();
            if (data.success) {
                setPendingMatches(data.data || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchPendingMatches(); }, []);

    const handleVerifyAction = async (matchId: string, actionType: 'APPROVE' | 'REJECT') => {
        const confirmMsg = actionType === 'APPROVE'
            ? 'Apakah Koko yakin SKOR dan BUKTI SCREENSHOT sudah sesuai? Aksi ini akan langsung mengubah klasemen live.'
            : 'Apakah Koko yakin ingin MENOLAK laporan ini? Status pertandingan akan dikembalikan ke SCHEDULED.';

        if (!confirm(confirmMsg)) return;

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
            {/* HEADER MODUL */}
            <div>
                <h2 className="text-2xl font-black uppercase font-jetbrains text-brand-dark tracking-tight">
                    Modul A-04: <span className="text-brand-primary">Monitoring & Verifikasi Match</span>
                </h2>
                <p className="text-brand-muted text-sm mt-1">Sahkan hasil skor pertandingan berdasarkan validasi bukti autentik.</p>
            </div>

            {/* KONTEN UTAMA */}
            <div className="bg-brand-bg-light border border-brand-border rounded-2xl overflow-hidden shadow-sm">
                <div className="p-4 bg-brand-bg-surface border-b border-brand-border flex items-center gap-2">
                    <Swords size={16} className="text-brand-primary" />
                    <h3 className="text-sm font-black font-jetbrains text-brand-primary uppercase tracking-wider">Antrean Verifikasi Skor</h3>
                </div>

                <div className="p-6">
                    {isLoading ? (
                        <div className="flex justify-center py-12 text-brand-gold"><Loader2 className="animate-spin" /></div>
                    ) : pendingMatches.length === 0 ? (
                        <div className="text-center py-12 border border-dashed border-brand-border rounded-2xl text-brand-muted font-jetbrains text-xs bg-brand-bg-surface/40">
                            Antrean bersih! Belum ada laporan skor baru dari kapten tim.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {pendingMatches.map((match) => (
                                <div key={match.id} className="bg-brand-bg-surface border border-brand-border rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:shadow-brand transition-all">
                                    <div className="flex justify-between items-center border-b border-brand-border pb-2 text-[10px] font-black font-jetbrains tracking-wider text-brand-bronze uppercase">
                                        <span>{match.stage} {match.groupName ? `- GRUP ${match.groupName}` : ''} (Match #{match.matchNumber})</span>
                                    </div>

                                    {/* PAPAN SKOR */}
                                    <div className="flex items-center justify-between text-xs font-bold font-jetbrains px-2 gap-2">
                                        <div className="text-right w-28 truncate text-brand-dark font-black" title={match.homeTeam?.teamName || 'TBD'}>
                                            {match.homeTeam?.teamName || 'TBD'}
                                        </div>
                                        <div className="bg-brand-bg-light border border-brand-border rounded-xl px-4 py-1.5 text-base font-black text-brand-primary shadow-inner font-jetbrains shrink-0">
                                            {match.homeScoreLeg1} – {match.awayScoreLeg1}
                                        </div>
                                        <div className="text-left w-28 truncate text-brand-dark font-black" title={match.awayTeam?.teamName || 'TBD'}>
                                            {match.awayTeam?.teamName || 'TBD'}
                                        </div>
                                    </div>

                                    {/* 👁️ TOMBOL INTIP SCREENSHOT */}
                                    <div className="pt-1">
                                        {match.screenshotResultUrl ? (
                                            <button
                                                onClick={() => setSelectedScreenshot(match.screenshotResultUrl)}
                                                className="w-full bg-white border border-brand-border hover:border-brand-primary hover:text-brand-primary text-brand-dark py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                                            >
                                                <Eye size={13} /> LIHAT SCREENSHOT BUKTI
                                            </button>
                                        ) : (
                                            <div className="text-brand-muted text-[11px] font-medium flex items-center justify-center gap-1 py-2 bg-brand-bg-light rounded-xl border border-brand-border">
                                                <AlertCircle size={13} className="text-brand-gold" /> Bukti Gambar Tidak Terlampir
                                            </div>
                                        )}
                                    </div>

                                    {/* AKSI HAKIM ADMIN */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleVerifyAction(match.id, 'APPROVE')}
                                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black font-jetbrains py-2.5 rounded-xl text-[11px] uppercase tracking-widest flex items-center justify-center gap-1 transition-colors shadow-sm"
                                        >
                                            <Check size={12} strokeWidth={3} /> SAHKAN SKOR
                                        </button>
                                        <button
                                            onClick={() => handleVerifyAction(match.id, 'REJECT')}
                                            className="px-4 bg-brand-bg-light border border-brand-primary text-brand-primary hover:bg-brand-primary/5 font-black font-jetbrains py-2.5 rounded-xl text-[11px] uppercase tracking-widest flex items-center justify-center gap-1 transition-all"
                                        >
                                            <X size={12} strokeWidth={3} /> TOLAK
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* 📺 LIGHTBOX INTERAKTIF POPUP MODAL SCREENSHOT */}
            {selectedScreenshot && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl p-4 max-w-3xl w-full flex flex-col items-end gap-3 shadow-2xl border border-brand-border">
                        <button
                            onClick={() => setSelectedScreenshot(null)}
                            className="bg-brand-bg-surface hover:bg-brand-border text-brand-dark p-2 rounded-xl border border-brand-border transition-all"
                        >
                            <X size={16} />
                        </button>
                        <div className="w-full overflow-hidden rounded-2xl border border-brand-border bg-brand-bg-surface flex justify-center max-h-[70vh]">
                            <img
                                src={selectedScreenshot.startsWith('data:') ? selectedScreenshot : `data:image/png;base64,${selectedScreenshot}`}
                                alt="Bukti Skor Pertandingan Belovesport"
                                className="object-contain w-full h-full"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}