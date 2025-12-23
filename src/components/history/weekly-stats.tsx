import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface WeeklyStatsCardProps {
  label: string;
  value: number;
  unit: string;
  target: number;
  progress: number;
  theme: any;
  size: "large" | "medium" | "small";
}

const getProgressColor = (progress: number): string => {
  if (progress >= 95 && progress <= 105) return "#10b981"; // Green - on target
  if (progress >= 85 && progress <= 115) return "#f59e0b"; // Amber - close
  return "#ef4444"; // Red - off target
};

export default function WeeklyStatsCard({
  label,
  value,
  unit,
  target,
  progress,
  theme,
  size,
}: WeeklyStatsCardProps) {
  const progressColor = getProgressColor(progress);

  if (size === "large") {
    return (
      <View style={styles.largeSection}>
        <View style={styles.numberRow}>
          <Text style={[styles.largeNumber, { color: theme.text }]}>
            {value.toLocaleString()}
          </Text>
          <Text style={[styles.largeTarget, { color: theme.icon }]}>
            / {target.toLocaleString()}
          </Text>
        </View>
        <Text style={[styles.label, { color: theme.icon }]}>{label}</Text>
        <View
          style={[
            styles.largeProgressBar,
            { backgroundColor: theme.icon + "20" },
          ]}
        >
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(progress, 100)}%`,
                backgroundColor: progressColor,
              },
            ]}
          />
        </View>
      </View>
    );
  }

  if (size === "medium") {
    return (
      <View style={styles.mediumSection}>
        <View style={styles.numberRow}>
          <Text style={[styles.mediumNumber, { color: theme.text }]}>
            {value}
            {unit}
          </Text>
          <Text style={[styles.mediumTarget, { color: theme.icon }]}>
            / {target}
            {unit}
          </Text>
        </View>
        <Text style={[styles.label, { color: theme.icon }]}>{label}</Text>
        <View
          style={[
            styles.mediumProgressBar,
            { backgroundColor: theme.icon + "20" },
          ]}
        >
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(progress, 100)}%`,
                backgroundColor: progressColor,
              },
            ]}
          />
        </View>
      </View>
    );
  }

  // Small (Tertiary)
  return (
    <View style={styles.smallItem}>
      <Text style={[styles.smallLabel, { color: theme.icon }]}>{label}</Text>
      <Text style={[styles.smallNumber, { color: theme.text }]}>
        {value}
        {unit}{" "}
        <Text style={[styles.smallTarget, { color: theme.icon }]}>
          / {target}
          {unit}
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  numberRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    marginBottom: 12,
  },
  progressFill: {
    height: "100%",
    borderRadius: 6,
  },

  // Large (Primary - Calories)
  largeSection: {
    marginBottom: 24,
  },
  largeNumber: {
    fontSize: 56,
    fontWeight: "700",
    letterSpacing: -2,
  },
  largeTarget: {
    fontSize: 20,
    marginLeft: 8,
  },
  largeProgressBar: {
    height: 12,
    borderRadius: 6,
    overflow: "hidden",
  },

  // Medium (Secondary - Protein)
  mediumSection: {
    marginBottom: 16,
  },
  mediumNumber: {
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: -1,
  },
  mediumTarget: {
    fontSize: 16,
    marginLeft: 6,
  },
  mediumProgressBar: {
    height: 8,
    borderRadius: 6,
    overflow: "hidden",
  },

  // Small (Tertiary - Carbs/Fats)
  smallItem: {
    flex: 1,
  },
  smallLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  smallNumber: {
    fontSize: 18,
    fontWeight: "600",
  },
  smallTarget: {
    fontSize: 14,
  },
});
