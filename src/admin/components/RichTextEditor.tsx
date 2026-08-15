
import { useEffect, useRef, useState } from 'react';
import { sanitizeHtml } from '../utils/sanitize';
import { useAdminAuth } from '../context/AdminAuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const TOOLS = [
  { cmd: 'bold', icon: '<b>B</b>', title: 'Bold' },
  { cmd: 'italic', icon: '<i>I</i>', title: 'Italic' },
  { cmd: 'underline', icon: '<u>U</u>', title: 'Underline' },
  { cmd: 'h2', icon: 'H2', title: 'Heading 2', isBlock: true },
  { cmd: 'h3', icon: 'H3', title: 'Heading 3', isBlock: true },
  { cmd: 'insertUnorderedList', icon: '• List', title: 'Bullet List' },
  { cmd: 'insertOrderedList', icon: '1. List', title: 'Numbered List' },
  { cmd: 'justifyLeft', icon: '⬅ Left', title: 'Align Left' },
  { cmd: 'justifyCenter', icon: '⬛ Center', title: 'Center' },
  { cmd: 'removeFormat', icon: '✕ Clear', title: 'Clear Formatting' },
];

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Pulls a YouTube video ID out of any common URL shape the user might paste.
function extractYouTubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return m ? m[1] : null;
}

