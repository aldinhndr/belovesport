// Path: src/components/participant/ProfileTabContainer.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    User, Trophy, Ticket, Calendar, Swords, Clock,
    CheckCircle2, XCircle, Gamepad2, CreditCard, MessageCircle, ExternalLink, ChevronRight
} from 'lucide-react';
import CopyVoucherButton from '@/components/participant/CopyVoucherButton';
import MatchActionModal from '@/components/tournament/MatchActionModal';

interface ProfileTabContainerProps {
    myTeams: any[];
    matches: any[];
    teamIds: string[];
    stats: any;
    winRate: number;
}

export default function ProfileTabContainer({ myTeams, matches, teamIds, stats, winRate }: ProfileTabContainerProps) {
    const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'VOUCHERS' | 'MATCHES'>('OVERVIEW');
    const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);

    const statusMap: Record<string, { label: string; dot: string; text: string; bg: string; border: string; icon: React.ReactNode }> = {
        PENDING: { label: 'Sedang Ditinjau Admin', dot: 'bg-amber-400', text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', icon: <Clock size={13} /> },
        APPROVED: { label: 'Slot Diamankan', dot: 'bg-emerald-400', text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: <CheckCircle2 size={13} /> },
        REJECTED: { label: 'Ditolak Admin', dot: 'bg-red-400', text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', icon: <XCircle size={13} /> },
    };

    const statusLabel: Record<string, string> = {
        SCHEDULED: 'Terjadwal',
        WAITING_VERIFICATION: 'Menunggu Verifikasi',
        COMPLETED: 'Selesai',
    };

    return (
        <div className="space-y-6 min-w-0">
            {/* TAB INTERAKTIF NAVIGATION */}
            <div className="flex border-b border-brand-border text-xs font-black font-jetbrains uppercase tracking-widest overflow-x-auto custom-scrollbar bg-white p-1 rounded-t-xl">
                <button
                    onClick={() => setActiveTab('OVERVIEW')}
                    className={`py-3 px-5 flex items-center gap-2 border-b-2 transition-all ${activeTab === 'OVERVIEW' ? 'border-brand-primary text-brand-primary bg-brand-primary/5 rounded-t-xl font-black' : 'border-transparent text-brand-muted hover:text-brand-dark'}`}
                >
                    <User size={14} /> Ringkasan
                </button>
                <button
                    onClick={() => setActiveTab('VOUCHERS')}
                    className={`py-3 px-5 flex items-center gap-2 border-b-2 transition-all ${activeTab === 'VOUCHERS' ? 'border-brand-primary text-brand-primary bg-brand-primary/5 rounded-t-xl font-black' : 'border-transparent text-brand-muted hover:text-brand-dark'}`}
                >
                    <Ticket size={14} /> Voucher Saya ({myTeams.filter(t => t.status === 'APPROVED').length})
                </button>
                <button
                    onClick={() => setActiveTab('MATCHES')}
                    className={`py-3 px-5 flex items-center gap-2 border-b-2 transition-all ${activeTab === 'MATCHES' ? 'border-brand-primary text-brand-primary bg-brand-primary/5 rounded-t-xl font-black' : 'border-transparent text-brand-muted hover:text-brand-dark'}`}
                >
                    <Calendar size={14} /> Match Saya ({matches.length})
                </button>
            </div>

            {/* TAB PANELS AREA */}
            <div className="animate-in fade-in zoom-in-95 duration-200">

                {/* ── PANEL 1: OVERVIEW & RINGKASAN TIM ── */}
                {activeTab === 'OVERVIEW' && (
                    <div className="space-y-6">
                        {myTeams.length === 0 ? (
                            <div className="rounded-2xl p-8 bg-white border border-brand-gold/30 shadow-sm">
                                <h3 className="text-xl font-black text-brand-dark mb-2">Belovesport eFootball 2026</h3>
                                <p className="text-brand-muted text-sm leading-relaxed mb-6">
                                    Anda belum mendaftarkan tim. Amankan slot tim Anda sekarang dan dapatkan e-voucher eksklusif dari Belovecorp.
                                </p>
                                <Link href="/register" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-gradient-brand text-white shadow-brand">
                                    Daftar Tim Sekarang <ChevronRight size={16} />
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {myTeams.map((team) => (
                                    <div key={team.id} className="bg-white border border-brand-border p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="text-base font-black uppercase text-brand-dark truncate max-w-[160px]">{team.teamName}</h4>
                                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border ${statusMap[team.status]?.bg} ${statusMap[team.status]?.border} ${statusMap[team.status]?.text}`}>
                                                    {statusMap[team.status]?.label}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-brand-muted font-mono mb-4">ID: {team.efootballId}</p>
                                        </div>
                                        <button onClick={() => setActiveTab('VOUCHERS')} className="text-xs font-bold text-brand-primary flex items-center gap-1 hover:underline">
                                            Lihat detail manajemen & voucher <ExternalLink size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ── PANEL 2: VOUCHER SAYA (APPROVED ONLY) ── */}
                {activeTab === 'VOUCHERS' && (
                    <div className="space-y-4">
                        {myTeams.filter(t => t.status === 'APPROVED').length === 0 ? (
                            <div className="text-center py-16 border border-dashed border-brand-border rounded-2xl bg-white shadow-sm">
                                <Ticket className="mx-auto text-brand-muted/60 mb-3" size={32} />
                                <p className="text-sm font-bold text-brand-muted">Belum ada Voucher Aktif.</p>
                                <p className="text-xs text-brand-muted/80 mt-1">Voucher eksklusif akan muncul otomatis setelah status registrasi tim Koko APPROVED.</p>
                            </div>
                        ) : (
                            myTeams.filter(t => t.status === 'APPROVED').map((team: any) => {
                                const voucherCode = Array.isArray(team.vouchers) ? team.vouchers[0]?.voucherCode : team.vouchers?.voucherCode;
                                return (
                                    <div key={team.id} className="bg-white border border-brand-border rounded-2xl p-5 shadow-sm space-y-4">
                                        <div className="border-b border-brand-border pb-3 flex justify-between items-center">
                                            <h4 className="text-sm font-black text-brand-dark uppercase tracking-wider font-jetbrains">Voucher: {team.teamName}</h4>
                                            <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-200 px-2.5 py-1 rounded-lg">Verified Slot</span>
                                        </div>
                                        {voucherCode && (
                                            <div className="space-y-4">
                                                <div className="rounded-xl overflow-hidden border border-brand-gold/30 max-w-md mx-auto shadow-sm">
                                                    <img src="/img/VOUCHER_BELOVE.jpg" alt="Voucher Belovesport" className="w-full h-auto object-cover" />
                                                </div>
                                                <div className="flex items-center justify-between p-3.5 rounded-xl bg-brand-bg-surface border border-dashed border-brand-gold/40">
                                                    <span className="text-lg font-black tracking-widest font-mono text-brand-bronze select-all truncate pr-2">{voucherCode}</span>
                                                    <CopyVoucherButton voucherCode={voucherCode} />
                                                </div>
                                                <a href={`https://wa.me/6282274495235?text=Halo%20Admin%20Belovecorp,%20saya%20atas%20nama%20${team.leaderName}%20ingin%20mengklaim%20kode%20voucher%20eFootball%20saya:%20${voucherCode}`}
                                                    target="_blank" rel="noopener noreferrer"
                                                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#25D366]/10 border border-[#25D366]/30 text-[#128C4A] rounded-xl text-sm font-bold transition-all hover:bg-[#25D366]/20"
                                                >
                                                    <MessageCircle size={16} /> Klaim Reward via WhatsApp Admin
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}

                {/* ── PANEL 3: INTERACTIVE JADWAL SAYA ── */}
                {activeTab === 'MATCHES' && (
                    <div className="space-y-3">
                        {matches.length === 0 ? (
                            <div className="text-center py-16 border border-dashed border-brand-border rounded-2xl bg-white shadow-sm">
                                <Swords className="mx-auto text-brand-muted/60 mb-3" size={32} />
                                <p className="text-sm font-bold text-brand-muted">Jadwal Tanding Belum Rilis.</p>
                                <p className="text-xs text-brand-muted/80 mt-1">Laga Koko akan muncul di sini secara otomatis jika pembagian grup/bagan selesai diundi.</p>
                            </div>
                        ) : (
                            matches.map((match: any) => {
                                const isHome = teamIds.includes(match.homeTeamId);
                                const myTeamName = isHome ? match.homeTeam?.teamName : match.awayTeam?.teamName;
                                const opponentName = isHome ? match.awayTeam?.teamName : match.homeTeam?.teamName;

                                const isCompleted = match.matchStatus === 'COMPLETED';
                                const isWaiting = match.matchStatus === 'WAITING_VERIFICATION';
                                const isScheduled = match.matchStatus === 'SCHEDULED';

                                const myScore = isHome ? match.homeScoreLeg1 : match.awayScoreLeg1;
                                const oppScore = isHome ? match.awayScoreLeg1 : match.homeScoreLeg1;

                                const isWin = isCompleted && myScore > oppScore;
                                const isDraw = isCompleted && myScore === oppScore;
                                const isLoss = isCompleted && myScore < oppScore;

                                return (
                                    <div key={match.id} className="bg-white border border-brand-border rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 transition-all hover:border-brand-gold/40">
                                        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1.5 w-full md:w-auto">
                                            <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
                                                <span className="text-[9px] font-black uppercase font-jetbrains tracking-wider px-2 py-0.5 rounded bg-brand-gold/10 text-brand-primary border border-brand-gold/20">
                                                    {match.stage} · Match #{match.matchNumber}
                                                </span>
                                                <span className={`text-[9px] font-black uppercase font-jetbrains tracking-widest ${isCompleted ? 'text-emerald-600' : isWaiting ? 'text-amber-500' : 'text-brand-muted'}`}>
                                                    {statusLabel[match.matchStatus] || match.matchStatus}
                                                </span>
                                                {isCompleted && (
                                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${isWin ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : isDraw ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                                        {isWin ? 'Menang' : isDraw ? 'Seri' : 'Kalah'}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-xs font-black uppercase text-brand-dark max-w-[120px] truncate">{myTeamName}</span>
                                                <div className="bg-brand-bg-surface border border-brand-border rounded-lg px-2.5 py-0.5 font-jetbrains font-black text-xs text-brand-primary shadow-inner">
                                                    {isCompleted ? `${myScore} - ${oppScore}` : 'VS'}
                                                </div>
                                                <span className="text-xs font-semibold text-brand-dark/70 max-w-[120px] truncate">{opponentName}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 w-full md:w-auto shrink-0 border-t md:border-t-0 border-brand-border pt-3 md:pt-0">
                                            {match.scheduledTime && (
                                                <div className="flex items-center gap-1.5 text-[10px] text-brand-muted font-bold font-jetbrains mr-auto md:mr-2">
                                                    <Clock size={12} className="text-brand-gold" />
                                                    {new Date(match.scheduledTime).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                                </div>
                                            )}

                                            {/* Pemicu Modal Lapor Skor Instant */}
                                            {isScheduled && (
                                                <button
                                                    onClick={() => setSelectedMatchId(match.id)}
                                                    className="flex-1 md:flex-initial bg-brand-gold/10 hover:bg-brand-gold/20 border border-brand-gold/40 text-brand-primary font-black px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Swords size={13} /> Lapor Skor
                                                </button>
                                            )}

                                            {isWaiting && (
                                                <span className="text-[10px] font-bold flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 px-3 py-2 rounded-xl">
                                                    <Clock size={12} /> Reviewing
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>

            {/* INTERACTIVE MODAL COMPONENT */}
            {selectedMatchId && (
                <MatchActionModal
                    matchId={selectedMatchId}
                    onClose={() => setSelectedMatchId(null)}
                    onSuccess={() => window.location.reload()} // Force refresh untuk trigger data terupdate
                />
            )}
        </div>
    );
}