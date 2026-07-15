import { supabaseServer } from '../utils/supabaseServer';
import ExpressionList from '../components/ExpressionList';

export const revalidate = 0;

export default async function Home() {
  const { data: expressions, error } = await supabaseServer
    .from('expressions')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-gray-200 p-6 md:p-12 font-sans selection:bg-blue-500/30">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 border-b border-gray-800 pb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 tracking-tight">
            Motion Expression Bank
          </h1>
          <p className="text-gray-400 mt-3 text-sm md:text-base">Kumpulan snippet andalan. Tinggal cari, copy, lalu paste di AE.</p>
        </header>

        {error ? (
          <div className="bg-red-900/20 text-red-400 p-4 rounded-lg border border-red-800">Error database: {error.message}</div>
        ) : (
          <ExpressionList data={expressions || []} />
        )}
      </div>
    </main>
  );
}