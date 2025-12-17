export type OnboardingData = {
  name: string;
  age: number;
  sex: "male" | "female";
  height: number;
  weight: number;
  goal: "lose" | "maintain" | "gain";
  activity_level: "sedentary" | "light" | "moderate" | "active" | "extra";
};

export type NutritionTargets = {
  daily_calorie_target: number;
  daily_protein_target: number;
  daily_carbs_target: number;
  daily_fat_target: number;
  maintaining_calorie: number;
  calorie_deficit: number;
};

export const stepFields: Record<number, (keyof OnboardingData)[]> = {
  1: ["name"],
  2: ["age", "sex"],
  3: ["height", "weight"],
  4: ["goal"],
  5: ["activity_level"],
};
