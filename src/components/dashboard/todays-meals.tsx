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
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: theme.tint + "20" },
            ]}
          >
            <Ionicons name="restaurant" size={20} color={theme.tint} />
          </View>
          <View>
            <Text style={[styles.title, { color: theme.text }]}>
              Today&apos;s Meals
            </Text>
            <Text style={[styles.subtitle, { color: theme.icon }]}>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </Text>
          </View>
        </View>
      </View>

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
        <View>
          <View
            style={[
              styles.emptyCard,
              { backgroundColor: theme.cardBg, borderColor: theme.border },
            ]}
          >
            <Text style={styles.emptyIcon}>🐲</Text>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              No meals logged yet today
            </Text>
            <Text style={[styles.emptyDescription, { color: theme.icon }]}>
              Start tracking your nutrition by logging your first meal of the
              day
            </Text>
          </View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    opacity: 0.7,
  },
  emptyCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    maxWidth: 280,
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
