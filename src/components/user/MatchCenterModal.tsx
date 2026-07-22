// Path: src/components/user/MatchCenterModal.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { X, MessageSquare, Swords, Upload, Send, Loader2, Info, CheckCircle2, ImageIcon, XCircle } from 'lucide-react';

// TODO(Ko): Pastikan client Supabase browser sudah ada di path ini.
// Kalau nama file/exportnya beda, sesuaikan import berikut.
// import { supabase } from '@/lib/supabase/client';

// TODO(Ko): Ganti dengan nama bucket Supabase Storage yang sebenarnya dipakai
// untuk paymentProofUrl/profilePictureUrl agar konsisten dengan bucket yang sudah ada.
const MATCH_PROOF_BUCKET = 'match-proofs';

interface MatchCenterModalProps {
    matchId: string;
    onClose: () => void;
    onSuccess: () => void;
}

interface MatchDetails {
    id: string;
    stage: string;
    matchNumber: number;
    homeTeam: { teamName: string; leaderName: string };
    awayTeam: { teamName: string; leaderName: string };
    status: string;
}

interface ChatMessage {
    id: string;
    senderName: string;
    message: string;
    createdAt: string;
    isMe: boolean;
}

export default function MatchCenterModal({ matchId, onClose, onSuccess }: MatchCenterModalProps) {
    const [activeTab, setActiveTab] = useState<'SCORE' | 'CHAT'>('SCORE');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [matchDetails, setMatchDetails] = useState<MatchDetails | null>(null);

    // State Form Skor
    const [scoreData, setScoreData] = useState({
        homeScoreLeg1: '',
        awayScoreLeg1: '',
        homeScoreLeg2: '',
        awayScoreLeg2: '',
        screenshotUrlLeg1: '',
        screenshotUrlLeg2: ''
    });

    // State Upload Bukti Screenshot — terpisah per leg, karena knockout = 2 pertandingan terpisah
    type LegKey = 'leg1' | 'leg2';
    const [proofFiles, setProofFiles] = useState<Record<LegKey, File | null>>({ leg1: null, leg2: null });
    const [proofPreviewUrls, setProofPreviewUrls] = useState<Record<LegKey, string | null>>({ leg1: null, leg2: null });
    const [isUploadingProof, setIsUploadingProof] = useState<Record<LegKey, boolean>>({ leg1: false, leg2: false });
    const [isDraggingProof, setIsDraggingProof] = useState<Record<LegKey, boolean>>({ leg1: false, leg2: false });
    const fileInputRefs = {
        leg1: useRef<HTMLInputElement>(null),
        leg2: useRef<HTMLInputElement>(null),
    };

    // State Chat
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    const isGroupStage = matchDetails?.stage === 'GROUP';

    const MAX_PROOF_SIZE_MB = 5;
    const ACCEPTED_PROOF_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

    const handleProofFile = (leg: LegKey, file: File | null) => {
        if (!file) return;
        if (!ACCEPTED_PROOF_TYPES.includes(file.type)) {
            alert('Format file harus JPG atau PNG.');
            return;
        }
        if (file.size > MAX_PROOF_SIZE_MB * 1024 * 1024) {
            alert(`Ukuran file maksimal ${MAX_PROOF_SIZE_MB}MB.`);
            return;
        }
        setProofFiles(prev => ({ ...prev, [leg]: file }));
        setProofPreviewUrls(prev => ({ ...prev, [leg]: URL.createObjectURL(file) }));
        // Reset URL lama kalau sebelumnya ada hasil upload untuk leg ini
        setScoreData(prev => ({ ...prev, [leg === 'leg1' ? 'screenshotUrlLeg1' : 'screenshotUrlLeg2']: '' }));
    };

    const handleRemoveProof = (leg: LegKey) => {
        setProofFiles(prev => ({ ...prev, [leg]: null }));
        setProofPreviewUrls(prev => {
            if (prev[leg]) URL.revokeObjectURL(prev[leg] as string);
            return { ...prev, [leg]: null };
        });
        setScoreData(prev => ({ ...prev, [leg === 'leg1' ? 'screenshotUrlLeg1' : 'screenshotUrlLeg2']: '' }));
        if (fileInputRefs[leg].current) fileInputRefs[leg].current!.value = '';
    };

    const handleDrop = (leg: LegKey) => (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggingProof(prev => ({ ...prev, [leg]: false }));
        const file = e.dataTransfer.files?.[0];
        if (file) handleProofFile(leg, file);
    };

    // Upload satu bukti (per leg) ke Supabase Storage, kembalikan public URL
    const uploadProofToStorage = async (leg: LegKey): Promise<string> => {
        const file = proofFiles[leg];
        if (!file) throw new Error(`Belum ada file bukti ${leg === 'leg1' ? 'Leg 1' : 'Leg 2'} yang dipilih.`);

        setIsUploadingProof(prev => ({ ...prev, [leg]: true }));
        try {
            // TODO(Ko): Aktifkan implementasi asli setelah import supabase client dikonfirmasi.
            // const fileExt = file.name.split('.').pop();
            // const filePath = `${matchId}/${leg}-${Date.now()}.${fileExt}`;
            // const { error: uploadError } = await supabase.storage
            //     .from(MATCH_PROOF_BUCKET)
            //     .upload(filePath, file, { cacheControl: '3600', upsert: false });
            // if (uploadError) throw uploadError;
            // const { data: publicUrlData } = supabase.storage
            //     .from(MATCH_PROOF_BUCKET)
            //     .getPublicUrl(filePath);
            // return publicUrlData.publicUrl;

            // Placeholder sementara sampai koneksi Supabase Storage dikonfirmasi:
            await new Promise(resolve => setTimeout(resolve, 1200));
            return proofPreviewUrls[leg] || '';
        } finally {
            setIsUploadingProof(prev => ({ ...prev, [leg]: false }));
        }
    };

    // 1. FETCH DATA MATCH & CHAT (Mockup Integrasi Awal)
    useEffect(() => {
        const fetchCenterData = async () => {
            setIsLoading(true);
            try {
                // TODO: Endpoint ini harus dibuat nanti untuk menarik detail match & history chat
                // const res = await fetch(`/api/user/match-center/${matchId}`);
                // const data = await res.json();

                // MOCK DATA SEMENTARA UNTUK PREVIEW UI
                setTimeout(() => {
                    setMatchDetails({
                        id: matchId,
                        stage: 'KNOCKOUT_16', // Ubah ke 'GROUP' untuk melihat mode 1 Leg
                        matchNumber: 12,
                        homeTeam: { teamName: 'NiasPrime FC', leaderName: 'Aldin' },
                        awayTeam: { teamName: 'Garuda E-Sport', leaderName: 'Budi' },
                        status: 'SCHEDULED'
                    });
                    setChatMessages([
                        { id: '1', senderName: 'Budi', message: 'Halo mas, mau main jam berapa malam ini?', createdAt: new Date().toISOString(), isMe: false },
                        { id: '2', senderName: 'Aldin', message: 'Jam 8 malam ya, habis isya saya kabari.', createdAt: new Date().toISOString(), isMe: true }
                    ]);
                    setIsLoading(false);
                }, 800);
            } catch (error) {
                console.error('Gagal memuat ruang ganti:', error);
                setIsLoading(false);
            }
        };

        fetchCenterData();
    }, [matchId]);

    // Auto-scroll chat ke bawah
    useEffect(() => {
        if (activeTab === 'CHAT') {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatMessages, activeTab]);

    // Bersihkan object URL preview saat komponen unmount agar tidak bocor memori
    useEffect(() => {
        return () => {
            if (proofPreviewUrls.leg1) URL.revokeObjectURL(proofPreviewUrls.leg1);
            if (proofPreviewUrls.leg2) URL.revokeObjectURL(proofPreviewUrls.leg2);
        };
    }, [proofPreviewUrls]);

    const handleScoreSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Bukti Leg 1 wajib selalu ada
        if (!proofFiles.leg1 && !scoreData.screenshotUrlLeg1) {
            alert('Wajib melampirkan screenshot bukti hasil Leg 1.');
            return;
        }

        // Leg 2 cuma wajib kalau bukan fase grup DAN skornya sudah diisi
        const leg2ScoreFilled = scoreData.homeScoreLeg2 !== '' || scoreData.awayScoreLeg2 !== '';
        if (!isGroupStage && leg2ScoreFilled && !proofFiles.leg2 && !scoreData.screenshotUrlLeg2) {
            alert('Skor Leg 2 sudah diisi — wajib lampirkan screenshot bukti hasil Leg 2 juga.');
            return;
        }

        setIsSubmitting(true);
        try {
            let screenshotUrlLeg1 = scoreData.screenshotUrlLeg1;
            if (proofFiles.leg1) {
                screenshotUrlLeg1 = await uploadProofToStorage('leg1');
            }

            let screenshotUrlLeg2 = scoreData.screenshotUrlLeg2;
            if (proofFiles.leg2) {
                screenshotUrlLeg2 = await uploadProofToStorage('leg2');
            }

            // TODO: Integrasikan ke endpoint POST /api/user/match-center/${matchId}/score
            // Sertakan `screenshotUrlLeg1` dan (kalau ada) `screenshotUrlLeg2` di body request.
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulasi delay
            alert('Skor berhasil dikirim ke Admin untuk diverifikasi!');
            onSuccess();
            onClose();
        } catch (error) {
            alert('Gagal mengirim laporan skor.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        // Optimistic UI Update
        const newMsg: ChatMessage = {
            id: Date.now().toString(),
            senderName: 'Anda',
            message: newMessage,
            createdAt: new Date().toISOString(),
            isMe: true
        };
        setChatMessages(prev => [...prev, newMsg]);
        setNewMessage('');

        // TODO: Integrasikan POST ke tabel MatchChat via Supabase/API
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-brand-dark/80 backdrop-blur-md animate-in fade-in duration-200">
            {/* CONTAINER MODAL UTAMA */}
            <div className="bg-brand-bg-light w-full max-w-2xl rounded-3xl shadow-brand-glow overflow-hidden flex flex-col max-h-[90vh]">

                {/* HEADER MODAL */}
                <div className="bg-brand-bg-surface border-b border-brand-border p-5 sm:px-6 relative shrink-0">
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 p-2 rounded-full text-brand-muted hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <h2 className="text-lg font-black font-jetbrains text-brand-dark uppercase tracking-tight flex items-center gap-2">
                        <Swords size={20} className="text-brand-primary" />
                        Match Center
                    </h2>

                    {matchDetails && (
                        <div className="mt-3 flex items-center gap-2 text-xs font-medium text-brand-muted">
                            <span className="bg-brand-primary/10 text-brand-primary border border-brand-primary/20 px-2 py-0.5 rounded font-jetbrains font-black uppercase text-[10px]">
                                {matchDetails.stage}
                            </span>
                            <span>Match #{matchDetails.matchNumber}</span>
                        </div>
                    )}
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center p-20 text-brand-primary min-h-[400px]">
                        <Loader2 size={32} className="animate-spin mb-3" />
                        <span className="text-xs font-black font-jetbrains tracking-widest uppercase">Membuka Ruang Ganti...</span>
                    </div>
                ) : (
                    <>
                        {/* TAB NAVIGATOR */}
                        <div className="flex border-b border-brand-border shrink-0 bg-brand-bg-light">
                            <button
                                onClick={() => setActiveTab('SCORE')}
                                className={`flex-1 py-4 text-xs font-black font-jetbrains uppercase tracking-widest transition-all border-b-2 flex items-center justify-center gap-2 ${activeTab === 'SCORE'
                                    ? 'border-brand-primary text-brand-primary bg-brand-primary/5'
                                    : 'border-transparent text-brand-muted hover:text-brand-dark hover:bg-brand-bg-surface'
                                    }`}
                            >
                                <Upload size={16} /> Lapor Skor
                            </button>
                            <button
                                onClick={() => setActiveTab('CHAT')}
                                className={`flex-1 py-4 text-xs font-black font-jetbrains uppercase tracking-widest transition-all border-b-2 flex items-center justify-center gap-2 ${activeTab === 'CHAT'
                                    ? 'border-brand-primary text-brand-primary bg-brand-primary/5'
                                    : 'border-transparent text-brand-muted hover:text-brand-dark hover:bg-brand-bg-surface'
                                    }`}
                            >
                                <MessageSquare size={16} /> Ruang Chat
                            </button>
                        </div>

                        {/* KONTEN TAB 1: FORM LAPOR SKOR */}
                        {activeTab === 'SCORE' && (
                            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-white">
                                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3 mb-6">
                                    <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
                                    <p className="text-xs text-amber-800 leading-relaxed font-medium">
                                        Pastikan skor yang diinput sesuai dengan hasil pertandingan. <b className="font-black">Unggah screenshot</b> untuk tiap leg sebagai bukti validasi admin.
                                    </p>
                                </div>

                                <form onSubmit={handleScoreSubmit} className="space-y-6">
                                    {/* VERSUS HEADER */}
                                    <div className="flex items-center justify-between px-4 sm:px-10">
                                        <div className="text-center w-1/3">
                                            <p className="text-[10px] text-brand-muted font-bold font-jetbrains uppercase mb-1">Tim Kandang</p>
                                            <p className="font-black text-brand-dark text-sm sm:text-base truncate">{matchDetails?.homeTeam.teamName}</p>
                                        </div>
                                        <div className="w-1/3 text-center">
                                            <span className="text-xs font-black font-jetbrains text-brand-muted bg-brand-bg-surface px-3 py-1.5 rounded-lg border border-brand-border">VS</span>
                                        </div>
                                        <div className="text-center w-1/3">
                                            <p className="text-[10px] text-brand-muted font-bold font-jetbrains uppercase mb-1">Tim Tandang</p>
                                            <p className="font-black text-brand-dark text-sm sm:text-base truncate">{matchDetails?.awayTeam.teamName}</p>
                                        </div>
                                    </div>

                                    {/* INPUT SKOR LEG 1 */}
                                    <div className="bg-brand-bg-surface border border-brand-border p-5 rounded-2xl space-y-4">
                                        <h4 className="text-xs font-black font-jetbrains text-brand-primary uppercase tracking-widest text-center border-b border-brand-border pb-2">
                                            Skor {isGroupStage ? 'Pertandingan' : 'Leg 1'}
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4 sm:gap-6">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-[10px] font-bold text-brand-muted uppercase tracking-tight text-center truncate">
                                                    {matchDetails?.homeTeam.teamName}
                                                </label>
                                                <div className="relative group">
                                                    <input
                                                        type="number" min="0" required
                                                        value={scoreData.homeScoreLeg1}
                                                        onChange={e => setScoreData({ ...scoreData, homeScoreLeg1: e.target.value })}
                                                        className="w-full h-24 text-center text-4xl font-black font-jetbrains text-brand-primary bg-white border border-brand-border rounded-xl focus:ring-4 focus:ring-brand-gold/30 focus:border-brand-gold focus:shadow-[0_0_15px_rgba(252,179,53,0.15)] outline-none transition-all"
                                                    />
                                                    <span className="absolute right-3 bottom-2 text-[9px] font-bold uppercase text-brand-muted/40">Goals</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-[10px] font-bold text-brand-muted uppercase tracking-tight text-center truncate">
                                                    {matchDetails?.awayTeam.teamName}
                                                </label>
                                                <div className="relative group">
                                                    <input
                                                        type="number" min="0" required
                                                        value={scoreData.awayScoreLeg1}
                                                        onChange={e => setScoreData({ ...scoreData, awayScoreLeg1: e.target.value })}
                                                        className="w-full h-24 text-center text-4xl font-black font-jetbrains text-brand-primary bg-white border border-brand-border rounded-xl focus:ring-4 focus:ring-brand-gold/30 focus:border-brand-gold focus:shadow-[0_0_15px_rgba(252,179,53,0.15)] outline-none transition-all"
                                                    />
                                                    <span className="absolute right-3 bottom-2 text-[9px] font-bold uppercase text-brand-muted/40">Goals</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* BUKTI SCREENSHOT LEG 1 */}
                                        <div className="pt-2">
                                            <label className="block text-[10px] font-black font-jetbrains uppercase text-brand-dark mb-2">
                                                Bukti Hasil {isGroupStage ? 'Pertandingan' : 'Leg 1'}
                                            </label>

                                            <input
                                                ref={fileInputRefs.leg1}
                                                type="file"
                                                accept="image/png,image/jpeg,image/jpg"
                                                className="hidden"
                                                onChange={e => handleProofFile('leg1', e.target.files?.[0] || null)}
                                            />

                                            {proofPreviewUrls.leg1 ? (
                                                <div className="relative rounded-xl border border-brand-border overflow-hidden bg-white">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={proofPreviewUrls.leg1}
                                                        alt={`Preview bukti hasil ${isGroupStage ? 'pertandingan' : 'Leg 1'}`}
                                                        className="w-full max-h-56 object-contain bg-white"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveProof('leg1')}
                                                        className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-red-500 hover:bg-red-50 shadow-sm transition-colors"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                    <div className="px-3 py-2 flex items-center gap-2 border-t border-brand-border bg-white">
                                                        <ImageIcon size={14} className="text-brand-muted shrink-0" />
                                                        <span className="text-xs text-brand-dark truncate">{proofFiles.leg1?.name}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    onClick={() => fileInputRefs.leg1.current?.click()}
                                                    onDragOver={e => { e.preventDefault(); setIsDraggingProof(prev => ({ ...prev, leg1: true })); }}
                                                    onDragLeave={() => setIsDraggingProof(prev => ({ ...prev, leg1: false }))}
                                                    onDrop={handleDrop('leg1')}
                                                    className={`w-full border-2 border-dashed rounded-xl p-6 bg-white transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer group ${isDraggingProof.leg1
                                                        ? 'border-brand-gold bg-brand-gold/5 shadow-[0_0_15px_rgba(252,179,53,0.15)]'
                                                        : 'border-brand-border hover:bg-brand-bg-surface'
                                                        }`}
                                                >
                                                    <div className="w-10 h-10 rounded-full bg-brand-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                        <Upload size={20} className="text-brand-primary" />
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="font-semibold text-xs text-brand-dark">Upload Screenshot</p>
                                                        <p className="text-[9px] text-brand-muted mt-0.5">JPG/PNG · maks 5MB</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* INPUT SKOR LEG 2 (MUNCUL JIKA FASE GUGUR) */}
                                    {!isGroupStage && (
                                        <div className="bg-brand-bg-surface border border-brand-border p-5 rounded-2xl space-y-4">
                                            <h4 className="text-xs font-black font-jetbrains text-brand-primary uppercase tracking-widest text-center border-b border-brand-border pb-2">
                                                Skor Leg 2 (Opsional jika belum main)
                                            </h4>
                                            <div className="grid grid-cols-2 gap-4 sm:gap-6">
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-[10px] font-bold text-brand-muted uppercase tracking-tight text-center truncate">
                                                        {matchDetails?.homeTeam.teamName}
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="number" min="0"
                                                            value={scoreData.homeScoreLeg2}
                                                            onChange={e => setScoreData({ ...scoreData, homeScoreLeg2: e.target.value })}
                                                            className="w-full h-24 text-center text-4xl font-black font-jetbrains text-brand-primary bg-white border border-brand-border rounded-xl focus:ring-4 focus:ring-brand-gold/30 focus:border-brand-gold focus:shadow-[0_0_15px_rgba(252,179,53,0.15)] outline-none transition-all"
                                                        />
                                                        <span className="absolute right-3 bottom-2 text-[9px] font-bold uppercase text-brand-muted/40">Goals</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-[10px] font-bold text-brand-muted uppercase tracking-tight text-center truncate">
                                                        {matchDetails?.awayTeam.teamName}
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="number" min="0"
                                                            value={scoreData.awayScoreLeg2}
                                                            onChange={e => setScoreData({ ...scoreData, awayScoreLeg2: e.target.value })}
                                                            className="w-full h-24 text-center text-4xl font-black font-jetbrains text-brand-primary bg-white border border-brand-border rounded-xl focus:ring-4 focus:ring-brand-gold/30 focus:border-brand-gold focus:shadow-[0_0_15px_rgba(252,179,53,0.15)] outline-none transition-all"
                                                        />
                                                        <span className="absolute right-3 bottom-2 text-[9px] font-bold uppercase text-brand-muted/40">Goals</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* BUKTI SCREENSHOT LEG 2 */}
                                            <div className="pt-2">
                                                <label className="block text-[10px] font-black font-jetbrains uppercase text-brand-dark mb-2">
                                                    Bukti Hasil Leg 2
                                                </label>

                                                <input
                                                    ref={fileInputRefs.leg2}
                                                    type="file"
                                                    accept="image/png,image/jpeg,image/jpg"
                                                    className="hidden"
                                                    onChange={e => handleProofFile('leg2', e.target.files?.[0] || null)}
                                                />

                                                {proofPreviewUrls.leg2 ? (
                                                    <div className="relative rounded-xl border border-brand-border overflow-hidden bg-white">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img
                                                            src={proofPreviewUrls.leg2}
                                                            alt="Preview bukti hasil Leg 2"
                                                            className="w-full max-h-56 object-contain bg-white"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveProof('leg2')}
                                                            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-red-500 hover:bg-red-50 shadow-sm transition-colors"
                                                        >
                                                            <XCircle size={18} />
                                                        </button>
                                                        <div className="px-3 py-2 flex items-center gap-2 border-t border-brand-border bg-white">
                                                            <ImageIcon size={14} className="text-brand-muted shrink-0" />
                                                            <span className="text-xs text-brand-dark truncate">{proofFiles.leg2?.name}</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div
                                                        onClick={() => fileInputRefs.leg2.current?.click()}
                                                        onDragOver={e => { e.preventDefault(); setIsDraggingProof(prev => ({ ...prev, leg2: true })); }}
                                                        onDragLeave={() => setIsDraggingProof(prev => ({ ...prev, leg2: false }))}
                                                        onDrop={handleDrop('leg2')}
                                                        className={`w-full border-2 border-dashed rounded-xl p-6 bg-white transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer group ${isDraggingProof.leg2
                                                            ? 'border-brand-gold bg-brand-gold/5 shadow-[0_0_15px_rgba(252,179,53,0.15)]'
                                                            : 'border-brand-border hover:bg-brand-bg-surface'
                                                            }`}
                                                    >
                                                        <div className="w-10 h-10 rounded-full bg-brand-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                            <Upload size={20} className="text-brand-primary" />
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="font-semibold text-xs text-brand-dark">Upload Screenshot</p>
                                                            <p className="text-[9px] text-brand-muted mt-0.5">JPG/PNG · maks 5MB · isi kalau Leg 2 sudah main</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        type="submit" disabled={isSubmitting || isUploadingProof.leg1 || isUploadingProof.leg2}
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black font-jetbrains py-4 rounded-xl text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50"
                                    >
                                        {(isSubmitting || isUploadingProof.leg1 || isUploadingProof.leg2)
                                            ? <Loader2 size={18} className="animate-spin" />
                                            : <CheckCircle2 size={18} strokeWidth={3} />}
                                        {(isUploadingProof.leg1 || isUploadingProof.leg2) ? 'MENGUNGGAH BUKTI...' : 'KIRIM LAPORAN KE ADMIN'}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* KONTEN TAB 2: RUANG CHAT */}
                        {activeTab === 'CHAT' && (
                            <div className="flex flex-col h-[500px] bg-brand-bg-surface">
                                {/* Area Pesan */}
                                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
                                    <div className="text-center mb-6">
                                        <span className="bg-brand-bg-light border border-brand-border text-[10px] font-black font-jetbrains uppercase tracking-widest text-brand-muted px-4 py-1.5 rounded-full shadow-sm">
                                            Ruang Komunikasi Match #{matchDetails?.matchNumber}
                                        </span>
                                    </div>

                                    {chatMessages.map((msg) => (
                                        <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                                            <span className="text-[10px] font-bold text-brand-muted mb-1 ml-1">{msg.senderName}</span>
                                            <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${msg.isMe
                                                ? 'bg-brand-primary text-white rounded-br-none'
                                                : 'bg-white border border-brand-border text-brand-dark rounded-bl-none'
                                                }`}>
                                                {msg.message}
                                            </div>
                                            <span className="text-[9px] text-brand-muted mt-1 mr-1 font-jetbrains">
                                                {new Date(msg.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    ))}
                                    <div ref={chatEndRef} />
                                </div>

                                {/* Form Input Chat */}
                                <div className="p-4 bg-white border-t border-brand-border shrink-0">
                                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            placeholder="Ketik pesan untuk lawan..."
                                            value={newMessage}
                                            onChange={e => setNewMessage(e.target.value)}
                                            className="flex-1 bg-brand-bg-surface border border-brand-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all text-brand-dark"
                                        />
                                        <button
                                            type="submit" disabled={!newMessage.trim()}
                                            className="w-12 h-12 rounded-xl bg-brand-primary hover:bg-brand-secondary text-white flex items-center justify-center shrink-0 transition-colors disabled:opacity-50 shadow-sm"
                                        >
                                            <Send size={18} />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}