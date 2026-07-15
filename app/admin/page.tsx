"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const router = useRouter();
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [loading, setLoading] = useState(false);

    // State untuk list data
    const [expressions, setExpressions] = useState<any[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // State untuk form
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [code, setCode] = useState('');

    // Cek Auth dan Ambil Data
    useEffect(() => {
        const checkUser = async () => {
            try {
                const res = await fetch('/api/auth/session');
                const data = await res.json();
                if (!data.session) {
                    router.push('/login');
                } else {
                    setCheckingAuth(false);
                    fetchExpressions(); // Panggil data kalau sudah login
                }
            } catch {
                router.push('/login');
            }
        };
        checkUser();
    }, [router]);

    async function fetchExpressions() {
        try {
            const res = await fetch('/api/expressions');
            const data = await res.json();
            if (data.data) setExpressions(data.data);
        } catch {}
    }

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
        } catch {}
        router.push('/');
    };

    // Simpan Data (Insert atau Update)
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editingId) {
                // Mode Update
                const res = await fetch('/api/expressions', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: editingId, title, category, description, code }),
                });
                const data = await res.json();

                if (res.ok) alert('Data berhasil diupdate!');
                else alert('Gagal update: ' + (data.error || 'Terjadi kesalahan.'));
            } else {
                // Mode Insert
                const res = await fetch('/api/expressions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, category, description, code }),
                });
                const data = await res.json();

                if (res.ok) alert('Expression baru berhasil ditambah!');
                else alert('Gagal menyimpan: ' + (data.error || 'Terjadi kesalahan.'));
            }
        } catch (err: any) {
            alert('Terjadi kesalahan koneksi: ' + err.message);
        }

        resetForm();
        fetchExpressions(); // Refresh tabel
        setLoading(false);
    };

    // Persiapan Edit Data
    const handleEdit = (item: any) => {
        setEditingId(item.id);
        setTitle(item.title);
        setCategory(item.category);
        setDescription(item.description || '');
        setCode(item.code);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll ke atas otomatis
    };

    // Hapus Data
    const handleDelete = async (id: number) => {
        if (!confirm('Yakin mau hapus expression ini?')) return;

        try {
            const res = await fetch(`/api/expressions?id=${id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (res.ok) {
                fetchExpressions(); // Refresh tabel setelah hapus
            } else {
                alert('Gagal menghapus: ' + (data.error || 'Terjadi kesalahan.'));
            }
        } catch (err: any) {
            alert('Terjadi kesalahan koneksi: ' + err.message);
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setTitle(''); setCategory(''); setDescription(''); setCode('');
    };

    if (checkingAuth) return <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">Memuat otorisasi...</div>;

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-gray-200 p-6 md:p-12 font-sans">
            <div className="max-w-5xl mx-auto">
                <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-10 border-b border-gray-800 pb-6 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Dashboard Admin</h1>
                        <p className="text-gray-500 mt-1">Kelola koleksi expression kamu.</p>
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

                {/* FORM INPUT / UPDATE */}
                <div className="bg-[#111111] p-8 border border-gray-800 rounded-2xl mb-12 shadow-lg">
                    <h2 className="text-xl font-bold text-white mb-6">
                        {editingId ? '✏️ Edit Expression' : '✨ Tambah Expression Baru'}
                    </h2>
                    <form onSubmit={handleSave} className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-400">Judul Expression</label>
                                <input
                                    type="text" required placeholder="Contoh: Bounce Anim"
                                    className="w-full p-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                    value={title} onChange={e => setTitle(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-400">Kategori</label>
                                <input
                                    type="text" required placeholder="Contoh: Scale, Position, Text"
                                    className="w-full p-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                    value={category} onChange={e => setCategory(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2 text-gray-400">Deskripsi Singkat</label>
                            <input
                                type="text" placeholder="Jelaskan fungsinya buat apa..."
                                className="w-full p-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                value={description} onChange={e => setDescription(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2 text-gray-400">Code Snippet</label>
                            <textarea
                                required placeholder="Paste expression After Effects di sini..."
                                className="w-full p-4 bg-[#050505] border border-gray-700 rounded-lg text-green-400 font-mono text-sm h-48 custom-scrollbar focus:outline-none focus:border-blue-500"
                                value={code} onChange={e => setCode(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-4 mt-2">
                            <button
                                type="submit" disabled={loading}
                                className={`flex-1 font-bold py-4 rounded-xl transition-colors ${editingId ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                    }`}
                            >
                                {loading ? 'Menyimpan...' : (editingId ? 'Update Expression' : '+ Simpan Expression')}
                            </button>

                            {editingId && (
                                <button
                                    type="button" onClick={resetForm}
                                    className="px-6 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-700 transition"
                                >
                                    Batal
                                </button>
                            )}
                        </div>
                    </form>
                </div>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Cari di dashboard..."
                        className="p-2 bg-[#1a1a1a] border border-gray-700 rounded text-sm w-full md:w-64 focus:border-blue-500 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {/* TABEL LIST DATA */}
                <h2 className="text-xl font-bold text-white mb-6">Daftar Expression ({expressions.length})</h2>
                <div className="bg-[#111111] border border-gray-800 rounded-2xl overflow-hidden shadow-lg">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#1a1a1a] border-b border-gray-800 text-gray-400 text-sm">
                                    <th className="p-4 font-semibold">Judul</th>
                                    <th className="p-4 font-semibold">Kategori</th>
                                    <th className="p-4 font-semibold w-1/3">Deskripsi</th>
                                    <th className="p-4 font-semibold text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800 text-sm">
                                {expressions
                                    .filter(item =>
                                        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        item.code.toLowerCase().includes(searchTerm.toLowerCase())
                                    )
                                    .map((item) => (
                                        <tr key={item.id} className="hover:bg-[#151515] transition-colors">
                                            <td className="p-4 font-medium text-white">{item.title}</td>
                                            <td className="p-4"><span className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs">{item.category}</span></td>
                                            <td className="p-4 text-gray-500 truncate max-w-xs">{item.description}</td>
                                            <td className="p-4 text-right">
                                                <button onClick={() => handleEdit(item)} className="text-blue-400 hover:text-blue-300 font-semibold mr-4 transition">
                                                    Edit
                                                </button>
                                                <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-400 font-semibold transition">
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                {expressions.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-gray-500">Belum ada data.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </main>
    );
}