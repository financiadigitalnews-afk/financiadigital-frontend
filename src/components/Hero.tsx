import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

type HeroItem = {
  mediaType?: 'video' | 'youtube' | 'image';
  youtubeId?: string;
  mediaUrl?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
};

export function Hero() {
  const [hero, setHero] = useState<HeroItem | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/hero`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setHero(data))
      .catch(() => setHero(null));
  }, []);

  if (!hero) return null;

  const title =
    hero.title ||
    'Bold reporting for diplomacy, defense, economics and regional intelligence.';

  const subtitle =
    hero.subtitle ||
    'Independent analysis, regional insight and strategic reporting for global readers.';

  const ctaText = hero.ctaText || 'Explore';
  const ctaLink = hero.ctaLink || '/';

  return (
    // Mobile keeps a taller box (min-h-[420px]) since text needs room to breathe.
    // Desktop (lg+) is capped at a fixed 440px so the whole hero — including its
    // caption box — fits on screen at 100% zoom below your header/nav.
    <section className="relative min-h-[420px] lg:h-[440px] overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0">
        {hero.mediaType === 'video' && hero.mediaUrl ? (
          <video
            src={hero.mediaUrl}
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : hero.mediaType === 'youtube' && hero.youtubeId ? (
          <iframe
            src={`https://www.youtube.com/embed/${hero.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${hero.youtubeId}&controls=0&showinfo=0&modestbranding=1&rel=0`}
            className="h-full w-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
            title="Hero video"
          />
        ) : hero.mediaUrl ? (
          <img
            src={hero.mediaUrl}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-slate-950" />
        )}
      </div>

      <div className="absolute inset-0 bg-slate-950/35" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-950/30 to-transparent" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl rounded-2xl border border-white/35 bg-slate-950/45 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:p-6 lg:p-7">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-200">
            Home Page Hero
          </p>

          <h1 className="mt-3 text-2xl font-black leading-[1.1] tracking-[-0.03em] text-white sm:text-3xl lg:text-4xl">
            {title}
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-white/82 lg:text-base">
            {subtitle}
          </p>

          <div className="mt-5">
            <Link
              to={ctaLink}
              className="inline-flex rounded-full bg-white px-5 py-2.5 text-xs font-black text-slate-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-primary hover:text-white"
            >
              {ctaText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
