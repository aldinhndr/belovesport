// Path: src/components/tournament/MatchActionModal.tsx
'use client'

import { useState, useEffect, useRef } from 'react';
import { X, Send, Clock, Trophy, MessageSquare, Swords, Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface MatchActionModalProps {
    matchId: string;
    onClose: () => void;
    onSuccess?: () => void;
}

const CURRENT_USER_ID = "user-id-kapten-tim"; // Dummy untuk UI Chat

export default function MatchActionModal({ matchId, onClose, onSuccess }: MatchActionModalProps) {
    // 🎛️ UPDATE STATE TAB: Menambahkan opsi DISPUTE
    const [activeTab, setActiveTab] = useState<'REPORT' | 'CHAT' | 'DISPUTE'>('REPORT');

    // STATE: LAPOR SKOR & UPLOAD
    const [scoreHomeLeg1, setScoreHomeLeg1] = useState('');
    const [scoreAwayLeg1, setScoreAwayLeg1] = useState('');
    const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // STATE: CHATROOM
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // ─── STATE TAMBAHAN: PENANGANAN SENGKETA (DISPUTE) ───
    const [disputeReason, setDisputeReason] = useState('');
    const [disputeEvidence, setDisputeEvidence] = useState<string | null>(null);
    const disputeFileRef = useRef<HTMLInputElement>(null);
    const [isSubmittingDispute, setIsSubmittingDispute] = useState(false);

    // ─── LOGIKA CHATROOM ───
    const fetchChats = async () => {
        try {
            const res = await fetch(`/api/tournament/chat?matchId=${matchId}`, {
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) setMessages(data.data);
        } catch (err) {
            console.error('Gagal memuat obrolan', err);
        }
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (activeTab === 'CHAT') {
            fetchChats();
            interval = setInterval(fetchChats, 3000); // Polling tiap 3 detik
        }
        return () => clearInterval(interval);
    }, [activeTab, matchId]);

    useEffect(() => {
        if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendChat = async () => {
        if (!newMessage.trim() || isSending) return;
        setIsSending(true);
        try {
            const res = await fetch('/api/tournament/chat', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ matchId, message: newMessage })
            });
            const data = await res.json();
            if (data.success) {
                setNewMessage('');
                fetchChats();
            }
        } catch (err) {
            console.error('Gagal mengirim pesan', err);
        } finally {
            setIsSending(false);
        }
    };

    // ─── LOGIKA UPLOAD GAMBAR ───
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, target: 'REPORT' | 'DISPUTE') => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 3 * 1024 * 1024) {
            setStatusMsg({ type: 'error', text: 'Ukuran gambar maksimal 3MB.' });
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            if (target === 'REPORT') {
                setScreenshotPreview(reader.result as string);
            } else {
                setDisputeEvidence(reader.result as string);
            }
            setStatusMsg(null);
        };
        reader.readAsDataURL(file);
    };

    // ─── LOGIKA SUBMIT SKOR ───
    const handleReportScore = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!scoreHomeLeg1 || !scoreAwayLeg1 || !screenshotPreview) {
            setStatusMsg({ type: 'error', text: 'Data skor dan bukti screenshot wajib diisi.' });
            return;
        }

        setIsLoading(true);
        setStatusMsg(null);

        try {
            const res = await fetch('/api/tournament/match-action', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    matchId,
                    homeScoreLeg1: parseInt(scoreHomeLeg1),
                    awayScoreLeg1: parseInt(scoreAwayLeg1),
                    screenshotBase64: screenshotPreview
                })
            });

            const data = await res.json();
            if (data.success) {
                setStatusMsg({ type: 'success', text: 'Laporan berhasil dikirim! Menunggu verifikasi admin.' });
                setTimeout(() => {
                    if (onSuccess) onSuccess();
                    onClose();
                }, 2000);
            } else {
                setStatusMsg({ type: 'error', text: data.message });
            }
        } catch {
            setStatusMsg({ type: 'error', text: 'Gagal terhubung ke server API.' });
        } finally {
            setIsLoading(false);
        }
    };

    // ─── LOGIKA SUBMIT SENGKETA (DISPUTE ENGINE) ───
    const handleReportDispute = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!disputeReason.trim() || !disputeEvidence) {
            setStatusMsg({ type: 'error', text: 'Alasan sengketa dan bukti screenshot pelanggaran wajib diisi.' });
            return;
        }

        setIsSubmittingDispute(true);
        setStatusMsg(null);

        try {
            const res = await fetch('/api/tournament/match-action', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    matchId,
                    isDispute: true, // Flag penanda ke backend API
                    disputeReason: disputeReason.trim(),
                    screenshotBase64: disputeEvidence
                })
            });

            const data = await res.json();
            if (data.success) {
                setStatusMsg({ type: 'success', text: 'Sengketa berhasil diajukan! Status laga ditahan untuk investigasi Admin.' });
                setTimeout(() => {
                    if (onSuccess) onSuccess();
                    onClose();
                }, 2000);
            } else {
                setStatusMsg({ type: 'error', text: data.message });
            }
        } catch {
            setStatusMsg({ type: 'error', text: 'Gagal mengirimkan laporan aduan sengketa.' });
        } finally {
            setIsSubmittingDispute(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-brand-dark/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
            <div className="bg-white border border-brand-border w-full max-w-lg max-h-[88vh] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl relative flex flex-col">

                {/* HEADER MODAL */}
                <div className="flex justify-between items-center bg-gradient-brand px-5 py-4 shrink-0">
                    <div className="flex items-center gap-2">
                        <Trophy size={16} className="text-brand-gold" />
                        <span className="font-jetbrains text-[11px] sm:text-xs font-black text-white uppercase tracking-wider">Match Interaction Panel</span>
                    </div>
                    <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* TAB NAVIGATION */}
                <div className="flex border-b border-brand-border text-xs font-bold font-jetbrains shrink-0">
                    <button onClick={() => { setActiveTab('REPORT'); setStatusMsg(null); }} className={`flex-1 py-3.5 flex justify-center items-center gap-2 transition-colors ${activeTab === 'REPORT' ? 'border-b-2 border-brand-primary text-brand-primary bg-brand-primary/5' : 'text-brand-muted hover:text-brand-dark'}`}>
                        <Swords size={13} /> LAPOR SKOR
                    </button>
                    <button onClick={() => { setActiveTab('CHAT'); setStatusMsg(null); }} className={`flex-1 py-3.5 flex justify-center items-center gap-2 transition-colors ${activeTab === 'CHAT' ? 'border-b-2 border-brand-primary text-brand-primary bg-brand-primary/5' : 'text-brand-muted hover:text-brand-dark'}`}>
                        <MessageSquare size={13} /> CHATROOM
                    </button>
                    <button onClick={() => { setActiveTab('DISPUTE'); setStatusMsg(null); }} className={`flex-1 py-3.5 flex justify-center items-center gap-2 transition-colors ${activeTab === 'DISPUTE' ? 'border-b-2 border-red-600 text-red-600 bg-red-50/5' : 'text-brand-muted hover:text-red-500'}`}>
                        <AlertCircle size={13} /> SENGKETA
                    </button>
                </div>

                {/* CONTENT PANEL */}
                <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar flex-1">

                    {/* PANELS 1: FORM LAPOR SKOR */}
                    {activeTab === 'REPORT' && (
                        <form onSubmit={handleReportScore} className="space-y-5">
                            <div className="bg-brand-bg-surface border border-brand-border rounded-2xl p-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-brand-muted text-center mb-4">Hasil Waktu Penuh (FT)</p>
                                <div className="flex items-center justify-center gap-4">
                                    <div className="text-center">
                                        <label className="block text-xs font-bold text-brand-dark mb-2">Skor Kiri (Home)</label>
                                        <input type="number" min="0" required value={scoreHomeLeg1} onChange={(e) => setScoreHomeLeg1(e.target.value)} className="w-16 h-16 text-center text-2xl font-black font-jetbrains bg-white border border-brand-border rounded-xl focus:outline-none focus:border-brand-primary" placeholder="0" />
                                    </div>
                                    <span className="font-black text-brand-muted text-xl">-</span>
                                    <div className="text-center">
                                        <label className="block text-xs font-bold text-brand-dark mb-2">Skor Kanan (Away)</label>
                                        <input type="number" min="0" required value={scoreAwayLeg1} onChange={(e) => setScoreAwayLeg1(e.target.value)} className="w-16 h-16 text-center text-2xl font-black font-jetbrains bg-white border border-brand-border rounded-xl focus:outline-none focus:border-brand-primary" placeholder="0" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black tracking-widest uppercase text-brand-dark font-jetbrains flex items-center gap-2">
                                    <ImageIcon size={14} className="text-brand-primary" /> Upload Bukti Pertandingan
                                </label>
                                <div onClick={() => fileInputRef.current?.click()} className={`relative border-2 border-dashed rounded-2xl p-4 transition-all bg-brand-bg-surface flex flex-col items-center justify-center cursor-pointer ${screenshotPreview ? 'border-brand-primary' : 'border-brand-border hover:border-brand-primary/50'}`}>
                                    <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'REPORT')} className="hidden" />
                                    {screenshotPreview ? (
                                        <img src={screenshotPreview} alt="Preview Bukti Match" className="max-h-32 rounded-lg object-contain shadow-sm" />
                                    ) : (
                                        <div className="text-center py-2">
                                            <div className="w-10 h-10 rounded-full bg-white border border-brand-border flex items-center justify-center mx-auto mb-2">
                                                <Upload size={16} className="text-brand-primary" />
                                            </div>
                                            <span className="text-[10px] font-bold text-brand-muted">Sentuh untuk pilih Screenshot (Maks 3MB)</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {statusMsg && (
                                <div className={`flex items-start gap-2 p-3 rounded-xl text-xs font-bold ${statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                                    {statusMsg.type === 'error' && <AlertCircle size={14} className="shrink-0 mt-0.5" />}
                                    {statusMsg.text}
                                </div>
                            )}

                            <button type="submit" disabled={isLoading} className="w-full bg-gradient-brand hover:brightness-105 disabled:opacity-50 text-white font-black py-4 rounded-xl uppercase tracking-widest text-[11px] shadow-brand transition-all flex items-center justify-center gap-2">
                                {isLoading ? 'Memproses Laporan...' : 'KIRIM LAPORAN HASIL MATCH'}
                            </button>
                        </form>
                    )}

                    {/* PANELS 2: CHATROOM */}
                    {activeTab === 'CHAT' && (
                        <div className="flex flex-col h-[280px] sm:h-[340px]">
                            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar text-xs">
                                {messages.length === 0 ? (
                                    <div className="text-center text-brand-muted mt-10 font-jetbrains text-[11px]">Belum ada pesan. Mulai obrolan untuk koordinasi jadwal dan *Room ID* eFootball.</div>
                                ) : (
                                    messages.map((msg, i) => {
                                        const isMe = msg.senderId === CURRENT_USER_ID;
                                        const dateObj = new Date(msg.createdAt);
                                        const timeStr = `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;

                                        return (
                                            <div key={i} className={`p-3 rounded-xl max-w-[85%] border shadow-sm relative ${isMe ? 'bg-brand-primary/5 border-brand-primary/20 ml-auto text-right' : 'bg-brand-bg-surface border-brand-border'}`}>
                                                <div className="text-[9px] font-black font-jetbrains text-brand-primary uppercase tracking-wider mb-0.5">{msg.senderName}</div>
                                                <p className="text-brand-dark font-semibold leading-relaxed break-words">{msg.message}</p>
                                                <span className="text-[8px] text-brand-muted font-jetbrains block mt-1">{timeStr}</span>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            <div className="flex gap-2 mt-4 pt-3 border-t border-brand-border">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                                    placeholder="Ketik pesan..."
                                    disabled={isSending}
                                    className="flex-1 bg-white border border-brand-border rounded-xl px-4 py-3 text-xs text-brand-dark placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors"
                                />
                                <button onClick={handleSendChat} disabled={isSending} className="bg-brand-bg-surface hover:bg-gradient-brand hover:text-white disabled:opacity-50 p-3 rounded-xl transition-all text-brand-muted flex items-center justify-center shadow-sm border border-brand-border shrink-0">
                                    <Send size={14} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ─── PANELS 3: FORM SENGKETA / ARBITRASE ARINA TURNAMEN ─── */}
                    {activeTab === 'DISPUTE' && (
                        <form onSubmit={handleReportDispute} className="space-y-4 animate-in fade-in duration-200">
                            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-[10px] sm:text-xs text-red-700 font-semibold leading-normal flex gap-2">
                                <AlertCircle size={16} className="shrink-0 text-red-600 mt-0.5" />
                                <span>Gunakan panel ini jika lawan melanggar aturan sirkuit (AFK melampaui batas waktu tunggu, manipulasi jaringan, atau laporan skor palsu).</span>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-[10px] font-black uppercase tracking-wider text-brand-dark font-jetbrains">
                                    Detail Kronologi Kejadian
                                </label>
                                <textarea
                                    required
                                    value={disputeReason}
                                    onChange={(e) => setDisputeReason(e.target.value)}
                                    placeholder="Jelaskan secara padat dan jelas. Misal: Lawan tidak merespons di room chat selama 15 menit setelah waktu terjadwal, atau lawan dengan sengaja DC ketika posisi skor 3-1."
                                    className="w-full bg-brand-bg-surface border border-brand-border rounded-xl p-3 text-xs font-semibold text-brand-dark placeholder:text-brand-muted focus:outline-none focus:border-red-500 h-24 resize-none transition-colors"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black tracking-widest uppercase text-brand-dark font-jetbrains flex items-center gap-2">
                                    <ImageIcon size={14} className="text-red-600" /> Bukti Pelanggaran (Screenshot Match / Chat)
                                </label>
                                <div onClick={() => disputeFileRef.current?.click()} className={`relative border-2 border-dashed rounded-2xl p-4 transition-all bg-brand-bg-surface flex flex-col items-center justify-center cursor-pointer ${disputeEvidence ? 'border-red-500 bg-red-50/5' : 'border-brand-border hover:border-red-500/50'}`}>
                                    <input ref={disputeFileRef} type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'DISPUTE')} className="hidden" />
                                    {disputeEvidence ? (
                                        <img src={disputeEvidence} alt="Preview Bukti Sengketa" className="max-h-32 rounded-lg object-contain shadow-sm" />
                                    ) : (
                                        <div className="text-center py-2">
                                            <div className="w-10 h-10 rounded-full bg-white border border-brand-border flex items-center justify-center mx-auto mb-2">
                                                <Upload size={16} className="text-red-600" />
                                            </div>
                                            <span className="text-[10px] font-bold text-brand-muted">Sentuh untuk unggah Bukti Sengketa (Maks 3MB)</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {statusMsg && (
                                <div className={`flex items-start gap-2 p-3 rounded-xl text-xs font-bold ${statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                                    {statusMsg.type === 'error' && <AlertCircle size={14} className="shrink-0 mt-0.5" />}
                                    {statusMsg.text}
                                </div>
                            )}

                            <button type="submit" disabled={isSubmittingDispute || !disputeReason.trim() || !disputeEvidence} className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-black py-4 rounded-xl uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-2 shadow-md">
                                {isSubmittingDispute ? 'Mengajukan Investigasi...' : 'AJUKAN TIKET SENGKETA RESMI'}
                            </button>
                        </form>
                    )}
                </div>

            </div>
        </div>
    );
}