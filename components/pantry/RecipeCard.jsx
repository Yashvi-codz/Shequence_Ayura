'use client';

import Link from 'next/link';
import { calculateDifficulty } from '@/lib/recipeService';

function recipeHref(recipe) {
  const id = recipe?.id;
  if (id != null && String(id).length) {
    return `/app/recipes/${encodeURIComponent(String(id))}`;
  }
  return `/app/recipes/${encodeURIComponent(String(recipe?.title || 'recipe'))}`;
}

export default function RecipeCard({ recipe, rank, isExpanded, onToggle, onAddMissingToPantry }) {
  const matchPercentage =
    recipe.pantryMatchPercent ?? recipe.matchPercentage ?? 0;
  const difficulty = calculateDifficulty(matchPercentage);

  const matchColor =
    matchPercentage >= 80
      ? 'bg-green-100 border-green-500 text-green-700'
      : matchPercentage >= 60
        ? 'bg-blue-100 border-blue-500 text-blue-700'
        : matchPercentage >= 40
          ? 'bg-yellow-100 border-yellow-500 text-yellow-700'
          : 'bg-orange-100 border-orange-500 text-orange-700';

  const badgeColor =
    matchPercentage >= 80
      ? 'bg-green-500'
      : matchPercentage >= 60
        ? 'bg-blue-500'
        : matchPercentage >= 40
          ? 'bg-yellow-500'
          : 'bg-orange-500';

  const missing = recipe.missingIngredients || [];

  return (
    <div
      className={`card border-l-4 transition-all hover:shadow-xl ${matchColor}`}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
        className="cursor-pointer"
      >
        <div className="flex justify-between items-start mb-4 gap-3">
          <div className="flex-1 flex gap-3 min-w-0">
            {recipe.image && (
              <div className="shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-white hidden sm:block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={recipe.image} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {rank}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-dark-text capitalize break-words">
                    {recipe.title}
                  </h3>
                  <p className="text-xs text-gray-text">
                    Difficulty: {difficulty}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap mb-2">
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-white border border-current">
                  {recipe.matchedCount}/{recipe.totalIngredients} ingredients
                </span>
                <div className="w-40 h-2 bg-gray-300 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${badgeColor}`}
                    style={{ width: `${matchPercentage}%` }}
                  />
                </div>
                <span className="font-bold">{matchPercentage}%</span>
              </div>

              <div className="flex gap-4 text-xs text-gray-text">
                <span>✓ Have: {recipe.matchedCount}</span>
                <span>✗ Need: {missing.length}</span>
              </div>
            </div>
          </div>

          <div
            className={`text-2xl transform transition-transform ml-2 shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
            aria-hidden
          >
            ▼
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t-2 border-gray-300 pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                <span className="text-lg">✓</span> Have in Pantry ({recipe.matchedCount})
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {(recipe.matchedIngredients || []).map((ing, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <span className="text-green-600 font-bold">✓</span>
                    <span className="capitalize text-dark-text bg-green-50 px-2 py-1 rounded flex-1">
                      {ing}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                <span className="text-lg">✗</span> Need to Buy ({missing.length})
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {missing.map((ing, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <span className="text-red-600 font-bold">✗</span>
                    <span className="capitalize text-gray-text bg-red-50 px-2 py-1 rounded flex-1">
                      {ing}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 flex flex-wrap gap-2">
            <Link
              href={recipeHref(recipe)}
              className="flex-1 btn-primary py-2 text-center min-w-[140px]"
              onClick={(e) => e.stopPropagation()}
            >
              View Recipe
            </Link>
            <button
              type="button"
              className="flex-1 btn-secondary py-2 min-w-[140px]"
              onClick={(e) => {
                e.stopPropagation();
                onAddMissingToPantry?.(missing);
              }}
            >
              Add missing to pantry
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
