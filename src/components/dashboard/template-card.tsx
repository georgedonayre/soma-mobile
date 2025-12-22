// components/dashboard/TemplateCard.tsx
import { MealTemplate } from "@/src/database/types";
import { routes } from "@/src/utils/routes";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface TemplateCardProps {
  template: MealTemplate;
  theme: any;
}

export default function TemplateCard({ template, theme }: TemplateCardProps) {
  const handlePress = () => {
    router.push({
      pathname: routes.templateLogScreen,
      params: {
        template: JSON.stringify(template),
      },
    });
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: theme.cardBg,
          borderColor: theme.border,
        },
      ]}
      activeOpacity={0.7}
      onPress={handlePress}
    >
      {/* Template Name */}
      <Text style={[styles.name, { color: theme.text }]} numberOfLines={2}>
        {template.name}
      </Text>

      {/* Serving Size Badge */}
      <View
        style={[styles.servingBadge, { backgroundColor: theme.background }]}
      >
        <Text style={[styles.servingText, { color: theme.icon }]}>
          {template.serving_size}
          {template.serving_size_unit}
        </Text>
      </View>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      {/* Macros Grid */}
      <View style={styles.macrosGrid}>
        {/* Calories - Prominent */}
        <View style={styles.macroItemLarge}>
          <Text style={[styles.macroValueLarge, { color: theme.text }]}>
            {template.calories}
          </Text>
          <Text style={[styles.macroLabel, { color: theme.icon }]}>cal</Text>
        </View>

        {/* Protein - Highlighted */}
        <View style={styles.macroItem}>
          <Text style={[styles.macroValue, { color: theme.tint }]}>
            {template.protein}g
          </Text>
          <Text style={[styles.macroLabel, { color: theme.icon }]}>
            protein
          </Text>
        </View>

        {/* Carbs & Fat */}
        <View style={styles.macroRow}>
          <View style={styles.macroItemSmall}>
            <Text style={[styles.macroValueSmall, { color: theme.text }]}>
              {template.carbs}g
            </Text>
            <Text style={[styles.macroLabelSmall, { color: theme.icon }]}>
              carbs
            </Text>
          </View>
          <View style={styles.macroItemSmall}>
            <Text style={[styles.macroValueSmall, { color: theme.text }]}>
              {template.fat}g
            </Text>
            <Text style={[styles.macroLabelSmall, { color: theme.icon }]}>
              fat
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 180,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 20,
    minHeight: 40,
  },
  servingBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  servingText: {
    fontSize: 11,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    opacity: 0.3,
  },
  macrosGrid: {
    gap: 10,
  },
  macroItemLarge: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  macroValueLarge: {
    fontSize: 28,
    fontWeight: "700",
  },
  macroLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  macroItem: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  macroValue: {
    fontSize: 18,
    fontWeight: "600",
  },
  macroRow: {
    flexDirection: "row",
    gap: 16,
  },
  macroItemSmall: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
    flex: 1,
  },
  macroValueSmall: {
    fontSize: 15,
    fontWeight: "600",
  },
  macroLabelSmall: {
    fontSize: 11,
    fontWeight: "500",
  },
});
