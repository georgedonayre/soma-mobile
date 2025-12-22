// components/dashboard/Templates.tsx
import { MealTemplate } from "@/src/database/types";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import TemplateCard from "./template-card";

interface TemplatesProps {
  templates: MealTemplate[];
  theme: any;
  onCreateTemplate?: () => void;
}

export default function Templates({
  templates,
  theme,
  onCreateTemplate,
}: TemplatesProps) {
  // Empty state
  if (templates.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View
          style={[
            styles.emptyCard,
            { backgroundColor: theme.cardBg, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.emptyIcon]}>🍽️</Text>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            No templates yet
          </Text>
          <Text style={[styles.emptyDescription, { color: theme.icon }]}>
            Create meal templates to quickly log your favorite meals
          </Text>
          <TouchableOpacity
            style={[styles.createButton, { backgroundColor: theme.tint }]}
            onPress={onCreateTemplate}
            activeOpacity={0.7}
          >
            <Text style={styles.createButtonText}>Create Template</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>Quick Add</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {templates.map((template) => (
          <TemplateCard key={template.id} template={template} theme={theme} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingBottom: 32,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  emptyContainer: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  emptyCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 24,
    maxWidth: 280,
  },
  createButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    minWidth: 160,
    alignItems: "center",
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
