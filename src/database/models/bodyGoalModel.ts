// src/database/models/bodyGoalModel.ts
import { openDatabase } from "../db";
import { BodyGoal, BodyGoalInsert } from "../types";

/**
 * Interface for goal progress with current stats
 */
export interface GoalProgress {
  goal: BodyGoal;
  currentWeight: number | null;
  weightChange: number | null;
  percentComplete: number | null;
  daysElapsed: number;
  daysRemaining: number | null;
  isOnTrack: boolean | null;
}

/**
 * Create a new body goal
 * Automatically deactivates any existing active goals
 */
export const createBodyGoal = async (
  goalData: BodyGoalInsert
): Promise<BodyGoal> => {
  const db = await openDatabase();

  // Deactivate all existing active goals for this user
  await db.runAsync(
    "UPDATE body_goals SET is_active = 0 WHERE user_id = ? AND is_active = 1",
    [goalData.user_id]
  );

  // Create new goal
  const result = await db.runAsync(
    `INSERT INTO body_goals (
      user_id, goal_type, started_at, start_weight, target_weight, 
      duration_days, milestones, is_active, completed_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      goalData.user_id,
      goalData.goal_type,
      goalData.started_at,
      goalData.start_weight,
      goalData.target_weight,
      goalData.duration_days || null,
      goalData.milestones || null,
      goalData.is_active ?? 1,
      goalData.completed_at || null,
    ]
  );

  const goal = await db.getFirstAsync<BodyGoal>(
    "SELECT * FROM body_goals WHERE id = ?",
    [result.lastInsertRowId]
  );

  if (!goal) {
    throw new Error("Failed to create body goal");
  }

  return goal;
};

/**
 * Get active goal for a user
 */
export const getActiveGoal = async (
  userId: number
): Promise<BodyGoal | null> => {
  const db = await openDatabase();

  const goal = await db.getFirstAsync<BodyGoal>(
    "SELECT * FROM body_goals WHERE user_id = ? AND is_active = 1",
    [userId]
  );

  return goal;
};

/**
 * Get all goals for a user (including inactive/completed)
 */
export const getAllGoals = async (userId: number): Promise<BodyGoal[]> => {
  const db = await openDatabase();

  const goals = await db.getAllAsync<BodyGoal>(
    "SELECT * FROM body_goals WHERE user_id = ? ORDER BY started_at DESC",
    [userId]
  );

  return goals;
};

/**
 * Get goal by ID
 */
export const getGoalById = async (goalId: number): Promise<BodyGoal | null> => {
  const db = await openDatabase();

  const goal = await db.getFirstAsync<BodyGoal>(
    "SELECT * FROM body_goals WHERE id = ?",
    [goalId]
  );

  return goal;
};

/**
 * Update a goal
 */
export const updateGoal = async (
  goalId: number,
  updates: Partial<BodyGoalInsert>
): Promise<void> => {
  const db = await openDatabase();

  const fields = Object.keys(updates);
  const values = Object.values(updates);

  if (fields.length === 0) return;

  const setClause = fields.map((field) => `${field} = ?`).join(", ");

  await db.runAsync(`UPDATE body_goals SET ${setClause} WHERE id = ?`, [
    ...values,
    goalId,
  ]);
};

/**
 * Deactivate a goal
 */
export const deactivateGoal = async (goalId: number): Promise<void> => {
  const db = await openDatabase();

  await db.runAsync("UPDATE body_goals SET is_active = 0 WHERE id = ?", [
    goalId,
  ]);
};

/**
 * Mark goal as completed
 */
export const completeGoal = async (
  goalId: number,
  completedAt: string
): Promise<void> => {
  const db = await openDatabase();

  await db.runAsync(
    "UPDATE body_goals SET is_active = 0, completed_at = ? WHERE id = ?",
    [completedAt, goalId]
  );
};

/**
 * Delete a goal
 */
export const deleteGoal = async (goalId: number): Promise<void> => {
  const db = await openDatabase();
  await db.runAsync("DELETE FROM body_goals WHERE id = ?", [goalId]);
};

/**
 * Get goal progress with current weight and calculated statistics
 */
export const getGoalProgress = async (
  goalId: number
): Promise<GoalProgress | null> => {
  const db = await openDatabase();

  // Get the goal
  const goal = await db.getFirstAsync<BodyGoal>(
    "SELECT * FROM body_goals WHERE id = ?",
    [goalId]
  );

  if (!goal) return null;

  // Get latest weight log for this user
  const latestWeight = await db.getFirstAsync<{ weight: number }>(
    "SELECT weight FROM weight_logs WHERE user_id = ? ORDER BY date DESC LIMIT 1",
    [goal.user_id]
  );

  const currentWeight = latestWeight?.weight || null;

  // Calculate progress
  let weightChange: number | null = null;
  let percentComplete: number | null = null;
  let isOnTrack: boolean | null = null;

  if (currentWeight !== null) {
    weightChange = currentWeight - goal.start_weight;
    const targetChange = goal.target_weight - goal.start_weight;

    if (targetChange !== 0) {
      percentComplete = Math.round((weightChange / targetChange) * 100);
    }
  }

  // Calculate days elapsed
  const startDate = new Date(goal.started_at);
  const today = new Date();
  const daysElapsed = Math.floor(
    (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Calculate days remaining
  let daysRemaining: number | null = null;
  if (goal.duration_days) {
    daysRemaining = goal.duration_days - daysElapsed;

    // Determine if on track (optional logic)
    if (percentComplete !== null && daysRemaining > 0) {
      const expectedProgress = (daysElapsed / goal.duration_days) * 100;
      // Consider on track if within 10% of expected progress
      isOnTrack = Math.abs(percentComplete - expectedProgress) <= 10;
    }
  }

  return {
    goal,
    currentWeight,
    weightChange,
    percentComplete,
    daysElapsed,
    daysRemaining,
    isOnTrack,
  };
};

/**
 * Get goal statistics
 */
export const getGoalStats = async (
  userId: number
): Promise<{
  totalGoals: number;
  completedGoals: number;
  activeGoal: BodyGoal | null;
  lastCompletedGoal: BodyGoal | null;
}> => {
  const db = await openDatabase();

  // Get counts
  const counts = await db.getFirstAsync<{
    totalGoals: number;
    completedGoals: number;
  }>(
    `SELECT 
      COUNT(*) as totalGoals,
      SUM(CASE WHEN completed_at IS NOT NULL THEN 1 ELSE 0 END) as completedGoals
     FROM body_goals 
     WHERE user_id = ?`,
    [userId]
  );

  // Get active goal
  const activeGoal = await getActiveGoal(userId);

  // Get last completed goal
  const lastCompleted = await db.getFirstAsync<BodyGoal>(
    `SELECT * FROM body_goals 
     WHERE user_id = ? AND completed_at IS NOT NULL 
     ORDER BY completed_at DESC 
     LIMIT 1`,
    [userId]
  );

  return {
    totalGoals: counts?.totalGoals || 0,
    completedGoals: counts?.completedGoals || 0,
    activeGoal,
    lastCompletedGoal: lastCompleted || null,
  };
};

/**
 * Calculate recommended daily calorie deficit/surplus based on goal
 */
export const calculateRecommendedCalories = (
  goal: BodyGoal,
  maintenanceCalories: number
): {
  dailyCalories: number;
  weeklyWeightChange: number;
  dailyDeficitSurplus: number;
} => {
  const weightDifference = goal.target_weight - goal.start_weight;
  const isDeficit = weightDifference < 0; // Cutting

  // Safe weight loss/gain rate: 0.5-1 kg per week (1-2 lbs)
  const daysToGoal = goal.duration_days || 90; // Default 90 days if not specified
  const weeksToGoal = daysToGoal / 7;
  const weeklyWeightChange = weightDifference / weeksToGoal;

  // 1 kg of body weight ≈ 7700 calories
  const caloriesPerKg = 7700;
  const weeklyCalorieChange = weeklyWeightChange * caloriesPerKg;
  const dailyDeficitSurplus = Math.round(weeklyCalorieChange / 7);

  const dailyCalories = maintenanceCalories + dailyDeficitSurplus;

  return {
    dailyCalories: Math.round(dailyCalories),
    weeklyWeightChange: Math.round(weeklyWeightChange * 10) / 10,
    dailyDeficitSurplus: Math.round(dailyDeficitSurplus),
  };
};

/**
 * Check if goal has been achieved
 */
export const checkGoalAchievement = async (
  goalId: number
): Promise<{
  achieved: boolean;
  message: string;
}> => {
  const progress = await getGoalProgress(goalId);

  if (!progress || !progress.currentWeight) {
    return {
      achieved: false,
      message: "Unable to determine progress - no weight data available",
    };
  }

  const { goal, currentWeight } = progress;
  const isCutting = goal.target_weight < goal.start_weight;

  // Check if target reached
  if (isCutting && currentWeight <= goal.target_weight) {
    return {
      achieved: true,
      message: `Congratulations! You've reached your target weight of ${goal.target_weight} kg!`,
    };
  } else if (!isCutting && currentWeight >= goal.target_weight) {
    return {
      achieved: true,
      message: `Congratulations! You've reached your target weight of ${goal.target_weight} kg!`,
    };
  }

  return {
    achieved: false,
    message: "Keep going! You're making progress towards your goal.",
  };
};
