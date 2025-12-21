// src/utils/ai-service.ts (ENHANCED VERSION)
import OpenAI from "openai";

const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY || "";

const client = new OpenAI({
  apiKey: GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// Enhanced interface with breakdown of individual items
export interface AIMealItem {
  name: string;
  quantity: string; // e.g., "2 eggs", "150g", "1 cup"
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface AIMealEstimate {
  description: string;
  items: AIMealItem[]; // NEW: Array of individual food items
  total_calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: "low" | "medium" | "high";
  assumptions: string[];
}

const SYSTEM_PROMPT = `You are a nutrition analysis assistant. Your job is to analyze meal descriptions and provide accurate macro estimates.

When given a meal description:
1. Parse the ingredients and quantities
2. Break down the meal into individual food items
3. For each item, estimate its macronutrients separately
4. Convert all quantities to standardized measurements
5. Calculate totals across all items
6. Provide a clear description of what you interpreted
7. List any assumptions you made

IMPORTANT: Always break down meals into individual items. For example:
- "2 eggs with toast" should have 2 items: eggs and toast
- "chicken rice and broccoli" should have 3 items: chicken, rice, broccoli
- "peanut butter sandwich" should have 3 items: bread, peanut butter, (second slice of bread is part of bread item)

Return your response as a JSON object with this exact structure:
{
  "description": "Clear description of the meal",
  "items": [
    {
      "name": "Food item name",
      "quantity": "Amount with unit (e.g., '2 eggs', '150g', '1 cup')",
      "calories": number,
      "protein": number (in grams),
      "carbs": number (in grams),
      "fat": number (in grams)
    }
  ],
  "total_calories": number (sum of all items),
  "protein": number (sum of all items, in grams),
  "carbs": number (sum of all items, in grams),
  "fat": number (sum of all items, in grams),
  "confidence": "low" | "medium" | "high",
  "assumptions": ["assumption 1", "assumption 2"]
}

Only return the JSON object, no additional text.`;

export const estimateMealMacros = async (
  userInput: string
): Promise<AIMealEstimate> => {
  try {
    if (!GROQ_API_KEY) {
      throw new Error("Groq API key not configured");
    }

    const completion = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: userInput,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const responseContent = completion.choices[0]?.message?.content;

    if (!responseContent) {
      throw new Error("No response from AI service");
    }

    const parsed: AIMealEstimate = JSON.parse(responseContent);

    // Validate the response structure
    if (
      typeof parsed.description !== "string" ||
      !Array.isArray(parsed.items) ||
      typeof parsed.total_calories !== "number" ||
      typeof parsed.protein !== "number" ||
      typeof parsed.carbs !== "number" ||
      typeof parsed.fat !== "number" ||
      !Array.isArray(parsed.assumptions)
    ) {
      throw new Error("Invalid response format from AI service");
    }

    // Validate each item
    for (const item of parsed.items) {
      if (
        typeof item.name !== "string" ||
        typeof item.quantity !== "string" ||
        typeof item.calories !== "number" ||
        typeof item.protein !== "number" ||
        typeof item.carbs !== "number" ||
        typeof item.fat !== "number"
      ) {
        throw new Error("Invalid item format in AI response");
      }
    }

    // Round numbers for cleaner display
    return {
      ...parsed,
      items: parsed.items.map((item) => ({
        ...item,
        calories: Math.round(item.calories),
        protein: Math.round(item.protein * 10) / 10,
        carbs: Math.round(item.carbs * 10) / 10,
        fat: Math.round(item.fat * 10) / 10,
      })),
      total_calories: Math.round(parsed.total_calories),
      protein: Math.round(parsed.protein * 10) / 10,
      carbs: Math.round(parsed.carbs * 10) / 10,
      fat: Math.round(parsed.fat * 10) / 10,
    };
  } catch (error) {
    console.error("Error estimating meal macros:", error);
    throw error;
  }
};
