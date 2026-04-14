'use client';

import Link from 'next/link';
import { DoshaIllustration } from './wellnessArt';

const DOSHA_SURFACE = {
  vata: {
    gradient: 'from-[#f8e8ec] via-[#faf4f2] to-[#fff9f5]',
    gradient2: 'from-rose-200/25 via-transparent to-violet-200/15',
    accent: 'text-rose-950/90',
    accentSoft: 'text-rose-900/75',
    ring: 'ring-rose-200/40',
    badge: 'bg-rose-100/90 text-rose-950 ring-rose-200/50',
    chipActive: 'ring-rose-300/70 bg-white/90',
    blob: 'bg-rose-200/12',
  },
  pitta: {
    gradient: 'from-[#fff4d6] via-[#fffaf0] to-[#fff5eb]',
    gradient2: 'from-amber-200/30 via-transparent to-orange-200/20',
    accent: 'text-amber-950/90',
    accentSoft: 'text-amber-900/80',
    ring: 'ring-amber-200/45',
    badge: 'bg-amber-100/90 text-amber-950 ring-amber-200/55',
    chipActive: 'ring-amber-400/60 bg-white/90',
    blob: 'bg-amber-200/14',
  },
  kapha: {
    gradient: 'from-[#e4f2ea] via-[#f4faf6] to-[#eef6f9]',
    gradient2: 'from-emerald-200/25 via-transparent to-sky-200/15',
    accent: 'text-emerald-950/90',
    accentSoft: 'text-emerald-900/80',
    ring: 'ring-emerald-200/40',
    badge: 'bg-emerald-100/90 text-emerald-950 ring-emerald-200/50',
    chipActive: 'ring-emerald-400/55 bg-white/90',
    blob: 'bg-emerald-200/12',
  },
};

export default function DoshaHeroCard({ userName, doshaResult, doshaMeta }) {
  const key = doshaResult?.dominant || 'vata';
  const surface = DOSHA_SURFACE[key] || DOSHA_SURFACE.vata;
  const pct =
    doshaResult?.percentages && doshaResult.dominant
      ? doshaResult.percentages[doshaResult.dominant]
      : null;

  return (
    <section
      className={`group relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br ${surface.gradient} p-6 shadow-[0_20px_50px_-24px_rgba(80,60,50,0.35),0_2px_8px_-4px_rgba(60,40,30,0.12)] ring-1 ${surface.ring} sm:p-8 lg:p-10`}
    >
      {/* Layered atmosphere */}
      <div
        className={`pointer-events-none absolute -right-1/4 -top-1/4 h-[70%] w-[70%] rounded-full bg-gradient-to-br ${surface.gradient2} blur-3xl`}
      />
      <div className="pointer-events-none absolute -bottom-24 left-0 h-56 w-56 rounded-full bg-gradient-to-tr from-white/50 to-transparent blur-2xl" />
      <div
        className={`pointer-events-none absolute right-1/4 top-1/2 h-44 w-44 -translate-y-1/2 rounded-full blur-3xl ${surface.blob}`}
      />
      {/* Soft grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `linear-gradient(rgba(80,60,40,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(80,60,40,0.4) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative grid gap-8 lg:grid-cols-[1fr_minmax(260px,36%)] lg:gap-10 lg:items-stretch">
        {/* Main story */}
        <div className="flex min-w-0 flex-col justify-center space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ring-1 ${surface.badge}`}
            >
              Prakriti
            </span>
            {pct != null ? (
              <span className="rounded-full bg-white/75 px-3 py-1 text-xs font-medium text-stone-600 ring-1 ring-stone-200/60 backdrop-blur-sm">
                {pct}% of your pattern
              </span>
            ) : null}
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium tracking-wide text-stone-500">
              {userName ? (
                <>
                  <span className="text-stone-400">Welcome back,</span>{' '}
                  <span className="text-stone-800">{userName}</span>
                </>
              ) : (
                'Your constitution'
              )}
            </p>
            <div className="flex flex-wrap items-baseline gap-3">
              <h2 className={`text-4xl font-semibold tracking-tight sm:text-5xl ${surface.accent}`}>
                {doshaMeta.name}
              </h2>
              <span className="text-4xl sm:text-5xl" aria-hidden="true">
                {doshaMeta.emoji}
              </span>
            </div>
            <p className={`text-lg font-medium sm:text-xl ${surface.accentSoft}`}>{doshaMeta.tagline}</p>
          </div>

          <p className="max-w-xl border-l-2 border-stone-300/40 pl-4 text-sm leading-relaxed text-stone-600 sm:text-[15px]">
            {doshaMeta.description}
          </p>

          {doshaResult?.percentages ? (
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">Dosha balance</p>
              <div className="flex flex-wrap gap-2">
                {['vata', 'pitta', 'kapha'].map((d) => {
                  const dominant = d === doshaResult.dominant;
                  return (
                    <div
                      key={d}
                      className={`rounded-2xl px-3.5 py-2 text-xs font-medium ring-1 ring-stone-200/50 backdrop-blur-sm transition ${
                        dominant
                          ? `${surface.chipActive} shadow-sm`
                          : 'bg-white/50 text-stone-600 hover:bg-white/70'
                      }`}
                    >
                      <span className="capitalize text-stone-500">{d}</span>{' '}
                      <span className="font-semibold text-stone-900">{doshaResult.percentages[d]}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>

        {/* Visual + actions column */}
        <div className="relative flex min-h-[240px] flex-col justify-between gap-6 rounded-2xl border border-white/50 bg-white/25 p-5 shadow-inner shadow-white/40 backdrop-blur-md sm:min-h-[280px] lg:border-stone-200/30 lg:bg-white/20">
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/30 to-transparent" />
          <div className="relative flex flex-1 items-center justify-center py-2">
            <div className="relative w-full max-w-[280px] opacity-95 transition duration-500 group-hover:opacity-100">
              <DoshaIllustration doshaKey={key} className="h-auto w-full drop-shadow-[0_8px_24px_rgba(60,40,30,0.08)]" />
            </div>
          </div>

          <div className="relative space-y-3 border-t border-stone-200/40 pt-4">
            <Link
              href="/app/quiz"
              className="flex w-full items-center justify-center rounded-2xl bg-stone-900 px-5 py-3.5 text-center text-sm font-semibold text-[#faf6f0] shadow-lg shadow-stone-900/15 ring-1 ring-stone-800/20 transition hover:bg-stone-800 hover:shadow-xl"
            >
              Retake prakriti test
            </Link>
            <p className="text-center text-[11px] leading-relaxed text-stone-500 sm:text-left">
              Refresh when seasons, stress, or digestion shift — your profile stays yours.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
