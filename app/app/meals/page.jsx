"use client";

import { useEffect, useState } from "react";
import { RECIPES_DB } from "@/lib/data/recipes";

function MealCard({ type, meal, onSwap, swapping }) {
  if (!meal) return null;

  return (
    <div className="bg-white border rounded-2xl p-4 w-full h-full flex flex-col hover:shadow-md transition">
      <div className="text-xs font-semibold text-primary mb-2 uppercase tracking-wide">
        {type}
      </div>

      <div className="w-full h-36 rounded-xl overflow-hidden mb-3">
        <img src={meal.image} className="w-full h-full object-cover" />
      </div>

      <div className="font-bold text-dark-text text-base">{meal.name}</div>
      <div className="text-sm text-gray-text mt-1">{meal.nutrition}</div>

      <div className="text-xs text-gray-text mt-2 line-clamp-2">
        {meal.doshaReason}
      </div>

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
  const [activeTab, setActiveTab] = useState("plan");
  const [activeDay, setActiveDay] = useState("Monday");
  const [weeklyPlan, setWeeklyPlan] = useState([]);
  const [swappingDay, setSwappingDay] = useState(null);
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);
  const [groceryList, setGroceryList] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [newQty, setNewQty] = useState("");

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
      prev.map((d) =>
        d.day === day
          ? {
              ...d,
              meals: {
                ...d.meals,
                [type]: getRandomMeal(),
              },
            }
          : d,
      ),
    );

    setTimeout(() => setSwappingDay(null), 400);
  }

  function openModal(title, content) {
    setModal({ title, content });
  }

  function closeModal() {
    setModal(null);
  }
  function addGroceryItem() {
    if (!newItem.trim()) return;

    setGroceryList((prev) => [
      ...prev,
      { name: newItem, quantity: newQty || "-", checked: false },
    ]);

    setNewItem("");
    setNewQty("");
  }

  // ✅ TOGGLE
  function toggleGrocery(index) {
    setGroceryList((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, checked: !item.checked } : item,
      ),
    );
  }

  // ✅ REMOVE
  function removeItem(index) {
    setGroceryList((prev) => prev.filter((_, i) => i !== index));
  }

  // ✅ ADD FROM RECIPES
  function addIngredientsToGrocery(ingredients) {
    setGroceryList((prev) => {
      const existing = prev.map((i) => i.name.toLowerCase());

      const newItems = ingredients
        .filter((ing) => !existing.includes(ing.toLowerCase()))
        .map((ing) => ({
          name: ing,
          quantity: "-",
          checked: false,
        }));

      return [...prev, ...newItems];
    });
  }

  return (
    <div className="min-h-full bg-gradient-to-br from-cream to-primary-light/30 pb-10">
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-xl shadow-lg z-50">
          {toast}
        </div>
      )}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-md rounded-2xl p-5 shadow-xl relative animate-fadeIn">
            {/* CLOSE BUTTON */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              ✕
            </button>

            {/* TITLE */}
            <h2 className="text-xl font-bold mb-3">{modal.title}</h2>

            {/* CONTENT */}
            <div className="space-y-2 max-h-64 overflow-y-auto text-sm text-gray-700">
              {modal.content.map((item, i) => (
                <div key={i} className="border-b pb-1">
                  • {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-black text-dark-text mb-6">
          Weekly Meal Planner
        </h1>

        {/* TABS */}
        <div className="bg-white border rounded-2xl p-2 mb-6">
          <div className="grid grid-cols-3 gap-2">
            {["plan", "recipes", "grocery"].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`py-2 rounded-xl font-bold ${
                  activeTab === t ? "bg-primary text-white" : "text-gray-text"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* PLAN */}
        {activeTab === "plan" && (
          <>
            <div className="flex gap-2 mb-4 overflow-x-auto">
              {weeklyPlan.map((d) => (
                <button
                  key={d.day}
                  onClick={() => setActiveDay(d.day)}
                  className={`px-4 py-2 rounded-xl ${
                    activeDay === d.day
                      ? "bg-primary text-white"
                      : "bg-white border"
                  }`}
                >
                  {d.day}
                </button>
              ))}
            </div>

            {weeklyPlan
              .filter((d) => d.day === activeDay)
              .map((d) => (
                <div key={d.day} className="grid grid-cols-2 gap-4">
                  {["breakfast", "lunch", "dinner", "snacks"].map((type) => (
                    <MealCard
                      key={type}
                      type={type}
                      meal={d.meals[type]}
                      swapping={swappingDay === `${d.day}-${type}`}
                      onSwap={() => swapMeal(d.day, type)}
                    />
                  ))}
                </div>
              ))}
          </>
        )}

        {/* RECIPES */}
        {activeTab === "recipes" && (
          <div className="space-y-4">
            {RECIPES_DB.map((r) => (
              <div
                key={r.id}
                className="flex gap-4 p-4 rounded-2xl bg-white border"
              >
                <img
                  src={r.image}
                  className="w-28 h-28 rounded-xl object-cover"
                />

                <div className="flex-1">
                  <div className="font-bold">{r.title}</div>
                  <div className="text-sm">{r.time}</div>
                  <div className="text-xs">{r.why}</div>

                  <div className="flex gap-2 mt-3 flex-wrap">
                    <button
                      className="text-xs px-2 py-1 rounded-md bg-gray-100"
                      onClick={() => openModal("Steps", r.steps)}
                    >
                      Steps
                    </button>

                    <button
                      className="text-xs px-2 py-1 rounded-md bg-gray-100"
                      onClick={() => openModal("Ingredients", r.ingredients)}
                    >
                      Ingredients
                    </button>

                    <button
                      className="bg-primary text-white px-3 py-1 rounded-lg"
                      onClick={() => addIngredientsToGrocery(r.ingredients)}
                    >
                      Add to Grocery
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* GROCERY */}
        {activeTab === "grocery" && (
          <div className="bg-white border rounded-xl p-4">
            <h2 className="text-2xl font-bold mb-4">Grocery List</h2>

            {/* ADD INPUT */}
            <div className="flex gap-2 mb-4">
              <input
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="Item"
                className="flex-1 border rounded-xl px-3 py-2"
              />

              <input
                value={newQty}
                onChange={(e) => setNewQty(e.target.value)}
                placeholder="Qty"
                className="w-24 border rounded-xl px-3 py-2"
              />

              <button
                onClick={addGroceryItem}
                className="bg-primary text-white px-4 rounded-xl"
              >
                Add
              </button>
            </div>

            {/* LIST */}
            <div className="space-y-2">
              {groceryList.map((item, index) => (
                <div
                  key={index}
                  className={`flex justify-between items-center border rounded-xl px-4 py-3 ${
                    item.checked ? "bg-green-50" : ""
                  }`}
                >
                  <div
                    onClick={() => toggleGrocery(index)}
                    className="flex-1 cursor-pointer"
                  >
                    {item.name} ({item.quantity})
                  </div>

                  <div className="flex gap-3 items-center">
                    {item.checked && "✓"}
                    <button onClick={() => removeItem(index)}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
