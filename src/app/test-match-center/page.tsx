// Path: src/app/test-match-center/page.tsx
//
// 🧪 HALAMAN TEST SEMENTARA — tidak menyentuh database sama sekali.
// Tujuannya cuma untuk mencoba tampilan & alur MatchCenterModal.tsx
// selagi belum ada data Match asli di DB.
//
// Cara pakai:
// 1. Taruh file ini di src/app/test-match-center/page.tsx
// 2. Jalankan dev server, buka http://localhost:3000/test-match-center
// 3. Klik tombol "Buka Match Center" → modal muncul dengan data dummy
//    (data dummy-nya ada di dalam MatchCenterModal.tsx sendiri, cari komentar
//    "MOCK DATA SEMENTARA UNTUK PREVIEW UI")
//
// ⚠️ HAPUS folder src/app/test-match-center sebelum deploy ke production,
// karena halaman ini tidak ada guard login/auth sama sekali.

'use client';

import { useState } from 'react';
import { Swords } from 'lucide-react';
import MatchCenterModal from '@/components/user/MatchCenterModal';

export default function TestMatchCenterPage() {
    const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-brand-bg-light flex items-center justify-center p-8">
            <div className="max-w-md w-full bg-white border border-brand-border rounded-2xl p-8 text-center shadow-sm">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-primary/10 flex items-center justify-center mb-4">
                    <Swords size={24} className="text-brand-primary" />
                </div>
                <h1 className="text-lg font-black text-brand-dark mb-2">Test Match Center Modal</h1>
                <p className="text-sm text-brand-muted mb-6">
                    Halaman ini cuma untuk uji coba tampilan modal input skor & chat.
                    Tidak butuh data match asli — semua masih pakai data dummy.
                </p>

                <button
                    onClick={() => setSelectedMatchId('dummy-match-id-001')}
                    className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold text-sm py-3 rounded-xl transition-colors"
                >
                    Buka Match Center
                </button>

                <p className="text-[10px] text-brand-muted mt-4">
                    matchId yang dikirim: <code className="font-mono">dummy-match-id-001</code> (bebas, tidak dipakai fetch API asli)
                </p>
            </div>

            {selectedMatchId && (
                <MatchCenterModal
                    matchId={selectedMatchId}
                    onClose={() => setSelectedMatchId(null)}
                    onSuccess={() => {
                        alert('onSuccess() terpanggil — di halaman asli ini akan refresh data jadwal.');
                        setSelectedMatchId(null);
                    }}
                />
            )}
        </div>
    );
}