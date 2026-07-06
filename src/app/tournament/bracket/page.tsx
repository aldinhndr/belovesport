// Path: src/app/tournament/bracket/page.tsx
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { GitFork, ArrowLeft, Trophy, Bell } from 'lucide-react';
import BracketComponent from './BracketComponent';
import { getParticipantSession } from '@/lib/participant-auth';
import LogoutButtonParticipant from '@/components/participant/LogoutButton';

export default async function BracketPage() {
    // 🛡️ PROTEKSI LAPIS PERTAMA: Menggunakan Auth Lokal Server Koko
    const session = await getParticipantSession();

    if (!session) {
        redirect('/login');
    }

    return (
        <div className="min-h-screen bg-brand-bg-light text-brand-dark relative overflow-hidden pb-20 flex flex-col">

            {/* 🌟 EFEK CAHAYA & BACKGROUND PREMIUM */}
            <div className="fixed top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent z-40" />
            <div
                className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full opacity-[0.08] pointer-events-none blur-[110px]"
                style={{ background: 'radial-gradient(ellipse, #FCB335 0%, #82403B 55%, transparent 70%)' }}
                aria-hidden
            />
            {/* Tekstur Grid Halus */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
                backgroundImage: 'repeating-linear-gradient(45deg, #561B1D 0, #561B1D 1px, transparent 0, transparent 50%)',
                backgroundSize: '20px 20px'
            }} />

            {/* 🌟 TOP NAVBAR GLOBAL (Konsisten dengan Profil) */}
            <nav className="sticky top-0 z-50 border-b border-brand-border bg-brand-bg-light/85 backdrop-blur-xl shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/profil" className="flex items-center gap-2 group focus-visible:outline-none">
                            <div className="w-7 h-7 rounded-md overflow-hidden flex items-center justify-center bg-gradient-to-br from-brand-gold to-brand-bronze shadow-sm group-hover:scale-105 transition-transform">
                                <img
                                    src="/logos/logo_BELOVESPORT.png"
                                    alt="Belovesport"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <span className="font-black text-sm tracking-widest uppercase text-brand-dark group-hover:text-brand-primary transition-colors">Belovesport</span>
                        </Link>
                        <span className="text-brand-muted/40 text-xs" aria-hidden>/</span>
                        <span className="text-brand-muted text-xs font-medium">Knockout Stage</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            aria-label="Notifikasi"
                            className="relative p-2 rounded-lg text-brand-muted hover:text-brand-dark hover:bg-brand-bg-surface transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50"
                        >
                            <Bell size={16} />
                            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-gold" aria-hidden />
                        </button>
                        <LogoutButtonParticipant />
                    </div>
                </div>
            </nav>

            {/* 🌟 SUB-HEADER HALAMAN SPESIFIK */}
            <div className="relative z-20 border-b border-brand-border pt-8 pb-6 bg-brand-bg-light/40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-5">
                    <div>
                        <div className="flex items-center gap-3 mb-3 justify-center md:justify-start">
                            <Link href="/profil"
                                className="p-2 rounded-xl transition-all group mr-2 bg-brand-bg-surface border border-brand-border hover:border-brand-gold shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50">
                                <ArrowLeft size={18} className="text-brand-secondary group-hover:text-brand-primary transition-colors" />
                            </Link>

                            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-gradient-brand shadow-brand">
                                <GitFork size={18} className="text-white" />
                            </div>

                            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight font-jetbrains text-brand-dark">
                                Knockout <span className="text-brand-primary">Stage</span>
                            </h1>
                        </div>
                        <p className="text-brand-muted text-xs text-center md:text-left flex items-center justify-center md:justify-start gap-1.5 font-medium">
                            <Trophy size={13} className="text-brand-gold shrink-0" />
                            Bagan Turnamen Resmi Belovesport. Total agregat 2 Leg menentukan kelolosan.
                        </p>
                    </div>

                    {/* INDIKATOR LIVE KONEKSI UTAMA */}
                    <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-black font-jetbrains tracking-widest shadow-sm border border-brand-primary/20 bg-brand-primary/5 text-brand-primary transition-all hover:scale-105 cursor-default shrink-0">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-60"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-primary"></span>
                        </span>
                        LIVE CONNECTED
                    </div>
                </div>
            </div>

            {/* AREA RENDER ENGINE BRACKET COMPONENT */}
            {/* 🚀 Menyerahkan proses sinkronisasi sepenuhnya ke internal BracketComponent bawaan Koko */}
            <div className="flex-1 relative z-10 w-full flex flex-col justify-start items-center">
                <BracketComponent />
            </div>

        </div>
    );
}