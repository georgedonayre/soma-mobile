import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface EmptyWeeklyStateProps {
  theme: any;
}

export default function EmptyWeeklyState({ theme }: EmptyWeeklyStateProps) {
  return (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyTitle, { color: theme.text }]}>
        No meals logged yet
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.icon }]}>
        Start logging your meals to see your weekly averages
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
  },
});
