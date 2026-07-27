// Path: src/app/profil/error.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ProfilError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Ini akan tampil di console browser (F12) — kirim isinya ke saya kalau masih crash
        console.error('[PROFIL PAGE ERROR]', error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-6">
            <div className="max-w-md w-full text-center space-y-4">
                <h1 className="text-xl font-black text-red-600">Terjadi Kesalahan di Halaman Profil</h1>
                <p className="text-sm text-gray-600 break-words">
                    {error.message || 'Unknown error'}
                </p>
                {error.digest && (
                    <p className="text-xs text-gray-400 font-mono">Digest: {error.digest}</p>
                )}
                <div className="flex gap-3 justify-center pt-2">
                    <button
                        onClick={() => reset()}
                        className="px-4 py-2 rounded-lg bg-brand-primary text-white text-sm font-bold"
                    >
                        Coba Lagi
                    </button>
                    <Link href="/login" className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-bold">
                        Ke Login
                    </Link>
                </div>
            </div>
        </div>
    );
}