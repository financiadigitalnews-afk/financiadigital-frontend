
// import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { AdBanner } from '../components/AdBanner';
// import { Article } from '../data/siteData';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// function toArticle(a: any): Article {
//   return {
//     id: a._id || a.id || '',
//     title: a.title || '',
//     subtitle: a.subtitle || '',
//     content: a.content || '',
//     image: a.imageUrl || '',
//     author: a.author || '',
//     date: a.date || '',
//     category: a.category || '',
//     region: '',
//     featured: a.isFeatured || false,
//     archived: a.isArchived || false,
//     topic: a.category || '',
//     ...(Array.isArray(a.hashtags) ? { hashtags: a.hashtags } : {}),
//     ...(a.section ? { section: a.section } : {}),
//     ...(a.videoId ? { videoId: a.videoId } : {}),
//   } as Article;
// }

// function QuoteIcon() {
//   return (
//     <svg className="h-8 w-8 text-accent/40" fill="currentColor" viewBox="0 0 24 24">
//       <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
//     </svg>
//   );
// }

// const FEATURED_BATCH = 6;
// const GRID_BATCH = 4;

// export function OpinionPage() {
//   const [articles, setArticles] = useState<Article[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [featuredVisible, setFeaturedVisible] = useState(FEATURED_BATCH);
//   const [latestVisible, setLatestVisible] = useState(GRID_BATCH);
//   const [archivedVisible, setArchivedVisible] = useState(GRID_BATCH);

//   useEffect(() => {
//     fetch(`${API_URL}/section-articles/section/opinion`)
//       .then((r) => r.ok ? r.json() : [])
//       .then((data) => setArticles(data.map(toArticle)))
//       .catch(() => setArticles([]))
//       .finally(() => setLoading(false));
//   }, []);

//   const featuredAll = articles.filter((a) => a.featured && !a.archived);
//   const latestAll = articles.filter((a) => !a.archived);
//   const archivedAll = articles.filter((a) => a.archived);

//   const visibleFeatured = featuredAll.slice(0, featuredVisible);
//   const visibleLatest = latestAll.slice(0, latestVisible);
//   const visibleArchived = archivedAll.slice(0, archivedVisible);

//   const canLoadMoreFeatured = featuredVisible < featuredAll.length;
//   const canLoadMoreLatest = latestVisible < latestAll.length;
//   const canLoadMoreArchived = archivedVisible < archivedAll.length;

//   if (loading) {
//     return (
//       <div className="flex min-h-[50vh] items-center justify-center">
//         <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-amber-50">
//       <div className="bg-gradient-to-br from-slate-900 to-slate-800 px-4 py-16 text-center text-white">
//         <span className="inline-block rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent">
//           Opinion
//         </span>
//         <h1 className="mt-4 text-5xl font-black tracking-tight">Voices & Views</h1>
//         <p className="mx-auto mt-4 max-w-xl text-slate-300">
//           Perspectives from analysts, contributors and thought leaders across the globe.
//         </p>
//       </div>

//       <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
//         <div className="grid gap-10 xl:grid-cols-[1fr,300px]">
//           <div>
//             {visibleFeatured.length > 0 && (
//               <div>
//                 <p className="mb-6 text-xs font-bold uppercase tracking-widest text-accent">Featured</p>
//                 <div className="grid gap-6">
//                   {visibleFeatured.map((article) => (
//                     <Link
//                       key={article.id}
//                       to={`/article/${article.id}`}
//                       className="group overflow-hidden rounded-[2rem] bg-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
//                     >
//                       <div className="grid lg:grid-cols-[1fr,1.2fr]">
//                         <div className="flex flex-col justify-between p-8 lg:p-10">
//                           <div>
//                             <QuoteIcon />
//                             <span className="mt-4 inline-block text-xs font-bold uppercase tracking-widest text-accent">
//                               {article.category || 'Opinion'}
//                             </span>
//                             <h2 className="mt-3 text-2xl font-black leading-tight text-ink lg:text-3xl">
//                               {article.title}
//                             </h2>
//                             <p className="mt-4 text-slate-600 leading-relaxed">{article.subtitle}</p>
//                           </div>

//                           <div className="mt-8">
//                             <div className="flex items-center gap-3">
//                               <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent to-primary text-sm font-bold text-white">
//                                 {article.author.charAt(0)}
//                               </div>
//                               <div>
//                                 <p className="font-semibold text-ink">{article.author}</p>
//                                 <p className="text-xs text-slate-400">{article.date}</p>
//                               </div>
//                             </div>

//                             <span className="mt-5 inline-flex rounded-full border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition group-hover:bg-primary group-hover:text-white">
//                               Read Full Opinion
//                             </span>
//                           </div>
//                         </div>

