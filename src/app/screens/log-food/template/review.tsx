import { TemplateMealForm } from "@/src/components/log-food/template-meal-form";
import { useAppContext } from "@/src/context/app-context";
import { createMeal } from "@/src/database/models/mealModel";
import { MealTemplate } from "@/src/database/types";
import { Colors } from "@/src/theme";
import { parseTemplateItems } from "@/src/utils/templateUtils";
import { format } from "date-fns";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, useColorScheme, View } from "react-native";

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

  const [isLoading, setIsLoading] = useState(false);

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

  // Parse items from JSON
  const items = parseTemplateItems(template.items);

  if (items.length === 0) {
    return (
      <View
        style={[styles.errorContainer, { backgroundColor: theme.background }]}
      >
        <Text style={{ color: theme.text }}>Error: Template has no items</Text>
      </View>
    );
  }

  const handleConfirm = async (adjustedMacros: Macros) => {
    if (!user) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    setIsLoading(true);

    try {
      // Create the meal with adjusted macros
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

      Alert.alert("Success", "Meal logged successfully!");
      router.push("/dashboard");
    } catch (err) {
      console.error("Failed to log meal from template:", err);
      Alert.alert("Error", "Failed to log meal. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <TemplateMealForm
        title="Quick Add from Template"
        onBack={handleBack}
        templateName={template.name}
        templateSubtitle={`Template • ${template.use_count} ${
          template.use_count === 1 ? "time" : "times"
        } used`}
        items={items}
        onConfirm={handleConfirm}
        confirmButtonText="Confirm & Log Meal"
        isLoading={isLoading}
        theme={theme}
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
