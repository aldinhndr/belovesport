// Path: src/components/admin/ParticipantDatabase.tsx
'use client';

import { useState, useEffect } from 'react';
import { Users, Download, Search, Filter, Mail, Phone, Loader2, Gamepad2, MapPin, Instagram } from 'lucide-react';

interface Voucher {
    id: string;
    voucherCode: string;
    isUsed: boolean;
}

interface ParticipantData {
    id: string;
    teamName: string;
    leaderName: string;
    email: string;
    whatsappNumber: string;
    efootballId: string;
    domisili: string;
    device: string;
    instagramHandle: string;
    status: string;
    createdAt: string;
    vouchers: Voucher[];

    // HANYA FIELD PROFIL USER
    participant?: {
        profilePictureUrl?: string;
        username: string;
    };
}

export default function ParticipantDatabase() {
    const [participants, setParticipants] = useState<ParticipantData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');

    const fetchParticipants = async () => {
        setIsLoading(true);
        try {
            let url = '/api/admin/registrations';
            const params = new URLSearchParams();

            if (statusFilter !== 'ALL') {
                params.append('status', statusFilter);
            }
            if (searchTerm.trim() !== '') {
                params.append('search', searchTerm.trim());
            }

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const res = await fetch(url);
            const data = await res.json();
            if (data.success) {
                setParticipants(data.data || []);
            }
        } catch (error) {
            console.error('Gagal mengambil database peserta:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchParticipants();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, statusFilter]);

    const handleExportCSV = () => {
        if (participants.length === 0) {
            alert('Tidak ada data peserta untuk di-export, Ko.');
            return;
        }

        const headers = ['ID Pendaftaran', 'Nama Tim', 'Kapten/Manajer', 'Email', 'WhatsApp', 'Instagram', 'eFootball ID', 'Domisili', 'Device', 'Status Pendaftaran', 'Tanggal Regis'];

        const rows = participants.map(p => [
            p.id,
            `"${p.teamName.replace(/"/g, '""')}"`,
            `"${p.leaderName.replace(/"/g, '""')}"`,
            p.email,
            `'${p.whatsappNumber}`,
            `"@${p.instagramHandle}"`,
            p.efootballId,
            `"${p.domisili.replace(/"/g, '""')}"`,
            p.device,
            p.status,
            new Date(p.createdAt).toLocaleDateString('id-ID')
        ]);

        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `DATABASE_PESERTA_BELOVESPORT_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* MODUL HEADER */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-brand-border">
                <div>
                    <h2 className="text-2xl font-black uppercase font-jetbrains text-brand-dark tracking-tight">
                        Modul A-06: <span className="text-brand-primary">Database Peserta</span>
                    </h2>
                    <p className="text-brand-muted text-sm mt-1">Buku besar digital data registrasi tim, kontak, visual profil pemain, dan ekspor data.</p>
                </div>
                <button
                    onClick={handleExportCSV}
                    className="bg-brand-bg-light border-2 border-brand-primary hover:bg-brand-primary hover:text-white text-brand-primary font-black font-jetbrains py-2.5 px-5 rounded-xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shrink-0 shadow-sm focus:ring-4 focus:ring-brand-primary/20"
                >
                    <Download size={16} /> EXPORT CSV / EXCEL
                </button>
            </div>

            {/* STRUKTUR FILTER & SEARCH */}
            <div className="bg-brand-bg-surface border border-brand-border rounded-3xl overflow-hidden shadow-sm">
                <div className="p-4 bg-brand-bg-light border-b border-brand-border flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto custom-scrollbar pb-2 md:pb-0">
                        <div className="flex items-center gap-1.5 text-xs font-black uppercase font-jetbrains text-brand-muted pr-3 border-r border-slate-300">
                            <Filter size={16} />
                        </div>
                        {[
                            { id: 'ALL', label: 'Semua Data' },
                            { id: 'APPROVED', label: 'Slot Aman' },
                            { id: 'PENDING', label: 'Belum Dicek' },
                            { id: 'REJECTED', label: 'Ditolak' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setStatusFilter(tab.id)}
                                className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all border ${statusFilter === tab.id ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/30 shadow-sm' : 'bg-transparent border-transparent text-slate-500 hover:text-brand-dark hover:bg-slate-100'}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Cari ID, Tim, Kapten, IGN..."
                            className="w-full bg-white border border-brand-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-brand-dark focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all shadow-inner"
                        />
                    </div>
                </div>

                {/* TABEL DATA UTAMA */}
                <div className="overflow-x-auto custom-scrollbar min-h-[400px]">
                    {isLoading ? (
                        <div className="flex flex-col justify-center items-center py-32 text-brand-primary gap-3">
                            <Loader2 className="animate-spin" size={32} />
                            <span className="font-jetbrains text-xs font-bold uppercase text-brand-muted tracking-wider">Menarik Lembar Data Riil...</span>
                        </div>
                    ) : participants.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-32 text-brand-muted px-4 text-center">
                            <Users className="w-12 h-12 mb-3 opacity-20 text-brand-primary" />
                            <p className="text-sm font-semibold">Tidak Ada Peserta Ditemukan</p>
                            <p className="text-xs mt-1">Coba sesuaikan filter status atau kata kunci pencarian Koko.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse min-w-[1250px]">
                            <thead>
                                <tr className="bg-brand-bg-light text-[10px] uppercase font-jetbrains text-brand-muted border-b border-brand-border">
                                    <th className="p-4">Klub / Skuad</th>
                                    <th className="p-4">Kapten / Akun User</th>
                                    <th className="p-4">Platform & Game ID</th>
                                    <th className="p-4">Kontak Info</th>
                                    <th className="p-4 text-center">Tgl. Daftar</th>
                                    <th className="p-4 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm font-medium bg-white">
                                {participants.map((p) => (
                                    <tr key={p.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors group">

                                        {/* KOLOM 1: NAMA TIM MURNI */}
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-brand-dark text-[15px]">{p.teamName}</span>
                                                <span className="text-[10px] text-brand-muted font-mono truncate max-w-[180px]" title={p.id}>UID: {p.id.split('-')[0]}...</span>
                                            </div>
                                        </td>

                                        {/* KOLOM 2: PROFIL USER (FOTO USER + NAMA) */}
                                        <td className="p-4 text-slate-700 align-middle">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center shrink-0 overflow-hidden">
                                                    {p.participant?.profilePictureUrl ? (
                                                        <img src={p.participant.profilePictureUrl} alt={`User ${p.leaderName}`} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="font-black text-brand-primary text-[10px] font-jetbrains uppercase">
                                                            {p.leaderName.substring(0, 2)}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-[13px]">{p.leaderName}</span>
                                                    <span className="text-[10px] text-brand-muted flex items-center gap-1 mt-0.5"><MapPin size={10} /> {p.domisili}</span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* KOLOM 3: GAME ID */}
                                        <td className="p-4 align-middle">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-mono text-brand-primary font-bold text-xs flex items-center gap-1.5"><Gamepad2 size={12} className="text-slate-400" /> {p.efootballId}</span>
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 border border-slate-200 px-2 py-0.5 rounded w-fit">{p.device}</span>
                                            </div>
                                        </td>

                                        {/* KOLOM 4: KONTAK */}
                                        <td className="p-4 align-middle">
                                            <div className="flex flex-col gap-1.5 text-xs text-slate-600">
                                                <span className="flex items-center gap-2 font-mono hover:text-brand-primary cursor-pointer"><Phone size={12} className="text-brand-muted" /> {p.whatsappNumber}</span>
                                                <span className="flex items-center gap-2 hover:text-brand-primary cursor-pointer"><Instagram size={12} className="text-brand-muted" /> @{p.instagramHandle}</span>
                                                <span className="flex items-center gap-2 truncate max-w-[150px]" title={p.email}><Mail size={12} className="text-brand-muted shrink-0" /> {p.email}</span>
                                            </div>
                                        </td>

                                        {/* KOLOM 5: TANGGAL */}
                                        <td className="p-4 text-center font-jetbrains text-slate-500 align-middle text-xs">
                                            {new Date(p.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>

                                        {/* KOLOM 6: STATUS */}
                                        <td className="p-4 text-center align-middle">
                                            <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm ${p.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' :
                                                    p.status === 'REJECTED' ? 'bg-red-100 text-red-600 border border-red-200' :
                                                        'bg-amber-100 text-amber-600 border border-amber-200'
                                                }`}>
                                                {p.status}
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