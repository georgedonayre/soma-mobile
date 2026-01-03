import { supabase } from "@/src/lib/supabase";
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
 * Query barcode food by barcode number (offline-first)
 */
export const getBarcodeFoodByBarcode = async (
  barcode: string
): Promise<BarcodeFood | null> => {
  console.log("🔍 getBarcodeFoodByBarcode: Starting for barcode:", barcode);

  try {
    const db = await openDatabase();
    console.log("🔍 getBarcodeFoodByBarcode: Local database opened");

    // 1️⃣ Check local SQLite first
    const localResult = await db.getFirstAsync<BarcodeFood>(
      "SELECT * FROM barcode_foods WHERE barcode = ?",
      [barcode]
    );

    if (localResult) {
      console.log(
        "✅ getBarcodeFoodByBarcode: Found locally:",
        localResult.product_name
      );
      return localResult;
    }

    console.log(
      "⚠️ getBarcodeFoodByBarcode: Not found locally, checking Supabase..."
    );

    // 2️⃣ Fetch from Supabase
    const { data: supabaseData, error: supabaseError } = await supabase
      .from("barcode_foods")
      .select("*")
      .eq("barcode", barcode)
      .single();

    if (supabaseError) {
      console.error(
        "❌ getBarcodeFoodByBarcode: Supabase error:",
        supabaseError
      );
      return null; // or throw depending on your design
    }

    if (!supabaseData) {
      console.log("⚠️ getBarcodeFoodByBarcode: Not found on Supabase either");
      return null;
    }

    console.log(
      "✅ getBarcodeFoodByBarcode: Found on Supabase:",
      supabaseData.product_name
    );

    // 3️⃣ Save Supabase row locally for future offline use
    await db.runAsync(
      `INSERT OR IGNORE INTO barcode_foods (
        barcode, product_name, serving_size, serving_unit, 
        calories, protein, carbs, fat, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        supabaseData.barcode,
        supabaseData.product_name,
        supabaseData.serving_size,
        supabaseData.serving_unit,
        supabaseData.calories,
        supabaseData.protein,
        supabaseData.carbs,
        supabaseData.fat,
        supabaseData.created_at ?? new Date().toISOString(),
      ]
    );

    console.log("✅ getBarcodeFoodByBarcode: Cached Supabase row locally");

    return supabaseData;
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
    // --------------------
    // 1️⃣ Insert into Supabase
    // --------------------
    console.log("🔵 createBarcodeFood: Inserting into Supabase...");
    const { data: supabaseData, error: supabaseError } = await supabase
      .from("barcode_foods")
      .insert([
        {
          barcode: foodData.barcode,
          product_name: foodData.product_name,
          serving_size: foodData.serving_size,
          serving_unit: foodData.serving_unit,
          calories: foodData.calories,
          protein: foodData.protein,
          carbs: foodData.carbs,
          fat: foodData.fat,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (supabaseError) {
      console.error("❌ createBarcodeFood: Supabase error:", supabaseError);
      throw supabaseError;
    }
    console.log(
      "✅ createBarcodeFood: Supabase insert successful",
      supabaseData
    );

    // --------------------
    // 2️⃣ Insert into local SQLite
    // --------------------
    console.log("🔵 createBarcodeFood: Opening local database...");
    const db = await openDatabase();
    console.log("✅ createBarcodeFood: Local database opened");

    await db.runAsync(
      `INSERT INTO barcode_foods (
        barcode, product_name, serving_size, serving_unit, 
        calories, protein, carbs, fat, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        foodData.barcode,
        foodData.product_name,
        foodData.serving_size,
        foodData.serving_unit,
        foodData.calories,
        foodData.protein,
        foodData.carbs,
        foodData.fat,
        new Date().toISOString(),
      ]
    );
    console.log("✅ createBarcodeFood: Local SQLite insert successful");

    // --------------------
    // 3️⃣ Fetch the inserted row from local SQLite
    // --------------------
    const food = await db.getFirstAsync<BarcodeFood>(
      "SELECT * FROM barcode_foods WHERE barcode = ?",
      [foodData.barcode]
    );

    if (!food) {
      throw new Error(
        "❌ createBarcodeFood: Failed to retrieve newly inserted row"
      );
    }

    console.log("✅ createBarcodeFood: Complete!", food);
    return food;
  } catch (error) {
    console.error("❌ createBarcodeFood: Error occurred:", error);
    throw error;
  }
};
