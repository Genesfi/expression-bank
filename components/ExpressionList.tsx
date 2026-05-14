"use client";
import { useState, useMemo, useEffect } from 'react';

export default function ExpressionList({ data }: { data: any[] }) {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [copiedId, setCopiedId] = useState<number | null>(null);

    // State untuk Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Ekstrak kategori unik
    const categories = useMemo(() => {
        const uniqueCategories = Array.from(new Set(data.map(item => item.category)));
        return ['All', ...uniqueCategories];
    }, [data]);

    // Reset ke halaman 1 kalau filter berubah
    useEffect(() => {
        setCurrentPage(1);
    }, [search, selectedCategory]);

    // Logika Filter (Judul + Deskripsi + Isi Kode + Kategori)
    const filteredData = data.filter(item => {
        const keyword = search.toLowerCase();
        const matchSearch =
            item.title.toLowerCase().includes(keyword) ||
            (item.description && item.description.toLowerCase().includes(keyword)) ||
            (item.code && item.code.toLowerCase().includes(keyword)); // <-- Ini biar bisa cari pake isi kodenya

        const matchCategory = selectedCategory === 'All' || item.category === selectedCategory;
        return matchSearch && matchCategory;
    });

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const copyCode = (id: number, code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row gap-4 mb-10">
                {/* INPUT SEARCH DENGAN TOMBOL X */}
                <div className="relative flex-grow">
                    <input
                        type="text"
                        placeholder="Cari expression (judul, fungsi, atau kodenya)..."
                        className="w-full p-4 px-6 pr-12 bg-[#141414] border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {/* Tombol X (muncul kalau ada teks) */}
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </button>
                    )}
                </div>

                <div className="md:w-64">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full p-4 px-6 bg-[#141414] border border-gray-800 rounded-xl text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat === 'All' ? 'Semua Kategori' : cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* GRID LIST */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {paginatedData.map(item => (
                    <div key={item.id} className="flex flex-col p-6 border border-gray-800 rounded-2xl bg-[#111111] hover:border-gray-700 transition-colors shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-xl text-white mb-2">{item.title}</h3>
                                <span className="inline-block text-xs font-semibold tracking-wide bg-blue-900/40 text-blue-300 px-3 py-1 rounded-md border border-blue-800/50">
                                    {item.category}
                                </span>
                            </div>
                            <button
                                onClick={() => copyCode(item.id, item.code)}
                                className={`text-xs font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${copiedId === item.id
                                    ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700'
                                    }`}
                            >
                                {copiedId === item.id ? '✓ Copied' : '📋 Copy'}
                            </button>
                        </div>
                        <p className="text-gray-400 text-sm mb-6 leading-relaxed flex-grow">{item.description}</p>
                        <div className="relative group mt-auto">
                            <pre className="relative bg-[#050505] border border-gray-800 text-emerald-400 p-4 rounded-xl overflow-x-auto text-[13px] font-mono leading-normal custom-scrollbar">
                                <code>{item.code}</code>
                            </pre>
                        </div>
                    </div>
                ))}
            </div>

            {/* KONTROL PAGINATION */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-6 mt-12 mb-8">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-6 py-3 bg-[#141414] border border-gray-800 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition"
                    >← Prev</button>
                    <span className="text-gray-400 text-sm font-medium">Halaman <span className="text-white">{currentPage}</span> dari <span className="text-white">{totalPages}</span></span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-6 py-3 bg-[#141414] border border-gray-800 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition"
                    >Next →</button>
                </div>
            )}
        </div>
    );
}