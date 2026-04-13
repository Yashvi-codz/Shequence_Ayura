// app/meals/page.jsx
'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { RITUS, getSeasonFromDate } from "@/lib/ayurveda/ritus";

function Chip({ children, tone = "neutral" }) {
  const cls =
    tone === "good"
      ? "bg-green-100 text-green-800 border-green-200"
      : tone === "warn"
        ? "bg-yellow-100 text-yellow-800 border-yellow-200"
        : "bg-gray-100 text-gray-800 border-gray-200";
  return <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${cls}`}>{children}</span>;
}

function IconStat({ label, value, icon, tone = "neutral" }) {
  const cls =
    tone === "good"
      ? "bg-green-50 border-green-200 text-green-900"
      : tone === "warn"
        ? "bg-yellow-50 border-yellow-200 text-yellow-900"
        : "bg-white border-gray-200 text-dark-text";
  return (
    <div className={`border rounded-xl px-4 py-3 flex items-center gap-3 ${cls}`}>
      <div className="text-2xl">{icon}</div>
      <div>
        <div className="text-xs text-gray-text font-semibold">{label}</div>
        <div className="text-lg font-black">{value}</div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="card animate-pulse">
      <div className="h-4 w-24 bg-gray-200 rounded mb-3" />
      <div className="h-5 w-3/4 bg-gray-200 rounded mb-4" />
      <div className="flex gap-2">
        <div className="h-6 w-28 bg-gray-200 rounded-full" />
        <div className="h-6 w-24 bg-gray-200 rounded-full" />
      </div>
      <div className="h-3 w-full bg-gray-200 rounded mt-4" />
    </div>
  );
}

function DayCard({ day, meal, onSwap, swapping }) {
  if (!meal) {
    return (
      <div className="card">
        <div className="text-sm text-gray-text font-semibold mb-2">{day}</div>
        <div className="text-gray-text">No meal selected</div>
      </div>
    );
  }

  return (
    <div className="card hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm text-gray-text font-semibold mb-2">{day}</div>
          <div className="text-lg font-bold text-dark-text">{meal.name}</div>
          <div className="mt-2 flex flex-wrap gap-2">
            <Chip tone={meal.pantryMatchPercent >= 70 ? "good" : "warn"}>
              Pantry match {meal.pantryMatchPercent}%
            </Chip>
            {(meal.tags?.qualities || []).slice(0, 2).map((q) => (
              <Chip key={q}>{q.replace(/_/g, " ")}</Chip>
            ))}
          </div>
        </div>
        <div className="text-3xl">🍽️</div>
      </div>

      {meal.missingIngredients?.length > 0 && (
        <div className="mt-4 text-sm text-gray-text">
          <span className="font-semibold">Missing:</span> {meal.missingIngredients.slice(0, 6).join(", ")}
          {meal.missingIngredients.length > 6 ? "…" : ""}
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={onSwap}
          disabled={swapping}
          className="btn-secondary flex-1 py-2"
        >
          {swapping ? "Swapping..." : "🔁 Swap"}
        </button>
        <a href="/app/pantry" className="btn-primary flex-1 py-2 text-center">
          🥘 Update Pantry
        </a>
      </div>
    </div>
  );
}

export default function MealsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [swappingDay, setSwappingDay] = useState(null);
  const [error, setError] = useState("");

  const [pantryItems, setPantryItems] = useState([]);
  const [dosha, setDosha] = useState(null);
  const [profileGoals, setProfileGoals] = useState([]);

  const [season, setSeason] = useState(getSeasonFromDate(new Date()));
  const [goal, setGoal] = useState("auto"); // auto | weight_loss | digestion | energy | diabetes_friendly
  const [mood, setMood] = useState("none"); // none | low_energy | stress | feeling_cold

  const [activeTab, setActiveTab] = useState("plan"); // plan | recipes | grocery
  const [weeklyPlan, setWeeklyPlan] = useState([]);
  const [groceryList, setGroceryList] = useState([]);
  const [rankedRecipes, setRankedRecipes] = useState([]);
  const [checkedGrocery, setCheckedGrocery] = useState({});

  const autoTimerRef = useRef(null);
  const latestRequestRef = useRef(0);

  const ritu = useMemo(() => RITUS[season], [season]);
  const effectiveGoals = useMemo(() => {
    if (goal !== "auto") return [goal];
    return profileGoals || [];
  }, [goal, profileGoals]);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const savedPantry = JSON.parse(localStorage.getItem("pantryItems") || "[]");
      setPantryItems(Array.isArray(savedPantry) ? savedPantry : []);

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setProfileGoals(Array.isArray(user?.healthGoals) ? user.healthGoals : []);

      const doshaResult = JSON.parse(localStorage.getItem("doshaResult") || "{}");
      setDosha(doshaResult?.dominant || null);
    } catch {
      setPantryItems([]);
      setProfileGoals([]);
      setDosha(null);
    }
  }, [router]);

  const planStats = useMemo(() => {
    const meals = (weeklyPlan || []).map((d) => d?.meal).filter(Boolean);
    const avgMatch = meals.length
      ? Math.round(meals.reduce((sum, m) => sum + (m.pantryMatchPercent || 0), 0) / meals.length)
      : 0;
    const totalMissing = meals.reduce((sum, m) => sum + (m.missingIngredients?.length || 0), 0);
    return { mealsCount: meals.length, avgMatch, totalMissing };
  }, [weeklyPlan]);

  async function handleGenerateWeeklyPlan({ silent = false } = {}) {
    setError("");
    if (!silent) setLoading(true);
    try {
      const reqId = Date.now();
      latestRequestRef.current = reqId;
      const res = await fetch("/api/meal-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pantryItems,
          dosha,
          season,
          healthGoals: effectiveGoals,
          mood: mood === "none" ? null : mood,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to generate plan");
      }
      // Ignore out-of-order responses
      if (latestRequestRef.current !== reqId) return;
      setWeeklyPlan(data.weeklyPlan || []);
      setGroceryList(data.groceryList || []);
      setRankedRecipes(data.rankedRecipes || []);
      setCheckedGrocery({});
    } catch (e) {
      setWeeklyPlan([]);
      setGroceryList([]);
      setRankedRecipes([]);
      setError(e?.message || "Something went wrong");
    } finally {
      if (!silent) setLoading(false);
    }
  }

  // Auto-generate once we have pantry (and then auto-update on changes)
  useEffect(() => {
    if (!pantryItems) return;
    if (pantryItems.length === 0) return;
    // Debounce changes (dynamic feel)
    if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
    autoTimerRef.current = setTimeout(() => {
      handleGenerateWeeklyPlan({ silent: true });
    }, 450);
    return () => {
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [season, goal, mood, dosha, JSON.stringify(pantryItems), JSON.stringify(effectiveGoals)]);

  function toggleGrocery(item) {
    setCheckedGrocery((prev) => ({ ...prev, [item]: !prev[item] }));
  }

  function addCheckedToPantry() {
    const toAdd = groceryList.filter((i) => checkedGrocery[i]);
    if (!toAdd.length) return;
    const merged = Array.from(new Set([...(pantryItems || []), ...toAdd.map((t) => String(t).toLowerCase().trim())])).filter(Boolean);
    setPantryItems(merged);
    localStorage.setItem("pantryItems", JSON.stringify(merged));
    setCheckedGrocery({});
  }

  function swapDayMeal(day) {
    if (!rankedRecipes?.length) return;
    setSwappingDay(day);
    setWeeklyPlan((prev) => {
      const used = new Set(prev.map((d) => d?.meal?.id).filter(Boolean));
      return prev.map((d) => {
        if (d.day !== day) return d;
        const next = rankedRecipes.find((r) => !used.has(r.id)) || rankedRecipes[0];
        if (!next) return d;
        return {
          ...d,
          meal: {
            id: next.id,
            name: next.title,
            pantryMatchPercent: next.matchPercentage,
            missingIngredients: next.missingIngredients,
            tags: next.tags,
          },
        };
      });
    });
    // Recompute grocery list by re-calling API is heavy; quick local recompute:
    // We’ll just re-run generation silently so grocery list stays accurate.
    setTimeout(() => {
      handleGenerateWeeklyPlan({ silent: true }).finally(() => setSwappingDay(null));
    }, 0);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-primary-light/30 pb-24">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-gray-200 text-xs font-semibold text-gray-text">
                Dynamic planner • updates as you change filters
              </div>
              <h1 className="text-4xl font-black text-dark-text mt-3">
                Weekly Auto Meal Planner
              </h1>
              <p className="text-gray-text mt-2 max-w-2xl">
                A full week plan based on your <span className="font-semibold">Dosha</span>, your <span className="font-semibold">Pantry</span>, and the <span className="font-semibold">Season</span> — plus your <span className="font-semibold">goal</span> and <span className="font-semibold">mood</span>.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full sm:w-auto">
              <IconStat label="Dosha" value={(dosha || "Not set").toString().toUpperCase()} icon="🧬" />
              <IconStat label="Pantry items" value={pantryItems.length} icon="🥘" />
              <IconStat label="Avg pantry match" value={`${planStats.avgMatch || 0}%`} icon="✅" tone={planStats.avgMatch >= 70 ? "good" : "warn"} />
              <IconStat label="Missing items" value={groceryList.length} icon="🛒" tone={groceryList.length <= 6 ? "good" : "warn"} />
            </div>
          </div>
        </div>

        {/* Seasonal Diet Suggestions */}
        <div className="card mb-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-2xl font-bold text-dark-text">Seasonal Diet Suggestions (Ritu-based)</h2>
              <p className="text-gray-text mt-1">
                Ayurveda changes food recommendations by season — this is what Ayura uses while planning.
              </p>
            </div>
            <div className="min-w-[220px]">
              <label className="block text-sm font-semibold mb-2 text-dark-text">Season</label>
              <select
                className="input-field"
                value={season}
                onChange={(e) => setSeason(e.target.value)}
              >
                {Object.values(RITUS).map((r) => (
                  <option key={r.key} value={r.key}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {ritu && (
            <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="font-bold text-green-800 mb-2">Suggested foods</div>
                <div className="flex flex-wrap gap-2">
                  {ritu.suggestedFoods.map((f) => (
                    <Chip key={f} tone="good">{f}</Chip>
                  ))}
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="font-bold text-blue-900 mb-2">Suggested spices</div>
                <div className="flex flex-wrap gap-2">
                  {ritu.suggestedSpices.map((s) => (
                    <Chip key={s}>{s}</Chip>
                  ))}
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="font-bold text-yellow-900 mb-2">Avoid (general)</div>
                <div className="flex flex-wrap gap-2">
                  {ritu.avoid.map((a) => (
                    <Chip key={a} tone="warn">{a}</Chip>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
            <div>
              <h2 className="text-2xl font-bold text-dark-text">Health goal + Mood</h2>
              <p className="text-gray-text mt-1">Change these and the plan updates automatically.</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => handleGenerateWeeklyPlan()}
                disabled={loading}
                className="btn-primary px-5 py-2"
              >
                {loading ? "Generating..." : "Regenerate"}
              </button>
              <a href="/app/pantry" className="btn-secondary px-5 py-2 text-center">
                Edit pantry
              </a>
              <a href="/app/recipes" className="btn-secondary px-5 py-2 text-center">
                Pantry recipes
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-dark-text">Health goal</label>
              <select className="input-field" value={goal} onChange={(e) => setGoal(e.target.value)}>
                <option value="auto">Auto (from profile)</option>
                <option value="weight_loss">Weight Loss</option>
                <option value="digestion">Digestion Improvement</option>
                <option value="energy">Energy Boost</option>
                <option value="diabetes_friendly">Diabetes-friendly</option>
              </select>
              {goal === "auto" && (
                <div className="text-xs text-gray-text mt-2">
                  Using profile goals:{" "}
                  <span className="font-semibold">
                    {profileGoals?.length ? profileGoals.join(", ") : "None set"}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-dark-text">Mood</label>
              <select className="input-field" value={mood} onChange={(e) => setMood(e.target.value)}>
                <option value="none">No mood selected</option>
                <option value="low_energy">😴 Low energy</option>
                <option value="stress">😰 Stress</option>
                <option value="feeling_cold">🤒 Feeling cold</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-dark-text">Status</label>
              <div className="border-2 border-gray-200 rounded-lg p-3 bg-white">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-dark-text">
                    {loading ? "Updating plan..." : weeklyPlan?.length ? "Plan ready" : "Waiting…"}
                  </div>
                  <div className="text-xs text-gray-text">
                    {weeklyPlan?.length ? `${planStats.mealsCount}/7 days` : "—"}
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Chip tone={planStats.avgMatch >= 70 ? "good" : "warn"}>Avg match {planStats.avgMatch || 0}%</Chip>
                  <Chip tone={groceryList.length <= 6 ? "good" : "warn"}>{groceryList.length} grocery items</Chip>
                </div>
              </div>
            </div>
          </div>

          {error && <div className="mt-4 text-red-600 font-semibold">{error}</div>}
        </div>

        {/* Tabs */}
        <div className="bg-white/80 border border-gray-200 rounded-2xl p-2 mb-6 sticky top-2 z-10 backdrop-blur">
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "plan", label: "📅 Plan" },
              { id: "recipes", label: "🍲 Recipes" },
              { id: "grocery", label: "🛒 Grocery" },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`py-2 rounded-xl font-bold transition-all ${
                  activeTab === t.id ? "bg-primary text-white shadow" : "text-gray-text hover:bg-gray-100"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Plan Tab */}
        {activeTab === "plan" && (
          <div className="mb-6">
            <div className="flex items-end justify-between flex-wrap gap-3 mb-4">
              <div>
                <h2 className="text-2xl font-black text-dark-text">Your Weekly Plan</h2>
                <p className="text-gray-text mt-1">Tap “Swap” to dynamically change a day’s meal.</p>
              </div>
            </div>

            {loading && !weeklyPlan?.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : weeklyPlan?.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {weeklyPlan.map((d) => (
                  <DayCard
                    key={d.day}
                    day={d.day}
                    meal={d.meal}
                    onSwap={() => swapDayMeal(d.day)}
                    swapping={swappingDay === d.day}
                  />
                ))}
              </div>
            ) : (
              <div className="card text-gray-text">
                Add some items in <a className="font-semibold text-primary hover:underline" href="/app/pantry">Pantry</a> — the plan will generate automatically.
              </div>
            )}
          </div>
        )}

        {/* Recipes Tab */}
        {activeTab === "recipes" && (
          <div className="card">
            <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
              <div>
                <h2 className="text-2xl font-black text-dark-text">Top Recipe Matches</h2>
                <p className="text-gray-text mt-1">These power your weekly plan (ranked by your filters + pantry).</p>
              </div>
              <div className="flex gap-2">
                <Chip tone="good">Season: {season}</Chip>
                <Chip>{goal === "auto" ? "Goal: profile" : `Goal: ${goal}`}</Chip>
                <Chip>{mood === "none" ? "Mood: none" : `Mood: ${mood}`}</Chip>
              </div>
            </div>

            {!rankedRecipes?.length ? (
              <div className="text-gray-text">
                No ranked recipes yet. Add pantry items and the list will populate automatically.
              </div>
            ) : (
              <div className="space-y-3">
                {rankedRecipes.map((r, idx) => (
                  <div key={r.id} className="border border-gray-200 rounded-xl p-4 bg-white">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-black text-sm">
                            {idx + 1}
                          </div>
                          <div className="text-lg font-black text-dark-text">{r.title}</div>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Chip tone={r.matchPercentage >= 70 ? "good" : "warn"}>Pantry match {r.matchPercentage}%</Chip>
                          {(r.tags?.qualities || []).slice(0, 3).map((q) => (
                            <Chip key={`${r.id}-${q}`}>{q.replace(/_/g, " ")}</Chip>
                          ))}
                        </div>
                        {!!r.missingIngredients?.length && (
                          <div className="mt-3 text-sm text-gray-text">
                            <span className="font-semibold">Missing:</span> {r.missingIngredients.slice(0, 10).join(", ")}
                            {r.missingIngredients.length > 10 ? "…" : ""}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        className="btn-secondary px-4 py-2"
                        onClick={() => {
                          setActiveTab("grocery");
                          // Pre-check this recipe’s missing items
                          const missing = r.missingIngredients || [];
                          setCheckedGrocery((prev) => {
                            const next = { ...prev };
                            missing.forEach((m) => { next[m] = true; });
                            return next;
                          });
                        }}
                      >
                        Add missing to list
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Grocery Tab */}
        {activeTab === "grocery" && (
          <div className="card">
            <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
              <div>
                <h2 className="text-2xl font-black text-dark-text">Smart Grocery List</h2>
                <p className="text-gray-text mt-1">Check items off, then add them to your pantry in one click.</p>
              </div>
              <div className="flex gap-2">
                <button type="button" className="btn-primary px-5 py-2" onClick={addCheckedToPantry}>
                  ➕ Add checked to pantry
                </button>
                <button
                  type="button"
                  className="btn-secondary px-5 py-2"
                  onClick={() => setCheckedGrocery({})}
                >
                  Clear checks
                </button>
              </div>
            </div>

            {groceryList?.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {groceryList.map((item) => {
                  const checked = !!checkedGrocery[item];
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleGrocery(item)}
                      className={`flex items-center justify-between border rounded-xl px-4 py-3 text-left transition-all ${
                        checked ? "bg-green-50 border-green-200" : "bg-white border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-md border flex items-center justify-center font-black ${
                          checked ? "bg-green-600 border-green-600 text-white" : "border-gray-300 text-transparent"
                        }`}>
                          ✓
                        </div>
                        <span className="font-semibold text-dark-text capitalize">{item}</span>
                      </div>
                      <span className="text-sm text-gray-text">🛒</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-gray-text">
                No missing items yet. Generate a plan first, or add more items to your pantry.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
