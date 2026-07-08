// Path: src/components/admin/GroupManagement.tsx
'use client';

import { useEffect, useState } from 'react';
import { Users, RefreshCw, Loader2, ShieldAlert, Award } from 'lucide-react';

interface GroupTeam {
    teamId: string;
    teamName: string;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    points: number;
}

interface GroupData {
    groupName: string;
    teams: GroupTeam[];
}

export default function GroupManagement() {
    const [groups, setGroups] = useState<GroupData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isResetting, setIsResetting] = useState(false);

    // 🔄 TANGKAP DATA KLASEMEN DENGAN FALLBACK PINTAR
    // 🔄 TANGKAP DATA KLASEMEN DENGAN FALLBACK PINTAR
    const fetchGroupStandings = async () => {
        setIsLoading(true);
        try {
            // 🎯 PERBAIKAN: Arahkan ke endpoint admin yang valid
            const res = await fetch('/api/admin/tournament/groups');
            const data = await res.json();

            if (data.success || res.ok) {
                // Deteksi otomatis bentuk array dari payload API
                if (Array.isArray(data)) {
                    setGroups(data);
                } else if (data.data && Array.isArray(data.data)) {
                    setGroups(data.data);
                } else if (data.groups && Array.isArray(data.groups)) {
                    setGroups(data.groups);
                } else if (data.data && data.data.groups && Array.isArray(data.data.groups)) {
                    setGroups(data.data.groups);
                } else {
                    setGroups([]);
                }
            }
        } catch (error) {
            console.error('Gagal memuat sirkuit grup:', error);
            setGroups([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGroupStandings();
    }, []);

    // ⚠️ RESET EMERGENCY RESET
    const handleResetGroups = async () => {
        if (!confirm('PERINGATAN SUPER ADMIN!\n\nApakah Koko yakin ingin menghapus seluruh pembagian 16 grup dan jadwal kompetisi saat ini? Aksi ini akan mengosongkan kembali database sirkuit.')) return;

        setIsResetting(true);
        try {
            const res = await fetch('/api/admin/tournament/reset-groups', { method: 'POST' });
            const data = await res.json();
            if (data.success) {
                alert('Database sirkuit grup berhasil dibersihkan total!');
                setGroups([]);
            } else {
                alert(data.message || 'Gagal mereset sirkuit grup.');
            }
        } catch (error) {
            alert('Terjadi kesalahan transmisi reset database.');
        } finally {
            setIsResetting(false);
        }
    };

    // 🛡️ FILTER AKHIR: Pastikan variabel yang turun ke JSX mutlak berbentuk array
    const safeGroups = Array.isArray(groups) ? groups : [];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* HEADER MODUL */}
            <div className="pb-4 border-b border-brand-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black uppercase font-jetbrains text-brand-dark tracking-tight">
                        Modul A-07: <span className="text-brand-primary">Manajemen Grup & Klasemen</span>
                    </h2>
                    <p className="text-brand-muted text-sm mt-1">
                        Pantau status statistik, poin, dan kualifikasi 16 grup sirkuit arena secara real-time.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchGroupStandings}
                        disabled={isLoading}
                        className="bg-brand-bg-light border border-brand-border hover:bg-brand-bg-surface text-brand-dark p-2.5 rounded-xl transition-all shadow-sm"
                        title="Refresh Klasemen"
                    >
                        <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                    </button>
                    {safeGroups.length > 0 && (
                        <button
                            onClick={handleResetGroups}
                            disabled={isResetting}
                            className="bg-brand-primary/10 border border-brand-primary/20 hover:bg-brand-primary hover:text-white text-brand-primary font-black font-jetbrains text-[11px] uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                        >
                            {isResetting ? <Loader2 size={13} className="animate-spin" /> : <ShieldAlert size={14} />}
                            WIPE OUT GROUPS
                        </button>
                    )}
                </div>
            </div>

            {/* RENDER ENGINE KLASEMEN */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 text-brand-gold gap-2">
                    <Loader2 size={32} className="animate-spin" />
                    <span className="text-xs font-bold font-jetbrains text-brand-bronze uppercase tracking-widest">Memetakan Papan Klasemen...</span>
                </div>
            ) : safeGroups.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-brand-border rounded-3xl text-brand-muted font-jetbrains text-xs bg-brand-bg-light flex flex-col items-center justify-center gap-3">
                    <Users size={36} className="opacity-20 text-brand-primary animate-pulse-slow" />
                    <span className="max-w-xs leading-relaxed">
                        Sirkuit 16 grup masih kosong. Silakan jalankan kocokan tim terlebih dahulu di <b className="text-brand-primary">Modul A-03 (Kelola Bracket)</b>, Ko Aldin!
                    </span>
                </div>
            ) : (
                /* GRID 16 GRUP YANG INDAH & RESPONSIF */
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {safeGroups.map((group) => (
                        <div key={group.groupName} className="bg-brand-bg-light border border-brand-border rounded-2xl overflow-hidden shadow-sm hover:shadow-brand transition-all flex flex-col justify-between">

                            {/* NAMA GRUP BANNER */}
                            <div className="px-5 py-3.5 bg-brand-bg-surface border-b border-brand-border flex items-center justify-between">
                                <h3 className="font-jetbrains font-black text-brand-primary text-sm uppercase tracking-wider flex items-center gap-2">
                                    <Award size={16} className="text-brand-gold" /> GRUP {group.groupName}
                                </h3>
                                <span className="text-[9px] font-black font-jetbrains px-2 py-0.5 bg-brand-primary/5 text-brand-primary border border-brand-primary/10 rounded uppercase">
                                    Round-Robin
                                </span>
                            </div>

                            {/* TABEL STATISTIK TIM */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs font-sans">
                                    <thead className="bg-brand-bg-surface/40 text-brand-muted font-black text-[10px] tracking-wider uppercase border-b border-brand-border">
                                        <tr>
                                            <th className="px-5 py-3">Klub/Player</th>
                                            <th className="px-3 py-3 text-center">MN</th>
                                            <th className="px-2 py-3 text-center">M</th>
                                            <th className="px-2 py-3 text-center">S</th>
                                            <th className="px-2 py-3 text-center">K</th>
                                            <th className="px-3 py-3 text-center">GOAL</th>
                                            <th className="px-5 py-3 text-center text-brand-primary font-black">PTS</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-brand-border font-medium text-brand-dark">
                                        {group.teams?.map((team, idx) => {
                                            const isQualified = idx < 2; // Peringkat 1 & 2 lolos grup
                                            return (
                                                <tr key={team.teamId} className="hover:bg-brand-bg-surface/50 transition-colors">
                                                    <td className="px-5 py-3.5 flex items-center gap-2 font-bold max-w-[180px] truncate">
                                                        <span className={`w-1.5 h-1.5 rounded-full ${isQualified ? 'bg-emerald-500 shadow-sm' : 'bg-brand-secondary/40'}`} />
                                                        <span title={team.teamName}>{team.teamName}</span>
                                                    </td>
                                                    <td className="px-3 py-3.5 text-center font-jetbrains text-brand-muted">{team.played}</td>
                                                    <td className="px-2 py-3.5 text-center font-jetbrains text-emerald-600 font-bold">{team.won}</td>
                                                    <td className="px-2 py-3.5 text-center font-jetbrains text-brand-muted">{team.drawn}</td>
                                                    <td className="px-2 py-3.5 text-center font-jetbrains text-brand-primary">{team.lost}</td>
                                                    <td className="px-3 py-3.5 text-center font-jetbrains text-brand-muted" title={`Gol: ${team.goalsFor} - Kebobolan: ${team.goalsAgainst}`}>
                                                        {team.goalsFor}:{team.goalsAgainst}
                                                    </td>
                                                    <td className={`px-5 py-3.5 text-center font-jetbrains text-sm font-black ${isQualified ? 'text-brand-primary bg-brand-primary/5' : 'text-brand-muted'}`}>
                                                        {team.points}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}