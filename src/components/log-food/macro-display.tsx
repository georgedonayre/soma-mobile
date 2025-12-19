import React from "react";
import { StyleSheet, Text, View } from "react-native";

type MacroDisplayProps = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  theme: any;
};

export function MacroDisplay({
  calories,
  protein,
  carbs,
  fat,
  theme,
}: MacroDisplayProps) {
  return (
    <View style={[styles.container, { backgroundColor: theme.cardBg }]}>
      {/* Primary: Calories - Large and prominent */}
      <View style={styles.primaryMacro}>
        <Text style={[styles.calorieValue, { color: theme.text }]}>
          {calories}
        </Text>
        <Text style={[styles.calorieLabel, { color: theme.icon }]}>
          calories
        </Text>
      </View>

      <View style={styles.divider} />

      {/* Secondary: Protein - Medium prominence */}
      <View style={styles.secondaryMacro}>
        <View style={styles.macroRow}>
          <Text style={[styles.proteinValue, { color: theme.tint }]}>
            {protein}g
          </Text>
          <Text style={[styles.macroLabel, { color: theme.icon }]}>
            protein
          </Text>
        </View>

        {/* Tertiary: Carbs & Fat - Compact side by side */}
        <View style={styles.tertiaryRow}>
          <View style={styles.tertiaryMacro}>
            <Text style={[styles.tertiaryValue, { color: theme.text }]}>
              {carbs}g
            </Text>
            <Text style={[styles.tertiaryLabel, { color: theme.icon }]}>
              carbs
            </Text>
          </View>

          <View
            style={[styles.verticalDivider, { backgroundColor: theme.border }]}
          />

          <View style={styles.tertiaryMacro}>
            <Text style={[styles.tertiaryValue, { color: theme.text }]}>
              {fat}g
            </Text>
            <Text style={[styles.tertiaryLabel, { color: theme.icon }]}>
              fat
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  primaryMacro: {
    alignItems: "center",
    paddingBottom: 12,
  },
  calorieValue: {
    fontSize: 48,
    fontWeight: "700",
    lineHeight: 52,
  },
  calorieLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    opacity: 0.3,
  },
  secondaryMacro: {
    gap: 12,
  },
  macroRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  proteinValue: {
    fontSize: 24,
    fontWeight: "600",
  },
  macroLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  tertiaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  tertiaryMacro: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tertiaryValue: {
    fontSize: 18,
    fontWeight: "600",
  },
  tertiaryLabel: {
    fontSize: 13,
  },
  verticalDivider: {
    width: 1,
    height: 20,
  },
});
