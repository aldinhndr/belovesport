// Path: src/components/participant/NotificationBell.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import useSWR from 'swr';
import { Bell, Clock, CheckCircle2, AlertCircle, Info, Loader2 } from 'lucide-react';

const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then((res) => res.json());

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // 🚀 LIVE POLL NOTIFIKASI: Ambil data pembaruan diam-diam setiap 15 detik
    const { data: resData, isLoading } = useSWR('/api/participant/notifications', fetcher, {
        refreshInterval: 15000,
        revalidateOnFocus: true
    });

    const notifications = resData?.success ? resData.data : [];
    const hasUnread = notifications.length > 0;

    // Klik di luar dropdown untuk menutup popover otomatis
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative shrink-0" ref={dropdownRef}>
            {/* TOMBOL LONCENG NAV */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Notifikasi Lonceng"
                className={`relative p-2 rounded-xl transition-all border ${
                    isOpen 
                        ? 'bg-brand-primary/5 border-brand-primary text-brand-primary' 
                        : 'text-brand-muted hover:text-brand-dark hover:bg-brand-bg-surface border-transparent'
                }`}
            >
                <Bell size={16} />
                {hasUnread && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
                )}
            </button>

            {/* DROPDOWN PANEL NOTIFIKASI */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-brand-border rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-3 bg-brand-bg-surface border-b border-brand-border flex items-center justify-between">
                        <span className="text-xs font-black uppercase font-jetbrains tracking-wider text-brand-dark">Pusat Pemberitahuan</span>
                        {isLoading && <Loader2 size={12} className="animate-spin text-brand-primary" />}
                    </div>

                    <div className="max-h-[320px] overflow-y-auto custom-scrollbar divide-y divide-brand-border bg-white">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-brand-muted">
                                <Bell size={24} className="mx-auto mb-2 opacity-30 text-brand-gold" />
                                <p className="text-xs font-bold">Belum ada pemberitahuan baru, Ko.</p>
                                <p className="text-[10px] opacity-80 mt-0.5">Semua info sirkuit matchday Koko akan muncul di sini.</p>
                            </div>
                        ) : (
                            notifications.map((notif: any) => (
                                <div key={notif.id} className="p-4 flex items-start gap-3 hover:bg-slate-50/60 transition-colors">
                                    {/* Icon berdasarkan tipe status */}
                                    <div className="mt-0.5 shrink-0">
                                        {notif.type === 'SUCCESS' && <CheckCircle2 size={15} className="text-emerald-600" />}
                                        {notif.type === 'DANGER' && <AlertCircle size={15} className="text-red-500" />}
                                        {notif.type === 'WARNING' && <Clock size={15} className="text-amber-500" />}
                                        {notif.type === 'INFO' && <Info size={15} className="text-brand-primary" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-black text-brand-dark uppercase tracking-wide font-jetbrains">{notif.title}</p>
                                        <p className="text-xs text-brand-muted/90 mt-1 leading-normal select-text">{notif.message}</p>
                                        <span className="text-[9px] font-mono text-brand-muted block mt-1.5">
                                            {new Date(notif.time).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} · {new Date(notif.time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}