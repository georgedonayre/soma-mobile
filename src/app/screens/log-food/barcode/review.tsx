// app/barcode-scan/review.tsx
import { MealForm } from "@/src/components/log-food/meal-form";
import { useAppContext } from "@/src/context/app-context";
import { createMeal } from "@/src/database/models/mealModel";
import { Colors } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Alert, StyleSheet, Text, useColorScheme, View } from "react-native";

type Macros = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

type BarcodeFoodData = {
  barcode: string;
  product_name: string;
  brand_name?: string;
  serving_size: number;
  serving_unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export default function BarcodeReviewScreen() {
  const params = useLocalSearchParams<{
    foodData?: string;
  }>();

  const router = useRouter();
  const colorScheme = useColorScheme() ?? "dark";
  const theme = Colors[colorScheme];
  const { user } = useAppContext();

  // Parse the barcode food data from params
  const foodData: BarcodeFoodData | null = params.foodData
    ? JSON.parse(params.foodData)
    : null;

  // Set up base macros from barcode data
  const baseMacros: Macros | null = foodData
    ? {
        calories: foodData.calories,
        protein: foodData.protein,
        carbs: foodData.carbs,
        fat: foodData.fat,
      }
    : null;

  // Use serving size from barcode data
  const originalServingSize = foodData?.serving_size || 100;
  const servingSizeUnit = foodData?.serving_unit || "g";

  // Error state
  if (!foodData || !baseMacros) {
    return (
      <View
        style={[styles.errorContainer, { backgroundColor: theme.background }]}
      >
        <Text style={{ color: theme.text }}>Error: Missing food data</Text>
      </View>
    );
  }

  const handleConfirm = async (adjustedMacros: Macros) => {
    if (!user) {
      Alert.alert("Error", "User not found");
      return;
    }

    try {
      await createMeal({
        user_id: user.id,
        description: `${foodData.product_name} (${originalServingSize}${servingSizeUnit})`,
        total_calories: adjustedMacros.calories,
        protein: adjustedMacros.protein,
        carbs: adjustedMacros.carbs,
        fat: adjustedMacros.fat,
        date: format(new Date(), "yyyy-MM-dd"),
        template_id: null,
      });

      router.push("/dashboard");
    } catch (err) {
      console.error("Failed to log meal:", err);
      Alert.alert("Error", "Failed to log meal. Please try again.");
    }
  };

  const handleBack = () => {
    router.back();
  };

  // Header content with barcode badge
  const headerContent = (
    <View style={styles.barcodeHeader}>
      <View style={styles.barcodeBadge}>
        <Ionicons name="barcode-outline" size={18} color={theme.tint} />
        <Text style={[styles.barcodeText, { color: theme.tint }]}>
          Scanned Product
        </Text>
      </View>
    </View>
  );

  // Additional content - barcode info
  const additionalContent = (
    <View style={[styles.barcodeInfoBox, { backgroundColor: theme.cardBg }]}>
      <View style={styles.barcodeInfoRow}>
        <Text style={[styles.barcodeLabel, { color: theme.icon }]}>
          Barcode:
        </Text>
        <Text style={[styles.barcodeValue, { color: theme.text }]}>
          {foodData.barcode}
        </Text>
      </View>
      {foodData.brand_name && (
        <View style={styles.barcodeInfoRow}>
          <Text style={[styles.barcodeLabel, { color: theme.icon }]}>
            Brand:
          </Text>
          <Text style={[styles.barcodeValue, { color: theme.text }]}>
            {foodData.brand_name}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <MealForm
        title="Review Scanned Food"
        onBack={handleBack}
        mealName={foodData.product_name}
        headerContent={headerContent}
        baseMacros={baseMacros}
        originalServingSize={originalServingSize}
        servingSizeUnit={servingSizeUnit}
        onConfirm={handleConfirm}
        confirmButtonText="Confirm & Log Food"
      >
        {additionalContent}
      </MealForm>
    </>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  barcodeHeader: {
    marginBottom: 12,
  },
  barcodeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  barcodeText: {
    fontSize: 13,
    fontWeight: "600",
  },
  barcodeInfoBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  barcodeInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  barcodeLabel: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  barcodeValue: {
    fontSize: 14,
    fontWeight: "500",
  },
});
