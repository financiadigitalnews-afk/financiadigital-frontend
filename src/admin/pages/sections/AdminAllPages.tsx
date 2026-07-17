
import { useState, useEffect, useCallback } from 'react';
import { useAdminApi } from '../../hooks/useAdminApi';
import { RichTextEditor } from '../../components/RichTextEditor';

/* ─── ALL sections the admin can manage ─── */

const WORLD_REGIONS = [
  {
    value: 'asean',
    label: 'ASEAN',
    type: 'region' as const,
    subCategories: [
      'Indonesia',
      'Malaysia',
      'Singapore',
      'Thailand',
      'Vietnam',
      'Philippines',
      'Cambodia',
      'Laos',
      'Myanmar',
      'Brunei',
    ],
    isVideo: false,
  },
  {
    value: 'china',
    label: 'China',
    type: 'region' as const,
    subCategories: [
      'Politics',
      'Economy',
      'Technology',
      'Trade',
      'Security',
      'Belt and Road',
    ],
    isVideo: false,
  },
  {
    value: 'central-asia',
    label: 'Central Asia',
    type: 'region' as const,
    subCategories: [
      'Kazakhstan',
      'Kyrgyzstan',
      'Tajikistan',
      'Turkmenistan',
      'Uzbekistan',
    ],
    isVideo: false,
  },
  {
    value: 'caucasus',
    label: 'Caucasus',
    type: 'region' as const,
    subCategories: [
      'Armenia',
      'Azerbaijan',
      'Georgia',
      'South Caucasus',
    ],
    isVideo: false,
  },
  {
    value: 'eurasia',
    label: 'Eurasia',
    type: 'region' as const,
    subCategories: [
      'Russia',
      'Ukraine',
      'Eastern Europe',
      'Energy Corridors',
      'Security',
      'Trade Routes',
    ],
    isVideo: false,
  },
  {
    value: 'americas',
    label: 'Americas',
    type: 'region' as const,
    subCategories: [
      'North America',
      'Latin America',
      'Caribbean',
      'United States',
      'Canada',
    ],
    isVideo: false,
  },
];

const MORE_SECTIONS = [
  {
    value: 'editors-articles',
    label: "Editor's Articles",
    type: 'section' as const,
    subCategories: [],
    isVideo: false,
  },
  {
    value: 'international',
    label: 'International',
    type: 'section' as const,
    subCategories: [],
    isVideo: false,
  },
  {
    value: 'latest',
    label: 'Latest',
    type: 'section' as const,
    subCategories: [],
    isVideo: false,
  },
  {
    value: 'economy-and-trade',
    label: 'Economy and Trade',
    type: 'section' as const,
    subCategories: [],
    isVideo: false,
  },
  {
    value: 'pakistan-economy-budget',
    label: 'Pakistan Economy Budget',
    type: 'section' as const,
    subCategories: [],
    isVideo: false,
  },
  {
    value: 'provincial-budget',
    label: 'Provincial Budget',
    type: 'section' as const,
    subCategories: [],
    isVideo: false,
  },
  {
    value: 'innovation-and-technology',
    label: 'Innovation and Technology',
    type: 'section' as const,
    subCategories: [],
    isVideo: false,
  },
  {
    value: 'agriculture-and-food-security',
    label: 'Agriculture and Food Security',
    type: 'section' as const,
    subCategories: [],
    isVideo: false,
  },
    {
    value: 'interview',
    label: 'Interview',
    type: 'section' as const,
    subCategories: [],
    isVideo: false,
  },
    {
    value: 'opinion',
    label: 'Opinion',
    type: 'section' as const,
    subCategories: [],
    isVideo: false,
  },
];

