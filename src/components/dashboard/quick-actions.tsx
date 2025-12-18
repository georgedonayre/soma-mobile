import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface QuickActionsProps {
  theme: any;
}

export default function QuickActions({ theme }: QuickActionsProps) {
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
      <View style={styles.actionsGrid}>
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryAction]}
          activeOpacity={0.7}
          onPress={() => router.push("/screens/food-search")}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
          <Text style={styles.primaryActionText}>Add Meal</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.secondaryAction,
            { backgroundColor: theme.icon + "15" },
          ]}
          activeOpacity={0.7}
        >
          <Ionicons name="camera" size={24} color={theme.text} />
          <Text style={[styles.secondaryActionText, { color: theme.text }]}>
            Scan
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.secondaryAction,
            { backgroundColor: theme.icon + "15" },
          ]}
          activeOpacity={0.7}
        >
          <Ionicons name="time" size={24} color={theme.text} />
          <Text style={[styles.secondaryActionText, { color: theme.text }]}>
            Recent
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  actionsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  primaryAction: {
    backgroundColor: "#3B82F6",
  },
  secondaryAction: {
    // backgroundColor set dynamically
  },
  primaryActionText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  secondaryActionText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
