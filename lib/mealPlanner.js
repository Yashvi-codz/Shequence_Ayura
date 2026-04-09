// lib/mealPlanner.js

import { AYURVEDIC_RECIPES } from "@/lib/ayurveda/recipes";
import { RITUS } from "@/lib/ayurveda/ritus";
import { normalizeIngredient } from "@/lib/ingredientNormalizer";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function normalizeGoal(goal) {
  const g = (goal || "").toLowerCase();
  if (g.includes("diab")) return "diabetes_friendly";
  if (g.includes("digest")) return "digestion";
  if (g.includes("energy")) return "energy";
  if (g.includes("weight")) return "weight_loss";
  return null;
}

function normalizeMood(mood) {
  const m = (mood || "").toLowerCase();
  if (m.includes("low")) return "low_energy";
  if (m.includes("stress")) return "stress";
  if (m.includes("cold")) return "feeling_cold";
  return null;
}

function buildPantrySet(pantryItems = []) {
  const set = new Set();
  pantryItems.forEach((p) => {
    const n = normalizeIngredient(p);
    if (n) set.add(n);
  });
  return set;
}

function scoreRecipe({ recipe, pantrySet, dosha, season, goals, mood }) {
  let score = 0;

  // Pantry match
  const missing = [];
  let matched = 0;
  recipe.ingredients.forEach((ing) => {
    const n = normalizeIngredient(ing);
    if (pantrySet.has(n)) matched += 1;
    else missing.push(ing);
  });
  const matchPct = recipe.ingredients.length
    ? Math.round((matched / recipe.ingredients.length) * 100)
    : 0;
  score += matchPct; // main driver

  // Dosha fit
  if (dosha && recipe.doshaBalance?.includes(dosha)) score += 25;

  // Season fit (Ritu)
  if (season && recipe.seasons?.includes(season)) score += 20;

  // Goal fit
  if (goals && goals.length) {
    const goalHits = goals.filter((g) => recipe.goals?.includes(g)).length;
    score += goalHits * 12;
  }

  // Mood fit
  if (mood && recipe.moods?.includes(mood)) score += 12;

  // Small nudge for season qualities compatibility (if recipe has the same quality words)
  const ritu = season ? RITUS[season] : null;
  if (ritu?.qualities?.length && recipe.qualities?.length) {
    const qHits = ritu.qualities.filter((q) => recipe.qualities.includes(q)).length;
    score += qHits * 4;
  }

  return { score, matchPct, missing, matchedCount: matched };
}

export function rankRecipes({
  pantryItems = [],
  dosha = null,
  season = null,
  healthGoals = [],
  mood = null,
  limit = 30,
} = {}) {
  const pantrySet = buildPantrySet(pantryItems);
  const goals = (healthGoals || []).map(normalizeGoal).filter(Boolean);
  const m = normalizeMood(mood);

  const ranked = AYURVEDIC_RECIPES.map((recipe) => {
    const { score, matchPct, missing, matchedCount } = scoreRecipe({
      recipe,
      pantrySet,
      dosha,
      season,
      goals,
      mood: m,
    });

    return {
      id: recipe.id,
      title: recipe.title,
      matchPercentage: matchPct,
      matchedCount,
      totalIngredients: recipe.ingredients.length,
      matchedIngredients: recipe.ingredients.filter((i) => pantrySet.has(normalizeIngredient(i))),
      missingIngredients: missing,
      tags: {
        doshaBalance: recipe.doshaBalance,
        seasons: recipe.seasons,
        goals: recipe.goals,
        moods: recipe.moods,
        qualities: recipe.qualities,
      },
      score,
    };
  })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return ranked;
}

export function generateWeeklyPlan({ rankedRecipes = [] } = {}) {
  const plan = [];
  const used = new Set();

  for (let i = 0; i < DAYS.length; i += 1) {
    const pick =
      rankedRecipes.find((r) => !used.has(r.id)) ||
      rankedRecipes[i % Math.max(1, rankedRecipes.length)] ||
      null;

    if (!pick) {
      plan.push({ day: DAYS[i], meal: null });
      continue;
    }

    used.add(pick.id);
    plan.push({
      day: DAYS[i],
      meal: {
        id: pick.id,
        name: pick.title,
        pantryMatchPercent: pick.matchPercentage,
        missingIngredients: pick.missingIngredients,
        tags: pick.tags,
      },
    });
  }

  return plan;
}

export function generateGroceryList({ weeklyPlan = [], pantryItems = [] } = {}) {
  const pantrySet = buildPantrySet(pantryItems);
  const missingNormalized = new Map(); // norm -> display

  weeklyPlan.forEach((d) => {
    const missing = d?.meal?.missingIngredients || [];
    missing.forEach((ing) => {
      const n = normalizeIngredient(ing);
      if (!n) return;
      if (pantrySet.has(n)) return;
      if (!missingNormalized.has(n)) missingNormalized.set(n, ing);
    });
  });

  return Array.from(missingNormalized.values()).sort((a, b) => a.localeCompare(b));
}

