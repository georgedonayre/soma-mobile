// components/log-food/meal-form.tsx
import { MacroDisplay } from "@/src/components/log-food/macro-display";
import { QuickSelectPresets } from "@/src/components/log-food/quick-select-presets";
import { ServingSizeInput } from "@/src/components/log-food/serving-size-input";
import { useServingSize } from "@/src/hooks/use-serving-size";
import { Colors } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { ReactNode } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Macros = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

interface MealFormProps {
  // Header props
  title: string;
  onBack: () => void;

  // Food/meal info
  mealName: string;
  mealSubtitle?: string;
  headerContent?: ReactNode; // For custom header content (like AI badges, brand names, etc.)

  // Macros
  baseMacros: Macros;
  originalServingSize?: number;
  servingSizeUnit?: string;

  // Actions
  onConfirm: (adjustedMacros: Macros) => void;
  confirmButtonText?: string;
  isLoading?: boolean;

  // Optional additional content
  children?: ReactNode; // For extra sections between header and macros
}

export function MealForm({
  title,
  onBack,
  mealName,
  mealSubtitle,
  headerContent,
  baseMacros,
  originalServingSize = 100,
  servingSizeUnit = "g",
  onConfirm,
  confirmButtonText = "Confirm & Log Meal",
  isLoading = false,
  children,
}: MealFormProps) {
  const colorScheme = useColorScheme() ?? "dark";
  const theme = Colors[colorScheme];

  // Use custom hook for serving size logic
  const {
    servingSize,
    servingSizeText,
    adjustedMacros,
    handleServingSizeChange,
    handleTextInputChange,
  } = useServingSize(originalServingSize, baseMacros);

  const handleConfirmPress = () => {
    if (!adjustedMacros) return;
    onConfirm(adjustedMacros);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>{title}</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Meal Info Card */}
        <View style={[styles.mealCard, { backgroundColor: theme.cardBg }]}>
          {headerContent}
          <Text style={[styles.mealName, { color: theme.text }]}>
            {mealName}
          </Text>
          {mealSubtitle && (
            <Text style={[styles.mealSubtitle, { color: theme.icon }]}>
              {mealSubtitle}
            </Text>
          )}
        </View>

        {/* Custom content (like original input, assumptions, etc.) */}
        {children}

        {/* Macros Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Nutrition Facts
          </Text>
          <MacroDisplay
            calories={adjustedMacros?.calories || 0}
            protein={adjustedMacros?.protein || 0}
            carbs={adjustedMacros?.carbs || 0}
            fat={adjustedMacros?.fat || 0}
            theme={theme}
          />
        </View>

        {/* Serving Size Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {servingSizeUnit === "g" && originalServingSize === 100
              ? "Adjust Portion"
              : "Serving Size"}
          </Text>
          {servingSizeUnit === "g" && originalServingSize === 100 && (
            <Text style={[styles.sectionSubtitle, { color: theme.icon }]}>
              Change the percentage if you ate more or less than described
            </Text>
          )}
          <ServingSizeInput
            servingSize={servingSize}
            servingSizeText={servingSizeText}
            servingSizeUnit={servingSizeUnit}
            onValueChange={handleServingSizeChange}
            onTextChange={handleTextInputChange}
            theme={theme}
          />
        </View>

        {/* Quick Serving Presets */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Quick{" "}
            {servingSizeUnit === "g" && originalServingSize === 100
              ? "Adjust"
              : "Select"}
          </Text>
          <QuickSelectPresets
            originalServingSize={originalServingSize}
            currentServingSize={servingSize}
            onSelect={handleServingSizeChange}
            theme={theme}
          />
        </View>
      </ScrollView>

      {/* Confirm Button */}
      <View style={[styles.footer, { borderTopColor: theme.border }]}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            {
              backgroundColor: theme.tint,
              opacity: isLoading ? 0.5 : 1,
            },
          ]}
          onPress={handleConfirmPress}
          disabled={isLoading}
        >
          <Text style={styles.confirmButtonText}>{confirmButtonText}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  mealCard: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
  },
  mealName: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 22,
  },
  mealSubtitle: {
    fontSize: 13,
    marginTop: 4,
    opacity: 0.7,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    marginBottom: 12,
    opacity: 0.7,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  confirmButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
