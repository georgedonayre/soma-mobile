// components/dashboard/TodaysMeals.tsx
import { Meal } from "@/src/database/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MealCard from "./meal-card";

interface TodaysMealsProps {
  meals: Meal[];
  theme: any;
}

export default function TodaysMeals({ meals, theme }: TodaysMealsProps) {
  const [showAll, setShowAll] = React.useState(false);
  const displayedMeals = showAll ? meals : meals.slice(0, 3);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>
        Today&apos;s Meals
      </Text>

      {meals.length > 0 ? (
        <>
          <View style={styles.mealsList}>
            {displayedMeals.map((meal) => (
              <MealCard key={meal.id} meal={meal} theme={theme} />
            ))}
          </View>

          {meals.length > 3 && (
            <TouchableOpacity
              style={styles.seeAllButton}
              onPress={() => setShowAll(!showAll)}
              activeOpacity={0.7}
            >
              <Text style={[styles.seeAllText, { color: theme.icon }]}>
                {showAll ? "Show Less" : `See All ${meals.length} Meals`}
              </Text>
              <Ionicons
                name={showAll ? "chevron-up" : "chevron-down"}
                size={16}
                color={theme.icon}
              />
            </TouchableOpacity>
          )}
        </>
      ) : (
        <View
          style={[
            styles.emptyState,
            {
              backgroundColor: theme.background,
              borderColor: theme.icon + "20",
            },
          ]}
        >
          <View
            style={[
              styles.emptyIconCircle,
              { backgroundColor: theme.icon + "15" },
            ]}
          >
            <Ionicons name="add" size={32} color={theme.icon} />
          </View>
          <Text style={[styles.emptyText, { color: theme.text }]}>
            No meals logged yet today
          </Text>
          <TouchableOpacity style={styles.emptyButton} activeOpacity={0.7}>
            <Text style={styles.emptyButtonText}>Log Your First Meal</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  mealsList: {
    gap: 12,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 12,
    marginTop: 8,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "500",
  },
  emptyState: {
    padding: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
  emptyButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  emptyButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
});
