'use client';

import { useState, useEffect } from 'react';
import { Ticket, Search, Tag, Loader2 } from 'lucide-react';

interface Voucher {
    id: string;
    voucherCode: string;
    isUsed: boolean;
    registration: { teamName: string } | null;
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
            <div>
                <h2 className="text-2xl font-black uppercase font-jetbrains text-brand-white tracking-tight">
                    Modul A-05: <span className="text-brand-gold">Manajemen Voucher</span>
                </h2>
                <p className="text-brand-bronze text-sm mt-1">Pantau status penukaran dan klaim voucher sirkuit oleh tim.</p>
            </div>

            <div className="bg-brand-bg-surface border border-brand-secondary/40 rounded-2xl overflow-hidden shadow-brand-lg">
                <div className="p-4 bg-black/20 border-b border-brand-secondary/40 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div className="flex items-center gap-2 text-brand-gold">
                        <Ticket size={16} />
                        <h3 className="text-sm font-black font-jetbrains uppercase tracking-wider">Daftar Klaim Voucher</h3>
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    {isLoading ? (
                        <div className="flex justify-center py-12 text-brand-gold"><Loader2 className="animate-spin" /></div>
                    ) : (
                        <table className="w-full text-left border-collapse min-w-[700px]">
                            <thead>
                                <tr className="bg-brand-bg-dark/50 text-[10px] uppercase font-jetbrains text-brand-bronze border-b border-brand-secondary/40">
                                    <th className="p-4">Kode Voucher</th>
                                    <th className="p-4">Diberikan Kepada Tim</th>
                                    <th className="p-4 text-center">Status Pemakaian</th>
                                </tr>
                            </thead>
                            <tbody className="text-xs font-semibold">
                                {vouchers.map((v) => (
                                    <tr key={v.id} className="border-b border-brand-secondary/20 hover:bg-brand-bg-dark/30 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <Tag size={14} className="text-brand-secondary" />
                                                <span className="font-mono font-black text-brand-gold text-sm tracking-wider">{v.voucherCode}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-brand-white">{v.registration?.teamName || 'Global Voucher'}</td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-wider ${v.isUsed ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary/40' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                                                {v.isUsed ? 'TERPAKAI' : 'BELUM DIPAKAI'}
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