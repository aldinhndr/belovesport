// Path: src/app/profil/ProfileTabsContent.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Ticket, Clock, CheckCircle2, Gamepad2, Users, Swords,
    Calendar, XCircle, ChevronRight, CreditCard, MessageCircle, Zap
} from 'lucide-react';
import CopyVoucherButton from '@/components/participant/CopyVoucherButton';
import MatchActionModal from '@/components/tournament/MatchActionModal';

// 🚀 IMPORT UTAL GLOBAL BIAR DRY SEUTUHNYA Ko!
import { REGISTRATION_STATUS_MAP, MATCH_STATUS_LABEL } from '@/lib/constants';

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
    return (
        <div className="flex items-center gap-2.5 mb-4">
            <div className="text-brand-primary">{icon}</div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-brand-dark/80">{title}</h2>
            <div className="flex-1 h-px bg-brand-border" />
        </div>
    );
}

export default function ProfileTabsContent({ myTeams, matches, teamIds }: { myTeams: any[]; matches: any[]; teamIds: string[] }) {
    const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'VOUCHERS' | 'MATCHES'>('OVERVIEW');
    const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);

    return (
        <main className="space-y-6 min-w-0">
            {/* HUB MENU TAB NAVIGATION INTERAKTIF */}
            <div className="flex border-b border-brand-border text-xs font-black font-jetbrains uppercase tracking-widest bg-white p-1 rounded-t-xl shadow-sm overflow-x-auto custom-scrollbar">
                <button type="button" onClick={() => setActiveTab('OVERVIEW')} className={`py-3 px-5 flex items-center gap-2 border-b-2 transition-all ${activeTab === 'OVERVIEW' ? 'border-brand-primary text-brand-primary bg-brand-primary/5 rounded-t-xl font-black' : 'border-transparent text-brand-muted hover:text-brand-dark'}`}>
                    <Users size={14} /> Tim &amp; Registrasi
                </button>
                <button type="button" onClick={() => setActiveTab('VOUCHERS')} className={`py-3 px-5 flex items-center gap-2 border-b-2 transition-all ${activeTab === 'VOUCHERS' ? 'border-brand-primary text-brand-primary bg-brand-primary/5 rounded-t-xl font-black' : 'border-transparent text-brand-muted hover:text-brand-dark'}`}>
                    <Ticket size={14} /> Voucher Saya ({myTeams.filter(t => t.status === 'APPROVED').length})
                </button>
                <button type="button" onClick={() => setActiveTab('MATCHES')} className={`py-3 px-5 flex items-center gap-2 border-b-2 transition-all ${activeTab === 'MATCHES' ? 'border-brand-primary text-brand-primary bg-brand-primary/5 rounded-t-xl font-black' : 'border-transparent text-brand-muted hover:text-brand-dark'}`}>
                    <Swords size={14} /> Jadwal Match ({matches.length})
                </button>
            </div>

            <div className="animate-in fade-in zoom-in-95 duration-200">

                {/* ── TAB 1: OVERVIEW TIM & REGISTRASI ASLI KOKO ── */}
                {activeTab === 'OVERVIEW' && (
                    <div className="space-y-6">
                        {/* SPANDUK DYNAMIC MULTI-SLOT ANNOUNCEMENT */}
                        {myTeams.length > 0 && myTeams.length < 2 && (
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-gold/[0.08] to-brand-bronze/[0.04] border border-brand-gold/30 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                <div className="space-y-1">
                                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest bg-brand-gold/20 text-brand-primary border border-brand-gold/30 font-jetbrains">
                                        <Zap size={10} className="fill-brand-gold" /> Slot Tambahan
                                    </div>
                                    <p className="text-xs font-black uppercase tracking-wide font-jetbrains text-brand-dark mt-1">
                                        Ingin memperbesar peluang juara Belovesport, Ko?
                                    </p>
                                    <p className="text-[11px] text-brand-muted font-medium">
                                        Koko terdeteksi baru mengamankan {myTeams.length} slot. Turnamen ini mendukung hingga maksimal 2 slot tim per akun.
                                    </p>
                                </div>
                                <Link
                                    href="/register"
                                    className="shrink-0 w-full sm:w-auto text-center px-4 py-2.5 rounded-xl text-xs font-black uppercase font-jetbrains tracking-widest transition-all bg-gradient-brand text-white shadow-brand hover:brightness-105 active:scale-95"
                                >
                                    + Amankan Slot Ke-2
                                </Link>
                            </div>
                        )}

                        {myTeams.length === 0 && (
                            <div className="rounded-2xl p-8 relative overflow-hidden bg-white border border-brand-gold/30 shadow-sm">
                                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-gold to-transparent" aria-hidden />
                                <div className="max-w-lg">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4 bg-brand-gold/10 border border-brand-gold/30 text-brand-primary">
                                        <Zap size={11} /> Pendaftaran Dibuka
                                    </div>
                                    <h3 className="text-2xl font-black text-brand-dark mb-2">Belovesport eFootball 2026</h3>
                                    <p className="text-brand-muted text-sm leading-relaxed mb-6">
                                        Anda belum mendaftarkan tim. Amankan slot tim Anda sekarang dan dapatkan e-voucher eksklusif dari Belovecorp.
                                    </p>
                                    <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-gradient-brand text-white shadow-brand">
                                        Daftar Tim Sekarang <ChevronRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        )}

                        {myTeams.length > 0 && (
                            <div className="space-y-6">
                                <SectionHeader icon={<Users size={14} />} title="Riwayat Registrasi Tim" />
                                {myTeams.map((team: any) => {
                                    // 🚀 MENGGUNAKAN MAP GLOBAL YANG DARI CONSTANTS
                                    const statusConfig = (REGISTRATION_STATUS_MAP as any)[team.status] || {
                                        label: team.status, dot: 'bg-brand-muted', text: 'text-brand-dark', bg: 'bg-brand-bg-surface', border: 'border-brand-border', icon: null
                                    };

                                    return (
                                        <div key={team.id} className="rounded-2xl overflow-hidden relative bg-white border border-brand-border shadow-sm">
                                            <div className={`h-[2px] ${statusConfig.dot} opacity-60`} />
                                            <div className="p-5 sm:p-6">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                                                    <div>
                                                        <h4 className="text-xl font-black uppercase tracking-tight text-brand-dark">{team.teamName}</h4>
                                                        <p className="text-xs mt-1 flex items-center gap-1.5 text-brand-muted">
                                                            <Gamepad2 size={12} /> eFootball ID: <span className="font-mono">{team.efootballId}</span>
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-col items-start sm:items-end gap-1.5 shrink-0">
                                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${statusConfig.bg} border ${statusConfig.border} ${statusConfig.text}`}>
                                                            {team.status === 'PENDING' && <Clock size={13} />}
                                                            {team.status === 'APPROVED' && <CheckCircle2 size={13} />}
                                                            {team.status === 'REJECTED' && <XCircle size={13} />}
                                                            {statusConfig.label}
                                                        </span>
                                                        {team.status === 'REJECTED' && team.rejectionReason && (
                                                            <p className="text-[11px] text-red-600/80 italic max-w-[220px] text-right leading-snug">
                                                                &quot;{team.rejectionReason}&quot;
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3 mb-5">
                                                    <div className="p-3.5 rounded-xl bg-brand-bg-surface border border-brand-border">
                                                        <p className="text-[10px] uppercase tracking-widest mb-1.5 text-brand-muted">Kapten Tim</p>
                                                        <p className="text-sm font-semibold text-brand-dark">{team.leaderName}</p>
                                                    </div>
                                                    <div className="p-3.5 rounded-xl bg-brand-bg-surface border border-brand-border">
                                                        <p className="text-[10px] uppercase tracking-widest mb-1.5 text-brand-muted">WhatsApp</p>
                                                        <p className="text-sm font-semibold text-brand-dark">{team.whatsappNumber}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between p-3.5 rounded-xl bg-brand-bg-surface border border-brand-border">
                                                    <div className="flex items-center gap-2.5">
                                                        <CreditCard size={14} className="text-brand-muted" />
                                                        <span className="text-sm text-brand-dark/70">Bukti Pembayaran</span>
                                                    </div>
                                                    {team.paymentProofUrl ? (
                                                        <span className="text-xs font-semibold flex items-center gap-1.5 text-emerald-600">
                                                            <CheckCircle2 size={12} /> Sudah Diunggah
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs font-semibold text-amber-600 flex items-center gap-1.5">
                                                            <Clock size={12} /> Belum Diunggah
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* ── TAB 2: EXCLUSIVE VOUCHER REWARD DISPLAY ── */}
                {activeTab === 'VOUCHERS' && (
                    <div className="space-y-4">
                        {myTeams.filter(t => t.status === 'APPROVED').length === 0 ? (
                            <div className="text-center py-16 border border-dashed border-brand-border rounded-2xl bg-white shadow-sm">
                                <Ticket className="mx-auto text-brand-muted/60 mb-3" size={32} />
                                <p className="text-sm font-bold text-brand-muted">Belum Ada Voucher Reward Aktif</p>
                                <p className="text-xs text-brand-muted/80 mt-1">E-Voucher eksklusif otomatis dirilis di tab ini setelah validasi data pendaftaran disetujui Admin.</p>
                            </div>
                        ) : (
                            myTeams.filter(t => t.status === 'APPROVED').map((team: any) => {
                                const voucherCode = Array.isArray(team.vouchers) ? team.vouchers[0]?.voucherCode : team.vouchers?.voucherCode;
                                return (
                                    <div key={team.id} className="rounded-2xl overflow-hidden relative bg-white border border-brand-border shadow-sm p-5 sm:p-6">
                                        <div className="rounded-xl overflow-hidden relative bg-gradient-to-br from-brand-gold/[0.08] to-brand-bronze/[0.04] border border-brand-gold/30 p-5">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-2.5 rounded-xl bg-brand-gold/15">
                                                    <Ticket size={20} className="text-brand-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-brand-dark">E-Voucher Belovecorp ({team.teamName})</p>
                                                    <p className="text-xs text-brand-muted">Diskon &amp; merchandise eksklusif</p>
                                                </div>
                                            </div>

                                            {voucherCode && (
                                                <>
                                                    <div className="mb-4 rounded-xl overflow-hidden border border-brand-gold/40 shadow-sm">
                                                        <img src="/img/VOUCHER_BELOVE.jpg" alt="Voucher Belovesport" className="w-full h-auto object-cover" />
                                                    </div>

                                                    <div className="flex items-center justify-between p-3.5 rounded-xl mb-4 bg-white border border-dashed border-brand-gold/50">
                                                        <span className="text-xl font-black tracking-widest font-mono select-all text-brand-bronze truncate pr-2">
                                                            {voucherCode}
                                                        </span>
                                                        <CopyVoucherButton voucherCode={voucherCode} />
                                                    </div>

                                                    <a href={`https://wa.me/6282274495235?text=Halo%20Admin%20Belovecorp,%20saya%20atas%20nama%20${team.leaderName}%20ingin%20mengklaim%20kode%20voucher%20eFootball%20saya:%20${voucherCode}`}
                                                        target="_blank" rel="noopener noreferrer"
                                                        className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl text-sm font-bold transition-all bg-[#25D366]/10 border border-brand-gold/40 text-[#128C4A]"
                                                    >
                                                        <MessageCircle size={16} /> Klaim Hadiah via WA Admin
                                                    </a>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}

                {/* ── TAB 3: JADWAL & LIVE LAPOR SKOR MATCH KOKO ── */}
                {activeTab === 'MATCHES' && (
                    <div className="space-y-4">
                        <SectionHeader icon={<Calendar size={14} />} title="Riwayat & Jadwal Pertandingan" />
                        {matches.length === 0 ? (
                            <div className="text-center py-16 border border-dashed border-brand-border rounded-2xl bg-white shadow-sm">
                                <Swords className="mx-auto text-brand-muted/60 mb-3" size={32} />
                                <p className="text-sm font-bold text-brand-muted">Jadwal Pertandingan Belum Tersedia.</p>
                            </div>
                        ) : (
                            matches.map((match: any) => {
                                const isHome = teamIds.includes(match.homeTeamId);
                                const myTeamName = isHome ? (match.homeTeam?.teamName || 'TBD') : (match.awayTeam?.teamName || 'TBD');
                                const opponentName = isHome ? (match.awayTeam?.teamName || 'TBD') : (match.homeTeam?.teamName || 'TBD');
                                const myScore = isHome ? match.homeScoreLeg1 : match.awayScoreLeg1;
                                const oppScore = isHome ? match.awayScoreLeg1 : match.homeScoreLeg1;

                                const isCompleted = match.matchStatus === 'COMPLETED';
                                const isWaiting = match.matchStatus === 'WAITING_VERIFICATION';
                                const isScheduled = match.matchStatus === 'SCHEDULED';

                                const myTotalScore = isHome
                                    ? (match.homeScoreLeg1 ?? 0) + (match.homeScoreLeg2 ?? 0)
                                    : (match.awayScoreLeg1 ?? 0) + (match.awayScoreLeg2 ?? 0);
                                const oppTotalScore = isHome
                                    ? (match.awayScoreLeg1 ?? 0) + (match.awayScoreLeg2 ?? 0)
                                    : (match.homeScoreLeg1 ?? 0) + (match.homeScoreLeg2 ?? 0);

                                const isWin = isCompleted && myTotalScore > oppTotalScore;
                                const isDraw = isCompleted && myTotalScore === oppTotalScore;
                                const isLoss = isCompleted && myTotalScore < oppTotalScore;

                                const resultConfig = isWin
                                    ? { label: 'Menang', text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' }
                                    : isDraw
                                        ? { label: 'Seri', text: 'text-brand-bronze', bg: 'bg-brand-gold/10', border: 'border-brand-gold/30' }
                                        : isLoss
                                            ? { label: 'Kalah', text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' }
                                            : null;

                                return (
                                    <div key={match.id} className="rounded-xl p-4 sm:p-5 transition-all bg-white border border-brand-border shadow-sm">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-brand-gold/10 text-brand-primary border border-brand-gold/30">
                                                        {match.stage} · Match #{match.matchNumber}
                                                    </span>
                                                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-brand-bg-surface text-brand-muted border border-brand-border">
                                                        {/* 🚀 MENGGUNAKAN LABEL DARI CONSTANTS */}
                                                        {(MATCH_STATUS_LABEL as any)[match.matchStatus] || match.matchStatus}
                                                    </span>
                                                    {resultConfig && (
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${resultConfig.bg} border ${resultConfig.border} ${resultConfig.text}`}>
                                                            {resultConfig.label}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <span className="font-bold text-sm text-brand-dark truncate max-w-[100px] sm:max-w-none">{myTeamName}</span>
                                                    {isCompleted ? (
                                                        <span className="font-black text-base px-3 py-1 rounded-lg font-mono bg-brand-bg-surface text-brand-bronze">
                                                            {match.homeScoreLeg2 !== null ? `${myTotalScore} - ${oppTotalScore}` : `${myScore} - ${oppScore}`}
                                                        </span>
                                                    ) : (
                                                        <span className="text-brand-muted text-xs font-bold px-3 py-1 rounded-lg bg-brand-bg-surface">VS</span>
                                                    )}
                                                    <span className="font-semibold text-sm text-brand-dark/70 truncate max-w-[100px] sm:max-w-none">{opponentName}</span>
                                                </div>

                                                {match.scheduledTime && (
                                                    <p className="text-[11px] mt-1.5 text-brand-muted">
                                                        <Calendar size={10} className="inline mr-1" />
                                                        {new Date(match.scheduledTime).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {isScheduled && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedMatchId(match.id)}
                                                        className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-brand-gold/10 border border-brand-gold/40 text-brand-primary"
                                                    >
                                                        Lapor Skor <ChevronRight size={13} />
                                                    </button>
                                                )}
                                                {isWaiting && (
                                                    <span className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-amber-50 border border-amber-200 text-amber-700">
                                                        <Clock size={12} /> In Review
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>

            {/* MODAL LAUNCHER ENGINE */}
            {selectedMatchId && (
                <MatchActionModal
                    matchId={selectedMatchId}
                    onClose={() => setSelectedMatchId(null)}
                    onSuccess={() => window.location.reload()}
                />
            )}
        </main>
    );
}