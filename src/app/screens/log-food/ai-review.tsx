// app/log-food/ai-review.tsx
import { MacroDisplay } from "@/src/components/log-food/macro-display";
import { QuickSelectPresets } from "@/src/components/log-food/quick-select-presets";
import { ServingSizeInput } from "@/src/components/log-food/serving-size-input";
import { useAppContext } from "@/src/context/app-context";
import { createMeal } from "@/src/database/models/mealModel";
import { useServingSize } from "@/src/hooks/use-serving-size";
import { Colors } from "@/src/theme";
import { AIMealEstimate } from "@/src/utils/aiService";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
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

export default function AIReviewScreen() {
  const params = useLocalSearchParams<{
    estimate?: string;
    originalInput?: string;
  }>();

  const router = useRouter();
  const colorScheme = useColorScheme() ?? "dark";
  const theme = Colors[colorScheme];
  const { user } = useAppContext();

  // Parse the AI estimate from params
  const estimate: AIMealEstimate | null = params.estimate
    ? JSON.parse(params.estimate)
    : null;
  const originalInput = params.originalInput || "";

  // Set up base macros from AI estimate (normalized to 100g equivalent)
  const baseMacros: Macros | null = estimate
    ? {
        calories: estimate.total_calories,
        protein: estimate.protein,
        carbs: estimate.carbs,
        fat: estimate.fat,
      }
    : null;

  // Default serving size is 100 (representing 100% of the AI estimate)
  const originalServingSize = 100;
  const servingSizeUnit = "g";

  // Use the same serving size hook for consistency
  const {
    servingSize,
    servingSizeText,
    adjustedMacros,
    handleServingSizeChange,
    handleTextInputChange,
  } = useServingSize(originalServingSize, baseMacros);

  const [showAssumptions, setShowAssumptions] = useState(false);

  // Conditional rendering only affects UI
  if (!estimate || !baseMacros || !adjustedMacros) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Error: Missing estimate data</Text>
      </SafeAreaView>
    );
  }

  const handleConfirm = async () => {
    if (!user) {
      Alert.alert("Error", "User not found");
      return;
    }

    try {
      await createMeal({
        user_id: user.id,
        description: estimate.description,
        total_calories: adjustedMacros.calories,
        protein: adjustedMacros.protein,
        carbs: adjustedMacros.carbs,
        fat: adjustedMacros.fat,
        date: format(new Date(), "yyyy-MM-dd"),
        template_id: null,
      });

      // Navigate back to dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error("Failed to log meal:", err);
      Alert.alert("Error", "Failed to log meal. Please try again.");
    }
  };

  const handleBack = () => {
    router.back();
  };

  const getConfidenceColor = () => {
    switch (estimate.confidence) {
      case "high":
        return "#4CAF50";
      case "medium":
        return "#FF9800";
      case "low":
        return "#F44336";
      default:
        return theme.icon;
    }
  };

  const getConfidenceLabel = () => {
    switch (estimate.confidence) {
      case "high":
        return "High Confidence";
      case "medium":
        return "Medium Confidence";
      case "low":
        return "Low Confidence";
      default:
        return "Unknown";
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Review Meal
          </Text>
          <View style={styles.backButton} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* AI Estimate Info Card */}
          <View
            style={[styles.estimateCard, { backgroundColor: theme.cardBg }]}
          >
            <View style={styles.estimateHeader}>
              <Ionicons name="sparkles" size={20} color={theme.tint} />
              <Text style={[styles.estimateTitle, { color: theme.text }]}>
                AI Analysis
              </Text>
            </View>
            <Text style={[styles.mealDescription, { color: theme.text }]}>
              {estimate.description}
            </Text>
            <View style={styles.confidenceBadge}>
              <View
                style={[
                  styles.confidenceDot,
                  { backgroundColor: getConfidenceColor() },
                ]}
              />
              <Text
                style={[styles.confidenceText, { color: getConfidenceColor() }]}
              >
                {getConfidenceLabel()}
              </Text>
            </View>
          </View>

          {/* Original Input */}
          {originalInput && (
            <View style={[styles.infoBox, { backgroundColor: theme.cardBg }]}>
              <Text style={[styles.infoLabel, { color: theme.icon }]}>
                Your Input:
              </Text>
              <Text style={[styles.infoText, { color: theme.text }]}>
                {originalInput}
              </Text>
            </View>
          )}

          {/* Assumptions */}
          {estimate.assumptions && estimate.assumptions.length > 0 && (
            <TouchableOpacity
              style={[
                styles.assumptionsCard,
                { backgroundColor: theme.cardBg },
              ]}
              onPress={() => setShowAssumptions(!showAssumptions)}
            >
              <View style={styles.assumptionsHeader}>
                <Ionicons
                  name="information-circle"
                  size={18}
                  color={theme.icon}
                />
                <Text style={[styles.assumptionsTitle, { color: theme.text }]}>
                  AI Assumptions ({estimate.assumptions.length})
                </Text>
                <Ionicons
                  name={showAssumptions ? "chevron-up" : "chevron-down"}
                  size={18}
                  color={theme.icon}
                />
              </View>
              {showAssumptions && (
                <View style={styles.assumptionsList}>
                  {estimate.assumptions.map((assumption, index) => (
                    <View key={index} style={styles.assumptionItem}>
                      <Text style={[styles.bullet, { color: theme.icon }]}>
                        •
                      </Text>
                      <Text
                        style={[styles.assumptionText, { color: theme.text }]}
                      >
                        {assumption}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </TouchableOpacity>
          )}

          {/* Macros Section */}
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

          {/* Serving Size Adjustment */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Adjust Portion
            </Text>
            <Text style={[styles.sectionSubtitle, { color: theme.icon }]}>
              Change the percentage if you ate more or less than described
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

          {/* Quick Portion Presets */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Quick Adjust
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
            <Text style={styles.confirmButtonText}>Confirm & Log Meal</Text>
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
  estimateCard: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
  },
  estimateHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  estimateTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  mealDescription: {
    fontSize: 16,
    marginBottom: 12,
    lineHeight: 22,
  },
  confidenceBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
  confidenceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  confidenceText: {
    fontSize: 13,
    fontWeight: "500",
  },
  infoBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  assumptionsCard: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
  },
  assumptionsHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  assumptionsTitle: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
    marginLeft: 6,
  },
  assumptionsList: {
    marginTop: 12,
    gap: 8,
  },
  assumptionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  bullet: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  assumptionText: {
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    marginBottom: 12,
    opacity: 0.7,
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
