// Path: src/components/admin/PaymentVerification.tsx
'use client';

import { useState, useEffect } from 'react';
import { Check, XCircle, Search, Eye, Loader2, ChevronDown, ChevronUp, Image as ImageIcon } from 'lucide-react';

interface Registration {
    id: string;
    teamName: string;
    leaderName: string;
    email: string;
    whatsappNumber: string;
    efootballId: string;
    domisili: string;
    device: string;
    instagramHandle: string;
    paymentMethod: string;
    paymentProofUrl: string;
    status: string;
    createdAt: string;
}

export default function PaymentVerification() {
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // State untuk Accordion Detail
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    // State untuk Modal Gambar Bukti
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const fetchRegistrations = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/registrations');
            const data = await res.json();
            if (data.success) {
                // Filter hanya PENDING yang ditampilkan di antrean verifikasi
                const pendingList = data.data.filter((r: Registration) => r.status === 'PENDING');
                setRegistrations(pendingList);
            }
        } catch (error) {
            console.error('Gagal mengambil data pendaftar', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const handleUpdateStatus = async (id: string, action: 'approve' | 'reject') => {
        const actionText = action === 'approve' ? 'menyetujui' : 'menolak';
        if (!confirm(`Yakin ingin ${actionText} pendaftaran tim ini?`)) return;

        setIsProcessing(id);
        try {
            const res = await fetch(`/api/admin/registrations/${id}/${action}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await res.json();
            if (res.ok) {
                // Hapus baris dari antrean jika sukses
                setRegistrations(prev => prev.filter(r => r.id !== id));
                setExpandedRow(null);
                alert(`Sukses! Pendaftaran berhasil di-${action}.`);
            } else {
                alert(data.message || `Gagal ${actionText} pendaftaran.`);
            }
        } catch (error) {
            alert('Terjadi kesalahan koneksi ke server.');
        } finally {
            setIsProcessing(null);
        }
    };

    const toggleRow = (id: string) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    // Filter Pencarian Lokal
    const filteredRegistrations = registrations.filter(r =>
        r.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.leaderName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="pb-4 border-b border-brand-border">
                <h2 className="text-2xl font-black uppercase font-jetbrains text-brand-dark tracking-tight">
                    Modul A-02: <span className="text-brand-primary">Verifikasi Pembayaran</span>
                </h2>
                <p className="text-brand-muted text-sm mt-1">Review bukti transfer, verifikasi validitas peserta, dan amankan slot pendaftaran.</p>
            </div>

            <div className="bg-brand-bg-surface border border-brand-border rounded-3xl overflow-hidden shadow-sm">
                <div className="p-4 bg-brand-bg-light border-b border-brand-border flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h3 className="text-sm font-black font-jetbrains text-brand-dark uppercase tracking-wider">
                        Antrean Verifikasi ({registrations.length})
                    </h3>
                    <div className="relative w-full sm:w-72">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Cari Nama Tim / Kapten..."
                            className="w-full bg-white border border-brand-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-brand-dark focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    {isLoading ? (
                        <div className="flex flex-col justify-center items-center h-[300px] text-brand-primary gap-3">
                            <Loader2 className="animate-spin" size={32} />
                            <span className="text-xs font-bold font-jetbrains tracking-widest uppercase text-brand-muted">Memuat Data Antrean...</span>
                        </div>
                    ) : filteredRegistrations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[300px] text-brand-muted px-4 text-center">
                            <Check className="w-12 h-12 mb-3 text-emerald-400 opacity-50" />
                            <p className="text-sm font-semibold">Semua bersih, Ko!</p>
                            <p className="text-xs mt-1">Tidak ada antrean pendaftaran yang menunggu verifikasi saat ini.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {/* TABEL HEADER (DIV BASED UNTUK ACCORDION) */}
                            <div className="grid grid-cols-12 gap-4 bg-brand-bg-light p-4 text-[10px] font-black uppercase font-jetbrains text-brand-muted border-b border-brand-border">
                                <div className="col-span-1 text-center">Detail</div>
                                <div className="col-span-4">Klub / Tim</div>
                                <div className="col-span-3">Metode</div>
                                <div className="col-span-4 text-right">Aksi Verifikasi</div>
                            </div>

                            {/* BODY ROWS */}
                            {filteredRegistrations.map((reg) => (
                                <div key={reg.id} className="flex flex-col border-b border-brand-border bg-white hover:bg-slate-50 transition-colors">
                                    {/* BARIS UTAMA (Bisa Diklik) */}
                                    <div className="grid grid-cols-12 gap-4 p-4 items-center cursor-pointer" onClick={() => toggleRow(reg.id)}>
                                        <div className="col-span-1 flex justify-center text-brand-primary">
                                            {expandedRow === reg.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </div>
                                        <div className="col-span-4 flex flex-col">
                                            <span className="font-bold text-sm text-brand-dark">{reg.teamName}</span>
                                            <span className="text-xs text-brand-muted truncate mt-0.5">{reg.leaderName}</span>
                                        </div>
                                        <div className="col-span-3">
                                            <span className="inline-flex px-2 py-1 bg-slate-100 border border-slate-200 rounded text-[10px] font-bold font-jetbrains text-slate-600">
                                                {reg.paymentMethod || 'MANUAL'}
                                            </span>
                                        </div>
                                        <div className="col-span-4 flex justify-end gap-2" onClick={e => e.stopPropagation()}>
                                            <button
                                                disabled={isProcessing === reg.id}
                                                onClick={() => handleUpdateStatus(reg.id, 'approve')}
                                                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-black flex items-center gap-1.5 disabled:opacity-50 transition-all text-xs tracking-wider shadow-sm"
                                            >
                                                {isProcessing === reg.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} APPROVE
                                            </button>
                                            <button
                                                disabled={isProcessing === reg.id}
                                                onClick={() => handleUpdateStatus(reg.id, 'reject')}
                                                className="px-3 py-1.5 rounded-lg bg-white border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white font-black flex items-center gap-1.5 disabled:opacity-50 transition-all text-xs tracking-wider"
                                            >
                                                <XCircle size={14} /> REJECT
                                            </button>
                                        </div>
                                    </div>

                                    {/* BARIS DETAIL EXPANDABLE (MUNCUL JIKA DIKLIK) */}
                                    {expandedRow === reg.id && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 border-t border-dashed border-slate-200">

                                            {/* KOLOM KIRI: DATA LENGKAP */}
                                            <div className="space-y-4">
                                                <h4 className="text-xs font-black font-jetbrains text-brand-dark uppercase tracking-widest mb-3 border-b border-slate-200 pb-2">Informasi Peserta</h4>

                                                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                                                    <div>
                                                        <p className="text-[10px] text-brand-muted uppercase font-bold">Email</p>
                                                        <p className="font-medium text-brand-dark">{reg.email}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-brand-muted uppercase font-bold">WhatsApp</p>
                                                        <p className="font-medium text-brand-dark">{reg.whatsappNumber}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-brand-muted uppercase font-bold">Game ID</p>
                                                        <p className="font-mono text-brand-primary font-bold">{reg.efootballId}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-brand-muted uppercase font-bold">Instagram</p>
                                                        <p className="font-medium text-brand-dark">@{reg.instagramHandle}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-brand-muted uppercase font-bold">Domisili</p>
                                                        <p className="font-medium text-brand-dark">{reg.domisili}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-brand-muted uppercase font-bold">Device</p>
                                                        <p className="font-medium text-brand-dark uppercase">{reg.device}</p>
                                                    </div>
                                                </div>

                                                <p className="text-[10px] text-brand-muted pt-2 border-t border-slate-200">
                                                    Mendaftar pada: {new Date(reg.createdAt).toLocaleString('id-ID')}
                                                </p>
                                            </div>

                                            {/* KOLOM KANAN: BUKTI PEMBAYARAN */}
                                            <div className="space-y-3">
                                                <h4 className="text-xs font-black font-jetbrains text-brand-dark uppercase tracking-widest mb-3 border-b border-slate-200 pb-2 flex items-center justify-between">
                                                    Bukti Transfer
                                                    <span className="text-[9px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded border border-amber-200">
                                                        HARAP CEK MUTASI
                                                    </span>
                                                </h4>

                                                {reg.paymentProofUrl ? (
                                                    <div
                                                        className="relative group w-full h-48 bg-slate-200 rounded-xl overflow-hidden border border-slate-300 cursor-pointer shadow-sm"
                                                        onClick={() => setPreviewImage(reg.paymentProofUrl)}
                                                    >
                                                        <img
                                                            src={reg.paymentProofUrl}
                                                            alt="Bukti Transfer"
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Eye size={24} className="text-white mb-2" />
                                                            <span className="text-white text-xs font-bold font-jetbrains">KLIK UNTUK PERBESAR</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="w-full h-48 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-brand-muted">
                                                        <ImageIcon size={32} className="mb-2 opacity-50" />
                                                        <p className="text-xs font-semibold">Tidak Ada Bukti Gambar</p>
                                                    </div>
                                                )}
                                            </div>

                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL PREVIEW GAMBAR PENUH */}
            {previewImage && (
                <div
                    className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
                    onClick={() => setPreviewImage(null)}
                >
                    <div className="relative max-w-3xl w-full max-h-[90vh] flex flex-col items-center" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setPreviewImage(null)}
                            className="absolute -top-12 right-0 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                        >
                            <XCircle size={32} />
                        </button>
                        <img
                            src={previewImage}
                            alt="Bukti Transfer Penuh"
                            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}