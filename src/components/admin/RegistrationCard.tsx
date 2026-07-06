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
        <div className="bg-[#13131a] border border-zinc-800 rounded-xl p-5">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="font-semibold text-white">{data.teamName}</h3>
                    <p className="text-zinc-500 text-xs">{formattedDate}</p>
                </div>
                <button
                    onClick={() => onPreview(data.paymentProofUrl)}
                    className="text-xs bg-zinc-800 hover:bg-zinc-700 px-3 py-1 rounded-md text-zinc-300 transition"
                >
                    Lihat Bukti
                </button>
            </div>

            <dl className="text-sm space-y-1 mb-4 text-zinc-400">
                <div className="flex justify-between"><dt>Kapten</dt><dd className="text-zinc-200">{data.leaderName}</dd></div>
                <div className="flex justify-between"><dt>WhatsApp</dt><dd className="text-zinc-200">{data.whatsappNumber}</dd></div>
                <div className="flex justify-between"><dt>ID eFootball</dt><dd className="text-zinc-200">{data.efootballId}</dd></div>
                <div className="flex justify-between"><dt>Metode Bayar</dt><dd className="text-zinc-200">{data.paymentMethod}</dd></div>
                <div className="flex justify-between"><dt>Domisili</dt><dd className="text-zinc-200">{data.domisili}</dd></div>
            </dl>

            {data.status === 'REJECTED' && data.rejectionReason && (
                <p className="text-xs text-red-400 bg-red-500/10 rounded-md px-3 py-2 mb-3">
                    Alasan: {data.rejectionReason}
                </p>
            )}

            {data.status === 'PENDING' && (
                <div className="flex gap-2">
                    <button
                        onClick={() => onApprove(data.id)}
                        className="flex-1 bg-amber-400 hover:bg-amber-300 text-black text-sm font-semibold rounded-lg py-2 transition"
                    >
                        Setujui
                    </button>
                    <button
                        onClick={() => onReject(data.id)}
                        className="flex-1 bg-zinc-800 hover:bg-red-500/20 hover:text-red-400 text-zinc-300 text-sm font-semibold rounded-lg py-2 transition"
                    >
                        Tolak
                    </button>
                </div>
            )}

            {data.status === 'APPROVED' && (
                <span className="inline-block text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full">
                    ✓ Disetujui
                </span>
            )}
        </div>
    );
}