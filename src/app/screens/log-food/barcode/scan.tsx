// app/barcode-scan/scan.tsx
import BarcodeFoodForm from "@/src/components/barcode-scan/barcode-food-form";
import { CameraPermissionView } from "@/src/components/barcode-scan/camera-permission-view";
import { ScannerFrame } from "@/src/components/barcode-scan/scanner-frame";
import { ScannerInstructions } from "@/src/components/barcode-scan/scanner-instructions";
import {
  createBarcodeFood,
  getBarcodeFoodByBarcode,
} from "@/src/database/models/barcodeFoodModel";
import { routes } from "@/src/utils/routes";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Modal, StyleSheet, View } from "react-native";

type ScanState = "scanning" | "processing" | "found" | "not-found";

type BarcodeFoodData = {
  product_name: string;
  brand_name?: string;
  serving_size: number;
  serving_unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export default function BarcodeScanScreen() {
  const router = useRouter();

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
      <CameraPermissionView
        onRequestPermission={requestPermission}
        onGoBack={() => router.back()}
      />
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
        // Found existing food - navigate to review screen
        console.log("✅ Found existing food:", existingFood.product_name);
        setScanState("found");

        // Navigate to review screen with food data
        router.push({
          pathname: routes.barcodeReview,
          params: {
            foodData: JSON.stringify({
              barcode: data,
              product_name: existingFood.product_name,
              serving_size: existingFood.serving_size,
              serving_unit: existingFood.serving_unit,
              calories: existingFood.calories,
              protein: existingFood.protein,
              carbs: existingFood.carbs,
              fat: existingFood.fat,
            }),
          },
        });

        // Reset state after navigation
        setTimeout(() => {
          setScanState("scanning");
          setScannedBarcode("");
        }, 500);
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

  const handleFormSubmit = async (formData: BarcodeFoodData) => {
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

      // Navigate to review screen with the new food data
      router.push({
        pathname: routes.barcodeReview,
        params: {
          foodData: JSON.stringify({
            barcode: scannedBarcode,
            ...formData,
          }),
        },
      });

      // Reset state after navigation
      setTimeout(() => {
        setScanState("scanning");
        setScannedBarcode("");
      }, 500);
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
          {/* Scanner Frame */}
          <ScannerFrame isScanning={scanState === "scanning"} />

          {/* Instructions */}
          <ScannerInstructions scanState={scanState} />
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
});
