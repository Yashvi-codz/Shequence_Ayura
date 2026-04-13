// lib/recipeService.js — pantry matching + RecipeDB / Foodoscope + curated fallback

import { AYURVEDIC_RECIPES } from "@/lib/ayurveda/recipes";
import {
  buildPantryMatchSet,
  recipeIngredientInPantrySet,
  normalizeIngredient,
} from "@/lib/ingredientNormalizer";

const FOODOSCOPE_API_BASE =
  process.env.FOODOSCOPE_API_BASE ||
  process.env.NEXT_PUBLIC_FOODOSCOPE_API_BASE ||
  "http://cosylab.iiitd.edu.in:6969/recipe2-api/recipe/recipe-day/with-ingredients-categories";

const FOODOSCOPE_API_KEY =
  process.env.FOODOSCOPE_API_KEY ||
  process.env.NEXT_PUBLIC_FOODOSCOPE_API_KEY ||
  "0C_pgezIaAEnPd3dP5zXcHLQL4vgqoQUt78lzCYgq0d4088B";

const TOP_N = 5;

function slugId(title) {
  return (title || "recipe")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 96);
}

function pickIngredientName(entry) {
  if (entry == null) return "";
  if (typeof entry === "string") return entry;
  return (
    entry.name ||
    entry.ingredient ||
    entry.original ||
    entry.text ||
    entry.title ||
    ""
  );
}

function extractInstructions(recipe) {
  if (!recipe || typeof recipe !== "object") return [];
  const direct =
    recipe.instructions ||
    recipe.instruction ||
    recipe.method ||
    recipe.steps ||
    recipe.procedure;
  if (typeof direct === "string" && direct.trim()) {
    return direct
      .split(/\n+/)
      .map((s) => s.replace(/^\d+[\).\s]+/, "").trim())
      .filter(Boolean);
  }
  if (Array.isArray(direct)) {
    return direct
      .map((s) =>
        typeof s === "string" ? s : s?.step || s?.text || s?.description || ""
      )
      .map((s) => String(s).trim())
      .filter(Boolean);
  }
  if (Array.isArray(recipe.analyzedInstructions)) {
    const out = [];
    recipe.analyzedInstructions.forEach((block) => {
      (block?.steps || []).forEach((st) => {
        const line = st?.step || st?.text;
        if (line) out.push(String(line).trim());
      });
    });
    return out.filter(Boolean);
  }
  return [];
}

function extractImage(recipe) {
  if (!recipe || typeof recipe !== "object") return null;
  return (
    recipe.image ||
    recipe.imageUrl ||
    recipe.thumbnail ||
    recipe.photo ||
    recipe.img ||
    null
  );
}

function extractTitle(recipe) {
  if (!recipe || typeof recipe !== "object") return "Untitled recipe";
  return (
    recipe.Recipe_title ||
    recipe.title ||
    recipe.name ||
    recipe.recipeName ||
    "Untitled recipe"
  );
}

