import { Colors } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
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

interface BarcodeFoodFormProps {
  barcode: string;
  onSubmit: (data: {
    product_name: string;
    serving_size: number;
    serving_unit: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }) => void;
  onCancel: () => void;
}

export default function BarcodeFoodForm({
  barcode,
  onSubmit,
  onCancel,
}: BarcodeFoodFormProps) {
  const colorScheme = useColorScheme() ?? "dark";
  const theme = Colors[colorScheme];

  const [productName, setProductName] = useState("");
  const [servingSize, setServingSize] = useState("");
  const [servingUnit, setServingUnit] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");

  const handleSubmit = () => {
    // Validation
    if (!productName.trim()) {
      Alert.alert("Missing Information", "Please enter the product name");
      return;
    }
    if (
      !servingSize ||
      isNaN(Number(servingSize)) ||
      Number(servingSize) <= 0
    ) {
      Alert.alert("Invalid Input", "Please enter a valid serving size");
      return;
    }
    if (!servingUnit.trim()) {
      Alert.alert(
        "Missing Information",
        "Please enter the serving unit (e.g., g, ml, cup)"
      );
      return;
    }
    if (!calories || isNaN(Number(calories)) || Number(calories) < 0) {
      Alert.alert("Invalid Input", "Please enter valid calories");
      return;
    }
    if (!protein || isNaN(Number(protein)) || Number(protein) < 0) {
      Alert.alert("Invalid Input", "Please enter valid protein");
      return;
    }
    if (!carbs || isNaN(Number(carbs)) || Number(carbs) < 0) {
      Alert.alert("Invalid Input", "Please enter valid carbs");
      return;
    }
    if (!fat || isNaN(Number(fat)) || Number(fat) < 0) {
      Alert.alert("Invalid Input", "Please enter valid fat");
      return;
    }

    onSubmit({
      product_name: productName.trim(),
      serving_size: Number(servingSize),
      serving_unit: servingUnit.trim(),
      calories: Number(calories),
      protein: Number(protein),
      carbs: Number(carbs),
      fat: Number(fat),
    });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={onCancel} style={styles.backButton}>
            <Ionicons name="close" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Add New Product
          </Text>
          <View style={styles.backButton} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Info Card */}
          <View style={[styles.infoCard, { backgroundColor: theme.cardBg }]}>
            <Ionicons name="information-circle" size={24} color={theme.tint} />
            <View style={styles.infoTextContainer}>
              <Text style={[styles.infoTitle, { color: theme.text }]}>
                Help Us Build the Database
              </Text>
              <Text style={[styles.infoText, { color: theme.icon }]}>
                This barcode isn&apos;t in our system yet. Your contribution
                helps other users! Please fill out the nutritional information.
              </Text>
            </View>
          </View>

          {/* Barcode Display */}
          <View style={[styles.barcodeCard, { backgroundColor: theme.cardBg }]}>
            <Text style={[styles.barcodeLabel, { color: theme.icon }]}>
              Barcode
            </Text>
            <Text style={[styles.barcodeText, { color: theme.text }]}>
              {barcode}
            </Text>
          </View>

          {/* Product Name */}
          <View style={styles.inputSection}>
            <Text style={[styles.label, { color: theme.text }]}>
              Product Name *
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.cardBg,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              placeholder="e.g., Greek Yogurt"
              placeholderTextColor={theme.icon}
              value={productName}
              onChangeText={setProductName}
            />
          </View>

          {/* Serving Size Row */}
          <View style={styles.inputSection}>
            <Text style={[styles.label, { color: theme.text }]}>
              Serving Size *
            </Text>
            <View style={styles.row}>
              <TextInput
                style={[
                  styles.input,
                  styles.halfInput,
                  {
                    backgroundColor: theme.cardBg,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="100"
                placeholderTextColor={theme.icon}
                value={servingSize}
                onChangeText={setServingSize}
                keyboardType="decimal-pad"
              />
              <TextInput
                style={[
                  styles.input,
                  styles.halfInput,
                  {
                    backgroundColor: theme.cardBg,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="g, ml, cup"
                placeholderTextColor={theme.icon}
                value={servingUnit}
                onChangeText={setServingUnit}
              />
            </View>
          </View>

          {/* Nutrition Facts */}
          <View style={styles.inputSection}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Nutrition Facts (per serving)
            </Text>

            {/* Calories */}
            <View style={styles.nutritionRow}>
              <Text style={[styles.nutritionLabel, { color: theme.text }]}>
                Calories *
              </Text>
              <TextInput
                style={[
                  styles.nutritionInput,
                  {
                    backgroundColor: theme.cardBg,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="0"
                placeholderTextColor={theme.icon}
                value={calories}
                onChangeText={setCalories}
                keyboardType="decimal-pad"
              />
            </View>

            {/* Protein */}
            <View style={styles.nutritionRow}>
              <Text style={[styles.nutritionLabel, { color: theme.text }]}>
                Protein (g) *
              </Text>
              <TextInput
                style={[
                  styles.nutritionInput,
                  {
                    backgroundColor: theme.cardBg,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="0"
                placeholderTextColor={theme.icon}
                value={protein}
                onChangeText={setProtein}
                keyboardType="decimal-pad"
              />
            </View>

            {/* Carbs */}
            <View style={styles.nutritionRow}>
              <Text style={[styles.nutritionLabel, { color: theme.text }]}>
                Carbs (g) *
              </Text>
              <TextInput
                style={[
                  styles.nutritionInput,
                  {
                    backgroundColor: theme.cardBg,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="0"
                placeholderTextColor={theme.icon}
                value={carbs}
                onChangeText={setCarbs}
                keyboardType="decimal-pad"
              />
            </View>

            {/* Fat */}
            <View style={styles.nutritionRow}>
              <Text style={[styles.nutritionLabel, { color: theme.text }]}>
                Fat (g) *
              </Text>
              <TextInput
                style={[
                  styles.nutritionInput,
                  {
                    backgroundColor: theme.cardBg,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="0"
                placeholderTextColor={theme.icon}
                value={fat}
                onChangeText={setFat}
                keyboardType="decimal-pad"
              />
            </View>
          </View>
        </ScrollView>

        {/* Submit Button */}
        <View style={[styles.footer, { borderTopColor: theme.border }]}>
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: theme.tint }]}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Save & Log Food</Text>
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
  content: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 12,
  },
  infoTextContainer: {
    flex: 1,
    gap: 4,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  barcodeCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
  },
  barcodeLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
  },
  barcodeText: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 2,
  },
  inputSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  nutritionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  nutritionLabel: {
    fontSize: 15,
    fontWeight: "500",
  },
  nutritionInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    width: 120,
    textAlign: "right",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  submitButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
