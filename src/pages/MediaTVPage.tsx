import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CATEGORIES = ['All'];

export function MediaTVPage() {
  const [videos, setVideos]       = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [activeCategory, setActiveCat] = useState('All');
  const [featured, setFeatured]   = useState<any>(null);

  useEffect(() => {
    fetch(`${API_URL}/media-tv`)
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        setVideos(data);
        if (data.length > 0) setFeatured(data[0]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = ['All', ...Array.from(new Set(videos.map((v: any) => v.category).filter(Boolean)))];
  const filtered = activeCategory === 'All' ? videos : videos.filter(v => v.category === activeCategory);
  const gridVideos = filtered.filter(v => v._id !== featured?._id);

  if (loading) return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
      <div className="mb-8 h-8 w-48 rounded-lg bg-gray-100 animate-pulse" />
      <div className="mb-8 aspect-video w-full rounded-2xl bg-gray-100 animate-pulse" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[1,2,3,4].map(i => <div key={i} className="aspect-video rounded-xl bg-gray-100 animate-pulse" />)}
      </div>
    </div>
  );

  return (
    <div className="bg-slate-950 min-h-screen">
      {/* Page header */}
      <div className="border-b border-white/10 bg-slate-900 px-4 py-8 lg:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between">
            <div>
              <span className="inline-block rounded-sm bg-red-600 px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-white">Live & On-Demand</span>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-white lg:text-5xl">Media <span className="text-red-500">TV</span></h1>
              <p className="mt-2 text-slate-400 max-w-xl">Watch interviews, documentaries, analysis and live coverage from our team.</p>
            </div>
            <div className="hidden items-center gap-2 md:flex">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
              <span className="text-sm font-bold text-white">{videos.length} Videos</span>
            </div>
          </div>

          {/* Category filter */}
          {categories.length > 1 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveCat(cat)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                    activeCategory === cat
                      ? 'bg-red-600 text-white shadow-lg shadow-red-900/40'
                      : 'border border-white/20 text-slate-300 hover:border-white/40 hover:text-white'
                  }`}>
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
        {videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-500">
            <span className="text-6xl mb-4">📺</span>
            <p className="text-xl font-bold text-slate-400">No videos published yet</p>
            <p className="mt-2 text-sm">Check back soon for the latest coverage.</p>
          </div>
        ) : (
          <>
            {/* Featured hero video */}
            {featured && activeCategory === 'All' && (
              <div className="mb-10">
                <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
                  {/* Main player */}
                  <Link to={`/mediatv/${featured._id}`} className="group relative block overflow-hidden rounded-2xl bg-black shadow-2xl shadow-black/50">
                    <div className="relative aspect-video overflow-hidden">
                      <img src={`https://img.youtube.com/vi/${featured.youtubeId}/maxresdefault.jpg`}
                        alt={featured.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105 opacity-80" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      {/* Play button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 shadow-2xl shadow-red-900/60 transition group-hover:scale-110 group-hover:bg-red-500">
                          <svg className="ml-1 h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        </div>
                      </div>
                      {/* Info overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        {featured.category && (
                          <span className="inline-block rounded-sm bg-red-600 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-white mb-3">
                            {featured.category}
                          </span>
                        )}
                        <h2 className="text-xl font-black text-white leading-tight lg:text-2xl line-clamp-2">{featured.title}</h2>
                        {featured.subtitle && <p className="mt-2 text-sm text-white/70 line-clamp-2">{featured.subtitle}</p>}
                        <p className="mt-2 text-xs text-white/50">{featured.date}</p>
                      </div>
                    </div>
                  </Link>

                  {/* Next up list */}
                  <div className="flex flex-col gap-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mb-1">Up Next</p>
                    {videos.slice(1, 5).map(v => (
                      <Link key={v._id} to={`/mediatv/${v._id}`}
                        className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition hover:border-red-500/40 hover:bg-white/10">
                        <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-800">
                          <img src={`https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg`} alt={v.title} className="h-full w-full object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600">
                              <svg className="ml-0.5 h-2 w-2 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                            </div>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          {v.category && <span className="text-[9px] font-black uppercase tracking-widest text-red-400">{v.category}</span>}
                          <p className="text-xs font-bold text-white line-clamp-2 group-hover:text-red-300 transition">{v.title}</p>
                          <p className="mt-0.5 text-[10px] text-slate-500">{v.date}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Video grid */}
            {gridVideos.length > 0 && (
              <>
                <p className="mb-5 text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">
                  {activeCategory === 'All' ? 'All Videos' : activeCategory}
                </p>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {gridVideos.map(v => (
                    <Link key={v._id} to={`/mediatv/${v._id}`}
                      className="group block overflow-hidden rounded-xl bg-slate-900 border border-white/10 transition hover:border-red-500/40 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-900/20">
                      <div className="relative aspect-video overflow-hidden">
                        <img src={`https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg`}
                          alt={v.title}
                          className="h-full w-full object-cover opacity-80 transition duration-300 group-hover:scale-105 group-hover:opacity-100" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-600 shadow-lg transition group-hover:scale-110">
                            <svg className="ml-0.5 h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                          </div>
                        </div>
                        {v.category && (
                          <span className="absolute top-2 left-2 rounded-sm bg-red-600 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-white">
                            {v.category}
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-bold text-white line-clamp-2 group-hover:text-red-300 transition">{v.title}</h3>
                        {v.subtitle && <p className="mt-1 text-[11px] text-slate-400 line-clamp-2">{v.subtitle}</p>}
                        <p className="mt-2 text-[10px] text-slate-500">{v.date}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
