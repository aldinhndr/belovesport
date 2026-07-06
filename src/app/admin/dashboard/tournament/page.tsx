// Path: src/app/admin/dashboard/tournament/page.tsx
'use client'

import { useState } from 'react';
import { Trophy, Save, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function AdminTournamentPage() {
    // Data dummy pertandingan yang akan dikontrol admin sebelum ditarik murni dari API
    const [matches, setMatches] = useState([
        { id: 1, name: 'Semi-Final 1', team1: 'NiasPrime Club', score1: '3', team2: 'Eagle Esport', score2: '1', isDone: true },
        { id: 2, name: 'Semi-Final 2', team1: 'Bandar Lampung United', score1: '0', team2: 'Renegade FC', score2: '0', isDone: false },
    ]);

    const [loadingId, setLoadingId] = useState<number | null>(null);
    const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleScoreChange = (matchId: number, teamField: 'score1' | 'score2', value: string) => {
        setMatches(prev => prev.map(m => m.id === matchId ? { ...m, [teamField]: value } : m));
    };

    const handleStatusChange = (matchId: number, value: boolean) => {
        setMatches(prev => prev.map(m => m.id === matchId ? { ...m, isDone: value } : m));
    };

    const updateScoreOnServer = async (matchId: number) => {
        const targetMatch = matches.find(m => m.id === matchId);
        if (!targetMatch) return;

        setLoadingId(matchId);
        setAlertMsg(null);

        try {
            const res = await fetch('/api/admin/tournament/update-score', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    matchId: targetMatch.id,
                    score1: targetMatch.score1,
                    score2: targetMatch.score2,
                    isDone: targetMatch.isDone
                }),
            });
            const data = await res.json();

            if (data.success) {
                setAlertMsg({ type: 'success', text: data.message });
            } else {
                setAlertMsg({ type: 'error', text: data.message });
            }
        } catch {
            setAlertMsg({ type: 'error', text: 'Gagal terhubung ke server API.' });
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white p-6 sm:p-10">
            <div className="max-w-4xl mx-auto">

                {/* Header Panel */}
                <div className="flex items-center gap-3 border-b border-zinc-800 pb-6 mb-8">
                    <Trophy className="text-amber-400 w-8 h-8" />
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-wider">Meja Kendali Sirkuit</h1>
                        <p className="text-xs text-zinc-500 font-jetbrains">Update skor babak gugur secara langsung ke database</p>
                    </div>
                </div>

                {/* Global Feedback Alert */}
                {alertMsg && (
                    <div className={`mb-6 border p-4 rounded-xl flex items-center gap-2 text-xs font-bold font-jetbrains ${alertMsg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
                        }`}>
                        {alertMsg.type === 'success' ? <CheckCircle2 size={16} /> : <ShieldAlert size={16} />}
                        {alertMsg.text}
                    </div>
                )}

                {/* List Match Cards */}
                <div className="space-y-6">
                    {matches.map((match) => (
                        <div key={match.id} className="bg-[#13131a] border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                            <div className="flex justify-between items-center mb-4 pb-3 border-b border-zinc-800/60">
                                <span className="text-xs font-black font-jetbrains text-amber-400 uppercase tracking-widest">{match.name}</span>
                                <div className="flex items-center gap-2">
                                    <label className="text-[11px] font-bold text-zinc-400 font-jetbrains uppercase">Status Pertandingan:</label>
                                    <select
                                        value={match.isDone ? 'true' : 'false'}
                                        onChange={(e) => handleStatusChange(match.id, e.target.value === 'true')}
                                        className="bg-[#0a0a0f] border border-zinc-700 rounded-md text-xs px-2.5 py-1 text-zinc-300 font-bold focus:outline-none focus:border-amber-400"
                                    >
                                        <option value="false">LIVE / BERJALAN</option>
                                        <option value="true">SELESAI (FT)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Grid Input Skor */}
                            <div className="grid grid-cols-1 md:grid-cols-7 items-center gap-4">

                                {/* Team 1 */}
                                <div className="md:col-span-2 text-left md:text-right font-black text-sm tracking-wide text-zinc-200">
                                    {match.team1}
                                </div>

                                {/* Input 1 */}
                                <div className="md:col-span-1">
                                    <input
                                        type="number"
                                        value={match.score1}
                                        onChange={(e) => handleScoreChange(match.id, 'score1', e.target.value)}
                                        className="w-full bg-[#0a0a0f] border border-zinc-700 rounded-xl text-center py-2.5 font-black text-amber-400 font-jetbrains focus:outline-none focus:border-amber-400 text-lg"
                                    />
                                </div>

                                {/* VS Separator */}
                                <div className="md:col-span-1 text-center font-jetbrains text-zinc-600 text-xs font-black">
                                    VS
                                </div>

                                {/* Input 2 */}
                                <div className="md:col-span-1">
                                    <input
                                        type="number"
                                        value={match.score2}
                                        onChange={(e) => handleScoreChange(match.id, 'score2', e.target.value)}
                                        className="w-full bg-[#0a0a0f] border border-zinc-700 rounded-xl text-center py-2.5 font-black text-amber-400 font-jetbrains focus:outline-none focus:border-amber-400 text-lg"
                                    />
                                </div>

                                {/* Team 2 */}
                                <div className="md:col-span-2 text-left font-black text-sm tracking-wide text-zinc-200">
                                    {match.team2}
                                </div>

                            </div>

                            {/* Action Button */}
                            <div className="mt-5 flex justify-end">
                                <button
                                    onClick={() => updateScoreOnServer(match.id)}
                                    disabled={loadingId === match.id}
                                    className="bg-amber-400 hover:brightness-110 disabled:opacity-40 text-black font-black text-xs px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-lg shadow-amber-400/10 uppercase tracking-wider"
                                >
                                    <Save size={14} />
                                    {loadingId === match.id ? 'Menyimpan...' : 'Update Skor'}
                                </button>
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}