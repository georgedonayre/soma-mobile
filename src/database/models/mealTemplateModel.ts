import { openDatabase } from "../db";
import { MealTemplate, MealTemplateInsert } from "../types";

/**
 * Create a new meal template
 */
export const createMealTemplate = async (
  templateData: MealTemplateInsert
): Promise<MealTemplate> => {
  console.log("Create Meal template function got called");
  const db = await openDatabase();
  console.log("db connection okay");

  console.log("done");

  const result = await db.runAsync(
    `INSERT INTO meal_templates (
      user_id, name, calories, protein, carbs, fat, serving_size, serving_size_unit, is_favorite, use_count, last_used_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      templateData.user_id,
      templateData.name,
      templateData.calories,
      templateData.protein,
      templateData.carbs,
      templateData.fat,
      templateData.serving_size,
      templateData.serving_size_unit,
      templateData.is_favorite || 0,
      templateData.use_count || 0,
      templateData.last_used_at || null,
    ]
  );

  console.log("Template creation good");

  const template = await db.getFirstAsync<MealTemplate>(
    "SELECT * FROM meal_templates WHERE id = ?",
    [result.lastInsertRowId]
  );

  if (!template) {
    throw new Error("Failed to create meal template");
  }

  return template;
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
