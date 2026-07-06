// Path: src/app/tournament/bracket/BracketComponent.tsx
'use client'

import { useState, useEffect } from 'react';
import useSWR from 'swr'; // 🚀 IMPORT SWR UNTUK LIVE SINKRONISASI
import { SingleEliminationBracket, SVGViewer, createTheme } from '@g-loot/react-tournament-brackets';
import { Loader2, LayoutGrid, Eye, ArrowLeft, Trophy, MoveHorizontal, ShieldAlert } from 'lucide-react';
import MatchActionModal from '../../../components/tournament/MatchActionModal';

interface ApiMatch {
    id: string;
    stage: string;
    matchNumber: number;
    homeTeam: { teamName: string; id: string } | null;
    awayTeam: { teamName: string; id: string } | null;
    homeScoreLeg1: number | null;
    awayScoreLeg1: number | null;
    homeScoreLeg2: number | null;
    awayScoreLeg2: number | null;
    matchStatus: string;
    scheduledTime?: string;
}

const beloveTheme = createTheme({
    textColor: { main: '#18181B', highlighted: '#561B1D', dark: '#71717A' },
    matchBackground: { wonColor: '#FFFFFF', lostColor: '#F8FAFC' },
    score: {
        background: { wonColor: '#561B1D', lostColor: '#E2E8F0' },
        text: { wonColor: '#FFFFFF', lostColor: '#71717A' },
    },
    border: { color: '#E2E8F0', highlightedColor: '#FCB335' },
    roundHeader: { backgroundColor: '#561B1D', fontColor: '#FFFFFF' },
    connectorColor: '#E2E8F0',
    connectorColorHighlight: '#FCB335',
    svgBackground: 'transparent',
});

// Fetcher untuk Engine SWR
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then((res) => {
    if (!res.ok) throw new Error('Gagal menyelaraskan data arena.');
    return res.json();
});

function computeScore(realMatch: ApiMatch | undefined, singleLeg: boolean) {
    let hScore: number | null = null;
    let aScore: number | null = null;
    let isHomeWin = false; let isAwayWin = false;

    if (realMatch && realMatch.homeScoreLeg1 !== null) {
        hScore = singleLeg ? (realMatch.homeScoreLeg1 || 0) : (realMatch.homeScoreLeg1 || 0) + (realMatch.homeScoreLeg2 || 0);
        aScore = singleLeg ? (realMatch.awayScoreLeg1 || 0) : (realMatch.awayScoreLeg1 || 0) + (realMatch.awayScoreLeg2 || 0);
        isHomeWin = hScore > aScore;
        isAwayWin = aScore > hScore;
    }
    return { hScore, aScore, isHomeWin, isAwayWin };
}

