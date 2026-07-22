// Path: src/app/tournament/match/[matchId]/page.tsx
'use client';

/**
 * BELOVESPORT — Match Center
 *
 * Detail satu pertandingan: scoreboard besar, statistik head-to-head,
 * dan bukti screenshot in-game. Visual mengikuti HTML referensi
 * "Match Center - Stats Analytics" (token M3 sama seperti Schedule &
 * Leaderboard).
 *
 * STATUS DATA — penting:
 *  - Skor, tim, waktu, status: NYATA, dari endpoint yang sama dengan
 *    Schedule (perluasan tipe `Match`).
 *  - Statistik (possession/shots/passes/fouls/cards) & screenshot
 *    bukti: BELUM ada field-nya di backend per konfirmasi pemilik
 *    produk. Tipe dibuat opsional (`stats: MatchStats | null`,
 *    `proofImages: ProofImage[]`) sehingga UI WAJIB menampilkan empty
 *    state yang jujur ("belum diinput") ketika kosong — bukan
 *    menampilkan angka 0 atau placeholder yang terlihat seperti data
 *    asli. Ini prinsip yang sama dengan perbaikan badge "LIVE" palsu
 *    di landing page sebelumnya: jangan tampilkan sesuatu sebagai
 *    fakta kalau itu belum benar-benar ada.
 *
 * ⚠️ GANTI SEBELUM GO-LIVE: field `stats` dan `proofImages` di
 * interface `MatchDetail` mengasumsikan nama & bentuk yang BELUM
 * dikonfirmasi backend. Sesuaikan begitu skema API statistik selesai
 * dirancang — cari komentar ini untuk semua titik yang perlu dicek.
 */

import { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import {
    ArrowLeft,
    Loader2,
    ShieldAlert,
    RefreshCw,
    ImageOff,
    Lightbulb,
    Circle,
    MapPin,
    Bell,
    User,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────
// Tipe data
// ─────────────────────────────────────────────────────────

interface TeamRef {
    teamName: string;
    participantId: string | null;
}

// ⚠️ GANTI SEBELUM GO-LIVE: bentuk objek ini asumsi, belum dikonfirmasi backend.
interface MatchStats {
    possessionHome: number; // persen, 0–100
    possessionAway: number;
    shotsHome: number;
    shotsOnTargetHome: number;
    shotsAway: number;
    shotsOnTargetAway: number;
    passesHome: number;
    passAccuracyHome: number; // persen
    passesAway: number;
    passAccuracyAway: number;
    foulsHome: number;
    foulsAway: number;
    yellowCardsHome: number;
    yellowCardsAway: number;
}

// ⚠️ GANTI SEBELUM GO-LIVE: field nama & bentuk asumsi, belum dikonfirmasi backend.
interface ProofImage {
    legNumber: 1 | 2;
    url: string;
    uploadedAt: string | null;
}

interface MatchDetail {
    id: string;
    stage: string;
    groupName: string | null;
    matchNumber: number;
    homeTeam: TeamRef | null;
    awayTeam: TeamRef | null;
    homeScoreLeg1: number | null;
    awayScoreLeg1: number | null;
    homeScoreLeg2: number | null;
    awayScoreLeg2: number | null;
    matchStatus: string;
    scheduledTime: string | null;
    venue: string | null;
    // Field di bawah ini opsional/nullable dengan sengaja — lihat catatan di atas.
    stats: { leg1: MatchStats | null; leg2: MatchStats | null } | null;
    proofImages: ProofImage[];
}

const stageLabels: Record<string, string> = {
    GROUP: 'Fase Grup',
    KNOCKOUT_32: '32 Besar (2 Leg)',
    KNOCKOUT_16: '16 Besar (2 Leg)',
    QUARTER_FINAL: 'Perempat Final',
    SEMI_FINAL: 'Semi Final',
    FINAL: 'Grand Final',
    THIRD_PLACE: 'Juara 3 & 4',
};

const CREST_PALETTE = ['#561B1D', '#82403B', '#CD8133', '#B45309', '#0F766E', '#1D4ED8', '#7C3AED', '#BE185D'];
const getCrestColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return CREST_PALETTE[Math.abs(hash) % CREST_PALETTE.length];
};
const getInitials = (name: string) => {
    if (!name || name === 'TBD') return '?';
    const words = name.trim().split(/\s+/);
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
};

const fetcher = (url: string) =>
    fetch(url, { credentials: 'include' }).then((res) => {
        if (res.status === 401) {
            window.location.href = '/login';
            return;
        }
        if (!res.ok) throw new Error('Gagal memuat detail pertandingan.');
        return res.json();
    });

export default function MatchCenterPage({ params }: { params: { matchId: string } }) {
    const [activeLeg, setActiveLeg] = useState<1 | 2>(1);

    const { data: resData, error, isLoading, mutate } = useSWR(
        `/api/tournament/match/${params.matchId}`,
        fetcher,
        { refreshInterval: 15000, revalidateOnFocus: true }
    );

    const match: MatchDetail | null = resData?.success ? resData.data : null;
    const errorMsg = error
        ? 'Gagal terhubung ke server API sirkuit.'
        : !isLoading && !resData?.success
            ? resData?.message || 'Pertandingan tidak ditemukan.'
            : '';

    return (
        <div className="min-h-screen bg-[#fff8f7] text-[#211a1a] flex flex-col relative overflow-x-hidden">
            {/* Ambient glow — persis HTML referensi */}
            <div
                aria-hidden
                className="fixed inset-0 pointer-events-none -z-10"
                style={{
                    background:
                        'radial-gradient(circle at 10% 10%, rgba(86,27,29,0.05) 0%, transparent 40%), radial-gradient(circle at 90% 90%, rgba(252,179,53,0.05) 0%, transparent 40%)',
                }}
            />

            {/* TOP NAVBAR */}
            <header className="sticky top-0 z-50 border-b border-[#d9c1c0]/40 bg-[#fff8f7]/80 backdrop-blur-xl shadow-sm">
                <nav className="flex justify-between items-center w-full px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto h-16 sm:h-20">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/tournament/schedule"
                            className="p-2 rounded-xl bg-[#f9ebe9] border border-[#d9c1c0] hover:border-[#561b1d] transition-all"
                            aria-label="Kembali ke jadwal"
                        >
                            <ArrowLeft size={18} className="text-[#8f4a45]" />
                        </Link>
                        <span className="font-black text-base sm:text-lg tracking-tighter text-[#3a060a]">BELOVESPORT</span>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            aria-label="Notifikasi"
                            className="relative p-2 rounded-full text-[#534342] hover:bg-[#fff0ef] transition-all"
                        >
                            <Bell size={18} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-[#3a060a] rounded-full" />
                        </button>
                        <div className="w-9 h-9 rounded-full bg-[#f4e5e4] border border-[#d9c1c0] flex items-center justify-center">
                            <User size={16} className="text-[#3a060a]" />
                        </div>
                    </div>
                </nav>
            </header>

            <main className="flex-grow w-full px-4 sm:px-8 lg:px-16 py-8 sm:py-10">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-28 text-[#3a060a]">
                        <div className="p-5 rounded-2xl bg-white border border-[#d9c1c0] shadow-sm mb-5">
                            <Loader2 size={32} className="animate-spin" />
                        </div>
                        <p className="text-sm font-bold text-[#534342]">Memuat data pertandingan...</p>
                    </div>
                ) : errorMsg || !match ? (
                    <div className="bg-white border border-red-200 text-red-600 p-8 rounded-2xl text-center max-w-md mx-auto mt-16 flex flex-col items-center shadow-sm">
                        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 mb-4">
                            <ShieldAlert size={28} />
                        </div>
                        <p className="font-bold text-sm">{errorMsg || 'Pertandingan tidak ditemukan.'}</p>
                        <div className="flex gap-3 mt-5">
                            <button
                                type="button"
                                onClick={() => mutate()}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold bg-[#561b1d] text-[#d47f7e] hover:brightness-110 active:scale-95 transition-all shadow-sm"
                            >
                                <RefreshCw size={14} /> Coba Lagi
                            </button>
                            <Link
                                href="/tournament/schedule"
                                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold border border-[#d9c1c0] text-[#534342] hover:bg-[#fff0ef] transition-all"
                            >
                                Kembali ke Jadwal
                            </Link>
                        </div>
                    </div>
                ) : (
                    <MatchCenterContent match={match} activeLeg={activeLeg} setActiveLeg={setActiveLeg} />
                )}
            </main>

            {/* FOOTER */}
            <footer className="w-full mt-auto bg-[#f4e5e4] border-t border-[#d9c1c0] flex flex-col md:flex-row justify-between items-center py-8 px-4 sm:px-8 lg:px-16 gap-5">
                <div className="flex flex-col gap-1">
                    <span className="font-black text-[#211a1a]">BELOVESPORT</span>
                    <p className="text-xs text-[#534342]/80">© 2026 BELOVESPORT INDONESIA. ALL RIGHTS RESERVED.</p>
                </div>
                <div className="flex flex-wrap gap-5 justify-center">
                    <Link href="/kebijakan-privasi" className="text-xs text-[#534342] hover:text-[#3a060a] hover:underline transition-all">
                        Privacy Policy
                    </Link>
                    <Link href="/syarat-ketentuan" className="text-xs text-[#534342] hover:text-[#3a060a] hover:underline transition-all">
                        Terms of Service
                    </Link>
                    <a
                        href="https://wa.me/62895327761216"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#534342] hover:text-[#3a060a] hover:underline transition-all"
                    >
                        Contact Support
                    </a>
                </div>
            </footer>
        </div>
    );
}

// ─────────────────────────────────────────────────────────
// Konten utama — dipisah dari shell agar guard loading/error di atas tetap sederhana
// ─────────────────────────────────────────────────────────

function MatchCenterContent({
    match,
    activeLeg,
    setActiveLeg,
}: {
    match: MatchDetail;
    activeLeg: 1 | 2;
    setActiveLeg: (leg: 1 | 2) => void;
}) {
    const isGroupStage = match.stage === 'GROUP';
    const isCompleted = match.matchStatus === 'COMPLETED';
    const isPlaying = match.matchStatus === 'PLAYING';
    const homeTeamName = match.homeTeam?.teamName || 'TBD';
    const awayTeamName = match.awayTeam?.teamName || 'TBD';

    const hasBothLegs = !isGroupStage;
    const homeScore = activeLeg === 1 ? match.homeScoreLeg1 : match.homeScoreLeg2;
    const awayScore = activeLeg === 1 ? match.awayScoreLeg1 : match.awayScoreLeg2;
    const hasScoreForActiveLeg = homeScore !== null && awayScore !== null;

    const statusText = isCompleted ? 'Match Result — Full Time' : isPlaying ? 'Sedang Berlangsung' : 'Terjadwal';
    const statusPillText = isCompleted ? 'MATCH FINISHED' : isPlaying ? 'LIVE PLAYING' : 'BELUM DIMULAI';

    const currentStats = match.stats ? (activeLeg === 1 ? match.stats.leg1 : match.stats.leg2) : null;
    const currentProof = match.proofImages.filter((p) => p.legNumber === activeLeg);

    return (
        <div className="max-w-7xl mx-auto">
            {/* Tab Leg — hanya muncul untuk babak knockout 2-leg */}
            {hasBothLegs && (
                <div className="flex items-center gap-2 mb-5">
                    {[1, 2].map((leg) => (
                        <button
                            key={leg}
                            type="button"
                            onClick={() => setActiveLeg(leg as 1 | 2)}
                            className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${activeLeg === leg
                                    ? 'bg-[#561b1d] text-[#d47f7e] shadow-sm'
                                    : 'bg-white border border-[#d9c1c0] text-[#534342] hover:bg-[#fff0ef]'
                                }`}
                        >
                            Leg {leg}
                        </button>
                    ))}
                </div>
            )}

            {/* SCOREBOARD */}
            <section className="mb-8 sm:mb-10">
                <div className="bg-[#561b1d] rounded-2xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between shadow-lg relative overflow-hidden">
                    <div
                        aria-hidden
                        className="absolute inset-0 opacity-10 pointer-events-none"
                        style={{ background: 'radial-gradient(circle at center, rgba(255,255,255,0.2), transparent 70%)' }}
                    />

                    {/* Tim Home */}
                    <div className="flex flex-col items-center md:items-start gap-1 z-10">
                        <span className="text-[11px] font-bold text-[#d47f7e] uppercase tracking-widest">{statusText}</span>
                        <div className="flex items-center gap-3 mt-1">
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black shadow-md shrink-0"
                                style={{ backgroundColor: getCrestColor(homeTeamName) }}
                            >
                                {getInitials(homeTeamName)}
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-white">{homeTeamName}</h2>
                        </div>
                    </div>

                    {/* Skor tengah */}
                    <div className="flex flex-col items-center justify-center my-5 md:my-0 z-10">
                        <div className="flex items-center gap-6">
                            <span className="text-5xl sm:text-6xl font-black text-white tracking-tight">
                                {hasScoreForActiveLeg ? homeScore : '–'}
                            </span>
                            <div className="h-10 w-px bg-white/20" aria-hidden />
                            <span className="text-5xl sm:text-6xl font-black text-white tracking-tight">
                                {hasScoreForActiveLeg ? awayScore : '–'}
                            </span>
                        </div>
                        <div className="bg-[#ffba48]/20 px-4 py-1 rounded-full mt-3">
                            <span className="text-xs font-bold text-[#ffba48]">{statusPillText}</span>
                        </div>
                        {hasBothLegs && (
                            <p className="text-[10px] font-bold text-white/50 mt-2 uppercase tracking-wide">Leg {activeLeg}</p>
                        )}
                    </div>

                    {/* Tim Away */}
                    <div className="flex flex-col items-center md:items-end gap-1 z-10">
                        <span className="text-[11px] font-bold text-[#d47f7e] uppercase tracking-widest flex items-center gap-1">
                            <MapPin size={11} aria-hidden />
                            {match.venue || 'Venue belum ditentukan'}
                        </span>
                        <div className="flex items-center gap-3 flex-row-reverse mt-1">
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black shadow-md shrink-0"
                                style={{ backgroundColor: getCrestColor(awayTeamName) }}
                            >
                                {getInitials(awayTeamName)}
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-white text-right">{awayTeamName}</h2>
                        </div>
                    </div>
                </div>

                <p className="mt-3 text-center text-xs font-medium text-[#534342]">
                    {stageLabels[match.stage] || match.stage}
                    {isGroupStage && match.groupName ? ` · Grup ${match.groupName}` : ''}
                    {match.scheduledTime && (
                        <>
                            {' · '}
                            {new Date(match.scheduledTime).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            {' · '}
                            {new Date(match.scheduledTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                        </>
                    )}
                </p>
            </section>

            {/* STATS + BUKTI */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* Kolom kiri — bukti screenshot */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-base font-bold text-[#3a060a]">Bukti Pertandingan</h3>
                        {currentProof.length > 0 && (
                            <span className="text-[10px] font-bold text-[#534342] bg-[#f4e5e4] px-2.5 py-1 rounded">
                                {currentProof.length} FILE
                            </span>
                        )}
                    </div>

                    {currentProof.length > 0 ? (
                        <div className="flex flex-col gap-3">
                            {currentProof.map((proof, i) => (
                                <div key={i} className="relative aspect-video rounded-2xl overflow-hidden border border-[#d9c1c0] shadow-lg group">
                                    <img
                                        src={proof.url}
                                        alt={`Bukti skor pertandingan ${homeTeamName} vs ${awayTeamName}, leg ${proof.legNumber}`}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        // Empty state jujur — bukan gambar placeholder yang terlihat seperti bukti asli
                        <div className="aspect-video rounded-2xl border-2 border-dashed border-[#d9c1c0] bg-white flex flex-col items-center justify-center gap-2 text-center px-6">
                            <ImageOff size={32} className="text-[#8f4a45]/40" aria-hidden />
                            <p className="text-sm font-bold text-[#534342]">Belum ada bukti diunggah</p>
                            <p className="text-xs text-[#534342]/70">
                                Screenshot skor akan tampil di sini setelah tim melapor hasil pertandingan.
                            </p>
                        </div>
                    )}
                </div>

                {/* Kolom kanan — statistik */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-base font-bold text-[#3a060a]">Statistik Pertandingan</h3>
                        {currentStats && (
                            <span className="text-[10px] font-bold text-[#ffba48] bg-[#3a060a] px-2.5 py-1 rounded">
                                TERVERIFIKASI
                            </span>
                        )}
                    </div>

                    {currentStats ? (
                        <div className="bg-white rounded-2xl border border-[#d9c1c0] shadow-lg overflow-hidden">
                            <div className="bg-[#3a060a] px-5 py-3.5 flex justify-between items-center text-white border-b-2 border-[#ffba48]">
                                <span className="text-xs font-bold uppercase tracking-wider truncate max-w-[30%]">{homeTeamName}</span>
                                <span className="text-sm font-bold uppercase tracking-[0.15em] opacity-80">Statistik</span>
                                <span className="text-xs font-bold uppercase tracking-wider truncate max-w-[30%] text-right">{awayTeamName}</span>
                            </div>

                            <div className="flex flex-col">
                                <StatRow label="Possession" home={`${currentStats.possessionHome}%`} away={`${currentStats.possessionAway}%`} />
                                <StatRow
                                    label="Shots (On Target)"
                                    home={`${currentStats.shotsHome} (${currentStats.shotsOnTargetHome})`}
                                    away={`${currentStats.shotsAway} (${currentStats.shotsOnTargetAway})`}
                                />
                                <StatRow
                                    label="Passes"
                                    home={String(currentStats.passesHome)}
                                    homeSub={`${currentStats.passAccuracyHome}% akurasi`}
                                    away={String(currentStats.passesAway)}
                                    awaySub={`${currentStats.passAccuracyAway}% akurasi`}
                                />
                                <StatRow label="Fouls" home={String(currentStats.foulsHome)} away={String(currentStats.foulsAway)} />
                                <StatRow
                                    label="Kartu Kuning"
                                    home={String(currentStats.yellowCardsHome)}
                                    away={String(currentStats.yellowCardsAway)}
                                    isLast
                                />
                            </div>

                            <div className="h-1.5 bg-gradient-to-r from-[#561b1d] via-[#ffba48] to-[#561b1d]" />
                        </div>
                    ) : (
                        // Empty state jujur — tidak menampilkan angka 0 yang bisa disalahartikan sebagai hasil asli
                        <div className="rounded-2xl border-2 border-dashed border-[#d9c1c0] bg-white flex flex-col items-center justify-center gap-2 text-center px-6 py-14">
                            <Circle size={32} className="text-[#8f4a45]/40" aria-hidden />
                            <p className="text-sm font-bold text-[#534342]">Statistik belum diinput</p>
                            <p className="text-xs text-[#534342]/70 max-w-xs">
                                Admin belum memasukkan data possession, shots, dan statistik lain untuk pertandingan ini.
                            </p>
                        </div>
                    )}

                    {/* Insight — hanya tampil kalau statistik tersedia, karena tanpa data tidak ada insight jujur untuk ditampilkan */}
                    {currentStats && (
                        <div className="bg-[#f4e5e4] rounded-2xl p-4 border-l-4 border-[#ffba48] flex items-start gap-3">
                            <Lightbulb size={18} className="text-[#ffba48] mt-0.5 shrink-0" aria-hidden />
                            <div>
                                <p className="text-sm font-bold text-[#3a060a]">Insight</p>
                                <p className="text-sm text-[#534342]">{buildInsight(currentStats, homeTeamName, awayTeamName)}</p>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

// ─────────────────────────────────────────────────────────
// Baris statistik — mendukung sub-label (contoh: akurasi passing)
// ─────────────────────────────────────────────────────────

function StatRow({
    label,
    home,
    away,
    homeSub,
    awaySub,
    isLast = false,
}: {
    label: string;
    home: string;
    away: string;
    homeSub?: string;
    awaySub?: string;
    isLast?: boolean;
}) {
    return (
        <div className={`flex items-center justify-between px-5 py-4 ${!isLast ? 'border-b border-[#d9c1c0]/30' : ''}`}>
            <div className="w-1/4 flex flex-col">
                <span className="text-lg font-bold text-[#3a060a]">{home}</span>
                {homeSub && <span className="text-[10px] text-[#534342]">{homeSub}</span>}
            </div>
            <span className="w-2/4 text-center text-xs font-bold text-[#534342] uppercase tracking-widest">{label}</span>
            <div className="w-1/4 flex flex-col items-end">
                <span className="text-lg font-bold text-[#3a060a]">{away}</span>
                {awaySub && <span className="text-[10px] text-[#534342] text-right">{awaySub}</span>}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────
// Insight otomatis sederhana — dibangun dari data nyata yang tersedia,
// bukan teks generik statis (kalau statistik kosong, fungsi ini tidak dipanggil sama sekali)
// ─────────────────────────────────────────────────────────

function buildInsight(stats: MatchStats, homeTeam: string, awayTeam: string): string {
    const passDiff = stats.passesAway - stats.passesHome;
    const shotDiff = stats.shotsOnTargetAway - stats.shotsOnTargetHome;
    const dominant = passDiff > 20 ? awayTeam : passDiff < -20 ? homeTeam : null;
    const samePossession = Math.abs(stats.possessionHome - stats.possessionAway) <= 4;

    if (dominant && samePossession) {
        return `${dominant} mendominasi volume passing meski waktu penguasaan bola relatif seimbang.`;
    }
    if (Math.abs(shotDiff) >= 3) {
        const better = shotDiff > 0 ? awayTeam : homeTeam;
        return `${better} jauh lebih efisien dalam konversi peluang menjadi tembakan tepat sasaran.`;
    }
    return 'Kedua tim menunjukkan performa yang relatif seimbang di sebagian besar metrik pertandingan.';
}