import TemplateCardCompact from "@/src/components/templates/template-card-compact";
import { useAppContext } from "@/src/context/app-context";
import {
  getAllTemplates,
  syncTemplatesFromSupabase,
} from "@/src/database/models/mealTemplateModel";
import { MealTemplate } from "@/src/database/types";
import { Colors } from "@/src/theme";
import { routes } from "@/src/utils/routes";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
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
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

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
    setIsMenuVisible(false);
    router.push(routes.createTemplateScreen);
  };

  const handleSyncTemplates = async () => {
    setIsMenuVisible(false);

    if (!user) {
      Alert.alert("Error", "User not found. Please try again.");
      return;
    }

    if (isSyncing) {
      return; // Prevent multiple simultaneous syncs
    }

    try {
      setIsSyncing(true);

      // Perform the sync
      const result = await syncTemplatesFromSupabase(user.id);

      if (result.error) {
        Alert.alert(
          "Sync Failed",
          `Unable to sync templates: ${result.error}`,
          [{ text: "OK" }]
        );
        return;
      }

      // Refresh the local templates list
      const updatedTemplates = await getAllTemplates(user.id);
      setTemplates(updatedTemplates);

      // Show success message
      if (result.synced > 0) {
        Alert.alert(
          "Sync Complete",
          `Successfully synced ${result.synced} ${
            result.synced === 1 ? "template" : "templates"
          }.`,
          [{ text: "OK" }]
        );
      } else {
        Alert.alert("Already Synced", "No new templates to sync from cloud.", [
          { text: "OK" },
        ]);
      }
    } catch (error) {
      console.error("Error syncing templates:", error);
      Alert.alert(
        "Sync Error",
        "An unexpected error occurred while syncing templates.",
        [{ text: "OK" }]
      );
    } finally {
      setIsSyncing(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
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
            onPress={toggleMenu}
            style={styles.menuButton}
            activeOpacity={0.7}
          >
            <Ionicons name="ellipsis-horizontal" size={24} color={theme.text} />
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

        {/* Action Menu Modal */}
        <Modal
          visible={isMenuVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsMenuVisible(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setIsMenuVisible(false)}
          >
            <View style={styles.menuContainer}>
              <View
                style={[
                  styles.menuContent,
                  {
                    backgroundColor: theme.cardBg,
                    borderColor: theme.border,
                  },
                ]}
              >
                {/* Create Template Action */}
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={handleCreateTemplate}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.menuIconContainer,
                      { backgroundColor: theme.tint + "15" },
                    ]}
                  >
                    <Ionicons name="add-circle" size={22} color={theme.tint} />
                  </View>
                  <View style={styles.menuTextContainer}>
                    <Text style={[styles.menuItemText, { color: theme.text }]}>
                      Create Template
                    </Text>
                    <Text
                      style={[
                        styles.menuItemDescription,
                        { color: theme.icon },
                      ]}
                    >
                      Add a new meal template
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={theme.icon}
                  />
                </TouchableOpacity>

                {/* Divider */}
                <View
                  style={[
                    styles.menuDivider,
                    { backgroundColor: theme.border },
                  ]}
                />

                {/* Sync Templates Action */}
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={handleSyncTemplates}
                  activeOpacity={0.7}
                  disabled={isSyncing}
                >
                  <View
                    style={[
                      styles.menuIconContainer,
                      {
                        backgroundColor: theme.tint + "15",
                        opacity: isSyncing ? 0.5 : 1,
                      },
                    ]}
                  >
                    {isSyncing ? (
                      <ActivityIndicator size="small" color={theme.tint} />
                    ) : (
                      <Ionicons name="sync" size={22} color={theme.tint} />
                    )}
                  </View>
                  <View style={styles.menuTextContainer}>
                    <Text
                      style={[
                        styles.menuItemText,
                        { color: theme.text, opacity: isSyncing ? 0.5 : 1 },
                      ]}
                    >
                      {isSyncing ? "Syncing..." : "Sync Templates"}
                    </Text>
                    <Text
                      style={[
                        styles.menuItemDescription,
                        { color: theme.icon, opacity: isSyncing ? 0.5 : 1 },
                      ]}
                    >
                      {isSyncing ? "Please wait" : "Update from cloud"}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={theme.icon}
                    style={{ opacity: isSyncing ? 0.5 : 1 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Modal>
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
  menuButton: {
    width: 40,
    height: 40,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  menuContainer: {
    marginTop: 60,
    marginRight: 16,
  },
  menuContent: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    minWidth: 280,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 12,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  menuTextContainer: {
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  menuItemDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  menuDivider: {
    height: 1,
    marginHorizontal: 16,
  },
});
