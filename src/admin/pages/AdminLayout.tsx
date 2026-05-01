import { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import logo from '../../assets/logo.png';

type NavItem = {
  path: string;
  label: string;
  icon: string;
  desc: string;
};

const NAV_HOME: NavItem[] = [
  {
    path: '/admin/hero',
    label: 'Hero Section',
    icon: '🎬',
    desc: 'Top banner video/image',
  },
  {
    path: '/admin/banners',
    label: 'Ad Banners',
    icon: '📢',
    desc: 'Homepage promotion banners',
  },
];

const NAV_CONTENT: NavItem[] = [
  {
    path: '/admin/all-pages',
    label: 'All Pages Handling',
    icon: '🗂️',
    desc: 'World & more sections unified',
  },
];

const NAV_OTHER: NavItem[] = [
  {
    path: '/admin/membership',
    label: 'Membership',
    icon: '💳',
    desc: 'Plans & submissions',
  },
  {
    path: '/admin/page-banner',
    label: 'Banner — All Pages',
    icon: '🖼️',
    desc: 'Right sidebar on every page',
  },
  {
    path: '/admin/contact-requests',
    label: 'Contact Requests',
    icon: '📩',
    desc: 'Contact and header queries',
  },
  {
  path: '/admin/magazines',
  label: 'Magazines',
  icon: '📚',
  desc: 'Digital magazine issues',
},
];

function NavLink({
  item,
  active,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      to={item.path}
      onClick={onClick}
      className={[
        'group relative flex items-center gap-3 overflow-hidden rounded-2xl px-3 py-3 transition-all duration-200',
        active
          ? 'bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-lg shadow-red-900/25'
          : 'text-slate-300 hover:bg-white/[0.07] hover:text-white',
      ].join(' ')}
    >
      {active && (
        <span className="absolute inset-y-3 left-0 w-1 rounded-r-full bg-white" />
      )}

      <span
        className={[
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-base transition-all',
          active
            ? 'bg-white/20 text-white'
            : 'bg-white/[0.06] text-slate-200 group-hover:bg-white/10',
        ].join(' ')}
      >
        {item.icon}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold leading-5">
          {item.label}
        </span>
        <span
          className={[
            'mt-0.5 block truncate text-xs',
            active ? 'text-red-50/90' : 'text-slate-500 group-hover:text-slate-400',
          ].join(' ')}
        >
          {item.desc}
        </span>
      </span>
    </Link>
  );
}

function NavSection({
  title,
  items,
  isActive,
  onClose,
}: {
  title: string;
  items: NavItem[];
  isActive: (path: string) => boolean;
  onClose?: () => void;
}) {
  return (
    <section>
      <p className="mb-2 px-3 text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
        {title}
      </p>

      <div className="space-y-1.5">
        {items.map((item) => (
          <NavLink
            key={item.path}
            item={item}
            active={isActive(item.path)}
            onClick={onClose}
          />
        ))}
      </div>
    </section>
  );
}

function Sidebar({ onClose }: { onClose?: () => void }) {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="flex h-full flex-col overflow-hidden border-r border-white/10 bg-[#07111f] text-white">
      {/* Brand Area */}
      <div className="relative overflow-hidden border-b border-white/10 px-4 py-5">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-red-500/20 blur-3xl" />
        <div className="absolute -left-16 top-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative rounded-3xl border border-white/10 bg-white/[0.06] p-4 shadow-2xl shadow-black/20 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white p-2 shadow-lg">
              <img
                src={logo}
                alt="Financial Digital News"
                className="h-full w-full object-contain"
              />
            </div>

            <div className="min-w-0">
              <p className="truncate text-base font-black tracking-tight text-white">
                Admin Panel
              </p>
              <p className="mt-1 line-clamp-2 text-xs font-medium leading-4 text-slate-300">
                Financial Digital News control center
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-black/15 px-3 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Newsroom Dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-5 overflow-y-auto px-4 py-5 [scrollbar-width:thin] [scrollbar-color:#475569_transparent]">
        <NavSection
          title="Homepage"
          items={NAV_HOME}
          isActive={isActive}
          onClose={onClose}
        />

        <div className="border-t border-white/10" />

        <NavSection
          title="Content"
          items={NAV_CONTENT}
          isActive={isActive}
          onClose={onClose}
        />

        <div className="border-t border-white/10" />

        <NavSection
          title="Management"
          items={NAV_OTHER}
          isActive={isActive}
          onClose={onClose}
        />
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 bg-[#081426] p-4">
        <div className="mb-3 rounded-3xl border border-white/10 bg-white/[0.06] p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
            Signed in as
          </p>
          <p className="mt-1 truncate text-sm font-bold text-white">
            {admin?.email || 'admin@example.com'}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-bold text-slate-200 transition-all hover:border-red-400/50 hover:bg-red-600 hover:text-white hover:shadow-lg hover:shadow-red-900/25"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

export function AdminLayout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const allNav = [...NAV_HOME, ...NAV_CONTENT, ...NAV_OTHER];
  const active = allNav.find((item) => item.path === location.pathname);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f3f5f9]">
      {/* Desktop Sidebar */}
      <aside className="hidden w-[315px] shrink-0 xl:block">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <button
            aria-label="Close sidebar overlay"
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          <aside className="absolute left-0 top-0 h-full w-[315px] max-w-[88vw] shadow-2xl">
            <Sidebar onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="border-b border-slate-200/80 bg-white/90 px-4 py-4 shadow-sm backdrop-blur lg:px-7">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-700 shadow-sm transition hover:bg-slate-100 xl:hidden"
                aria-label="Open sidebar"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-red-600">
                  Admin Dashboard
                </p>
                <h1 className="mt-0.5 truncate text-xl font-black tracking-tight text-slate-900">
                  {active?.label || 'Dashboard'}
                </h1>
                {active?.desc && (
                  <p className="hidden truncate text-sm font-medium text-slate-500 sm:block">
                    {active.desc}
                  </p>
                )}
              </div>
            </div>

            <div className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm md:flex">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-slate-600">
                Online
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-7">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}