// Path: src/components/admin/BracketManagement.tsx
'use client';

import { useState } from 'react';
import { Shuffle, GitFork, Loader2, CheckCircle2, AlertTriangle, Eye, Globe } from 'lucide-react';

interface DraftMatch {
    groupName: string;
    homeTeamName: string;
    awayTeamName: string;
}

export default function BracketManagement() {
    const [isDrawing, setIsDrawing] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [draftMatches, setDraftMatches] = useState<DraftMatch[]>([]);
    const [hasReviewed, setHasReviewed] = useState(false);

    // KELOLA ACK SIMULASI DI LOCAL MEMORY FRONTEND (BELUM MASUK DB)
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
            // Acak Tim lokal
            const shuffled = [...teams].sort(() => Math.random() - 0.5);

            const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];
            const generatedDraft: DraftMatch[] = [];

            // Buat sampel simulasi pertandingan untuk direview admin
            shuffled.forEach((team, idx) => {
                const groupName = groups[idx % groups.length];
                if (idx > 0) {
                    generatedDraft.push({
                        groupName,
                        homeTeamName: shuffled[idx - 1],
                        awayTeamName: team
                    });
                }
            });

            setDraftMatches(generatedDraft.slice(0, 8)); // Tampilkan sampel 8 laga teratas untuk pratinjau review
            setHasReviewed(true);
            alert('Simulasi pengacakan grup berhasil di-generate! Silakan review draf di bawah sebelum melakukan publikasi.');
        } catch (err) {
            alert('Gagal memproses penarikan tim APPROVED.');
        } finally {
            setIsDrawing(false);
        }
    };

    // KIRIM DAN KUNCI DATA KE DATABASE SETELAH REVIU SAH
    const handlePublishToDatabase = async () => {
        if (!confirm('Apakah Koko yakin seluruh susunan draf jadwal sudah adil dan siap di-publish secara global ke seluruh player Belovesport?')) return;

        setIsPublishing(true);
        try {
            const res = await fetch('/api/admin/tournament/draw', { method: 'POST' });
            const data = await res.json();

            if (data.success) {
                alert('SUKSES TOTAL! Jadwal turnamen resmi dipublikasikan dan live di halaman depan.');
                setDraftMatches([]);
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
                <div className="lg:col-span-1 bg-brand-bg-surface border border-brand-border rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center border border-brand-primary/20">
                            <Shuffle size={24} className={isDrawing ? 'animate-spin' : ''} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black font-jetbrains text-brand-dark uppercase tracking-wider mb-2">Draw Protection Engine</h3>
                            <p className="text-[13px] text-brand-muted leading-relaxed">
                                Gunakan tombol di bawah untuk menarik seluruh pendaftar berstatus sah, lalu buat simulasi grup sirkuit sementara sebelum di-publish.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleSimulateDraw}
                        disabled={isDrawing || isPublishing}
                        className="w-full bg-brand-bg-light border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white font-black font-jetbrains py-3.5 rounded-xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-sm focus:ring-4 focus:ring-brand-primary/20"
                    >
                        {isDrawing ? <Loader2 size={15} className="animate-spin" /> : <Shuffle size={15} />}
                        {hasReviewed ? 'ACAK ULANG SIMULASI' : 'MULAI SIMULASI DRAW'}
                    </button>
                </div>

                {/* PANEL PRATINJAU REVIEW ADMIN (DRAFT LAUNCH GUARD) */}
                <div className="lg:col-span-2 bg-brand-bg-surface border border-brand-border rounded-3xl p-6 flex flex-col justify-between shadow-sm min-h-[350px]">
                    <div className="w-full">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-brand-border pb-4 mb-4 gap-3">
                            <h3 className="text-sm font-black font-jetbrains text-brand-dark uppercase tracking-wider flex items-center gap-2">
                                <Eye size={16} className="text-brand-primary" /> Pratinjau Draf Jadwal Arena
                            </h3>
                            <span className={`text-[10px] font-black font-jetbrains px-3 py-1 rounded-lg ${hasReviewed ? 'bg-amber-100 text-amber-700 border border-amber-300' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                                {hasReviewed ? 'STATUS: DRAFT REVIEW' : 'MENUNGGU ACK'}
                            </span>
                        </div>

                        {draftMatches.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-brand-muted border-2 border-dashed border-brand-border rounded-2xl bg-brand-bg-light/50">
                                <GitFork size={32} className="mb-3 opacity-20 text-brand-primary" />
                                <span className="text-xs font-semibold font-jetbrains text-center max-w-[250px]">
                                    Belum ada draf sirkuit. Klik tombol simulasi di samping kiri untuk menguji bagan.
                                </span>
                            </div>
                        ) : (
                            <div className="space-y-2.5 max-h-[220px] overflow-y-auto custom-scrollbar pr-2">
                                {draftMatches.map((m, index) => (
                                    <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between bg-brand-bg-light border border-brand-border rounded-xl p-3 sm:px-4 sm:py-3 text-[13px] font-semibold transition-colors hover:border-brand-primary/40 shadow-sm">

                                        <div className="flex items-center gap-3 mb-2 sm:mb-0">
                                            <span className="text-brand-primary font-jetbrains text-[10px] bg-brand-primary/5 border border-brand-primary/20 px-2.5 py-1 rounded-md shrink-0 font-black">
                                                GRUP {m.groupName}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-center flex-1 gap-3 sm:gap-6">
                                            <span className="text-brand-dark truncate text-right flex-1" title={m.homeTeamName}>{m.homeTeamName}</span>
                                            <span className="text-brand-muted/40 font-black text-[10px] font-jetbrains shrink-0">VS</span>
                                            <span className="text-brand-dark truncate text-left flex-1" title={m.awayTeamName}>{m.awayTeamName}</span>
                                        </div>
                                    </div>
                                ))}
                                <div className="text-center pt-2 text-[10px] font-bold text-brand-muted uppercase tracking-widest">
                                    -- Menampilkan Sampel 8 Laga Teratas --
                                </div>
                            </div>
                        )}
                    </div>

                    {hasReviewed && (
                        <div className="pt-5 border-t border-brand-border mt-5 space-y-4">
                            <div className="flex items-start gap-3 text-xs text-brand-dark font-medium leading-relaxed bg-brand-primary/5 border border-brand-primary/20 p-4 rounded-xl">
                                <AlertTriangle size={18} className="text-brand-primary shrink-0 mt-0.5" />
                                <span>Menekan tombol publish di bawah akan membersihkan bagan grup sirkuit lama secara permanen dan menyiarkan jadwal baru langsung ke perangkat para pemain di seluruh dunia. Pastikan susunan tim sudah dikunci.</span>
                            </div>

                            <button
                                onClick={handlePublishToDatabase}
                                disabled={isPublishing}
                                className="w-full bg-brand-primary hover:bg-brand-secondary disabled:bg-slate-300 disabled:text-slate-500 text-white font-black font-jetbrains py-4 rounded-xl text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/20 focus:ring-4 focus:ring-brand-primary/20 transition-all"
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