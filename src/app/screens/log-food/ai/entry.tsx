import { Colors } from "@/src/theme";
import { estimateMealMacros } from "@/src/utils/apiService";
import { routes } from "@/src/utils/routes";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
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
import Toast from "react-native-toast-message";

export default function AILogFoodScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? "dark";
  const theme = Colors[colorScheme];

  const [mealDescription, setMealDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!mealDescription.trim()) {
      Toast.show({
        type: "error",
        text1: "Input Required",
        text2: "Please describe your meal.",
        position: "top",
        visibilityTime: 2000,
      });
      return;
    }

    setIsLoading(true);

    try {
      const estimate = await estimateMealMacros(mealDescription.trim());

      // Navigate to review screen with the estimate
      router.push({
        pathname: routes.aiReview,
        params: {
          estimate: JSON.stringify(estimate),
          originalInput: mealDescription.trim(),
        },
      });
    } catch (error) {
      console.error("Error analyzing meal:", error);
      Toast.show({
        type: "error",
        text1: "Analysis Failed",
        text2:
          "Unable to analyze your meal. Please try again or use manual entry.",
        position: "top",
        visibilityTime: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const exampleMeals = [
    "2 eggs scrambled with cheese",
    "Chicken breast with rice and broccoli",
    "Peanut butter sandwich on whole wheat",
    "Greek yogurt with berries and granola",
  ];

  const handleExamplePress = (example: string) => {
    setMealDescription(example);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            AI Meal Logger
          </Text>
          <View style={styles.backButton} />
        </View>

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Info Card */}
            <View style={[styles.infoCard, { backgroundColor: theme.cardBg }]}>
              <Ionicons
                name="sparkles"
                size={24}
                color={theme.tint}
                style={styles.infoIcon}
              />
              <Text style={[styles.infoTitle, { color: theme.text }]}>
                Describe Your Meal
              </Text>
              <Text style={[styles.infoText, { color: theme.icon }]}>
                Tell us what you ate, and AI will estimate the nutritional
                values for you. Be as specific as possible for better accuracy.
              </Text>
            </View>

            {/* Input Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Meal Description
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: theme.cardBg,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="e.g., 2 fried eggs with toast and butter..."
                placeholderTextColor={theme.icon}
                value={mealDescription}
                onChangeText={setMealDescription}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                editable={!isLoading}
              />
              <Text style={[styles.helperText, { color: theme.icon }]}>
                Include quantities, cooking methods, and ingredients for best
                results
              </Text>
            </View>

            {/* Example Meals */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Example Meals
              </Text>
              <View style={styles.examplesContainer}>
                {exampleMeals.map((example, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.exampleChip,
                      {
                        backgroundColor: theme.cardBg,
                        borderColor: theme.border,
                      },
                    ]}
                    onPress={() => handleExamplePress(example)}
                    disabled={isLoading}
                  >
                    <Text style={[styles.exampleText, { color: theme.text }]}>
                      {example}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Analyze Button */}
          <View style={[styles.footer, { borderTopColor: theme.border }]}>
            <TouchableOpacity
              style={[
                styles.analyzeButton,
                {
                  backgroundColor: theme.tint,
                  opacity: !mealDescription.trim() || isLoading ? 0.5 : 1,
                },
              ]}
              onPress={handleAnalyze}
              disabled={!mealDescription.trim() || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons
                    name="analytics"
                    size={20}
                    color="#FFFFFF"
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.analyzeButtonText}>Analyze with AI</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
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
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  infoCard: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  infoIcon: {
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 12,
  },
  textInput: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    fontSize: 15,
    minHeight: 120,
  },
  helperText: {
    fontSize: 13,
    marginTop: 8,
    opacity: 0.7,
  },
  examplesContainer: {
    gap: 8,
  },
  exampleChip: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  exampleText: {
    fontSize: 14,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  analyzeButton: {
    flexDirection: "row",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonIcon: {
    marginRight: 8,
  },
  analyzeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
