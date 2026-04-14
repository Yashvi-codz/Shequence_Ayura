'use client';

import { useEffect, useState, useCallback } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import RecipeResults from '@/components/pantry/RecipeResults';

const STORAGE_MATCH = 'ayuraRecipeMatchBundle';

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

export default function RecipesFromPantryPage() {
  const router = useRouter();
  const [pantryItems, setPantryItems] = useState([]);
  const [matchedRecipes, setMatchedRecipes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hydrated, setHydrated] = useState(false);

  const runMatch = useCallback(async (items) => {
    if (!items.length) {
      setMatchedRecipes(null);
      setLoading(false);
      setError('');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/recipes/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('token') || ''}`,
        },
        body: JSON.stringify({ pantryItems: items }),
      });
      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error('Invalid response from server');
      }
      if (!response.ok) {
        throw new Error(data?.error || 'Failed to fetch recipes');
      }
      const recipes = Array.isArray(data.recipes) ? data.recipes : [];
      setMatchedRecipes({
        success: data.success,
        recipes,
        totalCandidates: data.totalCandidates ?? data.totalRecipes ?? 0,
        totalRecipes: data.totalRecipes ?? data.totalCandidates ?? 0,
      });
      try {
        sessionStorage.setItem(
          STORAGE_MATCH,
          JSON.stringify({
            at: Date.now(),
            pantryItems: items,
            recipes,
          })
        );
      } catch {
        /* ignore quota */
      }
    } catch (err) {
      console.error(err);
      setError(err?.message || 'Something went wrong');
      setMatchedRecipes(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }
    const items = readPantry();
    setPantryItems(items);
    setHydrated(true);
    runMatch(items);
  }, [router, runMatch]);

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream to-primary-light/30 flex items-center justify-center">
        <p className="text-gray-text">Loading…</p>
      </div>
    );
  }

  return (

    <div className="min-h-full bg-gradient-to-br from-cream to-primary-light/30 pb-10">

      <div className="bg-white border-b-2 border-gray-200 py-6 px-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-dark-text">Recipes from your pantry</h1>
            <p className="text-gray-text text-sm mt-1">
              Using your saved Store Room ({pantryItems.length} items)
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/app/pantry" className="btn-secondary px-4 py-2">
              ← Edit pantry
            </Link>
            <button
              type="button"
              disabled={loading || pantryItems.length === 0}
              onClick={() => runMatch(pantryItems)}
              className="btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Refreshing…' : 'Refresh matches'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 text-red-800 px-4 py-3 rounded-lg mb-6 text-sm font-semibold">
            {error}
          </div>
        )}

        {loading && (
          <div className="card text-center py-16">
            <div className="text-4xl mb-4 animate-pulse">🍳</div>
            <p className="text-dark-text font-semibold">Finding your top matches…</p>
            <p className="text-gray-text text-sm mt-2">Scoring recipes against your pantry</p>
          </div>
        )}

        {!loading && pantryItems.length === 0 && (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-xl font-bold text-dark-text mb-2">Your pantry is empty</h2>
            <p className="text-gray-text mb-6">
              Add ingredients in your Store Room — we will rank recipes automatically.
            </p>
            <Link href="/app/pantry" className="btn-primary inline-block px-6 py-3">
              Go to pantry
            </Link>
          </div>
        )}

        {!loading && pantryItems.length > 0 && matchedRecipes && (
          <RecipeResults matchedRecipes={matchedRecipes.recipes} pantryItems={pantryItems} />
        )}
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 py-3 lg:hidden">
        <div className="max-w-6xl mx-auto px-4 flex justify-around">
          <Link href="/app/dashboard" className="flex flex-col items-center text-gray-text hover:text-primary">
            <span className="text-2xl">🏠</span>
            <span className="text-xs font-semibold">Home</span>
          </Link>
          <Link href="/app/meals" className="flex flex-col items-center text-gray-text hover:text-primary">
            <span className="text-2xl">🍽️</span>
            <span className="text-xs font-semibold">Meals</span>
          </Link>
          <Link href="/app/pantry" className="flex flex-col items-center text-gray-text hover:text-primary">
            <span className="text-2xl">🥘</span>
            <span className="text-xs font-semibold">Pantry</span>
          </Link>
          <Link href="/app/recipes" className="flex flex-col items-center text-primary">
            <span className="text-2xl">📖</span>
            <span className="text-xs font-semibold">Recipes</span>
          </Link>
          <Link href="/app/profile" className="flex flex-col items-center text-gray-text hover:text-primary">
            <span className="text-2xl">👤</span>
            <span className="text-xs font-semibold">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
