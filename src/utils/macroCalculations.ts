import { Meal } from "@/src/database/types";

export interface DailyTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MacroProgress {
  caloriesPercent: number;
  proteinPercent: number;
  carbsPercent: number;
  fatPercent: number;
}

export const calculateDailyTotals = (meals: Meal[]): DailyTotals => {
  return meals.reduce(
    (totals, meal) => ({
      calories: totals.calories + meal.total_calories,
      protein: totals.protein + meal.protein,
      carbs: totals.carbs + meal.carbs,
      fat: totals.fat + meal.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
};

export const calculateProgress = (
  totals: DailyTotals,
  calorieTarget: number,
  proteinTarget: number,
  carbsTarget: number,
  fatTarget: number
): MacroProgress => {
  return {
    caloriesPercent: Math.min((totals.calories / calorieTarget) * 100, 100),
    proteinPercent: Math.min((totals.protein / proteinTarget) * 100, 100),
    carbsPercent: Math.min((totals.carbs / carbsTarget) * 100, 100),
    fatPercent: Math.min((totals.fat / fatTarget) * 100, 100),
  };
};

export const getProgressStatus = (progress: MacroProgress): string => {
  const avgProgress = (progress.caloriesPercent + progress.proteinPercent) / 2;

  if (avgProgress < 25) return "Just Getting Started";
  if (avgProgress < 50) return "On Track";
  if (avgProgress < 75) return "Great Progress";
  if (avgProgress < 90) return "Almost There";
  return "Goal Reached!";
};
