import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  Line,
  LinearGradient,
  Path,
  Stop,
  Text as SvgText,
} from "react-native-svg";
import { ThemedText } from "./ThemedText";

interface WeightEntry {
  id: string;
  weight: number;
  date: string;
  timestamp: number;
}

interface WeightTrendChartProps {
  data: WeightEntry[];
  goalWeight?: number;
  width?: number;
  height?: number;
  showSmoothing?: boolean;
}

export function WeightTrendChart({
  data,
  goalWeight,
  width = Dimensions.get("window").width - 80,
  height = 200,
  showSmoothing = true,
}: WeightTrendChartProps) {
  if (data.length === 0) {
    return (
      <View style={[styles.container, { width, height }]}>
        <ThemedText style={styles.noDataText}>
          No weight data available
        </ThemedText>
      </View>
    );
  }

  // Sort data by timestamp (oldest first for chart)
  const sortedData = [...data].sort((a, b) => a.timestamp - b.timestamp);

  // Calculate chart dimensions
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Calculate weight range
  const weights = sortedData.map((entry) => entry.weight);
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);
  const weightRange = maxWeight - minWeight;
  const yPadding = weightRange * 0.1; // 10% padding
  const yMin = minWeight - yPadding;
  const yMax = maxWeight + yPadding;
  const yRange = yMax - yMin;

  // Helper function to convert data to chart coordinates
  const getX = (index: number) =>
    padding + (index / (sortedData.length - 1)) * chartWidth;
  const getY = (weight: number) =>
    padding + ((yMax - weight) / yRange) * chartHeight;

  // Calculate moving average for smoothing
  const calculateMovingAverage = (
    data: WeightEntry[],
    windowSize: number = 3
  ) => {
    const smoothedData: { weight: number; index: number }[] = [];

    for (let i = 0; i < data.length; i++) {
      const start = Math.max(0, i - Math.floor(windowSize / 2));
      const end = Math.min(data.length, i + Math.ceil(windowSize / 2));
      const window = data.slice(start, end);
      const average =
        window.reduce((sum, entry) => sum + entry.weight, 0) / window.length;
      smoothedData.push({ weight: average, index: i });
    }

    return smoothedData;
  };

  // Generate paths
  const generatePath = (points: { weight: number; index: number }[]) => {
    if (points.length === 0) return "";

    let path = `M ${getX(points[0].index)} ${getY(points[0].weight)}`;

    for (let i = 1; i < points.length; i++) {
      path += ` L ${getX(points[i].index)} ${getY(points[i].weight)}`;
    }

    return path;
  };

  // Create data points for original and smoothed lines
  const originalPoints = sortedData.map((entry, index) => ({
    weight: entry.weight,
    index,
  }));
  const smoothedPoints = showSmoothing
    ? calculateMovingAverage(sortedData)
    : [];

  // Generate paths
  const originalPath = generatePath(originalPoints);
  const smoothedPath = showSmoothing ? generatePath(smoothedPoints) : "";

  // Calculate goal line Y position if goal weight is provided
  const goalY = goalWeight ? getY(goalWeight) : null;

  // Generate Y-axis labels
  const yAxisLabels = [];
  const labelCount = 5;
  for (let i = 0; i < labelCount; i++) {
    const weight = yMin + (yRange * i) / (labelCount - 1);
    const y = getY(weight);
    yAxisLabels.push({ weight: weight.toFixed(1), y });
  }

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient
            id="smoothedGradient"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <Stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#22c55e" stopOpacity="0.2" />
          </LinearGradient>
        </Defs>

        {/* Grid lines */}
        {yAxisLabels.map((label, index) => (
          <Line
            key={index}
            x1={padding}
            y1={label.y}
            x2={width - padding}
            y2={label.y}
            stroke="#333"
            strokeWidth="0.5"
            strokeDasharray="2,2"
          />
        ))}

        {/* Goal weight line */}
        {goalY && (
          <Line
            x1={padding}
            y1={goalY}
            x2={width - padding}
            y2={goalY}
            stroke="#fbbf24"
            strokeWidth="2"
            strokeDasharray="5,3"
          />
        )}

        {/* Original weight line (dotted, lighter) */}
        <Path
          d={originalPath}
          stroke="#6b7280"
          strokeWidth="1.5"
          strokeDasharray="3,3"
          fill="none"
        />

        {/* Smoothed trend line */}
        {showSmoothing && smoothedPath && (
          <Path d={smoothedPath} stroke="#22c55e" strokeWidth="3" fill="none" />
        )}

        {/* Data points */}
        {originalPoints.map((point, index) => (
          <Circle
            key={index}
            cx={getX(point.index)}
            cy={getY(point.weight)}
            r="4"
            fill="#22c55e"
            stroke="#1a1a1a"
            strokeWidth="2"
          />
        ))}

        {/* Y-axis labels */}
        {yAxisLabels.map((label, index) => (
          <SvgText
            key={index}
            x={padding - 10}
            y={label.y + 3}
            fontSize="10"
            fill="#9CA3AF"
            textAnchor="end"
          >
            {label.weight}
          </SvgText>
        ))}

        {/* Goal weight label */}
        {goalY && goalWeight && (
          <SvgText
            x={width - padding + 5}
            y={goalY + 3}
            fontSize="10"
            fill="#fbbf24"
            textAnchor="start"
          >
            Goal: {goalWeight}
          </SvgText>
        )}
      </Svg>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendLine, { backgroundColor: "#6b7280" }]} />
          <ThemedText style={styles.legendText}>Actual Weight</ThemedText>
        </View>
        {showSmoothing && (
          <View style={styles.legendItem}>
            <View style={[styles.legendLine, { backgroundColor: "#22c55e" }]} />
            <ThemedText style={styles.legendText}>Trend (3-day avg)</ThemedText>
          </View>
        )}
        {goalWeight && (
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendLine,
                { backgroundColor: "#fbbf24", height: 1 },
              ]}
            />
            <ThemedText style={styles.legendText}>Goal Weight</ThemedText>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    marginVertical: 10,
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    opacity: 0.7,
    marginTop: 80,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: 10,
    gap: 15,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  legendLine: {
    width: 20,
    height: 3,
    borderRadius: 1.5,
  },
  legendText: {
    fontSize: 12,
    opacity: 0.8,
  },
});
