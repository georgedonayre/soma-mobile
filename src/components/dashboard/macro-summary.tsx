// components/dashboard/MacroSummary.tsx
import { DailyTotals, MacroProgress } from "@/src/utils/macroCalculations";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface MacroSummaryProps {
  dailyTotals: DailyTotals;
  targets: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  progress: MacroProgress;
  theme: any;
}

export default function MacroSummary({
  dailyTotals,
  targets,
  progress,
  theme,
}: MacroSummaryProps) {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
          borderBottomColor: theme.icon + "20",
        },
      ]}
    >
      {/* Calories - Primary */}
      <View style={styles.caloriesSection}>
        <View style={styles.numberRow}>
          <Text style={[styles.caloriesNumber, { color: theme.text }]}>
            {dailyTotals.calories.toFixed(0)}
          </Text>
          <Text style={[styles.caloriesTarget, { color: theme.icon }]}>
            / {targets.calories}
          </Text>
        </View>
        <Text style={[styles.label, { color: theme.icon }]}>Calories</Text>
        <View
          style={[styles.progressBar, { backgroundColor: theme.icon + "20" }]}
        >
          <View
            style={[
              styles.progressFill,
              {
                width: `${progress.caloriesPercent}%`,
                backgroundColor: "#3B82F6",
              },
            ]}
          />
        </View>
      </View>

      {/* Protein - Secondary */}
      <View style={styles.proteinSection}>
        <View style={styles.numberRow}>
          <Text style={[styles.proteinNumber, { color: theme.text }]}>
            {dailyTotals.protein.toFixed(0)}g
          </Text>
          <Text style={[styles.proteinTarget, { color: theme.icon }]}>
            / {targets.protein}g
          </Text>
        </View>
        <Text style={[styles.label, { color: theme.icon }]}>Protein</Text>
        <View
          style={[
            styles.progressBar,
            styles.proteinBar,
            { backgroundColor: theme.icon + "20" },
          ]}
        >
          <View
            style={[
              styles.progressFill,
              {
                width: `${progress.proteinPercent}%`,
                backgroundColor: "#8B5CF6",
              },
            ]}
          />
        </View>
      </View>

      {/* Carbs & Fat - Tertiary */}
      <View
        style={[styles.tertiarySection, { borderTopColor: theme.icon + "15" }]}
      >
        <View style={styles.macroItem}>
          <Text style={[styles.tertiaryLabel, { color: theme.icon }]}>
            Carbs
          </Text>
          <Text style={[styles.tertiaryNumber, { color: theme.text }]}>
            {dailyTotals.carbs.toFixed(0)}g{" "}
            <Text style={[styles.tertiaryTarget, { color: theme.icon }]}>
              / {targets.carbs}g
            </Text>
          </Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={[styles.tertiaryLabel, { color: theme.icon }]}>Fat</Text>
          <Text style={[styles.tertiaryNumber, { color: theme.text }]}>
            {dailyTotals.fat.toFixed(0)}g{" "}
            <Text style={[styles.tertiaryTarget, { color: theme.icon }]}>
              / {targets.fat}g
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
  },
  caloriesSection: {
    marginBottom: 24,
  },
  numberRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 8,
  },
  caloriesNumber: {
    fontSize: 56,
    fontWeight: "700",
    letterSpacing: -2,
  },
  caloriesTarget: {
    fontSize: 20,
    marginLeft: 8,
  },
  label: {
    fontSize: 14,
    marginBottom: 12,
  },
  progressBar: {
    height: 12,
    borderRadius: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 6,
  },
  proteinSection: {
    marginBottom: 16,
  },
  proteinNumber: {
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: -1,
  },
  proteinTarget: {
    fontSize: 16,
    marginLeft: 6,
  },
  proteinBar: {
    height: 8,
  },
  tertiarySection: {
    flexDirection: "row",
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  macroItem: {
    flex: 1,
  },
  tertiaryLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  tertiaryNumber: {
    fontSize: 18,
    fontWeight: "600",
  },
  tertiaryTarget: {
    fontSize: 14,
  },
});
