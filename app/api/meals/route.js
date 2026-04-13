// app/api/meals/route.js
import { NextResponse } from 'next/server';
import { fetchRecipesAndMatch } from '@/lib/recipeService';

export async function POST(request) {
  try {
    const { pantryItems } = await request.json();

    if (!pantryItems || !Array.isArray(pantryItems) || pantryItems.length === 0) {
      return NextResponse.json(
        { error: 'Please provide pantry items' },
        { status: 400 }
      );
    }

    const results = await fetchRecipesAndMatch(pantryItems);

    const meals = (results.recipes || []).map((recipe) => ({
      id: recipe.id,
      name: recipe.title,
      doshaTag: (recipe.matchPercentage ?? recipe.pantryMatchPercent ?? 0) >= 80 ? 'highly_balancing' : 'neutral',
      pantryMatchPercent: recipe.matchPercentage ?? recipe.pantryMatchPercent ?? 0,
      missingIngredients: recipe.missingIngredients,
      cookTimeMinutes: recipe.recipe?.cookTimeMinutes ?? 30,
      macros: {
        calories: recipe.recipe?.calories ?? null,
        protein: recipe.recipe?.protein ?? null,
        carbs: recipe.recipe?.carbs ?? null,
      },
    }));

    return NextResponse.json({ meals }, { status: 200 });
  } catch (error) {
    console.error('Meals API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate meals' },
      { status: 500 }
    );
  }
}
