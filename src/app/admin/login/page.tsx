'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();

            if (!res.ok || !data.success) {
                setError(data.message ?? 'Login gagal. Periksa kembali kredensial Anda.');
                setIsLoading(false);
                return;
            }

            router.push('/admin/dashboard');
            router.refresh();
        } catch {
            setError('Tidak dapat terhubung ke server. Coba lagi.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Belove<span className="text-amber-400">sport</span>
                    </h1>
                    <p className="text-zinc-500 text-sm mt-2">Command Center Admin Access</p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-[#13131a] border border-zinc-800 rounded-2xl p-8 shadow-2xl shadow-black/40"
                >
                    <div className="mb-5">
                        <label htmlFor="username" className="block text-zinc-400 text-sm mb-2">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoComplete="username"
                            className="w-full bg-[#0a0a0f] border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition"
                            placeholder="admin_belove"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-zinc-400 text-sm mb-2">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                            className="w-full bg-[#0a0a0f] border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="mb-5 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-2.5">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-amber-400 hover:bg-amber-300 disabled:bg-zinc-700 disabled:text-zinc-400 text-black font-semibold rounded-lg py-2.5 transition"
                    >
                        {isLoading ? 'Memverifikasi...' : 'Masuk'}
                    </button>
                </form>

                <p className="text-center text-zinc-600 text-xs mt-6">
                    Akses terbatas. Hanya untuk administrator Belovesport.
                </p>
            </div>
        </div>
    );
}