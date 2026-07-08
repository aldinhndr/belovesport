// Path: src/components/admin/RegistrationCard.tsx
'use client';

export interface RegistrationItem {
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
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    rejectionReason: string | null;
    createdAt: string;
}

interface RegistrationCardProps {
    data: RegistrationItem;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
    onPreview: (url: string) => void;
}

export default function RegistrationCard({ data, onApprove, onReject, onPreview }: RegistrationCardProps) {
    const formattedDate = new Date(data.createdAt).toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });

    return (
        <div className="bg-brand-bg-light border border-brand-border rounded-2xl p-5 shadow-sm hover:shadow-brand transition-all flex flex-col justify-between">
            {/* HEADER KARTU */}
            <div className="flex justify-between items-start mb-4 border-b border-brand-border pb-3">
                <div className="flex flex-col">
                    <h3 className="font-black text-brand-dark text-base uppercase tracking-tight">{data.teamName}</h3>
                    <p className="text-brand-muted text-[10px] font-jetbrains mt-0.5">{formattedDate}</p>
                </div>
                {data.paymentProofUrl ? (
                    <button
                        onClick={() => onPreview(data.paymentProofUrl)}
                        className="text-[9px] font-black font-jetbrains bg-brand-primary/10 hover:bg-brand-primary hover:text-white text-brand-primary px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all border border-brand-primary/20 shadow-sm shrink-0"
                    >
                        Lihat Bukti
                    </button>
                ) : (
                    <span className="text-[9px] font-black font-jetbrains bg-brand-bg-surface text-brand-muted px-3 py-1.5 rounded-lg uppercase tracking-wider border border-brand-border shrink-0">
                        Tanpa Bukti
                    </span>
                )}
            </div>

            {/* DETAIL PESERTA */}
            <dl className="text-sm space-y-2 mb-5">
                <div className="flex justify-between items-center py-1">
                    <dt className="text-[10px] text-brand-muted uppercase font-bold font-jetbrains">Kapten</dt>
                    <dd className="text-xs font-bold text-brand-dark text-right">{data.leaderName}</dd>
                </div>
                <div className="flex justify-between items-center py-1 border-t border-brand-bg-surface">
                    <dt className="text-[10px] text-brand-muted uppercase font-bold font-jetbrains">WhatsApp</dt>
                    <dd className="text-xs font-semibold text-brand-dark text-right">{data.whatsappNumber}</dd>
                </div>
                <div className="flex justify-between items-center py-1 border-t border-brand-bg-surface">
                    <dt className="text-[10px] text-brand-muted uppercase font-bold font-jetbrains">ID eFootball</dt>
                    <dd className="text-[11px] font-mono font-black text-brand-primary bg-brand-primary/5 px-2 py-0.5 rounded text-right">
                        {data.efootballId}
                    </dd>
                </div>
                <div className="flex justify-between items-center py-1 border-t border-brand-bg-surface">
                    <dt className="text-[10px] text-brand-muted uppercase font-bold font-jetbrains">Metode Bayar</dt>
                    <dd className="text-[10px] font-black text-brand-muted uppercase tracking-widest text-right">
                        {data.paymentMethod}
                    </dd>
                </div>
                <div className="flex justify-between items-center py-1 border-t border-brand-bg-surface">
                    <dt className="text-[10px] text-brand-muted uppercase font-bold font-jetbrains">Domisili</dt>
                    <dd className="text-xs font-semibold text-brand-dark text-right">{data.domisili}</dd>
                </div>
            </dl>

            {/* ALASAN PENOLAKAN (JIKA ADA) */}
            {data.status === 'REJECTED' && data.rejectionReason && (
                <p className="text-[11px] text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2 mb-4 font-medium leading-relaxed">
                    <span className="font-bold">Alasan Penolakan:</span> {data.rejectionReason}
                </p>
            )}

            {/* AREA AKSI / STATUS BAWAH */}
            <div className="mt-auto">
                {data.status === 'PENDING' && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => onApprove(data.id)}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black font-jetbrains uppercase tracking-widest rounded-xl py-2.5 transition-colors shadow-sm"
                        >
                            Setujui
                        </button>
                        <button
                            onClick={() => onReject(data.id)}
                            className="flex-1 bg-brand-bg-light border border-brand-primary text-brand-primary hover:bg-brand-primary/5 text-[11px] font-black font-jetbrains uppercase tracking-widest rounded-xl py-2.5 transition-all"
                        >
                            Tolak
                        </button>
                    </div>
                )}

                {data.status === 'APPROVED' && (
                    <div className="w-full text-center bg-emerald-50 border border-emerald-200 text-emerald-600 text-[11px] font-black font-jetbrains uppercase tracking-widest py-2.5 rounded-xl shadow-sm">
                        ✓ Slot Disetujui
                    </div>
                )}

                {data.status === 'REJECTED' && (
                    <div className="w-full text-center bg-red-50 border border-red-200 text-red-600 text-[11px] font-black font-jetbrains uppercase tracking-widest py-2.5 rounded-xl shadow-sm">
                        ✕ Ditolak
                    </div>
                )}
            </div>
        </div>
    );
}