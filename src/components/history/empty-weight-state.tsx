import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface EmptyWeightStateProps {
  theme: any;
  onLogWeight: () => void;
}

export default function EmptyWeightState({
  theme,
  onLogWeight,
}: EmptyWeightStateProps) {
  return (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyTitle, { color: theme.text }]}>
        No weight logs yet
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.icon }]}>
        Start tracking your weight to see your progress over time
      </Text>
      <TouchableOpacity
        style={[styles.ctaButton, { backgroundColor: theme.tint }]}
        onPress={onLogWeight}
        activeOpacity={0.8}
      >
        <Text style={styles.ctaButtonText}>Log Your Weight</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  ctaButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  ctaButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
