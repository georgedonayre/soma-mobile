import { DISPLAY_LIMIT } from "@/src/config/constants";
import { MealTemplate } from "@/src/database/types";
import { routes } from "@/src/utils/routes";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
  onLongPress: () => void;
}

export default function Templates({
  templates,
  theme,
  onLongPress,
}: TemplatesProps) {
  const router = useRouter();

  const handleCreateTemplate = () => {
    router.push(routes.createTemplateScreen);
  };

  const handleSeeAll = () => {
    console.log("See all templates");
    router.push(routes.templatesHomeScreen);
  };

  const displayedTemplates = templates.slice(0, DISPLAY_LIMIT);
  const hasMore = templates.length > DISPLAY_LIMIT;

  return (
    <View style={styles.container}>
      {/* Section Header with Create Button */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: theme.tint + "20" },
            ]}
          >
            <Ionicons name="fast-food" size={20} color={theme.tint} />
          </View>
          <View>
            <Text style={[styles.title, { color: theme.text }]}>Quick Add</Text>
            <Text style={[styles.subtitle, { color: theme.icon }]}>
              {templates.length}{" "}
              {templates.length === 1 ? "template" : "templates"}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: theme.tint }]}
          onPress={handleCreateTemplate}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.createButtonText}>Create</Text>
        </TouchableOpacity>
      </View>

      {/* Templates List or Empty State */}
      {templates.length === 0 ? (
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
              Create meal templates to quickly log your favorite meals and save
              time
            </Text>
          </View>
        </View>
      ) : (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {displayedTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                theme={theme}
                onLongPress={onLongPress}
              />
            ))}

            {/* See All Card - Only show if there are more templates */}
            {hasMore && (
              <TouchableOpacity
                style={[
                  styles.seeAllCard,
                  {
                    backgroundColor: theme.cardBg,
                    borderColor: theme.border,
                  },
                ]}
                onPress={handleSeeAll}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.seeAllIconContainer,
                    { backgroundColor: theme.tint + "15" },
                  ]}
                >
                  <Ionicons name="grid-outline" size={32} color={theme.tint} />
                </View>
                <Text style={[styles.seeAllText, { color: theme.text }]}>
                  See All
                </Text>
                <Text style={[styles.seeAllCount, { color: theme.icon }]}>
                  +{templates.length - DISPLAY_LIMIT} more
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.icon}
                  style={styles.seeAllArrow}
                />
              </TouchableOpacity>
            )}
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    opacity: 0.7,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  emptyContainer: {
    paddingHorizontal: 20,
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
    maxWidth: 280,
  },
  seeAllCard: {
    width: 180,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  seeAllIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  seeAllText: {
    fontSize: 16,
    fontWeight: "600",
  },
  seeAllCount: {
    fontSize: 13,
    fontWeight: "500",
  },
  seeAllArrow: {
    marginTop: 4,
  },
});
