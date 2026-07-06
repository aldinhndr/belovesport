// Path: src/components/tournament/MatchChatBox.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import useSWR from 'swr';
import { Send, Loader2, MessageSquare, ShieldAlert, User } from 'lucide-react';

interface MatchChatBoxProps {
    matchId: string;
    currentSenderId: string;   // Diambil langsung dari session.participantId Koko
    currentSenderName: string; // Diambil langsung dari session username Koko
}

const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then((res) => {
    if (!res.ok) throw new Error('Gagal memuat obrolan.');
    return res.json();
});

export default function MatchChatBox({ matchId, currentSenderId, currentSenderName }: MatchChatBoxProps) {
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Engine polling SWR untuk sinkronisasi pesan MatchChat secara real-time
    const { data: resData, error, mutate } = useSWR(`/api/tournament/chat?matchId=${matchId}`, fetcher, {
        refreshInterval: 3000,
        revalidateOnFocus: true
    });

    const chats = resData?.success ? resData.data : [];

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chats]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || isSending) return;

        setIsSending(true);
        try {
            const res = await fetch('/api/tournament/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    matchId,
                    message: newMessage.trim(),
                    senderId: currentSenderId,     // Sesuai field database MatchChat
                    senderName: currentSenderName   // Sesuai field database MatchChat
                }),
            });
            const data = await res.json();
            if (data.success) {
                setNewMessage('');
                mutate();
            }
        } catch (err) {
            console.error('Gagal mengirim pesan chat:', err);
        } finnaly {
            setIsSending(false);
        }
    };

    return (
        <div className="flex flex-col h-[400px] bg-white border border-brand-border rounded-2xl overflow-hidden shadow-sm">
            <div className="px-4 py-3 bg-brand-bg-surface border-b border-brand-border flex items-center gap-2">
                <MessageSquare size={16} className="text-brand-primary" />
                <span className="text-xs font-black uppercase font-jetbrains tracking-wider text-brand-dark">
                    Room Chat Pertandingan
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-auto" />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-slate-50/40">
                {error && (
                    <div className="flex items-center gap-1.5 justify-center text-xs text-red-600 font-semibold bg-red-50 p-2 rounded-xl border border-red-100">
                        <ShieldAlert size={14} /> Gagal sinkronisasi pesan.
                    </div>
                )}

                {chats.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 text-brand-muted">
                        <MessageSquare size={28} className="mb-2 opacity-40 text-brand-gold" />
                        <p className="text-xs font-bold">Belum ada obrolan, Ko.</p>
                        <p className="text-[11px] opacity-80 max-w-[200px] mt-0.5">Bagikan Room ID &amp; Password eFootball Mobile Koko di sini.</p>
                    </div>
                ) : (
                    chats.map((chat: any) => {
                        const isMe = chat.senderId === currentSenderId;
                        return (
                            <div key={chat.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-in fade-in zoom-in-95 duration-150`}>
                                {!isMe && (
                                    <span className="text-[10px] font-black font-jetbrains text-brand-muted uppercase tracking-wide mb-1 ml-1 flex items-center gap-1">
                                        <User size={10} /> {chat.senderName}
                                    </span>
                                )}
                                <div className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-xs font-medium shadow-sm leading-relaxed ${isMe ? 'bg-gradient-brand text-white rounded-tr-none' : 'bg-white border border-brand-border text-brand-dark rounded-tl-none'
                                    }`}>
                                    <p className="break-words whitespace-pre-wrap select-text">{chat.message}</p>
                                    <span className={`text-[8px] font-mono mt-1 block text-right ${isMe ? 'text-white/70' : 'text-brand-muted'}`}>
                                        {new Date(chat.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-brand-border flex items-center gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Ketik pesan atau Room ID eFootball..."
                    className="flex-1 bg-brand-bg-surface border border-brand-border rounded-xl px-4 py-2.5 text-xs font-medium text-brand-dark placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-all"
                />
                <button
                    type="submit"
                    disabled={!newMessage.trim() || isSending}
                    className="p-2.5 rounded-xl bg-gradient-brand text-white shadow-brand hover:brightness-105 active:scale-95 disabled:opacity-40 disabled:scale-100 transition-all flex items-center justify-center shrink-0"
                >
                    {isSending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                </button>
            </form>
        </div>
    );
}