//                         {article.image && (
//                           <div className="overflow-hidden">
//                             <img
//                               src={article.image}
//                               alt={article.title}
//                               className="h-full w-full object-cover transition duration-500 group-hover:scale-105 lg:rounded-r-[2rem]"
//                             />
//                           </div>
//                         )}
//                       </div>
//                     </Link>
//                   ))}
//                 </div>

//                 {canLoadMoreFeatured && (
//                   <div className="mt-6 flex justify-center">
//                     <button
//                       onClick={() => setFeaturedVisible((v) => v + FEATURED_BATCH)}
//                       className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
//                     >
//                       Load More
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )}

//             {visibleLatest.length > 0 && (
//               <div className="mt-12">
//                 <p className="mb-6 text-xs font-bold uppercase tracking-widest text-accent">Latest</p>
//                 <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
//                   {visibleLatest.map((article) => (
//                     <Link
//                       key={article.id}
//                       to={`/article/${article.id}`}
//                       className="group rounded-[1.75rem] border border-amber-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
//                     >
//                       <QuoteIcon />
//                       <span className="mt-3 inline-block text-[10px] font-bold uppercase tracking-widest text-accent">
//                         {article.category}
//                       </span>
//                       <h3 className="mt-2 line-clamp-3 text-base font-bold leading-snug text-ink">
//                         {article.title}
//                       </h3>
//                       <p className="mt-2 line-clamp-2 text-sm text-slate-500">{article.subtitle}</p>
//                       <div className="mt-4 flex items-center gap-2 border-t border-amber-100 pt-4">
//                         <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-primary text-xs font-bold text-white">
//                           {article.author.charAt(0)}
//                         </div>
//                         <div className="min-w-0">
//                           <p className="truncate text-xs font-semibold text-ink">{article.author}</p>
//                           <p className="text-xs text-slate-400">{article.date}</p>
//                         </div>
//                       </div>
//                     </Link>
//                   ))}
//                 </div>

//                 {canLoadMoreLatest && (
//                   <div className="mt-6 flex justify-center">
//                     <button
//                       onClick={() => setLatestVisible((v) => v + GRID_BATCH)}
//                       className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
//                     >
//                       Load More
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )}

//             {visibleArchived.length > 0 && (
//               <div className="mt-12">
//                 <p className="mb-5 text-xs font-bold uppercase tracking-widest text-slate-400">Archived</p>
//                 <div className="space-y-3">
//                   {visibleArchived.map((article) => (
//                     <Link
//                       key={article.id}
//                       to={`/article/${article.id}`}
//                       className="flex items-center gap-4 rounded-2xl border border-amber-100 bg-white p-4 transition hover:bg-amber-50"
//                     >
//                       {article.image && (
//                         <img
//                           src={article.image}
//                           alt={article.title}
//                           className="h-14 w-20 flex-shrink-0 rounded-xl object-cover"
//                         />
//                       )}
//                       <div className="min-w-0">
//                         <span className="text-[10px] font-bold uppercase tracking-widest text-accent">
//                           {article.category}
//                         </span>
//                         <h3 className="mt-0.5 truncate font-bold text-ink">{article.title}</h3>
//                         <p className="text-xs text-slate-400">{article.author} · {article.date}</p>
//                       </div>
//                     </Link>
//                   ))}
//                 </div>

//                 {canLoadMoreArchived && (
//                   <div className="mt-6 flex justify-center">
//                     <button
//                       onClick={() => setArchivedVisible((v) => v + GRID_BATCH)}
//                       className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
//                     >
//                       Load More
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )}

//             {articles.length === 0 && (
//               <div className="rounded-[2rem] border-2 border-dashed border-amber-200 p-16 text-center text-amber-400">
//                 <p className="text-lg font-semibold">No opinion pieces yet</p>
//                 <p className="mt-2 text-sm">Add articles from Admin → More Sections → Opinion</p>
//               </div>
//             )}
//           </div>

//           <div className="hidden xl:block">
//             <div className="sticky top-6">
//               <AdBanner vertical />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdBanner } from '../components/AdBanner';
import { Article } from '../data/siteData';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function toArticle(a: any): Article {
  return {
    id: a._id || a.id || '',
    title: a.title || '',
    subtitle: a.subtitle || '',
    content: a.content || '',
    image: a.imageUrl || '',
    author: a.author || '',
    date: a.date || '',
    category: a.category || '',
    region: '',
    featured: a.isFeatured || false,
    archived: a.isArchived || false,
    topic: a.category || '',
    ...(Array.isArray(a.hashtags) ? { hashtags: a.hashtags } : {}),
    ...(a.section ? { section: a.section } : {}),
    ...(a.videoId ? { videoId: a.videoId } : {}),
  } as Article;
}

