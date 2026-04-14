'use client';

import { useEffect, useMemo, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RITUS, getSeasonFromDate } from '@/lib/ayurveda/ritus';
import { doshaInfo } from '@/lib/doshaCalculator';

export default function SeasonsPage() {
  const router = useRouter();
  const [season, setSeason] = useState(getSeasonFromDate(new Date()));
  const [dominant, setDominant] = useState(null);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }
    try {
      const d = JSON.parse(localStorage.getItem('doshaResult') || '{}');
      setDominant(d?.dominant || null);
    } catch {
      setDominant(null);
    }
  }, [router]);

  const ritu = RITUS[season];
  const dosha = dominant && doshaInfo[dominant] ? doshaInfo[dominant] : null;

  const doshaSeasonTip = useMemo(() => {
    if (!dosha) return null;
    if (season === 'summer' && dominant === 'pitta') return 'Summer can stir Pitta heat — favor cooling, sweet-bitter notes.';
    if (season === 'winter' && dominant === 'vata') return 'Winter asks Vata to stay warm, oily, and unctuous.';
    if (season === 'spring' && dominant === 'kapha') return 'Spring is Kapha-heavy in nature — keep meals light and lively.';
    return `Your ${dosha.name} prakriti still benefits from the ${ritu?.qualities?.join(', ') || 'seasonal'} focus below.`;
  }, [season, dominant, dosha, ritu]);

  return (
    <div className="min-h-full px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-800/70">Seasons · Ritu</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
            Live with the rhythm outside your window
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
            Ayurveda shifts food and lifestyle guidance by season. Ayura already uses this lens in your meal planner — here
            is the transparent view of what we are optimizing for.
          </p>
        </div>

        <div className="rounded-[1.25rem] bg-white p-5 shadow-sm ring-1 ring-sky-200/50">
          <label className="block text-xs font-semibold uppercase tracking-wider text-sky-900/60">Viewing season</label>
          <select
            className="input-field mt-2 max-w-md border-sky-200/80 bg-sky-50/40"
            value={season}
            onChange={(e) => setSeason(e.target.value)}
          >
            {Object.keys(RITUS).map((k) => (
              <option key={k} value={k}>
                {RITUS[k].label}
              </option>
            ))}
          </select>
        </div>

        {ritu ? (
          <div className="space-y-5 rounded-[1.25rem] bg-gradient-to-br from-sky-50 to-white p-6 shadow-sm ring-1 ring-sky-200/45">
            <h2 className="text-xl font-semibold text-sky-950">{ritu.label}</h2>
            <p className="text-sm font-medium text-sky-900/75">Qualities we emphasize: {ritu.qualities.join(' · ')}</p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/80 p-4 ring-1 ring-sky-100">
                <p className="text-xs font-semibold uppercase tracking-wide text-sky-800/60">Favor</p>
                <ul className="mt-2 space-y-1 text-sm text-sky-950">
                  {ritu.suggestedFoods.map((f) => (
                    <li key={f}>· {f}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-white/80 p-4 ring-1 ring-sky-100">
                <p className="text-xs font-semibold uppercase tracking-wide text-sky-800/60">Spices & herbs</p>
                <ul className="mt-2 space-y-1 text-sm text-sky-950">
                  {ritu.suggestedSpices.map((s) => (
                    <li key={s}>· {s}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-2xl bg-amber-50/80 p-4 ring-1 ring-amber-200/60">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-900/70">Gentle cautions</p>
              <ul className="mt-2 space-y-1 text-sm text-amber-950">
                {ritu.avoid.map((a) => (
                  <li key={a}>· {a}</li>
                ))}
              </ul>
            </div>

            {doshaSeasonTip ? (
              <p className="text-sm leading-relaxed text-sky-950/85">
                <span className="font-semibold text-sky-900">With your dosha in mind: </span>
                {doshaSeasonTip}
              </p>
            ) : null}
          </div>
        ) : null}

        <Link
          href="/app/meals"
          className="block rounded-[1.25rem] bg-sky-900 px-5 py-4 text-center text-sm font-semibold text-white shadow-md transition hover:bg-sky-800"
        >
          Apply this season in your meal planner →
        </Link>
      </div>
    </div>
  );
}