export function RichTextEditor({ value, onChange, placeholder }: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const { admin } = useAdminAuth();
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const activeImgRef = useRef<HTMLImageElement | null>(null);
  const [imgToolbar, setImgToolbar] = useState<{ top: number; left: number } | null>(null);

  const [videoMenuOpen, setVideoMenuOpen] = useState(false);
  const [youtubeInput, setYoutubeInput] = useState('');
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoError, setVideoError] = useState('');

  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML && value) {
      editorRef.current.innerHTML = sanitizeHtml(value);
    }
  }, []);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.anchorNode)) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    const sel = window.getSelection();
    if (sel && savedRangeRef.current) {
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
    }
  };

  const exec = (cmd: string, isBlock = false) => {
    editorRef.current?.focus();
    restoreSelection();
    if (isBlock) document.execCommand('formatBlock', false, cmd);
    else document.execCommand(cmd, false, undefined);
    handleInput();
  };

  const handleInput = () => {
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const raw = e.clipboardData.getData('text/html') || e.clipboardData.getData('text/plain');
    const clean = sanitizeHtml(raw);
    document.execCommand('insertHTML', false, clean);
    handleInput();
  };

  const insertImageAt = async (file: File) => {
    const dataUrl = await fileToDataUrl(file);
    editorRef.current?.focus();
    restoreSelection();
    const imgHtml = `<img src="${dataUrl}" style="max-width:100%;height:auto;border-radius:8px;margin:12px 0;display:block;" />`;
    document.execCommand('insertHTML', false, imgHtml);
    handleInput();
  };

  const handleInsertImageClick = () => {
    saveSelection();
    fileInputRef.current?.click();
  };

  const handleFileChosen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await insertImageAt(file);
    e.target.value = '';
  };

  const handleEditorClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'IMG') {
      const rect = target.getBoundingClientRect();
      const parentRect = editorRef.current!.getBoundingClientRect();
      activeImgRef.current = target as HTMLImageElement;
      setImgToolbar({ top: rect.top - parentRect.top - 36, left: rect.left - parentRect.left });
    } else {
      setImgToolbar(null);
      activeImgRef.current = null;
    }
  };

  const handleReplaceFileChosen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeImgRef.current) {
      activeImgRef.current.src = await fileToDataUrl(file);
      handleInput();
    }
    e.target.value = '';
    setImgToolbar(null);
  };

  const handleRemoveImage = () => {
    activeImgRef.current?.remove();
    handleInput();
    setImgToolbar(null);
  };

  // --- Video insertion ---

  const handleVideoButtonClick = () => {
    saveSelection();
    setVideoError('');
    setVideoMenuOpen((o) => !o);
  };

  const handleInsertYouTube = () => {
    const id = extractYouTubeId(youtubeInput.trim());
    if (!id) {
      setVideoError('Could not find a valid YouTube link in that text.');
      return;
    }
    editorRef.current?.focus();
    restoreSelection();
    const embedHtml = `<div style="position:relative;padding-top:56.25%;margin:16px 0;border-radius:8px;overflow:hidden;"><iframe src="https://www.youtube.com/embed/${id}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allowfullscreen></iframe></div>`;
    document.execCommand('insertHTML', false, embedHtml);
    handleInput();
    setYoutubeInput('');
    setVideoError('');
    setVideoMenuOpen(false);
  };

  const handleDeviceVideoClick = () => {
    setVideoMenuOpen(false);
    videoFileInputRef.current?.click();
  };

  // Uploads the video file to your real backend (Cloudinary, via
  // /api/uploads) and inserts the resulting hosted URL — not a base64
  // data URL. This keeps large video files out of your MongoDB documents.
  const handleVideoFileChosen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVideoUploading(true);
    setVideoError('');
    saveSelection();

    try {
      const fd = new FormData();
      fd.append('file', file);

      const res = await fetch(`${API_URL}/uploads`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${admin?.token || ''}` },
        body: fd,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.url) {
        throw new Error(data?.message || 'Video upload failed');
      }

      editorRef.current?.focus();
      restoreSelection();
      const videoHtml = `<video src="${data.url}" controls style="max-width:100%;border-radius:8px;margin:12px 0;display:block;"></video>`;
      document.execCommand('insertHTML', false, videoHtml);
      handleInput();
    } catch (err: any) {
      setVideoError(err.message || 'Video upload failed');
    } finally {
      setVideoUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 focus-within:border-red-400 focus-within:ring-1 focus-within:ring-red-400">
      <div className="relative flex flex-wrap gap-0.5 border-b border-gray-100 bg-gray-50 p-1.5">
        {TOOLS.map((t) => (
          <button
            key={t.cmd}
            type="button"
            title={t.title}
            onMouseDown={(e) => { e.preventDefault(); exec(t.cmd, t.isBlock); }}
            className="min-w-[36px] rounded-md px-2 py-1 text-xs font-medium text-gray-600 transition hover:bg-white hover:text-gray-900 hover:shadow-sm"
            dangerouslySetInnerHTML={{ __html: t.icon }}
          />
        ))}
        <button
          type="button"
          title="Insert Image"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleInsertImageClick}
          className="min-w-[36px] rounded-md px-2 py-1 text-xs font-medium text-gray-600 transition hover:bg-white hover:text-gray-900 hover:shadow-sm"
        >
          🖼 Image
        </button>

        <button
          type="button"
          title="Insert Video"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleVideoButtonClick}
          className="min-w-[36px] rounded-md px-2 py-1 text-xs font-medium text-gray-600 transition hover:bg-white hover:text-gray-900 hover:shadow-sm"
        >
          🎥 Video
        </button>

        {videoMenuOpen && (
          <div className="absolute left-0 top-full z-20 mt-1 w-72 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
            <button
              type="button"
              onClick={handleDeviceVideoClick}
              disabled={videoUploading}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-left text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              {videoUploading ? '⏳ Uploading…' : '📁 Upload from device'}
            </button>

            <div className="mt-2 flex gap-1.5">
              <input
                value={youtubeInput}
                onChange={(e) => setYoutubeInput(e.target.value)}
                placeholder="Paste YouTube link…"
                className="flex-1 rounded-md border border-gray-200 px-2 py-1.5 text-xs focus:border-indigo-400 focus:outline-none"
                onKeyDown={(e) => e.key === 'Enter' && handleInsertYouTube()}
              />
              <button
                type="button"
                onClick={handleInsertYouTube}
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700"
              >
                Add
              </button>
            </div>

            {videoError && (
              <p className="mt-2 text-xs text-red-500">{videoError}</p>
            )}
          </div>
        )}

        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChosen} />
        <input ref={replaceInputRef} type="file" accept="image/*" className="hidden" onChange={handleReplaceFileChosen} />
        <input ref={videoFileInputRef} type="file" accept="video/*" className="hidden" onChange={handleVideoFileChosen} />
      </div>

      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onBlur={() => { handleInput(); saveSelection(); }}
          onKeyUp={saveSelection}
          onMouseUp={saveSelection}
          onClick={handleEditorClick}
          onPaste={handlePaste}
          data-placeholder={placeholder || 'Write or paste article content here...'}
          style={{ resize: 'vertical', overflow: 'auto', minHeight: '220px' }}
          className="block w-full px-4 py-3 text-sm text-gray-800 outline-none
            [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-3 [&_h2]:mb-1 [&_h2]:text-gray-900
            [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-2 [&_h3]:mb-1 [&_h3]:text-gray-800
            [&_b]:font-bold [&_strong]:font-bold
            [&_i]:italic [&_em]:italic
            [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2
            [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2
            [&_li]:mb-1 [&_p]:mb-2 [&_p]:leading-relaxed
            [&_img]:cursor-pointer [&_img:hover]:ring-2 [&_img:hover]:ring-indigo-300
            empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400"
        />

        {imgToolbar && (
          <div
            className="absolute z-10 flex gap-1 rounded-lg border border-gray-200 bg-white px-1.5 py-1 shadow-md"
            style={{ top: imgToolbar.top, left: imgToolbar.left }}
          >
            <button onClick={() => replaceInputRef.current?.click()} className="rounded px-2 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50">Replace</button>
            <button onClick={handleRemoveImage} className="rounded px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50">Remove</button>
          </div>
        )}
      </div>
    </div>
  );
}
