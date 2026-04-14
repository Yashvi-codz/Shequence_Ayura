'use client';

import Link from 'next/link';
import {
  ExploreArtLifestyle,
  ExploreArtFood,
  ExploreArtSeasons,
  ExploreArtHabits,
} from './wellnessArt';

const VARIANTS = {
  lifestyle: {
    gradient: 'from-[#ecfdf3] via-emerald-50/90 to-[#e8f5ef]',
    iconBg: 'bg-emerald-100/95 text-emerald-900 shadow-sm ring-1 ring-emerald-200/60',
    ring: 'ring-emerald-200/45',
    hoverRing: 'hover:ring-emerald-300/70',
    cta: 'text-emerald-900',
    art: ExploreArtLifestyle,
    glow: 'bg-emerald-400/20',
  },
  food: {
    gradient: 'from-[#fff7ed] via-orange-50 to-[#ffedd5]',
    iconBg: 'bg-orange-100/95 text-orange-950 shadow-sm ring-1 ring-orange-200/60',
    ring: 'ring-orange-200/45',
    hoverRing: 'hover:ring-orange-300/70',
    cta: 'text-orange-950',
    art: ExploreArtFood,
    glow: 'bg-orange-400/20',
  },
  seasons: {
    gradient: 'from-[#f0f9ff] via-sky-50 to-[#e0f2fe]',
    iconBg: 'bg-sky-100/95 text-sky-950 shadow-sm ring-1 ring-sky-200/60',
    ring: 'ring-sky-200/45',
    hoverRing: 'hover:ring-sky-300/70',
    cta: 'text-sky-950',
    art: ExploreArtSeasons,
    glow: 'bg-sky-400/18',
  },
  habits: {
    gradient: 'from-[#f5f3ff] via-violet-50 to-[#ede9fe]',
    iconBg: 'bg-violet-100/90 text-violet-950 shadow-sm ring-1 ring-violet-200/50',
    ring: 'ring-violet-200/40',
    hoverRing: 'hover:ring-violet-300/55',
    cta: 'text-violet-900',
    art: ExploreArtHabits,
    glow: 'bg-violet-400/15',
  },
};

export default function FeatureExploreCard({
  variant,
  icon,
  title,
  description,
  href,
  ctaLabel,
  badge,
  disabled,
  footnote,
}) {
  const v = VARIANTS[variant] || VARIANTS.lifestyle;
  const Art = v.art;

  const body = (
    <>
      <div
        className={`pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full ${v.glow} blur-3xl transition duration-500 group-hover:scale-110`}
      />

      <div className="relative z-[1] flex min-h-[120px] flex-1 flex-col">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl transition duration-300 group-hover:scale-[1.04] ${v.iconBg}`}
          >
            {icon}
          </div>
          <div className="min-w-0 flex-1 pr-14 sm:pr-16">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold tracking-tight text-stone-900">{title}</h3>
              {badge ? (
                <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-stone-600 ring-1 ring-stone-200/80 shadow-sm">
                  {badge}
                </span>
              ) : null}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">{description}</p>
          </div>
        </div>

        <div className="pointer-events-none absolute right-1 top-1 opacity-90 sm:right-2 sm:top-2">
          <Art className="h-[5.25rem] w-[5.25rem] transition duration-500 group-hover:scale-105" />
        </div>
      </div>

      <div className="relative z-[1] mt-5 flex items-center justify-between gap-3 border-t border-stone-200/55 pt-4">
        {disabled ? (
          <span className={`text-sm font-semibold ${v.cta} opacity-75`}>{ctaLabel}</span>
        ) : (
          <span className={`text-sm font-semibold ${v.cta} transition group-hover:translate-x-0.5`}>
            {ctaLabel} →
          </span>
        )}
        {footnote ? <span className="max-w-[48%] text-right text-xs text-stone-500">{footnote}</span> : null}
      </div>
    </>
  );

  const cardClass = `group relative flex h-full min-h-[230px] flex-col overflow-hidden rounded-[1.35rem] bg-gradient-to-br ${v.gradient} p-5 shadow-[0_14px_44px_-26px_rgba(60,50,40,0.22)] ring-1 ${v.ring} ${v.hoverRing} transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_52px_-30px_rgba(60,50,40,0.26)] sm:p-6`;

  if (disabled || !href) {
    return <div className={`${cardClass} cursor-default`}>{body}</div>;
  }

  return <Link href={href} className={cardClass}>{body}</Link>;
}
