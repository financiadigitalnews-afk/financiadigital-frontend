import { useState } from 'react';

const icons: Record<string, JSX.Element> = {
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.892h-2.33v6.987C18.343 21.128 22 16.991 22 12z"/></svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2H21.5l-7.51 8.59L22.75 22H15.9l-5.34-6.98L4.4 22H1.14l8.04-9.19L1 2h7.01l4.82 6.4L18.244 2z"/></svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.1 1 2.48 1 4.98 2.12 4.98 3.5zM.5 8h4V24h-4V8zM8.5 8h3.83v2.19h.05c.53-1 1.83-2.19 3.77-2.19 4.03 0 4.78 2.65 4.78 6.1V24h-4v-7.5c0-1.79-.03-4.1-2.5-4.1-2.5 0-2.88 1.95-2.88 3.97V24h-4V8z"/></svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12.05 22h-.007a9.87 9.87 0 01-4.988-1.36l-.358-.213-3.712.974.99-3.616-.233-.371A9.86 9.86 0 012 12.05C2 6.507 6.507 2 12.05 2c2.647 0 5.133 1.032 7.007 2.907A9.83 9.83 0 0122 12.05c0 5.545-4.507 9.95-9.95 9.95z"/></svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  link: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
};

const platforms = [
  { key: 'facebook', label: 'Facebook', bg: 'hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]' },
  { key: 'x', label: 'X', bg: 'hover:bg-black hover:text-white hover:border-black' },
  { key: 'linkedin', label: 'LinkedIn', bg: 'hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]' },
  { key: 'whatsapp', label: 'WhatsApp', bg: 'hover:bg-[#25D366] hover:text-white hover:border-[#25D366]' },
  { key: 'instagram', label: 'Instagram', bg: 'hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:text-white hover:border-transparent' },
] as const;

export function ShareButtons({ title, compact = false }: { title: string; compact?: boolean }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? window.location.href : '';

  const shareLinks: Record<string, string> = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    x: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`,
  };

  const handleClick = (key: string) => {
    if (key === 'instagram') {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      return;
    }
    window.open(shareLinks[key], '_blank', 'noopener,noreferrer,width=600,height=600');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className={compact ? 'flex items-center gap-3' : 'flex flex-wrap items-center gap-3'}>
      {!compact && (
        <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Share</span>
      )}

      {platforms.map((p) => (
        <button
          key={p.key}
          onClick={() => handleClick(p.key)}
          title={p.key === 'instagram' ? 'Copy link to share on Instagram' : `Share on ${p.label}`}
          className={`flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 shadow-sm transition ${p.bg}`}
        >
          <span className="h-4 w-4">{icons[p.key]}</span>
        </button>
      ))}

      <button
        onClick={handleCopyLink}
        title="Copy link"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 shadow-sm transition hover:bg-slate-800 hover:text-white hover:border-slate-800"
      >
        <span className="h-4 w-4">{icons.link}</span>
      </button>

      {copied && (
        <span className="text-xs font-semibold text-emerald-600 animate-pulse">Link copied!</span>
      )}
    </div>
  );
}
