// Define TypeScript interfaces matching your database tables

export interface User {
  id: number;
  name: string;
  age: number | null;
  sex: "male" | "female" | null;
  height: number | null;
  weight: number | null;
  goal: "lose" | "maintain" | "gain" | null;
  activity_level:
    | "sedentary"
    | "light"
    | "moderate"
    | "active"
    | "extra"
    | null;
  daily_calorie_target: number | null;
  daily_protein_target: number | null;
  daily_carbs_target: number | null;
  daily_fat_target: number | null;
  calorie_deficit: number | null;
  maintaining_calorie: number | null;
  onboarded: number;
  streak: number;
  longest_streak: number;
  last_logged_at: string | null;
  earned_badges: string | null;
  exp: number;
  created_at: string;
}

export interface BodyGoal {
  id: number;
  user_id: number;
  goal_type: "cut" | "bulk" | "maintain" | "recomp" | null;
  started_at: string;
  start_weight: number;
  target_weight: number;
  duration_days: number | null;
  milestones: string | null;
  is_active: number;
  completed_at: string | null;
  created_at: string;
}

export interface WeightLog {
  id: number;
  user_id: number;
  date: string;
  weight: number;
  notes: string | null;
  created_at: string;
}

export interface MealTemplate {
  id: number;
  user_id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving_size: number;
  serving_size_unit: string;
  is_favorite: number;
  use_count: number;
  last_used_at: string | null;
  created_at: string;
}

export interface Meal {
  id: number;
  user_id: number;
  description: string;
  total_calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string;
  template_id: number | null;
  created_at: string;
}

// For inserting a new user (omit auto-generated fields)
export type UserInsert = Omit<User, "id" | "created_at">;

// For inserting a new meal
export type MealInsert = Omit<Meal, "id" | "created_at">;

// For inserting a weight log
export type WeightLogInsert = Omit<WeightLog, "id" | "created_at">;

// For inserting a body goal
export type BodyGoalInsert = Omit<BodyGoal, "id" | "created_at">;

// For inserting a meal template
export type MealTemplateInsert = Omit<MealTemplate, "id" | "created_at">;
