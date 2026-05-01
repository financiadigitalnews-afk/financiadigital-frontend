import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function MagazineReaderPage() {
  const { id } = useParams<{ id: string }>();
  const [magazine, setMagazine] = useState<any>(null);
  const [loading, setLoading]   = useState(true);
  const [currentPage, setCurrentPage] = useState(0); // 0 = cover
  const [flipping, setFlipping]       = useState(false);
  const [flipDir, setFlipDir]         = useState<'next'|'prev'>('next');
  const [thumbOpen, setThumbOpen]     = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`${API_URL}/magazines/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { setMagazine(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  // All pages: cover (index 0) + actual pages
  const allPages = magazine ? [
    { url: magazine.coverUrl, isCover: true },
    ...(magazine.pages || []).map((p: any) => ({ url: p.url, isCover: false })),
  ] : [];

  const totalPages = allPages.length;
  const isFirst    = currentPage === 0;
  const isLast     = currentPage === totalPages - 1;

  const goTo = useCallback((idx: number) => {
    if (idx < 0 || idx >= totalPages || flipping) return;
    setFlipDir(idx > currentPage ? 'next' : 'prev');
    setFlipping(true);
    setTimeout(() => {
      setCurrentPage(idx);
      setFlipping(false);
    }, 280);
  }, [currentPage, totalPages, flipping]);

  const next = useCallback(() => goTo(currentPage + 1), [goTo, currentPage]);
  const prev = useCallback(() => goTo(currentPage - 1), [goTo, currentPage]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft')  prev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [next, prev]);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-500 border-t-transparent" />
    </div>
  );

  if (!magazine) return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-900 text-white">
      <p className="text-xl font-bold">Magazine not found</p>
      <Link to="/section/magazine" className="rounded-full bg-red-600 px-6 py-2 text-sm font-semibold hover:bg-red-700 transition">← Back</Link>
    </div>
  );

  const currentImg = allPages[currentPage]?.url;

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-white/10 bg-slate-900/80 px-4 py-3 backdrop-blur">
        <Link to="/section/magazine" className="flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white transition">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" /></svg>
          All Magazines
        </Link>
        <div className="text-center">
          <p className="text-sm font-bold text-white truncate max-w-xs">{magazine.title}</p>
          <p className="text-[11px] text-slate-400">{magazine.author} · {magazine.date}</p>
        </div>
        <button onClick={() => setThumbOpen(o => !o)}
          className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${thumbOpen ? 'border-red-500 bg-red-600 text-white' : 'border-white/20 text-slate-300 hover:border-white/40 hover:text-white'}`}>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
          Pages
        </button>
      </header>

      {/* Thumbnail strip */}
      {thumbOpen && (
        <div className="border-b border-white/10 bg-slate-900 px-4 py-3">
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin] [scrollbar-color:#475569_transparent]">
            {allPages.map((pg, i) => (
              <button key={i} onClick={() => { goTo(i); setThumbOpen(false); }}
                className={`relative shrink-0 overflow-hidden rounded-lg border-2 transition ${i === currentPage ? 'border-red-500 shadow-lg shadow-red-900/50' : 'border-transparent hover:border-white/30'}`}>
                {pg.url ? (
                  <img src={pg.url} alt={`Page ${i}`} className="h-16 w-11 object-cover" />
                ) : (
                  <div className="h-16 w-11 bg-slate-700 flex items-center justify-center text-slate-500 text-[10px]">N/A</div>
                )}
                <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[8px] text-white font-bold text-center py-0.5">
                  {i === 0 ? 'Cover' : i}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Book reader */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 select-none">
        {/* Page display */}
        <div className="relative w-full max-w-2xl">
          {/* Book shadow */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-4/5 h-8 bg-black/40 blur-xl rounded-full" />

          {/* Page */}
          <div
            style={{ perspective: '1200px' }}
            className="relative w-full"
          >
            <div
              className={`relative w-full transition-all duration-300 ease-in-out ${
                flipping
                  ? flipDir === 'next'
                    ? 'opacity-0 scale-x-95 translate-x-4'
                    : 'opacity-0 scale-x-95 -translate-x-4'
                  : 'opacity-100 scale-100 translate-x-0'
              }`}
            >
              {currentImg ? (
                <img
                  src={currentImg}
                  alt={currentPage === 0 ? 'Cover' : `Page ${currentPage}`}
                  className="w-full rounded-lg shadow-2xl shadow-black/60 object-contain max-h-[75vh] mx-auto block"
                  style={{ minHeight: '400px' }}
                />
              ) : (
                <div className="w-full aspect-[3/4] max-h-[75vh] rounded-lg bg-slate-800 flex items-center justify-center shadow-2xl">
                  <div className="text-center text-slate-500">
                    <span className="text-6xl block mb-3">📄</span>
                    <p className="text-sm">Page {currentPage}</p>
                  </div>
                </div>
              )}

              {/* Page number label */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
                {currentPage === 0 ? 'Cover' : `Page ${currentPage} of ${totalPages - 1}`}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center gap-4">
          <button onClick={prev} disabled={isFirst || flipping}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>

          {/* Page dots / progress */}
          <div className="flex items-center gap-1.5">
            {totalPages <= 12 ? (
              allPages.map((_, i) => (
                <button key={i} onClick={() => goTo(i)}
                  className={`rounded-full transition-all ${i === currentPage ? 'h-2.5 w-6 bg-red-500' : 'h-2 w-2 bg-white/30 hover:bg-white/50'}`} />
              ))
            ) : (
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <div className="h-1.5 w-32 rounded-full bg-white/20 overflow-hidden">
                  <div className="h-full rounded-full bg-red-500 transition-all duration-300"
                    style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }} />
                </div>
                <span className="text-[11px] font-semibold">
                  {currentPage === 0 ? 'Cover' : `${currentPage}/${totalPages - 1}`}
                </span>
              </div>
            )}
          </div>

          <button onClick={next} disabled={isLast || flipping}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        <p className="mt-4 text-[11px] text-slate-500">Use arrow keys ← → to navigate</p>
      </div>
    </div>
  );
}