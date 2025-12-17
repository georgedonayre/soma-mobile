import { openDatabase } from "../db";
import { WeightLog, WeightLogInsert } from "../types";

/**
 * Interface for weight progress data with calculated changes
 */
export interface WeightProgress {
  id: number;
  user_id: number;
  date: string;
  weight: number;
  notes: string | null;
  daily_change: number | null;
  total_change: number | null;
}

/**
 * Create a new weight log entry
 * Note: UNIQUE constraint on (user_id, date) prevents duplicate entries
 */
export const createWeightLog = async (
  logData: WeightLogInsert
): Promise<WeightLog> => {
  const db = await openDatabase();

  try {
    const result = await db.runAsync(
      `INSERT INTO weight_logs (user_id, date, weight, notes) 
       VALUES (?, ?, ?, ?)`,
      [logData.user_id, logData.date, logData.weight, logData.notes || null]
    );

    const log = await db.getFirstAsync<WeightLog>(
      "SELECT * FROM weight_logs WHERE id = ?",
      [result.lastInsertRowId]
    );

    if (!log) {
      throw new Error("Failed to create weight log");
    }

    return log;
  } catch (error: any) {
    // Check if it's a unique constraint violation
    if (error.message?.includes("UNIQUE constraint failed")) {
      throw new Error("Weight already logged for this date");
    }
    throw error;
  }
};

/**
 * Update weight log for a specific date
 */
export const updateWeightLog = async (
  userId: number,
  date: string,
  weight: number,
  notes?: string
): Promise<void> => {
  const db = await openDatabase();

  await db.runAsync(
    `UPDATE weight_logs 
     SET weight = ?, notes = ? 
     WHERE user_id = ? AND date = ?`,
    [weight, notes || null, userId, date]
  );
};

/**
 * Delete weight log
 */
export const deleteWeightLog = async (logId: number): Promise<void> => {
  const db = await openDatabase();
  await db.runAsync("DELETE FROM weight_logs WHERE id = ?", [logId]);
};

/**
 * Get weight log for a specific date
 */
export const getWeightLogByDate = async (
  userId: number,
  date: string
): Promise<WeightLog | null> => {
  const db = await openDatabase();

  const log = await db.getFirstAsync<WeightLog>(
    "SELECT * FROM weight_logs WHERE user_id = ? AND date = ?",
    [userId, date]
  );

  return log;
};

/**
 * Get all weight logs for a user (ordered by date descending)
 */
export const getAllWeightLogs = async (
  userId: number
): Promise<WeightLog[]> => {
  const db = await openDatabase();

  const logs = await db.getAllAsync<WeightLog>(
    "SELECT * FROM weight_logs WHERE user_id = ? ORDER BY date DESC",
    [userId]
  );

  return logs;
};

/**
 * Get weight logs for a date range
 */
export const getWeightLogsByDateRange = async (
  userId: number,
  startDate: string,
  endDate: string
): Promise<WeightLog[]> => {
  const db = await openDatabase();

  const logs = await db.getAllAsync<WeightLog>(
    `SELECT * FROM weight_logs 
     WHERE user_id = ? AND date BETWEEN ? AND ? 
     ORDER BY date DESC`,
    [userId, startDate, endDate]
  );

  return logs;
};

/**
 * Get weight progress with calculated changes
 * This calculates daily_change and total_change from the first entry
 */
export const getWeightProgress = async (
  userId: number
): Promise<WeightProgress[]> => {
  const db = await openDatabase();

  // Use window functions to calculate changes
  const progress = await db.getAllAsync<WeightProgress>(
    `SELECT 
      id,
      user_id,
      date,
      weight,
      notes,
      weight - LAG(weight) OVER (PARTITION BY user_id ORDER BY date) as daily_change,
      weight - FIRST_VALUE(weight) OVER (PARTITION BY user_id ORDER BY date) as total_change
     FROM weight_logs
     WHERE user_id = ?
     ORDER BY date DESC`,
    [userId]
  );

  return progress;
};

/**
 * Get latest weight log
 */
export const getLatestWeightLog = async (
  userId: number
): Promise<WeightLog | null> => {
  const db = await openDatabase();

  const log = await db.getFirstAsync<WeightLog>(
    `SELECT * FROM weight_logs 
     WHERE user_id = ? 
     ORDER BY date DESC 
     LIMIT 1`,
    [userId]
  );

  return log;
};

