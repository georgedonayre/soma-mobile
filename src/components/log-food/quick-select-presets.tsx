// components/food-log/QuickSelectPresets.tsx
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type QuickSelectPresetsProps = {
  originalServingSize: number;
  currentServingSize: number;
  onSelect: (value: number) => void;
  theme: any;
};

export function QuickSelectPresets({
  originalServingSize,
  currentServingSize,
  onSelect,
  theme,
}: QuickSelectPresetsProps) {
  const presets = [0.5, 1, 1.5, 2];

  return (
    <View style={styles.container}>
      {presets.map((mult) => {
        const presetValue = originalServingSize * mult;
        const isActive = currentServingSize === presetValue;

        return (
          <TouchableOpacity
            key={mult}
            style={[
              styles.presetButton,
              {
                borderColor: theme.border,
                backgroundColor: isActive ? theme.tint : theme.background,
              },
            ]}
            onPress={() => onSelect(presetValue)}
          >
            <Text
              style={[
                styles.presetText,
                {
                  color: isActive ? "#FFFFFF" : theme.text,
                },
              ]}
            >
              {mult}x
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
  },
  presetButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: "center",
  },
  presetText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
