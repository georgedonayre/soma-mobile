import TemplateCardCompact from "@/src/components/templates/template-card-compact";
import { useAppContext } from "@/src/context/app-context";
import { getAllTemplates } from "@/src/database/models/mealTemplateModel";
import { MealTemplate } from "@/src/database/types";
import { Colors } from "@/src/theme";
import { routes } from "@/src/utils/routes";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TemplatesHomeScreen() {
  const colorScheme = useColorScheme() ?? "dark";
  const theme = Colors[colorScheme];
  const router = useRouter();

  const { user, isDbReady } = useAppContext();
  const [templates, setTemplates] = useState<MealTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isDbReady || !user) return;

    const loadTemplates = async () => {
      try {
        setIsLoading(true);
        const allTemplates = await getAllTemplates(user.id);
        setTemplates(allTemplates);
      } catch (error) {
        console.error("Failed to load templates:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplates();
  }, [user, isDbReady]);

  const handleBack = () => {
    router.back();
  };

  const handleCreateTemplate = () => {
    router.push(routes.createTemplateScreen);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
        edges={["top"]}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Meal Templates
          </Text>
          <TouchableOpacity
            onPress={handleCreateTemplate}
            style={[styles.createButton, { backgroundColor: theme.tint }]}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Search Bar (UI only) */}
        <View style={styles.searchContainer}>
          <View
            style={[
              styles.searchBar,
              { backgroundColor: theme.cardBg, borderColor: theme.border },
            ]}
          >
            <Ionicons name="search" size={20} color={theme.icon} />
            <TextInput
              style={[styles.searchInput, { color: theme.text }]}
              placeholder="Search templates…"
              placeholderTextColor={theme.icon}
              editable={false}
            />
          </View>
        </View>

        {/* Templates Count */}
        <View style={styles.countContainer}>
          <Text style={[styles.countText, { color: theme.icon }]}>
            {templates.length}{" "}
            {templates.length === 1 ? "template" : "templates"}
          </Text>
        </View>

        {/* Templates List */}
        {templates.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyIcon]}>🍽️</Text>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              No templates yet
            </Text>
            <Text style={[styles.emptyDescription, { color: theme.icon }]}>
              Create your first meal template to get started
            </Text>
          </View>
        ) : (
          <FlatList
            data={templates}
            renderItem={({ item }) => (
              <TemplateCardCompact template={item} theme={theme} />
            )}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 8,
  },
  createButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  countContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  countText: {
    fontSize: 13,
    fontWeight: "500",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    maxWidth: 280,
  },
});
