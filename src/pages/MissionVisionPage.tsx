import {
  ArrowRight,
  Globe2,
  ShieldCheck,
  Sparkles,
  Telescope,
  Target,
  Newspaper,
} from 'lucide-react';

const pillars = [
  {
    Icon: ShieldCheck,
    title: 'Credible Coverage',
    body: 'Deliver clear, verified and research-led reporting across diplomacy, economics and regional affairs.',
  },
  {
    Icon: Globe2,
    title: 'Regional Intelligence',
    body: 'Build dedicated coverage paths for Asia, the Middle East, Eurasia, the Americas and emerging corridors.',
  },
  {
    Icon: Newspaper,
    title: 'Editorial Clarity',
    body: 'Present complex global issues through readable layouts, strong hierarchy and focused storytelling.',
  },
  {
    Icon: Telescope,
    title: 'Future Ready',
    body: 'Keep the platform flexible for digital publishing, video, membership and long-term newsroom growth.',
  },
];

const visionPoints = [
  'A trusted platform for geopolitical and economic insight.',
  'A modern digital newsroom with strong regional architecture.',
  'A publication experience built for readers, analysts and decision-makers.',
  'A scalable media brand ready for video, interviews and premium content.',
];

export function MissionVisionPage() {
  return (
    <div className="bg-slate-50">
      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-700 text-white">
        <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          <div>
            <p className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-primary">
              Mission & Vision
            </p>

            <h1 className="mt-7 max-w-4xl text-4xl font-black leading-tight tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              Building a sharper window into diplomacy, economics and global affairs.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Financia Digital News is designed to combine credible reporting,
              regional depth and modern digital storytelling for readers who need
              clarity in a complex world.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#mission"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-primary hover:text-white"
              >
                Explore Mission
                <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href="#vision"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-black text-white transition hover:bg-white/10"
              >
                View Vision
              </a>
            </div>
          </div>

          <div className="rounded-[2.2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-sm">
            <div className="grid gap-4">
              {pillars.map(({ Icon, title, body }) => (
                <article
                  key={title}
                  className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5 transition hover:bg-white/[0.1]"
                >
                  <div className="flex gap-4">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/15 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>

                    <div>
                      <h2 className="text-lg font-black text-white">{title}</h2>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        {body}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section id="mission" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-[2rem] bg-white p-8 shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Target className="h-7 w-7" />
            </div>

            <p className="mt-8 text-xs font-black uppercase tracking-[0.32em] text-primary">
              Our Mission
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight tracking-[-0.03em] text-slate-950">
              To make global developments easier to understand, verify and act upon.
            </h2>

            <p className="mt-5 text-base leading-8 text-slate-600">
              We focus on reporting that connects events with context: who is
              involved, why it matters and how it shapes regional and global
              decision-making.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {[
              'Policy-focused reporting',
              'Clear regional coverage',
              'Research-friendly article structure',
              'Strong editorial presentation',
            ].map((item, index) => (
              <div
                key={item}
                className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-black text-slate-600">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <h3 className="mt-6 text-2xl font-black text-slate-950">
                  {item}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Built to support serious readers with organized navigation,
                  strong summaries, visual clarity and dependable content flow.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VISION */}
      <section id="vision" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary via-blue-700 to-slate-950 text-white shadow-2xl">
          <div className="grid gap-8 p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.32em] text-white/70">
                Our Vision
              </p>

              <h2 className="mt-4 max-w-3xl text-4xl font-black leading-tight tracking-[-0.04em] sm:text-5xl">
                A flagship digital publication for insight, strategy and regional intelligence.
              </h2>

              <p className="mt-6 max-w-2xl text-base leading-8 text-white/80">
                The vision is to create a platform that feels premium, credible
                and useful — a place where readers can move from breaking updates
                to deep regional analysis without friction.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/15 bg-white/10 p-6 backdrop-blur-sm">
              <div className="space-y-4">
                {visionPoints.map((point) => (
                  <div
                    key={point}
                    className="flex items-start gap-3 rounded-2xl bg-white/10 p-4"
                  >
                    <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-white" />
                    <p className="text-sm font-semibold leading-6 text-white/90">
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}