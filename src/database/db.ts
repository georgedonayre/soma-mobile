import * as SQLite from "expo-sqlite";

// Database name - this will be stored in the device's filesystem
const DATABASE_NAME = "fitness_app.db";
let dbInstance: SQLite.SQLiteDatabase | null = null;

/**
 * Opens or creates the SQLite database
 */
export const openDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  try {
    if (!dbInstance) {
      dbInstance = await SQLite.openDatabaseAsync(DATABASE_NAME);
      console.log("✅ Database opened successfully");
    }
    return dbInstance;
  } catch (error) {
    console.error("❌ openDatabase: Failed:", error);
    throw error;
  }
};

/**
 * Initializes the database schema
 * This should be called when the app first launches
 */
export const initializeDatabase = async (): Promise<void> => {
  try {
    const db = await openDatabase();

    console.log("🔧 Initializing database schema...");

    // Execute each CREATE TABLE statement

    // Create users table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
        "name" TEXT NOT NULL,
        "age" INTEGER CHECK (age > 0 AND age < 150),
        "sex" TEXT CHECK (sex IN ('male', 'female')),
        "height" REAL CHECK (height > 0 AND height < 300),
        "weight" REAL CHECK (weight > 0 AND weight < 500),
        "goal" TEXT CHECK (goal IN ('lose', 'maintain', 'gain')),
        "activity_level" TEXT CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'extra')),
        "daily_calorie_target" INTEGER CHECK (daily_calorie_target > 0),
        "daily_protein_target" INTEGER CHECK (daily_protein_target >= 0),
        "daily_carbs_target" INTEGER CHECK (daily_carbs_target >= 0),
        "daily_fat_target" INTEGER CHECK (daily_fat_target >= 0),
        "calorie_deficit" INTEGER,
        "maintaining_calorie" INTEGER,
        "onboarded" INTEGER DEFAULT 0,
        "streak" INTEGER DEFAULT 0,
        "longest_streak" INTEGER DEFAULT 0,
        "last_logged_at" DATE,
        "earned_badges" TEXT,
        "exp" INTEGER DEFAULT 0,
        "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create body_goals table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS "body_goals" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
        "user_id" INTEGER NOT NULL,
        "goal_type" TEXT CHECK (goal_type IN ('cut', 'bulk', 'maintain', 'recomp')),
        "started_at" DATE NOT NULL,
        "start_weight" REAL NOT NULL CHECK (start_weight > 0 AND start_weight < 500),
        "target_weight" REAL NOT NULL CHECK (target_weight > 0 AND target_weight < 500),
        "duration_days" INTEGER CHECK (duration_days > 0),
        "milestones" TEXT,
        "is_active" INTEGER DEFAULT 1,
        "completed_at" DATE,
        "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CHECK (started_at <= CURRENT_DATE)
      );
    `);

    // Create barcode_foods table
    await db.execAsync(`
  CREATE TABLE IF NOT EXISTS "barcode_foods" (
    "barcode" TEXT PRIMARY KEY,
    "product_name" TEXT NOT NULL,
    "serving_size" REAL NOT NULL CHECK (serving_size > 0),
    "serving_unit" TEXT NOT NULL,
    "calories" REAL NOT NULL CHECK (calories >= 0),
    "protein" REAL NOT NULL CHECK (protein >= 0),
    "carbs" REAL NOT NULL CHECK (carbs >= 0),
    "fat" REAL NOT NULL CHECK (fat >= 0),
    "created_at" TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

    console.log("✅ barcode_foods table created");

    // Create weight_logs table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS "weight_logs" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
        "user_id" INTEGER NOT NULL,
        "date" DATE NOT NULL,
        "weight" REAL NOT NULL CHECK (weight > 0 AND weight < 500),
        "notes" TEXT,
        "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
        UNIQUE(user_id, date),
        CHECK (date <= CURRENT_DATE)
      );
    `);

    // Create meal_templates table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS "meal_templates" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
        "user_id" INTEGER NOT NULL,
        "name" TEXT NOT NULL,
        "calories" INTEGER NOT NULL CHECK (calories >= 0 AND calories <= 10000),
        "protein" INTEGER NOT NULL CHECK (protein >= 0 AND protein <= 1000),
        "carbs" INTEGER NOT NULL CHECK (carbs >= 0 AND carbs <= 1000),
        "fat" INTEGER NOT NULL CHECK (fat >= 0 AND fat <= 1000),
        "is_favorite" INTEGER DEFAULT 0,
        "use_count" INTEGER DEFAULT 0,
        "last_used_at" DATETIME,
        "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      );
    `);

    // Create meals table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS "meals" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
        "user_id" INTEGER NOT NULL,
        "description" TEXT NOT NULL,
        "total_calories" INTEGER NOT NULL CHECK (total_calories >= 0 AND total_calories <= 10000),
        "protein" INTEGER NOT NULL CHECK (protein >= 0 AND protein <= 1000),
        "carbs" INTEGER NOT NULL CHECK (carbs >= 0 AND carbs <= 1000),
        "fat" INTEGER NOT NULL CHECK (fat >= 0 AND fat <= 1000),
        "date" DATE NOT NULL,
        "template_id" INTEGER,
        "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
        FOREIGN KEY("template_id") REFERENCES "meal_templates"("id") ON DELETE SET NULL,
        CHECK (date <= CURRENT_DATE)
      );
    `);

    // Create indexes
    await db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_body_goals_user_active ON body_goals(user_id, is_active);
      CREATE INDEX IF NOT EXISTS idx_weight_logs_user_date ON weight_logs(user_id, date DESC);
      CREATE INDEX IF NOT EXISTS idx_meal_templates_user ON meal_templates(user_id);
      CREATE INDEX IF NOT EXISTS idx_meal_templates_favorite ON meal_templates(user_id, is_favorite);
      CREATE INDEX IF NOT EXISTS idx_meals_user_date ON meals(user_id, date DESC);
      CREATE INDEX IF NOT EXISTS idx_meals_template ON meals(template_id);
    `);

    // Create triggers
    await db.execAsync(`
      CREATE TRIGGER IF NOT EXISTS update_template_usage
      AFTER INSERT ON meals
      WHEN NEW.template_id IS NOT NULL
      BEGIN
        UPDATE meal_templates 
        SET 
          use_count = use_count + 1,
          last_used_at = CURRENT_TIMESTAMP
        WHERE id = NEW.template_id;
      END;
    `);

    await db.execAsync(`
      CREATE TRIGGER IF NOT EXISTS update_last_logged
      AFTER INSERT ON meals
      BEGIN
        UPDATE users 
        SET last_logged_at = NEW.date
        WHERE id = NEW.user_id 
          AND (last_logged_at IS NULL OR last_logged_at < NEW.date);
      END;
    `);

    console.log("✅ Database schema initialized successfully");
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    throw error;
  }
};

/**
 * WARNING: This deletes all data!
 */
export const dropAllTables = async (): Promise<void> => {
  try {
    const db = await openDatabase();

    console.log("⚠️  Dropping all tables...");

    await db.execAsync(`
      DROP TABLE IF EXISTS meals;
      DROP TABLE IF EXISTS meal_templates;
      DROP TABLE IF EXISTS weight_logs;
      DROP TABLE IF EXISTS body_goals;
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS app_settings;
    `);

    console.log("✅ All tables dropped");
  } catch (error) {
    console.error("❌ Error dropping tables:", error);
    throw error;
  }
};

/**
 * Resets the database - drops and recreates all tables
 */
export const resetDatabase = async (): Promise<void> => {
  await dropAllTables();
  await initializeDatabase();
};
