import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AdBanner } from '../components/AdBanner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BATCH = 5;

const REGION_CONFIG: Record<string, { label: string; subCategories: { label: string; slug: string }[] }> = {
  asean:        { label: 'ASEAN',        subCategories: [{label:'Indonesia',slug:'indonesia'},{label:'Malaysia',slug:'malaysia'},{label:'Singapore',slug:'singapore'},{label:'Thailand',slug:'thailand'},{label:'Vietnam',slug:'vietnam'},{label:'Philippines',slug:'philippines'},{label:'Cambodia',slug:'cambodia'},{label:'Laos',slug:'laos'},{label:'Myanmar',slug:'myanmar'},{label:'Brunei',slug:'brunei'}] },
  china:        { label: 'China',        subCategories: [{label:'Economy',slug:'economy'},{label:'Trade',slug:'trade'},{label:'Technology',slug:'technology'},{label:'Foreign Policy',slug:'foreign-policy'},{label:'Security',slug:'security'},{label:'Belt and Road',slug:'belt-and-road'}] },
  'central-asia':{ label: 'Central Asia', subCategories: [{label:'Kazakhstan',slug:'kazakhstan'},{label:'Kyrgyzstan',slug:'kyrgyzstan'},{label:'Tajikistan',slug:'tajikistan'},{label:'Turkmenistan',slug:'turkmenistan'},{label:'Uzbekistan',slug:'uzbekistan'}] },
  caucasus:     { label: 'Caucasus',     subCategories: [{label:'Armenia',slug:'armenia'},{label:'Azerbaijan',slug:'azerbaijan'},{label:'Georgia',slug:'georgia'},{label:'South Caucasus',slug:'south-caucasus'}] },
  eurasia:      { label: 'Eurasia',      subCategories: [{label:'Russia',slug:'russia'},{label:'Eastern Europe',slug:'eastern-europe'},{label:'Caspian Region',slug:'caspian-region'},{label:'Energy Corridors',slug:'energy-corridors'},{label:'Security',slug:'security'},{label:'Trade Routes',slug:'trade-routes'}] },
  americas:     { label: 'Americas',     subCategories: [{label:'North America',slug:'north-america'},{label:'Latin America',slug:'latin-america'},{label:'Caribbean',slug:'caribbean'},{label:'South America',slug:'south-america'},{label:'Trade',slug:'trade'},{label:'Security',slug:'security'}] },
};

function toArticle(a: any) {
  return {
    id: a._id || a.id || '',
    title: a.title || '',
    subtitle: a.subtitle || '',
    image: a.imageUrl || a.image || '',
    author: a.author || '',
    date: a.date || '',
    category: a.category || '',
    featured: a.isFeatured || false,
    archived: a.isArchived || false,
    hashtags: Array.isArray(a.hashtags) ? a.hashtags : [],
    galleryImages: Array.isArray(a.galleryImages) ? a.galleryImages : [],
    subCategory: a.subCategory || '',
  };
}

function ArticleCard({ article }: { article: ReturnType<typeof toArticle> }) {
  return (
    <Link to={`/article/${article.id}`}
      className="group flex gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md">
      {article.image && (
        <img src={article.image} alt={article.title} className="h-24 w-32 flex-shrink-0 rounded-xl object-cover" />
      )}
      <div className="min-w-0 flex-1">
        {article.category && <p className="text-[11px] font-bold uppercase tracking-widest text-red-600 mb-1">{article.category}</p>}
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-slate-800 group-hover:text-red-600 transition">{article.title}</h3>
        {article.subtitle && <p className="mt-1 line-clamp-2 text-xs text-slate-500">{article.subtitle}</p>}
        <p className="mt-2 text-xs text-slate-400">{article.author}{article.author && article.date && ' · '}{article.date}</p>
      </div>
    </Link>
  );
}

function ArticleSection({ title, articles: all }: { title: string; articles: ReturnType<typeof toArticle>[] }) {
  const [visible, setVisible] = useState(BATCH);
  if (all.length === 0) return null;
  const shown = all.slice(0, visible);
  return (
    <div className="mb-10">
      <p className="mb-4 text-xs font-bold uppercase tracking-widest text-red-600">{title}</p>
      <div className="space-y-3">
        {shown.map(a => <ArticleCard key={a.id} article={a} />)}
      </div>
      {visible < all.length && (
        <div className="mt-5 flex justify-center">
          <button onClick={() => setVisible(v => v + BATCH)}
            className="rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            Load More ({all.length - visible} remaining)
          </button>
        </div>
      )}
    </div>
  );
}

export function WorldPage() {
  const { area = '', subCategory: subParam = '' } = useParams<{ area: string; subCategory?: string }>();
  const config = REGION_CONFIG[area];

  const [allArticles, setAllArticles] = useState<ReturnType<typeof toArticle>[]>([]);
  const [loading, setLoading]         = useState(true);
  const [activeSub, setActiveSub]     = useState(subParam || '');

  // Sync URL sub-category param
  useEffect(() => { setActiveSub(subParam || ''); }, [subParam]);

  useEffect(() => {
    if (!area) return;
    setLoading(true);
    const url = `${API_URL}/region-articles/region/${area}`;
    fetch(url)
      .then(r => r.ok ? r.json() : [])
      .then(data => { setAllArticles(data.map(toArticle)); setLoading(false); })
      .catch(() => setLoading(false));
  }, [area]);

  const filtered = useMemo(() => {
    if (!activeSub) return allArticles;
    return allArticles.filter(a => a.subCategory === activeSub);
  }, [allArticles, activeSub]);

  const featured = filtered.filter(a => a.featured && !a.archived);
  const latest   = filtered.filter(a => !a.archived);
  const archived = filtered.filter(a => a.archived);

  if (!config) return (
    <div className="mx-auto max-w-7xl px-4 py-20 text-center text-slate-500">
      <p className="text-lg font-semibold">Region not found</p>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-2">World Coverage</p>
        <h1 className="text-4xl font-black text-slate-900">{config.label}</h1>
        <p className="mt-2 text-slate-500 max-w-2xl">In-depth analysis, diplomacy and regional reporting from {config.label}.</p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[220px,1fr,300px]">
        {/* Left sidebar — sub-categories */}
        <aside>
          <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-4">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">Categories</p>
            <div className="space-y-1">
              <button
                onClick={() => setActiveSub('')}
                className={`w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${!activeSub ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
              >
                All {config.label}
              </button>
              {config.subCategories.map(sc => (
                <Link
                  key={sc.slug}
                  to={`/world/${area}/${sc.slug}`}
                  onClick={() => setActiveSub(sc.slug)}
                  className={`block w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${activeSub === sc.slug ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
                >
                  {sc.label}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main>
          {loading && (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-28 rounded-2xl bg-slate-100 animate-pulse" />)}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 p-16 text-center text-slate-400">
              <p className="text-lg font-semibold">No articles yet</p>
              <p className="mt-1 text-sm">{activeSub ? 'Try selecting a different category.' : `Add articles from Admin → All Pages Handling → ${config.label}`}</p>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <>
              <ArticleSection title="Featured" articles={featured} />
              <ArticleSection title="Latest"   articles={latest} />
              <ArticleSection title="Archived" articles={archived} />
            </>
          )}
        </main>

        {/* Right sidebar — ad */}
        <aside className="hidden xl:block">
          <div className="sticky top-6">
            <AdBanner vertical />
          </div>
        </aside>
      </div>
    </div>
  );
}