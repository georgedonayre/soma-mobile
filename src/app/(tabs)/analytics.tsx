import EmptyWeeklyState from "@/src/components/history/empty-weekly-state";
import WeeklyHeader from "@/src/components/history/weekly-header";
import WeeklyStatsCard from "@/src/components/history/weekly-stats";
import WeightSection from "@/src/components/history/weight-section";
import { useAppContext } from "@/src/context/app-context";
import { getWeeklyNutritionSummary } from "@/src/database/models/mealModel";
import { getWeightLogsByDateRange } from "@/src/database/models/weightLogModel";
import { Colors } from "@/src/theme";
import { format, subDays } from "date-fns";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface WeeklyAverages {
  avgCalories: number;
  avgProtein: number;
  avgCarbs: number;
  avgFat: number;
  daysWithData: number;
}

interface WeightLogData {
  id: number;
  date: string;
  weight: number;
}

export default function HistoryScreen() {
  const colorScheme = useColorScheme() ?? "dark";
  const theme = Colors[colorScheme];
  const { user, isDbReady } = useAppContext();

  const [weeklyData, setWeeklyData] = useState<WeeklyAverages | null>(null);
  const [weightLogs, setWeightLogs] = useState<WeightLogData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isDbReady || !user) return;

    loadData();
  }, [user, isDbReady]);

  const loadData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const today = new Date();
      const sevenDaysAgo = subDays(today, 6); // Last 7 days including today

      const startDate = format(sevenDaysAgo, "yyyy-MM-dd");
      const endDate = format(today, "yyyy-MM-dd");

      // Load weekly nutrition summary
      const summary = await getWeeklyNutritionSummary(
        user.id,
        startDate,
        endDate
      );

      // Calculate averages based on days with actual data
      const daysWithData = summary.length;

      if (daysWithData === 0) {
        setWeeklyData({
          avgCalories: 0,
          avgProtein: 0,
          avgCarbs: 0,
          avgFat: 0,
          daysWithData: 0,
        });
      } else {
        const totals = summary.reduce(
          (acc, day) => ({
            calories: acc.calories + day.totalCalories,
            protein: acc.protein + day.totalProtein,
            carbs: acc.carbs + day.totalCarbs,
            fat: acc.fat + day.totalFat,
          }),
          { calories: 0, protein: 0, carbs: 0, fat: 0 }
        );

        setWeeklyData({
          avgCalories: Math.round(totals.calories / daysWithData),
          avgProtein: Math.round(totals.protein / daysWithData),
          avgCarbs: Math.round(totals.carbs / daysWithData),
          avgFat: Math.round(totals.fat / daysWithData),
          daysWithData,
        });
      }

      // Load weight logs (last 14 logs for chart)
      // We get more than 14 days to ensure we have 14 logs even if there are gaps
      const weightStartDate = format(subDays(today, 90), "yyyy-MM-dd");
      const logs = await getWeightLogsByDateRange(
        user.id,
        weightStartDate,
        endDate
      );

      setWeightLogs(logs);
    } catch (error) {
      console.error("Error loading history data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]} />
    );
  }

  const calculateProgress = (actual: number, target: number): number => {
    if (target === 0) return 0;
    return Math.min((actual / target) * 100, 100);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Analytics",
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
        }}
      />
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
        edges={["left", "right", "bottom"]}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.tint} />
            </View>
          ) : weeklyData ? (
            <>
              <View style={styles.headerContainer}>
                <WeeklyHeader
                  daysWithData={weeklyData.daysWithData}
                  theme={theme}
                />
              </View>

              {weeklyData.daysWithData === 0 ? (
                <EmptyWeeklyState theme={theme} />
              ) : (
                <View
                  style={[
                    styles.statsContainer,
                    {
                      backgroundColor: theme.background,
                      borderBottomColor: theme.icon + "20",
                    },
                  ]}
                >
                  {/* Primary: Calories */}
                  <WeeklyStatsCard
                    label="Calories"
                    value={weeklyData.avgCalories}
                    unit="kcal"
                    target={user.daily_calorie_target || 2000}
                    progress={calculateProgress(
                      weeklyData.avgCalories,
                      user.daily_calorie_target || 2000
                    )}
                    theme={theme}
                    size="large"
                  />

                  {/* Secondary: Protein */}
                  <WeeklyStatsCard
                    label="Protein"
                    value={weeklyData.avgProtein}
                    unit="g"
                    target={user.daily_protein_target || 150}
                    progress={calculateProgress(
                      weeklyData.avgProtein,
                      user.daily_protein_target || 150
                    )}
                    theme={theme}
                    size="medium"
                  />

                  {/* Tertiary: Carbs & Fats */}
                  <View
                    style={[
                      styles.tertiarySection,
                      { borderTopColor: theme.icon + "15" },
                    ]}
                  >
                    <WeeklyStatsCard
                      label="Carbs"
                      value={weeklyData.avgCarbs}
                      unit="g"
                      target={user.daily_carbs_target || 250}
                      progress={calculateProgress(
                        weeklyData.avgCarbs,
                        user.daily_carbs_target || 250
                      )}
                      theme={theme}
                      size="small"
                    />

                    <WeeklyStatsCard
                      label="Fats"
                      value={weeklyData.avgFat}
                      unit="g"
                      target={user.daily_fat_target || 65}
                      progress={calculateProgress(
                        weeklyData.avgFat,
                        user.daily_fat_target || 65
                      )}
                      theme={theme}
                      size="small"
                    />
                  </View>
                </View>
              )}

              {/* Weight Section */}
              <WeightSection
                weightLogs={weightLogs}
                userId={user.id}
                theme={theme}
                onRefresh={loadData}
              />
            </>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 400,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  statsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
  },
  tertiarySection: {
    flexDirection: "row",
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 1,
  },
});
