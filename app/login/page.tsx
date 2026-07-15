"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            if (res.ok && data.success) {
                router.push('/admin');
            } else {
                alert('Gagal login: ' + (data.error || 'Email atau password salah.'));
                setLoading(false);
            }
        } catch {
            alert('Gagal menghubungi server.');
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 text-gray-200">
            <div className="w-full max-w-md bg-[#111111] p-8 border border-gray-800 rounded-2xl shadow-2xl">
                <h1 className="text-3xl font-bold mb-2 text-white">Login Admin</h1>
                <p className="text-gray-500 mb-8 text-sm">Masuk untuk tambah expression baru.</p>

                <form onSubmit={handleLogin} className="flex flex-col gap-5">
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-400">Email</label>
                        <input
                            type="email" required
                            className="w-full p-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            value={email} onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-400">Password</label>
                        <input
                            type="password" required
                            className="w-full p-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            value={password} onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit" disabled={loading}
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
                    >
                        {loading ? 'Mengecek...' : 'Masuk'}
                    </button>
                </form>
            </div>
        </main>
    );
}