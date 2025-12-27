// components/log-food/template-meal-form.tsx

import { MacroDisplay } from "@/src/components/log-food/macro-display";
import { QuickSelectPresets } from "@/src/components/log-food/quick-select-presets";
import { ServingSizeInput } from "@/src/components/log-food/serving-size-input";
import { TemplateItem } from "@/src/database/types";
import {
  calculateAdjustedTemplateMacros,
  roundMacros,
} from "@/src/utils/templateUtils";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Macros = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

interface TemplateMealFormProps {
  title: string;
  onBack: () => void;
  templateName: string;
  templateSubtitle?: string;
  items: TemplateItem[];
  onConfirm: (adjustedMacros: Macros) => void;
  confirmButtonText?: string;
  isLoading?: boolean;
  theme: any;
}

interface ItemWithPortion extends TemplateItem {
  portionMultiplier: number;
}

export function TemplateMealForm({
  title,
  onBack,
  templateName,
  templateSubtitle,
  items,
  onConfirm,
  confirmButtonText = "Confirm & Log Meal",
  isLoading = false,
  theme,
}: TemplateMealFormProps) {
  // Track portion multipliers for each item
  const [itemPortions, setItemPortions] = useState<ItemWithPortion[]>(
    items.map((item) => ({
      ...item,
      portionMultiplier: 1.0,
    }))
  );

  // Calculate total adjusted macros
  const adjustedTotals = useMemo(() => {
    const multipliers = itemPortions.map((item) => item.portionMultiplier);
    return calculateAdjustedTemplateMacros(items, multipliers);
  }, [itemPortions, items]);

  // Update portion for a specific item
  const updateItemPortion = (index: number, newMultiplier: number) => {
    setItemPortions((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, portionMultiplier: newMultiplier } : item
      )
    );
  };

  const handleConfirmPress = () => {
    const roundedMacros = roundMacros(adjustedTotals);
    onConfirm(roundedMacros);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          {/* <Ionicons name="arrow-back" size={24} color={theme.text} /> */}
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>{title}</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Template Info Card */}
        <View style={[styles.templateCard, { backgroundColor: theme.cardBg }]}>
          <Text style={[styles.templateName, { color: theme.text }]}>
            {templateName}
          </Text>
          {templateSubtitle && (
            <Text style={[styles.templateSubtitle, { color: theme.icon }]}>
              {templateSubtitle}
            </Text>
          )}
        </View>

        {/* Total Macros */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Total Nutrition
          </Text>
          <MacroDisplay
            calories={Math.round(adjustedTotals.calories)}
            protein={Math.round(adjustedTotals.protein * 10) / 10}
            carbs={Math.round(adjustedTotals.carbs * 10) / 10}
            fat={Math.round(adjustedTotals.fat * 10) / 10}
            theme={theme}
          />
        </View>

        {/* Individual Items */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Adjust Individual Items
          </Text>
          <Text style={[styles.sectionSubtitle, { color: theme.icon }]}>
            Change portions for each food item separately
          </Text>

          {itemPortions.map((item, index) => (
            <ItemPortionCard
              key={index}
              item={item}
              onPortionChange={(multiplier) =>
                updateItemPortion(index, multiplier)
              }
              theme={theme}
            />
          ))}
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

// Separate component for each food item's portion adjustment
interface ItemPortionCardProps {
  item: ItemWithPortion;
  onPortionChange: (multiplier: number) => void;
  theme: any;
}

function ItemPortionCard({
  item,
  onPortionChange,
  theme,
}: ItemPortionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [portionText, setPortionText] = useState("100");

  // Calculate adjusted macros for this item
  const adjustedMacros = useMemo(() => {
    return {
      calories: Math.round(item.calories * item.portionMultiplier),
      protein: Math.round(item.protein * item.portionMultiplier * 10) / 10,
      carbs: Math.round(item.carbs * item.portionMultiplier * 10) / 10,
      fat: Math.round(item.fat * item.portionMultiplier * 10) / 10,
    };
  }, [item]);

  // Calculate adjusted serving size
  const adjustedServingSize = useMemo(() => {
    return Math.round(item.serving_size * item.portionMultiplier * 10) / 10;
  }, [item.serving_size, item.portionMultiplier]);

  const handleSliderChange = (value: number) => {
    onPortionChange(value / 100);
    setPortionText(value.toString());
  };

  const handleTextChange = (text: string) => {
    setPortionText(text);
    const numValue = parseFloat(text);
    if (!isNaN(numValue) && numValue >= 0) {
      onPortionChange(numValue / 100);
    }
  };

  return (
    <View
      style={[
        styles.itemCard,
        { backgroundColor: theme.cardBg, borderColor: theme.border },
      ]}
    >
      {/* Item Header */}
      <TouchableOpacity
        style={styles.itemHeader}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={styles.itemHeaderLeft}>
          {/* <Ionicons
            name="nutrition"
            size={20}
            color={theme.tint}
            style={styles.itemIcon}
          /> */}
          <View style={styles.itemHeaderText}>
            <Text style={[styles.itemName, { color: theme.text }]}>
              {item.name}
            </Text>
            <Text style={[styles.itemQuantity, { color: theme.icon }]}>
              {adjustedServingSize}
              {item.serving_size_unit} • {adjustedMacros.calories} cal
            </Text>
          </View>
        </View>
        {/* <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={theme.icon}
        /> */}
      </TouchableOpacity>

      {/* Expanded Content */}
      {isExpanded && (
        <View style={styles.itemExpanded}>
          {/* Mini Macro Display */}
          <View style={styles.miniMacros}>
            <View style={styles.miniMacroItem}>
              <Text style={[styles.miniMacroValue, { color: theme.text }]}>
                {adjustedMacros.protein}g
              </Text>
              <Text style={[styles.miniMacroLabel, { color: theme.icon }]}>
                Protein
              </Text>
            </View>
            <View style={styles.miniMacroItem}>
              <Text style={[styles.miniMacroValue, { color: theme.text }]}>
                {adjustedMacros.carbs}g
              </Text>
              <Text style={[styles.miniMacroLabel, { color: theme.icon }]}>
                Carbs
              </Text>
            </View>
            <View style={styles.miniMacroItem}>
              <Text style={[styles.miniMacroValue, { color: theme.text }]}>
                {adjustedMacros.fat}g
              </Text>
              <Text style={[styles.miniMacroLabel, { color: theme.icon }]}>
                Fat
              </Text>
            </View>
          </View>

          {/* Portion Adjuster */}
          <View style={styles.portionAdjuster}>
            <Text style={[styles.portionLabel, { color: theme.text }]}>
              Portion Size
            </Text>
            <ServingSizeInput
              servingSize={item.portionMultiplier * 100}
              servingSizeText={portionText}
              servingSizeUnit="%"
              onValueChange={handleSliderChange}
              onTextChange={handleTextChange}
              theme={theme}
            />
          </View>

          {/* Quick Presets */}
          <QuickSelectPresets
            originalServingSize={100}
            currentServingSize={item.portionMultiplier * 100}
            onSelect={handleSliderChange}
            theme={theme}
          />
        </View>
      )}
    </View>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  },
  templateCard: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
  },
  templateName: {
    fontSize: 20,
    fontWeight: "600",
  },
  templateSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  itemCard: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    overflow: "hidden",
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  itemHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  itemIcon: {
    marginRight: 12,
  },
  itemHeaderText: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  itemQuantity: {
    fontSize: 14,
  },
  itemExpanded: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(128, 128, 128, 0.2)",
  },
  miniMacros: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
  },
  miniMacroItem: {
    alignItems: "center",
  },
  miniMacroValue: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  miniMacroLabel: {
    fontSize: 12,
  },
  portionAdjuster: {
    marginTop: 8,
    marginBottom: 16,
  },
  portionLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 12,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
  confirmButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
