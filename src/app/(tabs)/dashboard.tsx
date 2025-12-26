import { Meal, MealTemplate } from "@/src/database/types";
import { Colors } from "@/src/theme";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View, useColorScheme } from "react-native";

import ContextHeader from "@/src/components/dashboard/context-header";

import MacroSummary from "@/src/components/dashboard/macro-summary";
import ProgressIndicator from "@/src/components/dashboard/progress-indicator";
import QuickActions from "@/src/components/dashboard/quick-actions";
import Templates from "@/src/components/dashboard/templates";
import TodaysMeals from "@/src/components/dashboard/todays-meals";
import { useAppContext } from "@/src/context/app-context";
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

  const { user, isDbReady } = useAppContext();
  const [todaysMeals, setTodaysMeals] = useState<Meal[]>([]);
  const [templates, setTemplates] = useState<MealTemplate[]>([]);

  useEffect(() => {
    if (!isDbReady || !user) return; // ✅ wait for DB + user
    const loadData = async () => {
      const currentMeals = await getMealsByDate(
        user.id,
        format(new Date(), "yyyy-MM-dd")
      );
      setTodaysMeals(currentMeals);
      const currentTemplates = await getAllTemplates(user.id);
      setTemplates(currentTemplates);
    };

    loadData();
  }, [user, isDbReady]);

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

  const refreshMeals = async () => {
    const currentMeals = await getMealsByDate(
      user.id,
      format(new Date(), "yyyy-MM-dd")
    );
    setTodaysMeals(currentMeals);
  };

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

          <QuickActions theme={theme} user={user} />

          <TodaysMeals meals={todaysMeals} theme={theme} />

          <Templates
            templates={templates}
            theme={theme}
            onLongPress={refreshMeals}
          />
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
