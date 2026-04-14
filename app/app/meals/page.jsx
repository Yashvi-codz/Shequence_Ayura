"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { RECIPES_DB } from "@/lib/data/recipes";

function Chip({ children }) {
  return (
    <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-gray-100 text-gray-800 border-gray-200">
      {children}
    </span>
  );
}

function MealCard({ type, meal, onSwap, swapping }) {
  if (!meal) return null;

  return (
    <div className="bg-white border rounded-2xl p-4 w-full h-full flex flex-col hover:shadow-md transition">
      {/* TYPE */}
      <div className="text-xs font-semibold text-primary mb-2 uppercase tracking-wide">
        {type}
      </div>

      {/* IMAGE WRAPPER (IMPORTANT FIX) */}
      <div className="w-full h-36 rounded-xl overflow-hidden mb-3">
        <img src={meal.image} className="w-full h-full object-cover" />
      </div>

      {/* NAME */}
      <div className="font-bold text-dark-text text-base">{meal.name}</div>

      {/* NUTRITION */}
      <div className="text-sm text-gray-text mt-1">{meal.nutrition}</div>

      {/* DESCRIPTION */}
      <div className="text-xs text-gray-text mt-2 line-clamp-2">
        {meal.doshaReason}
      </div>

      {/* BUTTON (push to bottom) */}
      <button
        onClick={onSwap}
        className="mt-auto pt-3 w-full py-2 text-sm rounded-xl border bg-gray-50 hover:bg-gray-100 transition"
      >
        {swapping ? "Swapping..." : "Swap"}
      </button>
    </div>
  );
}

export default function MealsPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("plan");
  const [activeDay, setActiveDay] = useState("Monday");
  const [toast, setToast] = useState(null);
  const [weeklyPlan, setWeeklyPlan] = useState([]);
  const [groceryList, setGroceryList] = useState([]);
  const [checkedGrocery, setCheckedGrocery] = useState({});
  const [swappingDay, setSwappingDay] = useState(null);

  // INIT PLAN (DUMMY GENERATION USING RECIPES_DB)
  useEffect(() => {
    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    const plan = days.map((day) => ({
      day,
      meals: {
        breakfast: getRandomMeal(),
        lunch: getRandomMeal(),
        dinner: getRandomMeal(),
        snacks: getRandomMeal(),
      },
    }));

    setWeeklyPlan(plan);
    setGroceryList(generateGrocery(plan));
  }, []);

