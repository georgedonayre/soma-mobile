import { MealForm } from "@/src/components/log-food/meal-form";
import { useAppContext } from "@/src/context/app-context";
import { createMeal } from "@/src/database/models/mealModel";
import { Colors } from "@/src/theme";
import { FoodSearchResult } from "@/src/utils/apiService";
import { format } from "date-fns";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, useColorScheme, View } from "react-native";
import Toast from "react-native-toast-message";

type Macros = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export default function LogFoodScreen() {
  const params = useLocalSearchParams<{
    fdcId: string;
    food?: string;
    macros?: string;
  }>();

  const router = useRouter();
  const colorScheme = useColorScheme() ?? "dark";
  const theme = Colors[colorScheme];
  const { user } = useAppContext();

  // Parse the food data from params
  const food: FoodSearchResult = params.food ? JSON.parse(params.food) : null;
  const baseMacros: Macros | null = params.macros
    ? JSON.parse(params.macros)
    : null;

  // Get original serving size (default to 100g if not available)
  const originalServingSize = food?.servingSize || 100;
  const servingSizeUnit = food?.servingSizeUnit || "g";

  // Error state
  if (!food || !baseMacros) {
    return (
      <View
        style={[styles.errorContainer, { backgroundColor: theme.background }]}
      >
        <Text style={{ color: theme.text }}>
          Error: Missing food or macro data
        </Text>
      </View>
    );
  }

  const handleConfirm = async (adjustedMacros: Macros) => {
    if (!user) return;

    try {
      await createMeal({
        user_id: user.id,
        description: food.description,
        total_calories: adjustedMacros.calories,
        protein: adjustedMacros.protein,
        carbs: adjustedMacros.carbs,
        fat: adjustedMacros.fat,
        date: format(new Date(), "yyyy-MM-dd"),
        template_id: null,
      });
      Toast.show({
        type: "success",
        text1: "Meal logged 🍽️",
        text2: "Go, keep grinding 💪",
        position: "top",
        visibilityTime: 2000,
      });

      router.push("/dashboard");
    } catch (err) {
      console.error("Failed to log meal:", err);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <MealForm
        title="Log Food"
        onBack={handleBack}
        mealName={food.description}
        mealSubtitle={food.brandOwner}
        baseMacros={baseMacros}
        originalServingSize={originalServingSize}
        servingSizeUnit={servingSizeUnit}
        onConfirm={handleConfirm}
        confirmButtonText="Confirm & Log Food"
      />
    </>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
