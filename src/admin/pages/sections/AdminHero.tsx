import { useEffect, useMemo, useState } from 'react';
import { useAdminApi } from '../../hooks/useAdminApi';

type HeroItem = {
  _id?: string;
  mediaType: 'video' | 'youtube' | 'image';
  youtubeId: string;
  mediaUrl: string;
  cloudinaryId?: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
};

const emptyHero: HeroItem = {
  mediaType: 'video',
  youtubeId: '',
  mediaUrl: '',
  title: 'Bold reporting for diplomacy, defense, economics and regional intelligence.',
  subtitle:
    'Independent analysis, regional insight and strategic reporting for global readers.',
  ctaText: 'Explore',
  ctaLink: '/',
  isActive: true,
};

export function AdminHero() {
  const { get, post, put, del } = useAdminApi();

  const [heroes, setHeroes] = useState<HeroItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | 'new'>('new');
  const [hero, setHero] = useState<HeroItem>({ ...emptyHero });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');

  const selectedHero = useMemo(
    () => heroes.find((h) => h._id === selectedId),
    [heroes, selectedId]
  );

  const canAddHero = heroes.length < 1;

  useEffect(() => {
    loadHeroes();
  }, []);

  useEffect(() => {
    if (selectedId === 'new') {
      setHero({ ...emptyHero });
      setPreview('');
      setMediaFile(null);
      return;
    }

    if (selectedHero) {
      setHero({ ...selectedHero });
      setPreview('');
      setMediaFile(null);
    }
  }, [selectedId, selectedHero]);

  const loadHeroes = async () => {
    try {
      const data = await get('/hero/admin');
      setHeroes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const setField = (key: keyof HeroItem, value: any) => {
    setHero((prev) => ({ ...prev, [key]: value }));
  };

  const resetMessage = () => setMsg({ text: '', type: '' });

  const handleSave = async () => {
    resetMessage();
    setSaving(true);

    try {
      const fd = new FormData();

      fd.append('mediaType', hero.mediaType);
      fd.append('youtubeId', hero.youtubeId || '');
      fd.append('title', hero.title || '');
      fd.append('subtitle', hero.subtitle || '');
      fd.append('ctaText', hero.ctaText || 'Explore');
      fd.append('ctaLink', hero.ctaLink || '/');
      fd.append('isActive', String(hero.isActive));

      if (mediaFile) {
        fd.append('media', mediaFile);
      }

      let saved;

      if (selectedId === 'new') {
        saved = await post('/hero', fd);
        setMsg({ text: 'Hero created successfully.', type: 'success' });
      } else {
        saved = await put(`/hero/${selectedId}`, fd);
        setMsg({ text: 'Hero updated successfully.', type: 'success' });
      }

      await loadHeroes();
      setSelectedId(saved._id);
      setMediaFile(null);
      setPreview('');
    } catch (err: any) {
      setMsg({
        text: err?.message || 'Failed to save hero.',
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;

    const ok = window.confirm('Are you sure you want to delete this hero?');
    if (!ok) return;

    resetMessage();

    try {
      await del(`/hero/${id}`);
      setHeroes([]);
      setSelectedId('new');
      setHero({ ...emptyHero });
      setMsg({ text: 'Hero deleted successfully.', type: 'success' });
    } catch (err: any) {
      setMsg({
        text: err?.message || 'Failed to delete hero.',
        type: 'error',
      });
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="max-w-6xl space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Homepage Hero</h2>
        <p className="text-sm text-gray-500">
          Manage one homepage hero video with overlay text and one Explore button.
        </p>
      </div>

      {msg.text && (
        <div
          className={`rounded-xl px-4 py-3 text-sm ${
            msg.type === 'success'
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {msg.text}
        </div>
      )}

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h3 className="font-semibold text-gray-800">
            Existing Hero ({heroes.length}/1)
          </h3>

          <button
            type="button"
            onClick={() => setSelectedId('new')}
            disabled={!canAddHero}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add Hero
          </button>
        </div>

        {heroes.length === 0 ? (
          <p className="pt-4 text-sm text-gray-500">No hero added yet.</p>
        ) : (
          <div className="pt-4">
            {heroes.map((item) => (
              <div
                key={item._id}
                className={`flex items-center gap-4 rounded-xl border p-3 ${
                  selectedId === item._id
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200'
                }`}
              >
                <div className="h-20 w-32 overflow-hidden rounded-lg bg-gray-100">
                  {item.mediaType === 'video' && item.mediaUrl ? (
                    <video
                      src={item.mediaUrl}
                      className="h-full w-full object-cover"
                      muted
                    />
                  ) : item.mediaType === 'youtube' && item.youtubeId ? (
                    <img
                      src={`https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  ) : item.mediaUrl ? (
                    <img
                      src={item.mediaUrl}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="truncate font-semibold text-gray-800">
                    {item.title || 'Untitled Hero'}
                  </h4>
                  <p className="truncate text-sm text-gray-500">
                    {item.subtitle || 'No subtitle'}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    {item.isActive ? 'Active' : 'Inactive'} • {item.mediaType}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedId(item._id!)}
                    className="rounded-lg bg-gray-900 px-3 py-1.5 text-sm font-medium text-white"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item._id)}
                    className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-5">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="border-b border-gray-100 pb-3 font-semibold text-gray-800">
              {selectedId === 'new' ? 'Add Hero Content' : 'Edit Hero Content'}
            </h3>

            <div className="mt-4 space-y-4">
              <div>
                <label className="label">Headline</label>
                <textarea
                  rows={3}
                  value={hero.title}
                  onChange={(e) => setField('title', e.target.value)}
                  className="input w-full"
                  placeholder="Hero headline"
                />
              </div>

              <div>
                <label className="label">Subtitle</label>
                <textarea
                  rows={3}
                  value={hero.subtitle}
                  onChange={(e) => setField('subtitle', e.target.value)}
                  className="input w-full"
                  placeholder="Hero subtitle"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="label">Button Text</label>
                  <input
                    value={hero.ctaText}
                    onChange={(e) => setField('ctaText', e.target.value)}
                    className="input w-full"
                    placeholder="Explore"
                  />
                </div>

                <div>
                  <label className="label">Button Link</label>
                  <input
                    value={hero.ctaLink}
                    onChange={(e) => setField('ctaLink', e.target.value)}
                    className="input w-full"
                    placeholder="/article/article-slug"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">
                Hero Active
              </span>

              <button
                type="button"
                onClick={() => setField('isActive', !hero.isActive)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  hero.isActive ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
                    hero.isActive ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving || (selectedId === 'new' && !canAddHero)}
              className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? 'Saving...'
                : selectedId === 'new'
                  ? 'Add Hero'
                  : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="border-b border-gray-100 pb-3 font-semibold text-gray-800">
              Hero Media
            </h3>

            <div className="mt-4 space-y-4">
              <div>
                <label className="label">Media Type</label>
                <select
                  value={hero.mediaType}
                  onChange={(e) =>
                    setField('mediaType', e.target.value as HeroItem['mediaType'])
                  }
                  className="input w-full"
                >
                  <option value="video">Upload Video</option>
                  <option value="youtube">YouTube Video ID</option>
                  <option value="image">Upload Image</option>
                </select>
              </div>

              {hero.mediaType === 'youtube' ? (
                <div>
                  <label className="label">YouTube Video ID</label>
                  <input
                    value={hero.youtubeId}
                    onChange={(e) => setField('youtubeId', e.target.value)}
                    placeholder="Example: M7lc1UVf-VE"
                    className="input w-full"
                  />
                </div>
              ) : (
                <div>
                  <label className="label">
                    {hero.mediaType === 'video'
                      ? 'Upload Hero Video'
                      : 'Upload Hero Image'}
                  </label>

                  <input
                    type="file"
                    accept={hero.mediaType === 'video' ? 'video/*' : 'image/*'}
                    onChange={(e) => {
                      const file = e.target.files?.[0];

                      if (file) {
                        setMediaFile(file);
                        setPreview(URL.createObjectURL(file));
                      }
                    }}
                    className="w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary"
                  />
                </div>
              )}

              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
                {hero.mediaType === 'video' && (preview || hero.mediaUrl) ? (
                  <video
                    src={preview || hero.mediaUrl}
                    className="h-72 w-full object-cover"
                    controls
                    muted
                    loop
                  />
                ) : hero.mediaType === 'youtube' && hero.youtubeId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${hero.youtubeId}`}
                    className="h-72 w-full"
                    allowFullScreen
                    title="Hero YouTube preview"
                  />
                ) : hero.mediaType === 'image' && (preview || hero.mediaUrl) ? (
                  <img
                    src={preview || hero.mediaUrl}
                    alt="Hero preview"
                    className="h-72 w-full object-cover"
                  />
                ) : (
                  <div className="grid h-72 place-items-center text-sm text-gray-400">
                    Media preview will appear here.
                  </div>
                )}
              </div>

              <p className="text-xs leading-5 text-gray-500">
                Uploaded video will autoplay, stay muted, loop continuously, and
                play behind the hero text on the homepage.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}