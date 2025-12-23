import { format, formatDistanceToNow } from "date-fns";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface LatestWeightProps {
  currentWeight: number;
  currentDate: string;
  previousWeight: number | null;
  previousDate: string | null;
  theme: any;
}

export default function LatestWeight({
  currentWeight,
  currentDate,
  previousWeight,
  previousDate,
  theme,
}: LatestWeightProps) {
  const delta = previousWeight ? currentWeight - previousWeight : null;
  const deltaText = delta
    ? `${delta > 0 ? "+" : ""}${delta.toFixed(1)} kg`
    : null;

  const dateDistance = previousDate
    ? formatDistanceToNow(new Date(previousDate), { addSuffix: true })
    : null;

  return (
    <View style={styles.container}>
      <View style={styles.numberRow}>
        <Text style={[styles.weightNumber, { color: theme.text }]}>
          {currentWeight.toFixed(1)}
        </Text>
        <Text style={[styles.unit, { color: theme.icon }]}>kg</Text>
      </View>

      <Text style={[styles.label, { color: theme.icon }]}>Latest Weight</Text>

      <View style={styles.metaRow}>
        <Text style={[styles.dateText, { color: theme.icon }]}>
          as of {format(new Date(currentDate), "MMM d, yyyy")}
        </Text>
        {delta !== null && previousDate && (
          <View
            style={[
              styles.deltaBadge,
              {
                backgroundColor:
                  delta > 0
                    ? "#ef444420"
                    : delta < 0
                    ? "#10b98120"
                    : theme.icon + "20",
              },
            ]}
          >
            <Text
              style={[
                styles.deltaText,
                {
                  color:
                    delta > 0 ? "#ef4444" : delta < 0 ? "#10b981" : theme.icon,
                },
              ]}
            >
              {deltaText} {dateDistance}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  numberRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 8,
  },
  weightNumber: {
    fontSize: 56,
    fontWeight: "700",
    letterSpacing: -2,
  },
  unit: {
    fontSize: 20,
    marginLeft: 8,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
  },
  dateText: {
    fontSize: 13,
  },
  deltaBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  deltaText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
