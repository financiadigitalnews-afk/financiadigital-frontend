import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdBanner } from '../components/AdBanner';
import { Hero } from '../components/Hero';
import { HeadlineSection } from '../components/HeadlineSection';
import { Article, articles as staticArticles } from '../data/siteData';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function toArticle(a: any): Article {
  return {
    id: a._id || a.id || '',
    title: a.title || '',
    subtitle: a.subtitle || '',
    content: a.content || '',
    image: a.imageUrl || a.image || '',
    author: a.author || '',
    date: a.date || '',
    category: a.category || '',
    region: a.region || '',
    featured: a.isFeatured || a.featured || false,
    topic: a.category || '',
    // Needed to sort Headline (merged from two collections) by real
    // creation time rather than the free-text `date` field, which an
    // admin could type in any format/order.
    ...(a.createdAt ? { createdAt: a.createdAt } : {}),
    ...(Array.isArray(a.hashtags) ? { hashtags: a.hashtags } : {}),
    ...(a.section ? { section: a.section } : {}),
    ...(a.videoId ? { videoId: a.videoId } : {}),
  } as Article & { createdAt?: string };
}

async function apiGet(path: string): Promise<any[]> {
  try {
    const r = await fetch(`${API_URL}${path}`);
    return r.ok ? r.json() : [];
  } catch { return []; }
}

async function fetchSectionHome(section: string, limit = 5): Promise<Article[]> {
  const data = await apiGet(`/section-articles/home/${section}?limit=${limit}`);
  if (section === 'video') return data;
  return data.map(toArticle);
}

async function fetchRegionHome(section: string, limit = 5): Promise<Article[]> {
  const data = await apiGet(`/region-articles/home-section/${section}?limit=${limit}`);
  return data.map(toArticle);
}

// Headline pulls from BOTH SectionArticle and RegionArticle (mirrors how
// the backend already treats 'hero' as cross-model). Each side is already
// capped server-side, but we merge + re-sort by real createdAt here and
// slice to 8 as a final guarantee regardless of which side contributed.
async function fetchHeadline(limit = 8): Promise<Article[]> {
  const [fromSections, fromRegions] = await Promise.all([
    fetchSectionHome('headline', limit),
    fetchRegionHome('headline', limit),
  ]);

  return [...fromSections, ...fromRegions]
    .sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, limit);
}

/* ─── Module-level cache ───
   Lives outside the component, so it survives route navigation within the
   same browser session (SPA — component unmounts/remounts, this doesn't).
   First visit: null → skeleton shows → fetch → cache filled → rendered.
   Every visit after: cache is already there → renders instantly, no
   skeleton, no refetch, no dummy-data flash. Clears on a hard page reload
   (which is what you want — a real reload should get fresh data). */
type HomeData = {
  latestNews: Article[];
  editorsArticles: Article[];
  centralAsia: Article[];
  middleEast: Article[];
  pakistan: Article[];
  asean: Article[];
  interviews: Article[];
  opinionArticles: Article[];
  headline: Article[];
};
let homeDataCache: HomeData | null = null;

/* ─── Section Label ─── */
function SectionLabel({ text, light = false }: { text: string; light?: boolean }) {
  return (
    <span className={`inline-block rounded-sm px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.3em] ${light ? 'bg-red-600 text-white' : 'bg-red-50 text-red-600'}`}>
      {text}
    </span>
  );
}

/* ─── Section Header ─── */
function SectionHeader({ eyebrow, title, href, light = false, action }: {
  eyebrow: string; title: string; href?: string; light?: boolean; action?: React.ReactNode;
}) {
  return (
    <div className={`mb-7 flex items-end justify-between border-b-2 pb-3 ${light ? 'border-red-500' : 'border-slate-800'}`}>
      <div>
        <SectionLabel text={eyebrow} light={light} />
        <h2 className={`mt-2 text-2xl font-black tracking-tight lg:text-3xl ${light ? 'text-white' : 'text-slate-900'}`}>{title}</h2>
      </div>
      <div className="flex items-center gap-3">
        {action}
        {href && (
          <Link to={href} className={`text-xs font-bold uppercase tracking-widest transition ${light ? 'text-red-300 hover:text-white' : 'text-red-600 hover:text-red-800'}`}>
            View All →
          </Link>
        )}
      </div>
    </div>
  );
}

