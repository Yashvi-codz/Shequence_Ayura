// lib/ayurveda/ritus.js

export const RITUS = {
  summer: {
    key: "summer",
    label: "Summer (Grishma) — Cooling",
    qualities: ["cooling", "hydrating", "light"],
    suggestedFoods: ["coconut", "buttermilk", "cucumber", "mint", "watermelon"],
    suggestedSpices: ["cumin", "coriander", "fennel"],
    avoid: ["very spicy", "deep fried", "excess sour"],
  },
  rainy: {
    key: "rainy",
    label: "Monsoon (Varsha) — Digestive support",
    qualities: ["light", "warming", "digestive"],
    suggestedFoods: ["khichdi", "soups", "steamed veggies"],
    suggestedSpices: ["ginger", "black pepper", "ajwain"],
    avoid: ["raw salads", "street food", "excess dairy"],
  },
  autumn: {
    key: "autumn",
    label: "Autumn (Sharad) — Cooling & calming",
    qualities: ["cooling", "bitter", "astringent"],
    suggestedFoods: ["gourd", "pomegranate", "rice", "moong dal"],
    suggestedSpices: ["coriander", "fennel"],
    avoid: ["excess oil", "very hot spices"],
  },
  winter: {
    key: "winter",
    label: "Winter (Hemant/Shishir) — Warming",
    qualities: ["warming", "grounding", "unctuous"],
    suggestedFoods: ["ghee", "millets", "soups", "sesame"],
    suggestedSpices: ["ginger", "cinnamon", "black pepper"],
    avoid: ["too cold", "ice creams", "excess raw"],
  },
  spring: {
    key: "spring",
    label: "Spring (Vasant) — Light & Kapha-balancing",
    qualities: ["light", "drying", "warming"],
    suggestedFoods: ["barley", "lentils", "leafy greens"],
    suggestedSpices: ["ginger", "turmeric", "black pepper"],
    avoid: ["heavy dairy", "too sweet", "oily foods"],
  },
};

export function getSeasonFromDate(date = new Date()) {
  const m = date.getMonth() + 1; // 1..12
  // Practical season mapping (approx). Users can override in UI.
  if (m >= 3 && m <= 4) return "spring";
  if (m >= 5 && m <= 6) return "summer";
  if (m >= 7 && m <= 9) return "rainy";
  if (m === 10 || m === 11) return "autumn";
  return "winter"; // Dec-Feb
}

