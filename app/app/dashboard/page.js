'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { doshaInfo } from '@/lib/doshaCalculator';
import { getSeasonFromDate, RITUS } from '@/lib/ayurveda/ritus';
import SectionHeader from '@/components/dashboard/SectionHeader';
import DoshaHeroCard from '@/components/dashboard/DoshaHeroCard';
import PantryHighlightCard from '@/components/dashboard/PantryHighlightCard';
import FeatureExploreCard from '@/components/dashboard/FeatureExploreCard';
import { IconLeaf, IconBowl, IconSeason, IconHabits } from '@/components/layout/icons';

function readPantryItems() {
  try {
    const raw = localStorage.getItem('pantryItems');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((s) => String(s).toLowerCase().trim()).filter(Boolean);
  } catch {
    return [];
  }
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [doshaResult, setDoshaResult] = useState(null);
  const [pantryItems, setPantryItems] = useState([]);
  const [seasonKey, setSeasonKey] = useState('winter');

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const doshaData = JSON.parse(localStorage.getItem('doshaResult') || '{}');

    if (!userData.quizCompleted) {
      router.push('/app/quiz');
      return;
    }
    if (!userData.profileCompleted) {
      router.push('/app/profile/create');
      return;
    }

    setUser(userData);
    setDoshaResult(doshaData);
    setPantryItems(readPantryItems());
    setSeasonKey(getSeasonFromDate(new Date()));
  }, [router]);

  useEffect(() => {
    const onPantry = () => setPantryItems(readPantryItems());
    window.addEventListener('ayura-pantry-updated', onPantry);
    window.addEventListener('storage', onPantry);
    return () => {
      window.removeEventListener('ayura-pantry-updated', onPantry);
      window.removeEventListener('storage', onPantry);
    };
  }, []);

  const seasonLabel = useMemo(() => {
    const r = RITUS[seasonKey];
    return r ? r.label.split('—')[0].trim() : 'This season';
  }, [seasonKey]);

  if (!user || !doshaResult) {
    return (
      <div className="relative flex min-h-[50vh] items-center justify-center overflow-hidden px-4">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(180,160,130,0.12),transparent)]" />
        <div className="relative text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/60 shadow-inner ring-1 ring-stone-200/50">
            <div className="h-6 w-6 animate-pulse rounded-full bg-gradient-to-br from-emerald-200 to-amber-200" />
          </div>
          <p className="text-sm font-medium text-stone-600">Preparing your dashboard…</p>
        </div>
      </div>
    );
  }

  const meta = doshaInfo[doshaResult.dominant];
  const pantryCount = pantryItems.length;

  return (
    <div className="relative min-h-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_10%_-10%,rgba(167,200,160,0.14),transparent),radial-gradient(ellipse_70%_50%_at_90%_20%,rgba(255,210,170,0.12),transparent),radial-gradient(ellipse_50%_40%_at_50%_100%,rgba(200,220,235,0.1),transparent)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.5\'/%3E%3C/svg%3E")',
        }}
      />

      <div className="relative z-[1] px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        <div className="mx-auto max-w-6xl space-y-10 lg:space-y-14">
        <SectionHeader
          eyebrow="Command center"
          title="Your day, aligned to prakriti"
          description="Ayura connects your dosha, pantry, and season so every suggestion feels intentional — not generic."
        />

        <DoshaHeroCard userName={user.name} doshaResult={doshaResult} doshaMeta={meta} />

        <PantryHighlightCard pantryCount={pantryCount} previewItems={pantryItems} />

        <div className="space-y-6">
          <SectionHeader
            eyebrow="Explore"
            title="Where would you like to go next?"
            description="Each area is tuned to your constitution and the intelligence Ayura already uses behind the scenes."
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-7">
            <FeatureExploreCard
              variant="lifestyle"
              href="/app/lifestyle"
              icon={<IconLeaf />}
              title="Lifestyle & Mind"
              description="Yoga flows, movement, and breath practices that balance your dominant dosha — calm, structured, and kind to your nervous system."
              ctaLabel="Open lifestyle hub"
              badge="Based on your dosha"
            />
            <FeatureExploreCard
              variant="food"
              href="/app/food"
              icon={<IconBowl />}
              title="Food & Digestion"
              description="Weekly meal planning with explainable dosha fit, pantry match scores, and digestion-friendly swaps."
              ctaLabel="Plan & nourish"
              badge={pantryCount > 0 ? 'Pantry linked' : 'Start with pantry'}
              footnote={pantryCount > 0 ? 'Live planner available' : null}
            />
            <FeatureExploreCard
              variant="seasons"
              href="/app/seasons"
              icon={<IconSeason />}
              title="Seasons"
              description="Ritu-aware guidance: what to favor, gentle cautions, and seasonal foods that support balance right now."
              ctaLabel="View seasonal guide"
              badge={seasonLabel}
            />
            <FeatureExploreCard
              variant="habits"
              disabled
              icon={<IconHabits />}
              title="Habits"
              description="Gentle routine tracking and ritual reminders woven into your prakriti — we are crafting this with care."
              ctaLabel="Coming soon"
              badge="In design"
              footnote="Placeholder · not broken"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200/40 bg-white/35 px-4 py-5 text-center shadow-sm backdrop-blur-sm sm:px-6">
          <p className="text-xs leading-relaxed text-stone-600">
            Food safety & combinations live in{' '}
            <button
              type="button"
              onClick={() => router.push('/app/food-checker')}
              className="font-semibold text-emerald-900 underline decoration-emerald-300/90 underline-offset-2 transition hover:text-emerald-950"
            >
              Food Combinations
            </button>
            . Daily reflections live in{' '}
            <button
              type="button"
              onClick={() => router.push('/app/logs')}
              className="font-semibold text-emerald-900 underline decoration-emerald-300/90 underline-offset-2 transition hover:text-emerald-950"
            >
              Daily Logs
            </button>
            .
          </p>
        </div>
        </div>
      </div>
    </div>
  );
}
