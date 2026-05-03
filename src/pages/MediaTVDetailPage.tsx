import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function MediaTVDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo]       = useState<any>(null);
  const [related, setRelated]   = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      fetch(`${API_URL}/media-tv/${id}`).then(r => r.ok ? r.json() : null),
      fetch(`${API_URL}/media-tv`).then(r => r.ok ? r.json() : []),
    ]).then(([vid, all]) => {
      if (!vid) { setNotFound(true); setLoading(false); return; }
      setVideo(vid);
      setRelated((all as any[]).filter(v => v._id !== id).slice(0, 6));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-500 border-t-transparent" />
    </div>
  );

  if (notFound || !video) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 text-white">
      <p className="text-xl font-bold">Video not found</p>
      <Link to="/section/mediatv" className="rounded-full bg-red-600 px-6 py-2 text-sm font-semibold hover:bg-red-700 transition">← Back to Media TV</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Top nav */}
      <div className="border-b border-white/10 bg-slate-900/80 backdrop-blur px-4 py-3">
        <div className="mx-auto max-w-7xl flex items-center gap-3">
          <Link to="/section/mediatv"
            className="flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white transition">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" /></svg>
            Media TV
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-sm text-slate-400 truncate max-w-xs">{video.title}</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
        <div className="grid gap-8 xl:grid-cols-[1fr_360px]">
          {/* Main video */}
          <div>
            {/* Player */}
            <div className="overflow-hidden rounded-2xl shadow-2xl shadow-black/60">
              <div className="relative aspect-video bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0&modestbranding=1&autoplay=1`}
                  title={video.title}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            {/* Video info */}
            <div className="mt-6">
              {video.category && (
                <span className="inline-block rounded-sm bg-red-600 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white mb-3">
                  {video.category}
                </span>
              )}
              <h1 className="text-2xl font-black text-white leading-tight lg:text-3xl">{video.title}</h1>
              {video.subtitle && <p className="mt-3 text-base text-slate-400 leading-relaxed">{video.subtitle}</p>}
              <div className="mt-4 flex items-center gap-4 border-t border-white/10 pt-4">
                <p className="text-sm text-slate-500">{video.date}</p>
                <a href={`https://www.youtube.com/watch?v=${video.youtubeId}`} target="_blank" rel="noopener noreferrer"
                  className="ml-auto flex items-center gap-2 rounded-lg border border-white/20 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-red-500 hover:text-red-400 transition">
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>
                  Watch on YouTube
                </a>
              </div>
            </div>
          </div>

          {/* Related videos */}
          {related.length > 0 && (
            <aside>
              <p className="mb-4 text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">More Videos</p>
              <div className="space-y-3">
                {related.map(v => (
                  <Link key={v._id} to={`/mediatv/${v._id}`}
                    className="group flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition hover:border-red-500/40 hover:bg-white/10">
                    <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-800">
                      <img src={`https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg`} alt={v.title} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600">
                          <svg className="ml-0.5 h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        </div>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      {v.category && <span className="text-[9px] font-black uppercase tracking-widest text-red-400">{v.category}</span>}
                      <p className="text-xs font-bold text-white line-clamp-2 group-hover:text-red-300 transition">{v.title}</p>
                      <p className="mt-1 text-[10px] text-slate-500">{v.date}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
