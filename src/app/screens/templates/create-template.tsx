// app/(tabs)/create-template.tsx

import { NewTemplateForm } from "@/src/components/templates/template-form";
import { useAppContext } from "@/src/context/app-context";
import { createMealTemplate } from "@/src/database/models/mealTemplateModel";
import { TemplateItem } from "@/src/database/types";
import { Colors } from "@/src/theme";
import { calculateTemplateMacros } from "@/src/utils/templateUtils";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, useColorScheme } from "react-native";

export default function CreateTemplateScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? "dark";
  const theme = Colors[colorScheme];
  const { user, isDbReady } = useAppContext();

  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async (data: {
    name: string;
    items: TemplateItem[];
    servingSize: number;
    servingSizeUnit: string;
  }) => {
    if (!user || !isDbReady) {
      Alert.alert("Error", "User not authenticated or database not ready");
      return;
    }

    setIsLoading(true);

    try {
      // Calculate total macros from items
      const totalMacros = calculateTemplateMacros(data.items);

      // Create template
      await createMealTemplate({
        user_id: user.id,
        name: data.name,
        items: JSON.stringify(data.items), // Store items as JSON
        calories: Math.round(totalMacros.calories),
        protein: Math.round(totalMacros.protein * 10) / 10,
        carbs: Math.round(totalMacros.carbs * 10) / 10,
        fat: Math.round(totalMacros.fat * 10) / 10,
        serving_size: data.servingSize,
        serving_size_unit: data.servingSizeUnit,
        is_favorite: 0,
        use_count: 0,
        last_used_at: null,
      });

      Alert.alert("Success", "Template created successfully!");
      router.push("/dashboard");
    } catch (err) {
      console.error("Failed to create template:", err);
      Alert.alert("Error", "Failed to create template. Please try again.");
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
      <NewTemplateForm
        title="Create Template"
        onBack={handleBack}
        onConfirm={handleConfirm}
        confirmButtonText="Create Template"
        isLoading={isLoading}
        theme={theme}
      />
    </>
  );
}
