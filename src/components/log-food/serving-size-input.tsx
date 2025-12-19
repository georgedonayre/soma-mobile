// components/food-log/ServingSizeInput.tsx
import Slider from "@react-native-community/slider";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

type ServingSizeInputProps = {
  servingSize: number;
  servingSizeText: string;
  servingSizeUnit: string;
  onValueChange: (value: number) => void;
  onTextChange: (text: string) => void;
  theme: any;
};

export function ServingSizeInput({
  servingSize,
  servingSizeText,
  servingSizeUnit,
  onValueChange,
  onTextChange,
  theme,
}: ServingSizeInputProps) {
  return (
    <View style={styles.container}>
      {/* Text Input */}
      <View style={[styles.inputContainer, { borderColor: theme.border }]}>
        <TextInput
          style={[styles.input, { color: theme.text }]}
          value={servingSizeText}
          onChangeText={onTextChange}
          keyboardType="numeric"
          selectTextOnFocus
        />
        <Text style={[styles.unit, { color: theme.icon }]}>
          {servingSizeUnit}
        </Text>
      </View>

      {/* Slider */}
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={500}
          value={servingSize}
          onValueChange={onValueChange}
          minimumTrackTintColor={theme.tint}
          maximumTrackTintColor={theme.border}
          thumbTintColor={theme.tint}
          step={1}
        />
        <View style={styles.sliderLabels}>
          <Text style={[styles.sliderLabel, { color: theme.icon }]}>
            1{servingSizeUnit}
          </Text>
          <Text style={[styles.sliderLabel, { color: theme.icon }]}>
            500{servingSizeUnit}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 20,
    fontWeight: "600",
  },
  unit: {
    fontSize: 16,
    marginLeft: 8,
  },
  sliderContainer: {
    marginTop: 4,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -8,
  },
  sliderLabel: {
    fontSize: 11,
  },
});