function extractIngredientsList(recipe) {
  if (!recipe || typeof recipe !== "object") return [];
  const raw = recipe.ingredients;
  if (Array.isArray(raw)) {
    return raw
      .map(pickIngredientName)
      .map((s) => String(s).trim())
      .filter(Boolean);
  }
  if (typeof raw === "string") {
    return raw
      .split(/[,;]|\n/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function unwrapRecipeObjects(data) {
  if (data == null) return [];
  if (Array.isArray(data)) return data;

  if (typeof data === "object") {
    for (const key of ["recipes", "data", "results", "items", "content"]) {
      const v = data[key];
      if (Array.isArray(v)) return v;
    }
    if (data.payload != null) {
      if (Array.isArray(data.payload)) return data.payload;
      if (typeof data.payload === "object") return [data.payload];
    }
    const t = extractTitle(data);
    const ing = extractIngredientsList(data);
    if (t !== "Untitled recipe" && ing.length) return [data];
  }
  return [];
}

async function fetchJsonSafe(url, label) {
  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${FOODOSCOPE_API_KEY}`,
      },
      cache: "no-store",
    });
    const text = await res.text();
    if (!res.ok) {
      console.error(`[recipeService] ${label} HTTP ${res.status}`, text?.slice(0, 500));
      return null;
    }
    try {
      return JSON.parse(text);
    } catch (parseErr) {
      console.error(`[recipeService] ${label} invalid JSON`, parseErr?.message);
      return null;
    }
  } catch (e) {
    console.error(`[recipeService] ${label} fetch error`, e?.message || e);
    return null;
  }
}

function toInternalRecipe(raw, source, index) {
  const title = extractTitle(raw);
  const ingredients = extractIngredientsList(raw);
  const instructions = extractInstructions(raw);
  const image = extractImage(raw);
  const id =
    raw?.id ??
    raw?._id ??
    raw?.recipe_id ??
    raw?.recipeId ??
    slugId(`${source}-${title}-${index}`);

  return {
    id: String(id),
    title,
    image,
    ingredients,
    instructions,
    instructionsAvailable: instructions.length > 0,
    source,
    raw,
  };
}

function dedupeRecipes(list) {
  const seen = new Map();
  for (const r of list) {
    const key = `${normalizeIngredient(r.title)}|${r.ingredients.map(normalizeIngredient).join("|")}`;
    if (!seen.has(key)) seen.set(key, r);
  }
  return Array.from(seen.values());
}

export async function fetchRecipeCandidates(pantryItems = []) {
  const out = [];
  const base =
    typeof FOODOSCOPE_API_BASE === "string" &&
    FOODOSCOPE_API_BASE.length &&
    !FOODOSCOPE_API_BASE.includes("undefined")
      ? FOODOSCOPE_API_BASE
      : null;

  if (base) {
    const dayData = await fetchJsonSafe(base, "foodoscope-day");
    if (dayData) {
      unwrapRecipeObjects(dayData).forEach((item, i) => {
        out.push(toInternalRecipe(item, "foodoscope", i));
      });
    }

    const top = (pantryItems || [])
      .map((s) => String(s).trim())
      .filter(Boolean)
      .slice(0, 5);
    if (top.length) {
      const sep = base.includes("?") ? "&" : "?";
      const byIngUrl = `${base}${sep}ingredients=${encodeURIComponent(top.join(","))}`;
      const byIngData = await fetchJsonSafe(byIngUrl, "foodoscope-by-ingredients");
      if (byIngData) {
        unwrapRecipeObjects(byIngData).forEach((item, i) => {
          out.push(toInternalRecipe(item, "foodoscope-ingredients", i));
        });
      }
    }

    const altBase = base.replace(/\/recipe-day\/[^/]+$/, "/recipes");
    if (altBase !== base) {
      const altData = await fetchJsonSafe(altBase, "foodoscope-alt");
      if (altData) {
        unwrapRecipeObjects(altData).forEach((item, i) => {
          out.push(toInternalRecipe(item, "foodoscope-alt", i));
        });
      }
    }
  } else {
    console.warn("[recipeService] Foodoscope base URL not configured");
  }

  AYURVEDIC_RECIPES.forEach((r, i) => {
    out.push(
      toInternalRecipe(
        {
          id: r.id,
          title: r.title,
          ingredients: r.ingredients,
          instructions: [
            `Prepare ${r.title} using your matched pantry ingredients first.`,
            "Cook gently until textures are tender and aromas combine.",
            "Serve mindfully, aligned with your dosha and season.",
          ],
          image: null,
        },
        "ayura-curated",
        i
      )
    );
  });

  return dedupeRecipes(out);
}

function scoreMatch(internalRecipe, pantrySet) {
  const ings = internalRecipe.ingredients;
  if (!ings.length) {
    return {
      matchedIngredients: [],
      missingIngredients: [],
      pantryMatchPercent: 0,
      matchedCount: 0,
      totalIngredients: 0,
      score: 0,
    };
  }
  const matchedIngredients = [];
  const missingIngredients = [];
  ings.forEach((ing) => {
    if (recipeIngredientInPantrySet(ing, pantrySet)) {
      matchedIngredients.push(ing);
    } else {
      missingIngredients.push(ing);
    }
  });
  const matchedCount = matchedIngredients.length;
  const totalIngredients = ings.length;
  const pantryMatchPercent = Math.round((matchedCount / totalIngredients) * 100);
  const score = matchedCount * 100 + pantryMatchPercent + (matchedCount > 0 ? 10 : 0);

  return {
    matchedIngredients,
    missingIngredients,
    pantryMatchPercent,
    matchedCount,
    totalIngredients,
    score,
  };
}

/**
 * Fetch external + curated recipes, score against pantry, return top 5.
 */
export async function fetchRecipesAndMatch(pantryItemsInput) {
  const pantryItems = Array.from(
    new Set(
      (pantryItemsInput || [])
        .map((s) => String(s).toLowerCase().trim())
        .filter(Boolean)
    )
  );

  const pantrySet = buildPantryMatchSet(pantryItems);
  const candidates = await fetchRecipeCandidates(pantryItems);
  console.info("[recipeService] pantry items:", pantryItems.length, "candidates:", candidates.length);

  const scored = candidates
    .map((recipe) => ({
      recipe,
      ...scoreMatch(recipe, pantrySet),
    }))
    .filter((row) => row.matchedCount > 0)
    .sort((a, b) => b.score - a.score);

  let ranked = scored;
  if (!ranked.length && candidates.length) {
    ranked = candidates
      .map((recipe) => ({
        recipe,
        ...scoreMatch(recipe, pantrySet),
      }))
      .sort((a, b) => b.pantryMatchPercent - a.pantryMatchPercent);
  }

  const top = ranked.slice(0, TOP_N);

  const recipes = top.map((row, idx) => {
    const id = String(row.recipe.id || slugId(`${row.recipe.source}-${row.recipe.title}-${idx}`));
    const instructions = row.recipe.instructions || [];
    const instructionsAvailable =
      row.recipe.instructionsAvailable && instructions.length > 0;

    return {
      id,
      title: row.recipe.title,
      image: row.recipe.image,
      pantryMatchPercent: row.pantryMatchPercent,
      matchedIngredients: row.matchedIngredients,
      missingIngredients: row.missingIngredients,
      score: row.score,
      source: row.recipe.source,
      instructionsAvailable,
      ingredients: row.recipe.ingredients,
      instructions,
      matchPercentage: row.pantryMatchPercent,
      matchedCount: row.matchedCount,
      totalIngredients: row.totalIngredients,
      recipe: row.recipe.raw,
    };
  });

  return {
    success: true,
    pantryItems,
    totalCandidates: candidates.length,
    recipes,
    totalRecipes: candidates.length,
    matchedCount: recipes.length,
  };
}

export function getRecipeSuggestions(matchedRecipes) {
  if (!matchedRecipes || matchedRecipes.length === 0) return [];
  return matchedRecipes.slice(0, 10);
}

export function calculateDifficulty(matchPercentage) {
  const pct = Number(matchPercentage) || 0;
  if (pct >= 90) return "Very Easy";
  if (pct >= 75) return "Easy";
  if (pct >= 60) return "Medium";
  if (pct >= 40) return "Challenging";
  return "Very Challenging";
}
