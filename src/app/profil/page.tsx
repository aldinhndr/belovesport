// Path: src/app/profil/page.tsx
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getParticipantSession } from '@/lib/participant-auth';
import { prisma } from '@/lib/prisma';
import LogoutButtonParticipant from '@/components/participant/LogoutButton';
import ProfileTabsContent from './ProfileTabsContent';

// 🚀 IMPORT ENGINE SKOR TERPUSAT Ko!
import { calculateMatchResult } from '@/lib/tournament';

import {
    CheckCircle2, Edit, Trophy, Mail, ShieldCheck, Bell,
    Calendar, Swords, BookOpen, MessageCircle, Share2,
    BadgeCheck, Hash
} from 'lucide-react';

// Batas maksimal slot tim per akun peserta (sesuaikan dengan aturan turnamen aktif)
const MAX_TEAM_SLOTS = 5;

export default async function ProfilPage() {
    const session = await getParticipantSession();

    if (!session) return null;

    const participant = await prisma.participant.findUnique({
        where: { id: session.participantId },
        select: {
            id: true,
            username: true,
            email: true,
            isVerified: true,
            createdAt: true,
            profilePictureUrl: true,
        }
    });

    if (!participant) redirect('/login');

    const myTeams = await prisma.registration.findMany({
        where: { participantId: session.participantId },
        include: { vouchers: true },
        orderBy: { id: 'desc' }
    });

    const teamIds = myTeams.map(t => t.id);
    let matches: any[] = [];
    let stats = { main: 0, menang: 0, seri: 0, kalah: 0, gol: 0 };

    if (teamIds.length > 0) {
        matches = await prisma.match.findMany({
            where: {
                OR: [
                    { homeTeamId: { in: teamIds } },
                    { awayTeamId: { in: teamIds } }
                ]
            },
            include: {
                homeTeam: { select: { teamName: true, id: true } },
                awayTeam: { select: { teamName: true, id: true } }
            },
            orderBy: { scheduledTime: 'asc' }
        });

        // 🚀 REFACTOR: Gunakan fungsi tunggal terpusat agar DRY seutuhnya!
        matches.forEach(m => {
            const result = calculateMatchResult(m, teamIds);
            if (result.isCompleted) {
                stats.main += 1;
                const isHome = teamIds.includes(m.homeTeamId || '');

                // Tambahkan akumulasi gol tim Koko (Leg 1 + Leg 2)
                stats.gol += isHome ? (m.homeScoreLeg1 || 0) + (m.homeScoreLeg2 || 0) : (m.awayScoreLeg1 || 0) + (m.awayScoreLeg2 || 0);

                if (result.isWin) stats.menang += 1;
                else if (result.isLoss) stats.kalah += 1;
                else if (result.isDraw) stats.seri += 1;
            }
        });
    }

    const joinDate = new Date(participant.createdAt).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    const winRate = stats.main > 0 ? (stats.menang / stats.main) * 100 : 0;

    return (
        <div className="min-h-screen bg-brand-bg-light text-brand-dark">
            <div className="fixed top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent z-40" />
            <div
                className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full opacity-[0.08] pointer-events-none blur-[110px]"
                style={{ background: 'radial-gradient(ellipse, #FCB335 0%, #82403B 55%, transparent 70%)' }}
                aria-hidden
            />

            {/* TOP NAVBAR */}
            <nav className="sticky top-0 z-50 border-b border-brand-border bg-brand-bg-light/85 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-md overflow-hidden flex items-center justify-center bg-gradient-to-br from-brand-gold to-brand-bronze">
                                <img src="/logos/logo_BELOVESPORT.png" alt="Belovesport" className="w-full h-full object-cover" />
                            </div>
                            <span className="font-black text-sm tracking-widest uppercase text-brand-dark">Belovesport</span>
                        </div>
                        <span className="text-brand-muted/40 text-xs" aria-hidden>/</span>
                        <span className="text-brand-muted text-xs font-medium">Profil</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button aria-label="Notifikasi" className="relative p-2 rounded-lg text-brand-muted hover:text-brand-dark hover:bg-brand-bg-surface transition-all">
                            <Bell size={16} />
                            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-gold" />
                        </button>
                        <div className="w-9 h-9 rounded-full border-2 border-brand-gold overflow-hidden shrink-0 bg-brand-bg-surface flex items-center justify-center">
                            {participant.profilePictureUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={participant.profilePictureUrl}
                                    alt={`Foto profil ${participant.username}`}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-xs font-black text-brand-primary">
                                    {participant.username.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>
                        <LogoutButtonParticipant />
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                {/* HERO HEADER */}
                <div className="mb-8 rounded-2xl overflow-hidden relative bg-white border border-brand-border shadow-sm">
                    <div className="absolute top-0 left-0 w-2 h-full bg-brand-primary" aria-hidden />

                    <div className="relative p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-end gap-8">
                        <div className="relative shrink-0">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-4 border-brand-bg-surface shadow-lg flex items-center justify-center bg-gradient-to-br from-brand-bg-surface to-white">
                                {participant.profilePictureUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={participant.profilePictureUrl}
                                        alt={`Foto profil ${participant.username}`}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-4xl font-black text-brand-primary">
                                        {participant.username.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            {participant.isVerified && (
                                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white rounded-full p-1.5 border-4 border-white flex items-center justify-center">
                                    <CheckCircle2 size={16} />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-brand-dark">{participant.username}</h1>
                                <span className="inline-block text-xs font-mono bg-brand-bg-surface text-brand-muted px-3 py-1 rounded-full border border-brand-border w-fit mx-auto md:mx-0">
                                    @{participant.username}
                                </span>
                            </div>
                            <p className="text-brand-muted text-sm mb-4 truncate">
                                {participant.email} • Bergabung sejak {joinDate}
                            </p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                <div className="bg-brand-bg-surface px-4 py-2 rounded-xl border border-brand-border">
                                    <p className="text-[10px] uppercase tracking-widest text-brand-muted font-bold mb-1">Active Slots</p>
                                    <p className="font-mono text-sm font-bold text-brand-dark">
                                        {String(myTeams.length).padStart(2, '0')} / {MAX_TEAM_SLOTS}
                                    </p>
                                </div>
                                <div className="bg-brand-bg-surface px-4 py-2 rounded-xl border border-brand-gold/40 shadow-[0_0_15px_rgba(252,179,53,0.2)]">
                                    <p className="text-[10px] uppercase tracking-widest text-brand-gold font-bold mb-1">Elite Win Rate</p>
                                    <p className="font-mono text-sm font-bold text-brand-dark">
                                        {stats.main > 0 ? `${winRate.toFixed(1)}%` : '—'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 shrink-0">
                            <Link
                                href="/profil/edit"
                                className="bg-brand-primary text-white px-6 py-3 rounded-full font-bold text-sm hover:scale-105 transition-transform active:scale-95 shadow-md flex items-center gap-2"
                            >
                                <Edit size={14} /> Edit Profil
                            </Link>
                            <button
                                type="button"
                                aria-label="Bagikan profil"
                                className="bg-white border-2 border-brand-primary text-brand-primary px-4 py-3 rounded-full hover:bg-brand-bg-surface transition-colors"
                            >
                                <Share2 size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
                    {/* SIDEBAR KIRI */}
                    <aside className="space-y-6 w-full lg:w-[280px]">
                        {/* IDENTITY WIDGET: VERIFIED PARTICIPANT */}
                        <div className="rounded-2xl bg-white border border-brand-border p-5 shadow-sm">
                            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-brand-border">
                                <BadgeCheck size={18} className="text-brand-gold" />
                                <span className="text-xs font-black text-brand-dark uppercase tracking-tight">
                                    {participant.isVerified ? 'Verified Participant' : 'Peserta'}
                                </span>
                            </div>
                            <ul className="space-y-4">
                                <li className="flex items-center justify-between gap-3">
                                    <span className="text-xs text-brand-muted flex items-center gap-1.5"><Hash size={12} /> ID Member</span>
                                    <span className="font-mono text-xs font-bold text-brand-dark truncate max-w-[130px]">
                                        #{participant.id.slice(-8).toUpperCase()}
                                    </span>
                                </li>
                                <li className="flex items-center justify-between gap-3">
                                    <span className="text-xs text-brand-muted flex items-center gap-1.5"><Mail size={12} /> Email</span>
                                    <span className="font-medium text-xs text-brand-dark truncate max-w-[130px]">{participant.email}</span>
                                </li>
                                <li className="flex items-center justify-between gap-3">
                                    <span className="text-xs text-brand-muted flex items-center gap-1.5"><ShieldCheck size={12} /> Status Akun</span>
                                    <span className="font-semibold text-xs text-emerald-600">
                                        {participant.isVerified ? 'Aktif & Terverifikasi' : 'Belum Terverifikasi'}
                                    </span>
                                </li>
                            </ul>
                        </div>

                        {/* CIRCUIT STATS GRID */}
                        {myTeams.length > 0 && (
                            <div className="rounded-2xl bg-white border border-brand-border p-5 shadow-sm">
                                <h3 className="text-xs font-black text-brand-dark uppercase tracking-tight mb-4">Statistik Sirkuit</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { label: 'Main', value: stats.main, className: 'text-brand-dark' },
                                        { label: 'Menang', value: stats.menang, className: 'text-emerald-600' },
                                        { label: 'Seri', value: stats.seri, className: 'text-brand-muted' },
                                        { label: 'Kalah', value: stats.kalah, className: 'text-red-600' },
                                        { label: 'Gol', value: stats.gol, className: 'text-brand-dark' },
                                    ].map(s => (
                                        <div key={s.label} className="rounded-xl p-3 text-center border border-brand-border hover:border-brand-primary hover:bg-brand-bg-surface transition-all">
                                            <p className="text-[10px] text-brand-muted uppercase mb-1">{s.label}</p>
                                            <p className={`font-mono text-sm font-bold ${s.className}`}>{s.value}</p>
                                        </div>
                                    ))}
                                    <div className="rounded-xl p-3 text-center bg-brand-primary/5 border border-brand-primary/20">
                                        <p className="text-[10px] text-brand-primary uppercase mb-1 font-bold">Win%</p>
                                        <p className="font-mono text-sm font-bold text-brand-primary">{winRate.toFixed(1)}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* NAVIGASI AKSES CEPAT */}
                        <div className="rounded-2xl overflow-hidden bg-brand-bg-surface border border-brand-border shadow-sm">
                            <div className="px-5 py-4 border-b border-brand-border">
                                <h3 className="text-xs font-black text-brand-dark uppercase tracking-tight">Akses Cepat</h3>
                            </div>
                            <nav className="flex flex-col">
                                {[
                                    { href: '/tournament/groups', icon: <Trophy size={16} />, label: 'Klasemen' },
                                    { href: '/tournament/schedule', icon: <Calendar size={16} />, label: 'Jadwal' },
                                    { href: '/tournament/bracket', icon: <Swords size={16} />, label: 'Bracket' },
                                    { href: '/tournament/rulebook', icon: <BookOpen size={16} />, label: 'Rulebook' },
                                ].map(item => (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        className="flex items-center gap-3 px-5 py-4 hover:bg-white transition-colors group border-b border-brand-border/60"
                                    >
                                        <span className="text-brand-muted group-hover:text-brand-primary transition-colors">{item.icon}</span>
                                        <span className="text-sm font-medium text-brand-muted group-hover:text-brand-dark">{item.label}</span>
                                    </Link>
                                ))}
                                <Link
                                    href="https://wa.me/62895327761216"
                                    className="flex items-center justify-between px-5 py-5 bg-brand-primary text-white group"
                                >
                                    <div className="flex items-center gap-3">
                                        <MessageCircle size={18} />
                                        <span className="text-sm font-bold">Live Chat Support</span>
                                    </div>
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                </Link>
                            </nav>
                        </div>
                    </aside>

                    {/* KONTEN TAB INTERAKTIF */}
                    <ProfileTabsContent myTeams={myTeams} matches={matches} teamIds={teamIds} />
                </div>
            </div>
        </div>
    );
}