/* ─── News Card — Large ─── */
function LargeCard({ article }: { article: Article }) {
  return (
    <Link to={`/article/${article.id}`} className="group block overflow-hidden bg-white border border-slate-200 hover:border-slate-300 transition hover:-translate-y-0.5 hover:shadow-lg rounded-2xl">
      {article.image && (
        <div className="aspect-[16/10] overflow-hidden">
          <img src={article.image} alt={article.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        </div>
      )}
      <div className="p-5">
        {article.category && <span className="text-[10px] font-black uppercase tracking-widest text-red-600">{article.category}</span>}
        <h3 className="mt-2 text-lg font-bold leading-snug text-slate-900 group-hover:text-red-700 transition line-clamp-3">{article.title}</h3>
        {article.subtitle && <p className="mt-1.5 text-sm text-slate-500 line-clamp-2">{article.subtitle}</p>}
        <p className="mt-3 text-xs text-slate-400">{article.author} · {article.date}</p>
      </div>
    </Link>
  );
}

/* ─── News Card — Compact Row ─── */
function CompactRow({ article, showImage = true }: { article: Article; showImage?: boolean }) {
  return (
    <Link to={`/article/${article.id}`}
      className="group flex gap-3 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0 hover:opacity-80 transition">
      {showImage && article.image && (
        <img src={article.image} alt={article.title} className="h-16 w-20 flex-shrink-0 rounded-lg object-cover" />
      )}
      <div className="min-w-0 flex-1">
        {article.category && <span className="text-[10px] font-black uppercase tracking-widest text-red-600">{article.category}</span>}
        <h4 className="mt-0.5 line-clamp-2 text-sm font-bold leading-snug text-slate-800 group-hover:text-red-700 transition">{article.title}</h4>
        <p className="mt-1 text-xs text-slate-400">{article.author} · {article.date}</p>
      </div>
    </Link>
  );
}

/* ─── News Card — Dark ─── */
function DarkCard({ article }: { article: Article }) {
  return (
    <Link to={`/article/${article.id}`} className="group block overflow-hidden rounded-xl bg-slate-800 hover:bg-slate-700 transition hover:-translate-y-0.5">
      {article.image && (
        <div className="aspect-[4/3] overflow-hidden">
          <img src={article.image} alt={article.title} className="h-full w-full object-cover opacity-90 transition group-hover:scale-105" />
        </div>
      )}
      <div className="p-4">
        {article.category && <span className="text-[10px] font-black uppercase tracking-widest text-red-400">{article.category}</span>}
        <h3 className="mt-1.5 line-clamp-2 text-sm font-bold text-white">{article.title}</h3>
        <p className="mt-1 text-xs text-slate-400">{article.author} · {article.date}</p>
      </div>
    </Link>
  );
}

/* ─── Breaking ticker ─── */
function BreakingTicker() {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/breaking-news`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setItems(Array.isArray(data) && data.length ? data : []));
  }, []);

  if (!items.length) return null;

  const tickerText = items.join('   •   ');

  return (
    <div className="border-b border-slate-200 bg-white">
      <style>
        {`
          @keyframes breakingTicker {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }

          .breaking-ticker-track {
            animation: breakingTicker 18s linear infinite;
          }
        `}
      </style>

      <div className="mx-auto flex max-w-7xl items-center px-4 lg:px-6">
        <span className="flex-shrink-0 bg-red-600 px-3 py-2 text-xs font-black uppercase tracking-wider text-white">
          Breaking
        </span>

        <div className="relative min-w-0 flex-1 overflow-hidden py-2">
          <div className="breaking-ticker-track whitespace-nowrap">
            <span className="px-6 text-sm font-semibold text-slate-800">
              {tickerText}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Skeleton pieces ─── */
function Shimmer({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-slate-200 ${className}`} />;
}

function HeadlineSkeleton() {
  return (
    <section className="bg-slate-950 py-8">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="mb-4 h-4 w-28 animate-pulse rounded bg-slate-800" />
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="aspect-[16/10] animate-pulse rounded-xl bg-slate-800" />
          <div className="grid gap-3">
            <div className="aspect-[16/9] animate-pulse rounded-xl bg-slate-800" />
            <div className="aspect-[16/9] animate-pulse rounded-xl bg-slate-800" />
            <div className="aspect-[16/9] animate-pulse rounded-xl bg-slate-800" />
          </div>
        </div>
      </div>
    </section>
  );
}

