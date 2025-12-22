// app/(tabs)/create-template.tsx
import { TemplateForm } from "@/src/components/templates/template-form";
import { useAppContext } from "@/src/context/app-context";
import { createMealTemplate } from "@/src/database/models/mealTemplateModel";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";

type Macros = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export default function CreateTemplateScreen() {
  const params = useLocalSearchParams<{
    name?: string;
    macros?: string;
    servingSize?: string;
    servingSizeUnit?: string;
  }>();

  const router = useRouter();
  const { user } = useAppContext();

  // Parse pre-populated data (for AI-assisted creation)
  const initialName = params.name || "";
  const initialMacros: Macros | undefined = params.macros
    ? JSON.parse(params.macros)
    : undefined;
  const initialServingSize = params.servingSize
    ? parseFloat(params.servingSize)
    : undefined;
  const initialServingSizeUnit = params.servingSizeUnit;

  const handleConfirm = async (data: {
    name: string;
    macros: Macros;
    servingSize: number;
    servingSizeUnit: string;
  }) => {
    if (!user) return;

    try {
      await createMealTemplate({
        user_id: user.id,
        name: data.name,
        calories: data.macros.calories,
        protein: data.macros.protein,
        carbs: data.macros.carbs,
        fat: data.macros.fat,
        serving_size: data.servingSize,
        serving_size_unit: data.servingSizeUnit,
        is_favorite: 0,
        use_count: 0,
        last_used_at: null,
      });

      router.push("/dashboard");
    } catch (err) {
      console.error("Failed to create template:", err);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <TemplateForm
        title="Create Template"
        onBack={handleBack}
        initialName={initialName}
        initialMacros={initialMacros}
        initialServingSize={initialServingSize}
        initialServingSizeUnit={initialServingSizeUnit}
        onConfirm={handleConfirm}
        confirmButtonText="Create Template"
      />
    </>
  );
}
