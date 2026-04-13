import Link from "next/link";

function toDisplayName(raw = "") {
  return decodeURIComponent(String(raw))
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function slugify(raw = "") {
  return String(raw).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function imageFallbackFor(name) {
  const seed = encodeURIComponent(`${name}-ayura`);
  return `https://api.dicebear.com/9.x/shapes/svg?seed=${seed}&backgroundColor=c9ffbf,b6e3f4,ffdfbf,ffd5dc,d1d4f9`;
}

function buildMockRecipe(recipeName) {
  const lower = recipeName.toLowerCase();
  const base = {
    ingredients: [
      "2 tbsp ghee",
      "1 tsp cumin seeds",
      "1/2 tsp turmeric powder",
      "1 tsp grated ginger",
      "1/2 tsp rock salt",
      "1 tbsp fresh coriander",
    ],
    steps: [
      "Wash and prep all ingredients before starting; keep spices measured to avoid overcooking.",
      "Warm ghee on low-medium heat, then add cumin and ginger until aromatic (do not burn).",
      "Add main vegetables or grains and sauté for 2-3 minutes to coat with spices.",
      "Add water as needed, cover, and cook until soft and easy to digest.",
      "Finish with coriander and serve warm. Avoid eating directly from the fridge.",
    ],
    tags: ["Ayurvedic", "Home-style", "Balanced"],
  };

  if (lower.includes("dosa")) {
    return {
      ...base,
      ingredients: [
        "1 cup dosa batter",
        "1 tsp sesame oil",
        "2 medium potatoes (boiled, mashed)",
        "1/2 tsp mustard seeds",
        "6 curry leaves",
        "1/4 tsp turmeric",
        "1 small onion (optional, finely sliced)",
        "1 tsp salt",
      ],
      steps: [
        "Heat a tawa and spread a ladle of batter into a thin circle.",
        "Drizzle sesame oil around edges; cook on medium heat until crisp.",
        "For masala filling, temper mustard and curry leaves in a pan, then add onion and turmeric.",
        "Add mashed potatoes with salt and cook for 2-3 minutes until combined.",
        "Place filling in dosa, fold, and serve hot with chutney.",
      ],
      tags: ["South Indian", "Comfort Meal", "Vata-friendly (when warm)"],
    };
  }

  if (lower.includes("aloo")) {
    return {
      ...base,
      ingredients: [
        "3 medium potatoes, cubed",
        "1 tbsp ghee",
        "1/2 tsp cumin seeds",
        "1/4 tsp asafoetida (hing)",
        "1/2 tsp turmeric powder",
        "1 tsp coriander powder",
        "1/2 tsp salt",
        "1 tbsp chopped coriander",
      ],
      steps: [
        "Boil or steam potatoes until just tender, then cube evenly.",
        "Heat ghee, add cumin and hing; keep flame low to protect digestive qualities.",
        "Add turmeric and coriander powder, then toss in potato cubes gently.",
        "Cook 4-5 minutes until coated and lightly crisp on edges.",
        "Finish with coriander and serve warm with soft roti or rice.",
      ],
      tags: ["North Indian", "Simple Sabzi", "Grounding"],
    };
  }

  return {
    ...base,
    ingredients: [
      `1 cup main ingredient for ${recipeName}`,
      "1 tbsp ghee",
      "1 tsp cumin seeds",
      "1/2 tsp turmeric powder",
      "1 tsp grated ginger",
      "1/2 tsp salt",
      "2 cups water (adjust as needed)",
    ],
    tags: ["Indian", "Wholesome", "Beginner-friendly"],
  };
}

function buildAyurvedicNotes(recipeName) {
  const n = recipeName.toLowerCase();
  const isCooling = n.includes("raita") || n.includes("chaas") || n.includes("cucumber");
  const isHeavy = n.includes("fried") || n.includes("pakora") || n.includes("paratha");

  return {
    vata: [
      isCooling ? "Can aggravate Vata if served cold; prefer at room temperature." : "Generally balances Vata when served warm with ghee.",
      "Use ginger/cumin seasoning for better digestion.",
    ],
    pitta: [
      isCooling ? "Usually soothing for Pitta; keep spices mild." : "Can balance Pitta with moderate spice and less chili.",
      "Avoid very sour or overly salty adjustments.",
    ],
    kapha: [
      isHeavy ? "May aggravate Kapha if oily/heavy; keep portions moderate." : "Supports Kapha when lightly spiced and not too oily.",
      "Add black pepper or dry ginger to reduce heaviness.",
    ],
  };
}

function buildTips(recipeName) {
  return [
    "Wash produce well and use clean chopping boards for raw and cooked ingredients.",
    "Cook on medium heat to preserve flavor and prevent spice bitterness.",
    "Eat this recipe fresh and warm; avoid reheating multiple times.",
    `Best enjoyed for lunch when digestion is strongest, especially for ${recipeName}.`,
    "Avoid pairing with ice-cold drinks immediately after meals.",
  ];
}

async function fetchMealDbRecipe(recipeName) {
  try {
    const query = encodeURIComponent(recipeName);
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("Meal DB request failed");
    const data = await res.json();
    const meal = data?.meals?.[0];
    if (!meal) return null;

    const ingredients = [];
    for (let i = 1; i <= 20; i += 1) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (!ingredient || !ingredient.trim()) continue;
      ingredients.push(`${(measure || "").trim()} ${ingredient.trim()}`.trim());
    }

    const steps = String(meal.strInstructions || "")
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 8);

    return {
      title: toDisplayName(meal.strMeal || recipeName),
      image: meal.strMealThumb || null,
      ingredients,
      steps: steps.length ? steps : null,
      tags: [meal.strArea || "Indian", meal.strCategory || "Main Course"].filter(Boolean),
      source: "TheMealDB",
    };
  } catch {
    return null;
  }
}

