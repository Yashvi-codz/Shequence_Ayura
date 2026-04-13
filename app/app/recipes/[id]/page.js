'use client';

import { useEffect, useState, useMemo } from 'react';
import Cookies from 'js-cookie';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { AYURVEDIC_RECIPES } from '@/lib/ayurveda/recipes';
import {
  buildPantryMatchSet,
  recipeIngredientInPantrySet,
} from '@/lib/ingredientNormalizer';

const STORAGE_MATCH = 'ayuraRecipeMatchBundle';
const GROCERY_KEY = 'ayuraGroceryList';

function readPantry() {
  try {
    const raw = localStorage.getItem('pantryItems');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.map((s) => String(s).toLowerCase().trim()).filter(Boolean)
      : [];
  } catch {
    return [];
  }
}

function readBundle() {
  try {
    const raw = sessionStorage.getItem(STORAGE_MATCH);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || !Array.isArray(data.recipes)) return null;
    return data;
  } catch {
    return null;
  }
}

function formatDisplay(str) {
  if (!str) return '';
  return String(str)
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

export default function RecipeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const rawId = params?.id != null ? decodeURIComponent(String(params.id)) : '';

  const [pantryItems, setPantryItems] = useState([]);
  const [recipe, setRecipe] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }
    const pantry = readPantry();
    setPantryItems(pantry);
    const bundle = readBundle();
    const fromSession = bundle?.recipes?.find((r) => String(r.id) === String(rawId));
    if (fromSession) {
      setRecipe(fromSession);
      setHydrated(true);
      return;
    }
    const curated = AYURVEDIC_RECIPES.find((r) => r.id === rawId);
    if (curated) {
      const pantrySet = buildPantryMatchSet(pantry);
      const matched = [];
      const missing = [];
      curated.ingredients.forEach((ing) => {
        if (recipeIngredientInPantrySet(ing, pantrySet)) matched.push(ing);
        else missing.push(ing);
      });
      const total = curated.ingredients.length;
      const pct = total ? Math.round((matched.length / total) * 100) : 0;
      setRecipe({
        id: curated.id,
        title: curated.title,
        image: null,
        ingredients: curated.ingredients,
        instructions: [
          `Prepare ${curated.title} using fresh ingredients suited to your dosha.`,
          'Cook slowly until well combined; adjust spices to taste.',
          'Serve warm and eat mindfully.',
        ],
        instructionsAvailable: true,
        pantryMatchPercent: pct,
        matchedIngredients: matched,
        missingIngredients: missing,
        source: 'ayura-curated',
      });
    } else {
      setRecipe(null);
    }
    setHydrated(true);
  }, [router, rawId]);

  const pantrySet = useMemo(() => buildPantryMatchSet(pantryItems), [pantryItems]);

  const summary = useMemo(() => {
    if (!recipe?.ingredients) return null;
    const matched = [];
    const missing = [];
    recipe.ingredients.forEach((ing) => {
      if (recipeIngredientInPantrySet(ing, pantrySet)) matched.push(ing);
      else missing.push(ing);
    });
    const total = recipe.ingredients.length;
    const pct = total ? Math.round((matched.length / total) * 100) : 0;
    return { matched, missing, pct };
  }, [recipe, pantrySet]);

  function addMissingToPantry() {
    const miss = summary?.missing?.length ? summary.missing : recipe?.missingIngredients || [];
    if (!miss.length) return;
    const merged = Array.from(
      new Set([...pantryItems, ...miss.map((m) => String(m).toLowerCase().trim())])
    ).filter(Boolean);
    localStorage.setItem('pantryItems', JSON.stringify(merged));
    setPantryItems(merged);
  }

  function addMissingToGrocery() {
    const miss = summary?.missing?.length ? summary.missing : recipe?.missingIngredients || [];
    if (!miss.length) return;
    try {
      const raw = localStorage.getItem(GROCERY_KEY);
      const existing = raw ? JSON.parse(raw) : [];
      const list = Array.isArray(existing) ? existing : [];
      const merged = Array.from(new Set([...list, ...miss.map((m) => formatDisplay(m))])).filter(Boolean);
      localStorage.setItem(GROCERY_KEY, JSON.stringify(merged));
    } catch {
      localStorage.setItem(GROCERY_KEY, JSON.stringify(miss.map((m) => formatDisplay(m))));
    }
    alert('Missing items added to your grocery list.');
  }

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream to-primary-light/30 flex items-center justify-center">
        <p className="text-gray-text">Loading…</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream to-primary-light/30 pb-24">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="card text-center py-12">
            <p className="text-dark-text font-semibold mb-4">We could not load this recipe.</p>
            <p className="text-gray-text text-sm mb-6">
              Open matches from your pantry again, or pick a recipe from the list.
            </p>
            <Link href="/app/recipes" className="btn-primary px-6 py-3 inline-block">
              Back to recipe matches
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const instructions = Array.isArray(recipe.instructions) ? recipe.instructions : [];
  const hasInstructions =
    recipe.instructionsAvailable !== false && instructions.filter(Boolean).length > 0;
  const displayPct = summary?.pct ?? recipe.pantryMatchPercent ?? recipe.matchPercentage ?? 0;
  const matchedList = summary?.matched ?? recipe.matchedIngredients ?? [];
  const missingList = summary?.missing ?? recipe.missingIngredients ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-primary-light/30 pb-24">
      <div className="bg-white border-b border-gray-200 py-4 px-4">
        <div className="max-w-3xl mx-auto flex flex-wrap gap-3 items-center justify-between">
          <button type="button" onClick={() => router.back()} className="btn-secondary px-4 py-2">
            ← Back
          </button>
          <Link href="/app/recipes" className="text-primary font-semibold text-sm hover:underline">
            All matches
          </Link>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-black text-dark-text mb-2">{formatDisplay(recipe.title)}</h1>
        {recipe.source && (
          <p className="text-xs text-gray-text mb-4">
            Source: <span className="font-semibold">{recipe.source}</span>
          </p>
        )}

        {recipe.image && (
          <div className="mb-6 rounded-xl overflow-hidden border border-gray-200 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={recipe.image} alt="" className="w-full max-h-80 object-cover" />
          </div>
        )}

        <div className="card mb-6">
          <h2 className="text-lg font-bold text-dark-text mb-2">Pantry match</h2>
          <p className="text-3xl font-black text-primary">{displayPct}%</p>
          <p className="text-sm text-gray-text mt-1">
            {matchedList.length} of {recipe.ingredients?.length || 0} ingredients from your Store Room
          </p>
        </div>

        <div className="card mb-6">
          <h2 className="text-lg font-bold text-dark-text mb-3">Ingredients</h2>
          <ul className="space-y-2">
            {(recipe.ingredients || []).map((ing, i) => {
              const have = recipeIngredientInPantrySet(ing, pantrySet);
              return (
                <li
                  key={`${i}-${ing}`}
                  className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${
                    have ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <span>{have ? '✓' : '·'}</span>
                  <span className="text-dark-text">{formatDisplay(ing)}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="card">
            <h3 className="font-bold text-green-800 mb-2">In your pantry</h3>
            {matchedList.length ? (
              <ul className="text-sm space-y-1 text-dark-text">
                {matchedList.map((m) => (
                  <li key={m}>✓ {formatDisplay(m)}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-text">No direct matches yet — add items from the list below.</p>
            )}
          </div>
          <div className="card">
            <h3 className="font-bold text-amber-900 mb-2">Missing</h3>
            {missingList.length ? (
              <ul className="text-sm space-y-1 text-dark-text">
                {missingList.map((m) => (
                  <li key={m}>· {formatDisplay(m)}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-text">You have everything listed.</p>
            )}
          </div>
        </div>

        <div className="card mb-6">
          <h2 className="text-lg font-bold text-dark-text mb-3">Instructions</h2>
          {hasInstructions ? (
            <ol className="list-decimal list-inside space-y-3 text-dark-text text-sm leading-relaxed">
              {instructions.map((step, i) => (
                <li key={i} className="pl-1">
                  {step}
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-gray-text text-sm">
              Step-by-step instructions are not available for this recipe from the data source. Use the
              ingredient list above, cook mindfully, and adjust spices for your dosha. You can also open a
              curated Ayura recipe from the meal planner for fuller guidance.
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn-primary px-5 py-2" onClick={addMissingToPantry}>
            Add missing to pantry
          </button>
          <button type="button" className="btn-secondary px-5 py-2" onClick={addMissingToGrocery}>
            Add missing to grocery list
          </button>
        </div>
      </article>
    </div>
  );
}
