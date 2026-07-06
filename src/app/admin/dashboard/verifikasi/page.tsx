'use client';

import { useState, useEffect, useCallback } from 'react';
import RegistrationCard, { RegistrationItem } from '@/components/admin/RegistrationCard';

type StatusTab = 'PENDING' | 'APPROVED' | 'REJECTED';

export default function VerifikasiPembayaranPage() {
    const [activeTab, setActiveTab] = useState<StatusTab>('PENDING');
    const [registrations, setRegistrations] = useState<RegistrationItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // ── STATE UNTUK MODAL REJECT ──
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [selectedRejectId, setSelectedRejectId] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const fetchRegistrations = useCallback(async (status: StatusTab) => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/admin/registrations?status=${status}`);
            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.message ?? 'Gagal memuat data.');
            setRegistrations(data.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Terjadi kesalahan.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRegistrations(activeTab);
    }, [activeTab, fetchRegistrations]);

    const handleApprove = async (id: string) => {
        if (!window.confirm('Setujui pendaftaran ini? Voucher akan otomatis dibuat.')) return;
        try {
            const res = await fetch(`/api/admin/registrations/${id}/approve`, { method: 'POST' });
            const data = await res.json();
            if (!res.ok || !data.success) return alert(data.message ?? 'Gagal approve.');
            setRegistrations((prev) => prev.filter((r) => r.id !== id));
        } catch {
            alert('Tidak dapat terhubung ke server.');
        }
    };

    // ── BUKA MODAL REJECT (Alih-alih pakai window.prompt) ──
    const handleReject = (id: string) => {
        setSelectedRejectId(id);
        setRejectReason('');
        setIsRejectModalOpen(true);
    };

    // ── EKSEKUSI API REJECT ──
    const handleConfirmReject = async () => {
        if (!selectedRejectId || !rejectReason.trim()) return;
        setIsProcessing(true);

        try {
            const res = await fetch(`/api/admin/registrations/${selectedRejectId}/reject`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Pastikan key-nya "rejectionReason" sesuai dengan API route backend kita
                body: JSON.stringify({ rejectionReason: rejectReason }),
            });
            const data = await res.json();

            if (!res.ok || !data.success) {
                alert(data.message ?? 'Gagal reject.');
                return;
            }

            // Hapus kartu dari tampilan PENDING
            setRegistrations((prev) => prev.filter((r) => r.id !== selectedRejectId));
            setIsRejectModalOpen(false); // Tutup modal
        } catch {
            alert('Tidak dapat terhubung ke server.');
        } finally {
            setIsProcessing(false);
        }
    };

    const tabs: { key: StatusTab; label: string }[] = [
        { key: 'PENDING', label: 'Menunggu Verifikasi' },
        { key: 'APPROVED', label: 'Disetujui' },
        { key: 'REJECTED', label: 'Ditolak' },
    ];

    return (
        <div className="text-white p-6 md:p-10 relative">
            <h1 className="text-2xl font-bold mb-1">Verifikasi Pembayaran</h1>
            <p className="text-zinc-500 text-sm mb-6">Tinjau bukti transfer peserta, lalu setujui atau tolak.</p>

            <div className="flex gap-2 mb-6 border-b border-zinc-800">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-2 text-sm font-medium transition border-b-2 ${activeTab === tab.key ? 'border-amber-400 text-amber-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {isLoading && <p className="text-zinc-500">Memuat data...</p>}

            {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-4">
                    {error}
                </div>
            )}

            {!isLoading && !error && registrations.length === 0 && (
                <p className="text-zinc-500">Tidak ada data di kategori ini.</p>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {registrations.map((reg) => (
                    <RegistrationCard
                        key={reg.id}
                        data={reg}
                        onApprove={handleApprove}
                        onReject={handleReject} // Memanggil modal baru
                        onPreview={setPreviewUrl}
                    />
                ))}
            </div>

            {/* MODAL PREVIEW GAMBAR */}
            {previewUrl && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-40"
                    onClick={() => setPreviewUrl(null)}
                >
                    <img
                        src={previewUrl}
                        alt="Bukti transfer"
                        className="max-h-[90vh] max-w-full rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

            {/* MODAL POP-UP REJECT (ALASAN PENOLAKAN) */}
            {isRejectModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Latar Belakang Gelap (Overlay) */}
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={() => !isProcessing && setIsRejectModalOpen(false)}
                    />

                    {/* Kotak Modal */}
                    <div className="relative bg-[#13131a] border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl shadow-red-500/10 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">
                            Tolak Pendaftaran
                        </h3>
                        <p className="text-xs text-zinc-400 font-sans mb-5">
                            Silakan berikan alasan penolakan. Pesan ini akan dibaca langsung oleh peserta di Dasbor Profil mereka.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-jetbrains mb-1.5 block">
                                    Alasan Penolakan (Wajib)
                                </label>
                                <textarea
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    placeholder="Contoh: Bukti transfer buram/nominal kurang..."
                                    className="w-full bg-[#0a0a0f] border border-zinc-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all min-h-[100px] resize-none"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    onClick={() => setIsRejectModalOpen(false)}
                                    disabled={isProcessing}
                                    className="px-5 py-2.5 rounded-lg text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all disabled:opacity-50"
                                >
                                    BATAL
                                </button>
                                <button
                                    onClick={handleConfirmReject}
                                    disabled={isProcessing || !rejectReason.trim()}
                                    className="px-5 py-2.5 rounded-lg text-xs font-bold bg-red-500 hover:bg-red-600 text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
                                >
                                    {isProcessing ? 'MEMPROSES...' : 'KONFIRMASI TOLAK'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}