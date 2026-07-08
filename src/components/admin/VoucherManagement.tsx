// Path: src/components/admin/VoucherManagement.tsx
'use client';

import { useState, useEffect } from 'react';
import { Ticket, Search, Tag, Loader2 } from 'lucide-react';

interface Voucher {
    id: string;
    voucherCode: string;
    isUsed: boolean;
    registration: { teamName: string; leaderName: string } | null;
}

export default function VoucherManagement() {
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchVouchers = async () => {
        try {
            const res = await fetch('/api/admin/vouchers');
            const data = await res.json();
            if (data.success) setVouchers(data.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchVouchers(); }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* HEADER MODUL */}
            <div className="pb-4 border-b border-brand-border">
                <h2 className="text-2xl font-black uppercase font-jetbrains text-brand-dark tracking-tight">
                    Modul A-05: <span className="text-brand-primary">Manajemen Voucher</span>
                </h2>
                <p className="text-brand-muted text-sm mt-1">Pantau status penukaran dan klaim voucher sirkuit oleh tim.</p>
            </div>

            {/* TABEL KONTROL UTAMA */}
            <div className="bg-brand-bg-light border border-brand-border rounded-3xl overflow-hidden shadow-sm">

                {/* TOOLBAR ATAS */}
                <div className="p-4 bg-brand-bg-surface/60 border-b border-brand-border flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div className="flex items-center gap-2 text-brand-primary">
                        <Ticket size={18} />
                        <h3 className="text-sm font-black font-jetbrains uppercase tracking-wider">
                            Daftar Klaim Voucher
                        </h3>
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar min-h-[300px]">
                    {isLoading ? (
                        <div className="flex flex-col justify-center items-center py-20 text-brand-primary gap-3">
                            <Loader2 className="animate-spin" size={32} />
                            <span className="font-jetbrains text-xs font-bold uppercase text-brand-muted tracking-wider">Memuat Data Voucher...</span>
                        </div>
                    ) : vouchers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-brand-muted px-4 text-center">
                            <Ticket className="w-12 h-12 mb-3 opacity-20 text-brand-primary animate-pulse-slow" />
                            <p className="text-sm font-black text-brand-dark">Tidak Ada Voucher</p>
                            <p className="text-xs mt-1 font-medium">Belum ada data kupon/voucher yang diterbitkan di dalam sistem.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse min-w-[700px]">
                            <thead>
                                <tr className="bg-brand-bg-surface text-[10px] uppercase font-jetbrains text-brand-muted border-b border-brand-border tracking-wider">
                                    <th className="p-4 font-black">Kode Voucher</th>
                                    <th className="p-4 font-black">Diberikan Kepada Tim</th>
                                    <th className="p-4 text-center font-black">Status Pemakaian</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm font-medium bg-brand-bg-light">
                                {vouchers.map((v) => (
                                    <tr key={v.id} className="border-b border-brand-border hover:bg-brand-bg-surface/50 transition-colors group">

                                        {/* KOLOM 1: KODE VOUCHER */}
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-brand-primary/5 border border-brand-primary/10 flex items-center justify-center shrink-0">
                                                    <Tag size={14} className="text-brand-primary" />
                                                </div>
                                                <span className="font-mono font-black text-brand-dark group-hover:text-brand-primary transition-colors text-[13px] tracking-widest bg-white shadow-sm px-3 py-1 rounded-md border border-brand-border">
                                                    {v.voucherCode}
                                                </span>
                                            </div>
                                        </td>

                                        {/* KOLOM 2: NAMA TIM */}
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <span className={`font-bold ${v.registration?.teamName ? 'text-brand-dark' : 'text-brand-muted italic'}`}>
                                                    {v.registration?.teamName || 'Global Voucher'}
                                                </span>
                                                {v.registration?.leaderName && (
                                                    <span className="text-xs text-brand-muted/70">({v.registration.leaderName})</span>
                                                )}
                                                {!v.registration && (
                                                    <span className="text-xs text-brand-muted/70">(Belum Diklaim)</span>
                                                )}
                                            </div>
                                        </td>

                                        {/* KOLOM 3: STATUS VOUCHER */}
                                        <td className="p-4 text-center">
                                            <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm font-jetbrains inline-block ${v.isUsed
                                                ? 'bg-slate-100 text-slate-500 border border-slate-200'
                                                : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                                }`}>
                                                {v.isUsed ? 'TERPAKAI' : 'AKTIF / TERSEDIA'}
                                            </span>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}