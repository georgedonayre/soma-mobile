import { formatDashboardDate } from "@/src/utils/dateHelper";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ContextHeaderProps {
  date: Date;
  streak: number;
  theme: any;
}

export default function ContextHeader({
  date,
  streak,
  theme,
}: ContextHeaderProps) {
  const { day, date: formattedDate } = formatDashboardDate(date);

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
      <View>
        <Text style={[styles.day, { color: theme.icon }]}>{day}</Text>
        <Text style={[styles.date, { color: theme.text }]}>
          {formattedDate}
        </Text>
      </View>

      {streak > 0 && (
        <View
          style={[styles.streakBadge, { backgroundColor: theme.tint + "20" }]}
        >
          <Ionicons name="flame" size={16} color={theme.tint} />
          <Text style={[styles.streakText, { color: theme.tint }]}>
            {streak} day streak
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  day: {
    fontSize: 14,
    marginBottom: 2,
  },
  date: {
    fontSize: 18,
    fontWeight: "600",
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  streakText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
