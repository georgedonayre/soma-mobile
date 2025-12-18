// components/food-search/FoodResultCard.tsx
import { FoodSearchResult, getFoodMacros } from "@/src/utils/api";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface FoodResultCardProps {
  food: FoodSearchResult;
  theme: any;
  onPress?: () => void;
}

export default function FoodResultCard({
  food,
  theme,
  onPress,
}: FoodResultCardProps) {
  const macros = getFoodMacros(food);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: theme.background, borderColor: theme.icon + "20" },
      ]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.content}>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={2}>
          {food.description}
        </Text>

        {food.brandOwner && (
          <Text style={[styles.brand, { color: theme.icon }]} numberOfLines={1}>
            {food.brandOwner}
          </Text>
        )}

        <View style={styles.macrosRow}>
          <View style={styles.macroItem}>
            <Text style={[styles.macroValue, { color: theme.text }]}>
              {Math.round(macros.calories)}
            </Text>
            <Text style={[styles.macroLabel, { color: theme.icon }]}>cal</Text>
          </View>

          <View style={styles.macroDivider} />

          <View style={styles.macroItem}>
            <Text style={[styles.macroValue, { color: "#8B5CF6" }]}>
              {Math.round(macros.protein)}g
            </Text>
            <Text style={[styles.macroLabel, { color: theme.icon }]}>
              protein
            </Text>
          </View>

          <View style={styles.macroDivider} />

          <View style={styles.macroItem}>
            <Text style={[styles.macroValue, { color: theme.text }]}>
              {Math.round(macros.carbs)}g
            </Text>
            <Text style={[styles.macroLabel, { color: theme.icon }]}>
              carbs
            </Text>
          </View>

          <View style={styles.macroDivider} />

          <View style={styles.macroItem}>
            <Text style={[styles.macroValue, { color: theme.text }]}>
              {Math.round(macros.fat)}g
            </Text>
            <Text style={[styles.macroLabel, { color: theme.icon }]}>fat</Text>
          </View>
        </View>

        {food.servingSize && food.servingSizeUnit && (
          <Text style={[styles.serving, { color: theme.icon }]}>
            Serving: {food.servingSize} {food.servingSizeUnit}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  content: {
    gap: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 22,
  },
  brand: {
    fontSize: 13,
    marginTop: -4,
  },
  macrosRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  macroItem: {
    flex: 1,
    alignItems: "center",
  },
  macroValue: {
    fontSize: 15,
    fontWeight: "600",
  },
  macroLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  macroDivider: {
    width: 1,
    height: 24,
    backgroundColor: "#E0E0E0",
    opacity: 0.3,
  },
  serving: {
    fontSize: 12,
    marginTop: 4,
  },
});
