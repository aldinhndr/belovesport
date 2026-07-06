'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButtonParticipant() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <button onClick={handleLogout} className="text-sm text-zinc-400 hover:text-red-400 transition">
      Logout
    </button>
  );
}