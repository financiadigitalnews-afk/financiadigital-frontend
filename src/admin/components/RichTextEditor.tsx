
import { useEffect, useRef, useState } from 'react';
import { sanitizeHtml } from '../utils/sanitize';

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

export function RichTextEditor({ value, onChange, placeholder }: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const activeImgRef = useRef<HTMLImageElement | null>(null);
  const [imgToolbar, setImgToolbar] = useState<{ top: number; left: number } | null>(null);

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

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 focus-within:border-red-400 focus-within:ring-1 focus-within:ring-red-400">
      <div className="flex flex-wrap gap-0.5 border-b border-gray-100 bg-gray-50 p-1.5">
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
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChosen} />
        <input ref={replaceInputRef} type="file" accept="image/*" className="hidden" onChange={handleReplaceFileChosen} />
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
