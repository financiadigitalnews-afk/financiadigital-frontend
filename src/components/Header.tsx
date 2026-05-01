import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { navigation } from '../data/siteData';
import { CloseIcon, MenuIcon } from './Icons';
import { SearchBox } from './SearchBox';
import logo1 from '../assets/logo.png';
import { SocialLinks } from './SocialLinks';
import { DropdownPanel } from './DropdownPanel';

type DropdownItem = { name: string; slug: string };

type NavItem = {
  name: string;
  slug: string;
  children?: DropdownItem[];
};

function LivePodcastLink({
  to,
  mobile = false,
  onClick,
}: {
  to: string;
  mobile?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`group relative isolate overflow-hidden font-black text-white transition duration-300 ${
        mobile
          ? 'flex items-center justify-between rounded-2xl px-5 py-4'
          : 'inline-flex items-center gap-3 rounded-full px-5 py-3'
      } bg-gradient-to-r from-violet-700 via-fuchsia-600 to-rose-500 shadow-[0_14px_34px_rgba(168,85,247,0.28)] hover:-translate-y-0.5 hover:shadow-[0_18px_44px_rgba(168,85,247,0.38)]`}
    >
      <span className="absolute inset-0 -z-10 opacity-70 [background:radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.34),transparent_28%),linear-gradient(110deg,transparent,rgba(255,255,255,0.24),transparent)] [background-size:100%_100%,220%_100%] group-hover:animate-[lpShine_1.8s_linear_infinite]" />

      <span className="flex items-center gap-3">
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-70" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
        </span>
        <span>Live Podcast</span>
      </span>

      <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-white ring-1 ring-white/30">
        Live
      </span>
    </Link>
  );
}

