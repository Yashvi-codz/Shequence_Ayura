'use client';

import Link from 'next/link';
import { PantryStillLifeArt } from './wellnessArt';

export default function PantryHighlightCard({
  pantryCount,
  previewItems = [],
}) {
  const hasPantry = pantryCount > 0;

  const headline = hasPantry
    ? 'Generate your Ayurvedic pantry'
    : 'Your pantry is powering Ayura';

  const sub = hasPantry
    ? 'Add what you have at home and discover recipes aligned with your kitchen — your main hub for daily nourishment.'
    : 'Add ingredients you cook with — Ayura will rank meals and explain matches.';

  const cta = hasPantry ? 'View pantry' : 'Generate pantry';

  const secondary = hasPantry ? 'Recipe matches' : null;

  const status = hasPantry
    ? `${pantryCount} ingredient${
        pantryCount === 1 ? '' : 's'
      } · ready for planning`
    : 'Best next step · unlock recipes';

  return (
    <section className="mb-3 group relative overflow-hidden rounded-[1.5rem] shadow-[0_18px_40px_-20px_rgba(180,90,30,0.35)] ring-1 ring-amber-200/45">

      {/* Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#fff6eb] via-[#ffedd5] to-[#fed7aa]/90" />
      <div className="absolute -right-16 -top-20 h-60 w-60 rounded-full bg-orange-300/20 blur-3xl" />
      <div className="absolute -bottom-12 left-8 h-44 w-44 rounded-full bg-amber-200/25 blur-2xl" />

      {/* Main Content */}
      <div className="relative grid gap-5 p-4 sm:p-5 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-6 lg:p-6">

        {/* LEFT SIDE */}
        <div className="relative z-[1] min-w-0 space-y-4">

          {/* Status */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-amber-950 ring-1 ring-amber-200/60 shadow-sm backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.7)]" />
            {status}
          </div>

          {/* Headline */}
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-amber-950 sm:text-2xl lg:text-[1.5rem]">
              {headline}
            </h2>

            <p className="mt-2 max-w-lg text-sm leading-relaxed text-amber-950/85">
              {sub}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-2 ">

            <Link
              href="/app/pantry"
              className="inline-flex min-h-[44px] min-w-[140px] items-center justify-center rounded-xl bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_6px_20px_-6px_rgba(234,88,12,0.55)] ring-1 ring-orange-400/30 transition hover:shadow-[0_10px_28px_-6px_rgba(234,88,12,0.5)]"
            >
              {cta}
            </Link>

            

          </div>

          {/* Footer Note */}
          <p className="text-xs font-medium text-amber-900/55">
            Stored on this device
          </p>

        </div>

        {/* RIGHT SIDE */}
        <div className="relative z-[1] flex flex-col gap-3 lg:min-h-[170px]">

          {/* Illustration */}
          <div className="relative flex flex-1 items-center justify-center rounded-xl border border-white/60 bg-white/40 p-3 shadow-inner shadow-amber-100/80 backdrop-blur-md">

            <PantryStillLifeArt
              className="relative z-[1] h-auto w-full max-w-[150px] opacity-90 transition duration-500 group-hover:opacity-100 sm:max-w-[170px]"
            />

          </div>

          {/* Store Room */}
          <div className="rounded-xl border border-amber-200/40 bg-white/50 p-3 shadow-sm backdrop-blur-sm">

            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-900/45">
              Store room
            </p>

            {hasPantry ? (
              <>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {previewItems.slice(0, 8).map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-amber-100/80 bg-white/90 px-2 py-1 text-[11px] font-medium capitalize text-amber-950 shadow-sm"
                    >
                      {item}
                    </li>
                  ))}
                </ul>

                {pantryCount > 8 && (
                  <p className="mt-2 text-xs text-amber-900/50">
                    +{pantryCount - 8} more ingredients
                  </p>
                )}
              </>
            ) : (
              <div className="mt-2 rounded-lg border border-dashed border-amber-300/70 bg-gradient-to-br from-amber-50/80 to-orange-50/40 px-3 py-4 text-center">

                <p className="text-sm font-medium text-amber-950/90">
                  Your shelf is waiting
                </p>

                <p className="mt-1 text-xs leading-relaxed text-amber-900/65">
                  Ghee, lentils, rice, whole spices — start small.
                </p>

              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
