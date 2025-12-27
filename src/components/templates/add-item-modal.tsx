// components/templates/add-item-modal.tsx

import { TemplateItem } from "@/src/database/types";
import { validateTemplateItem } from "@/src/utils/templateUtils";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface AddItemModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (item: TemplateItem) => void;
  theme: any;
  editItem?: TemplateItem | null;
}

export function AddItemModal({
  visible,
  onClose,
  onSave,
  theme,
  editItem,
}: AddItemModalProps) {
  const [name, setName] = useState(editItem?.name || "");
  const [servingSize, setServingSize] = useState(
    editItem?.serving_size ? editItem.serving_size.toString() : ""
  );
  const [servingSizeUnit, setServingSizeUnit] = useState(
    editItem?.serving_size_unit || "g"
  );
  const [calories, setCalories] = useState(
    editItem?.calories ? editItem.calories.toString() : ""
  );
  const [protein, setProtein] = useState(
    editItem?.protein ? editItem.protein.toString() : ""
  );
  const [carbs, setCarbs] = useState(
    editItem?.carbs ? editItem.carbs.toString() : ""
  );
  const [fat, setFat] = useState(editItem?.fat ? editItem.fat.toString() : "");

  const [error, setError] = useState("");

  const handleSave = () => {
    const item: Partial<TemplateItem> = {
      name: name.trim(),
      serving_size: parseFloat(servingSize),
      serving_size_unit: servingSizeUnit.trim(),
      calories: parseFloat(calories) || 0,
      protein: parseFloat(protein) || 0,
      carbs: parseFloat(carbs) || 0,
      fat: parseFloat(fat) || 0,
    };

    const validationError = validateTemplateItem(item);
    if (validationError) {
      setError(validationError);
      return;
    }

    onSave(item as TemplateItem);
    handleClose();
  };

  const handleClose = () => {
    // Reset form
    setName("");
    setServingSize("");
    setServingSizeUnit("g");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
    setError("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.text }]}>
            {editItem ? "Edit Item" : "Add Item"}
          </Text>
          <View style={styles.closeButton} />
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Error Message */}
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Item Name */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>
              Item Name *
            </Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: theme.cardBg, color: theme.text },
              ]}
              value={name}
              onChangeText={setName}
              placeholder="e.g., Chicken Breast, Brown Rice"
              placeholderTextColor={theme.icon}
              autoCapitalize="words"
            />
          </View>

          {/* Serving Size */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.flex1]}>
              <Text style={[styles.label, { color: theme.text }]}>
                Serving Size *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: theme.cardBg, color: theme.text },
                ]}
                value={servingSize}
                onChangeText={setServingSize}
                placeholder="100"
                placeholderTextColor={theme.icon}
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputGroup, styles.flex1]}>
              <Text style={[styles.label, { color: theme.text }]}>Unit *</Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: theme.cardBg, color: theme.text },
                ]}
                value={servingSizeUnit}
                onChangeText={setServingSizeUnit}
                placeholder="g"
                placeholderTextColor={theme.icon}
              />
            </View>
          </View>

          {/* Macros Section */}
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Nutrition Facts
          </Text>

          {/* Calories */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>
              Calories *
            </Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: theme.cardBg, color: theme.text },
              ]}
              value={calories}
              onChangeText={setCalories}
              placeholder="0"
              placeholderTextColor={theme.icon}
              keyboardType="numeric"
            />
          </View>

          {/* Protein, Carbs, Fat */}
          <View style={styles.macroRow}>
            <View style={[styles.inputGroup, styles.flex1]}>
              <Text style={[styles.label, { color: theme.text }]}>
                Protein (g) *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: theme.cardBg, color: theme.text },
                ]}
                value={protein}
                onChangeText={setProtein}
                placeholder="0"
                placeholderTextColor={theme.icon}
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputGroup, styles.flex1]}>
              <Text style={[styles.label, { color: theme.text }]}>
                Carbs (g) *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: theme.cardBg, color: theme.text },
                ]}
                value={carbs}
                onChangeText={setCarbs}
                placeholder="0"
                placeholderTextColor={theme.icon}
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputGroup, styles.flex1]}>
              <Text style={[styles.label, { color: theme.text }]}>
                Fat (g) *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: theme.cardBg, color: theme.text },
                ]}
                value={fat}
                onChangeText={setFat}
                placeholder="0"
                placeholderTextColor={theme.icon}
                keyboardType="numeric"
              />
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={[styles.footer, { borderTopColor: theme.border }]}>
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: theme.tint }]}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>
              {editItem ? "Update Item" : "Add Item"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  errorContainer: {
    backgroundColor: "#FEE2E2",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
    marginBottom: 16,
  },
  macroRow: {
    flexDirection: "row",
    gap: 8,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  saveButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
