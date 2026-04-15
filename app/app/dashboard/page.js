"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { doshaInfo } from "@/lib/doshaCalculator";
import { getSeasonFromDate, RITUS } from "@/lib/ayurveda/ritus";
import SectionHeader from "@/components/dashboard/SectionHeader";
import DoshaHeroCard from "@/components/dashboard/DoshaHeroCard";
import PantryHighlightCard from "@/components/dashboard/PantryHighlightCard";
import FeatureExploreCard from "@/components/dashboard/FeatureExploreCard";
import {
  IconLeaf,
  IconBowl,
  IconSeason,
  IconHabits,
} from "@/components/layout/icons";

function readPantryItems() {
  try {
    const raw = localStorage.getItem("pantryItems");
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
  const [seasonKey, setSeasonKey] = useState("winter");

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const userData = JSON.parse(localStorage.getItem("user") || "{}");

    const doshaData = JSON.parse(localStorage.getItem("doshaResult") || "{}");

    if (!userData.quizCompleted) {
      router.push("/app/quiz");
      return;
    }

    if (!userData.profileCompleted) {
      router.push("/app/profile/create");
      return;
    }

    setUser(userData);
    setDoshaResult(doshaData);
    setPantryItems(readPantryItems());
    setSeasonKey(getSeasonFromDate(new Date()));
  }, [router]);

  useEffect(() => {
    const onPantry = () => setPantryItems(readPantryItems());

    window.addEventListener("ayura-pantry-updated", onPantry);

    window.addEventListener("storage", onPantry);

    return () => {
      window.removeEventListener("ayura-pantry-updated", onPantry);

      window.removeEventListener("storage", onPantry);
    };
  }, []);

  const seasonLabel = useMemo(() => {
    const r = RITUS[seasonKey];

    return r ? r.label.split("—")[0].trim() : "This season";
  }, [seasonKey]);

  if (!user || !doshaResult) {
    return (
      <div className="relative flex min-h-[50vh] items-center justify-center overflow-hidden px-4 bg-white">
        <div className="relative text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-inner ring-1 ring-stone-200">
            <div className="h-6 w-6 animate-pulse rounded-full bg-gradient-to-br from-emerald-200 to-amber-200" />
          </div>

          <p className="text-sm font-medium text-stone-600">
            Preparing your dashboard…
          </p>
        </div>
      </div>
    );
  }

  const meta = doshaInfo[doshaResult.dominant];

  const pantryCount = pantryItems.length;

  return (
    <div className="relative min-h-full overflow-hidden bg-stone">
      <div className="relative z-[1] px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        <div className="mx-auto max-w-6xl space-y-6 lg:space-y-4">
          {/* Hero Card */}

          <DoshaHeroCard
            userName={user.name}
            doshaResult={doshaResult}
            doshaMeta={meta}
          />

          {/* Pantry Card */}

          <PantryHighlightCard
            pantryCount={pantryCount}
            previewItems={pantryItems}
          />
          <br></br>
          <br></br>
          {/* Explore Section */}
          <div className="space-y-6">
            <SectionHeader
              title="Let's Explore!"
              description="Each area is tuned to your constitution and current season, with personalized insights and guidance to support your balance and well-being."
            />

            {/* ROW LAYOUT */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <div className="min-w-[280px] flex-1">
                <FeatureExploreCard
                  variant="lifestyle"
                  href="/app/lifestyle"
                  icon={<IconLeaf />}
                  title="Lifestyle & Mind"
                  description="Yoga flows, movement, and breath practices that balance your dominant dosha — calm, structured, and kind to your nervous system."
                  ctaLabel="Open lifestyle hub"
                />
              </div>

              <div className="min-w-[280px] flex-1">
                <FeatureExploreCard
                  variant="food"
                  href="/app/food"
                  icon={<IconBowl />}
                  title="Food & Digestion"
                  description="Weekly meal planning with explainable dosha fit, pantry match scores, and digestion-friendly swaps."
                  ctaLabel="Plan & nourish"
                />
              </div>

              <div className="min-w-[280px] flex-1">
                <FeatureExploreCard
                  variant="seasons"
                  href="/app/seasons"
                  icon={<IconSeason />}
                  title="Seasons"
                  description="Ritu-aware guidance: what to favor, gentle cautions, and seasonal foods that support balance right now."
                  ctaLabel="View seasonal guide"
                />
              </div>

              <div className="min-w-[280px] flex-1">
                <FeatureExploreCard
                  variant="habits"
                  icon={<IconHabits />}
                  title="Habits"
                  description="Gentle routine tracking and ritual reminders woven into your prakriti — we are crafting this with care."
                  ctaLabel="Habits Tracker"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
