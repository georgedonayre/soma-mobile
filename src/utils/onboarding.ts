import { NutritionTargets, OnboardingData } from "../types/onboarding";

export const calculateTargets = (data: OnboardingData): NutritionTargets => {
  // BMR using Mifflin-St Jeor Equation
  let bmr;
  if (data.sex === "male") {
    bmr = 10 * data.weight + 6.25 * data.height - 5 * data.age + 5;
  } else {
    bmr = 10 * data.weight + 6.25 * data.height - 5 * data.age - 161;
  }

  // Activity multipliers
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    extra: 1.9,
  };

  // TDEE (Total Daily Energy Expenditure)
  const tdee = bmr * activityMultipliers[data.activity_level];
  const maintenanceCalories = Math.round(tdee);

  // Adjust for goal
  let targetCalories;
  let deficit = 0;

  if (data.goal === "lose") {
    deficit = 500; // 500 cal deficit
    targetCalories = maintenanceCalories - deficit;
  } else if (data.goal === "gain") {
    deficit = -300; // 300 cal surplus
    targetCalories = maintenanceCalories + 300;
  } else {
    targetCalories = maintenanceCalories;
  }

  // Macros
  const proteinGrams = Math.round(data.weight * 2);
  const fatGrams = Math.round((targetCalories * 0.25) / 9);
  const carbGrams = Math.round(
    (targetCalories - proteinGrams * 4 - fatGrams * 9) / 4
  );

  return {
    daily_calorie_target: targetCalories,
    daily_protein_target: proteinGrams,
    daily_carbs_target: carbGrams,
    daily_fat_target: fatGrams,
    maintaining_calorie: maintenanceCalories,
    calorie_deficit: deficit,
  };
};
