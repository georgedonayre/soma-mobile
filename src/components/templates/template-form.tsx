// components/templates/new-template-form.tsx

import { TemplateItem } from "@/src/database/types";
import { calculateTemplateMacros } from "@/src/utils/templateUtils";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AddItemModal } from "./add-item-modal";
import { TemplateItemCard } from "./template-item-card";

interface NewTemplateFormProps {
  title: string;
  onBack: () => void;
  onConfirm: (data: {
    name: string;
    items: TemplateItem[];
    servingSize: number;
    servingSizeUnit: string;
  }) => void;
  confirmButtonText?: string;
  isLoading?: boolean;
  theme: any;
}

export function NewTemplateForm({
  title,
  onBack,
  onConfirm,
  confirmButtonText = "Create Template",
  isLoading = false,
  theme,
}: NewTemplateFormProps) {
  const [templateName, setTemplateName] = useState("");
  const [items, setItems] = useState<TemplateItem[]>([]);
  const [servingSize, setServingSize] = useState("1");
  const [servingSizeUnit, setServingSizeUnit] = useState("serving");

  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);

  const [nameError, setNameError] = useState("");
  const [itemsError, setItemsError] = useState("");

  // Calculate total macros from items
  const totalMacros = calculateTemplateMacros(items);

  const handleAddItem = (item: TemplateItem) => {
    if (editingItemIndex !== null) {
      // Edit existing item
      const updatedItems = [...items];
      updatedItems[editingItemIndex] = item;
      setItems(updatedItems);
      setEditingItemIndex(null);
    } else {
      // Add new item
      setItems([...items, item]);
    }
    setItemsError("");
  };

  const handleEditItem = (index: number) => {
    setEditingItemIndex(index);
    setShowAddItemModal(true);
  };

  const handleDeleteItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleConfirm = () => {
    setNameError("");
    setItemsError("");

    let hasError = false;

    if (!templateName.trim()) {
      setNameError("Template name is required");
      hasError = true;
    }

    if (items.length === 0) {
      setItemsError("Add at least one item to your template");
      hasError = true;
    }

    const validServingSize = parseFloat(servingSize);
    if (isNaN(validServingSize) || validServingSize <= 0) {
      hasError = true;
    }

    if (hasError) return;

    onConfirm({
      name: templateName.trim(),
      items,
      servingSize: validServingSize,
      servingSizeUnit: servingSizeUnit.trim(),
    });
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

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Template Name */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Template Name
          </Text>
          <TextInput
            style={[
              styles.nameInput,
              {
                backgroundColor: theme.cardBg,
                color: theme.text,
                borderColor: nameError ? "#EF4444" : theme.border,
              },
            ]}
            value={templateName}
            onChangeText={(text) => {
              setTemplateName(text);
              setNameError("");
            }}
            placeholder="e.g., Post-Workout Meal, Breakfast Bowl"
            placeholderTextColor={theme.icon}
            autoCapitalize="words"
          />
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
        </View>

        {/* Items Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Items
            </Text>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: theme.tint }]}
              onPress={() => setShowAddItemModal(true)}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Add Item</Text>
            </TouchableOpacity>
          </View>

          {itemsError ? (
            <Text style={[styles.errorText, { marginBottom: 12 }]}>
              {itemsError}
            </Text>
          ) : null}

          {items.length === 0 ? (
            <View
              style={[
                styles.emptyState,
                { backgroundColor: theme.cardBg, borderColor: theme.border },
              ]}
            >
              <Ionicons
                name="restaurant-outline"
                size={40}
                color={theme.icon}
              />
              <Text style={[styles.emptyText, { color: theme.icon }]}>
                No items added yet
              </Text>
              <Text style={[styles.emptySubtext, { color: theme.icon }]}>
                Tap &quot;Add Item&quot; to start building your template
              </Text>
            </View>
          ) : (
            <>
              {items.map((item, index) => (
                <TemplateItemCard
                  key={index}
                  item={item}
                  onEdit={() => handleEditItem(index)}
                  onDelete={() => handleDeleteItem(index)}
                  theme={theme}
                />
              ))}
            </>
          )}
        </View>

        {/* Total Macros */}
        {items.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Total Nutrition (Per Serving)
            </Text>
            <View style={[styles.macroCard, { backgroundColor: theme.cardBg }]}>
              <View style={styles.macroRow}>
                <View style={styles.macroItem}>
                  <Text style={[styles.macroValue, { color: theme.text }]}>
                    {Math.round(totalMacros.calories)}
                  </Text>
                  <Text style={[styles.macroLabel, { color: theme.icon }]}>
                    Calories
                  </Text>
                </View>
                <View style={styles.macroItem}>
                  <Text style={[styles.macroValue, { color: theme.tint }]}>
                    {Math.round(totalMacros.protein * 10) / 10}g
                  </Text>
                  <Text style={[styles.macroLabel, { color: theme.icon }]}>
                    Protein
                  </Text>
                </View>
                <View style={styles.macroItem}>
                  <Text style={[styles.macroValue, { color: theme.text }]}>
                    {Math.round(totalMacros.carbs * 10) / 10}g
                  </Text>
                  <Text style={[styles.macroLabel, { color: theme.icon }]}>
                    Carbs
                  </Text>
                </View>
                <View style={styles.macroItem}>
                  <Text style={[styles.macroValue, { color: theme.text }]}>
                    {Math.round(totalMacros.fat * 10) / 10}g
                  </Text>
                  <Text style={[styles.macroLabel, { color: theme.icon }]}>
                    Fat
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Serving Size */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Serving Size
          </Text>
          <View style={styles.servingRow}>
            <View style={styles.servingInput}>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: theme.cardBg, color: theme.text },
                ]}
                value={servingSize}
                onChangeText={setServingSize}
                placeholder="1"
                placeholderTextColor={theme.icon}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.servingUnitInput}>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: theme.cardBg, color: theme.text },
                ]}
                value={servingSizeUnit}
                onChangeText={setServingSizeUnit}
                placeholder="serving"
                placeholderTextColor={theme.icon}
              />
            </View>
          </View>
          <Text style={[styles.helperText, { color: theme.icon }]}>
            Represents one complete serving of all items combined
          </Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { borderTopColor: theme.border }]}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            {
              backgroundColor: theme.tint,
              opacity: isLoading ? 0.5 : 1,
            },
          ]}
          onPress={handleConfirm}
          disabled={isLoading}
        >
          <Text style={styles.confirmButtonText}>{confirmButtonText}</Text>
        </TouchableOpacity>
      </View>

      {/* Add/Edit Item Modal */}
      <AddItemModal
        visible={showAddItemModal}
        onClose={() => {
          setShowAddItemModal(false);
          setEditingItemIndex(null);
        }}
        onSave={handleAddItem}
        theme={theme}
        editItem={editingItemIndex !== null ? items[editingItemIndex] : null}
      />
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
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  nameInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 13,
    marginTop: 6,
  },
  emptyState: {
    alignItems: "center",
    padding: 32,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
  },
  emptyText: {
    fontSize: 15,
    fontWeight: "500",
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 13,
    marginTop: 4,
    textAlign: "center",
  },
  macroCard: {
    borderRadius: 12,
    padding: 20,
  },
  macroRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  macroItem: {
    alignItems: "center",
  },
  macroValue: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  macroLabel: {
    fontSize: 12,
  },
  servingRow: {
    flexDirection: "row",
    gap: 12,
  },
  servingInput: {
    flex: 1,
  },
  servingUnitInput: {
    flex: 2,
  },
  input: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
  },
  helperText: {
    fontSize: 13,
    marginTop: 8,
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