useEffect(() => {
  if (!toast) return;

  const t = setTimeout(() => setToast(null), 2500);
  return () => clearTimeout(t);
}, [toast]);

  function getRandomMeal() {
    const r = RECIPES_DB[Math.floor(Math.random() * RECIPES_DB.length)];
    return {
      id: r.id,
      name: r.title,
      image: r.image,
      nutrition: r.nutrition,
      doshaReason: r.why,
      ingredients: r.ingredients,
    };
  }

  function swapMeal(day, type) {
    setSwappingDay(`${day}-${type}`);

    setWeeklyPlan((prev) =>
      prev.map((d) => {
        if (d.day !== day) return d;

        return {
          ...d,
          meals: {
            ...d.meals,
            [type]: getRandomMeal(),
          },
        };
      }),
    );

    setTimeout(() => setSwappingDay(null), 400);
  }

  function generateGrocery(plan) {
    const items = new Set();
    plan.forEach((d) => {
      Object.values(d.meals).forEach((m) => {
        m.ingredients.forEach((i) => items.add(i));
      });
    });
    return Array.from(items);
  }

  function toggleGrocery(item) {
    setCheckedGrocery((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  }

  return (
    <div className="min-h-full bg-gradient-to-br from-cream to-primary-light/30 pb-10">
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-xl shadow-lg z-50 transition">
          {toast}
        </div>
      )}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* HEADER */}
        <h1 className="text-4xl font-black text-dark-text mb-6">
          Weekly Meal Planner
        </h1>

        {/* TABS */}
        <div className="bg-white border rounded-2xl p-2 mb-6">
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "plan", label: "Plan" },
              { id: "recipes", label: "Recipes" },
              { id: "grocery", label: "Grocery" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`py-2 rounded-xl font-bold ${
                  activeTab === t.id
                    ? "bg-primary text-white"
                    : "text-gray-text"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* PLAN TAB */}
        {activeTab === "plan" && (
          <>
            {/* DAY SELECTOR */}
            <div className="flex gap-2 mb-4 overflow-x-auto">
              {weeklyPlan.map((d) => (
                <button
                  key={d.day}
                  onClick={() => setActiveDay(d.day)}
                  className={`px-4 py-2 rounded-xl font-semibold ${
                    activeDay === d.day
                      ? "bg-primary text-white"
                      : "bg-white border"
                  }`}
                >
                  {d.day}
                </button>
              ))}
            </div>

            {/* MEALS */}
            {weeklyPlan
              .filter((d) => d.day === activeDay)
              .map((d) => (
                <div className="grid grid-cols-2 gap-4 pb-3">
                  {["breakfast", "lunch", "dinner", "snacks"].map((type) => (
                    <div
                      className={`rounded-2xl p-4 border hover:shadow-md transition ${
                        type === "breakfast"
                          ? "bg-yellow-50 border-yellow-100"
                          : type === "lunch"
                            ? "bg-green-50 border-green-100"
                            : type === "dinner"
                              ? "bg-purple-50 border-purple-100"
                              : "bg-pink-50 border-pink-100"
                      }`}
                    >
                      <MealCard
                        type={type}
                        meal={d.meals[type]}
                        swapping={swappingDay === `${d.day}-${type}`}
                        onSwap={() => swapMeal(d.day, type)}
                      />
                    </div>
                  ))}
                </div>
              ))}
          </>
        )}

        {/* RECIPES TAB */}
        {activeTab === "recipes" && (
          <div className="space-y-4">
            {RECIPES_DB.map((r) => (
              <div
                key={r.id}
                className="flex gap-4 p-4 rounded-2xl bg-white border hover:shadow-md transition"
              >
                {/* IMAGE */}
                <img
                  src={r.image}
                  className="w-28 h-28 object-cover rounded-xl"
                />

                {/* CONTENT */}
                <div className="flex-1">
                  <div className="text-lg font-bold text-dark-text">
                    {r.title}
                  </div>

                  <div className="text-sm text-gray-text">{r.time}</div>

                  <div className="text-sm mt-1">{r.nutrition}</div>

                  <div className="text-xs text-gray-text mt-1">{r.why}</div>

                  {/* BUTTONS */}
                  <div className="flex gap-2 mt-3 flex-wrap">
                    <button
                      className="text-xs px-3 py-1 rounded-lg bg-gray-100"
                      onClick={() => setToast(r.steps.join(" • "))}
                    >
                      Steps
                    </button>

                    <button
                      className="text-xs px-3 py-1 rounded-lg bg-gray-100"
                      onClick={() => setToast(r.ingredients.join(" • "))}
                    >
                      Ingredients
                    </button>

                    <button
                      className="text-xs px-3 py-1 rounded-lg bg-primary text-white"
                      onClick={() => {
                        setActiveTab("grocery");
                        setCheckedGrocery((prev) => {
                          const next = { ...prev };
                          r.ingredients.forEach((i) => (next[i] = true));
                          return next;
                        });
                      }}
                    >
                      Add to Grocery
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* GROCERY TAB */}
        {activeTab === "grocery" && (
          <div className="border rounded-xl p-4 bg-white">
            <h2 className="text-2xl font-bold mb-4">Grocery List</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {groceryList.map((item) => {
                const checked = checkedGrocery[item];

                return (
                  <button
                    key={item}
                    onClick={() => toggleGrocery(item)}
                    className={`flex justify-between border rounded-xl px-4 py-3 ${
                      checked ? "bg-green-50 border-green-200" : "bg-white"
                    }`}
                  >
                    <span className="capitalize">{item}</span>
                    <span>{checked ? "✓" : ""}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
