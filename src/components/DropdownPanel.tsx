import { Link } from 'react-router-dom';
import { ArrowRightIcon, CloseIcon } from './Icons';

export function DropdownPanel({
  open,
  title,
  description,
  items,
  onNavigate,
  onClose,
}: {
  open: boolean;
  title: string;
  description: string;
  items: { name: string; slug: string }[];
  onNavigate?: () => void;
  onClose?: () => void;
}) {
  return (
    <div
      className={`fixed inset-0 top-[150px] z-40 bg-white/80 backdrop-blur-sm transition-all duration-300 ${
        open
          ? 'pointer-events-auto visible opacity-100'
          : 'pointer-events-none invisible opacity-0'
      }`}
    >
      <div className="mx-auto h-[calc(100vh-150px)] w-full max-w-7xl px-4 pb-6 xl:px-8">
        <div className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.14)]">
          <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-400">
                Explore Section
              </p>

              <h3 className="mt-1 text-3xl font-black text-slate-950">
                {title}
              </h3>

              {description && (
                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                  {description}
                </p>
              )}
            </div>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-950"
                aria-label="Close dropdown"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item, index) => (
                <Link
                  key={item.slug}
                  to={item.slug}
                  onClick={onNavigate}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_16px_42px_rgba(15,23,42,0.08)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-sm font-black text-slate-700">
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      <h4 className="mt-6 text-xl font-black text-slate-950">
                        {item.name}
                      </h4>

                      <p className="mt-3 text-sm leading-7 text-slate-500">
                        Open dedicated coverage, analysis, reports and latest updates.
                      </p>
                    </div>

                    <span className="mt-1 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition group-hover:border-slate-950 group-hover:bg-slate-950 group-hover:text-white">
                      <ArrowRightIcon className="h-5 w-5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}