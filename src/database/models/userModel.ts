import { openDatabase } from "../db";
import { User, UserInsert } from "../types";

import { formatISO, isToday, isYesterday, parseISO } from "date-fns";

export const createUser = async (userData: UserInsert): Promise<User> => {
  const db = await openDatabase();

  const result = await db.runAsync(
    `INSERT INTO users (
    name, age, sex, height, weight, goal, activity_level,
    daily_calorie_target, daily_protein_target, daily_carbs_target, daily_fat_target,
    calorie_deficit, maintaining_calorie, onboarded, streak, longest_streak,
    exp
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userData.name,
      userData.age,
      userData.sex,
      userData.height,
      userData.weight,
      userData.goal,
      userData.activity_level,
      userData.daily_calorie_target,
      userData.daily_protein_target,
      userData.daily_carbs_target,
      userData.daily_fat_target,
      userData.calorie_deficit,
      userData.maintaining_calorie,
      userData.onboarded,
      userData.streak,
      userData.longest_streak,
      userData.exp,
      userData.last_logged_at || null,
      userData.earned_badges || null,
    ]
  );

  // Fetch the created user
  const user = await db.getFirstAsync<User>(
    "SELECT * FROM users WHERE id = ?",
    [result.lastInsertRowId]
  );

  if (!user) {
    throw new Error("Failed to create user");
  }

  return user;
};

/**
 * Get user by ID
 */
export const getUserById = async (userId: number): Promise<User | null> => {
  const db = await openDatabase();
  const user = await db.getFirstAsync<User | null>(
    "SELECT * FROM users WHERE id = ?",
    [userId]
  );
  return user;
};

/**
 * Get the first user (for single-user app)
 */
export const getCurrentUser = async (): Promise<User | null> => {
  const db = await openDatabase();
  const user = await db.getFirstAsync<User | null>(
    "SELECT * FROM users LIMIT 1"
  );
  return user;
};

/**
 * Update user information
 */
export const updateUser = async (
  userId: number,
  updates: Partial<UserInsert>
): Promise<void> => {
  const db = await openDatabase();

  // Build dynamic UPDATE query based on provided fields
  const fields = Object.keys(updates);
  const values = Object.values(updates);

  if (fields.length === 0) return;

  const setClause = fields.map((field) => `${field} = ?`).join(", ");

  await db.runAsync(`UPDATE users SET ${setClause} WHERE id = ?`, [
    ...values,
    userId,
  ]);
};

/**
 * Check if user has completed onboarding
 */
export const isOnboarded = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return user?.onboarded === 1;
};

/**
 * Mark user as onboarded
 */
export const setOnboarded = async (userId: number): Promise<void> => {
  await updateUser(userId, { onboarded: 1 });
};

/**
 * Update streak when user logs a meal
 * Call this once per meal log
 */
export const updateStreak = async (
  userId: number
): Promise<{
  streak: number;
  longestStreak: number;
  streakIncremented: boolean;
}> => {
  const user = await getCurrentUser();

  console.log("Fetched user:", user);

  if (!user) {
    throw new Error("User not found");
  }

  const now = new Date();
  let newStreak = user.streak || 0;
  let newLongestStreak = user.longest_streak || 0;
  let streakIncremented = false;

  console.log(
    "Current streak:",
    newStreak,
    "Longest streak:",
    newLongestStreak,
    "Last logged at:",
    user.last_logged_at
  );

  // First time logging a meal
  if (!user.last_logged_at) {
    console.log("No last_logged_at found — first time logging a meal");
    newStreak = 1;
    newLongestStreak = 1;
    streakIncremented = true;
  } else {
    const lastLogged = parseISO(user.last_logged_at);
    console.log("Parsed last_logged_at:", lastLogged);

    // Already logged today - don't increment
    if (isToday(lastLogged)) {
      console.log("Already logged today — streak will not increment");
      streakIncremented = false;
    }
    // Logged yesterday - increment streak
    else if (isYesterday(lastLogged)) {
      newStreak = (user.streak || 0) + 1;
      newLongestStreak = Math.max(newStreak, user.longest_streak || 0);
      streakIncremented = true;
      console.log("Logged yesterday — incrementing streak to:", newStreak);
    }
    // Missed a day - reset streak to 1
    else {
      newStreak = 1;
      streakIncremented = true;
      console.log("Missed a day — resetting streak to 1");
    }
  }

  // Save to database
  console.log("Updating user in DB with:", {
    streak: newStreak,
    longest_streak: newLongestStreak,
    last_logged_at: formatISO(now),
  });

  await updateUser(userId, {
    streak: newStreak,
    longest_streak: newLongestStreak,
    last_logged_at: formatISO(now),
  });

  console.log("Streak update complete. Result:", {
    streak: newStreak,
    longestStreak: newLongestStreak,
    streakIncremented,
  });

  return {
    streak: newStreak,
    longestStreak: newLongestStreak,
    streakIncremented,
  };
};

/**
 * Get current streak information
 */
export const getStreakInfo = async (): Promise<{
  currentStreak: number;
  longestStreak: number;
  lastLoggedAt: string | null;
  streakActive: boolean;
}> => {
  const user = await getCurrentUser();

  if (!user) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastLoggedAt: null,
      streakActive: false,
    };
  }

  let streakActive = false;

  // Check if streak is still active
  if (user.last_logged_at) {
    const lastLogged = parseISO(user.last_logged_at);
    // Streak is active if logged today or yesterday
    streakActive = isToday(lastLogged) || isYesterday(lastLogged);
  }

  return {
    currentStreak: user.streak || 0,
    longestStreak: user.longest_streak || 0,
    lastLoggedAt: user.last_logged_at,
    streakActive,
  };
};
