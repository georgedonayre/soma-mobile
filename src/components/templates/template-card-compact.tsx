// components/template/template-card-compact.tsx
import { useAppContext } from "@/src/context/app-context";
import { createMeal } from "@/src/database/models/mealModel";
import { MealTemplate } from "@/src/database/types";
import { routes } from "@/src/utils/routes";
import { format } from "date-fns";
import { useRouter } from "expo-router";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

interface TemplateCardCompactProps {
  template: MealTemplate;
  theme: any;
}

export default function TemplateCardCompact({
  template,
  theme,
}: TemplateCardCompactProps) {
  const router = useRouter();
  const { user } = useAppContext();

  const handlePress = () => {
    router.push({
      pathname: routes.templateLogScreen,
      params: {
        template: JSON.stringify(template),
      },
    });
  };

  const handleLongPress = async () => {
    if (!user) return;

    // Provide haptic feedback
    Vibration.vibrate(50);

    try {
      // Quick log the meal with template's default values
      await createMeal({
        user_id: user.id,
        description: template.name,
        total_calories: template.calories,
        protein: template.protein,
        carbs: template.carbs,
        fat: template.fat,
        date: format(new Date(), "yyyy-MM-dd"),
        template_id: template.id,
      });

      // Show success toast
      Toast.show({
        type: "success",
        text1: "Meal logged! 🎉",
        text2: `${template.name} added to today`,
        position: "top",
        visibilityTime: 2000,
      });
    } catch (err) {
      console.error("Failed to quick log meal:", err);

      // Show error toast
      Toast.show({
        type: "error",
        text1: "Failed to log meal",
        text2: "Please try again",
        position: "top",
        visibilityTime: 2000,
      });
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: theme.cardBg,
          borderColor: theme.border,
        },
      ]}
      activeOpacity={0.7}
      onPress={handlePress}
      onLongPress={handleLongPress}
      delayLongPress={500}
    >
      {/* Left Side: Template Info */}
      <View style={styles.leftSide}>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
          {template.name}
        </Text>
        <View style={styles.metaRow}>
          <View
            style={[styles.servingBadge, { backgroundColor: theme.background }]}
          >
            <Text style={[styles.servingText, { color: theme.icon }]}>
              {template.serving_size}
              {template.serving_size_unit}
            </Text>
          </View>
          <Text style={[styles.usageText, { color: theme.icon }]}>
            Used {template.use_count}x
          </Text>
        </View>
      </View>

      {/* Right Side: Macros */}
      <View style={styles.rightSide}>
        <View style={styles.macroRow}>
          <Text style={[styles.calorieValue, { color: theme.text }]}>
            {template.calories}
          </Text>
          <Text style={[styles.calorieLabel, { color: theme.icon }]}>cal</Text>
        </View>
        <View style={styles.macrosCompact}>
          <View style={styles.macroItem}>
            <Text style={[styles.macroValue, { color: theme.tint }]}>
              {template.protein}g
            </Text>
            <Text style={[styles.macroLabel, { color: theme.icon }]}>P</Text>
          </View>
          <View style={styles.macroDivider} />
          <View style={styles.macroItem}>
            <Text style={[styles.macroValue, { color: theme.text }]}>
              {template.carbs}g
            </Text>
            <Text style={[styles.macroLabel, { color: theme.icon }]}>C</Text>
          </View>
          <View style={styles.macroDivider} />
          <View style={styles.macroItem}>
            <Text style={[styles.macroValue, { color: theme.text }]}>
              {template.fat}g
            </Text>
            <Text style={[styles.macroLabel, { color: theme.icon }]}>F</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    gap: 16,
  },
  leftSide: {
    flex: 1,
    gap: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  servingBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  servingText: {
    fontSize: 11,
    fontWeight: "500",
  },
  usageText: {
    fontSize: 12,
    fontWeight: "500",
  },
  rightSide: {
    alignItems: "flex-end",
    gap: 8,
  },
  macroRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  calorieValue: {
    fontSize: 24,
    fontWeight: "700",
  },
  calorieLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  macrosCompact: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  macroItem: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 2,
  },
  macroValue: {
    fontSize: 13,
    fontWeight: "600",
  },
  macroLabel: {
    fontSize: 10,
    fontWeight: "500",
  },
  macroDivider: {
    width: 1,
    height: 12,
    backgroundColor: "#E5E5E5",
    opacity: 0.3,
  },
});
