import { Link } from 'react-router-dom';
import { footerLinks } from '../data/siteData';
import { SocialLinks } from './SocialLinks';
import footerLogo from '../assets/logo.png';

export function Footer() {
  return (
    <footer className="mt-20 overflow-hidden bg-slate-950 text-white">
      <div className="relative">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.1fr,1.7fr]">
            <div>
              <Link
                to="/"
                className="inline-flex rounded-3xl bg-white px-5 py-4 shadow-[0_20px_60px_rgba(255,255,255,0.08)]"
              >
                <img
                  src={footerLogo}
                  alt="Financia Digital News"
                  className="h-24 w-auto object-contain"
                />
              </Link>

              <p className="mt-6 max-w-md text-base leading-8 text-slate-300">
                Financia Digital News delivers global insights on diplomacy,
                economics, geopolitics and strategic affairs for modern readers.
              </p>

              <div className="mt-7">
                <SocialLinks />
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 shadow-5xl backdrop-blur-sm sm:p-8">
              <div className="grid gap-8 sm:grid-cols-3">
                {Object.entries(footerLinks).map(([title, items]) => (
                  <div key={title}>
                    <h4 className="text-sm font-black uppercase tracking-[0.22em] text-white">
                      {title}
                    </h4>

                    <div className="mt-5 grid gap-3">
                      {items.map((item) => (
                        <Link
                          key={item.label}
                          to={item.to}
                          className="text-sm font-medium text-slate-300 transition hover:translate-x-1 hover:text-white"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="relative border-t border-white/10 px-4 py-5 text-center text-sm text-slate-400">
          © 2026 Financia Digital News. All rights reserved.
        </div>
      </div>
    </footer>
  );
}