import { useColorScheme } from "@/src/hooks/use-color-scheme";
import { StyleSheet } from "react-native";
import { Colors } from "../theme";

// ===== Main Component Styles =====
export const useMainStyles = () => {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    progressBarContainer: {
      height: 8,
      width: "100%",
      backgroundColor: theme.icon + "33", // slightly transparent
      borderRadius: 4,
      overflow: "hidden",
      marginVertical: 16,
    },
    progressBarFill: {
      height: "100%",
      backgroundColor: theme.tint,
      borderRadius: 4,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
    },
    scrollContent: {
      paddingBottom: 40,
    },
  });
};

// ===== Step1 Styles =====
export const useStep1Styles = () => {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  return StyleSheet.create({
    stepContainer: {
      flex: 1,
      justifyContent: "space-between",
      paddingVertical: 20,
    },
    stepContent: {
      flex: 1,
    },
    header: {
      marginBottom: 30,
      alignItems: "center",
    },
    emoji: {
      fontSize: 40,
      marginBottom: 10,
    },
    title: {
      fontSize: 28,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      textAlign: "center",
      color: theme.text + "AA", // slightly lighter
      lineHeight: 22,
      paddingHorizontal: 10,
    },
    inputContainer: {
      marginTop: 20,
    },
    label: {
      fontSize: 14,
      color: theme.text + "CC",
      marginBottom: 6,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.icon + "55",
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
      fontSize: 16,
      color: theme.text,
      backgroundColor: colorScheme === "light" ? "#FFF" : "#1B1B1B",
    },
    errorText: {
      color: "#FF4D4D",
      fontSize: 12,
      marginTop: 4,
    },
    primaryButton: {
      backgroundColor: theme.tint,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 20,
    },
    primaryButtonText: {
      color: "#FFF",
      fontSize: 16,
      fontWeight: "600",
    },
  });
};
