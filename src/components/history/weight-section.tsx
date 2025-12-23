import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import EmptyWeightState from "./empty-weight-state";
import LatestWeight from "./latest-weight";
import WeightChart from "./weight-chart";
import WeightLogModal from "./weight-log-modal";

type WeightLog = {
  id: number;
  date: string;
  weight: number;
};
interface WeightSectionProps {
  weightLogs: WeightLog[];
  userId: number;
  theme: any;
  onRefresh: () => void;
}

export default function WeightSection({
  weightLogs,
  userId,
  theme,
  onRefresh,
}: WeightSectionProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleSuccess = () => {
    onRefresh();
  };

  if (weightLogs.length === 0) {
    return (
      <>
        <View
          style={[
            styles.container,
            {
              backgroundColor: theme.background,
              borderBottomColor: theme.icon + "20",
            },
          ]}
        >
          <View style={styles.headerRow}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Weight
            </Text>
            <TouchableOpacity
              onPress={handleOpenModal}
              style={[styles.addButton, { backgroundColor: theme.tint }]}
              activeOpacity={0.8}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <EmptyWeightState theme={theme} onLogWeight={handleOpenModal} />
        </View>

        <WeightLogModal
          isVisible={isModalVisible}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
          userId={userId}
          theme={theme}
        />
      </>
    );
  }

  // Get latest and previous weight for delta calculation
  const latestLog = weightLogs[0];
  const previousLog = weightLogs.length > 1 ? weightLogs[1] : null;

  // Get last 7-14 logs for chart (up to 14, but show all if less)
  const chartLogs = weightLogs.slice(0, Math.min(14, weightLogs.length));

  return (
    <>
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.background,
            borderBottomColor: theme.icon + "20",
          },
        ]}
      >
        <View style={styles.headerRow}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Weight
          </Text>
          <TouchableOpacity
            onPress={handleOpenModal}
            style={[styles.addButton, { backgroundColor: theme.tint }]}
            activeOpacity={0.8}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <LatestWeight
          currentWeight={latestLog.weight}
          currentDate={latestLog.date}
          previousWeight={previousLog?.weight || null}
          previousDate={previousLog?.date || null}
          theme={theme}
        />

        {chartLogs.length >= 2 && (
          <WeightChart weightLogs={chartLogs} theme={theme} />
        )}

        {chartLogs.length === 1 && (
          <Text style={[styles.chartHint, { color: theme.icon }]}>
            Log more weights to see your progress chart
          </Text>
        )}
      </View>

      <WeightLogModal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        userId={userId}
        theme={theme}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "300",
    marginTop: -2,
  },
  chartHint: {
    fontSize: 13,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 16,
  },
});
