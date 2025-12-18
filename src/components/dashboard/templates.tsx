// components/dashboard/Templates.tsx
import { MealTemplate } from "@/src/database/types";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import TemplateCard from "./template-card";

interface TemplatesProps {
  templates: MealTemplate[];
  theme: any;
}

export default function Templates({ templates, theme }: TemplatesProps) {
  if (templates.length === 0) {
    return null;
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
});
