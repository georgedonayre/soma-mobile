// components/barcode-scan/scanner-instructions.tsx
import { Colors } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, useColorScheme, View } from "react-native";

type ScanState = "scanning" | "processing" | "found" | "not-found";

interface ScannerInstructionsProps {
  scanState: ScanState;
}

export function ScannerInstructions({ scanState }: ScannerInstructionsProps) {
  const colorScheme = useColorScheme() ?? "dark";
  const theme = Colors[colorScheme];

  const getContent = () => {
    switch (scanState) {
      case "scanning":
        return {
          icon: "barcode-outline" as const,
          iconColor: theme.tint,
          title: "Position barcode in the frame",
          text: "Hold steady and ensure good lighting",
        };
      case "processing":
        return {
          icon: "hourglass-outline" as const,
          iconColor: theme.tint,
          title: "Processing...",
          text: "Looking up barcode in database",
        };
      case "found":
        return {
          icon: "checkmark-circle" as const,
          iconColor: "#4CAF50",
          title: "Food Found!",
          text: "Reviewing nutrition information...",
        };
      case "not-found":
        return {
          icon: "alert-circle" as const,
          iconColor: "#FF9800",
          title: "New Product",
          text: "Please enter nutrition information",
        };
    }
  };

  const content = getContent();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Ionicons name={content.icon} size={40} color={content.iconColor} />
        <Text style={styles.title}>{content.title}</Text>
        <Text style={styles.text}>{content.text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 60,
    left: 20,
    right: 20,
  },
  card: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
  },
  text: {
    fontSize: 14,
    color: "#B0B0B0",
    textAlign: "center",
  },
});
