// Path: src/app/auth/callback/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

export default function AuthCallbackPage() {
    const router = useRouter();

    useEffect(() => {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        const supabase = createClient(url, anonKey);

        const handleAuthCallback = async () => {
            // 1. Ambil parameter '?code=' yang dikirimkan oleh Google Auth dari URL
            const requestUrl = new URL(window.location.href);
            const code = requestUrl.searchParams.get('code');

            if (code) {
                // 🚀 FIX: Tukarkan kode dari Google menjadi session user aktif di Supabase
                const { error } = await supabase.auth.exchangeCodeForSession(code);

                if (!error) {
                    // 🎯 SELESAI LOGIN GOOGLE LOKAL, SEKARANG AMAN KE REGISTER LOKAL
                    router.push('/register');
                    return;
                }
                console.error('Error exchanging code:', error.message);
            }

            // 2. Cek kembali jika session sudah ada dari cookies/local storage sebelumnya
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                router.push('/register');
            } else {
                router.push('/login?error=session_not_found');
            }
        };

        handleAuthCallback();
    }, [router]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#000', color: '#fff' }}>
            <p>Mengotentikasi akun Google, menyiapkan formulir pendaftaran...</p>
        </div>
    );
}