// toast-config.tsx
import { Colors } from "@/src/theme";
import React from "react";
import { StyleSheet } from "react-native";
import { BaseToast, ErrorToast, ToastConfig } from "react-native-toast-message";

export const createToastConfig = (colorScheme: "dark" | "light") => {
  const theme = Colors[colorScheme];

  const config: ToastConfig = {
    success: (props) => (
      <BaseToast
        {...props}
        style={[
          styles.toastContainer,
          {
            borderLeftColor: theme.tint,
            backgroundColor: theme.cardBg,
          },
        ]}
        contentContainerStyle={styles.contentContainer}
        text1Style={[styles.text1, { color: theme.text }]}
        text2Style={[styles.text2, { color: theme.icon }]}
        text1NumberOfLines={2}
        text2NumberOfLines={2}
      />
    ),
    error: (props) => (
      <ErrorToast
        {...props}
        style={[
          styles.toastContainer,
          {
            borderLeftColor: "#EF4444",
            backgroundColor: theme.cardBg,
          },
        ]}
        contentContainerStyle={styles.contentContainer}
        text1Style={[styles.text1, { color: theme.text }]}
        text2Style={[styles.text2, { color: theme.icon }]}
        text1NumberOfLines={2}
        text2NumberOfLines={2}
      />
    ),
    info: (props) => (
      <BaseToast
        {...props}
        style={[
          styles.toastContainer,
          {
            borderLeftColor: "#3B82F6",
            backgroundColor: theme.cardBg,
          },
        ]}
        contentContainerStyle={styles.contentContainer}
        text1Style={[styles.text1, { color: theme.text }]}
        text2Style={[styles.text2, { color: theme.icon }]}
        text1NumberOfLines={2}
        text2NumberOfLines={2}
      />
    ),
  };

  return config;
};

const styles = StyleSheet.create({
  toastContainer: {
    borderLeftWidth: 5,
    borderRadius: 12,
    minHeight: 60,
    paddingVertical: 12,
  },
  contentContainer: {
    paddingHorizontal: 15,
  },
  text1: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },
  text2: {
    fontSize: 13,
    fontWeight: "400",
  },
});
