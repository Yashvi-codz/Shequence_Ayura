'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function FoodHubPage() {
  const router = useRouter();
  const [pantryCount, setPantryCount] = useState(0);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }
    try {
      const raw = localStorage.getItem('pantryItems');
      const parsed = raw ? JSON.parse(raw) : [];
      setPantryCount(Array.isArray(parsed) ? parsed.length : 0);
    } catch {
      setPantryCount(0);
    }
  }, [router]);

  return (
    <div className="min-h-full px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-800/70">Food & Digestion</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
            Nourishment that respects agni
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
            Your weekly planner ranks recipes using dosha fit, pantry overlap, season, and goals. Food combinations help
            you avoid classic viruddha pairings before you cook.
          </p>
        </div>

        <div className="rounded-[1.25rem] bg-gradient-to-br from-orange-50 to-amber-50/80 p-5 shadow-sm ring-1 ring-orange-200/50">
          <p className="text-sm font-medium text-orange-950">
            Pantry status:{' '}
            <span className="font-semibold">
              {pantryCount > 0 ? `${pantryCount} ingredients on file` : 'Add ingredients to unlock full ranking'}
            </span>
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/app/meals"
            className="rounded-[1.25rem] bg-white p-5 shadow-sm ring-1 ring-orange-200/40 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <h3 className="font-semibold text-stone-900">Weekly meal planner</h3>
            <p className="mt-2 text-sm text-stone-600">Mon–Sun layout with dosha-aware picks and explainable scores.</p>
            <span className="mt-4 inline-block text-sm font-semibold text-orange-900">Open planner →</span>
          </Link>
          <Link
            href="/app/recipes"
            className="rounded-[1.25rem] bg-white p-5 shadow-sm ring-1 ring-orange-200/40 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <h3 className="font-semibold text-stone-900">Recipe matches</h3>
            <p className="mt-2 text-sm text-stone-600">Pantry-powered suggestions with match percentages.</p>
            <span className="mt-4 inline-block text-sm font-semibold text-orange-900">Browse recipes →</span>
          </Link>
          <Link
            href="/app/pantry"
            className="rounded-[1.25rem] bg-white p-5 shadow-sm ring-1 ring-orange-200/40 transition hover:-translate-y-0.5 hover:shadow-md sm:col-span-2"
          >
            <h3 className="font-semibold text-stone-900">Pantry generator</h3>
            <p className="mt-2 text-sm text-stone-600">Update what you keep at home — the system adapts everywhere.</p>
            <span className="mt-4 inline-block text-sm font-semibold text-orange-900">Edit pantry →</span>
          </Link>
          <Link
            href="/app/food-checker"
            className="rounded-[1.25rem] bg-white p-5 shadow-sm ring-1 ring-orange-200/40 transition hover:-translate-y-0.5 hover:shadow-md sm:col-span-2"
          >
            <h3 className="font-semibold text-stone-900">Food compatibility</h3>
            <p className="mt-2 text-sm text-stone-600">Check pairings for safer, more comfortable digestion.</p>
            <span className="mt-4 inline-block text-sm font-semibold text-orange-900">Open checker →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
