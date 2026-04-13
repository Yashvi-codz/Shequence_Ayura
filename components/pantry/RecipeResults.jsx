'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import RecipeCard from './RecipeCard';

export default function RecipeResults({ matchedRecipes, pantryItems }) {
  const [expandedRecipe, setExpandedRecipe] = useState(null);

  const addMissingToPantry = useCallback(
    (missing) => {
      if (!missing?.length) return;
      try {
        const raw = localStorage.getItem('pantryItems');
        const prev = raw ? JSON.parse(raw) : [];
        const base = Array.isArray(prev) ? prev : [];
        const merged = Array.from(
          new Set([
            ...base.map((s) => String(s).toLowerCase().trim()),
            ...missing.map((s) => String(s).toLowerCase().trim()),
          ])
        ).filter(Boolean);
        localStorage.setItem('pantryItems', JSON.stringify(merged));
        window.dispatchEvent(new Event('ayura-pantry-updated'));
      } catch {
        /* ignore */
      }
    },
    []
  );

  if (!matchedRecipes || matchedRecipes.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-6xl mb-4">😕</div>
        <h3 className="text-xl font-semibold text-dark-text mb-2">
          No matching recipes yet
        </h3>
        <p className="text-gray-text mb-6 max-w-md mx-auto">
          Try adding a few more staples (rice, oil, salt, onion, spices) or open your pantry to refine
          your Store Room — we will search again.
        </p>
        <Link href="/app/pantry" className="btn-primary inline-block px-6 py-3">
          ← Back to pantry
        </Link>
      </div>
    );
  }

  const topFive = matchedRecipes.slice(0, 5);
  const topMatch =
    topFive[0]?.pantryMatchPercent ?? topFive[0]?.matchPercentage ?? 0;
  const avgMatch = Math.round(
    topFive.reduce(
      (sum, r) => sum + (r.pantryMatchPercent ?? r.matchPercentage ?? 0),
      0
    ) / topFive.length
  );

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-dark-text mb-2">
          Top Matches from Your Pantry
        </h2>
        <p className="text-gray-text mb-4">
          Up to five recipes ranked by how well they fit what you have at home
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-primary/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-primary">
              {topFive.length}
            </div>
            <p className="text-xs text-gray-text">Top picks</p>
          </div>
          <div className="bg-green-100 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600">
              {topMatch}%
            </div>
            <p className="text-xs text-gray-text">Best match</p>
          </div>
          <div className="bg-blue-100 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {avgMatch}%
            </div>
            <p className="text-xs text-gray-text">Avg match</p>
          </div>
          <div className="bg-purple-100 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {pantryItems.length}
            </div>
            <p className="text-xs text-gray-text">Pantry items</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {topFive.map((recipe, index) => (
          <RecipeCard
            key={recipe.id || `${recipe.title}-${index}`}
            recipe={recipe}
            rank={index + 1}
            isExpanded={expandedRecipe === index}
            onToggle={() =>
              setExpandedRecipe(expandedRecipe === index ? null : index)
            }
            onAddMissingToPantry={addMissingToPantry}
          />
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
        <p className="font-semibold mb-2">Tips</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>Recipes near 60% or higher are usually easy to shop for</li>
          <li>Expand a card for ingredients, then open View Recipe for full steps</li>
          <li>Your pantry is saved on this device — meals and planner use the same list</li>
        </ul>
      </div>
    </div>
  );
}
