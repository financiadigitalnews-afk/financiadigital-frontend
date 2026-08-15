// This section receives a pre-merged, pre-sorted, pre-capped (max 8) list
// of articles from HomePage.tsx — merged from both SectionArticle and
// RegionArticle sources. See HomePage.tsx for the merge logic.
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../data/siteData';

// Small colored tag showing which section/region an article came from.
// Reuses article.region if present, otherwise falls back to category.
function SourceTag({ article }: { article: Article }) {
  const label = (article.region || article.category || 'World').toUpperCase();
  return (
    <span className="rounded-md bg-white/15 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-white backdrop-blur-sm">
      {label}
    </span>
  );
}

function HeadlineCard({ article, large = false }: { article: Article; large?: boolean }) {
  return (
    <Link
      to={`/article/${article.id}`}
      className={`group relative block overflow-hidden rounded-xl ${large ? 'aspect-[16/10]' : 'aspect-[16/9]'}`}
    >
      {article.image && (
        <img
          src={article.image}
          alt={article.title}
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      <div className="absolute left-3 top-3 flex items-center gap-2">
        <span className="rounded-md bg-black/40 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
          {article.date}
        </span>
      </div>
      <div className="absolute right-3 top-3">
        <SourceTag article={article} />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className={`font-black leading-tight text-white ${large ? 'text-xl lg:text-2xl' : 'text-sm'} line-clamp-2`}>
          {article.title}
        </h3>
        {large && article.subtitle && (
          <p className="mt-2 line-clamp-2 text-sm text-white/75">{article.subtitle}</p>
        )}
        {large && (
          <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-blue-300">
            Read More →
          </span>
        )}
      </div>
    </Link>
  );
}

export function HeadlineSection({ articles }: { articles: Article[] }) {
  const [page, setPage] = useState(0);
  const perPage = 4; // 1 large + 3 stacked
  const totalPages = Math.max(1, Math.ceil(articles.length / perPage));

  if (articles.length === 0) return null;

  const start = page * perPage;
  const visible = articles.slice(start, start + perPage);
  const [featured, ...rest] = visible;

  return (
    <section className="bg-slate-950 py-8">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-300">
              Top Stories
            </p>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => (p - 1 + totalPages) % totalPages)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white hover:bg-white/10 transition"
                aria-label="Previous"
              >
                ‹
              </button>
              <button
                onClick={() => setPage((p) => (p + 1) % totalPages)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white hover:bg-white/10 transition"
                aria-label="Next"
              >
                ›
              </button>
            </div>
          )}
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          {featured && <HeadlineCard article={featured} large />}
          <div className="grid gap-3">
            {rest.map((a) => (
              <HeadlineCard key={a.id} article={a} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
