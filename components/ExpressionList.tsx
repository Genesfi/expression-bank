"use client";
import { useState } from 'react';

export default function ExpressionList({ data }: { data: any[] }) {
    const [search, setSearch] = useState('');
    const [copiedId, setCopiedId] = useState<number | null>(null);

    const filteredData = data.filter(item => {
        const keyword = search.toLowerCase();

        return (
            // Cari di Judul
            item.title.toLowerCase().includes(keyword) ||
            // Cari di Kategori
            item.category.toLowerCase().includes(keyword) ||
            // Cari di Deskripsi (pakai pengecekan aman jaga-jaga kalau deskripsi kosong)
            (item.description && item.description.toLowerCase().includes(keyword)) ||
            // Cari di dalam Code Snippet-nya langsung
            (item.code && item.code.toLowerCase().includes(keyword))
        );
    });

    const copyCode = (id: number, code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000); // Tombol balik semula setelah 2 detik
    };

    return (
        <div className="w-full">
            {/* Kotak Pencarian */}
            <div className="relative mb-10">
                <input
                    type="text"
                    placeholder="Cari expression (misal: wiggle, text, position)..."
                    className="w-full p-4 px-6 bg-[#141414] border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Grid List Expression */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredData.map(item => (
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

            {filteredData.length === 0 && (
                <div className="text-center py-16 border border-dashed border-gray-800 rounded-2xl bg-[#0a0a0a]">
                    <p className="text-gray-500 text-lg">Waduh, "{search}" nggak ketemu nih.</p>
                </div>
            )}
        </div>
    );
}