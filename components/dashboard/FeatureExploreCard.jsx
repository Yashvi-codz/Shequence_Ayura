"use client";

import {
  ExploreArtLifestyle,
  ExploreArtFood,
  ExploreArtSeasons,
  ExploreArtHabits,
} from "./wellnessArt";

const VARIANTS = {
  lifestyle: {
    gradient: "from-[#ecfdf3] via-emerald-50/90 to-[#e8f5ef]",
    iconBg:
      "bg-emerald-100/95 text-emerald-900 shadow-sm ring-1 ring-emerald-200/60",
    ring: "ring-emerald-200/45",
    hoverRing: "hover:ring-emerald-300/70",
    cta: "text-emerald-900",
    art: ExploreArtLifestyle,
    glow: "bg-emerald-400/20",
  },
  food: {
    gradient: "from-[#fff7ed] via-orange-50 to-[#ffedd5]",
    iconBg:
      "bg-orange-100/95 text-orange-950 shadow-sm ring-1 ring-orange-200/60",
    ring: "ring-orange-200/45",
    hoverRing: "hover:ring-orange-300/70",
    cta: "text-orange-950",
    art: ExploreArtFood,
    glow: "bg-orange-400/20",
  },
  seasons: {
    gradient: "from-[#f0f9ff] via-sky-50 to-[#e0f2fe]",
    iconBg: "bg-sky-100/95 text-sky-950 shadow-sm ring-1 ring-sky-200/60",
    ring: "ring-sky-200/45",
    hoverRing: "hover:ring-sky-300/70",
    cta: "text-sky-950",
    art: ExploreArtSeasons,
    glow: "bg-sky-400/18",
  },
  habits: {
    gradient: "from-[#f5f3ff] via-violet-50 to-[#ede9fe]",
    iconBg:
      "bg-violet-100/90 text-violet-950 shadow-sm ring-1 ring-violet-200/50",
    ring: "ring-violet-200/40",
    hoverRing: "hover:ring-violet-300/55",
    cta: "text-violet-900",
    art: ExploreArtHabits,
    glow: "bg-violet-400/15",
  },
};

import Link from "next/link";

export default function FeatureExploreCard({
  variant,
  icon,
  title,
  description,
  href,
  ctaLabel,
  badge,
  disabled,
}) {
  const v = VARIANTS[variant] || VARIANTS.lifestyle;

  const body = (
    <div className="flex flex-col h-full">
      {/* Top Row: Icon + Title */}
      <div className="flex items-start gap-3 mb-2">
        <div
          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${v.iconBg}`}
        >
          {icon}
        </div>

        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-stone-900">{title}</h3>
            {badge && (
              <span className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-stone-600 ring-1 ring-stone-200/80">
                {badge}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-stone-500 leading-relaxed flex-grow">
        {description}
      </p>

      {/* Button */}
      <div className="mt-3">
        {disabled ? (
          <span className={`text-sm font-semibold ${v.cta} opacity-70`}>
            {ctaLabel}
          </span>
        ) : (
          <span className={`text-sm font-semibold ${v.cta}`}>{ctaLabel} →</span>
        )}
      </div>
    </div>
  );

  const cardClass = `
    group flex flex-col h-full
    rounded-[1.3rem]
    bg-gradient-to-br ${v.gradient}
    p-5
    shadow-[0_14px_44px_-26px_rgba(60,50,40,0.22)]
    ring-1 ${v.ring}
    transition duration-300
    hover:-translate-y-1
  `;

  if (disabled || !href) {
    return <div className={cardClass}>{body}</div>;
  }

  return (
    <Link href={href} className={cardClass}>
      {body}
    </Link>
  );
}
