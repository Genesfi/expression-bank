"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const router = useRouter();
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [loading, setLoading] = useState(false);

    // State untuk form
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [code, setCode] = useState('');

    // Cek sesi login saat halaman dimuat
    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
            } else {
                setCheckingAuth(false);
            }
        };
        checkUser();
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    const handleInsert = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase
            .from('expressions')
            .insert([{ title, category, description, code }]);

        if (error) {
            alert('Gagal menyimpan: ' + error.message);
        } else {
            alert('Berhasil ditambah! Datanya otomatis masuk ke halaman depan.');
            // Reset form
            setTitle(''); setCategory(''); setDescription(''); setCode('');
        }
        setLoading(false);
    };

    if (checkingAuth) return <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">Memuat otorisasi...</div>;

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-gray-200 p-6 md:p-12 font-sans">
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-center mb-10 border-b border-gray-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Dashboard Admin</h1>
                        <p className="text-gray-500 mt-1">Tambah koleksi expression baru.</p>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => router.push('/')} className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition font-semibold">
                            Lihat Web
                        </button>
                        <button onClick={handleLogout} className="px-4 py-2 bg-red-900/50 text-red-400 border border-red-800 rounded-lg hover:bg-red-900 transition font-semibold">
                            Logout
                        </button>
                    </div>
                </header>

                <form onSubmit={handleInsert} className="bg-[#111111] p-8 border border-gray-800 rounded-2xl flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-gray-400">Judul Expression</label>
                            <input
                                type="text" required placeholder="Contoh: Bounce Anim"
                                className="w-full p-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white"
                                value={title} onChange={e => setTitle(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-gray-400">Kategori</label>
                            <input
                                type="text" required placeholder="Contoh: Scale, Position, Text"
                                className="w-full p-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white"
                                value={category} onChange={e => setCategory(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-400">Deskripsi Singkat</label>
                        <input
                            type="text" placeholder="Jelaskan fungsinya buat apa..."
                            className="w-full p-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white"
                            value={description} onChange={e => setDescription(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-400">Code Snippet</label>
                        <textarea
                            required placeholder="Paste expression After Effects di sini..."
                            className="w-full p-4 bg-[#050505] border border-gray-700 rounded-lg text-green-400 font-mono text-sm h-64 custom-scrollbar"
                            value={code} onChange={e => setCode(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit" disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-colors mt-2"
                    >
                        {loading ? 'Menyimpan ke Database...' : '+ Simpan Expression'}
                    </button>
                </form>
            </div>
        </main>
    );
}