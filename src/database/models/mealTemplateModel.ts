import { supabase } from "@/src/lib/supabase";
import { openDatabase } from "../db";
import { MealTemplate, MealTemplateInsert } from "../types";

/**
 * Create a new meal template
 */
export const createMealTemplate = async (
  templateData: MealTemplateInsert
): Promise<MealTemplate> => {
  console.log("🔵 createMealTemplate: Starting...", templateData);

  try {
    // --------------------
    // 1️⃣ Insert into Supabase
    // --------------------
    console.log("🔵 createMealTemplate: Inserting into Supabase...");

    const { data: supabaseData, error: supabaseError } = await supabase
      .from("meal_templates")
      .insert([
        {
          user_id: templateData.user_id,
          name: templateData.name,
          items: JSON.parse(templateData.items), // JSONB in Supabase
          calories: templateData.calories,
          protein: templateData.protein,
          carbs: templateData.carbs,
          fat: templateData.fat,
          serving_size: templateData.serving_size,
          serving_size_unit: templateData.serving_size_unit,
          is_favorite: Boolean(templateData.is_favorite),
          use_count: templateData.use_count ?? 0,
          last_used_at: templateData.last_used_at ?? null,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (supabaseError) {
      console.error("❌ createMealTemplate: Supabase error:", supabaseError);
      throw supabaseError;
    }

    console.log(
      "✅ createMealTemplate: Supabase insert successful",
      supabaseData
    );

    // --------------------
    // 2️⃣ Insert into local SQLite
    // --------------------
    console.log("🔵 createMealTemplate: Opening local database...");
    const db = await openDatabase();
    console.log("✅ createMealTemplate: Local database opened");

    await db.runAsync(
      `INSERT INTO meal_templates (
        id, user_id, name, items, calories, protein, carbs, fat,
        serving_size, serving_size_unit, is_favorite, use_count, last_used_at, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        supabaseData.id, // IMPORTANT: keep IDs in sync
        templateData.user_id,
        templateData.name,
        templateData.items, // stored as string in SQLite
        templateData.calories,
        templateData.protein,
        templateData.carbs,
        templateData.fat,
        templateData.serving_size,
        templateData.serving_size_unit,
        templateData.is_favorite ? 1 : 0,
        templateData.use_count ?? 0,
        templateData.last_used_at ?? null,
        supabaseData.created_at,
      ]
    );

    console.log("✅ createMealTemplate: Local SQLite insert successful");

    // --------------------
    // 3️⃣ Fetch inserted row from SQLite
    // --------------------
    const template = await db.getFirstAsync<MealTemplate>(
      "SELECT * FROM meal_templates WHERE id = ?",
      [supabaseData.id]
    );

    if (!template) {
      throw new Error(
        "❌ createMealTemplate: Failed to retrieve newly inserted template"
      );
    }

    console.log("✅ createMealTemplate: Complete!", template);
    return template;
  } catch (error) {
    console.error("❌ createMealTemplate: Error occurred:", error);
    throw error;
  }
};

/**
 * Get all templates for a user
 */
export const getAllTemplates = async (
  userId: number
): Promise<MealTemplate[]> => {
  const db = await openDatabase();

  const templates = await db.getAllAsync<MealTemplate>(
    `SELECT * FROM meal_templates 
     WHERE user_id = ? 
     ORDER BY is_favorite DESC, use_count DESC, name ASC`,
    [userId]
  );

  return templates;
};

/**
 * Get favorite templates
 */
export const getFavoriteTemplates = async (
  userId: number
): Promise<MealTemplate[]> => {
  const db = await openDatabase();

  const templates = await db.getAllAsync<MealTemplate>(
    `SELECT * FROM meal_templates 
     WHERE user_id = ? AND is_favorite = 1 
     ORDER BY use_count DESC, name ASC`,
    [userId]
  );

  return templates;
};

/**
 * Get most used templates
 */
export const getMostUsedTemplates = async (
  userId: number,
  limit: number = 10
): Promise<MealTemplate[]> => {
  const db = await openDatabase();

  const templates = await db.getAllAsync<MealTemplate>(
    `SELECT * FROM meal_templates 
     WHERE user_id = ? AND use_count > 0
     ORDER BY use_count DESC, last_used_at DESC 
     LIMIT ?`,
    [userId, limit]
  );

  return templates;
};

/**
 * Search templates by name
 */
export const searchTemplates = async (
  userId: number,
  searchQuery: string
): Promise<MealTemplate[]> => {
  const db = await openDatabase();

  const templates = await db.getAllAsync<MealTemplate>(
    `SELECT * FROM meal_templates 
     WHERE user_id = ? AND name LIKE ? 
     ORDER BY is_favorite DESC, use_count DESC`,
    [userId, `%${searchQuery}%`]
  );

  return templates;
};

/**
 * Get template by ID
 */
export const getTemplateById = async (
  templateId: number
): Promise<MealTemplate | null> => {
  const db = await openDatabase();

  const template = await db.getFirstAsync<MealTemplate>(
    "SELECT * FROM meal_templates WHERE id = ?",
    [templateId]
  );

  return template;
};

/**
 * Update template
 */
export const updateTemplate = async (
  templateId: number,
  updates: Partial<MealTemplateInsert>
): Promise<void> => {
  const db = await openDatabase();

  const fields = Object.keys(updates);
  const values = Object.values(updates);

  if (fields.length === 0) return;

  const setClause = fields.map((field) => `${field} = ?`).join(", ");

  await db.runAsync(`UPDATE meal_templates SET ${setClause} WHERE id = ?`, [
    ...values,
    templateId,
  ]);
};

/**
 * Toggle favorite status
 */
export const toggleFavorite = async (templateId: number): Promise<void> => {
  const db = await openDatabase();

  await db.runAsync(
    `UPDATE meal_templates 
     SET is_favorite = CASE WHEN is_favorite = 1 THEN 0 ELSE 1 END 
     WHERE id = ?`,
    [templateId]
  );
};

/**
 * Delete template
 */
export const deleteTemplate = async (templateId: number): Promise<void> => {
  const db = await openDatabase();

  // This will set template_id to NULL in meals table (ON DELETE SET NULL)
  await db.runAsync("DELETE FROM meal_templates WHERE id = ?", [templateId]);
};

/**
 * Get template usage statistics
 */
export const getTemplateStats = async (
  userId: number
): Promise<{
  totalTemplates: number;
  totalFavorites: number;
  mostUsedTemplate: MealTemplate | null;
}> => {
  const db = await openDatabase();

  // Get counts
  const counts = await db.getFirstAsync<{
    totalTemplates: number;
    totalFavorites: number;
  }>(
    `SELECT 
      COUNT(*) as totalTemplates,
      SUM(CASE WHEN is_favorite = 1 THEN 1 ELSE 0 END) as totalFavorites
     FROM meal_templates 
     WHERE user_id = ?`,
    [userId]
  );

  // Get most used template
  const mostUsed = await db.getFirstAsync<MealTemplate>(
    `SELECT * FROM meal_templates 
     WHERE user_id = ? AND use_count > 0 
     ORDER BY use_count DESC 
     LIMIT 1`,
    [userId]
  );

  return {
    totalTemplates: counts?.totalTemplates || 0,
    totalFavorites: counts?.totalFavorites || 0,
    mostUsedTemplate: mostUsed || null,
  };
};

/**
 * Bulk create templates (useful for importing common foods)
 */
export const bulkCreateTemplates = async (
  templates: MealTemplateInsert[]
): Promise<void> => {
  const db = await openDatabase();

  // Use a transaction for better performance
  await db.withTransactionAsync(async () => {
    for (const template of templates) {
      await db.runAsync(
        `INSERT INTO meal_templates (
          user_id, name, calories, protein, carbs, fat, is_favorite, use_count
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          template.user_id,
          template.name,
          template.calories,
          template.protein,
          template.carbs,
          template.fat,
          template.is_favorite || 0,
          template.use_count || 0,
        ]
      );
    }
  });
};

/**
 * Sync templates from Supabase to local SQLite
 * Fetches all templates for a user from Supabase and populates local database
 */
export const syncTemplatesFromSupabase = async (
  userId: number
): Promise<{ synced: number; error?: string }> => {
  console.log("🔹 syncTemplatesFromSupabase: Starting for user", userId);

  try {
    const db = await openDatabase();
    console.log("🔹 syncTemplatesFromSupabase: Local database opened");

    // 1️⃣ Fetch all templates for the user from Supabase
    const { data: supabaseTemplates, error: fetchError } = await supabase
      .from("meal_templates")
      .select("*")
      .eq("user_id", userId);

    if (fetchError) {
      console.error(
        "❌ syncTemplatesFromSupabase: Supabase fetch error:",
        fetchError
      );
      return { synced: 0, error: fetchError.message };
    }

    console.log(
      `🔹 syncTemplatesFromSupabase: Fetched ${supabaseTemplates.length} templates from Supabase`
    );

    if (supabaseTemplates.length === 0) {
      console.log("ℹ️ syncTemplatesFromSupabase: No templates to sync");
      return { synced: 0 };
    }

    // 2️⃣ Insert each template into local SQLite using a transaction
    let syncedCount = 0;

    await db.withTransactionAsync(async () => {
      for (const template of supabaseTemplates) {
        await db.runAsync(
          `INSERT OR REPLACE INTO meal_templates (
            id, user_id, name, items, calories, protein, carbs, fat,
            serving_size, serving_size_unit, is_favorite, use_count, 
            last_used_at, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            template.id,
            template.user_id,
            template.name,
            JSON.stringify(template.items), // Convert JSONB to string for SQLite
            template.calories,
            template.protein,
            template.carbs,
            template.fat,
            template.serving_size,
            template.serving_size_unit,
            template.is_favorite ? 1 : 0,
            template.use_count ?? 0,
            template.last_used_at ?? null,
            template.created_at,
          ]
        );
        syncedCount++;
      }
    });

    console.log(
      `✅ syncTemplatesFromSupabase: Successfully synced ${syncedCount} templates`
    );

    return { synced: syncedCount };
  } catch (error) {
    console.error("❌ syncTemplatesFromSupabase: Error occurred:", error);
    return {
      synced: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
