// src/database/models/mealModel.ts
import { openDatabase } from "../db";
import { Meal, MealInsert } from "../types";

/**
 * Create a new meal entry
 * If template_id is provided, the trigger will automatically update template usage
 */
export const createMeal = async (mealData: MealInsert): Promise<Meal> => {
  const db = await openDatabase();

  const result = await db.runAsync(
    `INSERT INTO meals (
      user_id, description, total_calories, protein, carbs, fat, date, template_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      mealData.user_id,
      mealData.description,
      mealData.total_calories,
      mealData.protein,
      mealData.carbs,
      mealData.fat,
      mealData.date,
      mealData.template_id || null,
    ]
  );

  const meal = await db.getFirstAsync<Meal>(
    "SELECT * FROM meals WHERE id = ?",
    [result.lastInsertRowId]
  );

  if (!meal) {
    throw new Error("Failed to create meal");
  }

  return meal;
};

/**
 * Get all meals for a specific date
 */
export const getMealsByDate = async (
  userId: number,
  date: string
): Promise<Meal[]> => {
  const db = await openDatabase();

  const meals = await db.getAllAsync<Meal>(
    "SELECT * FROM meals WHERE user_id = ? AND date = ? ORDER BY created_at DESC",
    [userId, date]
  );

  return meals;
};

/**
 * Get meals for a date range
 */
export const getMealsByDateRange = async (
  userId: number,
  startDate: string,
  endDate: string
): Promise<Meal[]> => {
  const db = await openDatabase();

  const meals = await db.getAllAsync<Meal>(
    `SELECT * FROM meals 
     WHERE user_id = ? AND date BETWEEN ? AND ? 
     ORDER BY date DESC, created_at DESC`,
    [userId, startDate, endDate]
  );

  return meals;
};

/**
 * Get daily nutrition totals for a specific date
 */
export const getDailyNutritionTotals = async (
  userId: number,
  date: string
): Promise<{
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  mealCount: number;
}> => {
  const db = await openDatabase();

  const result = await db.getFirstAsync<{
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    mealCount: number;
  }>(
    `SELECT 
      COALESCE(SUM(total_calories), 0) as totalCalories,
      COALESCE(SUM(protein), 0) as totalProtein,
      COALESCE(SUM(carbs), 0) as totalCarbs,
      COALESCE(SUM(fat), 0) as totalFat,
      COUNT(*) as mealCount
     FROM meals 
     WHERE user_id = ? AND date = ?`,
    [userId, date]
  );

  return (
    result || {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      mealCount: 0,
    }
  );
};

/**
 * Update a meal
 */
export const updateMeal = async (
  mealId: number,
  updates: Partial<MealInsert>
): Promise<void> => {
  const db = await openDatabase();

  const fields = Object.keys(updates);
  const values = Object.values(updates);

  if (fields.length === 0) return;

  const setClause = fields.map((field) => `${field} = ?`).join(", ");

  await db.runAsync(`UPDATE meals SET ${setClause} WHERE id = ?`, [
    ...values,
    mealId,
  ]);
};

/**
 * Delete a meal
 */
export const deleteMeal = async (mealId: number): Promise<void> => {
  const db = await openDatabase();
  await db.runAsync("DELETE FROM meals WHERE id = ?", [mealId]);
};

/**
 * Get total meals logged by user (for stats)
 */
export const getTotalMealsLogged = async (userId: number): Promise<number> => {
  const db = await openDatabase();

  const result = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM meals WHERE user_id = ?",
    [userId]
  );

  return result?.count || 0;
};

/**
 * Get recent meals (useful for quick re-logging)
 */
export const getRecentMeals = async (
  userId: number,
  limit: number = 10
): Promise<Meal[]> => {
  const db = await openDatabase();

  const meals = await db.getAllAsync<Meal>(
    `SELECT * FROM meals 
     WHERE user_id = ? 
     ORDER BY created_at DESC 
     LIMIT ?`,
    [userId, limit]
  );

  return meals;
};

/**
 * Get weekly nutrition summary
 */
export const getWeeklyNutritionSummary = async (
  userId: number,
  startDate: string,
  endDate: string
): Promise<
  {
    date: string;
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    mealCount: number;
  }[]
> => {
  const db = await openDatabase();

  const summary = await db.getAllAsync<{
    date: string;
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    mealCount: number;
  }>(
    `SELECT 
      date,
      SUM(total_calories) as totalCalories,
      SUM(protein) as totalProtein,
      SUM(carbs) as totalCarbs,
      SUM(fat) as totalFat,
      COUNT(*) as mealCount
     FROM meals 
     WHERE user_id = ? AND date BETWEEN ? AND ?
     GROUP BY date
     ORDER BY date DESC`,
    [userId, startDate, endDate]
  );

  return summary;
};

/**
 * Check if user has logged any meals today
 */
export const hasLoggedToday = async (
  userId: number,
  date: string
): Promise<boolean> => {
  const db = await openDatabase();

  const result = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM meals WHERE user_id = ? AND date = ?",
    [userId, date]
  );

  return (result?.count || 0) > 0;
};
