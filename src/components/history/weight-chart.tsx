import { format } from "date-fns";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

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

  // Sort logs from oldest to newest for left-to-right display
  const sortedLogs = [...weightLogs].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  console.log(weightLogs);

  // Calculate min and max for better scaling
  const weights = sortedLogs.map((log) => log.weight);
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);
  const range = maxWeight - minWeight;
  const padding = range > 0 ? Math.max(range * 0.15, 2) : 5;

  // Prepare data for the chart
  const labels = sortedLogs.map((log) => format(new Date(log.date), "d"));
  const data = sortedLogs.map((log) => log.weight);

  const screenWidth = Dimensions.get("window").width;

  const chartConfig = {
    backgroundColor: theme.background,
    backgroundGradientFrom: theme.background,
    backgroundGradientTo: theme.background,
    decimalPlaces: 1,
    color: (opacity = 1) =>
      theme.tint +
      Math.round(opacity * 255)
        .toString(16)
        .padStart(2, "0"),
    labelColor: (opacity = 1) =>
      theme.icon +
      Math.round(opacity * 255)
        .toString(16)
        .padStart(2, "0"),
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "5",
      strokeWidth: "2",
      stroke: theme.tint,
    },
    propsForBackgroundLines: {
      strokeDasharray: "", // solid lines
      stroke: theme.icon + "20",
    },
  };

  return (
    <View style={styles.container}>
      <LineChart
        data={{
          labels: labels,
          datasets: [
            {
              data: data,
            },
          ],
        }}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        fromZero={false}
        segments={4}
        yAxisSuffix=" kg"
        yAxisInterval={1}
        withInnerLines={true}
        withOuterLines={false}
        withVerticalLines={false}
        withHorizontalLines={true}
        withDots={data.length <= 10}
        withShadow={false}
        yAxisLabel=""
        formatYLabel={(value) => `${parseFloat(value).toFixed(1)}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginBottom: 8,
    paddingRight: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});
