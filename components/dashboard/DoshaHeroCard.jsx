"use client";

import Link from "next/link";

const DOSHA_SURFACE = {
  vata: {
    gradient: "from-[#f8e8ec] via-[#faf4f2] to-[#fff9f5]",
    gradient2: "from-rose-200/25 via-transparent to-violet-200/15",
    accent: "text-rose-950/90",
    accentSoft: "text-rose-900/75",
    ring: "ring-rose-200/40",
    badge: "bg-rose-100/90 text-rose-950 ring-rose-200/50",
    chipActive: "ring-rose-300/70 bg-white/90",
    blob: "bg-rose-200/12",
  },

  pitta: {
    gradient: "from-[#fff4d6] via-[#fffaf0] to-[#fff5eb]",
    gradient2: "from-amber-200/30 via-transparent to-orange-200/20",
    accent: "text-amber-950/90",
    accentSoft: "text-amber-900/80",
    ring: "ring-amber-200/45",
    badge: "bg-amber-100/90 text-amber-950 ring-amber-200/55",
    chipActive: "ring-amber-400/60 bg-white/90",
    blob: "bg-amber-200/14",
  },

  kapha: {
    gradient: "from-[#e4f2ea] via-[#f4faf6] to-[#eef6f9]",
    gradient2: "from-emerald-200/25 via-transparent to-sky-200/15",
    accent: "text-emerald-950/90",
    accentSoft: "text-emerald-900/80",
    ring: "ring-emerald-200/40",
    badge: "bg-emerald-100/90 text-emerald-950 ring-emerald-200/50",
    chipActive: "ring-emerald-400/55 bg-white/90",
    blob: "bg-emerald-200/12",
  },
};

export default function DoshaHeroCard({
  userName,
  doshaResult,
  doshaMeta,
  todayMetrics,
}) {
  /* Get dominant dosha */
  const key = doshaResult?.dominant || "vata";
  const surface = DOSHA_SURFACE[key] || DOSHA_SURFACE.vata;

  /* Dosha colors */
  const DOSHA_COLOR = {
    vata: "#be123c",
    pitta: "#b45309",
    kapha: "#047857",
  };

  const info = {
    color: DOSHA_COLOR[key] || "#374151",
  };

  /* Percentage */
  const pct =
    doshaResult?.percentages && doshaResult?.dominant
      ? doshaResult.percentages[doshaResult.dominant]
      : null;

  /* ✅ Wellness Score = dominant % */
  const wellnessScore = doshaResult?.percentages?.[doshaResult?.dominant] ?? 0;

  return (
    <div className="pb-3">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white/70 backdrop-blur">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary-light/40 to-transparent" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(39,174,96,0.15), transparent 35%), radial-gradient(circle at 80% 30%, rgba(184,216,200,0.35), transparent 40%)",
          }}
        />

        <div className="relative p-5 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 items-center">
            {/* LEFT */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-dark-text leading-tight">
                Namaste <span>{userName || "User"}</span>
              </h1>

              <p className="mt-2 text-sm text-gray-text max-w-xl">
                Personalized wellness, powered by Ayurveda & AI.
              </p>
              <p className="text-sm text-gray-text max-w-xl">
                Small, mindful steps toward balance—every single day.
              </p>
              {/* Tags */}
              <div className="mt-4 flex flex-wrap gap-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-gray-200 px-2 py-1 text-[10px] font-medium text-gray-text">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Stay Consistent
                </div>

                <div className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-gray-200 px-2 py-1 text-[10px] font-medium text-gray-text">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                  Stay Balanced
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              {/* Dosha Name */}
              <h3
                className="text-base font-semibold text-center mb-3"
                style={{ color: info.color }}
              >
                {doshaMeta?.name} {doshaMeta?.emoji}
              </h3>
              <div className="flex items-center justify-center gap-6">
                {/* LEFT: Dosha % */}
                <ul className="text-xs text-gray-600 space-y-1 text-right">
                  <li className="text-rose-600">
                    Vata: {doshaResult?.percentages?.vata ?? 0}%
                  </li>
                  <li className="text-amber-600">
                    Pitta: {doshaResult?.percentages?.pitta ?? 0}%
                  </li>
                  <li className="text-emerald-600">
                    Kapha: {doshaResult?.percentages?.kapha ?? 0}%
                  </li>
                </ul>

                {/* CENTER: Circle */}
                <div
                  className="w-20 h-20 rounded-full border-4 flex items-center justify-center"
                  style={{ borderColor: info.color }}
                >
                  <div className="text-center">
                    <div
                      className="text-lg font-bold"
                      style={{ color: info.color }}
                    >
                      {wellnessScore}%
                    </div>
                    <div className="text-[9px] text-gray-500">Balance</div>
                  </div>
                </div>

                {/* RIGHT: Metrics */}
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>Sleep: {todayMetrics?.sleep ?? 8}/10</li>
                  <li>Stress: {todayMetrics?.stress ?? 7}/10</li>
                  <li>Digestion: {todayMetrics?.digestion ?? 9}/10</li>
                  <li>Energy: {todayMetrics?.energy ?? 7}/10</li>
                </ul>
              </div>
              {/* Button */}
              <Link
                href="/app/quiz"
                className="mt-4 block w-full bg-primary text-white py-1.5 text-sm rounded-md hover:bg-primary-dark transition text-center"
              >
                Retake Quiz
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
