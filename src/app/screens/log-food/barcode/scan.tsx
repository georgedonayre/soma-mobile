import BarcodeFoodForm from "@/src/components/barcode-scan/barcode-food-form";
import { useAppContext } from "@/src/context/app-context";
import {
  createBarcodeFood,
  getBarcodeFoodByBarcode,
} from "@/src/database/models/barcodeFoodModel";
import { createMeal } from "@/src/database/models/mealModel";
import { Colors } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

type ScanState = "scanning" | "processing" | "found" | "not-found";

export default function BarcodeScanScreen() {
  const colorScheme = useColorScheme() ?? "dark";
  const theme = Colors[colorScheme];
  const router = useRouter();
  const { user } = useAppContext();

  const [permission, requestPermission] = useCameraPermissions();
  const [scanState, setScanState] = useState<ScanState>("scanning");
  const [scannedBarcode, setScannedBarcode] = useState<string>("");
  const [showForm, setShowForm] = useState(false);

  // Request camera permission if not granted
  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.permissionContainer}>
          <Ionicons name="camera-outline" size={80} color={theme.icon} />
          <Text style={[styles.permissionTitle, { color: theme.text }]}>
            Camera Permission Required
          </Text>
          <Text style={[styles.permissionText, { color: theme.icon }]}>
            We need access to your camera to scan barcodes
          </Text>
          <TouchableOpacity
            style={[styles.permissionButton, { backgroundColor: theme.tint }]}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.backTextButton}
            onPress={() => router.back()}
          >
            <Text style={[styles.backTextButtonText, { color: theme.tint }]}>
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (scanState !== "scanning") return;

    console.log("📷 Barcode scanned:", data);
    setScanState("processing");
    setScannedBarcode(data);

    try {
      // Query database for existing barcode
      const existingFood = await getBarcodeFoodByBarcode(data);

      if (existingFood) {
        // Found existing food - log it directly
        console.log("✅ Found existing food:", existingFood.product_name);
        setScanState("found");

        // Log the meal
        await logMeal(existingFood);
      } else {
        // Not found - show form
        console.log("⚠️ Food not found, showing form");
        setScanState("not-found");
        setShowForm(true);
      }
    } catch (error) {
      console.error("❌ Error processing barcode:", error);
      Alert.alert("Error", "Failed to process barcode. Please try again.", [
        { text: "OK", onPress: () => setScanState("scanning") },
      ]);
    }
  };

  const logMeal = async (food: {
    product_name: string;
    serving_size: number;
    serving_unit: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }) => {
    if (!user) {
      Alert.alert("Error", "User not found");
      return;
    }

    try {
      const today = new Date().toISOString().split("T")[0];

      await createMeal({
        user_id: user.id,
        description: `${food.product_name} (${food.serving_size}${food.serving_unit})`,
        total_calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
        date: today,
        template_id: null,
      });

      console.log("✅ Meal logged successfully");

      Alert.alert(
        "Success!",
        `${food.product_name} has been logged to your diary.`,
        [
          {
            text: "OK",
            onPress: () => router.replace("/(tabs)/dashboard"),
          },
        ]
      );
    } catch (error) {
      console.error("❌ Error logging meal:", error);
      Alert.alert("Error", "Failed to log meal. Please try again.");
      setScanState("scanning");
    }
  };

  const handleFormSubmit = async (formData: {
    product_name: string;
    serving_size: number;
    serving_unit: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }) => {
    try {
      console.log("💾 Saving new barcode food...");

      // Save to database
      await createBarcodeFood({
        barcode: scannedBarcode,
        ...formData,
      });

      console.log("✅ Barcode food saved");

      // Close form
      setShowForm(false);

      // Log the meal
      await logMeal(formData);
    } catch (error) {
      console.error("❌ Error saving barcode food:", error);
      Alert.alert("Error", "Failed to save food. Please try again.");
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setScanState("scanning");
    setScannedBarcode("");
  };

  return (
    <>
      <Stack.Screen options={{ title: "Scan Barcode" }} />
      <View style={styles.container}>
        {/* Camera View */}
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={
            scanState === "scanning" ? handleBarcodeScanned : undefined
          }
          barcodeScannerSettings={{
            barcodeTypes: [
              "ean13",
              "ean8",
              "upc_a",
              "upc_e",
              "code128",
              "code39",
              "qr",
            ],
          }}
        >
          {/* Scanning Frame */}
          <View style={styles.scannerContainer}>
            <View style={styles.scannerFrame}>
              {/* Corner brackets */}
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />

              {/* Scanning line animation */}
              {scanState === "scanning" && <View style={styles.scanLine} />}
            </View>
          </View>

          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <View style={styles.instructionsCard}>
              {scanState === "scanning" && (
                <>
                  <Ionicons
                    name="barcode-outline"
                    size={40}
                    color={theme.tint}
                  />
                  <Text style={styles.instructionsTitle}>
                    Position barcode in the frame
                  </Text>
                  <Text style={styles.instructionsText}>
                    Hold steady and ensure good lighting
                  </Text>
                </>
              )}
              {scanState === "processing" && (
                <>
                  <Ionicons
                    name="hourglass-outline"
                    size={40}
                    color={theme.tint}
                  />
                  <Text style={styles.instructionsTitle}>Processing...</Text>
                  <Text style={styles.instructionsText}>
                    Looking up barcode in database
                  </Text>
                </>
              )}
              {scanState === "found" && (
                <>
                  <Ionicons name="checkmark-circle" size={40} color="#4CAF50" />
                  <Text style={styles.instructionsTitle}>Food Found!</Text>
                  <Text style={styles.instructionsText}>
                    Logging to your diary...
                  </Text>
                </>
              )}
            </View>
          </View>
        </CameraView>

        {/* Form Modal */}
        <Modal
          visible={showForm}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <BarcodeFoodForm
            barcode={scannedBarcode}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  camera: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  scannerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scannerFrame: {
    width: 280,
    height: 200,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 40,
    height: 40,
    borderColor: "#FFFFFF",
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  scanLine: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#4CAF50",
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  instructionsContainer: {
    position: "absolute",
    bottom: 60,
    left: 20,
    right: 20,
  },
  instructionsCard: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    gap: 12,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
  },
  instructionsText: {
    fontSize: 14,
    color: "#B0B0B0",
    textAlign: "center",
  },
  permissionContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 16,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 16,
  },
  permissionText: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  permissionButton: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginTop: 16,
  },
  permissionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  backTextButton: {
    marginTop: 8,
  },
  backTextButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