function ChevronIcon({ open = false }: { open?: boolean }) {
  return (
    <svg
      className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MobileAccordionItem({
  item,
  isOpen,
  onToggle,
  onNavigate,
}: {
  item: NavItem;
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  const hasChildren = !!item.children?.length;
  const isLivePodcast = item.name === 'Live Podcast';

  if (isLivePodcast) {
    return <LivePodcastLink to={item.slug} mobile onClick={onNavigate} />;
  }

  if (!hasChildren) {
    return (
      <Link
        to={item.slug}
        onClick={onNavigate}
        className="rounded-2xl border border-slate-200 bg-white px-5 py-4 font-bold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
      >
        {item.name}
      </Link>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-bold text-slate-900 transition hover:bg-slate-50"
      >
        <span>{item.name}</span>
        <ChevronIcon open={isOpen} />
      </button>

      <div
        className={`grid transition-all duration-300 ease-out ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-slate-200 bg-slate-50 p-3">
            <div className="grid gap-2">
              {item.children?.map((child) => (
                <Link
                  key={child.slug}
                  to={child.slug}
                  onClick={onNavigate}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
                >
                  {child.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<NavItem | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousTouchAction = document.body.style.touchAction;

    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.touchAction = previousTouchAction;
    };
  }, [mobileOpen]);


  useEffect(() => {
  const previousOverflow = document.body.style.overflow;
  const previousTouchAction = document.body.style.touchAction;

  if (activeDropdown) {
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
  }

  return () => {
    document.body.style.overflow = previousOverflow;
    document.body.style.touchAction = previousTouchAction;
  };
}, [activeDropdown]);
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveDropdown(null);
        setMobileOpen(false);
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const navItems = useMemo<NavItem[]>(() => navigation, []);

  const desktopNavItems = useMemo<NavItem[]>(() => {
    return navItems.filter((item) => !['About Us', 'Membership'].includes(item.name));
  }, [navItems]);

  const utilityNavItems = useMemo<NavItem[]>(() => {
    return navItems.filter((item) => ['About Us', 'Membership'].includes(item.name));
  }, [navItems]);

  const mobileNavItems = useMemo<NavItem[]>(() => navItems, [navItems]);

  const closeAllMenus = () => {
    setActiveDropdown(null);
    setMobileOpen(false);
  };

  const toggleMobileAccordion = (name: string) => {
    setMobileExpanded((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <>
      <style>
        {`
          @keyframes lpShine {
            0% { background-position: 0 0, 220% 0; }
            100% { background-position: 0 0, -40% 0; }
          }
        `}
      </style>

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/88">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-5 lg:px-6 xl:px-8">
          <Link to="/" className="flex min-w-0 items-center">
            <div className="w-[190px] sm:w-[240px] lg:w-[290px] xl:w-[320px]">
              <img
                src={logo1}
                alt="Financia Digital News"
                className="block h-auto max-h-20 w-full object-contain object-left"
              />
            </div>
          </Link>

          <div className="hidden flex-1 items-center justify-end gap-4 lg:flex">
            <div className="flex items-center gap-3">
              <SocialLinks />
            </div>

            <div className="h-9 w-px bg-slate-200" />

            <div className="w-[250px] xl:w-[320px]">
              <SearchBox />
            </div>

            <div className="flex items-center gap-4 pl-1 text-sm font-bold text-slate-700">
              {utilityNavItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.slug}
                  className="rounded-full px-2.5 py-2 transition hover:bg-slate-100 hover:text-slate-950"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <button
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            className="inline-flex shrink-0 rounded-full border border-slate-200 p-2.5 text-slate-900 transition hover:bg-slate-50 lg:hidden"
            onClick={() => setMobileOpen((s) => !s)}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        <div
          className="relative hidden border-t border-slate-200 bg-white lg:block"
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <nav className="mx-auto flex w-full max-w-7xl items-center justify-center gap-2 px-6 py-3 xl:px-8">
            {desktopNavItems.map((item) => {
              const hasDropdown = !!item.children?.length;
              const isActive = activeDropdown?.name === item.name;
              const isLivePodcast = item.name === 'Live Podcast';

              if (isLivePodcast) {
                return (
                  <div
                    key={item.name}
                    className="mx-2 shrink-0"
                    onMouseEnter={() => setActiveDropdown(null)}
                  >
                    <LivePodcastLink to={item.slug} />
                  </div>
                );
              }

              return hasDropdown ? (
                <button
                  key={item.name}
                  type="button"
                  onMouseEnter={() => setActiveDropdown(item)}
                  onClick={() =>
                    setActiveDropdown((prev) => (prev?.name === item.name ? null : item))
                  }
                  className={`inline-flex shrink-0 items-center gap-1 rounded-full px-4 py-2.5 text-[15px] font-black transition ${
                    isActive
                      ? 'bg-slate-950 text-white'
                      : 'text-slate-800 hover:bg-slate-100 hover:text-slate-950'
                  }`}
                >
                  {item.name}
                  <ChevronIcon open={isActive} />
                </button>
              ) : (
                <Link
                  key={item.name}
                  to={item.slug}
                  onMouseEnter={() => setActiveDropdown(null)}
                  className="inline-flex shrink-0 rounded-full px-4 py-2.5 text-[15px] font-black text-slate-800 transition hover:bg-slate-100 hover:text-slate-950"
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <DropdownPanel
            open={!!activeDropdown}
            title={activeDropdown?.name || ''}
            description={
              activeDropdown
                ? `Browse ${activeDropdown.name} coverage through focused sections and editorial categories.`
                : ''
            }
            items={activeDropdown?.children || []}
            onNavigate={() => setActiveDropdown(null)}
            onClose={() => setActiveDropdown(null)}
          />
        </div>

        {mobileOpen && (
          <div className="fixed inset-0 z-[70] bg-slate-950/45 lg:hidden">
            <div className="absolute inset-0" onClick={() => setMobileOpen(false)} />

            <div className="absolute left-0 top-0 h-dvh w-[min(92vw,400px)] overflow-hidden border-r border-slate-200 bg-white shadow-2xl">
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-5">
                  <Link to="/" onClick={closeAllMenus} className="min-w-0">
                    <div className="w-[210px]">
                      <img
                        src={logo1}
                        alt="Financia Digital News"
                        className="h-auto max-h-16 w-full object-contain object-left"
                      />
                    </div>
                  </Link>

                  <button
                    type="button"
                    aria-label="Close menu"
                    className="inline-flex shrink-0 rounded-full border border-slate-200 p-3 text-slate-900 transition hover:bg-slate-50"
                    onClick={() => setMobileOpen(false)}
                  >
                    <CloseIcon />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">
                  <div className="mb-5">
                    <SearchBox />
                  </div>

                  <div className="mb-5 flex items-center gap-3">
                    <SocialLinks />
                  </div>

                  <div className="grid gap-3 pb-8">
                    {mobileNavItems.map((item) => (
                      <MobileAccordionItem
                        key={item.name}
                        item={item}
                        isOpen={!!mobileExpanded[item.name]}
                        onToggle={() => toggleMobileAccordion(item.name)}
                        onNavigate={closeAllMenus}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}