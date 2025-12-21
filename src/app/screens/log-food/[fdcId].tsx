// app/log-food/[fdcId].tsx
import { MacroDisplay } from "@/src/components/log-food/macro-display";
import { QuickSelectPresets } from "@/src/components/log-food/quick-select-presets";
import { ServingSizeInput } from "@/src/components/log-food/serving-size-input";
import { useAppContext } from "@/src/context/app-context";
import { createMeal } from "@/src/database/models/mealModel";
import { useServingSize } from "@/src/hooks/use-serving-size";
import { Colors } from "@/src/theme";
import { FoodSearchResult } from "@/src/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
  const { user, isDbReady } = useAppContext();

  // Parse the food data from params
  const food: FoodSearchResult = params.food ? JSON.parse(params.food) : null;
  const baseMacros: Macros | null = params.macros
    ? JSON.parse(params.macros)
    : null;

  // Get original serving size (default to 100g if not available)
  const originalServingSize = food.servingSize || 100;
  const servingSizeUnit = food.servingSizeUnit || "g";

  // Use custom hook for serving size logic
  const {
    servingSize,
    servingSizeText,
    adjustedMacros,
    handleServingSizeChange,
    handleTextInputChange,
  } = useServingSize(originalServingSize, baseMacros);
  // Conditional rendering only affects UI
  if (!food || !baseMacros || !adjustedMacros) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Error: Missing food or macro data</Text>
      </SafeAreaView>
    );
  }
  const handleConfirm = async () => {
    if (!user) return; // safety check from context

    try {
      await createMeal({
        user_id: user.id,
        description: food.description,
        total_calories: adjustedMacros.calories,
        protein: adjustedMacros.protein,
        carbs: adjustedMacros.carbs,
        fat: adjustedMacros.fat,
        date: format(new Date(), "yyyy-MM-dd"), // format using date-fns
        template_id: null, // or selected template if you add that feature
      });

      router.push("/dashboard"); // navigate back
    } catch (err) {
      console.error("Failed to log meal:", err);
      // Optionally show a toast/snackbar
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <Stack.Screen options={{ title: "Log Food" }} />
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Log Food
          </Text>
          <View style={styles.backButton} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Food Info Card */}
          <View style={[styles.foodCard, { backgroundColor: theme.cardBg }]}>
            <Text style={[styles.foodName, { color: theme.text }]}>
              {food.description}
            </Text>
            {food.brandOwner && (
              <Text style={[styles.brandName, { color: theme.icon }]}>
                {food.brandOwner}
              </Text>
            )}
          </View>

          {/* Macros Section - Moved up for better hierarchy */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Nutrition Facts
            </Text>
            <MacroDisplay
              calories={adjustedMacros.calories}
              protein={adjustedMacros.protein}
              carbs={adjustedMacros.carbs}
              fat={adjustedMacros.fat}
              theme={theme}
            />
          </View>

          {/* Serving Size Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Serving Size
            </Text>
            <ServingSizeInput
              servingSize={servingSize}
              servingSizeText={servingSizeText}
              servingSizeUnit={servingSizeUnit}
              onValueChange={handleServingSizeChange}
              onTextChange={handleTextInputChange}
              theme={theme}
            />
          </View>

          {/* Quick Serving Presets */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Quick Select
            </Text>
            <QuickSelectPresets
              originalServingSize={originalServingSize}
              currentServingSize={servingSize}
              onSelect={handleServingSizeChange}
              theme={theme}
            />
          </View>
        </ScrollView>

        {/* Confirm Button */}
        <View style={[styles.footer, { borderTopColor: theme.border }]}>
          <TouchableOpacity
            style={[styles.confirmButton, { backgroundColor: theme.tint }]}
            onPress={handleConfirm}
          >
            <Text style={styles.confirmButtonText}>Confirm & Log Food</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  foodCard: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
  },
  foodName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  brandName: {
    fontSize: 13,
    opacity: 0.7,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 12,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  confirmButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
