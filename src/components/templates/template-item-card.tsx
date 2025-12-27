// components/templates/template-item-card.tsx

import { TemplateItem } from "@/src/database/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface TemplateItemCardProps {
  item: TemplateItem;
  onEdit: () => void;
  onDelete: () => void;
  theme: any;
  key: number;
}

export function TemplateItemCard({
  item,
  onEdit,
  onDelete,
  theme,
}: TemplateItemCardProps) {
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.cardBg, borderColor: theme.border },
      ]}
    >
      <View style={styles.content}>
        {/* Item Name & Serving */}
        <View style={styles.header}>
          <Ionicons
            name="restaurant"
            size={18}
            color={theme.tint}
            style={styles.icon}
          />
          <View style={styles.info}>
            <Text style={[styles.name, { color: theme.text }]}>
              {item.name}
            </Text>
            <Text style={[styles.serving, { color: theme.icon }]}>
              {item.serving_size}
              {item.serving_size_unit} • {item.calories} cal
            </Text>
          </View>
        </View>

        {/* Macros */}
        <View style={styles.macros}>
          <View style={styles.macroItem}>
            <Text style={[styles.macroValue, { color: theme.tint }]}>
              {item.protein}g
            </Text>
            <Text style={[styles.macroLabel, { color: theme.icon }]}>
              Protein
            </Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={[styles.macroValue, { color: theme.text }]}>
              {item.carbs}g
            </Text>
            <Text style={[styles.macroLabel, { color: theme.icon }]}>
              Carbs
            </Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={[styles.macroValue, { color: theme.text }]}>
              {item.fat}g
            </Text>
            <Text style={[styles.macroLabel, { color: theme.icon }]}>Fat</Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
          <Ionicons name="create-outline" size={20} color={theme.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  icon: {
    marginRight: 8,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },
  serving: {
    fontSize: 13,
  },
  macros: {
    flexDirection: "row",
    gap: 16,
  },
  macroItem: {
    alignItems: "center",
  },
  macroValue: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  macroLabel: {
    fontSize: 11,
  },
  actions: {
    justifyContent: "center",
    gap: 8,
    marginLeft: 8,
  },
  actionButton: {
    padding: 4,
  },
});
