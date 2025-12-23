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

  const cardStyles =
    size === "large"
      ? styles.largeCard
      : size === "medium"
      ? styles.mediumCard
      : styles.smallCard;

  const valueStyles =
    size === "large"
      ? styles.largeValue
      : size === "medium"
      ? styles.mediumValue
      : styles.smallValue;

  const unitStyles =
    size === "large"
      ? styles.largeUnit
      : size === "medium"
      ? styles.mediumUnit
      : styles.smallUnit;

  const labelStyles =
    size === "large"
      ? styles.largeLabel
      : size === "medium"
      ? styles.mediumLabel
      : styles.smallLabel;

  const progressBarStyles =
    size === "large"
      ? styles.largeProgressBar
      : size === "medium"
      ? styles.mediumProgressBar
      : styles.smallProgressBar;

  const showBadge = size === "large" || size === "medium";

  return (
    <View
      style={[
        cardStyles,
        {
          backgroundColor: theme.cardBg,
          borderColor: theme.border,
        },
      ]}
    >
      <View style={styles.cardHeader}>
        <Text style={[labelStyles, { color: theme.icon }]}>{label}</Text>
        {showBadge && (
          <View
            style={[
              styles.badge,
              {
                backgroundColor: `${progressColor}15`,
              },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                {
                  color: progressColor,
                },
              ]}
            >
              {Math.round(progress)}%
            </Text>
          </View>
        )}
      </View>

      <View style={styles.valueContainer}>
        <Text style={[valueStyles, { color: theme.text }]}>
          {size === "large" ? value.toLocaleString() : value}
        </Text>
        <Text style={[unitStyles, { color: theme.icon }]}>{unit}</Text>
      </View>

      <View style={styles.targetRow}>
        <Text style={[styles.targetText, { color: theme.icon }]}>
          {size === "small"
            ? `of ${target}${unit}`
            : `Target: ${target}${unit}`}
        </Text>
      </View>

      <View style={[progressBarStyles, { backgroundColor: theme.border }]}>
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

const styles = StyleSheet.create({
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "700",
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 12,
  },
  targetRow: {
    marginBottom: 16,
  },
  targetText: {
    fontSize: 14,
    fontWeight: "500",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },

  // Large (Primary - Calories)
  largeCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  largeLabel: {
    fontSize: 16,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  largeValue: {
    fontSize: 56,
    fontWeight: "700",
    letterSpacing: -1,
  },
  largeUnit: {
    fontSize: 20,
    fontWeight: "500",
    marginLeft: 8,
  },
  largeProgressBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },

  // Medium (Secondary - Protein)
  mediumCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  mediumLabel: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  mediumValue: {
    fontSize: 40,
    fontWeight: "700",
  },
  mediumUnit: {
    fontSize: 18,
    fontWeight: "500",
    marginLeft: 6,
  },
  mediumProgressBar: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },

  // Small (Tertiary - Carbs/Fats)
  smallCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  smallLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  smallValue: {
    fontSize: 28,
    fontWeight: "700",
  },
  smallUnit: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
  smallProgressBar: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
});
