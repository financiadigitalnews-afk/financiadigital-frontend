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

const EMPTY = { title: '', author: '', date: '', description: '', sortOrder: 0, isActive: true };

function MagazineForm({ init, onSave, onCancel, saving, error }: {
  init?: any; onSave: (d: any, cover: File|null, pages: File[]) => void;
  onCancel: () => void; saving: boolean; error: string;
}) {
  const [f, setF]           = useState<any>({ ...EMPTY, ...(init || {}) });
  const [cover, setCover]   = useState<File|null>(null);
  const [coverPrev, setCoverPrev] = useState(init?.coverUrl || '');
  const [newPages, setNewPages]   = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const existingPages: any[] = Array.isArray(init?.pages) ? init.pages : [];
  const totalPages = existingPages.length + newPages.length;
  const slotsLeft  = Math.max(0, 50 - totalPages);

  const s = (k: string, v: any) => setF((p: any) => ({ ...p, [k]: v }));
  const fld = 'w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-indigo-400 focus:bg-white focus:outline-none transition';
  const lbl = 'mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide';

  return (
    <div className="rounded-xl border border-indigo-100 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-white px-6 py-4">
        <div>
          <p className="text-base font-bold text-gray-800">{init?._id ? '✏️ Edit Magazine' : '➕ New Magazine'}</p>
          <p className="text-xs text-indigo-500 mt-0.5">{totalPages}/50 pages</p>
        </div>
        <button onClick={onCancel} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-50">✕ Close</button>
      </div>

      <div className="p-6 space-y-5">
        {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">⚠️ {error}</div>}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={lbl}>Magazine Title *</label>
            <input value={f.title} onChange={e => s('title', e.target.value)} className={fld} placeholder="e.g. Finance Monthly — May 2026" />
          </div>
          <div>
            <label className={lbl}>Author / Editor</label>
            <input value={f.author} onChange={e => s('author', e.target.value)} className={fld} />
          </div>
          <div>
            <label className={lbl}>Date</label>
            <input value={f.date} onChange={e => s('date', e.target.value)} className={fld} placeholder="e.g. May 2026" />
          </div>
          <div className="sm:col-span-2">
            <label className={lbl}>Description</label>
            <textarea value={f.description} onChange={e => s('description', e.target.value)} rows={2} className={fld} placeholder="Brief description of this issue…" />
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

        {/* Cover */}
        <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4">
          <label className={lbl}>Cover Image *</label>
          {coverPrev && <img src={coverPrev} alt="" className="mb-3 h-40 w-28 rounded-lg object-cover shadow" />}
          <input type="file" accept="image/*"
            onChange={e => { const fl = e.target.files?.[0]; if (fl) { setCover(fl); setCoverPrev(URL.createObjectURL(fl)); }}}
            className="w-full text-xs text-gray-500 file:mr-2 file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-gray-700 file:shadow-sm"
          />
          <p className="mt-1 text-[10px] text-gray-400">This is the cover shown on the magazine listing page.</p>
        </div>

        {/* Existing pages */}
        {existingPages.length > 0 && (
          <div>
            <label className={lbl}>Saved Pages ({existingPages.length})</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {existingPages.map((pg: any, i: number) => (
                <div key={i} className="relative group overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                  <img src={pg.url} alt="" className="h-20 w-14 object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition">
                    <span className="text-white text-[10px] font-bold">{i + 1}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-1.5 text-[10px] text-blue-500">To remove individual pages, use the page manager below after saving.</p>
          </div>
        )}

        {/* Upload new pages */}
        <div className="rounded-lg border border-dashed border-blue-200 bg-blue-50/40 p-4 space-y-3">
          <label className={lbl}>Add Pages — {totalPages}/50 used ({slotsLeft} slots left)</label>
          {slotsLeft > 0 ? (
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50 transition w-fit">
              <span>+ Add Page Images (up to {slotsLeft})</span>
              <input type="file" accept="image/*" multiple className="hidden"
                onChange={e => {
                  const selected = Array.from(e.target.files || []).slice(0, slotsLeft);
                  setNewPages(p => [...p, ...selected].slice(0, slotsLeft));
                  setNewPreviews(p => [...p, ...selected.map(fl => URL.createObjectURL(fl))].slice(0, slotsLeft));
                  e.target.value = '';
                }}
              />
            </label>
          ) : (
            <p className="text-xs text-red-500">Magazine full (50/50 pages).</p>
          )}
          {newPreviews.length > 0 && (
            <div>
              <p className="mb-1.5 text-[10px] font-semibold text-emerald-600 uppercase tracking-wide">New ({newPages.length}) — will be added</p>
              <div className="flex flex-wrap gap-2">
                {newPreviews.map((src, i) => (
                  <div key={i} className="relative group overflow-hidden rounded-lg border border-emerald-200">
                    <img src={src} alt="" className="h-20 w-14 object-cover" />
                    <button onClick={() => { setNewPages(p => p.filter((_, j) => j !== i)); setNewPreviews(p => p.filter((_, j) => j !== i)); }}
                      className="absolute inset-0 flex items-center justify-center bg-red-600/70 opacity-0 group-hover:opacity-100 transition text-white text-xs font-bold">✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <p className="text-[10px] text-blue-400">Upload pages in order. Each page = one image. Max 50 pages per magazine.</p>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
          <button onClick={onCancel} className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">Cancel</button>
          <button onClick={() => onSave(f, cover, newPages)}
            disabled={saving || !f.title}
            className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50 transition shadow-sm">
            {saving ? '⏳ Saving…' : init?._id ? '✓ Update Magazine' : '✓ Create Magazine'}
          </button>
        </div>
      </div>
    </div>
  );
}

function MagazineCard({ mag, onEdit, onDelete, onManagePages }: {
  mag: any; onEdit: () => void; onDelete: () => void; onManagePages: () => void;
}) {
  return (
    <div className="group flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-4 transition hover:border-indigo-200 hover:shadow-sm">
      {mag.coverUrl ? (
        <img src={mag.coverUrl} alt={mag.title} className="h-28 w-20 shrink-0 rounded-lg object-cover shadow" />
      ) : (
        <div className="h-28 w-20 shrink-0 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 text-xs">No Cover</div>
      )}
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex flex-wrap items-center gap-1">
          <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${mag.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
            {mag.isActive ? '● Active' : '○ Hidden'}
          </span>
          <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
            📄 {mag.pages?.length || 0} pages
          </span>
          {mag.sortOrder > 0 && <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500">#{mag.sortOrder}</span>}
        </div>
        <p className="truncate text-sm font-bold text-gray-800">{mag.title}</p>
        <p className="mt-0.5 text-xs text-gray-400">{[mag.author, mag.date].filter(Boolean).join(' · ')}</p>
        {mag.description && <p className="mt-1 text-xs text-gray-500 line-clamp-2">{mag.description}</p>}
        <div className="mt-3 flex flex-wrap gap-1.5">
          <button onClick={onEdit} className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition">Edit</button>
          <button onClick={onManagePages} className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition">Manage Pages</button>
          <button onClick={onDelete} className="rounded-lg border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition">Delete</button>
        </div>
      </div>
    </div>
  );
}

function PageManager({ mag, onClose, onPageDeleted }: { mag: any; onClose: () => void; onPageDeleted: (mag: any) => void }) {
  const { del } = useAdminApi();
  const [deleting, setDeleting] = useState<number|null>(null);

  const deletePage = async (idx: number) => {
    if (!confirm(`Delete page ${idx + 1}? This cannot be undone.`)) return;
    setDeleting(idx);
    try {
      const updated = await del(`/magazines/${mag._id}/page/${idx}`);
      onPageDeleted(updated);
    } catch {}
    setDeleting(null);
  };

  return (
    <div className="rounded-xl border border-blue-100 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white px-6 py-4">
        <div>
          <p className="text-base font-bold text-gray-800">📄 Page Manager</p>
          <p className="text-xs text-blue-500 mt-0.5">{mag.title} — {mag.pages?.length || 0}/50 pages</p>
        </div>
        <button onClick={onClose} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-50">✕ Close</button>
      </div>
      <div className="p-6">
        {(!mag.pages || mag.pages.length === 0) ? (
          <p className="text-sm text-gray-400 text-center py-8">No pages uploaded yet. Edit the magazine to add pages.</p>
        ) : (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-8 xl:grid-cols-10">
            {mag.pages.map((pg: any, i: number) => (
              <div key={i} className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                <img src={pg.url} alt={`Page ${i + 1}`} className="h-24 w-full object-cover" />
                <div className="absolute bottom-0 inset-x-0 flex items-center justify-between bg-black/60 px-1.5 py-1">
                  <span className="text-[9px] text-white font-bold">{i + 1}</span>
                  <button onClick={() => deletePage(i)}
                    disabled={deleting === i}
                    className="text-[9px] text-red-300 hover:text-red-100 font-bold disabled:opacity-50">
                    {deleting === i ? '…' : '✕'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="mt-4 text-[10px] text-gray-400">Hover over a page and click ✕ to delete it. Use Edit Magazine to add more pages.</p>
      </div>
    </div>
  );
}

export function AdminMagazines() {
  const { get, post, put, del } = useAdminApi();
  const [magazines, setMagazines] = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [adding, setAdding]       = useState(false);
  const [editId, setEditId]       = useState<string|null>(null);
  const [manageId, setManageId]   = useState<string|null>(null);
  const [saving, setSaving]       = useState(false);
  const [saveError, setSaveError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try { setMagazines(await get('/magazines/admin/all')); } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const toFD = (f: any, cover: File|null, pages: File[]) => {
    const fd = new FormData();
    Object.entries(f).forEach(([k, v]) => { if (v !== undefined && v !== null) fd.append(k, String(v)); });
    if (cover) fd.append('cover', cover);
    pages.forEach(p => fd.append('pages', p));
    return fd;
  };

  const handleCreate = async (f: any, cover: File|null, pages: File[]) => {
    setSaving(true); setSaveError('');
    try { await post('/magazines', toFD(f, cover, pages)); setAdding(false); await load(); }
    catch (e: any) { setSaveError(e.message || 'Failed to save.'); }
    setSaving(false);
  };

  const handleUpdate = async (f: any, cover: File|null, pages: File[]) => {
    setSaving(true); setSaveError('');
    try { await put(`/magazines/${f._id}`, toFD(f, cover, pages)); setEditId(null); await load(); }
    catch (e: any) { setSaveError(e.message || 'Failed to save.'); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this magazine and all its pages permanently?')) return;
    try { await del(`/magazines/${id}`); await load(); } catch {}
  };

  const handlePageDeleted = (updatedMag: any) => {
    setMagazines(prev => prev.map(m => m._id === updatedMag._id ? updatedMag : m));
  };

  const manageMag = magazines.find(m => m._id === manageId);
  const editMag   = magazines.find(m => m._id === editId);

  return (
    <div className="space-y-4 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Magazines</h2>
          <p className="mt-0.5 text-sm text-gray-400">Create and manage digital magazines with up to 50 pages each.</p>
        </div>
        {!adding && !editId && !manageId && (
          <button onClick={() => { setAdding(true); setSaveError(''); window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700 transition shadow-sm">
            + New Magazine
          </button>
        )}
      </div>

      {loading && <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-32 rounded-xl bg-gray-100 animate-pulse" />)}</div>}

      {!loading && magazines.length === 0 && !adding && (
        <div className="rounded-xl border-2 border-dashed border-gray-200 p-14 text-center">
          <p className="text-4xl mb-3">📚</p>
          <p className="font-bold text-gray-500">No magazines yet</p>
          <p className="mt-1 text-sm text-gray-400">Click "+ New Magazine" to create the first one.</p>
        </div>
      )}

      {!loading && magazines.length > 0 && (
        <div className="space-y-3">
          {magazines.map(mag =>
            editId === mag._id ? (
              <MagazineForm key={mag._id} init={mag} onSave={handleUpdate}
                onCancel={() => { setEditId(null); setSaveError(''); }} saving={saving} error={saveError} />
            ) : manageId === mag._id ? (
              <PageManager key={mag._id} mag={mag} onClose={() => setManageId(null)} onPageDeleted={handlePageDeleted} />
            ) : (
              <MagazineCard key={mag._id} mag={mag}
                onEdit={() => { setEditId(mag._id); setAdding(false); setManageId(null); setSaveError(''); window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }}
                onDelete={() => handleDelete(mag._id)}
                onManagePages={() => { setManageId(mag._id); setEditId(null); setAdding(false); }}
              />
            )
          )}
        </div>
      )}

      {adding && (
        <MagazineForm onSave={handleCreate} onCancel={() => { setAdding(false); setSaveError(''); }} saving={saving} error={saveError} />
      )}
    </div>
  );
}