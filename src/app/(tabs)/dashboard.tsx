import { getCurrentUser } from "@/src/database/models/userModel";
import { Meal, MealTemplate, User } from "@/src/database/types";
import { Colors } from "@/src/theme";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View, useColorScheme } from "react-native";

import ContextHeader from "@/src/components/dashboard/context-header";

import MacroSummary from "@/src/components/dashboard/macro-summary";
import ProgressIndicator from "@/src/components/dashboard/progress-indicator";
import QuickActions from "@/src/components/dashboard/quick-actions";
import Templates from "@/src/components/dashboard/templates";
import TodaysMeals from "@/src/components/dashboard/todays-meals";
import { getMealsByDate } from "@/src/database/models/mealModel";
import { getAllTemplates } from "@/src/database/models/mealTemplateModel";
import {
  calculateDailyTotals,
  calculateProgress,
} from "@/src/utils/macroCalculations";
import { format } from "date-fns";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Dashboard() {
  const colorScheme = useColorScheme() ?? "dark";
  const theme = Colors[colorScheme];

  const [user, setUser] = useState<User | null>(null);
  const [todaysMeals, setTodaysMeals] = useState<Meal[]>([]);
  const [templates, setTemplates] = useState<MealTemplate[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const currentUser = await getCurrentUser();
      if (!user) return;
      setUser(currentUser);

      const currentMeals = await getMealsByDate(
        user.id,
        format(new Date(), "yyyy-MM-dd")
      );
      setTodaysMeals(currentMeals);
      const currentTemplates = await getAllTemplates(user.id);
      setTemplates(currentTemplates);

      // Mock today's meals
      // setTodaysMeals([
      //   {
      //     id: 1,
      //     user_id: 1,
      //     description: "Oatmeal with Banana",
      //     total_calories: 320,
      //     protein: 12,
      //     carbs: 58,
      //     fat: 6,
      //     date: new Date().toISOString(),
      //     template_id: null,
      //     created_at: new Date().toISOString(),
      //   },
      //   {
      //     id: 2,
      //     user_id: 1,
      //     description: "Chicken Salad",
      //     total_calories: 450,
      //     protein: 38,
      //     carbs: 22,
      //     fat: 18,
      //     date: new Date().toISOString(),
      //     template_id: null,
      //     created_at: new Date().toISOString(),
      //   },
      //   {
      //     id: 3,
      //     user_id: 1,
      //     description: "Protein Shake",
      //     total_calories: 180,
      //     protein: 25,
      //     carbs: 8,
      //     fat: 3,
      //     date: new Date().toISOString(),
      //     template_id: null,
      //     created_at: new Date().toISOString(),
      //   },
      // ]);

      // Mock templates
      // setTemplates([
      //   {
      //     id: 1,
      //     user_id: 1,
      //     name: "Morning Routine",
      //     calories: 380,
      //     protein: 18,
      //     carbs: 52,
      //     fat: 8,
      //     is_favorite: 1,
      //     use_count: 12,
      //     last_used_at: new Date().toISOString(),
      //     created_at: new Date().toISOString(),
      //   },
      //   {
      //     id: 2,
      //     user_id: 1,
      //     name: "Post-Workout",
      //     calories: 280,
      //     protein: 35,
      //     carbs: 20,
      //     fat: 5,
      //     is_favorite: 1,
      //     use_count: 8,
      //     last_used_at: new Date().toISOString(),
      //     created_at: new Date().toISOString(),
      //   },
      //   {
      //     id: 3,
      //     user_id: 1,
      //     name: "Quick Lunch",
      //     calories: 520,
      //     protein: 42,
      //     carbs: 48,
      //     fat: 15,
      //     is_favorite: 0,
      //     use_count: 5,
      //     last_used_at: new Date().toISOString(),
      //     created_at: new Date().toISOString(),
      //   },
      // ]);
    };

    loadData();
  }, []);

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]} />
    );
  }

  const dailyTotals = calculateDailyTotals(todaysMeals);
  const progress = calculateProgress(
    dailyTotals,
    user.daily_calorie_target || 2000,
    user.daily_protein_target || 150,
    user.daily_carbs_target || 250,
    user.daily_fat_target || 65
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
        edges={["top", "left", "right"]}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <ContextHeader date={new Date()} streak={user.streak} theme={theme} />

          <MacroSummary
            dailyTotals={dailyTotals}
            targets={{
              calories: user.daily_calorie_target || 2000,
              protein: user.daily_protein_target || 150,
              carbs: user.daily_carbs_target || 250,
              fat: user.daily_fat_target || 65,
            }}
            progress={progress}
            theme={theme}
          />

          <ProgressIndicator
            progress={progress}
            streak={user.streak}
            theme={theme}
          />

          <QuickActions theme={theme} />

          <TodaysMeals meals={todaysMeals} theme={theme} />

          <Templates templates={templates} theme={theme} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
