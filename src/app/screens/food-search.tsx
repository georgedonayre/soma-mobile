// app/food-search.tsx
import FoodResultCard from "@/src/components/food-search/food-result-card";
import { Colors } from "@/src/theme";
import { FoodSearchResult, searchFoods } from "@/src/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FoodSearchScreen() {
  const colorScheme = useColorScheme() ?? "dark";
  const theme = Colors[colorScheme];

  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<FoodSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounce search
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    const timer = setTimeout(() => {
      handleSearch(searchQuery);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = async (query: string) => {
    if (query.trim().length < 2) return;

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await searchFoods(query, 10);
      setResults(response.foods || []);
    } catch (err) {
      setError("Failed to search foods. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
          {/* Header with Back Button */}
          <View
            style={[styles.header, { borderBottomColor: theme.icon + "20" }]}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              Search Food
            </Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Search Bar */}
          <View
            style={[
              styles.searchContainer,
              { backgroundColor: theme.background },
            ]}
          >
            <View
              style={[
                styles.searchInputWrapper,
                {
                  backgroundColor: theme.icon + "10",
                  borderColor: theme.icon + "20",
                },
              ]}
            >
              <Ionicons
                name="search"
                size={20}
                color={theme.icon}
                style={styles.searchIcon}
              />
              <TextInput
                style={[styles.searchInput, { color: theme.text }]}
                placeholder="Search for food..."
                placeholderTextColor={theme.icon}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
                returnKeyType="search"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery("")}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close-circle" size={20} color={theme.icon} />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
          >
            {isLoading && (
              <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={theme.tint} />
                <Text style={[styles.loadingText, { color: theme.icon }]}>
                  Searching foods...
                </Text>
              </View>
            )}

            {error && !isLoading && (
              <View style={styles.centerContainer}>
                <Ionicons name="alert-circle" size={48} color={theme.icon} />
                <Text style={[styles.errorText, { color: theme.text }]}>
                  {error}
                </Text>
              </View>
            )}

            {!isLoading && !error && hasSearched && results.length === 0 && (
              <View style={styles.centerContainer}>
                <Ionicons name="search" size={48} color={theme.icon} />
                <Text style={[styles.emptyText, { color: theme.text }]}>
                  No foods found
                </Text>
                <Text style={[styles.emptySubtext, { color: theme.icon }]}>
                  Try a different search term
                </Text>
              </View>
            )}

            {!isLoading && !error && !hasSearched && (
              <View style={styles.centerContainer}>
                <Ionicons name="restaurant" size={48} color={theme.icon} />
                <Text style={[styles.emptyText, { color: theme.text }]}>
                  Start typing to search
                </Text>
                <Text style={[styles.emptySubtext, { color: theme.icon }]}>
                  Enter at least 2 characters
                </Text>
              </View>
            )}

            {!isLoading && results.length > 0 && (
              <>
                {results.map((food) => (
                  <FoodResultCard
                    key={food.fdcId}
                    food={food}
                    theme={theme}
                    onPress={() => {
                      // Placeholder - do nothing for now
                      console.log("Selected food:", food.description);
                    }}
                  />
                ))}

                {/* Show More Button - Placeholder */}
                <TouchableOpacity
                  style={[
                    styles.showMoreButton,
                    { borderColor: theme.icon + "20" },
                  ]}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.showMoreText, { color: theme.text }]}>
                    Show More Results
                  </Text>
                  <Ionicons name="chevron-down" size={20} color={theme.icon} />
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
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
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  headerSpacer: {
    width: 32,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  centerContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 8,
  },
  errorText: {
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "500",
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
  },
  showMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
    gap: 8,
  },
  showMoreText: {
    fontSize: 15,
    fontWeight: "500",
  },
});
