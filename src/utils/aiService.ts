// src/utils/ai-service.ts
import OpenAI from "openai";

// TODO: make a serparate backend service for this (api calls to groq).
const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY || "";

const client = new OpenAI({
  apiKey: GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export interface AIMealEstimate {
  description: string;
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
2. Convert all quantities to grams when possible
3. Estimate the macronutrients (calories, protein, carbs, fat)
4. Provide a clear description of what you interpreted
5. List any assumptions you made

Be as accurate as possible based on standard nutritional data. If quantities aren't specified, use typical serving sizes.

Return your response as a JSON object with this exact structure:
{
  "description": "Clear description of the meal",
  "total_calories": number,
  "protein": number (in grams),
  "carbs": number (in grams),
  "fat": number (in grams),
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
      temperature: 0.3, // Lower temperature for more consistent nutritional estimates
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
      typeof parsed.total_calories !== "number" ||
      typeof parsed.protein !== "number" ||
      typeof parsed.carbs !== "number" ||
      typeof parsed.fat !== "number" ||
      !Array.isArray(parsed.assumptions)
    ) {
      throw new Error("Invalid response format from AI service");
    }

    // Round numbers to 1 decimal place for cleaner display
    return {
      ...parsed,
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