function CustomMatchCard({
    match,
    onMouseEnter,
    onMouseLeave,
    onPartyClick,
    topParty,
    bottomParty,
    topWon,
    bottomWon,
    topHovered,
    bottomHovered,
    topText,
    bottomText,
    computedStyles,
    teamNameFallback,
    resultFallback,
}: any) {
    const isDone = match?.state === 'DONE';

    return (
        <div
            style={{ width: computedStyles?.width, height: computedStyles?.height }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className="flex items-center"
        >
            <div className="w-full rounded-xl overflow-hidden border border-brand-border bg-white shadow-[0_1px_2px_rgba(24,24,27,0.06),0_6px_16px_-6px_rgba(24,24,27,0.1)]">
                <div className="flex justify-between items-center px-2.5 py-1.5 bg-brand-bg-surface border-b border-brand-border">
                    <span className="text-[9px] font-black font-jetbrains uppercase tracking-widest text-brand-muted">
                        #{match?.matchNumber}
                    </span>
                    <span className={`text-[8px] font-jetbrains font-bold uppercase ${isDone ? 'text-emerald-600' : 'text-brand-gold animate-pulse'}`}>
                        {isDone ? 'FT' : match?.startTime}
                    </span>
                </div>

                <div
                    onClick={() => onPartyClick && topParty && onPartyClick(topParty, topWon)}
                    className={`flex justify-between items-center px-3 py-2 border-b border-brand-border transition-colors ${topWon ? 'bg-brand-gold/10' : topHovered ? 'bg-brand-bg-surface' : ''}`}
                >
                    <span className={`text-xs font-bold truncate pr-2 ${topParty?.name && topParty.name !== teamNameFallback ? 'text-brand-dark' : 'text-brand-muted'}`}>
                        {topParty?.name || teamNameFallback}
                    </span>
                    <span className={`font-jetbrains font-black text-sm shrink-0 ${topWon ? 'text-brand-primary' : 'text-brand-muted'}`}>
                        {topText || resultFallback}
                    </span>
                </div>

                <div
                    onClick={() => onPartyClick && bottomParty && onPartyClick(bottomParty, bottomWon)}
                    className={`flex justify-between items-center px-3 py-2 transition-colors ${bottomWon ? 'bg-brand-gold/10' : bottomHovered ? 'bg-brand-bg-surface' : ''}`}
                >
                    <span className={`text-xs font-bold truncate pr-2 ${bottomParty?.name && bottomParty.name !== teamNameFallback ? 'text-brand-dark' : 'text-brand-muted'}`}>
                        {bottomParty?.name || teamNameFallback}
                    </span>
                    <span className={`font-jetbrains font-black text-sm shrink-0 ${bottomWon ? 'text-brand-primary' : 'text-brand-muted'}`}>
                        {bottomText || resultFallback}
                    </span>
                </div>
            </div>
        </div>
    );
}

const ROUND_TABS = [
    { id: 'KNOCKOUT_32', label: '32 Besar', short: 'R32' },
    { id: 'KNOCKOUT_16', label: '16 Besar', short: 'R16' },
    { id: 'QUARTER_FINAL', label: '8 Besar', short: 'QF' },
    { id: 'SEMI_FINAL', label: 'Semi Final', short: 'SF' },
    { id: 'FINAL', label: 'Final & Juara 3', short: 'F' },
];

export default function BracketComponent() {
    const [isMounted, setIsMounted] = useState(false);

    // STATE UNTUK INTERAKSI
    const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'TABS' | 'FULL'>('TABS');
    const [activeTab, setActiveTab] = useState<string>('KNOCKOUT_32');

    // 🚀 LIVE POLLING ENGINE DENGAN SWR (Interval 10 Detik)
    const { data: resData, error, isLoading, mutate } = useSWR('/api/tournament/bracket', fetcher, {
        refreshInterval: 10000,
        revalidateOnFocus: true
    });

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const apiMatches: ApiMatch[] = resData?.success ? resData.data : [];

    const findApiMatch = (stage: string, matchNum: number) =>
        apiMatches.find((m) => m.stage === stage && m.matchNumber === matchNum);

    const generateMainBracket = () => {
        const matchesData: any[] = [];
        for (let id = 1; id <= 31; id++) {
            let nextMatchId: number | null = null;
            let stage = ''; let matchNum = 0; let roundText = ''; let isFinal = false;

            if (id >= 1 && id <= 16) {
                nextMatchId = 16 + Math.ceil(id / 2); stage = 'KNOCKOUT_32'; matchNum = id; roundText = 'Babak 32 Besar (2 Leg)';
            } else if (id >= 17 && id <= 24) {
                nextMatchId = 24 + Math.ceil((id - 16) / 2); stage = 'KNOCKOUT_16'; matchNum = id - 16; roundText = 'Babak 16 Besar (2 Leg)';
            } else if (id >= 25 && id <= 28) {
                nextMatchId = 28 + Math.ceil((id - 24) / 2); stage = 'QUARTER_FINAL'; matchNum = id - 24; roundText = 'Perempat Final (2 Leg)';
            } else if (id >= 29 && id <= 30) {
                nextMatchId = 31; stage = 'SEMI_FINAL'; matchNum = id - 28; roundText = 'Semi Final (2 Leg)';
            } else {
                nextMatchId = null; stage = 'FINAL'; matchNum = 1; roundText = 'Grand Final (1 Leg)'; isFinal = true;
            }

            const realMatch = findApiMatch(stage, matchNum);
            const score = computeScore(realMatch, isFinal);

            matchesData.push({
                id, nextMatchId, stage,
                dbId: realMatch?.id || null,
                tournamentRoundText: roundText,
                matchNumber: matchNum,
                startTime: realMatch?.matchStatus === 'WAITING_VERIFICATION' ? 'VERIFIKASI' : realMatch?.scheduledTime ? new Date(realMatch.scheduledTime).toLocaleDateString() : 'TBA',
                state: realMatch?.matchStatus === 'COMPLETED' ? 'DONE' : 'SCHEDULED',
                participants: [
                    { id: realMatch?.homeTeam?.id || `tbd-h-${id}`, resultText: score.hScore !== null ? score.hScore.toString() : '-', isWinner: score.isHomeWin, status: null, name: realMatch?.homeTeam?.teamName || 'TBD' },
                    { id: realMatch?.awayTeam?.id || `tbd-a-${id}`, resultText: score.aScore !== null ? score.aScore.toString() : '-', isWinner: score.isAwayWin, status: null, name: realMatch?.awayTeam?.teamName || 'TBD' },
                ],
            });
        }
        return matchesData;
    };

    const generateThirdPlaceBracket = () => {
        const realMatch = findApiMatch('THIRD_PLACE', 1);
        const score = computeScore(realMatch, true);
        return [{
            id: 1, nextMatchId: null, stage: 'FINAL', dbId: realMatch?.id || null,
            tournamentRoundText: 'Juara 3 & 4 (1 Leg)', matchNumber: 1,
            startTime: realMatch?.matchStatus === 'WAITING_VERIFICATION' ? 'VERIFIKASI' : realMatch?.scheduledTime ? new Date(realMatch.scheduledTime).toLocaleDateString() : 'TBA',
            state: realMatch?.matchStatus === 'COMPLETED' ? 'DONE' : 'SCHEDULED',
            participants: [
                { id: realMatch?.homeTeam?.id || `tbd-h-3rd`, resultText: score.hScore !== null ? score.hScore.toString() : '-', isWinner: score.isHomeWin, status: null, name: realMatch?.homeTeam?.teamName || 'TBD' },
                { id: realMatch?.awayTeam?.id || `tbd-a-3rd`, resultText: score.aScore !== null ? score.aScore.toString() : '-', isWinner: score.isAwayWin, status: null, name: realMatch?.awayTeam?.teamName || 'TBD' },
            ],
        }];
    };

    const fullMatches = generateMainBracket();
    const thirdPlaceMatch = generateThirdPlaceBracket();

    const MobileMatchCard = ({ match }: { match: any }) => (
        <div
            onClick={() => match.dbId && setSelectedMatchId(match.dbId)}
            className={`bg-white border border-brand-border rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(24,24,27,0.06),0_8px_20px_-10px_rgba(24,24,27,0.12)] transition-all duration-200 ${match.dbId ? 'cursor-pointer hover:border-brand-gold/60 hover:-translate-y-0.5 hover:shadow-[0_1px_3px_rgba(24,24,27,0.08),0_14px_28px_-10px_rgba(86,27,29,0.18)]' : 'opacity-70'}`}
        >
            <div className="bg-brand-bg-surface border-b border-brand-border px-3 py-2 flex justify-between items-center text-[10px] font-black font-jetbrains tracking-widest text-brand-muted uppercase">
                <span>Match #{match.matchNumber}</span>
                <span className={match.state === 'DONE' ? 'text-emerald-600' : match.startTime === 'VERIFIKASI' ? 'text-amber-500 animate-pulse' : 'text-brand-secondary'}>
                    {match.state === 'DONE' ? 'FT' : match.startTime}
                </span>
            </div>
            {match.participants.map((p: any, i: number) => (
                <div key={p.id} className={`flex justify-between items-center px-4 py-3 ${i === 0 ? 'border-b border-brand-border' : ''} ${p.isWinner ? 'bg-brand-gold/10' : ''}`}>
                    <span className={`text-sm font-bold truncate pr-2 ${p.name !== 'TBD' ? 'text-brand-dark' : 'text-brand-muted italic'}`}>{p.name}</span>
                    <span className={`font-jetbrains font-black text-base shrink-0 ${p.isWinner ? 'text-brand-primary' : 'text-brand-muted'}`}>{p.resultText}</span>
                </div>
            ))}
        </div>
    );

    if (isLoading || !isMounted) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-screen bg-brand-bg-light text-brand-primary px-4">
                <Loader2 size={40} className="animate-spin mb-4" />
                <p className="font-jetbrains text-sm font-bold uppercase tracking-widest text-brand-muted text-center">Menghubungkan ke Server Arena...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-screen bg-brand-bg-light text-red-600 px-4">
                <ShieldAlert size={40} className="mb-4" />
                <p className="font-bold text-center">Gagal menyelaraskan data bagan dengan server.</p>
            </div>
        );
    }

    return (
        <div className="w-full bg-brand-bg-light text-brand-dark font-sans relative flex flex-col">
            <div className="fixed top-0 left-0 right-0 h-px bg-gradient-brand z-30 opacity-70" />

            {/* ── HEADER CONTROL ── */}
            <div className="relative z-20 border-b border-brand-border bg-brand-bg-light/80 backdrop-blur-md pt-6 pb-5 px-5 sm:px-6 md:px-12 w-full">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-[11px] font-black font-jetbrains bg-white border border-brand-border px-4 py-2 rounded-xl shadow-sm text-brand-muted uppercase tracking-wider">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Live Connected
                    </div>

                    <div className="flex bg-brand-bg-surface border border-brand-border rounded-xl p-1 w-full sm:w-fit">
                        <button
                            onClick={() => setViewMode('TABS')}
                            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'TABS' ? 'bg-gradient-brand text-white shadow-brand' : 'text-brand-muted hover:text-brand-dark'}`}
                        >
                            <LayoutGrid size={14} /> Daftar Babak
                        </button>
                        <button
                            onClick={() => setViewMode('FULL')}
                            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'FULL' ? 'bg-gradient-brand text-white shadow-brand' : 'text-brand-muted hover:text-brand-dark'}`}
                        >
                            <Eye size={14} /> Lihat Semua (Bagan)
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 relative z-10 w-full flex flex-col">
                {/* MODE 1: TABS */}
                {viewMode === 'TABS' && (
                    <div className="w-full max-w-6xl mx-auto px-5 py-5 sm:p-6 md:p-8">
                        <div className="flex overflow-x-auto custom-scrollbar snap-x snap-mandatory gap-2 pb-4 mb-6">
                            {ROUND_TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`shrink-0 snap-start px-4 sm:px-5 py-2.5 rounded-full text-xs font-black font-jetbrains tracking-widest uppercase transition-all border ${activeTab === tab.id ? 'bg-gradient-brand border-transparent text-white shadow-brand' : 'bg-white border-brand-border text-brand-muted hover:border-brand-gold/50 hover:text-brand-dark'}`}
                                >
                                    <span className="sm:hidden">{tab.short}</span>
                                    <span className="hidden sm:inline">{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 pb-20">
                            {fullMatches.filter(m => m.stage === activeTab).map((match) => (
                                <MobileMatchCard key={match.id} match={match} />
                            ))}
                            {activeTab === 'FINAL' && (
                                <MobileMatchCard key="third-place" match={thirdPlaceMatch[0]} />
                            )}
                        </div>
                    </div>
                )}

                {/* MODE 2: FULL SVG BRACKET */}
                {viewMode === 'FULL' && (
                    <div className="w-full flex flex-col items-center gap-10 pt-8 sm:pt-10">
                        <div className="flex md:hidden items-center gap-2 text-brand-muted text-[11px] font-jetbrains font-bold uppercase tracking-wide bg-brand-bg-surface border border-brand-border px-4 py-2 rounded-full">
                            <MoveHorizontal size={14} className="text-brand-gold" />
                            Geser ke samping untuk melihat seluruh bagan
                        </div>

                        <div className="relative w-full max-w-full">
                            <div className="pointer-events-none absolute inset-y-0 left-0 w-6 sm:w-10 bg-gradient-to-r from-brand-bg-light to-transparent z-10" />
                            <div className="pointer-events-none absolute inset-y-0 right-0 w-6 sm:w-10 bg-gradient-to-l from-brand-bg-light to-transparent z-10" />

                            <div className="w-full max-w-full overflow-x-auto overflow-y-hidden custom-scrollbar pb-8 flex justify-start md:justify-center">
                                <div style={{ minWidth: '1200px' }} className="px-6 sm:px-4">
                                    <SingleEliminationBracket
                                        matches={fullMatches}
                                        theme={beloveTheme}
                                        options={{ style: { roundHeader: { fontFamily: 'var(--font-jetbrains)', fontWeight: 'bold' } } }}
                                        matchComponent={(props: any) => (
                                            <div
                                                onClick={() => props.match?.dbId && setSelectedMatchId(props.match.dbId)}
                                                className={`transition-transform duration-150 ${props.match?.dbId ? 'cursor-pointer hover:scale-[1.02]' : 'opacity-80 cursor-not-allowed'}`}
                                            >
                                                <CustomMatchCard {...props} />
                                            </div>
                                        )}
                                        svgWrapper={({ children, ...props }: any) => (
                                            <SVGViewer width={1400} height={800} background="transparent" SVGBackground="transparent" customToolbar={() => null} {...props}>{children}</SVGViewer>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* PEREBUTAN JUARA 3 */}
                        <div className="w-full flex flex-col items-center mb-20 px-4">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="h-px w-8 bg-brand-border" />
                                <h3 className="text-brand-primary font-black uppercase font-jetbrains text-center tracking-wide text-sm md:text-base">Perebutan Juara 3 & 4</h3>
                                <div className="h-px w-8 bg-brand-border" />
                            </div>
                            <div className="w-full max-w-[420px] bg-white border border-brand-border rounded-2xl shadow-sm py-2 flex justify-center">
                                <div style={{ minWidth: '380px' }}>
                                    <SingleEliminationBracket
                                        matches={thirdPlaceMatch}
                                        theme={beloveTheme}
                                        options={{ style: { roundHeader: { fontFamily: 'var(--font-jetbrains)', fontWeight: 'bold' } } }}
                                        matchComponent={(props: any) => (
                                            <div
                                                onClick={() => props.match?.dbId && setSelectedMatchId(props.match.dbId)}
                                                className={`transition-transform duration-150 ${props.match?.dbId ? 'cursor-pointer hover:scale-[1.02]' : 'opacity-80 cursor-not-allowed'}`}
                                            >
                                                <CustomMatchCard {...props} />
                                            </div>
                                        )}
                                        svgWrapper={({ children, ...props }: any) => (
                                            <SVGViewer width={400} height={200} background="transparent" SVGBackground="transparent" customToolbar={() => null} {...props}>{children}</SVGViewer>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 🚀 MODAL DENGAN CALLBACK RE-FETCH SWR INSTAN */}
            {selectedMatchId && (
                <MatchActionModal
                    matchId={selectedMatchId}
                    onClose={() => setSelectedMatchId(null)}
                    onSuccess={() => mutate()} // Memaksa re-fetch background instan
                />
            )}
        </div>
    );
}