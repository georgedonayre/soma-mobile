import { format } from "date-fns";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";

interface WeightChartProps {
  weightLogs: {
    date: string;
    weight: number;
  }[];
  theme: any;
}

export default function WeightChart({ weightLogs, theme }: WeightChartProps) {
  if (weightLogs.length === 0) {
    return null;
  }

  // Reverse to show oldest to newest (left to right)
  const reversedLogs = [...weightLogs].reverse();

  // Prepare data for the chart
  const chartData = reversedLogs.map((log, index) => ({
    value: log.weight,
    label: format(new Date(log.date), "MMM d"),
    dataPointText: `${log.weight}`,
  }));

  // Calculate min and max for better scaling
  const weights = reversedLogs.map((log) => log.weight);
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);
  const range = maxWeight - minWeight;
  const yAxisOffset = range > 0 ? Math.max(range * 0.1, 1) : 5;

  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth - 40; // Account for padding

  return (
    <View style={styles.container}>
      <LineChart
        data={chartData}
        width={chartWidth}
        height={200}
        spacing={Math.max(chartWidth / Math.max(chartData.length - 1, 1), 40)}
        color={theme.tint}
        thickness={3}
        startFillColor={theme.tint}
        endFillColor={theme.tint}
        startOpacity={0.2}
        endOpacity={0.01}
        initialSpacing={10}
        endSpacing={10}
        noOfSections={4}
        yAxisColor={theme.icon + "30"}
        xAxisColor={theme.icon + "30"}
        yAxisTextStyle={[styles.yAxisText, { color: theme.icon }]}
        xAxisLabelTextStyle={[styles.xAxisText, { color: theme.icon }]}
        dataPointsColor={theme.tint}
        dataPointsRadius={5}
        textShiftY={-8}
        textShiftX={-5}
        textFontSize={11}
        textColor={theme.text}
        showVerticalLines={false}
        curved
        animateOnDataChange
        areaChart
        hideDataPoints={chartData.length > 10}
        yAxisOffset={yAxisOffset}
        maxValue={maxWeight + yAxisOffset}
        yAxisLabelSuffix=" kg"
        rulesColor={theme.icon + "20"}
        rulesType="solid"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginBottom: 8,
  },
  yAxisText: {
    fontSize: 10,
  },
  xAxisText: {
    fontSize: 10,
    width: 50,
  },
});
