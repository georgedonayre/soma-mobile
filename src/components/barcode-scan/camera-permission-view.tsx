// components/barcode-scan/camera-permission-view.tsx
import { Colors } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

interface CameraPermissionViewProps {
  onRequestPermission: () => void;
  onGoBack: () => void;
}

export function CameraPermissionView({
  onRequestPermission,
  onGoBack,
}: CameraPermissionViewProps) {
  const colorScheme = useColorScheme() ?? "dark";
  const theme = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Ionicons name="camera-outline" size={80} color={theme.icon} />
        <Text style={[styles.title, { color: theme.text }]}>
          Camera Permission Required
        </Text>
        <Text style={[styles.text, { color: theme.icon }]}>
          We need access to your camera to scan barcodes
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.tint }]}
          onPress={onRequestPermission}
        >
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
          <Text style={[styles.backButtonText, { color: theme.tint }]}>
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 16,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginTop: 16,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    marginTop: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
