'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { doshaInfo } from '@/lib/doshaCalculator';

export default function LifestylePage() {
  const router = useRouter();
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

  const info = dominant && doshaInfo[dominant] ? doshaInfo[dominant] : null;

  return (
    <div className="min-h-full px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700/80">Lifestyle & Mind</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
            Move and breathe with your prakriti
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
            This hub will grow into dosha-specific yoga sequences, steady exercise prompts, and meditation cues. For now,
            explore foundational education while we shape the experience.
          </p>
        </div>

        {info ? (
          <div className="rounded-[1.25rem] bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm ring-1 ring-emerald-200/50">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800/70">Aligned to you</p>
            <h2 className="mt-2 flex items-center gap-2 text-xl font-semibold text-emerald-950">
              <span className="text-2xl">{info.emoji}</span> {info.name} · {info.tagline}
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-emerald-950/85">
              {(info.recommendations || []).slice(0, 4).map((line, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-emerald-600">·</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/app/learn"
            className="rounded-[1.25rem] bg-white p-5 shadow-sm ring-1 ring-stone-200/70 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <h3 className="font-semibold text-stone-900">Ayurveda basics</h3>
            <p className="mt-2 text-sm text-stone-600">Doshas, digestion, and daily rhythms in plain language.</p>
            <span className="mt-4 inline-block text-sm font-semibold text-emerald-800">Open Learn →</span>
          </Link>
          <Link
            href="/app/dashboard"
            className="rounded-[1.25rem] bg-white p-5 shadow-sm ring-1 ring-stone-200/70 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <h3 className="font-semibold text-stone-900">Back to dashboard</h3>
            <p className="mt-2 text-sm text-stone-600">Return to your personalized command center.</p>
            <span className="mt-4 inline-block text-sm font-semibold text-emerald-800">Home →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
