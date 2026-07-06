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
    CheckCircle2, Edit, Trophy, Activity, CalendarDays,
    UserCircle2, Mail, ShieldCheck, Bell, Calendar, Swords,
    BookOpen, MessageCircle, ChevronRight
} from 'lucide-react';

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

    const winRate = stats.main > 0 ? Math.round((stats.menang / stats.main) * 100) : 0;

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
                        <LogoutButtonParticipant />
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                {/* HERO HEADER */}
                <div className="mb-8 rounded-2xl overflow-hidden relative bg-white border border-brand-gold/25 shadow-sm">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-gold to-transparent" aria-hidden />

                    <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <div className="relative shrink-0">
                            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black bg-gradient-to-br from-brand-bg-surface to-white border-2 border-brand-gold/50 shadow-[0_0_30px_rgba(252,179,53,0.12)]">
                                <span className="text-brand-primary">{participant.username.charAt(0).toUpperCase()}</span>
                            </div>
                            {participant.isVerified && (
                                <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center bg-emerald-500 border-2 border-white">
                                    <CheckCircle2 size={12} className="text-white" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-brand-dark">@{participant.username}</h1>
                                {participant.isVerified && (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
                                        <CheckCircle2 size={10} /> Terverifikasi
                                    </span>
                                )}
                            </div>
                            <p className="text-brand-muted text-sm mb-4 truncate">{participant.email}</p>
                            <div className="flex flex-wrap gap-4 text-xs text-brand-muted">
                                <span className="flex items-center gap-1.5"><CalendarDays size={12} />Bergabung {joinDate}</span>
                                <span className="flex items-center gap-1.5"><Trophy size={12} className="text-brand-gold" />{myTeams.length} Tim Terdaftar</span>
                                {stats.main > 0 && (
                                    <span className="flex items-center gap-1.5"><Activity size={12} className="text-emerald-600" />{winRate}% Win Rate</span>
                                )}
                            </div>
                        </div>

                        <Link href="/profil/edit" className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all bg-brand-gold/10 border border-brand-gold/40 text-brand-primary">
                            <Edit size={14} /> Edit Profil
                        </Link>
                    </div>
                </div>

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
                    {/* SIDEBAR KIRI */}
                    <aside className="space-y-4">
                        <div className="rounded-2xl overflow-hidden bg-white border border-brand-border shadow-sm">
                            <div className="px-4 py-3 border-b border-brand-border">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-bronze">Informasi Akun</p>
                            </div>
                            <div className="p-4 space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 p-1.5 rounded-lg bg-brand-bg-surface"><UserCircle2 size={14} className="text-brand-muted" /></div>
                                    <div>
                                        <p className="text-[10px] text-brand-muted uppercase tracking-wide mb-0.5">Username / IGN</p>
                                        <p className="text-sm font-semibold text-brand-dark">@{participant.username}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 p-1.5 rounded-lg bg-brand-bg-surface"><Mail size={14} className="text-brand-muted" /></div>
                                    <div>
                                        <p className="text-[10px] text-brand-muted uppercase tracking-wide mb-0.5">Email</p>
                                        <p className="text-sm font-medium text-brand-dark/80 truncate max-w-[180px]">{participant.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 p-1.5 rounded-lg bg-brand-bg-surface"><ShieldCheck size={14} className="text-brand-muted" /></div>
                                    <div>
                                        <p className="text-[10px] text-brand-muted uppercase tracking-wide mb-0.5">Status Akun</p>
                                        <p className="text-sm font-semibold text-emerald-600">Aktif &amp; Terverifikasi</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {myTeams.length > 0 && (
                            <div className="rounded-2xl overflow-hidden bg-white border border-brand-border shadow-sm">
                                <div className="px-4 py-3 border-b border-brand-border bg-slate-50">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-brand-bronze">Statistik Sirkuit</p>
                                </div>
                                <div className="p-4 grid grid-cols-3 gap-2">
                                    {[
                                        { label: 'Main', value: stats.main, className: 'text-brand-dark' },
                                        { label: 'Menang', value: stats.menang, className: 'text-emerald-600' },
                                        { label: 'Seri', value: stats.seri, className: 'text-brand-bronze' },
                                        { label: 'Kalah', value: stats.kalah, className: 'text-red-600' },
                                        { label: 'Gol', value: stats.gol, className: 'text-violet-600' },
                                        { label: 'Win %', value: `${winRate}%`, className: 'text-emerald-600' },
                                    ].map(s => (
                                        <div key={s.label} className="text-center p-2.5 rounded-xl bg-brand-bg-surface border border-brand-border">
                                            <div className={`text-xl font-black ${s.className}`}>{s.value}</div>
                                            <div className="text-[9px] uppercase tracking-wide mt-0.5 text-brand-muted">{s.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* NAVIGASI AKSES CEPAT */}
                        <div className="rounded-2xl overflow-hidden bg-white border border-brand-border shadow-sm">
                            <div className="px-4 py-3 border-b border-brand-border">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-bronze">Akses Cepat</p>
                            </div>
                            <div className="p-2 space-y-1">
                                {[
                                    { href: '/tournament/groups', icon: <Trophy size={15} />, label: 'Klasemen Grup', desc: 'Poin & peringkat grup' },
                                    { href: '/tournament/schedule', icon: <Calendar size={15} />, label: 'Jadwal Tanding', desc: 'Waktu & hasil pertandingan' },
                                    { href: '/tournament/bracket', icon: <Swords size={15} />, label: 'Bracket Knock Out', desc: 'Lihat posisi di turnamen' },
                                    { href: '/tournament/rulebook', icon: <BookOpen size={15} />, label: 'Rulebook Resmi', desc: 'Peraturan & ketentuan' },
                                    { href: 'https://wa.me/62895327761216', icon: <MessageCircle size={15} />, label: 'Chat Support Admin', desc: 'Butuh bantuan?' },
                                ].map(item => (
                                    <Link key={item.label} href={item.href} className="flex items-center justify-between p-3 rounded-xl transition-all group hover:bg-brand-bg-surface">
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 rounded-lg text-brand-muted group-hover:text-brand-primary transition-colors">{item.icon}</div>
                                            <div>
                                                <p className="text-sm font-medium text-brand-dark/85 group-hover:text-brand-dark">{item.label}</p>
                                                <p className="text-[10px] text-brand-muted">{item.desc}</p>
                                            </div>
                                        </div>
                                        <ChevronRight size={13} className="text-brand-muted/60 group-hover:text-brand-dark" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* KONTEN TAB INTERAKTIF */}
                    <ProfileTabsContent myTeams={myTeams} matches={matches} teamIds={teamIds} />
                </div>
            </div>
        </div>
    );
}