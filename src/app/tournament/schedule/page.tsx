// Path: src/app/tournament/schedule/page.tsx
'use client';

/**
 * BELOVESPORT — Tournament Schedule
 *
 * Rombak visual total mengikuti desain HTML "Tournament Schedule"
 * (Material Design 3 token: primary-container, on-surface-variant,
 * surface-container-lowest, dst). Logika bisnis, fetching, filter,
 * sorting, dan guard kepemilikan tim DIPERTAHANKAN PENUH dari versi
 * sebelumnya — hanya lapisan visual yang diganti.
 *
 * Palet M3 dari HTML referensi (disuntik sebagai warna literal karena
 * project ini belum punya token M3 di tailwind.config):
 *   primary            #3a060a   on-primary            #ffffff
 *   primary-container  #561b1d   on-primary-container   #d47f7e
 *   secondary          #8f4a45   secondary-container    #ffa79f
 *   tertiary-fixed     #ffddb0   on-tertiary-fixed      #291800
 *   surface            #fff8f7   surface-container-lowest #ffffff
 *   surface-container  #f9ebe9   outline-variant        #d9c1c0
 *   on-surface         #211a1a   on-surface-variant     #534342
 *   error / error-cont #ba1a1a / #ffdad6
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import {
    Calendar,
    Clock,
    Loader2,
    ShieldAlert,
    Trophy,
    Filter,
    Swords,
    Bell,
    RefreshCw,
    Gamepad2,
    CheckSquare,
    Search,
    X,
    User,
} from 'lucide-react';
import LogoutButtonParticipant from '@/components/participant/LogoutButton';

interface Match {
    id: string;
    stage: string;
    groupName: string | null;
    matchNumber: number;
    homeTeam: { teamName: string; participantId: string | null } | null;
    awayTeam: { teamName: string; participantId: string | null } | null;
    homeScoreLeg1: number | null;
    awayScoreLeg1: number | null;
    homeScoreLeg2: number | null;
    awayScoreLeg2: number | null;
    matchStatus: string;
    scheduledTime: string | null;
}

const STAGE_TABS = [
    { id: 'ALL', label: 'Semua Match', short: 'Semua' },
    { id: 'GROUP', label: 'Fase Grup', short: 'Grup' },
    { id: 'KNOCKOUT_32', label: '32 Besar', short: '32B' },
    { id: 'KNOCKOUT_16', label: '16 Besar', short: '16B' },
    { id: 'QUARTER_FINAL', label: '8 Besar', short: '8B' },
    { id: 'FINAL', label: 'Finals', short: 'Final' },
];

const stageLabels: Record<string, string> = {
    GROUP: 'Fase Grup',
    KNOCKOUT_32: '32 Besar (2 Leg)',
    KNOCKOUT_16: '16 Besar (2 Leg)',
    QUARTER_FINAL: 'Perempat Final',
    SEMI_FINAL: 'Semi Final',
    FINAL: 'Grand Final',
    THIRD_PLACE: 'Juara 3 & 4',
};

// Urutan prioritas status — laga LIVE & butuh validasi selalu muncul duluan
const STATUS_PRIORITY: Record<string, number> = {
    PLAYING: 0,
    WAITING_VERIFICATION: 1,
    SCHEDULED: 2,
    COMPLETED: 3,
};

// Crest inisial tim
const getInitials = (name: string) => {
    if (!name || name === 'TBD') return '?';
    const words = name.trim().split(/\s+/);
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
};

const CREST_PALETTE = ['#561B1D', '#82403B', '#CD8133', '#B45309', '#0F766E', '#1D4ED8', '#7C3AED', '#BE185D'];
const getCrestColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return CREST_PALETTE[Math.abs(hash) % CREST_PALETTE.length];
};

const fetcher = (url: string) =>
    fetch(url, { credentials: 'include' }).then((res) => {
        if (res.status === 401) {
            window.location.href = '/login';
            return;
        }
        if (!res.ok) throw new Error('Gagal menarik data jadwal dari server.');
        return res.json();
    });

export default function SchedulePage() {
    const [activeStageFilter, setActiveStageFilter] = useState<string>('ALL');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    // Ambil data session user saat runtime client
    useEffect(() => {
        async function getSession() {
            try {
                const res = await fetch('/api/auth/me');
                const data = await res.json();
                if (data?.user?.id) {
                    setCurrentUserId(data.user.id);
                }
            } catch (err) {
                console.error('Gagal memetakan sesi login player:', err);
            }
        }
        getSession();
    }, []);

    // LIVE POLLING SCHEDULE ENGINE
    const { data: resData, error, isLoading, mutate } = useSWR('/api/tournament/schedule', fetcher, {
        refreshInterval: 15000,
        revalidateOnFocus: true,
    });

    const matches: Match[] = resData?.success ? resData.data : [];
    const errorMsg = error
        ? 'Gagal terhubung ke server API sirkuit.'
        : !resData?.success && resData?.message
            ? resData.message
            : '';

    const filteredMatches = matches
        .filter((m) => activeStageFilter === 'ALL' || m.stage === activeStageFilter)
        .filter((m) => {
            if (!searchQuery.trim()) return true;
            const q = searchQuery.trim().toLowerCase();
            return m.homeTeam?.teamName?.toLowerCase().includes(q) || m.awayTeam?.teamName?.toLowerCase().includes(q);
        });

    // Sortir cerdas: LIVE & butuh validasi mengambang di atas, lalu terjadwal (waktu terdekat), selesai di bawah
    const sortedMatches = [...filteredMatches].sort((a, b) => {
        const pa = STATUS_PRIORITY[a.matchStatus] ?? 2;
        const pb = STATUS_PRIORITY[b.matchStatus] ?? 2;
        if (pa !== pb) return pa - pb;
        const ta = a.scheduledTime ? new Date(a.scheduledTime).getTime() : Infinity;
        const tb = b.scheduledTime ? new Date(b.scheduledTime).getTime() : Infinity;
        return ta - tb;
    });

    const statusLabel = errorMsg ? 'TERPUTUS' : isLoading ? 'SINKRONISASI' : 'LIVE POLLING';

    return (
        <div className="min-h-screen bg-[#fff8f7] text-[#211a1a] flex flex-col">
            {/* TOP NAVBAR — desktop: nav lengkap. Mobile: top app bar ringkas ala HTML referensi kedua (glass, logo + notif + avatar) */}
            <header className="sticky top-0 z-50 border-b border-[#d9c1c0]/40 bg-[#fff8f7]/80 backdrop-blur-xl shadow-sm">
                <nav className="flex justify-between items-center w-full px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto h-16 sm:h-20">
                    <div className="flex items-center gap-3">
                        <Link href="/profil" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-[#561b1d] shrink-0">
                                <img src="/logos/logo_BELOVESPORT.png" alt="Belovesport" className="w-full h-full object-cover" />
                            </div>
                            <span className="font-black text-base sm:text-lg tracking-tighter text-[#3a060a] group-hover:opacity-70 transition-opacity">
                                BELOVESPORT
                            </span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        <span className="text-[#3a060a] font-bold text-sm">Schedule</span>
                        <Link href="/tournament/leaderboard" className="text-[#534342] hover:text-[#3a060a] transition-colors text-sm">
                            Standings
                        </Link>
                        <Link href="/tournament/bracket" className="text-[#534342] hover:text-[#3a060a] transition-colors text-sm">
                            Bracket
                        </Link>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            aria-label="Notifikasi"
                            className="relative p-2 rounded-full text-[#534342] hover:bg-[#fff0ef] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#561b1d]/40"
                        >
                            <Bell size={18} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-[#3a060a] rounded-full" />
                        </button>
                        {/* Avatar bulat ala top app bar mobile — sekaligus jadi target LogoutButtonParticipant di desktop */}
                        <div className="sm:hidden w-8 h-8 rounded-full bg-[#f9ebe9] border border-[#d9c1c0]/40 overflow-hidden flex items-center justify-center">
                            <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-[#561b1d]">
                                {currentUserId ? currentUserId.slice(0, 2).toUpperCase() : '?'}
                            </div>
                        </div>
                        <div className="hidden sm:block">
                            <LogoutButtonParticipant />
                        </div>
                    </div>
                </nav>
            </header>

            {/* MAIN CONTENT */}
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-6 sm:py-10 pb-28 md:pb-10">
                {/* HEADER SECTION — mobile: eyebrow accent bar ala HTML referensi kedua. Desktop: layout lama dipertahankan */}
                <section className="mb-6 sm:mb-10">
                    {/* Eyebrow — khusus terlihat di mobile, menyatukan bahasa "Tournament Schedule" pill kecil */}
                    <div className="flex items-center gap-2 mb-1 md:hidden">
                        <span className="w-8 h-1 bg-[#3a060a] rounded-full" aria-hidden />
                        <span className="text-[11px] font-bold text-[#534342] uppercase tracking-widest">Tournament Schedule</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
                        <div>
                            <h1 className="text-[26px] sm:text-[32px] leading-tight font-bold tracking-tight text-[#3a060a] mb-1">
                                <span className="md:hidden">Jadwal Tanding</span>
                                <span className="hidden md:inline">Tournament Schedule</span>
                            </h1>
                            <p className="text-[#534342] text-sm sm:text-base">
                                Pantau seluruh jadwal &amp; hasil pertandingan sirkuit Belovesport secara live.
                            </p>
                        </div>

                        {/* STATUS + REFRESH — menggantikan filter statis HTML dengan kontrol live sungguhan */}
                        <div className="flex items-center gap-2.5 flex-wrap">
                            <button
                                type="button"
                                onClick={() => mutate()}
                                disabled={isLoading}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold bg-[#561b1d] text-[#d47f7e] hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 shadow-sm"
                            >
                                <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                                <span className="sm:hidden">{isLoading ? '...' : 'Refresh'}</span>
                                <span className="hidden sm:inline">{isLoading ? 'Sinkronisasi...' : 'Perbarui Jadwal'}</span>
                            </button>

                            <div
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold tracking-wide border shadow-sm ${errorMsg
                                        ? 'border-red-200 bg-red-50 text-red-600'
                                        : 'border-[#d9c1c0] bg-white text-[#534342]'
                                    }`}
                            >
                                <span className="relative flex h-2 w-2 shrink-0">
                                    {!errorMsg && (
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 bg-[#3a060a]" />
                                    )}
                                    <span className={`relative inline-flex rounded-full h-2 w-2 ${errorMsg ? 'bg-red-500' : 'bg-[#3a060a]'}`} />
                                </span>
                                {statusLabel}
                            </div>

                            <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-[11px] font-bold tracking-wide uppercase text-[#534342] bg-white border border-[#d9c1c0]">
                                <Clock size={12} />
                                WIB (GMT+7)
                            </div>
                        </div>
                    </div>
                </section>

                {/* FILTER TAB — bahasa pill M3, primary-container saat aktif */}
                <section className="mb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 flex-1 min-w-0">
                            <div className="hidden md:flex items-center gap-1.5 text-xs font-bold uppercase text-[#534342] pr-3 border-r border-[#d9c1c0] shrink-0">
                                <Filter size={14} /> Stage
                            </div>
                            {STAGE_TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveStageFilter(tab.id)}
                                    className={`shrink-0 px-5 py-2.5 sm:px-5 sm:py-2 rounded-full text-sm font-medium transition-all ${activeStageFilter === tab.id
                                            ? 'bg-[#561b1d] text-[#d47f7e] shadow-md sm:shadow-sm'
                                            : 'bg-white border border-[#d9c1c0] text-[#534342] hover:bg-[#fff0ef]'
                                        }`}
                                >
                                    <span className="sm:hidden">{tab.short}</span>
                                    <span className="hidden sm:inline">{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="relative w-full sm:w-64 shrink-0">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search size={15} className="text-[#534342]" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari nama tim..."
                                className="w-full pl-10 pr-9 py-2.5 bg-white border border-[#d9c1c0] rounded-full text-sm text-[#211a1a] placeholder:text-[#534342]/60 focus:outline-none focus:border-[#561b1d] focus:ring-2 focus:ring-[#561b1d]/15 transition-all"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    aria-label="Hapus pencarian"
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#534342] hover:text-[#3a060a] transition-colors"
                                >
                                    <X size={15} />
                                </button>
                            )}
                        </div>
                    </div>
                </section>

                {/* COUNTER HASIL */}
                {!isLoading && !errorMsg && matches.length > 0 && (
                    <p className="text-xs font-bold text-[#534342] uppercase tracking-wide mb-5 px-1">
                        {filteredMatches.length} Pertandingan {activeStageFilter !== 'ALL' || searchQuery.trim() ? 'Ditemukan' : 'Terjadwal'}
                    </p>
                )}

                {/* GRID PERTANDINGAN */}
                {isLoading && matches.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-28 text-[#3a060a] flex-1">
                        <div className="p-5 rounded-2xl bg-white border border-[#d9c1c0] shadow-sm mb-5">
                            <Loader2 size={32} className="animate-spin" />
                        </div>
                        <p className="text-sm font-bold text-[#534342] text-center">Sinkronisasi Kalender Arena...</p>
                    </div>
                ) : errorMsg ? (
                    <div className="bg-white border border-red-200 text-red-600 p-8 rounded-2xl text-center max-w-md mx-auto mt-16 flex flex-col items-center shadow-sm">
                        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 mb-4">
                            <ShieldAlert size={28} />
                        </div>
                        <p className="font-bold text-sm">{errorMsg}</p>
                        <button
                            type="button"
                            onClick={() => mutate()}
                            className="mt-5 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold bg-[#561b1d] text-[#d47f7e] hover:brightness-110 active:scale-95 transition-all shadow-sm"
                        >
                            <RefreshCw size={14} /> Coba Sambungkan Ulang
                        </button>
                    </div>
                ) : sortedMatches.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-[#d9c1c0] rounded-2xl bg-white max-w-3xl mx-auto w-full">
                        {searchQuery.trim() ? (
                            <>
                                <Search size={40} className="mx-auto text-[#8f4a45]/50 mb-4" />
                                <h3 className="text-lg font-bold text-[#211a1a] mb-1">Tim Tidak Ditemukan</h3>
                                <p className="text-sm text-[#534342] px-6">
                                    Tidak ada tim yang cocok dengan kata kunci &ldquo;{searchQuery}&rdquo;.
                                </p>
                            </>
                        ) : (
                            <>
                                <Swords size={40} className="mx-auto text-[#8f4a45]/50 mb-4" />
                                <h3 className="text-lg font-bold text-[#211a1a] mb-1">Belum Ada Jadwal</h3>
                                <p className="text-sm text-[#534342] px-6">Tidak ada pertandingan aktif yang terjadwal untuk kategori babak ini.</p>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {sortedMatches.map((match) => (
                            <MatchCard key={match.id} match={match} currentUserId={currentUserId} />
                        ))}
                    </div>
                )}

                {/* Load more — placeholder statis seperti HTML referensi (grid sudah live via API) */}
                {!isLoading && !errorMsg && sortedMatches.length > 0 && (
                    <div className="mt-10 flex justify-center">
                        <button
                            type="button"
                            onClick={() => mutate()}
                            className="px-8 py-3 rounded-full border border-[#561b1d] text-[#561b1d] text-sm font-medium hover:bg-[#561b1d] hover:text-white transition-all duration-300"
                        >
                            Muat Ulang Jadwal
                        </button>
                    </div>
                )}
            </main>

            {/* FOOTER — mengikuti footer HTML referensi persis */}
            <footer className="bg-white border-t border-[#d9c1c0] w-full mt-auto">
                <div className="flex flex-col md:flex-row justify-between items-center w-full py-6 px-5 sm:px-8 lg:px-16 max-w-7xl mx-auto gap-4">
                    <div className="font-bold text-[#3a060a]">BELOVESPORT</div>
                    <div className="flex gap-6">
                        <Link href="/kebijakan-privasi" className="text-[#534342] hover:text-[#3a060a] text-xs">
                            Privacy Policy
                        </Link>
                        <Link href="/syarat-ketentuan" className="text-[#534342] hover:text-[#3a060a] text-xs">
                            Terms of Service
                        </Link>
                        <a href="https://wa.me/62895327761216" target="_blank" rel="noopener noreferrer" className="text-[#534342] hover:text-[#3a060a] text-xs">
                            Contact Us
                        </a>
                    </div>
                    <div className="text-[#534342] text-xs">© 2026 BELOVESPORT Indonesia. All rights reserved.</div>
                </div>
            </footer>

            {/* BOTTOM NAV — khusus mobile, mengikuti HTML referensi kedua persis (glass, FAB tengah) */}
            <nav
                className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#fff8f7]/80 backdrop-blur-xl border-t border-[#d9c1c0]/20 px-4 py-2"
                aria-label="Navigasi utama (mobile)"
            >
                <div className="max-w-md mx-auto flex justify-between items-center">
                    <Link
                        href="/tournament/leaderboard"
                        className="flex flex-col items-center gap-1 p-2 text-[#534342] hover:text-[#3a060a] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#561b1d]/40 rounded-lg"
                    >
                        <Trophy size={20} aria-hidden />
                        <span className="text-[10px] font-bold">Klasemen</span>
                    </Link>

                    <span className="flex flex-col items-center gap-1 p-2 text-[#3a060a] font-bold" aria-current="page">
                        <Calendar size={20} aria-hidden />
                        <span className="text-[10px]">Jadwal</span>
                    </span>

                    <div className="relative -top-6">
                        <button
                            type="button"
                            onClick={() => mutate()}
                            aria-label="Perbarui jadwal"
                            className="w-14 h-14 bg-[#3a060a] rounded-full flex items-center justify-center text-white shadow-lg active:scale-90 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#561b1d]/50 focus-visible:ring-offset-2"
                        >
                            <RefreshCw size={22} className={isLoading ? 'animate-spin' : ''} aria-hidden />
                        </button>
                    </div>

                    <Link
                        href="/tournament/bracket"
                        className="flex flex-col items-center gap-1 p-2 text-[#534342] hover:text-[#3a060a] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#561b1d]/40 rounded-lg"
                    >
                        <Swords size={20} aria-hidden />
                        <span className="text-[10px] font-bold">Bracket</span>
                    </Link>

                    <Link
                        href="/profil"
                        className="flex flex-col items-center gap-1 p-2 text-[#534342] hover:text-[#3a060a] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#561b1d]/40 rounded-lg"
                    >
                        <User size={20} aria-hidden />
                        <span className="text-[10px] font-bold">Profile</span>
                    </Link>
                </div>
            </nav>
        </div>
    );
}

// ─────────────────────────────────────────────────────────
// Match Card — bahasa visual M3: rounded penuh, crest bulat besar,
// badge pill tertiary-fixed, tombol "Match Center" solid penuh
// ─────────────────────────────────────────────────────────

function MatchCard({ match, currentUserId }: { match: Match; currentUserId: string | null }) {
    const isGroupStage = match.stage === 'GROUP';
    const isCompleted = match.matchStatus === 'COMPLETED';
    const isPlaying = match.matchStatus === 'PLAYING';
    const isWaiting = match.matchStatus === 'WAITING_VERIFICATION';
    const hasScore = match.homeScoreLeg1 !== null;
    const homeTotalScore = (match.homeScoreLeg1 ?? 0) + (match.homeScoreLeg2 ?? 0);
    const awayTotalScore = (match.awayScoreLeg1 ?? 0) + (match.awayScoreLeg2 ?? 0);
    const homeFinalScore = isGroupStage ? match.homeScoreLeg1 : homeTotalScore;
    const awayFinalScore = isGroupStage ? match.awayScoreLeg1 : awayTotalScore;
    const hasBothLegs = !isGroupStage && match.homeScoreLeg1 !== null && match.homeScoreLeg2 !== null;

    const homeIsWinner = isCompleted && hasScore && homeFinalScore !== null && awayFinalScore !== null && homeFinalScore > awayFinalScore;
    const awayIsWinner = isCompleted && hasScore && homeFinalScore !== null && awayFinalScore !== null && awayFinalScore > homeFinalScore;

    const isOwnHomeTeam = !!currentUserId && match.homeTeam?.participantId === currentUserId;
    const isOwnAwayTeam = !!currentUserId && match.awayTeam?.participantId === currentUserId;
    const isParticipantInMatch = isOwnHomeTeam || isOwnAwayTeam;

    const nameClass = (isOwn: boolean, isLoserSide: boolean) => {
        if (isOwn) return 'text-[#561b1d] underline decoration-2 decoration-[#d47f7e]/70';
        if (isLoserSide) return 'text-[#534342]/45';
        return 'text-[#211a1a]';
    };

    const liveRing = isPlaying
        ? isParticipantInMatch
            ? 'ring-2 ring-[#d47f7e]/60 ring-offset-2 ring-offset-[#fff8f7]'
            : 'ring-2 ring-red-400/30 ring-offset-2 ring-offset-[#fff8f7]'
        : '';

    const homeTeamName = match.homeTeam?.teamName || 'TBD';
    const awayTeamName = match.awayTeam?.teamName || 'TBD';

    return (
        <div
            className={`group bg-white border border-[#eedfde] rounded-2xl p-5 sm:p-6 flex flex-col items-center text-center transition-all duration-200 active:scale-[0.98] sm:hover:-translate-y-1 sm:hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-[#561b1d] ${liveRing}`}
        >
            {/* Badge stage + status */}
            <div className="flex items-center justify-center gap-1.5 flex-wrap mb-3">
                <span className="inline-block px-3 py-1 rounded-full bg-[#ffddb0] text-[#291800] text-[11px] font-bold uppercase tracking-wide">
                    {isGroupStage && match.groupName ? `Grup ${match.groupName}` : stageLabels[match.stage] || match.stage}
                </span>
                <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${isCompleted
                            ? 'text-emerald-700 bg-emerald-50'
                            : isPlaying
                                ? 'text-red-600 bg-red-50 animate-pulse'
                                : isWaiting
                                    ? 'text-amber-600 bg-amber-50 animate-pulse'
                                    : 'text-[#534342] bg-[#f9ebe9]'
                        }`}
                >
                    {isCompleted ? '● Selesai' : isPlaying ? '● LIVE' : isWaiting ? '● Validasi' : '○ Terjadwal'}
                </span>
            </div>

            {/* Waktu pertandingan */}
            <p className="text-sm text-[#534342] mb-6">
                {match.scheduledTime ? (
                    <>
                        {new Date(match.scheduledTime)
                            .toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })
                            .toUpperCase()}
                        {' • '}
                        {new Date(match.scheduledTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                    </>
                ) : (
                    'Jadwal menyusul'
                )}
            </p>

            {/* Head-to-head — crest bulat besar ala HTML referensi */}
            <div className="flex items-center justify-between w-full mb-6 px-1">
                <div className="flex flex-col items-center gap-2 w-1/3">
                    <div className="relative">
                        <div
                            className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden text-white font-black text-lg shadow-sm"
                            style={{ backgroundColor: getCrestColor(homeTeamName) }}
                        >
                            {getInitials(homeTeamName)}
                        </div>
                        {isCompleted && homeIsWinner && (
                            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#ffba48] shadow">
                                <Trophy size={11} className="text-[#291800]" />
                            </span>
                        )}
                    </div>
                    <span title={homeTeamName} className={`text-sm font-bold leading-snug line-clamp-2 ${nameClass(isOwnHomeTeam, isCompleted && awayIsWinner)}`}>
                        {homeTeamName}
                    </span>
                </div>

                <div className="flex flex-col items-center gap-1.5 shrink-0">
                    {hasScore ? (
                        <div className="bg-[#f9ebe9] rounded-xl px-4 py-1.5 font-black text-base text-[#561b1d] tracking-tight whitespace-nowrap">
                            {isGroupStage ? `${match.homeScoreLeg1} – ${match.awayScoreLeg1}` : `${homeTotalScore} – ${awayTotalScore}`}
                        </div>
                    ) : (
                        <div className="text-2xl italic text-[#d9c1c0] font-medium">VS</div>
                    )}
                    {hasBothLegs && (
                        <p className="text-[10px] text-[#534342] whitespace-nowrap">
                            L1: {match.homeScoreLeg1}-{match.awayScoreLeg1} • L2: {match.homeScoreLeg2}-{match.awayScoreLeg2}
                        </p>
                    )}
                </div>

                <div className="flex flex-col items-center gap-2 w-1/3">
                    <div className="relative">
                        <div
                            className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden text-white font-black text-lg shadow-sm"
                            style={{ backgroundColor: getCrestColor(awayTeamName) }}
                        >
                            {getInitials(awayTeamName)}
                        </div>
                        {isCompleted && awayIsWinner && (
                            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#ffba48] shadow">
                                <Trophy size={11} className="text-[#291800]" />
                            </span>
                        )}
                    </div>
                    <span title={awayTeamName} className={`text-sm font-bold leading-snug line-clamp-2 ${nameClass(isOwnAwayTeam, isCompleted && homeIsWinner)}`}>
                        {awayTeamName}
                    </span>
                </div>
            </div>

            <hr className="w-full border-[#eedfde] mb-5" />

            {/* Action — tombol "Match Center" solid penuh ala HTML, tapi tetap fungsional
          (mengarah ke match hub sungguhan untuk peserta, atau nonaktif untuk penonton) */}
            {isParticipantInMatch && isPlaying ? (
                <Link
                    href={`/tournament/match-action?matchId=${match.id}`}
                    className="w-full bg-[#561b1d] text-[#d47f7e] py-2.5 rounded-full text-sm font-bold hover:brightness-110 hover:shadow-[0_0_15px_rgba(252,179,53,0.2)] transition-all flex items-center justify-center gap-2"
                >
                    <Gamepad2 size={14} /> Masuk Match Hub &amp; Lapor Skor
                </Link>
            ) : isParticipantInMatch && isWaiting ? (
                <div className="w-full bg-[#f9ebe9] text-[#534342] py-2.5 rounded-full text-sm font-bold flex items-center justify-center gap-2">
                    <CheckSquare size={14} className="text-[#ffba48] animate-pulse" /> Menunggu Validasi Admin
                </div>
            ) : (
                <Link
                    href={`/tournament/match/${match.id}`}
                    className="w-full bg-[#561b1d] text-[#d47f7e] py-2.5 rounded-full text-sm font-bold hover:brightness-110 hover:shadow-[0_0_15px_rgba(252,179,53,0.2)] transition-all"
                >
                    Match Center
                </Link>
            )}
        </div>
    );
}