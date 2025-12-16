import { openDatabase } from "../db";
import { User, UserInsert } from "../types";

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
  updates: Partial<User>
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