function CardGridSkeleton({ count = 5, dark = false }: { count?: number; dark?: boolean }) {
  return (
    <section className={`py-12 ${dark ? 'bg-slate-800' : 'bg-white'}`}>
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className={`mb-7 h-8 w-40 animate-pulse rounded ${dark ? 'bg-slate-700' : 'bg-slate-200'}`} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {Array.from({ length: count }).map((_, i) => (
            <Shimmer key={i} className={`aspect-[4/3] ${dark ? 'bg-slate-700' : ''}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── HomePage ─── */
export function HomePage() {
  // If we already have cached data from a previous visit this session,
  // hydrate state with it immediately — skips the loading state entirely.
  const [data, setData] = useState<HomeData | null>(homeDataCache);
  const [loading, setLoading] = useState(homeDataCache === null);

  const staticLatest  = useMemo(() => staticArticles.slice(0, 5), []);
  const staticEditors = useMemo(() => staticArticles.filter(a => a.featured).slice(0, 5), []);
  const staticIntv    = useMemo(() => staticArticles.filter(a => a.category === 'Interviews').slice(0, 4), []);

  useEffect(() => {
    // Cache already warm — nothing to fetch, nothing to flash.
    if (homeDataCache !== null) return;

    let cancelled = false;

    Promise.all([
      fetchSectionHome('latest-news',      5),
      fetchSectionHome('editors-articles', 5),
      fetchRegionHome('central-asia',      5),
      fetchRegionHome('middle-east',       5),
      fetchRegionHome('pakistan-home',     5),
      fetchRegionHome('asean-home',        6),
      fetchSectionHome('interviews',       5),
      fetchSectionHome('opinion',          5),
      fetchHeadline(8),
    ]).then(([ln, ea, ca, me, pk, as, iv, op, hl]) => {
      if (cancelled) return;

      const resolved: HomeData = {
        latestNews:      ln,
        editorsArticles: ea,
        centralAsia:     ca,
        middleEast:      me,
        pakistan:        pk,
        asean:           as,
        interviews:      iv,
        opinionArticles: op,
        headline:        hl,
      };

      homeDataCache = resolved;
      setData(resolved);
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, []);

  // While the FIRST load is in flight, show skeletons — never dummy data.
  if (loading || !data) {
    return (
      <div className="bg-slate-50">
        <HeadlineSkeleton />
        <CardGridSkeleton count={5} />
        <div className="h-[440px] animate-pulse bg-slate-800" />
        <CardGridSkeleton count={5} dark />
      </div>
    );
  }

  // Real data only falls back to static content if the API genuinely
  // returned nothing (not while still loading — that's the skeleton's job).
  const latest  = data.latestNews.length      ? data.latestNews      : staticLatest;
  const editors = data.editorsArticles.length ? data.editorsArticles : staticEditors;
  const intv    = data.interviews.length      ? data.interviews      : staticIntv;

  return (
    <div className="bg-slate-50">
      {/* ── HEADLINE (Top Stories) — new top section ── */}
      <HeadlineSection articles={data.headline} />

      <BreakingTicker />

      {/* ── LATEST NEWS ── */}
      {latest.length > 0 && (
        <section className="bg-white border-b border-slate-100 py-12">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <SectionHeader eyebrow="Today" title="Latest News" href="/section/latest-news" />
            <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="sm:col-span-2 lg:col-span-2">
                  <LargeCard article={latest[0]} />
                </div>
                <div className="flex flex-col gap-0 rounded-2xl border border-slate-200 bg-white p-5">
                  {latest.slice(1, 5).map(a => <CompactRow key={a.id} article={a} />)}
                </div>
              </div>
              <div className="hidden xl:block">
                <AdBanner vertical identifier="homepage-banner-1" />
              </div>
              <div className="xl:hidden">
                <AdBanner identifier="homepage-banner-1" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── HERO — moved here, after Latest News ── */}
      <Hero />

      {/* ── EDITOR'S ARTICLES ── */}
      {editors.length > 0 && (
        <section className="bg-slate-900 py-12">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <SectionHeader eyebrow="Editorial" title="Editor's Articles" href="/section/editors-articles" light />
            <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
              <Link to={`/article/${editors[0].id}`}
                className="group relative overflow-hidden rounded-2xl shadow-lg">
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={editors[0].image} alt={editors[0].title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="rounded-sm bg-red-600 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-white">{editors[0].category}</span>
                  <h3 className="mt-2 text-xl font-black text-white lg:text-2xl leading-tight">{editors[0].title}</h3>
                  {editors[0].subtitle && <p className="mt-1 text-sm text-white/70 line-clamp-2">{editors[0].subtitle}</p>}
                  <p className="mt-2 text-xs text-white/50">{editors[0].author} · {editors[0].date}</p>
                </div>
              </Link>

              <div className="flex flex-col gap-0 rounded-2xl border border-white/10 bg-white/5 p-5">
                {editors.slice(1, 5).map((a, i) => (
                  <Link key={a.id} to={`/article/${a.id}`}
                    className="group flex gap-3 border-b border-white/10 pb-4 pt-4 first:pt-0 last:border-b-0 last:pb-0 hover:opacity-80 transition">
                    <div className="flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-xs font-black text-white">
                      {i + 2}
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-black uppercase tracking-widest text-red-400">{a.category}</span>
                      <h4 className="mt-0.5 line-clamp-2 text-sm font-bold text-white group-hover:text-red-300 transition">{a.title}</h4>
                      <p className="mt-0.5 text-xs text-slate-400">{a.author} · {a.date}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── AD STRIP ── */}
      <section className="bg-white border-y border-slate-100 py-6">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            <AdBanner identifier="homepage-banner-2" />
            <AdBanner identifier="homepage-banner-3" />
          </div>
        </div>
      </section>

      {/* ── PAKISTAN ── */}
      {data.pakistan.length > 0 && (
        <section className="bg-emerald-900 py-12">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <SectionHeader eyebrow="Country" title="Pakistan" href="/world/pakistan" light />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {data.pakistan.map(a => <DarkCard key={a.id} article={a} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── CENTRAL ASIA ── */}
      {data.centralAsia.length > 0 && (
        <section className="bg-slate-800 py-12">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <SectionHeader eyebrow="Region" title="Central Asia" href="/world/central-asia" light />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {data.centralAsia.map(a => <DarkCard key={a.id} article={a} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── MIDDLE EAST ── */}
      {data.middleEast.length > 0 && (
        <section className="bg-slate-700 py-12">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <SectionHeader eyebrow="Region" title="Middle East" href="/world/middle-east" light />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {data.middleEast.map(a => <DarkCard key={a.id} article={a} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── ASEAN ── */}
      {data.asean.length > 0 && (
        <section className="border-b border-slate-100 bg-white py-12">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <SectionHeader eyebrow="South-East Asia" title="ASEAN" href="/world/asean" />
            <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
              <div className="hidden xl:block">
                <AdBanner vertical identifier="homepage-banner-4" />
              </div>
              <div className="grid gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <LargeCard article={data.asean[0]} />
                  {data.asean[1] && <LargeCard article={data.asean[1]} />}
                </div>
                {data.asean.length > 2 && (
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {data.asean.slice(2, 6).map(a => (
                      <Link key={a.id} to={`/article/${a.id}`}
                        className="group block border-l-2 border-red-200 pl-3 hover:border-red-500 transition">
                        <span className="text-[10px] font-black uppercase tracking-widest text-red-500">{a.category}</span>
                        <h4 className="mt-1 text-sm font-bold text-slate-800 group-hover:text-red-700 transition line-clamp-3">{a.title}</h4>
                        <p className="mt-1 text-xs text-slate-400">{a.date}</p>
                      </Link>
                    ))}
                  </div>
                )}
                <div className="xl:hidden">
                  <AdBanner identifier="homepage-banner-4" />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── INTERVIEWS ── */}
      {intv.length > 0 && (
        <section className="bg-slate-950 py-12">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <SectionHeader eyebrow="Conversations" title="Interviews" href="/section/interviews" light />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {intv.map(a => (
                <Link key={a.id} to={`/article/${a.id}`}
                  className="group relative overflow-hidden rounded-2xl aspect-[3/4]">
                  <img src={a.image} alt={a.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <span className="rounded-sm bg-red-600/80 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-white">Interview</span>
                    <h3 className="mt-2 line-clamp-3 text-sm font-bold leading-snug text-white">{a.title}</h3>
                    <p className="mt-2 text-xs text-white/50">{a.author} · {a.date}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── OPINION ── */}
      {data.opinionArticles.length > 0 && (
        <section className="bg-amber-50 py-12">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <SectionHeader eyebrow="Perspectives" title="Opinion" href="/section/opinion" />
            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {data.opinionArticles.slice(0, 4).map(a => (
                  <Link key={a.id} to={`/article/${a.id}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    {a.image && (
                      <div className="aspect-[16/9] overflow-hidden">
                        <img src={a.image} alt={a.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-4">
                      <svg className="mb-2 h-5 w-5 text-amber-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                      <span className="text-[10px] font-black uppercase tracking-widest text-red-600">{a.category}</span>
                      <h3 className="mt-1 line-clamp-3 flex-1 text-sm font-bold leading-snug text-slate-800 group-hover:text-red-700 transition">{a.title}</h3>
                      <div className="mt-3 flex items-center gap-2 border-t border-amber-100 pt-3">
                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-600 text-[10px] font-black text-white">
                          {(a.author || 'A').charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-800 truncate max-w-[100px]">{a.author}</p>
                          <p className="text-[10px] text-slate-400">{a.date}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="hidden lg:block">
                <AdBanner vertical identifier="homepage-banner-opinion" />
              </div>
              <div className="lg:hidden">
                <AdBanner identifier="homepage-banner-opinion" />
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