async function fetchUnsplashLikeImage(recipeName) {
  try {
    const query = encodeURIComponent(`${recipeName} indian food`);
    const res = await fetch(`https://source.unsplash.com/1600x900/?${query}`, {
      redirect: "follow",
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.url || null;
  } catch {
    return null;
  }
}

async function getRecipeData(id) {
  const title = toDisplayName(id);
  const mealDb = await fetchMealDbRecipe(title);
  const mock = buildMockRecipe(title);
  const imageFromApi = mealDb?.image || (await fetchUnsplashLikeImage(title));

  return {
    id: slugify(id),
    title,
    image: imageFromApi || imageFallbackFor(title),
    ingredients: mealDb?.ingredients?.length ? mealDb.ingredients : mock.ingredients,
    steps: mealDb?.steps?.length ? mealDb.steps : mock.steps,
    tags: mealDb?.tags?.length ? mealDb.tags : mock.tags,
    source: mealDb?.source || "Ayura Fallback Generator",
    ayurvedic: buildAyurvedicNotes(title),
    tips: buildTips(title),
  };
}

function Card({ title, icon, children }) {
  return (
    <section className="rounded-2xl border border-emerald-100 bg-white/90 shadow-sm p-5 md:p-6">
      <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
        <span>{icon}</span>
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default async function RecipeDetailPage({ params }) {
  const id = params?.id ? decodeURIComponent(String(params.id)) : "";
  const recipe = await getRecipeData(id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50/60 to-sky-100/60 pb-20">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/app/recipes" className="btn-secondary px-4 py-2">
            ← Back to Recipes
          </Link>
          <button type="button" className="btn-primary px-4 py-2">
            Save Recipe
          </button>
        </div>

        <article className="space-y-6">
          <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={recipe.image} alt={recipe.title} className="w-full h-64 md:h-96 object-cover" />
            <div className="p-5 md:p-6 bg-gradient-to-r from-white via-emerald-50/40 to-sky-50/50">
              <p className="text-xs font-semibold text-slate-500">Source: {recipe.source}</p>
              <h1 className="mt-1 text-3xl md:text-4xl font-black text-slate-900">{recipe.title}</h1>
              <div className="mt-3 flex flex-wrap gap-2">
                {recipe.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full text-xs font-semibold border border-emerald-200 bg-emerald-100/60 text-emerald-800">
                    {tag}
                  </span>
                ))}
                <span className="px-3 py-1 rounded-full text-xs font-semibold border border-blue-200 bg-blue-100 text-blue-800">Vata-aware</span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold border border-amber-200 bg-amber-100 text-amber-800">Pitta-aware</span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold border border-cyan-200 bg-cyan-100 text-cyan-800">Kapha-aware</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Ingredients" icon="🧾">
              <ul className="space-y-2">
                {recipe.ingredients.map((item, idx) => (
                  <li key={`${idx}-${item}`} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                    {item}
                  </li>
                ))}
              </ul>
            </Card>

            <Card title="Step-by-step Instructions" icon="👩‍🍳">
              <ol className="space-y-3">
                {recipe.steps.map((step, idx) => (
                  <li key={`${idx}-${step}`} className="flex gap-3 text-sm text-slate-700">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </Card>
          </div>

          <Card title="Ayurvedic Benefits" icon="🌿">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-xl border border-rose-100 bg-rose-50 p-4">
                <h3 className="font-bold text-rose-800 mb-2">Vata</h3>
                <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                  {recipe.ayurvedic.vata.map((point) => <li key={point}>{point}</li>)}
                </ul>
              </div>
              <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                <h3 className="font-bold text-amber-800 mb-2">Pitta</h3>
                <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                  {recipe.ayurvedic.pitta.map((point) => <li key={point}>{point}</li>)}
                </ul>
              </div>
              <div className="rounded-xl border border-cyan-100 bg-cyan-50 p-4">
                <h3 className="font-bold text-cyan-800 mb-2">Kapha</h3>
                <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                  {recipe.ayurvedic.kapha.map((point) => <li key={point}>{point}</li>)}
                </ul>
              </div>
            </div>
          </Card>

          <Card title="Preparation Tips" icon="⚠️">
            <ul className="space-y-2">
              {recipe.tips.map((tip) => (
                <li key={tip} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  {tip}
                </li>
              ))}
            </ul>
          </Card>
        </article>
      </div>
    </div>
  );
}
