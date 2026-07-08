// Path: src/components/admin/BracketManagement.tsx
'use client';

import { useState } from 'react';
import { Shuffle, GitFork, Loader2, AlertTriangle, Eye, Globe, Award, Users } from 'lucide-react';

// Perubahan Interface: Sekarang draf menyimpan data per Grup, bukan per Match
interface DraftGroup {
    groupName: string;
    teams: string[];
}

export default function BracketManagement() {
    const [isDrawing, setIsDrawing] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [draftGroups, setDraftGroups] = useState<DraftGroup[]>([]); // Menyimpan hasil 16 grup
    const [totalTeamsCount, setTotalTeamsCount] = useState(0);
    const [hasReviewed, setHasReviewed] = useState(false);

    // KELOLA ACAK SIMULASI BERDASARKAN STRUKTUR GRUP MURNI (4 TIM / GRUP)
    const handleSimulateDraw = async () => {
        setIsDrawing(true);
        try {
            const res = await fetch('/api/admin/registrations?status=APPROVED');
            const data = await res.json();

            if (!data.success || data.data.length < 4) {
                alert(`Gagal! Jumlah tim terverifikasi kurang (${data.data?.length || 0}/4). Setujui pendaftaran di modul A-02 dulu Ko!`);
                setIsDrawing(false);
                return;
            }

            const teams = data.data.map((t: any) => t.teamName);
            setTotalTeamsCount(teams.length);

            // 🚀 ENGINE KOCOKAN FISHER-YATES (Lebih adil dan acak murni)
            const shuffledTeams = [...teams];
            for (let i = shuffledTeams.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffledTeams[i], shuffledTeams[j]] = [shuffledTeams[j], shuffledTeams[i]];
            }

            // Inisialisasi 16 Grup (A sampai P)
            const groupNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];
            const generatedGroups: DraftGroup[] = groupNames.map(name => ({
                groupName: name,
                teams: []
            }));

            // Distribusikan tim yang sudah diacak secara merata ke 16 grup
            shuffledTeams.forEach((teamName, idx) => {
                const targetGroupIdx = idx % groupNames.length;
                // Cegah penumpukan jika tim melebihi 64 (misal 65 karena tim utama Koko)
                if (generatedGroups[targetGroupIdx].teams.length < 4) {
                    generatedGroups[targetGroupIdx].teams.push(teamName);
                } else {
                    // Jika grup reguler penuh, masukkan ke grup sisa sebagai cadangan/slot dinamis
                    const fallbackGroup = generatedGroups.find(g => g.teams.length < 4);
                    if (fallbackGroup) fallbackGroup.teams.push(teamName);
                }
            });

            setDraftGroups(generatedGroups);
            setHasReviewed(true);
            alert(`Simulasi berhasil! ${teams.length} Tim didelegasikan ke dalam 16 Grup Sirkuit. Silakan cek pembagian tim per grup di panel pratinjau, Ko!`);
        } catch (err) {
            alert('Gagal memproses penarikan tim APPROVED.');
        } finally {
            setIsDrawing(false);
        }
    };

    // KIRIM DAN KUNCI JADWAL KE DATABASE
    const handlePublishToDatabase = async () => {
        if (!confirm('Apakah Koko yakin seluruh pembagian anggota grup sudah adil dan siap di-publish secara global?')) return;

        setIsPublishing(true);
        try {
            const res = await fetch('/api/admin/tournament/draw', { method: 'POST' });
            const data = await res.json();

            if (data.success) {
                alert('SUKSES TOTAL! Jadwal turnamen resmi dipublikasikan dan live di halaman depan.');
                setDraftGroups([]);
                setHasReviewed(false);
            } else {
                alert(data.message || 'Gagal menyimpan jadwal.');
            }
        } catch (error) {
            alert('Terjadi kesalahan transmisi database.');
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* HEADER MODUL */}
            <div className="pb-4 border-b border-brand-border">
                <h2 className="text-2xl font-black uppercase font-jetbrains text-brand-dark tracking-tight">
                    Modul A-03: <span className="text-brand-primary">Kelola Bracket & Grup</span>
                </h2>
                <p className="text-brand-muted text-sm mt-1">
                    Sistem kendali seeding terproteksi dengan fitur review pra-publikasi sirkuit.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* PANEL KONTROL UTAMA */}
                <div className="lg:col-span-1 bg-brand-bg-light border border-brand-border rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-all h-fit">
                    <div className="space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center border border-brand-primary/20">
                            <Shuffle size={24} className={isDrawing ? 'animate-spin' : ''} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black font-jetbrains text-brand-dark uppercase tracking-wider mb-2">Draw Protection Engine</h3>
                            <p className="text-[13px] text-brand-muted leading-relaxed">
                                Gunakan tombol di bawah untuk menarik seluruh pendaftar berstatus sah, lalu buat simulasi pembagian 16 grup sirkuit sementara sebelum di-publish.
                            </p>
                        </div>
                        {hasReviewed && (
                            <div className="bg-brand-bg-surface border border-brand-border p-3.5 rounded-xl text-xs font-semibold text-brand-dark flex justify-between items-center">
                                <span className="text-brand-muted flex items-center gap-1.5"><Users size={14} /> Total Ter-mapping:</span>
                                <span className="font-jetbrains font-black text-brand-primary bg-brand-primary/5 px-2 py-0.5 rounded border border-brand-primary/10">{totalTeamsCount} Tim</span>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleSimulateDraw}
                        disabled={isDrawing || isPublishing}
                        className="w-full bg-brand-bg-light border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed font-black font-jetbrains py-3.5 rounded-xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-sm focus:ring-4 focus:ring-brand-primary/20"
                    >
                        {isDrawing ? <Loader2 size={15} className="animate-spin" /> : <Shuffle size={15} />}
                        {hasReviewed ? 'ACAK ULANG SIMULASI' : 'MULAI SIMULASI DRAW'}
                    </button>
                </div>

                {/* PANEL PRATINJAU KELOMPOK 16 GRUP (GRID PREVIEW) */}
                <div className="lg:col-span-2 bg-brand-bg-light border border-brand-border rounded-3xl p-6 flex flex-col justify-between shadow-sm min-h-[450px]">
                    <div className="w-full">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-brand-border pb-4 mb-4 gap-3">
                            <h3 className="text-sm font-black font-jetbrains text-brand-dark uppercase tracking-wider flex items-center gap-2">
                                <Eye size={16} className="text-brand-primary" /> Pratinjau Pembagian Grup Arena
                            </h3>
                            <span className={`text-[10px] font-black font-jetbrains px-3 py-1 rounded-lg border ${hasReviewed
                                ? 'bg-brand-gold/10 text-brand-gold border-brand-gold/30 shadow-brand'
                                : 'bg-brand-bg-surface text-brand-muted border-brand-border'
                                }`}>
                                {hasReviewed ? 'STATUS: DRAFT REVIEW' : 'MENUNGGU ACK'}
                            </span>
                        </div>

                        {draftGroups.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 text-brand-muted border-2 border-dashed border-brand-border rounded-2xl bg-brand-bg-surface/50">
                                <GitFork size={32} className="mb-3 opacity-20 text-brand-primary animate-pulse-slow" />
                                <span className="text-xs font-semibold font-jetbrains text-center max-w-[250px] text-brand-muted">
                                    Belum ada draf sirkuit. Klik tombol simulasi di samping kiri untuk menguji bagan kelompok.
                                </span>
                            </div>
                        ) : (
                            // 🚀 GRID 16 GRUP INTERAKTIF UNTUK REVIEW PREMIUM
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {draftGroups.map((group) => (
                                    <div key={group.groupName} className="bg-white border border-brand-border rounded-xl overflow-hidden shadow-sm flex flex-col">
                                        {/* Banner Kepala Grup */}
                                        <div className="px-3.5 py-2 bg-brand-bg-surface border-b border-brand-border flex items-center justify-between">
                                            <span className="font-jetbrains font-black text-brand-primary text-xs uppercase tracking-wider flex items-center gap-1.5">
                                                <Award size={13} className="text-brand-gold" /> GRUP {group.groupName}
                                            </span>
                                            <span className="text-[9px] font-bold font-jetbrains text-brand-muted">
                                                {group.teams.length}/4 Slot
                                            </span>
                                        </div>
                                        {/* Daftar Nama Tim di Dalam Grup */}
                                        <div className="p-2.5 space-y-1.5 flex-1 bg-brand-bg-light/40">
                                            {group.teams.length === 0 ? (
                                                <p className="text-[11px] text-brand-muted italic p-2">Kosong</p>
                                            ) : (
                                                group.teams.map((teamName, tIdx) => (
                                                    <div key={tIdx} className="px-2.5 py-1.5 bg-brand-bg-surface border border-brand-border rounded-md text-xs font-semibold text-brand-dark flex items-center gap-2 truncate" title={teamName}>
                                                        <span className="w-4 h-4 rounded bg-brand-primary/5 text-brand-primary border border-brand-primary/10 flex items-center justify-center text-[9px] font-black font-jetbrains shrink-0">
                                                            {tIdx + 1}
                                                        </span>
                                                        <span className="truncate">{teamName}</span>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {hasReviewed && (
                        <div className="pt-5 border-t border-brand-border mt-5 space-y-4">
                            <div className="flex items-start gap-3 text-xs text-brand-dark font-medium leading-relaxed bg-brand-primary/5 border border-brand-primary/20 p-4 rounded-xl">
                                <AlertTriangle size={18} className="text-brand-primary shrink-0 mt-0.5" />
                                <span className="text-brand-dark">Menekan tombol publish di bawah akan membersihkan bagan grup sirkuit lama secara permanen dan menyiarkan jadwal baru langsung ke perangkat para pemain di seluruh dunia. Pastikan susunan tim sudah dikunci.</span>
                            </div>

                            <button
                                onClick={handlePublishToDatabase}
                                disabled={isPublishing}
                                className="w-full bg-brand-primary hover:bg-brand-secondary disabled:bg-brand-border disabled:text-brand-muted text-white font-black font-jetbrains py-4 rounded-xl text-sm uppercase tracking-widest flex-items-center justify-center gap-2 shadow-lg hover:shadow-brand transition-all focus:ring-4 focus:ring-brand-primary/20"
                            >
                                {isPublishing ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        MENYUNTIKKAN DATA JADWAL...
                                    </>
                                ) : (
                                    <>
                                        <Globe size={16} />
                                        PUBLISH JADWAL RESMI (LIVE)
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}