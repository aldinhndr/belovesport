import Link from 'next/link';
import LogoutButton from '@/components/admin/LogoutButton';
import { LayoutDashboard, CheckSquare, Database, ShieldCheck } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-brand-primary/20">

            {/* 🌟 HEADER PREMIUM (GLASSMORPHISM) */}
            <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">

                <div className="flex items-center gap-8 lg:gap-12">
                    {/* LOGO & BRANDING */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary shadow-inner">
                            <ShieldCheck size={24} strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col leading-tight">
                            <span className="text-xl font-black tracking-tight text-slate-900 font-jetbrains uppercase">
                                Belove<span className="text-brand-primary">sport</span>
                            </span>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest font-jetbrains">
                                Command Center
                            </span>
                        </div>
                    </div>

                    {/* NAVIGASI MENU */}
                    <nav className="hidden md:flex items-center gap-2">
                        <Link
                            href="/admin/dashboard"
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold text-slate-600 hover:text-brand-primary hover:bg-brand-primary/5 transition-all group"
                        >
                            <LayoutDashboard size={18} className="text-slate-400 group-hover:text-brand-primary transition-colors" />
                            Dashboard
                        </Link>

                        <Link
                            href="/admin/dashboard/verifikasi"
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold text-slate-600 hover:text-brand-primary hover:bg-brand-primary/5 transition-all group"
                        >
                            <CheckSquare size={18} className="text-slate-400 group-hover:text-brand-primary transition-colors" />
                            Verifikasi
                        </Link>

                        <Link
                            href="/admin/dashboard/database"
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold text-slate-600 hover:text-brand-primary hover:bg-brand-primary/5 transition-all group"
                        >
                            <Database size={18} className="text-slate-400 group-hover:text-brand-primary transition-colors" />
                            Data Peserta
                        </Link>
                    </nav>
                </div>

                {/* INDIKATOR STATUS & LOGOUT */}
                <div className="flex items-center gap-4">
                    {/* Ping Indicator */}
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-600 text-[10px] font-black font-jetbrains uppercase tracking-widest cursor-default" title="Koneksi Database Stabil">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        System Online
                    </div>

                    <LogoutButton />
                </div>

            </header>

            {/* AREA KONTEN UTAMA */}
            <main className="p-6 md:p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
                {children}
            </main>

        </div>
    );
}