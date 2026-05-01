import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function MagazineListPage() {
  const [magazines, setMagazines] = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/magazines`)
      .then(r => r.ok ? r.json() : [])
      .then(data => { setMagazines(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
      <div className="mb-10">
        <span className="inline-block rounded-sm bg-red-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-red-600">Publications</span>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900">Magazine</h1>
        <p className="mt-2 text-slate-500 max-w-xl">Browse our latest issues. Click any cover to open the full interactive reader.</p>
      </div>

      {loading && (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {[1,2,3,4,5].map(i => <div key={i} className="h-80 rounded-2xl bg-gray-100 animate-pulse" />)}
        </div>
      )}

      {!loading && magazines.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 p-16 text-center text-slate-400">
          <p className="text-4xl mb-3">📚</p>
          <p className="text-lg font-semibold">No magazines published yet</p>
        </div>
      )}

      {!loading && magazines.length > 0 && (
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {magazines.map(mag => (
            <Link key={mag._id} to={`/magazine/${mag._id}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              {/* Cover */}
              <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                {mag.coverUrl ? (
                  <img src={mag.coverUrl} alt={mag.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900">
                    <span className="text-5xl">📖</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition duration-300">
                  <span className="inline-block rounded-full bg-red-600 px-4 py-1.5 text-xs font-black text-white uppercase tracking-wider">Read Now →</span>
                </div>
                {mag.pages?.length > 0 && (
                  <span className="absolute top-3 right-3 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                    {mag.pages.length} pages
                  </span>
                )}
              </div>
              {/* Info */}
              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-sm font-bold text-slate-800 line-clamp-2 group-hover:text-red-700 transition">{mag.title}</h3>
                {mag.description && <p className="mt-1 text-xs text-slate-500 line-clamp-2">{mag.description}</p>}
                <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                  <p className="text-[11px] text-slate-400">{mag.author}</p>
                  <p className="text-[11px] text-slate-400">{mag.date}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}