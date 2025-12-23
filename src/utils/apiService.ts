const BACKEND_URL =
  process.env.EXPO_PUBLIC_BACKEND_URL || "http://localhost:3000";

// Types (same as before)
export interface AIMealItem {
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface AIMealEstimate {
  description: string;
  items: AIMealItem[];
  total_calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: "low" | "medium" | "high";
  assumptions: string[];
}

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

/**
 * Estimate meal macros using AI
 */
export const estimateMealMacros = async (
  userInput: string
): Promise<AIMealEstimate> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/estimate-meal`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userInput }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    const data: AIMealEstimate = await response.json();
    return data;
  } catch (error) {
    console.error("Error estimating meal macros:", error);
    throw error;
  }
};

/**
 * Search for foods in USDA database
 */
export const searchFoods = async (
  query: string,
  pageSize: number = 10,
  pageNumber: number = 1
): Promise<USDASearchResponse> => {
  try {
    const url = `${BACKEND_URL}/api/search-foods?query=${encodeURIComponent(
      query
    )}&pageSize=${pageSize}&pageNumber=${pageNumber}`;
    console.log(BACKEND_URL);

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    const data: USDASearchResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error searching foods:", error);
    throw error;
  }
};

/**
 * Helper function to extract macros from USDA food data
 */
const NUTRIENT_IDS = {
  protein: 1003,
  fat: 1004,
  carbs: 1005,
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
