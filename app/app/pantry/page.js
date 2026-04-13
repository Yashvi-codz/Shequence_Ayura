'use client';

import { useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PantryItems from '@/components/pantry/PantryItems';
import SuggestedIngredients from '@/components/pantry/SuggestedIngredients';

export default function PantryPage() {
  const router = useRouter();
  const [pantryItems, setPantryItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [error, setError] = useState('');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const saved = localStorage.getItem('pantryItems');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const normalized = Array.from(
            new Set(
              parsed
                .map((s) => String(s).toLowerCase().trim())
                .filter(Boolean)
            )
          );
          setPantryItems(normalized);
        }
      }
    } catch {
      /* ignore bad JSON */
    }
    setHydrated(true);
  }, [router]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem('pantryItems', JSON.stringify(pantryItems));
    } catch {
      /* ignore */
    }
  }, [pantryItems, hydrated]);

  const onPantryUpdated = useCallback(() => {
    try {
      const saved = localStorage.getItem('pantryItems');
      if (!saved) return;
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        setPantryItems(
          Array.from(
            new Set(
              parsed
                .map((s) => String(s).toLowerCase().trim())
                .filter(Boolean)
            )
          )
        );
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    window.addEventListener('ayura-pantry-updated', onPantryUpdated);
    return () => window.removeEventListener('ayura-pantry-updated', onPantryUpdated);
  }, [onPantryUpdated]);

  const handleAddItem = (e) => {
    e.preventDefault();
    const trimmed = newItem.trim();
    if (!trimmed) {
      setError('Please enter an item');
      return;
    }

    const itemLower = trimmed.toLowerCase();
    if (pantryItems.includes(itemLower)) {
      setError('Item already in pantry');
      setNewItem('');
      return;
    }

    setPantryItems([...pantryItems, itemLower]);
    setNewItem('');
    setError('');
  };

  const handleRemoveItem = (itemToRemove) => {
    setPantryItems(pantryItems.filter((item) => item !== itemToRemove));
  };

  const handleAddSuggested = (ingredient) => {
    const n = String(ingredient).toLowerCase().trim();
    if (!n || pantryItems.includes(n)) return;
    setPantryItems([...pantryItems, n]);
  };

  const handleClearPantry = () => {
    if (confirm('Are you sure you want to clear all items?')) {
      setPantryItems([]);
      setError('');
    }
  };

  const goGenerateRecipes = () => {
    if (pantryItems.length === 0) {
      setError('Add at least one ingredient first');
      return;
    }
    setError('');
    router.push('/app/recipes');
  };

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream to-primary-light/30 flex items-center justify-center">
        <p className="text-gray-text">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-primary-light/30 pb-24">
      <div className="bg-white border-b-2 border-gray-200 py-6 px-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-dark-text">🥘 Store Room</h1>
              <p className="text-gray-text">Pantry inventory — powers recipes and your meal planner</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{pantryItems.length}</div>
              <p className="text-sm text-gray-text">Ingredients saved</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="card max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-dark-text mb-2">Add ingredients</h2>
          <p className="text-sm text-gray-text mb-6">
            Everything you save stays on this device and is shared with{' '}
            <Link href="/app/meals" className="text-primary font-semibold hover:underline">
              Meal planner
            </Link>{' '}
            and{' '}
            <Link href="/app/recipes" className="text-primary font-semibold hover:underline">
              Recipe matches
            </Link>
            .
          </p>

          <form onSubmit={handleAddItem} className="mb-6">
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="e.g. tomato, rice, moong dal"
                className="input-field flex-1"
                autoComplete="off"
              />
              <button type="submit" className="btn-primary px-4 whitespace-nowrap">
                Add
              </button>
            </div>
          </form>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4 text-sm">{error}</div>
          )}

          <PantryItems items={pantryItems} onRemove={handleRemoveItem} />

          <SuggestedIngredients
            onSelectIngredient={handleAddSuggested}
            pantryItems={pantryItems}
          />

          <div className="mt-8 space-y-3">
            <button
              type="button"
              onClick={goGenerateRecipes}
              disabled={pantryItems.length === 0}
              className={`w-full py-3 rounded-lg font-semibold transition-all ${
                pantryItems.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'btn-primary'
              }`}
            >
              Generate Recipes from My Pantry
            </button>
            <Link
              href="/app/recipes"
              className={`block w-full py-3 rounded-lg font-semibold text-center border-2 border-primary text-primary hover:bg-primary/5 ${
                pantryItems.length === 0 ? 'pointer-events-none opacity-50' : ''
              }`}
            >
              Open recipe matches
            </Link>
            {pantryItems.length > 0 && (
              <button type="button" onClick={handleClearPantry} className="w-full btn-secondary">
                Clear pantry
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 py-3 lg:hidden">
        <div className="max-w-6xl mx-auto px-4 flex justify-around">
          <a href="/app/dashboard" className="flex flex-col items-center text-gray-text hover:text-primary">
            <span className="text-2xl">🏠</span>
            <span className="text-xs font-semibold">Home</span>
          </a>
          <a href="/app/meals" className="flex flex-col items-center text-gray-text hover:text-primary">
            <span className="text-2xl">🍽️</span>
            <span className="text-xs font-semibold">Meals</span>
          </a>
          <a href="/app/pantry" className="flex flex-col items-center text-primary">
            <span className="text-2xl">🥘</span>
            <span className="text-xs font-semibold">Pantry</span>
          </a>
          <a href="/app/recipes" className="flex flex-col items-center text-gray-text hover:text-primary">
            <span className="text-2xl">📖</span>
            <span className="text-xs font-semibold">Recipes</span>
          </a>
          <a href="/app/food-checker" className="flex flex-col items-center text-gray-text hover:text-primary">
            <span className="text-2xl">🔍</span>
            <span className="text-xs font-semibold">Checker</span>
          </a>
          <a href="/app/profile" className="flex flex-col items-center text-gray-text hover:text-primary">
            <span className="text-2xl">👤</span>
            <span className="text-xs font-semibold">Profile</span>
          </a>
        </div>
      </div>
    </div>
  );
}