const ALL_SECTIONS = [...WORLD_REGIONS, ...MORE_SECTIONS];
const HOME_OPTIONS = [
  { value: 'latest-news',      label: '📰 Latest News Block',        max: 5 },
  { value: 'editors-articles', label: "✍️ Editor's Articles Block",  max: 5 },
  { value: 'asean-home',       label: '🌏 ASEAN Home Feature',       max: 6 },
  { value: 'central-asia',     label: '🌏 Central Asia Carousel',    max: 5 },
  { value: 'interviews',       label: '🎤 Interviews Home Block',    max: 4 },
  { value: 'opinion',          label: '💬 Opinion Home Block',       max: 4 },
];
const MONTHS = [
  { v: '1', l: 'January' },
  { v: '2', l: 'February' },
  { v: '3', l: 'March' },
  { v: '4', l: 'April' },
  { v: '5', l: 'May' },
  { v: '6', l: 'June' },
  { v: '7', l: 'July' },
  { v: '8', l: 'August' },
  { v: '9', l: 'September' },
  { v: '10', l: 'October' },
  { v: '11', l: 'November' },
  { v: '12', l: 'December' },
];

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function normalizeHashtags(text: string): string[] {
  return [
    ...new Set(
      text
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
        .map((t) =>
          t
            .replace(/^#+/, '')
            .replace(/\s+/g, '-')
            .replace(/[^a-zA-Z0-9-_]/g, '')
        )
        .filter(Boolean)
        .slice(0, 20)
    ),
  ];
}

/* ─── Toggle ─── */
function Toggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors ${
        value ? 'bg-indigo-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
          value ? 'translate-x-4' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

/* ─── Breaking News Manager ─── */
function BreakingNewsManager() {
  const { get, put } = useAdminApi();
  const [items, setItems] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    get('/breaking-news')
      .then((d) => setItems(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  const save = async (newItems: string[]) => {
    setSaving(true);
    try {
      await put('/breaking-news', { items: newItems });
      setItems(newItems);
    } catch {}
    setSaving(false);
  };

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-5 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-red-600 text-[10px] font-black text-white">
            📢
          </span>
          <span className="text-sm font-semibold text-amber-900">
            Breaking News Ticker
          </span>
          {items.length > 0 && (
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
              {items.length} active
            </span>
          )}
        </div>
        <svg
          className={`h-4 w-4 text-amber-600 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="border-t border-amber-200 px-5 pb-5 pt-4 space-y-3">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a breaking news line and press Enter or Add…"
              className="flex-1 rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm focus:border-red-400 focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && input.trim()) {
                  save([...items, input.trim()]);
                  setInput('');
                }
              }}
            />
            <button
              onClick={() => {
                if (input.trim()) {
                  save([...items, input.trim()]);
                  setInput('');
                }
              }}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Add
            </button>
          </div>

          {items.length === 0 && (
            <p className="text-xs text-amber-600">
              No breaking news lines. Add one above.
            </p>
          )}

          <div className="space-y-2">
            {items.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg border border-amber-100 bg-white px-3 py-2"
              >
                <span className="text-[10px] font-black text-red-500">
                  #{i + 1}
                </span>
                <span className="flex-1 text-sm text-gray-700 truncate">
                  {item}
                </span>
                <button
                  onClick={() => save(items.filter((_, j) => j !== i))}
                  className="rounded px-2 py-0.5 text-[11px] font-semibold text-red-500 hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {saving && <p className="text-xs text-amber-600">Saving…</p>}
        </div>
      )}
    </div>
  );
}

/* ─── Section Picker ─── */
type SectionConfig = typeof ALL_SECTIONS[0];

function SectionPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">
        Select Section to Manage
      </p>

      <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {/* World Regions */}
        <div className="sm:col-span-3 lg:col-span-4 xl:col-span-5">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-emerald-600">
            🌍 World / Regions
          </p>
          <div className="flex flex-wrap gap-2">
            {WORLD_REGIONS.map((s) => (
              <button
                key={s.value}
                onClick={() => onChange(s.value)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold border transition ${
                  value === s.value
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'border-gray-200 text-gray-600 hover:border-emerald-300 hover:text-emerald-700'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* More Sections */}
        <div className="sm:col-span-3 lg:col-span-4 xl:col-span-5 mt-2">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-rose-500">
            📂 More Sections
          </p>
          <div className="flex flex-wrap gap-2">
            {MORE_SECTIONS.map((s) => (
              <button
                key={s.value}
                onClick={() => onChange(s.value)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold border transition ${
                  value === s.value
                    ? 'bg-rose-600 text-white border-rose-600'
                    : 'border-gray-200 text-gray-600 hover:border-rose-300 hover:text-rose-600'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Unified Article Form ─── */
const FORM_EMPTY = {
  title: '',
  subtitle: '',
  content: '',
  author: '',
  date: '',
  category: '',
  subCategory: '',
  hashtags: [] as string[],
  isFeatured: false,
  isArchived: false,
  isActive: true,
  sortOrder: 0,
  showOnHome: false,
  homeSection: '',
  homeSortOrder: 1,
  videoId: '',
};

function UnifiedForm({
  init,
  sectionConfig,
  onSave,
  onCancel,
  saving,
  error,
}: {
  init?: any;
  sectionConfig: SectionConfig;
  onSave: (data: any, file: File | null, galleryFiles: File[]) => void;
  onCancel: () => void;
  saving: boolean;
  error: string;
}) {
  const [f, setF] = useState<any>({ ...FORM_EMPTY, ...(init || {}) });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPrev] = useState(init?.imageUrl || '');
const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);
const [newGalleryPreviews, setNewGalleryPreviews] = useState<string[]>([]);
const savedGallery: { url: string }[] = Array.isArray(init?.galleryImages) ? init.galleryImages : [];
const [removedSaved, setRemovedSaved] = useState<string[]>([]);
const visibleSaved = savedGallery.filter(img => !removedSaved.includes(img.url));
const totalCount = visibleSaved.length + newGalleryFiles.length;
const remainingSlots = Math.max(0, 5 - totalCount);
  const [hashTxt, setHT] = useState(
    Array.isArray(init?.hashtags) ? init.hashtags.join(', ') : ''
  );

  const s = (k: string, v: any) =>
    setF((p: any) => ({
      ...p,
      [k]: v,
    }));

  const homeOpt = HOME_OPTIONS.find((o) => o.value === f.homeSection);
  const homeMax = homeOpt?.max ?? 5;
  const subCats = sectionConfig.subCategories || [];
  const isVideo = sectionConfig.isVideo;
  const ytThumb =
    isVideo && f.videoId
      ? `https://img.youtube.com/vi/${f.videoId}/maxresdefault.jpg`
      : null;
  const hashTags = normalizeHashtags(hashTxt);

  const fieldCls =
    'w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-indigo-400 focus:bg-white focus:outline-none transition';
  const labelCls =
    'mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide';

  return (
    <div className="rounded-xl border border-indigo-100 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-white px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-base font-bold text-gray-800">
            {init?._id ? '✏️ Edit Article' : '➕ New Article'}
          </p>
          <p className="text-xs text-indigo-500 font-medium mt-0.5">
            {sectionConfig.label}
            {f.subCategory ? ` › ${f.subCategory}` : ''}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-50"
        >
          ✕ Close
        </button>
      </div>

      <div className="p-6 space-y-6">
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
            ⚠️ {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelCls}>Title *</label>
            <input
              value={f.title}
              onChange={(e) => s('title', e.target.value)}
              className={fieldCls}
              placeholder="Article headline…"
            />
          </div>

          <div className="sm:col-span-2">
            <label className={labelCls}>Subtitle</label>
            <input
              value={f.subtitle}
              onChange={(e) => s('subtitle', e.target.value)}
              className={fieldCls}
              placeholder="Brief description…"
            />
          </div>

          <div>
            <label className={labelCls}>Author</label>
            <input
              value={f.author}
              onChange={(e) => s('author', e.target.value)}
              className={fieldCls}
            />
          </div>

          <div>
            <label className={labelCls}>Date</label>
            <input
              value={f.date}
              onChange={(e) => s('date', e.target.value)}
              className={fieldCls}
              placeholder="e.g. April 17, 2026"
            />
          </div>

          <div>
            <label className={labelCls}>Category</label>
            <input
              value={f.category}
              onChange={(e) => s('category', e.target.value)}
              className={fieldCls}
            />
          </div>

          <div>
            <label className={labelCls}>Sort Order lower = first</label>
            <input
              type="number"
              value={f.sortOrder}
              onChange={(e) => s('sortOrder', Number(e.target.value))}
              className={fieldCls}
            />
          </div>

          {subCats.length > 0 && (
            <div className="sm:col-span-2">
              <label className={labelCls}>Sub-Category</label>
              <select
                value={f.subCategory}
                onChange={(e) => s('subCategory', e.target.value)}
                className={fieldCls}
              >
                <option value="">— All of {sectionConfig.label} —</option>
                {subCats.map((sc: string) => (
                  <option key={sc} value={slugify(sc)}>
                    {sc}
                  </option>
                ))}
              </select>
            </div>
          )}

          {isVideo && (
            <div className="sm:col-span-2">
              <label className={labelCls}>YouTube Video ID *</label>
              <input
                value={f.videoId}
                onChange={(e) => s('videoId', e.target.value.trim())}
                placeholder="e.g. dQw4w9WgXcQ"
                className={fieldCls}
              />

              {ytThumb && (
                <div className="relative mt-3 w-48 overflow-hidden rounded-xl">
                  <img
                    src={ytThumb}
                    alt=""
                    className="w-full rounded-xl object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600/90">
                      <svg
                        className="ml-0.5 h-4 w-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="sm:col-span-2">
            <label className={labelCls}>Hashtags comma separated</label>
            <input
              value={hashTxt}
              onChange={(e) => setHT(e.target.value)}
              placeholder="politics, diplomacy, asia"
              className={fieldCls}
            />

            {hashTags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {hashTags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className={labelCls}>Full Article Content</label>
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <RichTextEditor value={f.content} onChange={(html) => s('content', html)} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4">
            <label className={labelCls}>Cover Image {isVideo ? 'optional' : ''}</label>

            {preview && (
              <img
                src={preview}
                alt=""
                className="mb-3 h-24 w-full rounded-lg object-cover"
              />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const fl = e.target.files?.[0];
                if (fl) {
                  setFile(fl);
                  setPrev(URL.createObjectURL(fl));
                }
              }}
              className="w-full text-xs text-gray-500 file:mr-2 file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-gray-700 file:shadow-sm"
            />
          </div>
<div className="rounded-lg border border-dashed border-blue-200 bg-blue-50/40 p-4 space-y-3">
  <label className={labelCls}>Gallery Images — {totalCount}/5 used</label>

  {/* Saved images */}
{visibleSaved.length > 0 && (
  <div>
    <p className="mb-1.5 text-[10px] font-semibold text-blue-600 uppercase tracking-wide">
      Saved ({visibleSaved.length})
    </p>
    <div className="flex flex-wrap gap-1">
      {visibleSaved.map((img) => (
        <div key={img.url} className="relative overflow-hidden rounded-lg border border-blue-100 group">
          <img src={img.url} alt="" className="h-14 w-14 object-cover" />
          <button
            onClick={() => setRemovedSaved(p => [...p, img.url])}
            className="absolute inset-0 flex items-center justify-center bg-red-600/70 opacity-0 group-hover:opacity-100 transition text-white text-xs font-bold"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  </div>
)}

  {/* New files added */}
  {newGalleryFiles.length > 0 && (
    <div>
      <p className="mb-1.5 text-[10px] font-semibold text-emerald-600 uppercase tracking-wide">
        New to upload ({newGalleryFiles.length})
      </p>
      <div className="flex flex-wrap gap-1">
        {newGalleryPreviews.map((src, i) => (
          <div key={i} className="relative overflow-hidden rounded-lg border border-emerald-200 group">
            <img src={src} alt="" className="h-14 w-14 object-cover" />
            <button
              onClick={() => {
                setNewGalleryFiles(p => p.filter((_, j) => j !== i));
                setNewGalleryPreviews(p => p.filter((_, j) => j !== i));
              }}
              className="absolute inset-0 flex items-center justify-center bg-red-600/70 opacity-0 group-hover:opacity-100 transition text-white text-xs font-bold"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )}

  {/* Add more button */}
  {remainingSlots > 0 ? (
    <div>
      <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50 transition w-fit">
        <span>+ Add Image ({remainingSlots} slot{remainingSlots !== 1 ? 's' : ''} left)</span>
        <input type="file" accept="image/*" className="hidden"
          onChange={e => {
            const fl = e.target.files?.[0];
            if (!fl) return;
            setNewGalleryFiles(p => [...p, fl]);
            setNewGalleryPreviews(p => [...p, URL.createObjectURL(fl)]);
            e.target.value = '';
          }}
        />
      </label>
    </div>
  ) : (
    <p className="text-xs text-red-500">Gallery full (5/5). Remove a new image above to add another.</p>
  )}

  <p className="text-[10px] text-blue-400">Saved images are kept. New images are added alongside them.</p>
</div>
        </div>

        <div className="flex flex-wrap gap-6 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
          {(
            [
              { k: 'isFeatured', l: 'Featured' },
              { k: 'isArchived', l: 'Archived' },
              { k: 'isActive', l: 'Active' },
            ] as const
          ).map(({ k, l }) => (
            <div key={k} className="flex items-center gap-2">
              <Toggle value={f[k]} onChange={(v) => s(k, v)} />
              <label className="text-xs font-semibold text-gray-600">{l}</label>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-indigo-800">🏠 Show on Home Page</p>
              <p className="mt-0.5 text-xs text-indigo-500">
                Feature in any homepage section. Slot auto-replaces when full.
              </p>
            </div>
            <Toggle
              value={f.showOnHome}
              onChange={(v) => {
                s('showOnHome', v);
                if (!v) {
                  s('homeSection', '');
                  s('homeSortOrder', 1);
                }
              }}
            />
          </div>

          {f.showOnHome && (
            <div className="grid gap-3 sm:grid-cols-2 border-t border-indigo-100 pt-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-indigo-600 uppercase tracking-wide">
                  Home Section *
                </label>
                <select
                  value={f.homeSection}
                  onChange={(e) => {
                    s('homeSection', e.target.value);
                    s('homeSortOrder', 1);
                  }}
                  className={fieldCls}
                >
                  <option value="">— Select section —</option>
                  {HOME_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label} max {o.max}
                    </option>
                  ))}
                </select>

                {f.homeSection === 'hero' && (
                  <p className="mt-1.5 rounded-lg bg-yellow-50 border border-yellow-200 p-2 text-xs text-yellow-800">
                    ⭐ Title, subtitle and image auto-populate the hero.
                    Occupied positions are displaced automatically.
                  </p>
                )}
              </div>

              {f.homeSection && (
                <div>
                  <label className="mb-1 block text-xs font-semibold text-indigo-600 uppercase tracking-wide">
                    Position 1 = first, max {homeMax}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={homeMax}
                    value={f.homeSortOrder}
                    onChange={(e) =>
                      s(
                        'homeSortOrder',
                        Math.min(homeMax, Math.max(1, Number(e.target.value)))
                      )
                    }
                    className={fieldCls}
                  />
                  <p className="mt-1 text-xs text-indigo-400">
                    Occupied slot gets displaced automatically.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
          <button
            onClick={onCancel}
            className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
          >
            Cancel
          </button>

         <button
  onClick={() => onSave({ ...f, hashtags: normalizeHashtags(hashTxt), removeGalleryImages: removedSaved }, file, newGalleryFiles)}
            disabled={saving || !f.title || (isVideo && !f.videoId)}
            className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50 transition shadow-sm"
          >
            {saving ? '⏳ Saving…' : init?._id ? '✓ Update Article' : '✓ Save Article'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Article Row ─── */
function ArticleRow({
  a,
  onEdit,
  onDelete,
}: {
  a: any;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const isVideo = a.section === 'video';
  const ytThumb =
    isVideo && a.videoId
      ? `https://img.youtube.com/vi/${a.videoId}/mqdefault.jpg`
      : null;
  const imgSrc = a.imageUrl || ytThumb || '';
  const homeOpt = HOME_OPTIONS.find((o) => o.value === a.homeSection);
  const galleryCount = Array.isArray(a.galleryImages) ? a.galleryImages.length : 0;

  return (
    <div className="group flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-4 transition hover:border-indigo-200 hover:shadow-sm">
      {imgSrc ? (
        <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg">
          <img src={imgSrc} className="h-full w-full object-cover" alt="" />

          {isVideo && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600">
                <svg
                  className="ml-0.5 h-2.5 w-2.5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="h-16 w-24 flex-shrink-0 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 text-xs">
          No img
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex flex-wrap items-center gap-1">
          <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-500 uppercase">
            {a.region || a.section || ''}
          </span>

          {a.subCategory && (
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">
              {a.subCategory}
            </span>
          )}

          {a.isFeatured && (
            <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
              ★ Featured
            </span>
          )}

          {a.isArchived && (
            <span className="rounded-md bg-gray-200 px-2 py-0.5 text-[10px] text-gray-500">
              Archived
            </span>
          )}

          {galleryCount > 0 && (
            <span className="rounded-md bg-purple-100 px-2 py-0.5 text-[10px] text-purple-700">
              📷 +{galleryCount}
            </span>
          )}

          {a.showOnHome && a.homeSection === 'hero' && (
            <span className="rounded-md bg-yellow-100 px-2 py-0.5 text-[10px] font-bold text-yellow-800">
              ⭐ Hero #{a.homeSortOrder}
            </span>
          )}

          {a.showOnHome && a.homeSection && a.homeSection !== 'hero' && (
            <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
              🏠 {(homeOpt?.label || a.homeSection).replace(/\(.*\)/, '').trim()} #
              {a.homeSortOrder}
            </span>
          )}

          <span
            className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
              a.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
            }`}
          >
            {a.isActive ? '● Active' : '○ Hidden'}
          </span>
        </div>

        <p className="truncate text-sm font-semibold text-gray-800 leading-snug">
          {a.title}
        </p>

        <p className="mt-0.5 text-xs text-gray-400">
          {[a.category, a.author, a.date].filter(Boolean).join(' · ')}
        </p>

        {Array.isArray(a.hashtags) && a.hashtags.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {a.hashtags.slice(0, 4).map((t: string) => (
              <span
                key={t}
                className="rounded-full border border-gray-100 bg-gray-50 px-2 py-0.5 text-[10px] text-gray-500"
              >
                #{t}
              </span>
            ))}
            {a.hashtags.length > 4 && (
              <span className="text-[10px] text-gray-400">
                +{a.hashtags.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-shrink-0 flex-col gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={onEdit}
          className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="rounded-lg border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export function AdminAllPages() {
  const { get, post, put, del } = useAdminApi();

  const [selectedSection, setSelectedSection] = useState('');
  const cfg = ALL_SECTIONS.find((s) => s.value === selectedSection);

  const [articles, setArticles] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState('');
  const [filterHome, setFilterHome] = useState('');
  const [filterSub, setFilterSub] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState('1');

  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const load = useCallback(async () => {
    if (!selectedSection || !cfg) {
      setArticles([]);
      setTotalCount(0);
      setTotalPages(1);
      return;
    }

    setLoading(true);

    try {
      const p = new URLSearchParams({
        page: String(page),
        limit: '10',
        section: selectedSection,
        sectionType: cfg.type,
      });

      if (search) p.set('search', search);
      if (filterHome) p.set('homeSection', filterHome);
      if (filterSub) p.set('subCategory', filterSub);
      if (filterMonth) p.set('month', filterMonth);
      if (filterYear) p.set('year', filterYear);

      const data = await get(`/all-articles/admin?${p.toString()}`);

      setArticles(data.articles || []);
      setTotalCount(data.total || 0);
      setTotalPages(data.pages || 1);
    } catch (e) {
      console.error(e);
    }

    setLoading(false);
  }, [
    selectedSection,
    cfg,
    page,
    search,
    filterHome,
    filterSub,
    filterMonth,
    filterYear,
  ]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setPage(1);
    setPageInput('1');
  }, [selectedSection, search, filterHome, filterSub, filterMonth, filterYear]);

  useEffect(() => {
    setAdding(false);
    setEditId(null);
    setSaveError('');
    setSearch('');
    setFilterHome('');
    setFilterSub('');
    setFilterMonth('');
    setFilterYear('');
  }, [selectedSection]);

  const apiBase = cfg?.type === 'region' ? '/region-articles' : '/section-articles';
  const hasSub = (cfg?.subCategories?.length ?? 0) > 0;

  const toFD = (f: any, file: File | null, galleryFiles: File[] = []) => {
  const fd = new FormData();

  Object.entries(f).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (k === 'galleryImages') return; // skip — already-saved objects, not re-uploaded
    if (k === 'removeGalleryImages') { fd.append('removeGalleryImages', JSON.stringify(v)); return; }
    if (k === 'hashtags') fd.append('hashtags', JSON.stringify(v));
    else fd.append(k, String(v));
  });

    if (file) fd.append('image', file);

    galleryFiles.slice(0, 5).forEach((gf) => {
      fd.append('galleryImages', gf);
    });

    return fd;
  };

  const handleCreate = async (
    f: any,
    file: File | null,
    galleryFiles: File[] = []
  ) => {
    if (!cfg) return;

    setSaving(true);
    setSaveError('');

    try {
      const payload = { ...f };

      if (cfg.type === 'region') {
        payload.region = selectedSection;
      } else {
        payload.section = selectedSection;
      }

      await post(apiBase, toFD(payload, file, galleryFiles));
      setAdding(false);
      await load();
    } catch (e: any) {
      setSaveError(e.message || 'Failed to save.');
    }

    setSaving(false);
  };

  const handleUpdate = async (
    f: any,
    file: File | null,
    galleryFiles: File[] = []
  ) => {
    setSaving(true);
    setSaveError('');

    try {
      await put(`${apiBase}/${f._id}`, toFD(f, file, galleryFiles));
      setEditId(null);
      await load();
    } catch (e: any) {
      setSaveError(e.message || 'Failed to save.');
    }

    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this article permanently?')) return;

    try {
      await del(`${apiBase}/${id}`);
      await load();
    } catch (e) {
      console.error(e);
    }
  };

  const goToPage = (p: number) => {
    const c = Math.max(1, Math.min(totalPages, p));
    setPage(c);
    setPageInput(String(c));
  };

  const activeFilters = [
    search,
    filterHome,
    filterSub,
    filterMonth,
    filterYear,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight">
            All Pages Handling
          </h2>
          <p className="mt-0.5 text-sm text-gray-400">
            World regions and More sections — all in one place.
          </p>
        </div>
      </div>

      <BreakingNewsManager />

      <SectionPicker value={selectedSection} onChange={(v) => setSelectedSection(v)} />

      {selectedSection && cfg && (
        <>
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-3">
              <div className="flex items-center gap-3">
                <div>
                  <span className="text-sm font-bold text-gray-800">
                    {cfg.label}
                  </span>
                  <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500">
                    {totalCount}
                  </span>
                </div>

                <button
                  onClick={() => setShowFilters((f) => !f)}
                  className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                    showFilters || activeFilters > 0
                      ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  🔍 Filters
                  {activeFilters > 0 && (
                    <span className="rounded-full bg-indigo-600 text-white px-1.5">
                      {activeFilters}
                    </span>
                  )}
                </button>

                {activeFilters > 0 && (
                  <button
                    onClick={() => {
                      setSearch('');
                      setFilterHome('');
                      setFilterSub('');
                      setFilterMonth('');
                      setFilterYear('');
                    }}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {!adding && !editId && (
                <button
                  onClick={() => {
                    setAdding(true);
                    setEditId(null);
                    setSaveError('');
                    window.scrollTo({
                      top: document.body.scrollHeight,
                      behavior: 'smooth',
                    });
                  }}
                  className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700 transition shadow-sm"
                >
                  <span className="text-base leading-none">+</span> New Article
                </button>
              )}
            </div>

            {showFilters && (
              <div className="border-b border-gray-100 bg-gray-50 px-5 py-4">
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search title, author, category…"
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
                  />

                  <select
                    value={filterHome}
                    onChange={(e) => setFilterHome(e.target.value)}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
                  >
                    <option value="">All Home Placements</option>
                    {HOME_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label.replace(/\(.*\)/, '').trim()}
                      </option>
                    ))}
                  </select>

                  {hasSub && (
                    <select
                      value={filterSub}
                      onChange={(e) => setFilterSub(e.target.value)}
                      className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
                    >
                      <option value="">All Sub-Categories</option>
                      {cfg.subCategories.map((sc: string) => (
                        <option key={sc} value={slugify(sc)}>
                          {sc}
                        </option>
                      ))}
                    </select>
                  )}

                  <select
                    value={filterMonth}
                    onChange={(e) => setFilterMonth(e.target.value)}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
                  >
                    <option value="">All Months</option>
                    {MONTHS.map((m) => (
                      <option key={m.v} value={m.v}>
                        {m.l}
                      </option>
                    ))}
                  </select>

                  <input
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                    placeholder="Year e.g. 2026"
                    type="number"
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {loading && (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 rounded-xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          )}

          {!loading && articles.length === 0 && !adding && !editId && (
            <div className="rounded-xl border-2 border-dashed border-gray-200 p-14 text-center">
              <p className="text-4xl mb-3">📭</p>
              <p className="font-bold text-gray-500">No articles found</p>
              <p className="mt-1 text-sm text-gray-400">
                {activeFilters > 0
                  ? 'Adjust your filters above.'
                  : 'Click "+ New Article" to add the first one.'}
              </p>
            </div>
          )}

          {!loading && articles.length > 0 && (
            <div className="space-y-2">
              {articles.map((a) =>
                editId === a._id ? (
                  <UnifiedForm
                    key={a._id}
                    init={a}
                    sectionConfig={cfg}
                    onSave={handleUpdate}
                    onCancel={() => {
                      setEditId(null);
                      setSaveError('');
                    }}
                    saving={saving}
                    error={saveError}
                  />
                ) : (
                  <ArticleRow
                    key={a._id}
                    a={a}
                    onEdit={() => {
                      setEditId(a._id);
                      setAdding(false);
                      setSaveError('');
                      window.scrollTo({
                        top: document.body.scrollHeight,
                        behavior: 'smooth',
                      });
                    }}
                    onDelete={() => handleDelete(a._id)}
                  />
                )
              )}
            </div>
          )}

          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white px-5 py-3">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition"
              >
                ← Prev
              </button>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Page</span>
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  onBlur={() => goToPage(Number(pageInput))}
                  onKeyDown={(e) => e.key === 'Enter' && goToPage(Number(pageInput))}
                  className="w-14 rounded-lg border border-gray-200 px-2 py-1 text-center text-sm focus:border-indigo-400 focus:outline-none"
                />
                <span>of {totalPages}</span>
                <span className="text-gray-300">|</span>
                <span>{totalCount} total</span>
              </div>

              <button
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition"
              >
                Next →
              </button>
            </div>
          )}

          {adding && (
            <UnifiedForm
              sectionConfig={cfg}
              onSave={handleCreate}
              onCancel={() => {
                setAdding(false);
                setSaveError('');
              }}
              saving={saving}
              error={saveError}
            />
          )}
        </>
      )}
    </div>
  );
}
