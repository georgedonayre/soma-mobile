// components/template/template-form.tsx
import { Colors } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
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

type Macros = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

interface TemplateFormProps {
  // Header
  title: string;
  onBack: () => void;

  // Pre-populated data (for AI-assisted creation)
  initialName?: string;
  initialMacros?: Macros;
  initialServingSize?: number;
  initialServingSizeUnit?: string;

  // Actions
  onConfirm: (data: {
    name: string;
    macros: Macros;
    servingSize: number;
    servingSizeUnit: string;
  }) => void;
  confirmButtonText?: string;
  isLoading?: boolean;
}

export function TemplateForm({
  title,
  onBack,
  initialName = "",
  initialMacros = { calories: 0, protein: 0, carbs: 0, fat: 0 },
  initialServingSize = 100,
  initialServingSizeUnit = "g",
  onConfirm,
  confirmButtonText = "Create Template",
  isLoading = false,
}: TemplateFormProps) {
  const colorScheme = useColorScheme() ?? "dark";
  const theme = Colors[colorScheme];

  // Form state - use empty strings for zero values to avoid having to delete '0'
  const [name, setName] = useState(initialName);
  const [calories, setCalories] = useState(
    initialMacros.calories > 0 ? initialMacros.calories.toString() : ""
  );
  const [protein, setProtein] = useState(
    initialMacros.protein > 0 ? initialMacros.protein.toString() : ""
  );
  const [carbs, setCarbs] = useState(
    initialMacros.carbs > 0 ? initialMacros.carbs.toString() : ""
  );
  const [fat, setFat] = useState(
    initialMacros.fat > 0 ? initialMacros.fat.toString() : ""
  );
  const [servingSize, setServingSize] = useState(
    initialServingSize > 0 ? initialServingSize.toString() : ""
  );
  const [servingSizeUnit] = useState(initialServingSizeUnit);

  // Validation errors
  const [nameError, setNameError] = useState("");
  const [caloriesError, setCaloriesError] = useState("");
  const [proteinError, setProteinError] = useState("");
  const [carbsError, setCarbsError] = useState("");
  const [fatError, setFatError] = useState("");
  const [servingSizeError, setServingSizeError] = useState("");

  const validateNumber = (
    value: string,
    min: number,
    max: number
  ): number | null => {
    // Treat empty string as 0
    if (value.trim() === "") {
      return 0;
    }
    const num = parseFloat(value);
    if (isNaN(num) || num < min || num > max) {
      return null;
    }
    return num;
  };

  const handleConfirmPress = () => {
    // Reset errors
    setNameError("");
    setCaloriesError("");
    setProteinError("");
    setCarbsError("");
    setFatError("");
    setServingSizeError("");

    let hasError = false;

    // Validate name
    if (!name.trim()) {
      setNameError("Template name is required");
      hasError = true;
    }

    // Validate macros
    const validCalories = validateNumber(calories, 0, 10000);
    if (validCalories === null) {
      setCaloriesError("Enter calories between 0-10000");
      hasError = true;
    }

    const validProtein = validateNumber(protein, 0, 1000);
    if (validProtein === null) {
      setProteinError("Enter protein between 0-1000g");
      hasError = true;
    }

    const validCarbs = validateNumber(carbs, 0, 1000);
    if (validCarbs === null) {
      setCarbsError("Enter carbs between 0-1000g");
      hasError = true;
    }

    const validFat = validateNumber(fat, 0, 1000);
    if (validFat === null) {
      setFatError("Enter fat between 0-1000g");
      hasError = true;
    }

    const validServingSize = validateNumber(servingSize, 0.1, 10000);
    if (validServingSize === null || validServingSize === 0) {
      setServingSizeError("Enter valid serving size (min 0.1)");
      hasError = true;
    }

    if (hasError) return;

    onConfirm({
      name: name.trim(),
      macros: {
        calories: validCalories!,
        protein: validProtein!,
        carbs: validCarbs!,
        fat: validFat!,
      },
      servingSize: validServingSize!,
      servingSizeUnit,
    });
  };

  const renderInput = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    error: string,
    placeholder: string,
    keyboardType: "default" | "numeric" = "default",
    suffix?: string
  ) => (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.cardBg,
              color: theme.text,
              borderColor: error ? "#EF4444" : theme.border,
            },
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.icon}
          keyboardType={keyboardType}
          autoCapitalize={keyboardType === "default" ? "words" : "none"}
          autoCorrect={false}
        />
        {suffix && (
          <Text style={[styles.suffix, { color: theme.icon }]}>{suffix}</Text>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );

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

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Template Name */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Template Information
            </Text>
            {renderInput(
              "Template Name",
              name,
              setName,
              nameError,
              "e.g., Breakfast Smoothie, Chicken & Rice"
            )}
          </View>

          {/* Nutrition Facts */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Nutrition Facts
            </Text>
            <View style={[styles.macroCard, { backgroundColor: theme.cardBg }]}>
              {/* Calories - Large and prominent */}
              <View style={styles.calorieGroup}>
                <Text style={[styles.calorieLabel, { color: theme.icon }]}>
                  Calories
                </Text>
                <TextInput
                  style={[
                    styles.calorieInput,
                    {
                      color: theme.text,
                      borderBottomColor: caloriesError
                        ? "#EF4444"
                        : theme.border,
                    },
                  ]}
                  value={calories}
                  onChangeText={setCalories}
                  placeholder="0"
                  placeholderTextColor={theme.icon}
                  keyboardType="numeric"
                />
                {caloriesError ? (
                  <Text style={styles.errorTextSmall}>{caloriesError}</Text>
                ) : null}
              </View>

              <View
                style={[styles.divider, { backgroundColor: theme.border }]}
              />

              {/* Protein - Medium prominence */}
              <View style={styles.macroGroup}>
                <Text style={[styles.macroLabelMain, { color: theme.icon }]}>
                  Protein
                </Text>
                <View style={styles.macroInputWrapper}>
                  <TextInput
                    style={[
                      styles.macroInput,
                      {
                        color: theme.tint,
                        borderBottomColor: proteinError
                          ? "#EF4444"
                          : theme.border,
                      },
                    ]}
                    value={protein}
                    onChangeText={setProtein}
                    placeholder="0"
                    placeholderTextColor={theme.icon}
                    keyboardType="numeric"
                  />
                  <Text style={[styles.unit, { color: theme.icon }]}>g</Text>
                </View>
                {proteinError ? (
                  <Text style={styles.errorTextSmall}>{proteinError}</Text>
                ) : null}
              </View>

              {/* Carbs & Fat - Side by side */}
              <View style={styles.tertiaryRow}>
                <View style={styles.tertiaryGroup}>
                  <Text style={[styles.tertiaryLabel, { color: theme.icon }]}>
                    Carbs
                  </Text>
                  <View style={styles.tertiaryInputWrapper}>
                    <TextInput
                      style={[
                        styles.tertiaryInput,
                        {
                          color: theme.text,
                          borderBottomColor: carbsError
                            ? "#EF4444"
                            : theme.border,
                        },
                      ]}
                      value={carbs}
                      onChangeText={setCarbs}
                      placeholder="0"
                      placeholderTextColor={theme.icon}
                      keyboardType="numeric"
                    />
                    <Text style={[styles.unitSmall, { color: theme.icon }]}>
                      g
                    </Text>
                  </View>
                  {carbsError ? (
                    <Text style={styles.errorTextSmall}>{carbsError}</Text>
                  ) : null}
                </View>

                <View
                  style={[
                    styles.verticalDivider,
                    { backgroundColor: theme.border },
                  ]}
                />

                <View style={styles.tertiaryGroup}>
                  <Text style={[styles.tertiaryLabel, { color: theme.icon }]}>
                    Fat
                  </Text>
                  <View style={styles.tertiaryInputWrapper}>
                    <TextInput
                      style={[
                        styles.tertiaryInput,
                        {
                          color: theme.text,
                          borderBottomColor: fatError
                            ? "#EF4444"
                            : theme.border,
                        },
                      ]}
                      value={fat}
                      onChangeText={setFat}
                      placeholder="0"
                      placeholderTextColor={theme.icon}
                      keyboardType="numeric"
                    />
                    <Text style={[styles.unitSmall, { color: theme.icon }]}>
                      g
                    </Text>
                  </View>
                  {fatError ? (
                    <Text style={styles.errorTextSmall}>{fatError}</Text>
                  ) : null}
                </View>
              </View>
            </View>
          </View>

          {/* Serving Size */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Serving Size
            </Text>
            {renderInput(
              "Amount",
              servingSize,
              setServingSize,
              servingSizeError,
              "100",
              "numeric",
              servingSizeUnit
            )}
            <Text style={[styles.helperText, { color: theme.icon }]}>
              This represents the portion size these nutrition facts are based
              on
            </Text>
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
      </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  suffix: {
    position: "absolute",
    right: 16,
    fontSize: 16,
    fontWeight: "500",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 13,
    marginTop: 6,
  },
  errorTextSmall: {
    color: "#EF4444",
    fontSize: 11,
    marginTop: 4,
  },
  helperText: {
    fontSize: 13,
    marginTop: 8,
    opacity: 0.7,
  },
  macroCard: {
    borderRadius: 12,
    padding: 20,
    gap: 16,
  },
  calorieGroup: {
    alignItems: "center",
    paddingBottom: 12,
  },
  calorieLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  calorieInput: {
    fontSize: 48,
    fontWeight: "700",
    textAlign: "center",
    borderBottomWidth: 2,
    paddingHorizontal: 20,
    paddingVertical: 8,
    minWidth: 120,
  },
  divider: {
    height: 1,
    opacity: 0.3,
  },
  macroGroup: {
    gap: 8,
  },
  macroLabelMain: {
    fontSize: 14,
    fontWeight: "500",
  },
  macroInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  macroInput: {
    fontSize: 24,
    fontWeight: "600",
    borderBottomWidth: 2,
    paddingHorizontal: 12,
    paddingVertical: 4,
    minWidth: 80,
  },
  unit: {
    fontSize: 18,
    fontWeight: "500",
  },
  tertiaryRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  tertiaryGroup: {
    flex: 1,
    gap: 8,
  },
  tertiaryLabel: {
    fontSize: 13,
    fontWeight: "500",
  },
  tertiaryInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tertiaryInput: {
    fontSize: 18,
    fontWeight: "600",
    borderBottomWidth: 2,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 60,
  },
  unitSmall: {
    fontSize: 14,
    fontWeight: "500",
  },
  verticalDivider: {
    width: 1,
    height: 60,
    marginTop: 20,
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
