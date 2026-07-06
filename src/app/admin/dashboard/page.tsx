// Path: src/app/admin/dashboard/page.tsx
'use client';

import { useState } from 'react';
import { LayoutDashboard, Receipt, GitFork, Swords, Ticket, Users, ShieldCheck, LogOut } from 'lucide-react';

// IMPORT KOMPONEN MODUL KITA
import DashboardOverview from '@/components/admin/DashboardOverview';
import PaymentVerification from '@/components/admin/PaymentVerification';
import BracketManagement from '@/components/admin/BracketManagement';
import MatchMonitoring from '@/components/admin/MatchMonitoring';
import VoucherManagement from '@/components/admin/VoucherManagement';
import ParticipantDatabase from '@/components/admin/ParticipantDatabase';

export default function AdminMasterDashboard() {
    // STATE PENGENDALI MODUL AKTIF
    const [activeModule, setActiveModule] = useState('A-01');

    // Daftar Modul Dinamis
    const menuItems = [
        { id: 'A-01', name: 'Dashboard Utama', icon: <LayoutDashboard size={18} /> },
        { id: 'A-02', name: 'Verifikasi Pembayaran', icon: <Receipt size={18} /> },
        { id: 'A-03', name: 'Kelola Bracket', icon: <GitFork size={18} /> },
        { id: 'A-04', name: 'Monitoring Match', icon: <Swords size={18} /> },
        { id: 'A-05', name: 'Manajemen Voucher', icon: <Ticket size={18} /> },
        { id: 'A-06', name: 'Database Peserta', icon: <Users size={18} /> },
    ];

    // ENGINE RENDERER KOMPONEN
    const renderActiveModule = () => {
        switch (activeModule) {
            case 'A-01': return <DashboardOverview />;
            case 'A-02': return <PaymentVerification />;
            case 'A-03': return <BracketManagement />;
            case 'A-04': return <MatchMonitoring />;
            case 'A-05': return <VoucherManagement />;
            case 'A-06': return <ParticipantDatabase />;

            // Modul A-03, A-04 dst tinggal ditambahkan di sini nanti
            default: return (
                <div className="flex flex-col items-center justify-center h-[50vh] text-brand-secondary border border-dashed border-brand-secondary/40 rounded-3xl">
                    <h3 className="font-jetbrains font-black uppercase text-xl">Modul Dalam Pengembangan</h3>
                </div>
            );
        }
    };

    return (
        <div className="min-h-screen bg-brand-bg-dark text-brand-white font-sans flex overflow-hidden">

            {/* AMBIENT BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.02]" style={{
                backgroundImage: 'repeating-linear-gradient(45deg, #FCB335 0, #FCB335 1px, transparent 0, transparent 50%)',
                backgroundSize: '20px 20px'
            }} />

            {/* SIDEBAR NAVIGATION KIRI */}
            <aside className="w-64 bg-brand-bg-surface border-r border-brand-secondary/40 flex flex-col relative z-20">
                <div className="h-16 flex items-center px-6 border-b border-brand-secondary/40 gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center shadow-brand">
                        <ShieldCheck size={16} className="text-brand-bg-dark" />
                    </div>
                    <span className="font-black font-jetbrains tracking-wider uppercase text-brand-gold text-sm">BeloveAdmin</span>
                </div>

                <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto custom-scrollbar">
                    <p className="px-3 text-[10px] font-black font-jetbrains tracking-widest text-brand-bronze mb-3">MUST HAVE (CORE)</p>
                    {menuItems.map((item) => {
                        const isActive = activeModule === item.id;
                        return (
                            <button key={item.id} onClick={() => setActiveModule(item.id)}
                                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all font-medium text-sm text-left ${isActive ? 'bg-brand-gold/10 text-brand-gold border border-brand-gold/20 shadow-brand' : 'text-zinc-400 hover:text-brand-white hover:bg-brand-secondary/20'}`}>
                                <span className={isActive ? 'text-brand-gold' : 'text-brand-secondary'}>{item.icon}</span>
                                {item.name}
                            </button>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-brand-secondary/40">
                    <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-brand-primary border border-brand-secondary/40 hover:bg-brand-primary hover:text-white transition-all text-sm font-bold uppercase tracking-wider">
                        <LogOut size={16} /> Keluar
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT KANAN (Tempat Komponen Di-render) */}
            <main className="flex-1 flex flex-col relative z-20 h-screen overflow-hidden">
                <header className="h-16 flex items-center px-8 border-b border-brand-secondary/40 bg-brand-bg-dark/80 backdrop-blur-md">
                    <span className="font-black font-jetbrains tracking-wider text-brand-gold">HQ CONTROL CENTER</span>
                </header>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        {renderActiveModule()}
                    </div>
                </div>
            </main>
        </div>
    );
}