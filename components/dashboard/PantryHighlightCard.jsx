'use client';

import Link from 'next/link';
import { PantryStillLifeArt } from './wellnessArt';

export default function PantryHighlightCard({ pantryCount, previewItems = [] }) {
  const hasPantry = pantryCount > 0;
  const headline = hasPantry ? 'Your pantry is powering Ayura' : 'Generate your Ayurvedic pantry';
  const sub = hasPantry
    ? 'Recipes, meal plans, and dosha-aware rankings all read from what you keep on hand. Update anytime.'
    : 'Add the ingredients you actually cook with — Ayura will rank meals, explain matches, and keep combinations safe.';
  const cta = hasPantry ? 'View pantry' : 'Generate pantry';
  const secondary = hasPantry ? 'Recipe matches' : null;
  const status = hasPantry
    ? `${pantryCount} ingredient${pantryCount === 1 ? '' : 's'} · ready for planning`
    : 'Best next step · unlock recipes & weekly planning';

  return (
    <section className="group relative overflow-hidden rounded-[1.5rem] shadow-[0_24px_56px_-28px_rgba(180,90,30,0.35),0_4px_14px_-6px_rgba(120,60,20,0.12)] ring-1 ring-amber-200/45">
      {/* Warm layered base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#fff6eb] via-[#ffedd5] to-[#fed7aa]/90" />
      <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-orange-300/25 blur-3xl" />
      <div className="absolute -bottom-16 left-10 h-56 w-56 rounded-full bg-amber-200/30 blur-2xl" />
      <div className="absolute right-1/3 top-0 h-40 w-64 -rotate-6 bg-gradient-to-r from-transparent via-white/25 to-transparent blur-xl" />

      <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-10 lg:p-10">
        <div className="relative z-[1] min-w-0 space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/85 px-3.5 py-1.5 text-xs font-semibold text-amber-950 ring-1 ring-amber-200/60 shadow-sm backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.7)]" />
            {status}
          </div>

          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-amber-950 sm:text-3xl lg:text-[1.85rem]">{headline}</h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-amber-950/85 sm:text-[15px]">{sub}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/app/pantry"
              className="relative inline-flex min-h-[48px] min-w-[160px] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 bg-[length:200%_100%] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_8px_28px_-6px_rgba(234,88,12,0.55)] ring-1 ring-orange-400/30 transition duration-300 hover:bg-[position:100%_0] hover:shadow-[0_12px_36px_-8px_rgba(234,88,12,0.5)]"
            >
              <span className="relative z-10">{cta}</span>
              <span className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition group-hover:opacity-100" />
            </Link>
            {secondary ? (
              <Link
                href="/app/recipes"
                className="inline-flex items-center justify-center rounded-2xl border border-amber-900/15 bg-white/80 px-5 py-3.5 text-sm font-semibold text-amber-950 shadow-sm backdrop-blur-sm transition hover:border-amber-800/25 hover:bg-white"
              >
                {secondary}
              </Link>
            ) : null}
          </div>

          <p className="text-xs font-medium text-amber-900/55">
            Continue where you left off · stored on this device
          </p>
        </div>

        <div className="relative z-[1] flex flex-col gap-4 lg:min-h-[220px]">
          <div className="relative flex flex-1 items-center justify-center rounded-2xl border border-white/60 bg-white/40 p-4 shadow-inner shadow-amber-100/80 backdrop-blur-md">
            <div className="absolute -right-2 -top-2 h-24 w-24 rounded-full bg-orange-200/20 blur-2xl" />
            <PantryStillLifeArt className="relative z-[1] h-auto w-full max-w-[200px] opacity-90 transition duration-500 group-hover:opacity-100 sm:max-w-[220px]" />
          </div>

          <div className="rounded-2xl border border-amber-200/40 bg-white/50 p-4 shadow-sm backdrop-blur-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-900/45">Store room</p>
            {hasPantry ? (
              <>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {previewItems.slice(0, 10).map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-amber-100/80 bg-white/90 px-2.5 py-1 text-[11px] font-medium capitalize text-amber-950 shadow-sm"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
                {pantryCount > 10 ? (
                  <p className="mt-3 text-xs text-amber-900/50">+{pantryCount - 10} more ingredients</p>
                ) : null}
              </>
            ) : (
              <div className="mt-3 rounded-xl border border-dashed border-amber-300/70 bg-gradient-to-br from-amber-50/80 to-orange-50/40 px-4 py-6 text-center">
                <p className="text-sm font-medium text-amber-950/90">Your shelf is waiting</p>
                <p className="mt-1.5 text-xs leading-relaxed text-amber-900/65">
                  Ghee, lentils, rice, whole spices, and what grows near you — start small.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
