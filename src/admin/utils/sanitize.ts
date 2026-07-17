const ALLOWED_TAGS = ['p', 'b', 'strong', 'i', 'em', 'u', 'h2', 'h3', 'ul', 'ol', 'li', 'br', 'blockquote', 'a', 'img'];
const BLOCK_TAGS = ['p', 'h2', 'h3', 'ul', 'ol', 'li', 'blockquote', 'div']; // div treated as a paragraph-like block

const SAFE_IMG_STYLE_PROPS = ['max-width', 'width', 'height', 'border-radius', 'margin', 'margin-top', 'margin-bottom', 'display'];

function isBold(el: Element): boolean {
  const tag = el.tagName.toLowerCase();
  const fw = (el as HTMLElement).style?.fontWeight || '';
  if (fw) {
    if (fw === 'normal' || fw === '400' || Number(fw) < 600) return false; // explicit override (e.g. Google Docs wrapper div)
    if (fw === 'bold' || fw === '700' || Number(fw) >= 600) return true;
  }
  return tag === 'b' || tag === 'strong';
}

function isItalic(el: Element): boolean {
  const tag = el.tagName.toLowerCase();
  const fs = (el as HTMLElement).style?.fontStyle || '';
  if (fs === 'normal') return false;
  if (fs === 'italic' || fs === 'oblique') return true;
  return tag === 'i' || tag === 'em';
}

function isUnderline(el: Element): boolean {
  const tag = el.tagName.toLowerCase();
  const td = (el as HTMLElement).style?.textDecoration || (el as HTMLElement).style?.textDecorationLine || '';
  if (td.includes('none')) return false;
  if (td.includes('underline')) return true;
  return tag === 'u';
}

function sanitizeImgStyle(styleText: string | null): string {
  if (!styleText) return '';
  const kept: string[] = [];
  styleText.split(';').forEach((decl) => {
    const [propRaw, valRaw] = decl.split(':');
    if (!propRaw || !valRaw) return;
    const prop = propRaw.trim().toLowerCase();
    const val = valRaw.trim();
    if (SAFE_IMG_STYLE_PROPS.includes(prop) && !/url\(|expression\(|javascript:/i.test(val)) {
      kept.push(`${prop}: ${val}`);
    }
  });
  return kept.join('; ');
}

function isSafeImgSrc(src: string | null): boolean {
  if (!src) return false;
  return /^https?:\/\//i.test(src) || /^data:image\//i.test(src);
}

export function sanitizeHtml(dirty: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(dirty, 'text/html');

  function wrapFormatting(children: Node[], el: Element): Node {
    let container: Node = document.createDocumentFragment();
    children.forEach((c) => container.appendChild(c));

    if (isUnderline(el)) {
      const u = document.createElement('u');
      u.appendChild(container);
      container = u;
    }
    if (isItalic(el)) {
      const i = document.createElement('i');
      i.appendChild(container);
      container = i;
    }
    if (isBold(el)) {
      const b = document.createElement('b');
      b.appendChild(container);
      container = b;
    }
    return container;
  }

  function clean(node: Node): Node | null {
    if (node.nodeType === Node.TEXT_NODE) return node.cloneNode();
    if (node.nodeType !== Node.ELEMENT_NODE) return null;

    const el = node as Element;
    const tag = el.tagName.toLowerCase();

    if (['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'meta', 'link'].includes(tag)) {
      return null;
    }

    // Images: keep as a safe, self-contained element (no children to process)
    if (tag === 'img') {
      const src = el.getAttribute('src');
      if (!isSafeImgSrc(src)) return null;

      const img = document.createElement('img');
      img.setAttribute('src', src as string);

      const alt = el.getAttribute('alt');
      if (alt) img.setAttribute('alt', alt);

      const safeStyle = sanitizeImgStyle(el.getAttribute('style'));
      img.setAttribute(
        'style',
        safeStyle || 'max-width:100%;height:auto;border-radius:8px;margin:12px 0;display:block;'
      );

      return img;
    }

    // Process children first (needed for both branches below)
    const cleanedChildren: Node[] = [];
    el.childNodes.forEach((child) => {
      const cleaned = clean(child);
      if (cleaned) cleanedChildren.push(cleaned);
    });

    // Generic inline containers (span, font, and any tag we don't recognize as block)
    // get unwrapped — their formatting (if any) is preserved via wrapFormatting,
    // but they do NOT become a new paragraph. This is the key fix: a bolded
    // word/phrase inside a sentence no longer breaks the sentence into its own <p>.
    const isRecognizedBlock = BLOCK_TAGS.includes(tag);
    const isAllowedInline = ['b', 'strong', 'i', 'em', 'u', 'a', 'br'].includes(tag);

    if (!isRecognizedBlock && !isAllowedInline) {
      // span / font / other unknown inline-ish wrappers → unwrap, keep formatting
      return wrapFormatting(cleanedChildren, el);
    }

    if (tag === 'br') {
      return document.createElement('br');
    }

    if (tag === 'a') {
      const newEl = document.createElement('a');
      const href = el.getAttribute('href');
      if (href) newEl.setAttribute('href', href);
      newEl.setAttribute('target', '_blank');
      newEl.setAttribute('rel', 'noopener noreferrer');
      cleanedChildren.forEach((c) => newEl.appendChild(c));
      return newEl;
    }

    if (isAllowedInline) {
      // b / strong / i / em / u — keep as-is, but also respect an explicit
      // style override (e.g. font-weight:normal on a <b> Google Docs guid wrapper)
      const wrapped = wrapFormatting(cleanedChildren, el);
      return wrapped;
    }

    // Block-level: p, h2, h3, ul, ol, li, blockquote, div(→p)
    const newTag = ALLOWED_TAGS.includes(tag) ? tag : 'p';
    const newEl = document.createElement(newTag);
    cleanedChildren.forEach((c) => newEl.appendChild(c));

    if (['p', 'h2', 'h3', 'li'].includes(newTag) && !newEl.textContent?.trim() && !newEl.querySelector('img')) {
      return null;
    }

    return newEl;
  }

  const result = document.createElement('div');
  doc.body.childNodes.forEach((child) => {
    const cleaned = clean(child);
    if (cleaned) result.appendChild(cleaned);
  });

  return result.innerHTML;
}
