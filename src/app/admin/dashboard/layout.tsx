// Path: src/app/admin/layout.tsx
'use client';

import { useState } from 'react';
import LogoutButton from '@/components/admin/LogoutButton';
import {
    LayoutDashboard,
    Receipt,
    GitFork,
    Swords,
    Ticket,
    Users,
    ShieldCheck,
    Clock, X
} from 'lucide-react';

// IMPORT KOMPONEN MODUL MASTER
import DashboardOverview from '@/components/admin/DashboardOverview';
import PaymentVerification from '@/components/admin/PaymentVerification';
import BracketManagement from '@/components/admin/BracketManagement';
import MatchMonitoring from '@/components/admin/MatchMonitoring';
import VoucherManagement from '@/components/admin/VoucherManagement';
import ParticipantDatabase from '@/components/admin/ParticipantDatabase';
import GroupManagement from '@/components/admin/GroupManagement';
import MatchScheduling from '@/components/admin/MatchScheduling';

export default function DashboardLayout() {
    // ⚙️ STATE PENGENDALI MODUL AKTIF (Pusat Kendali Aplikasi)
    const [activeModule, setActiveModule] = useState('A-01');

    // Daftar Modul Dinamis yang diselaraskan dengan Palet Warna Brand
    const menuItems = [
        { id: 'A-01', name: 'Dashboard Utama', icon: <LayoutDashboard size={18} /> },
        { id: 'A-02', name: 'Verifikasi Pembayaran', icon: <Receipt size={18} /> },
        { id: 'A-03', name: 'Kelola Bracket', icon: <GitFork size={18} /> },
        { id: 'A-04', name: 'Monitoring Match', icon: <Swords size={18} /> },
        { id: 'A-05', name: 'Manajemen Voucher', icon: <Ticket size={18} /> },
        { id: 'A-06', name: 'Database Peserta', icon: <Users size={18} /> },
        { id: 'A-07', name: 'Kelola Grup', icon: <GitFork size={18} /> },
        { id: 'A-08', name: 'Penjadwalan Match', icon: <Clock size={18} /> },
    ];

    // ENGINE RENDERER KOMPONEN MODUL
    const renderActiveModule = () => {
        switch (activeModule) {
            case 'A-01': return <DashboardOverview />;
            case 'A-02': return <PaymentVerification />;
            case 'A-03': return <BracketManagement />;
            case 'A-04': return <MatchMonitoring />;
            case 'A-05': return <VoucherManagement />;
            case 'A-06': return <ParticipantDatabase />;
            case 'A-07': return <GroupManagement />;
            case 'A-08': return <MatchScheduling />;
            default:
                return (
                    <div className="flex flex-col items-center justify-center h-[50vh] text-brand-secondary border border-dashed border-brand-secondary/40 rounded-3xl">
                        <h3 className="font-jetbrains font-black uppercase text-xl text-brand-secondary">
                            Modul Dalam Pengembangan
                        </h3>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-brand-bg-surface font-sans text-brand-dark selection:bg-brand-primary/10 flex flex-col md:flex-row overflow-hidden">

            {/* AMBIENT BACKGROUND AKSEN EMAS (Dari Kode Asli Koko) */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.015]" style={{
                backgroundImage: 'repeating-linear-gradient(45deg, #FCB335 0, #FCB335 1px, transparent 0, transparent 50%)',
                backgroundSize: '20px 20px'
            }} />

            {/* 📱 NAVIGATION UNTUK MOBILE (BOTTOM BAR - RESPONSIVE) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-brand-border px-2 py-2 flex justify-around items-center shadow-xl">
                {menuItems.slice(0, 4).map((item) => {
                    const isActive = activeModule === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveModule(item.id)}
                            className={`flex flex-col items-center gap-0.5 p-2 transition-all ${isActive ? 'text-brand-primary font-black' : 'text-brand-muted font-medium'}`}
                        >
                            {item.icon}
                            <span className="text-[9px] font-sans">{item.name.split(' ')[0]}</span>
                        </button>
                    );
                })}
                <LogoutButton />
            </div>

            {/* 💻 SIDEBAR PREMIUM UNTUK DESKTOP */}
            <aside className="hidden md:flex w-72 bg-white border-r border-brand-border flex-col justify-between p-6 sticky top-0 h-screen z-40 shadow-sm">

                <div className="space-y-8 flex-1 flex flex-col overflow-hidden">
                    {/* LOGO & BRANDING COMMAND CENTER */}
                    <div className="flex items-center gap-3 p-2 bg-brand-bg-surface rounded-2xl border border-brand-border/60 shrink-0">
                        <div className="w-11 h-11 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary shadow-inner">
                            <ShieldCheck size={26} strokeWidth={2.5} className="animate-pulse-slow" />
                        </div>
                        <div className="flex flex-col leading-tight">
                            <span className="text-lg font-black tracking-tight text-brand-dark font-jetbrains uppercase">
                                Belove<span className="text-brand-primary">sport</span>
                            </span>
                            <span className="text-[10px] text-brand-muted font-bold uppercase tracking-widest font-jetbrains">
                                Command Center
                            </span>
                        </div>
                    </div>

                    {/* MENU UTAMA SIDEBAR (SCROLLABLE JIKA MENU PENUH) */}
                    <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                        <span className="px-3 text-[10px] font-black text-brand-bronze font-jetbrains tracking-widest uppercase block mb-3">
                            CORE MANAGEMENT
                        </span>

                        {menuItems.map((item) => {
                            const isActive = activeModule === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveModule(item.id)}
                                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all text-[13px] font-bold border ${isActive
                                        ? 'bg-brand-primary/5 text-brand-primary border-brand-primary/10 shadow-sm'
                                        : 'text-brand-muted hover:text-brand-primary hover:bg-brand-primary/5 border-transparent'
                                        }`}
                                >
                                    <span className={isActive ? 'text-brand-primary' : 'text-brand-muted'}>
                                        {item.icon}
                                    </span>
                                    {item.name}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* AREA INDIKATOR STATUS & LOGOUT */}
                <div className="space-y-4 pt-4 border-t border-brand-border shrink-0 bg-white">
                    {/* Database Ping Indicator Premium */}
                    <div className="flex items-center gap-2.5 px-3 py-2.5 bg-emerald-50/60 border border-emerald-100 rounded-xl text-emerald-700 text-[11px] font-black font-jetbrains uppercase tracking-widest cursor-default shadow-sm">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                        HQ SYSTEM ONLINE
                    </div>

                    {/* IDENTITAS SUPER ADMIN */}
                    <div className="flex items-center justify-between gap-2 bg-brand-bg-surface p-2 rounded-xl border border-brand-border">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-brand-gold flex items-center justify-center text-white text-xs font-black font-jetbrains shadow-brand">
                                A
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[11px] font-black text-brand-dark">Ko Aldin</span>
                                <span className="text-[9px] font-bold text-brand-gold uppercase font-jetbrains tracking-wider">Super Admin</span>
                            </div>
                        </div>
                        <LogoutButton />
                    </div>
                </div>

            </aside>

            {/* 📱 HEADER RINGKAS UNTUK MOBILE */}
            <header className="md:hidden sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-brand-border px-5 py-4 flex items-center justify-between shadow-sm">
                <span className="text-base font-black tracking-tight text-brand-dark font-jetbrains uppercase">
                    Belove<span className="text-brand-primary">sport</span>
                </span>
                <span className="text-[10px] font-bold font-jetbrains text-brand-gold uppercase tracking-wider bg-brand-primary/5 px-2.5 py-1 rounded-md border border-brand-primary/10">
                    HQ CONTROL
                </span>
            </header>

            {/* 🎛️ AREA KONTEN DINAMIS YANG RESPONSIF */}
            <main className="flex-1 p-5 md:p-10 max-w-[1600px] mx-auto w-full mb-20 md:mb-0 overflow-y-auto h-screen content-scrollbar animate-in fade-in duration-500">
                {renderActiveModule()}
            </main>

        </div>
    );
}