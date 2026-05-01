import React from 'react';

type IconProps = { className?: string };

const makeIcon =
  (path: React.ReactNode) =>
  ({ className = 'h-5 w-5' }: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {path}
    </svg>
  );

export const SearchIcon = makeIcon(
  <>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </>
);

export const MenuIcon = makeIcon(
  <>
    <path d="M4 7h16" />
    <path d="M4 12h16" />
    <path d="M4 17h16" />
  </>
);

export const CloseIcon = makeIcon(
  <>
    <path d="M6 6l12 12" />
    <path d="M18 6 6 18" />
  </>
);

export const ArrowRightIcon = makeIcon(
  <>
    <path d="M5 12h14" />
    <path d="m13 5 7 7-7 7" />
  </>
);

export const PlayIcon = makeIcon(
  <>
    <path d="m8 5 11 7-11 7V5Z" />
  </>
);
export const FacebookIcon = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="12" fill="#1877F2" />
    <path
      fill="#fff"
      d="M14.8 12.7h-1.9V20h-3v-7.3H8.4v-2.6h1.5V8.4c0-1.2.6-3.2 3.2-3.2h2.3v2.6h-1.7c-.3 0-.8.2-.8.9v1.4h2.4l-.5 2.6Z"
    />
  </svg>
);

export const InstagramIcon = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <defs>
      <radialGradient id="igA" cx="30%" cy="107%" r="150%">
        <stop offset="0" stopColor="#fdf497" />
        <stop offset="0.2" stopColor="#fdf497" />
        <stop offset="0.45" stopColor="#fd5949" />
        <stop offset="0.6" stopColor="#d6249f" />
        <stop offset="0.9" stopColor="#285AEB" />
      </radialGradient>
    </defs>
    <circle cx="12" cy="12" r="12" fill="url(#igA)" />
    <rect x="6.2" y="6.2" width="11.6" height="11.6" rx="3.4" fill="none" stroke="#fff" strokeWidth="1.6" />
    <circle cx="12" cy="12" r="3" fill="none" stroke="#fff" strokeWidth="1.6" />
    <circle cx="15.8" cy="8.3" r="1" fill="#fff" />
  </svg>
);

export const XIcon = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="12" fill="#000" />
    <path
      fill="#fff"
      d="M14.2 10.4 19.4 4.5h-1.3l-4.5 5.1-3.6-5.1H5.8l5.4 7.7-5.4 6.2h1.3l4.7-5.4 3.8 5.4h4.2l-5.6-8Zm-1.7 1.9-.5-.8-4.4-6h1.8l3.5 4.8.5.8 4.6 6.3h-1.8l-3.7-5.1Z"
    />
  </svg>
);
export const LinkedinIcon = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="12" fill="#0A66C2" />
    <path
      fill="#fff"
      d="M7.2 9.3h2.3v7.5H7.2V9.3Zm1.2-3.7a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6Zm3.1 3.7h2.2v1h.1c.3-.6 1.1-1.2 2.2-1.2 2.4 0 2.8 1.6 2.8 3.6v4.1h-2.3v-3.6c0-.9 0-2-1.2-2s-1.4.9-1.4 1.9v3.7h-2.4V9.3Z"
    />
  </svg>
);
export const LocationIcon = makeIcon(
  <>
    <path d="M12 21s6-4.35 6-10a6 6 0 1 0-12 0c0 5.65 6 10 6 10Z" />
    <circle cx="12" cy="11" r="2.2" />
  </>
);