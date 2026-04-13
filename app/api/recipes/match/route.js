import { NextResponse } from 'next/server';
import { fetchRecipesAndMatch } from '@/lib/recipeService';

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body', success: false }, { status: 400 });
    }

    const { pantryItems } = body || {};

    if (!pantryItems || !Array.isArray(pantryItems) || pantryItems.length === 0) {
      return NextResponse.json(
        { error: 'Please provide pantry items', success: false },
        { status: 400 }
      );
    }

    const results = await fetchRecipesAndMatch(pantryItems);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('Recipe matching API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to match recipes',
        pantryItems: [],
        totalCandidates: 0,
        recipes: [],
      },
      { status: 500 }
    );
  }
}
