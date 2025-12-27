// utils/templateUtils.ts

import { TemplateItem } from "@/src/database/types";

/**
 * Calculate total macros from an array of template items
 */
export const calculateTemplateMacros = (items: TemplateItem[]) => {
  return items.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fat: acc.fat + item.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
};

/**
 * Calculate adjusted macros for a single item based on portion multiplier
 */
export const calculateAdjustedItemMacros = (
  item: TemplateItem,
  portionMultiplier: number
) => {
  return {
    calories: item.calories * portionMultiplier,
    protein: item.protein * portionMultiplier,
    carbs: item.carbs * portionMultiplier,
    fat: item.fat * portionMultiplier,
  };
};

/**
 * Calculate total adjusted macros from items with portion multipliers
 */
export const calculateAdjustedTemplateMacros = (
  items: TemplateItem[],
  portionMultipliers: number[]
) => {
  return items.reduce(
    (acc, item, index) => {
      const multiplier = portionMultipliers[index] || 1;
      return {
        calories: acc.calories + item.calories * multiplier,
        protein: acc.protein + item.protein * multiplier,
        carbs: acc.carbs + item.carbs * multiplier,
        fat: acc.fat + item.fat * multiplier,
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
};

/**
 * Round macros to appropriate precision
 */
export const roundMacros = (macros: {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}) => ({
  calories: Math.round(macros.calories),
  protein: Math.round(macros.protein * 10) / 10,
  carbs: Math.round(macros.carbs * 10) / 10,
  fat: Math.round(macros.fat * 10) / 10,
});

/**
 * Parse template items from JSON string
 */
export const parseTemplateItems = (itemsJson: string): TemplateItem[] => {
  try {
    return JSON.parse(itemsJson);
  } catch (error) {
    console.error("Failed to parse template items:", error);
    return [];
  }
};

/**
 * Validate template item data
 */
export const validateTemplateItem = (
  item: Partial<TemplateItem>
): string | null => {
  if (!item.name || item.name.trim() === "") {
    return "Item name is required";
  }
  if (!item.serving_size || item.serving_size <= 0) {
    return "Serving size must be greater than 0";
  }
  if (!item.serving_size_unit || item.serving_size_unit.trim() === "") {
    return "Serving size unit is required";
  }
  if (
    item.calories === undefined ||
    item.calories < 0 ||
    item.calories > 10000
  ) {
    return "Calories must be between 0-10000";
  }
  if (item.protein === undefined || item.protein < 0 || item.protein > 1000) {
    return "Protein must be between 0-1000g";
  }
  if (item.carbs === undefined || item.carbs < 0 || item.carbs > 1000) {
    return "Carbs must be between 0-1000g";
  }
  if (item.fat === undefined || item.fat < 0 || item.fat > 1000) {
    return "Fat must be between 0-1000g";
  }
  return null;
};
