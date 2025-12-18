// components/dashboard/ProgressIndicator.tsx
import {
  MacroProgress,
  getProgressStatus,
} from "@/src/utils/macroCalculations";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ProgressIndicatorProps {
  progress: MacroProgress;
  streak: number;
  theme: any;
}

export default function ProgressIndicator({
  progress,
  streak,
  theme,
}: ProgressIndicatorProps) {
  const status = getProgressStatus(progress);
  const avgProgress = Math.round(
    (progress.caloriesPercent + progress.proteinPercent) / 2
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.tint }]}>
      <View style={styles.iconContainer}>
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: "rgba(255, 255, 255, 0.2)" },
          ]}
        >
          <Ionicons name="trending-up" size={20} color="#FFFFFF" />
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.statusText}>{status}</Text>
        <Text style={styles.detailText}>
          {avgProgress}% to goal • Great pace
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  detailText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
  },
});
