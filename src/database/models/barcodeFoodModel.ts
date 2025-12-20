import { openDatabase } from "../db";

export interface BarcodeFood {
  barcode: string;
  product_name: string;
  serving_size: number;
  serving_unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  created_at: string;
}

export type BarcodeFoodInsert = Omit<BarcodeFood, "created_at">;

/**
 * Query barcode food by barcode number
 */
export const getBarcodeFoodByBarcode = async (
  barcode: string
): Promise<BarcodeFood | null> => {
  console.log("🔍 getBarcodeFoodByBarcode: Starting for barcode:", barcode);

  try {
    const db = await openDatabase();
    console.log("🔍 getBarcodeFoodByBarcode: Database opened");

    const result = await db.getFirstAsync<BarcodeFood>(
      "SELECT * FROM barcode_foods WHERE barcode = ?",
      [barcode]
    );

    if (result) {
      console.log(
        "✅ getBarcodeFoodByBarcode: Found food:",
        result.product_name
      );
      return result;
    } else {
      console.log("⚠️ getBarcodeFoodByBarcode: No food found for barcode");
      return null;
    }
  } catch (error) {
    console.error("❌ getBarcodeFoodByBarcode: Error:", error);
    throw error;
  }
};

/**
 * Create a new barcode food entry
 */
export const createBarcodeFood = async (
  foodData: BarcodeFoodInsert
): Promise<BarcodeFood> => {
  console.log("🔵 createBarcodeFood: Starting...", foodData);

  try {
    const db = await openDatabase();
    console.log("🔵 createBarcodeFood: Database opened");

    await db.runAsync(
      `INSERT INTO barcode_foods (
        barcode, product_name, serving_size, serving_unit, 
        calories, protein, carbs, fat
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        foodData.barcode,
        foodData.product_name,
        foodData.serving_size,
        foodData.serving_unit,
        foodData.calories,
        foodData.protein,
        foodData.carbs,
        foodData.fat,
      ]
    );
    console.log("🔵 createBarcodeFood: Insert successful");

    const food = await db.getFirstAsync<BarcodeFood>(
      "SELECT * FROM barcode_foods WHERE barcode = ?",
      [foodData.barcode]
    );

    if (!food) {
      throw new Error("Failed to create barcode food");
    }

    console.log("✅ createBarcodeFood: Complete!");
    return food;
  } catch (error) {
    console.error("❌ createBarcodeFood: Error:", error);
    throw error;
  }
};
