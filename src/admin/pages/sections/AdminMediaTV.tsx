import { useState, useEffect, useCallback } from 'react';
import { useAdminApi } from '../../hooks/useAdminApi';

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${value ? 'bg-indigo-600' : 'bg-gray-200'}`}>
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${value ? 'translate-x-4' : 'translate-x-0.5'}`} />
    </button>
  );
}

function extractYoutubeId(input: string): string {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const p of patterns) {
    const m = input.match(p);
    if (m) return m[1];
  }
  return input.trim();
}

const EMPTY = { title: '', subtitle: '', youtubeId: '', date: '', category: '', sortOrder: 0, isActive: true };

function VideoForm({ init, onSave, onCancel, saving, error }: {
  init?: any;
  onSave: (d: any) => void;
  onCancel: () => void;
  saving: boolean;
  error: string;
}) {
  const [f, setF] = useState<any>({ ...EMPTY, ...(init || {}) });
  const s = (k: string, v: any) => setF((p: any) => ({ ...p, [k]: v }));

  const cleanId  = extractYoutubeId(f.youtubeId || '');
  const thumbUrl = cleanId.length === 11 ? `https://img.youtube.com/vi/${cleanId}/maxresdefault.jpg` : null;

  const fld = 'w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-indigo-400 focus:bg-white focus:outline-none transition';
  const lbl = 'mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide';

  return (
    <div className="rounded-xl border border-indigo-100 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-white px-6 py-4">
        <p className="text-base font-bold text-gray-800">{init?._id ? '✏️ Edit Video' : '➕ New Video'}</p>
        <button onClick={onCancel} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-50">✕ Close</button>
      </div>

      <div className="p-6 space-y-5">
        {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">⚠️ {error}</div>}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={lbl}>Video Title *</label>
            <input value={f.title} onChange={e => s('title', e.target.value)} className={fld} placeholder="e.g. Interview with the Finance Minister" />
          </div>

          <div className="sm:col-span-2">
            <label className={lbl}>Subtitle / Brief Description</label>
            <input value={f.subtitle} onChange={e => s('subtitle', e.target.value)} className={fld} placeholder="One line describing what this video is about" />
          </div>

          <div className="sm:col-span-2">
            <label className={lbl}>YouTube URL or Video ID *</label>
            <input value={f.youtubeId} onChange={e => s('youtubeId', e.target.value)}
              className={fld} placeholder="https://youtube.com/watch?v=... or just the video ID" />
            <p className="mt-1 text-[10px] text-gray-400">Paste the full YouTube URL or just the 11-character video ID.</p>
            {thumbUrl && (
              <div className="mt-3 relative overflow-hidden rounded-xl w-56 shadow">
                <img src={thumbUrl} alt="Preview" className="w-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600/90 shadow-lg">
                    <svg className="ml-0.5 h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-bold text-white">Preview</span>
              </div>
            )}
          </div>

          <div>
            <label className={lbl}>Date</label>
            <input value={f.date} onChange={e => s('date', e.target.value)} className={fld} placeholder="e.g. May 3, 2026" />
          </div>

          <div>
            <label className={lbl}>Category</label>
            <input value={f.category} onChange={e => s('category', e.target.value)} className={fld} placeholder="e.g. Interview, Analysis, Documentary" />
          </div>

          <div>
            <label className={lbl}>Sort Order</label>
            <input type="number" value={f.sortOrder} onChange={e => s('sortOrder', Number(e.target.value))} className={fld} />
          </div>

          <div className="flex items-center gap-3 pt-5">
            <Toggle value={f.isActive} onChange={v => s('isActive', v)} />
            <label className="text-xs font-semibold text-gray-600">Active (visible to readers)</label>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
          <button onClick={onCancel} className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">Cancel</button>
          <button onClick={() => onSave({ ...f, youtubeId: cleanId })}
            disabled={saving || !f.title || cleanId.length < 5}
            className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50 transition shadow-sm">
            {saving ? '⏳ Saving…' : init?._id ? '✓ Update Video' : '✓ Add Video'}
          </button>
        </div>
      </div>
    </div>
  );
}

function VideoRow({ v, onEdit, onDelete }: { v: any; onEdit: () => void; onDelete: () => void }) {
  const thumb = `https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg`;
  return (
    <div className="group flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-4 transition hover:border-indigo-200 hover:shadow-sm">
      <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg bg-gray-100">
        <img src={thumb} alt={v.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600">
            <svg className="ml-0.5 h-3 w-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          </div>
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-1">
          <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${v.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
            {v.isActive ? '● Active' : '○ Hidden'}
          </span>
          {v.category && <span className="rounded-md bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">{v.category}</span>}
          <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500 font-mono">{v.youtubeId}</span>
        </div>
        <p className="text-sm font-bold text-gray-800 line-clamp-1">{v.title}</p>
        {v.subtitle && <p className="mt-0.5 text-xs text-gray-500 line-clamp-1">{v.subtitle}</p>}
        <p className="mt-0.5 text-xs text-gray-400">{v.date}</p>
      </div>

      <div className="flex shrink-0 flex-col gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
        <button onClick={onEdit} className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition">Edit</button>
        <button onClick={onDelete} className="rounded-lg border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition">Delete</button>
      </div>
    </div>
  );
}

export function AdminMediaTV() {
  const { get, post, put, del } = useAdminApi();
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding]   = useState(false);
  const [editId, setEditId]   = useState<string|null>(null);
  const [saving, setSaving]   = useState(false);
  const [saveError, setSaveError] = useState('');
  const [search, setSearch]   = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try { setVideos(await get('/media-tv/admin/all')); } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (f: any) => {
    setSaving(true); setSaveError('');
    try { await post('/media-tv', f); setAdding(false); await load(); }
    catch (e: any) { setSaveError(e.message || 'Failed to save.'); }
    setSaving(false);
  };

  const handleUpdate = async (f: any) => {
    setSaving(true); setSaveError('');
    try { await put(`/media-tv/${f._id}`, f); setEditId(null); await load(); }
    catch (e: any) { setSaveError(e.message || 'Failed to save.'); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this video?')) return;
    try { await del(`/media-tv/${id}`); await load(); } catch {}
  };

  const filtered = videos.filter(v =>
    !search || v.title.toLowerCase().includes(search.toLowerCase()) || (v.category || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Media TV</h2>
          <p className="mt-0.5 text-sm text-gray-400">Manage YouTube videos for the Media TV page. Each gets its own page on the website.</p>
        </div>
        {!adding && !editId && (
          <button onClick={() => { setAdding(true); setSaveError(''); window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }}
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 transition shadow-sm">
            + Add Video
          </button>
        )}
      </div>

      {/* Search */}
      {videos.length > 0 && (
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by title or category…"
          className="w-full max-w-sm rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none" />
      )}

      {loading && <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-24 rounded-xl bg-gray-100 animate-pulse" />)}</div>}

      {!loading && filtered.length === 0 && !adding && (
        <div className="rounded-xl border-2 border-dashed border-gray-200 p-14 text-center">
          <p className="text-4xl mb-3">📺</p>
          <p className="font-bold text-gray-500">{search ? 'No videos match your search.' : 'No videos yet.'}</p>
          {!search && <p className="mt-1 text-sm text-gray-400">Click "+ Add Video" to add the first one.</p>}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="space-y-2">
          {filtered.map(v =>
            editId === v._id ? (
              <VideoForm key={v._id} init={v} onSave={handleUpdate}
                onCancel={() => { setEditId(null); setSaveError(''); }} saving={saving} error={saveError} />
            ) : (
              <VideoRow key={v._id} v={v}
                onEdit={() => { setEditId(v._id); setAdding(false); setSaveError(''); window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }}
                onDelete={() => handleDelete(v._id)} />
            )
          )}
        </div>
      )}

      {adding && (
        <VideoForm onSave={handleCreate} onCancel={() => { setAdding(false); setSaveError(''); }} saving={saving} error={saveError} />
      )}
    </div>
  );
}