/**
 * Get weight statistics
 */
export const getWeightStats = async (
  userId: number
): Promise<{
  currentWeight: number | null;
  startWeight: number | null;
  lowestWeight: number | null;
  highestWeight: number | null;
  totalChange: number | null;
  averageWeight: number | null;
  totalEntries: number;
}> => {
  const db = await openDatabase();

  const stats = await db.getFirstAsync<{
    currentWeight: number | null;
    startWeight: number | null;
    lowestWeight: number | null;
    highestWeight: number | null;
    averageWeight: number | null;
    totalEntries: number;
  }>(
    `SELECT 
      (SELECT weight FROM weight_logs WHERE user_id = ? ORDER BY date DESC LIMIT 1) as currentWeight,
      (SELECT weight FROM weight_logs WHERE user_id = ? ORDER BY date ASC LIMIT 1) as startWeight,
      MIN(weight) as lowestWeight,
      MAX(weight) as highestWeight,
      AVG(weight) as averageWeight,
      COUNT(*) as totalEntries
     FROM weight_logs 
     WHERE user_id = ?`,
    [userId, userId, userId]
  );

  if (!stats) {
    return {
      currentWeight: null,
      startWeight: null,
      lowestWeight: null,
      highestWeight: null,
      totalChange: null,
      averageWeight: null,
      totalEntries: 0,
    };
  }

  const totalChange =
    stats.currentWeight && stats.startWeight
      ? stats.currentWeight - stats.startWeight
      : null;

  return {
    ...stats,
    totalChange,
  };
};

/**
 * Get weekly average weight for a date range
 */
export const getWeeklyAverages = async (
  userId: number,
  startDate: string,
  endDate: string
): Promise<{ week: string; averageWeight: number; entryCount: number }[]> => {
  const db = await openDatabase();

  // Group by week and calculate average
  const averages = await db.getAllAsync<{
    week: string;
    averageWeight: number;
    entryCount: number;
  }>(
    `SELECT 
      strftime('%Y-W%W', date) as week,
      AVG(weight) as averageWeight,
      COUNT(*) as entryCount
     FROM weight_logs 
     WHERE user_id = ? AND date BETWEEN ? AND ?
     GROUP BY week
     ORDER BY week DESC`,
    [userId, startDate, endDate]
  );

  return averages;
};

/**
 * Check if weight was logged today
 */
export const hasLoggedWeightToday = async (
  userId: number,
  date: string
): Promise<boolean> => {
  const db = await openDatabase();

  const result = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM weight_logs WHERE user_id = ? AND date = ?",
    [userId, date]
  );

  return (result?.count || 0) > 0;
};

/**
 * Get weight trend (last 7 days average vs previous 7 days)
 */
export const getWeightTrend = async (
  userId: number
): Promise<{
  recent7DayAvg: number | null;
  previous7DayAvg: number | null;
  trend: "up" | "down" | "stable" | null;
  difference: number | null;
}> => {
  const db = await openDatabase();

  // Get last 14 days of data
  const logs = await db.getAllAsync<WeightLog>(
    `SELECT * FROM weight_logs 
     WHERE user_id = ? 
     ORDER BY date DESC 
     LIMIT 14`,
    [userId]
  );

  if (logs.length < 7) {
    return {
      recent7DayAvg: null,
      previous7DayAvg: null,
      trend: null,
      difference: null,
    };
  }

  const recent7 = logs.slice(0, 7);
  const previous7 = logs.slice(7, 14);

  const recent7DayAvg =
    recent7.reduce((sum, log) => sum + log.weight, 0) / recent7.length;
  const previous7DayAvg =
    previous7.length > 0
      ? previous7.reduce((sum, log) => sum + log.weight, 0) / previous7.length
      : null;

  let trend: "up" | "down" | "stable" | null = null;
  let difference: number | null = null;

  if (previous7DayAvg !== null) {
    difference = recent7DayAvg - previous7DayAvg;
    if (Math.abs(difference) < 0.2) {
      trend = "stable";
    } else if (difference > 0) {
      trend = "up";
    } else {
      trend = "down";
    }
  }

  return {
    recent7DayAvg: Math.round(recent7DayAvg * 10) / 10,
    previous7DayAvg: previous7DayAvg
      ? Math.round(previous7DayAvg * 10) / 10
      : null,
    trend,
    difference: difference ? Math.round(difference * 10) / 10 : null,
  };
};
