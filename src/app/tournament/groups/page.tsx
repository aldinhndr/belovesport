// Path: src/app/tournament/groups/page.tsx
'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import {
    LayoutGrid,
    Loader2,
    ArrowLeft,
    Trophy,
    Info,
    CheckCircle2,
    RefreshCw,
    Bell,
    ShieldAlert,
    Award,
    Search,
    Crown,
} from 'lucide-react';
import LogoutButtonParticipant from '@/components/participant/LogoutButton';

type TabKey = 'groups' | 'leaderboard';

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

interface LeaderboardTeam {
    id: string;
    teamName: string;
    main: number;
    menang: number;
    seri: number;
    kalah: number;
    gd: number;
    poin: number;
}

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

const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then((res) => {
    if (res.status === 401) {
        window.location.href = '/login';
        return;
    }
    if (!res.ok) throw new Error('Gagal memuat data sirkuit turnamen.');
    return res.json();
});

export default function StandingsPage() {
    const [activeTab, setActiveTab] = useState<TabKey>('groups');
    const [searchQuery, setSearchQuery] = useState('');

    // 🚀 KLASEMEN GRUP — Live Polling 15 detik
    const {
        data: groupsRes,
        error: groupsErr,
        isLoading: groupsLoading,
        mutate: mutateGroups,
    } = useSWR('/api/admin/tournament/groups', fetcher, {
        refreshInterval: 15000,
        revalidateOnFocus: true,
    });

    // 🚀 LEADERBOARD GLOBAL — Live Polling 30 detik
    const {
        data: lbRes,
        error: lbErr,
        isLoading: lbLoading,
        mutate: mutateLb,
    } = useSWR('/api/tournament/leaderboard', fetcher, {
        refreshInterval: 30000,
        revalidateOnFocus: true,
    });

    const groupList: GroupData[] = groupsRes?.success && Array.isArray(groupsRes.data) ? groupsRes.data : [];
    const leaderboard: LeaderboardTeam[] = lbRes?.success ? lbRes.data : [];
    const filteredLeaderboard = leaderboard.filter((team) =>
        team.teamName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isGroupsTab = activeTab === 'groups';

    const isLoading = isGroupsTab ? groupsLoading : lbLoading;
    const errorMsg = isGroupsTab
        ? (groupsErr ? 'Gagal terhubung ke server arena.' : (!groupsRes?.success && groupsRes?.message ? groupsRes.message : ''))
        : (lbErr ? 'Gagal terhubung dengan database arena turnamen Belovesport.' : '');

    const mutate = isGroupsTab ? mutateGroups : mutateLb;

    const statusLabel = errorMsg ? 'TERPUTUS' : isLoading ? 'SINKRONISASI' : 'LIVE POLLING';
    const statusColor = errorMsg
        ? 'border-red-200 bg-red-50 text-red-600'
        : 'border-brand-primary/20 bg-brand-primary/5 text-brand-primary';
    const statusDot = errorMsg ? 'bg-red-500' : 'bg-brand-primary';

    const tabBtnClass = (tab: TabKey) =>
        `relative flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider font-jetbrains transition-all duration-200 ${activeTab === tab
            ? 'bg-gradient-brand text-white shadow-brand'
            : 'text-brand-muted hover:text-brand-primary'
        }`;

    return (
        <div className="min-h-screen bg-brand-bg-light text-brand-dark relative overflow-hidden pb-24 flex flex-col">

            {/* 🌟 EFEK CAHAYA & BACKGROUND PREMIUM — konsisten dengan halaman lain */}
            <div className="fixed top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/70 to-transparent z-40" />
            <div
                className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full opacity-[0.09] pointer-events-none blur-[110px]"
                style={{ background: 'radial-gradient(ellipse, #FCB335 0%, #82403B 55%, transparent 70%)' }}
                aria-hidden
            />
            <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{
                backgroundImage: 'repeating-linear-gradient(45deg, #561B1D 0, #561B1D 1px, transparent 0, transparent 50%)',
                backgroundSize: '20px 20px'
            }} />

            {/* 🌟 TOP NAVBAR GLOBAL */}
            <nav className="sticky top-0 z-50 border-b border-brand-border bg-brand-bg-light/85 backdrop-blur-xl shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/profil" className="flex items-center gap-2 group focus-visible:outline-none">
                            <div className="w-7 h-7 rounded-md overflow-hidden flex items-center justify-center bg-gradient-brand shadow-brand group-hover:scale-105 transition-transform">
                                <img
                                    src="/logos/logo_BELOVESPORT.png"
                                    alt="Belovesport"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <span className="font-black text-sm tracking-widest uppercase text-brand-dark group-hover:text-brand-primary transition-colors">Belovesport</span>
                        </Link>
                        <span className="text-brand-muted/40 text-xs" aria-hidden>/</span>
                        <span className="text-brand-muted text-xs font-bold font-jetbrains uppercase tracking-wider">Klasemen</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            aria-label="Notifikasi"
                            className="relative p-2 rounded-lg text-brand-muted hover:text-brand-dark hover:bg-brand-bg-surface transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50"
                        >
                            <Bell size={16} />
                            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-gold shadow-[0_0_6px_rgba(252,179,53,0.8)]" aria-hidden />
                        </button>
                        <LogoutButtonParticipant />
                    </div>
                </div>
            </nav>

            {/* 🌟 SUB-HEADER DINAMIS (berubah sesuai tab aktif) */}
            <div className="relative z-20 border-b border-brand-border pt-8 pb-6 bg-brand-bg-light/40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="flex flex-col lg:flex-row items-center justify-between gap-5 mb-7">
                        <div>
                            <div className="flex items-center gap-3 mb-3 justify-center lg:justify-start">
                                <Link href="/profil"
                                    className="p-2 rounded-xl transition-all group mr-2 bg-brand-bg-surface border border-brand-border hover:border-brand-gold shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50">
                                    <ArrowLeft size={18} className="text-brand-secondary group-hover:text-brand-primary transition-colors" />
                                </Link>

                                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-gradient-brand shadow-brand-lg">
                                    {isGroupsTab ? <LayoutGrid size={18} className="text-white" /> : <Award size={18} className="text-white" />}
                                </div>

                                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight font-jetbrains text-brand-dark">
                                    {isGroupsTab ? (<>Group <span className="text-brand-primary">Stage</span></>) : (<>Global <span className="text-brand-primary">Leaderboard</span></>)}
                                </h1>
                            </div>
                            <p className="text-brand-muted text-xs text-center lg:text-left flex items-center justify-center lg:justify-start gap-1.5 font-medium">
                                <Trophy size={13} className="text-brand-gold shrink-0" />
                                {isGroupsTab ? '16 Grup • 4 tim per grup • Top 2 Melaju ke Knockout' : 'Akumulasi klasifikasi seluruh tim di arena turnamen Belovesport.'}
                            </p>
                        </div>

                        {/* INTERACTIVE CONTROLS BOX */}
                        <div className="flex items-center gap-2.5 w-full lg:w-auto justify-center lg:justify-end shrink-0">
                            <button
                                type="button"
                                onClick={() => mutate()}
                                disabled={isLoading}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all bg-white border border-brand-border text-brand-dark hover:border-brand-gold hover:text-brand-primary active:scale-95 disabled:opacity-50 shadow-sm"
                            >
                                <RefreshCw size={12} className={isLoading ? 'animate-spin text-brand-primary' : ''} />
                                {isLoading ? 'Sync...' : 'Refresh'}
                            </button>

                            <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black font-jetbrains tracking-widest shadow-sm border transition-all hover:scale-105 hover:shadow-brand cursor-default ${statusColor}`}>
                                <span className="relative flex h-2 w-2">
                                    {!errorMsg && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${statusDot}`}></span>}
                                    <span className={`relative inline-flex rounded-full h-2 w-2 ${statusDot}`}></span>
                                </span>
                                {statusLabel}
                            </div>
                        </div>
                    </div>

                    {/* 🌟 TAB SWITCHER PREMIUM */}
                    <div className="flex justify-center lg:justify-start">
                        <div className="inline-flex items-center gap-1 p-1 bg-brand-bg-surface border border-brand-border rounded-xl shadow-inner">
                            <button type="button" onClick={() => setActiveTab('groups')} className={tabBtnClass('groups')}>
                                <LayoutGrid size={13} />
                                Klasemen Grup
                            </button>
                            <button type="button" onClick={() => setActiveTab('leaderboard')} className={tabBtnClass('leaderboard')}>
                                <Award size={13} />
                                Leaderboard Global
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 🌟 MAIN CONTENT ARENA */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex-1">

                {isLoading && ((isGroupsTab && groupList.length === 0) || (!isGroupsTab && leaderboard.length === 0)) ? (
                    <div className="flex flex-col items-center justify-center py-40 text-brand-primary">
                        <div className="p-5 rounded-2xl bg-brand-bg-surface border border-brand-border shadow-sm mb-5">
                            <Loader2 size={36} className="animate-spin" />
                        </div>
                        <p className="font-jetbrains text-xs font-bold uppercase tracking-widest text-brand-muted">
                            {isGroupsTab ? 'Menyelaraskan Papan Klasemen...' : 'Sinkronisasi Papan Peringkat...'}
                        </p>
                    </div>
                ) : errorMsg ? (
                    <div className="bg-white border border-red-200 text-red-600 p-8 rounded-2xl text-center max-w-md mx-auto mt-16 flex flex-col items-center shadow-sm">
                        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 mb-4">
                            <ShieldAlert size={30} />
                        </div>
                        <p className="font-black text-sm font-jetbrains uppercase tracking-wide">{errorMsg}</p>
                        <button
                            type="button"
                            onClick={() => mutate()}
                            className="mt-5 flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-brand text-white shadow-brand hover:shadow-brand-lg active:scale-95 transition-all"
                        >
                            <RefreshCw size={13} /> Coba Sambungkan Ulang
                        </button>
                    </div>
                ) : isGroupsTab ? (
                    <>
                        {/* LEGEND PENJELASAN POSISI */}
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5 mb-6 text-xs font-medium bg-white border border-brand-border p-4 rounded-xl shadow-sm text-brand-muted">
                            <div className="flex items-center gap-1.5 font-black text-brand-dark font-jetbrains uppercase tracking-wide text-[11px]">
                                <Info size={14} className="text-brand-primary" /> Keterangan sirkuit:
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-sm"></div> Lolos Fase Gugur (Top 2 Terbaik)
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 bg-brand-border rounded-sm"></div> Tereliminasi / Peringkat Bawah
                            </div>
                        </div>

                        {/* GRID 16 GRUP UTAMA */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-8 pb-16 animate-in fade-in duration-300">
                            {groupList.map((group) => {
                                const totalMatchesInGroup = group.teams.reduce((sum, t) => sum + t.played, 0) / 2;
                                const isGroupComplete = totalMatchesInGroup >= 6;

                                return (
                                    <div key={group.groupName} className="bg-white border border-brand-border rounded-2xl overflow-hidden shadow-[0_1px_2px_rgba(24,24,27,0.05),0_10px_30px_-14px_rgba(86,27,29,0.12)] hover:border-brand-gold/50 hover:shadow-brand transition-all duration-200">

                                        {/* Aksen atas premium */}
                                        <div className={`h-[3px] w-full ${isGroupComplete ? 'bg-gradient-brand' : 'bg-brand-gold/40'}`} />

                                        {/* Header Tabel Grup */}
                                        <div className="bg-brand-bg-surface px-5 py-3.5 border-b border-brand-border flex items-center justify-between">
                                            <h2 className="text-sm font-black uppercase font-jetbrains text-brand-dark tracking-wider flex items-center gap-2">
                                                <span className="w-1.5 h-3 bg-brand-primary rounded-sm block"></span>
                                                GRUP {group.groupName}
                                            </h2>
                                            <span className={`text-[10px] font-jetbrains font-bold uppercase tracking-wide px-2 py-0.5 rounded ${isGroupComplete ? 'bg-emerald-50 text-emerald-700' : 'bg-brand-gold/10 text-brand-primary'}`}>
                                                {totalMatchesInGroup} / 6 LAGA {isGroupComplete ? 'COMPLETED' : ''}
                                            </span>
                                        </div>

                                        {/* Tabel Responsif */}
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse min-w-[550px]">
                                                <thead>
                                                    <tr className="bg-brand-bg-surface/60 text-[10px] uppercase tracking-wider text-brand-muted font-black font-jetbrains border-b border-brand-border">
                                                        <th className="py-2.5 px-3 text-center w-10">Pos</th>
                                                        <th className="py-2.5 px-3">Klub</th>
                                                        <th className="py-2.5 px-2 text-center w-8" title="Main">M</th>
                                                        <th className="py-2.5 px-2 text-center w-8" title="Menang">W</th>
                                                        <th className="py-2.5 px-2 text-center w-8" title="Seri">D</th>
                                                        <th className="py-2.5 px-2 text-center w-8" title="Kalah">L</th>
                                                        <th className="py-2.5 px-2 text-center w-8" title="Gol Memasukkan">GF</th>
                                                        <th className="py-2.5 px-2 text-center w-8" title="Gol Kemasukan">GA</th>
                                                        <th className="py-2.5 px-2 text-center w-10" title="Selisih Gol">GD</th>
                                                        <th className="py-2.5 px-3 text-center w-12 text-brand-primary font-black bg-brand-gold/10" title="Poin">PTS</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-xs font-medium">
                                                    {group.teams.map((team, index) => {
                                                        const isQualified = index < 2;

                                                        return (
                                                            <tr key={team.teamId} className="relative border-b border-brand-border last:border-b-0 transition-colors hover:bg-brand-bg-surface/60">

                                                                {/* Garis Kiri Status Lolos */}
                                                                <td className={`absolute left-0 top-0 bottom-0 w-[3px] ${isQualified ? 'bg-emerald-500' : 'bg-brand-border'}`} />

                                                                {/* Posisi */}
                                                                <td className="py-3 px-3 text-center">
                                                                    <span className={`inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-black font-jetbrains ${isQualified ? 'bg-emerald-500 text-white shadow-sm' : 'bg-brand-bg-surface text-brand-muted border border-brand-border'}`}>
                                                                        {index + 1}
                                                                    </span>
                                                                </td>

                                                                {/* Nama Klub */}
                                                                <td className="py-3 px-3">
                                                                    <div className="flex items-center gap-2.5">
                                                                        <span
                                                                            className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black font-jetbrains text-white shrink-0 shadow-sm"
                                                                            style={{ backgroundColor: getCrestColor(team.teamName) }}
                                                                        >
                                                                            {getInitials(team.teamName)}
                                                                        </span>
                                                                        <span className="font-bold truncate max-w-[150px] text-brand-dark">
                                                                            {team.teamName}
                                                                        </span>
                                                                        {isQualified && isGroupComplete && (
                                                                            <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                                                                        )}
                                                                    </div>
                                                                </td>

                                                                {/* Statistik Real-Time Database */}
                                                                <td className="py-3 px-2 text-center text-brand-muted font-jetbrains font-semibold">{team.played}</td>
                                                                <td className="py-3 px-2 text-center text-brand-muted font-jetbrains">{team.won}</td>
                                                                <td className="py-3 px-2 text-center text-brand-muted font-jetbrains">{team.drawn}</td>
                                                                <td className="py-3 px-2 text-center text-brand-muted font-jetbrains">{team.lost}</td>
                                                                <td className="py-3 px-2 text-center text-brand-muted font-jetbrains">{team.goalsFor}</td>
                                                                <td className="py-3 px-2 text-center text-brand-muted font-jetbrains">{team.goalsAgainst}</td>
                                                                <td className={`py-3 px-2 text-center font-jetbrains font-bold ${team.goalDifference > 0 ? 'text-emerald-600' : team.goalDifference < 0 ? 'text-red-500' : 'text-brand-muted'}`}>
                                                                    {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                                                                </td>

                                                                {/* Poin Utama (PTS) */}
                                                                <td className="py-3 px-3 text-center font-black font-jetbrains text-sm bg-brand-gold/[0.06] text-brand-primary border-x border-brand-border">
                                                                    {team.points}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    <div className="max-w-5xl mx-auto w-full animate-in fade-in duration-300">
                        {/* CONTROLS BAR — SEARCH */}
                        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mb-6">
                            <div className="relative flex-1 max-w-md">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Search size={14} className="text-brand-muted" />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari nama tim..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-brand-border rounded-xl text-xs font-medium text-brand-dark placeholder:text-brand-muted/70 focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-all shadow-sm"
                                />
                            </div>
                            <span className="text-[11px] font-jetbrains font-bold text-brand-muted uppercase tracking-wide px-1">
                                {filteredLeaderboard.length} Tim Terdaftar
                            </span>
                        </div>

                        {/* TABEL RESPONSIVE DENGAN STICKY COLUMNS */}
                        <div className="bg-white border border-brand-border rounded-2xl overflow-hidden shadow-[0_1px_2px_rgba(24,24,27,0.05),0_10px_30px_-12px_rgba(86,27,29,0.12)] mb-12">
                            <div className="overflow-x-auto relative">
                                <table className="w-full text-left border-collapse min-w-[560px]">
                                    <thead>
                                        <tr className="bg-brand-bg-surface text-[10px] uppercase tracking-wider text-brand-muted font-black font-jetbrains border-b border-brand-border">
                                            <th className="py-3.5 px-3 text-center w-12 sticky left-0 bg-brand-bg-surface z-20 border-r border-brand-border">Rank</th>
                                            <th className="py-3.5 px-4 sticky left-[48px] bg-brand-bg-surface z-20 border-r border-brand-border">Klub / Tim</th>
                                            <th className="py-3.5 px-2 text-center w-10">M</th>
                                            <th className="py-3.5 px-2 text-center w-8">W</th>
                                            <th className="py-3.5 px-2 text-center w-8">D</th>
                                            <th className="py-3.5 px-2 text-center w-8">L</th>
                                            <th className="py-3.5 px-2 text-center w-10">GD</th>
                                            <th className="py-3.5 px-4 text-center w-14 font-black text-brand-primary bg-brand-gold/10">PTS</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-xs font-medium">
                                        {filteredLeaderboard.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className="text-center py-16 text-brand-muted font-medium">
                                                    Tidak ada klub yang cocok dengan kata kunci pencarian.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredLeaderboard.map((team, index) => {
                                                const rank = index + 1;

                                                // ✨ Rank Podium Premium — gradient emas/perak/perunggu sesuai brand
                                                const rankBadge =
                                                    rank === 1 ? 'bg-gradient-to-br from-brand-gold to-brand-bronze text-white font-black shadow-brand animate-glow' :
                                                        rank === 2 ? 'bg-gradient-to-br from-zinc-300 to-zinc-400 text-zinc-900 font-black shadow-sm' :
                                                            rank === 3 ? 'bg-gradient-to-br from-brand-bronze to-brand-secondary text-white font-black shadow-sm' :
                                                                'bg-brand-bg-surface text-brand-muted border border-brand-border';

                                                const rowAccent = rank <= 3 ? 'bg-brand-gold/[0.03]' : '';

                                                return (
                                                    <tr key={team.id} className={`border-b border-brand-border last:border-b-0 hover:bg-brand-bg-surface/60 transition-colors ${rowAccent}`}>

                                                        {/* Rank Sticky Column */}
                                                        <td className="py-3 px-3 text-center sticky left-0 z-10 bg-white border-r border-brand-border">
                                                            <span className={`inline-flex items-center justify-center gap-0.5 w-6 h-6 rounded-lg text-[10px] font-jetbrains ${rankBadge}`}>
                                                                {rank === 1 ? <Crown size={11} className="fill-current" /> : rank}
                                                            </span>
                                                        </td>

                                                        {/* Klub Sticky Column — crest disamakan dengan tab Grup */}
                                                        <td className="py-3 px-4 sticky left-[48px] z-10 bg-white border-r border-brand-border">
                                                            <div className="flex items-center gap-2.5">
                                                                <span
                                                                    className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black font-jetbrains text-white shrink-0 shadow-sm"
                                                                    style={{ backgroundColor: getCrestColor(team.teamName) }}
                                                                >
                                                                    {getInitials(team.teamName)}
                                                                </span>
                                                                <span className="font-bold text-brand-dark truncate max-w-[140px]">
                                                                    {team.teamName}
                                                                </span>
                                                            </div>
                                                        </td>

                                                        {/* Statistik */}
                                                        <td className="py-3 px-2 text-center text-brand-muted font-jetbrains font-semibold">{team.main}</td>
                                                        <td className="py-3 px-2 text-center text-emerald-600 font-jetbrains font-bold">{team.menang}</td>
                                                        <td className="py-3 px-2 text-center text-brand-muted font-jetbrains">{team.seri}</td>
                                                        <td className="py-3 px-2 text-center text-red-500 font-jetbrains">{team.kalah}</td>

                                                        <td className={`py-3 px-2 text-center font-jetbrains font-bold ${team.gd > 0 ? 'text-emerald-600' : team.gd < 0 ? 'text-red-500' : 'text-brand-muted'
                                                            }`}>
                                                            {team.gd > 0 ? `+${team.gd}` : team.gd}
                                                        </td>

                                                        {/* PTS Column (Highlighted) */}
                                                        <td className="py-3 px-4 text-center font-black font-jetbrains text-sm bg-brand-gold/[0.06] text-brand-primary border-l border-brand-border">
                                                            {team.poin}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}