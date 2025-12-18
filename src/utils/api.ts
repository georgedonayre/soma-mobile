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
    )}&pageSize=${pageSize}&pageNumber=${pageNumber}`;

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

// Helper to extract specific nutrient value
export const getNutrientValue = (
  food: FoodSearchResult,
  nutrientName: string
): number => {
  const nutrient = food.foodNutrients.find(
    (n) => n.nutrientName.toLowerCase() === nutrientName.toLowerCase()
  );
  return nutrient ? nutrient.value : 0;
};

// Helper to get common macros
export const getFoodMacros = (food: FoodSearchResult) => {
  return {
    calories: getNutrientValue(food, "Energy"),
    protein: getNutrientValue(food, "Protein"),
    carbs: getNutrientValue(food, "Carbohydrate, by difference"),
    fat: getNutrientValue(food, "Total lipid (fat)"),
  };
};
