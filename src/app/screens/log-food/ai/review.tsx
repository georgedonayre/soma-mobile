import { AIMealReviewForm } from "@/src/components/log-food/ai-meal-review-form";
import { useAppContext } from "@/src/context/app-context";
import { createMeal } from "@/src/database/models/mealModel";
import { Colors } from "@/src/theme";
import { AIMealEstimate } from "@/src/utils/apiService";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

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

  const [showAssumptions, setShowAssumptions] = useState(false);

  // Error state
  if (!estimate) {
    return (
      <View
        style={[styles.errorContainer, { backgroundColor: theme.background }]}
      >
        <Text style={{ color: theme.text }}>Error: Missing estimate data</Text>
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
        description: estimate.description,
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

  // Header content with AI badge and confidence
  const headerContent = (
    <>
      <View style={styles.estimateHeader}>
        <Ionicons name="sparkles" size={20} color={theme.tint} />
        <Text style={[styles.estimateTitle, { color: theme.text }]}>
          AI Analysis
        </Text>
      </View>
      <View style={styles.confidenceBadge}>
        <View
          style={[
            styles.confidenceDot,
            { backgroundColor: getConfidenceColor() },
          ]}
        />
        <Text style={[styles.confidenceText, { color: getConfidenceColor() }]}>
          {getConfidenceLabel()}
        </Text>
      </View>
    </>
  );

  // Additional content sections
  const additionalContent = (
    <>
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
          style={[styles.assumptionsCard, { backgroundColor: theme.cardBg }]}
          onPress={() => setShowAssumptions(!showAssumptions)}
        >
          <View style={styles.assumptionsHeader}>
            <Ionicons name="information-circle" size={18} color={theme.icon} />
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
                  <Text style={[styles.bullet, { color: theme.icon }]}>•</Text>
                  <Text style={[styles.assumptionText, { color: theme.text }]}>
                    {assumption}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </TouchableOpacity>
      )}
    </>
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <AIMealReviewForm
        title="Review AI Estimate"
        onBack={handleBack}
        mealDescription={estimate.description}
        items={estimate.items}
        headerContent={headerContent}
        onConfirm={handleConfirm}
      >
        {additionalContent}
      </AIMealReviewForm>
    </>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  estimateHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  estimateTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  confidenceBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  confidenceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: "500",
  },
  infoBox: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  infoText: {
    fontSize: 15,
    lineHeight: 22,
  },
  assumptionsCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  assumptionsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  assumptionsTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
  },
  assumptionsList: {
    marginTop: 12,
    gap: 8,
  },
  assumptionItem: {
    flexDirection: "row",
    gap: 8,
  },
  bullet: {
    fontSize: 14,
    lineHeight: 20,
  },
  assumptionText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});
