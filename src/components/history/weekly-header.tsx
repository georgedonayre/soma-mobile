import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface WeeklyHeaderProps {
  daysWithData: number;
  theme: any;
}

export default function WeeklyHeader({
  daysWithData,
  theme,
}: WeeklyHeaderProps) {
  return (
    <View style={styles.headerSection}>
      <Text style={[styles.subtitle, { color: theme.icon }]}>
        Last 7 Days Average
      </Text>
      {daysWithData > 0 && (
        <Text style={[styles.daysInfo, { color: theme.icon }]}>
          Based on {daysWithData} {daysWithData === 1 ? "day" : "days"} of data
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerSection: {
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  daysInfo: {
    fontSize: 13,
    fontWeight: "400",
  },
});
