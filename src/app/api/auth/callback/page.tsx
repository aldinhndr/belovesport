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

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        // 🎯 SELESAI LOGIN GOOGLE, LEMPAR KE HALAMAN REGISTER / ONBOARDING
        router.push('/register');
      } else {
        router.push('/login?error=session_not_found');
      }
    };

    checkSession();
  }, [router]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#000', color: '#fff' }}>
      <p>Mengotentikasi akun Google Koko, menyiapkan formulir pendaftaran...</p>
    </div>
  );
}