function QuoteIcon() {
  return (
    <svg className="h-7 w-7 text-neutral-300" fill="currentColor" viewBox="0 0 24 24">
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
  );
}

const FEATURED_BATCH = 6;
const GRID_BATCH = 4;

export function OpinionPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredVisible, setFeaturedVisible] = useState(FEATURED_BATCH);
  const [latestVisible, setLatestVisible] = useState(GRID_BATCH);
  const [archivedVisible, setArchivedVisible] = useState(GRID_BATCH);

  useEffect(() => {
    fetch(`${API_URL}/section-articles/section/opinion`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setArticles(data.map(toArticle)))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, []);

  const featuredAll = articles.filter((a) => a.featured && !a.archived);
  const latestAll = articles.filter((a) => !a.archived);
  const archivedAll = articles.filter((a) => a.archived);

  const visibleFeatured = featuredAll.slice(0, featuredVisible);
  const visibleLatest = latestAll.slice(0, latestVisible);
  const visibleArchived = archivedAll.slice(0, archivedVisible);

  const canLoadMoreFeatured = featuredVisible < featuredAll.length;
  const canLoadMoreLatest = latestVisible < latestAll.length;
  const canLoadMoreArchived = archivedVisible < archivedAll.length;

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-white">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f4] text-neutral-950">
      {/* WordPress-style masthead */}
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
          <div className="border-y border-neutral-900 py-8 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-neutral-500">
              Editorial Section
            </p>
            <h1 className="mt-3 font-serif text-5xl font-black tracking-tight text-neutral-950 md:text-7xl">
              Opinion
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-neutral-600 md:text-base">
              Commentary, analysis, and perspectives from contributors, analysts,
              and independent voices.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr),320px]">
          <div className="space-y-12">
            {/* Featured */}
            {visibleFeatured.length > 0 && (
              <section className="bg-white p-4 shadow-sm ring-1 ring-neutral-200 md:p-6">
                <div className="mb-6 flex items-center justify-between border-b-2 border-neutral-900 pb-3">
                  <h2 className="font-serif text-2xl font-bold text-neutral-950">
                    Featured Opinions
                  </h2>
                  <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-neutral-500">
                    Editor&apos;s Pick
                  </span>
                </div>

                <div className="divide-y divide-neutral-200">
                  {visibleFeatured.map((article, index) => (
                    <Link
                      key={article.id}
                      to={`/article/${article.id}`}
                      className="group grid gap-5 py-6 first:pt-0 last:pb-0 md:grid-cols-[220px,minmax(0,1fr)] lg:grid-cols-[280px,minmax(0,1fr)]"
                    >
                      <div className="relative overflow-hidden bg-neutral-100">
                        {article.image ? (
                          <img
                            src={article.image}
                            alt={article.title}
                            className="aspect-[4/3] h-full w-full object-cover grayscale-[15%] transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
                          />
                        ) : (
                          <div className="flex aspect-[4/3] items-center justify-center bg-neutral-100">
                            <QuoteIcon />
                          </div>
                        )}

                        <span className="absolute left-3 top-3 bg-neutral-950 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                          #{index + 1}
                        </span>
                      </div>

                      <article className="flex flex-col justify-center">
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-red-700">
                            {article.category || 'Opinion'}
                          </span>
                          <span className="h-px flex-1 bg-neutral-200" />
                        </div>

                        <h3 className="mt-3 font-serif text-2xl font-bold leading-tight text-neutral-950 transition group-hover:text-red-700 md:text-3xl">
                          {article.title}
                        </h3>

                        {article.subtitle && (
                          <p className="mt-3 line-clamp-3 text-sm leading-7 text-neutral-600">
                            {article.subtitle}
                          </p>
                        )}

                        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500">
                          <span className="font-semibold text-neutral-800">
                            {article.author || 'Editorial Desk'}
                          </span>
                          <span>•</span>
                          <span>{article.date}</span>
                        </div>

                        <span className="mt-5 inline-flex w-fit border border-neutral-900 px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-950 transition group-hover:bg-neutral-950 group-hover:text-white">
                          Continue Reading
                        </span>
                      </article>
                    </Link>
                  ))}
                </div>

                {canLoadMoreFeatured && (
                  <div className="mt-6 flex justify-center border-t border-neutral-200 pt-6">
                    <button
                      onClick={() => setFeaturedVisible((v) => v + FEATURED_BATCH)}
                      className="border border-neutral-900 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-950 transition hover:bg-neutral-950 hover:text-white"
                    >
                      Load More Featured
                    </button>
                  </div>
                )}
              </section>
            )}

            {/* Latest */}
            {visibleLatest.length > 0 && (
              <section className="bg-white p-4 shadow-sm ring-1 ring-neutral-200 md:p-6">
                <div className="mb-6 flex items-center justify-between border-b-2 border-neutral-900 pb-3">
                  <h2 className="font-serif text-2xl font-bold text-neutral-950">
                    Latest Columns
                  </h2>
                  <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-neutral-500">
                    Recently Published
                  </span>
                </div>

                <div className="grid gap-px overflow-hidden bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
                  {visibleLatest.map((article) => (
                    <Link
                      key={article.id}
                      to={`/article/${article.id}`}
                      className="group bg-white p-5 transition hover:bg-[#faf7ef]"
                    >
                      <div className="mb-4 flex items-start justify-between gap-4">
                        <span className="bg-red-700 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                          {article.category || 'Opinion'}
                        </span>
                        <QuoteIcon />
                      </div>

                      <h3 className="line-clamp-3 font-serif text-xl font-bold leading-snug text-neutral-950 transition group-hover:text-red-700">
                        {article.title}
                      </h3>

                      {article.subtitle && (
                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-neutral-600">
                          {article.subtitle}
                        </p>
                      )}

                      <div className="mt-5 border-t border-neutral-200 pt-4 text-xs text-neutral-500">
                        <p className="truncate font-semibold text-neutral-800">
                          {article.author || 'Editorial Desk'}
                        </p>
                        <p className="mt-1">{article.date}</p>
                      </div>
                    </Link>
                  ))}
                </div>

                {canLoadMoreLatest && (
                  <div className="mt-6 flex justify-center border-t border-neutral-200 pt-6">
                    <button
                      onClick={() => setLatestVisible((v) => v + GRID_BATCH)}
                      className="border border-neutral-900 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-950 transition hover:bg-neutral-950 hover:text-white"
                    >
                      Load More Latest
                    </button>
                  </div>
                )}
              </section>
            )}

            {/* Archived */}
            {visibleArchived.length > 0 && (
              <section className="bg-white p-4 shadow-sm ring-1 ring-neutral-200 md:p-6">
                <div className="mb-5 flex items-center justify-between border-b-2 border-neutral-900 pb-3">
                  <h2 className="font-serif text-2xl font-bold text-neutral-950">
                    Archive
                  </h2>
                  <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-neutral-500">
                    Past Opinions
                  </span>
                </div>

                <div className="divide-y divide-neutral-200">
                  {visibleArchived.map((article) => (
                    <Link
                      key={article.id}
                      to={`/article/${article.id}`}
                      className="group grid grid-cols-[84px,minmax(0,1fr)] gap-4 py-4 first:pt-0 last:pb-0"
                    >
                      {article.image ? (
                        <img
                          src={article.image}
                          alt={article.title}
                          className="h-20 w-20 object-cover grayscale-[20%] transition group-hover:grayscale-0"
                        />
                      ) : (
                        <div className="flex h-20 w-20 items-center justify-center bg-neutral-100">
                          <QuoteIcon />
                        </div>
                      )}

                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-700">
                          {article.category || 'Opinion'}
                        </span>
                        <h3 className="mt-1 truncate font-serif text-lg font-bold text-neutral-950 transition group-hover:text-red-700">
                          {article.title}
                        </h3>
                        <p className="mt-1 text-xs text-neutral-500">
                          {article.author || 'Editorial Desk'} · {article.date}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>

                {canLoadMoreArchived && (
                  <div className="mt-6 flex justify-center border-t border-neutral-200 pt-6">
                    <button
                      onClick={() => setArchivedVisible((v) => v + GRID_BATCH)}
                      className="border border-neutral-900 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-950 transition hover:bg-neutral-950 hover:text-white"
                    >
                      Load More Archived
                    </button>
                  </div>
                )}
              </section>
            )}

            {articles.length === 0 && (
              <div className="border-2 border-dashed border-neutral-300 bg-white p-16 text-center">
                <p className="font-serif text-2xl font-bold text-neutral-950">
                  No opinion pieces yet
                </p>
                <p className="mt-2 text-sm text-neutral-500">
                  Add articles from Admin → More Sections → Opinion
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="hidden xl:block">
            <div className="sticky top-6 space-y-6">
              <div className="bg-white p-4 shadow-sm ring-1 ring-neutral-200">
                <p className="mb-3 border-b border-neutral-900 pb-2 text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-500">
                  Advertisement
                </p>
                <AdBanner vertical />
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}