import { MealForm } from "@/src/components/log-food/meal-form";
import { useAppContext } from "@/src/context/app-context";
import { createMeal } from "@/src/database/models/mealModel";
import { MealTemplate } from "@/src/database/types";
import { Colors } from "@/src/theme";
import { format } from "date-fns";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, useColorScheme, View } from "react-native";

type Macros = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export default function TemplateReviewScreen() {
  const params = useLocalSearchParams<{
    template?: string;
  }>();

  const router = useRouter();
  const colorScheme = useColorScheme() ?? "dark";
  const theme = Colors[colorScheme];
  const { user } = useAppContext();

  // Parse the template data from params
  const template: MealTemplate | null = params.template
    ? JSON.parse(params.template)
    : null;

  // Error state
  if (!template) {
    return (
      <View
        style={[styles.errorContainer, { backgroundColor: theme.background }]}
      >
        <Text style={{ color: theme.text }}>Error: Missing template data</Text>
      </View>
    );
  }

  // Prepare macros from template
  const baseMacros: Macros = {
    calories: template.calories,
    protein: template.protein,
    carbs: template.carbs,
    fat: template.fat,
  };

  const handleConfirm = async (adjustedMacros: Macros) => {
    if (!user) return;

    try {
      // Create the meal
      await createMeal({
        user_id: user.id,
        description: template.name,
        total_calories: adjustedMacros.calories,
        protein: adjustedMacros.protein,
        carbs: adjustedMacros.carbs,
        fat: adjustedMacros.fat,
        date: format(new Date(), "yyyy-MM-dd"),
        template_id: template.id,
      });

      // Update template usage stats
      //   await updateMealTemplateUsage(template.id);

      router.push("/dashboard");
    } catch (err) {
      console.error("Failed to log meal from template:", err);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <MealForm
        title="Quick Add from Template"
        onBack={handleBack}
        mealName={template.name}
        mealSubtitle={`Template • ${template.use_count} ${
          template.use_count === 1 ? "time" : "times"
        } used`}
        baseMacros={baseMacros}
        originalServingSize={template.serving_size}
        servingSizeUnit={template.serving_size_unit}
        onConfirm={handleConfirm}
        confirmButtonText="Confirm & Log Meal"
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
