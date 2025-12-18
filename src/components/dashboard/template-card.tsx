// components/dashboard/TemplateCard.tsx
import { MealTemplate } from "@/src/database/types";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface TemplateCardProps {
  template: MealTemplate;
  theme: any;
}

export default function TemplateCard({ template, theme }: TemplateCardProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: theme.background, borderColor: theme.icon + "20" },
      ]}
      activeOpacity={0.7}
    >
      <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
        {template.name}
      </Text>
      <View style={styles.macros}>
        <Text style={[styles.calories, { color: theme.icon }]}>
          {template.calories} cal
        </Text>
        <Text style={[styles.protein, { color: "#8B5CF6" }]}>
          {template.protein}g protein
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 160,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  name: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  macros: {
    gap: 4,
  },
  calories: {
    fontSize: 12,
  },
  protein: {
    fontSize: 12,
  },
});
