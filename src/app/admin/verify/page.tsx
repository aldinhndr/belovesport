// Path: src/app/admin/verify/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Check, X, ShieldAlert, Image as ImageIcon, ExternalLink } from 'lucide-react';

export default function AdminVerifyPage() {
    const [pendingMatches, setPendingMatches] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

    const fetchPendingMatches = async () => {
        try {
            const res = await fetch('/api/admin/match-verify');
            const data = await res.json();
            if (data.success) setPendingMatches(data.data);
        } catch (err) {
            console.error('Gagal memuat meja verifikasi admin', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingMatches();
    }, []);

    const handleAction = async (matchId: string, action: 'APPROVE' | 'REJECT') => {
        setActionLoadingId(matchId);
        try {
            const res = await fetch('/api/admin/match-verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ matchId, action }),
            });
            const data = await res.json();
            if (data.success) {
                alert(data.message);
                fetchPendingMatches(); // Refresh data setelah sukses eksekusi
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error(err);
            alert('Gagal mengeksekusi perintah admin.');
        } finally {
            setActionLoadingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-zinc-100 p-8 font-sans">
            {/* HEADER DASBOR */}
            <div className="flex flex-col gap-1 mb-8 border-b border-zinc-800 pb-5">
                <div className="flex items-center gap-2">
                    <ShieldAlert className="text-amber-400" size={20} />
                    <h1 className="text-xl font-black tracking-wider uppercase font-jetbrains text-amber-400">Meja Verifikasi Laporan Skor</h1>
                </div>
                <p className="text-xs text-zinc-500 font-jetbrains">Validasi bukti screenshot dan setujui hasil 2-leg untuk memajukan sirkuit bagan.</p>
            </div>

            {isLoading ? (
                <div className="text-center font-jetbrains text-xs text-zinc-500 py-12 animate-pulse">Menghubungkan ke sirkuit database...</div>
            ) : pendingMatches.length === 0 ? (
                <div className="text-center border border-dashed border-zinc-800 rounded-2xl py-16 px-4 max-w-xl mx-auto bg-zinc-900/10">
                    <p className="text-xs text-zinc-500 font-jetbrains">Bersih! Tidak ada laporan pertandingan yang tertahan di meja antrean.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 max-w-5xl mx-auto">
                    {pendingMatches.map((match) => {
                        const isProcessing = actionLoadingId === match.id;

                        return (
                            <div key={match.id} className="bg-[#13131a] border border-zinc-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:border-zinc-700">

                                {/* BLOK DETAIL PERTANDINGAN */}
                                <div className="flex-1 space-y-3">
                                    <div className="inline-block bg-amber-400/10 text-amber-400 font-jetbrains font-bold text-[10px] px-2.5 py-1 rounded-md uppercase tracking-wider">
                                        Babak: {match.stage} - Match #{match.matchNumber}
                                    </div>

                                    {/* PAPAN SKOR DETAIL */}
                                    <div className="text-xs space-y-1.5 bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/60 max-w-md">
                                        <div className="flex justify-between items-center font-semibold">
                                            <span className="text-zinc-300">{match.homeTeam?.teamName ?? 'TBD'}</span>
                                            <span className="font-jetbrains font-black text-amber-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                                                {match.homeScoreLeg1} <span className="text-zinc-600 font-normal">|</span> {match.homeScoreLeg2 ?? 0}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center font-semibold">
                                            <span className="text-zinc-300">{match.awayTeam?.teamName ?? 'TBD'}</span>
                                            <span className="font-jetbrains font-black text-amber-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                                                {match.awayScoreLeg1} <span className="text-zinc-600 font-normal">|</span> {match.awayScoreLeg2 ?? 0}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* BUKTI SCREENSHOT */}
                                <div className="flex items-center">
                                    {match.screenshotResultUrl ? (
                                        <a
                                            href={match.screenshotResultUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-bold font-jetbrains px-4 py-2.5 rounded-xl border border-zinc-700 transition-colors"
                                        >
                                            <ImageIcon size={14} /> LIHAT BUKTI <ExternalLink size={12} />
                                        </a>
                                    ) : (
                                        <span className="text-[10px] text-zinc-600 font-jetbrains italic flex items-center gap-1.5">
                                            <ImageIcon size={13} /> Tanpa lampiran foto
                                        </span>
                                    )}
                                </div>

                                {/* BLOK TOMBOL AKSI ADMIN */}
                                <div className="flex items-center gap-2 border-t md:border-t-0 border-zinc-800 pt-4 md:pt-0">
                                    <button
                                        disabled={isProcessing}
                                        onClick={() => handleAction(match.id, 'REJECT')}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-1.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider font-jetbrains transition-all disabled:opacity-40"
                                    >
                                        <X size={14} /> REJECT
                                    </button>
                                    <button
                                        disabled={isProcessing}
                                        onClick={() => handleAction(match.id, 'APPROVE')}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-1.5 bg-emerald-500 text-black hover:brightness-110 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider font-jetbrains transition-all disabled:opacity-40 shadow-lg shadow-emerald-500/10"
                                    >
                                        <Check size={14} /> APPROVE
                                    </button>
                                </div>

                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}