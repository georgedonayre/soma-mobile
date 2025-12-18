// utils/api.ts
const USDA_API_KEY = process.env.EXPO_PUBLIC_USDA_API_KEY || "DEMO_KEY";
const USDA_BASE_URL = "https://api.nal.usda.gov/fdc/v1";

export interface FoodSearchResult {
  fdcId: number;
  description: string;
  brandOwner?: string;
  foodNutrients: {
    nutrientId: number;
    nutrientName: string;
    nutrientNumber: string;
    value: number;
    unitName: string;
  }[];
  servingSize?: number;
  servingSizeUnit?: string;
}

export interface USDASearchResponse {
  foods: FoodSearchResult[];
  totalHits: number;
  currentPage: number;
  totalPages: number;
}

export const searchFoods = async (
  query: string,
  pageSize: number = 10,
  pageNumber: number = 1
): Promise<USDASearchResponse> => {
  try {
    const url = `${USDA_BASE_URL}/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(
      query
    )}&pageSize=${pageSize}&pageNumber=${pageNumber}&dataType=Foundation,Survey (FNDDS)`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`USDA API Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error searching foods:", error);
    throw error;
  }
};

const NUTRIENT_IDS = {
  protein: 1003,
  fat: 1004,
  carbs: 1005,

  // Energy priority
  energyPreferred: 2048,
  energyFallback: 1008,
};
const getNutrientById = (
  food: FoodSearchResult,
  nutrientId: number
): number => {
  return (
    food.foodNutrients.find((n) => n.nutrientId === nutrientId)?.value ?? 0
  );
};
export const getFoodMacros = (food: FoodSearchResult) => {
  const calories =
    getNutrientById(food, NUTRIENT_IDS.energyPreferred) ||
    getNutrientById(food, NUTRIENT_IDS.energyFallback);

  return {
    calories,
    protein: getNutrientById(food, NUTRIENT_IDS.protein),
    carbs: getNutrientById(food, NUTRIENT_IDS.carbs),
    fat: getNutrientById(food, NUTRIENT_IDS.fat),
  };
};
