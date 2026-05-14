"use client";
import { useState, useMemo, useEffect } from 'react';

export default function ExpressionList({ data }: { data: any[] }) {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [copiedId, setCopiedId] = useState<number | null>(null);

    // State untuk Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Ekstrak kategori unik dari data yang ada di database otomatis
    const categories = useMemo(() => {
        const uniqueCategories = Array.from(new Set(data.map(item => item.category)));
        return ['All', ...uniqueCategories];
    }, [data]);

    // Reset ke halaman 1 kalau user lagi ngetik pencarian atau ganti kategori
    useEffect(() => {
        setCurrentPage(1);
    }, [search, selectedCategory]);

    // Logika Filter (Pencarian + Kategori)
    const filteredData = data.filter(item => {
        const keyword = search.toLowerCase();

        // Cek pencarian teks
        const matchSearch =
            item.title.toLowerCase().includes(keyword) ||
            (item.description && item.description.toLowerCase().includes(keyword)) ||
            (item.code && item.code.toLowerCase().includes(keyword));

        // Cek dropdown kategori
        const matchCategory = selectedCategory === 'All' || item.category === selectedCategory;

        return matchSearch && matchCategory;
    });

    // Logika Pemotongan Data (Pagination)
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
            {/* KOTAK PENCARIAN & FILTER KATEGORI */}
            <div className="flex flex-col md:flex-row gap-4 mb-10">
                <div className="relative flex-grow">
                    <input
                        type="text"
                        placeholder="Cari expression (misal: wiggle, math)..."
                        className="w-full p-4 px-6 bg-[#141414] border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="md:w-64">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full p-4 px-6 bg-[#141414] border border-gray-800 rounded-xl text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>
                                {cat === 'All' ? 'Semua Kategori' : cat}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* GRID LIST EXPRESSION (Hanya menampilkan data yang sudah di-paginate) */}
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

                        <p className="text-gray-400 text-sm mb-6 leading-relaxed flex-grow">
                            {item.description}
                        </p>

                        <div className="relative group mt-auto">
                            <pre className="relative bg-[#050505] border border-gray-800 text-emerald-400 p-4 rounded-xl overflow-x-auto text-[13px] font-mono leading-normal custom-scrollbar">
                                <code>{item.code}</code>
                            </pre>
                        </div>
                    </div>
                ))}
            </div>

            {/* JIKA DATA KOSONG */}
            {filteredData.length === 0 && (
                <div className="text-center py-16 border border-dashed border-gray-800 rounded-2xl bg-[#0a0a0a] mt-6">
                    <p className="text-gray-500 text-lg">Expression tidak ditemukan.</p>
                </div>
            )}

            {/* KONTROL PAGINATION */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-6 mt-12 mb-8">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-6 py-3 bg-[#141414] border border-gray-800 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition"
                    >
                        ← Prev
                    </button>

                    <span className="text-gray-400 text-sm font-medium">
                        Halaman <span className="text-white">{currentPage}</span> dari <span className="text-white">{totalPages}</span>
                    </span>

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-6 py-3 bg-[#141414] border border-gray-800 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition"
                    >
                        Next →
                    </button>
                </div>
            )}
        </div>
    );
}