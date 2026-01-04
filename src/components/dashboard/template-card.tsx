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

interface TemplateCardProps {
  key: number;
  template: MealTemplate;
  theme: any;
  onLongPress: () => void;
}

export default function TemplateCard({
  template,
  theme,
  onLongPress,
}: TemplateCardProps) {
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
        text1: "Meal logged 🍽️",
        text2: "Go, keep grinding 💪",
        position: "top",
        visibilityTime: 2000,
      });
      if (onLongPress) onLongPress();
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
      {/* Template Name */}
      <Text style={[styles.name, { color: theme.text }]} numberOfLines={2}>
        {template.name}
      </Text>

      {/* Serving Size Badge */}
      <View
        style={[styles.servingBadge, { backgroundColor: theme.background }]}
      >
        <Text style={[styles.servingText, { color: theme.icon }]}>
          {template.serving_size} {template.serving_size_unit}
        </Text>
      </View>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      {/* Macros Grid */}
      <View style={styles.macrosGrid}>
        {/* Calories - Prominent */}
        <View style={styles.macroItemLarge}>
          <Text style={[styles.macroValueLarge, { color: theme.text }]}>
            {template.calories}
          </Text>
          <Text style={[styles.macroLabel, { color: theme.icon }]}>cal</Text>
        </View>

        {/* Protein - Highlighted */}
        <View style={styles.macroItem}>
          <Text style={[styles.macroValue, { color: theme.tint }]}>
            {template.protein}g
          </Text>
          <Text style={[styles.macroLabel, { color: theme.icon }]}>
            protein
          </Text>
        </View>

        {/* Carbs & Fat */}
        <View style={styles.macroRow}>
          <View style={styles.macroItemSmall}>
            <Text style={[styles.macroValueSmall, { color: theme.text }]}>
              {template.carbs}g
            </Text>
            <Text style={[styles.macroLabelSmall, { color: theme.icon }]}>
              carbs
            </Text>
          </View>
          <View style={styles.macroItemSmall}>
            <Text style={[styles.macroValueSmall, { color: theme.text }]}>
              {template.fat}g
            </Text>
            <Text style={[styles.macroLabelSmall, { color: theme.icon }]}>
              fat
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 180,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 20,
    minHeight: 40,
  },
  servingBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  servingText: {
    fontSize: 11,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    opacity: 0.3,
  },
  macrosGrid: {
    gap: 10,
  },
  macroItemLarge: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  macroValueLarge: {
    fontSize: 28,
    fontWeight: "700",
  },
  macroLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  macroItem: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  macroValue: {
    fontSize: 18,
    fontWeight: "600",
  },
  macroRow: {
    flexDirection: "row",
    gap: 16,
  },
  macroItemSmall: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
    flex: 1,
  },
  macroValueSmall: {
    fontSize: 15,
    fontWeight: "600",
  },
  macroLabelSmall: {
    fontSize: 11,
    fontWeight: "500",
  },
});
