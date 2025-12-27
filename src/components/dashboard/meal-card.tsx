// components/dashboard/MealCard.tsx
import { Meal } from "@/src/database/types";
import { formatMealTime } from "@/src/utils/dateHelper";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface MealCardProps {
  key: number;
  meal: Meal;
  theme: any;
}

export default function MealCard({ meal, theme }: MealCardProps) {
  const time = formatMealTime(meal.created_at);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: theme.background, borderColor: theme.icon + "20" },
      ]}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
            {meal.description}
          </Text>
          <View style={styles.macros}>
            <Text style={[styles.calories, { color: theme.text }]}>
              {meal.total_calories} cal
            </Text>
            <Text style={[styles.protein, { color: "#8B5CF6" }]}>
              {meal.protein}g protein
            </Text>
            <Text style={[styles.time, { color: theme.icon }]}>{time}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.editButton} activeOpacity={0.6}>
          <Ionicons name="create-outline" size={18} color={theme.icon} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  content: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 6,
  },
  macros: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  calories: {
    fontSize: 14,
    fontWeight: "600",
  },
  protein: {
    fontSize: 14,
    fontWeight: "500",
  },
  time: {
    fontSize: 14,
  },
  editButton: {
    padding: 8,
  },
});
