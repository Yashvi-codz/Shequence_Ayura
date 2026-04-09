// app/api/meal-plan/route.js
import { NextResponse } from "next/server";
import { rankRecipes, generateWeeklyPlan, generateGroceryList } from "@/lib/mealPlanner";
import { getSeasonFromDate, RITUS } from "@/lib/ayurveda/ritus";

export async function POST(request) {
  try {
    const body = await request.json();
    const pantryItems = Array.isArray(body?.pantryItems) ? body.pantryItems : [];

    const dosha = body?.dosha || null;
    const season = body?.season || getSeasonFromDate(new Date());
    const healthGoals = Array.isArray(body?.healthGoals) ? body.healthGoals : [];
    const mood = body?.mood || null;

    const rankedRecipes = rankRecipes({
      pantryItems,
      dosha,
      season,
      healthGoals,
      mood,
      limit: 20,
    });

    const weeklyPlan = generateWeeklyPlan({ rankedRecipes });
    const groceryList = generateGroceryList({ weeklyPlan, pantryItems });

    return NextResponse.json(
      {
        season,
        ritu: RITUS[season] || null,
        rankedRecipes,
        weeklyPlan,
        groceryList,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Meal plan API error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate weekly meal plan" },
      { status: 500 }
    );
  }
}

