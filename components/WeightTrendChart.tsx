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
import { useResponsiveStyles } from "../hooks/useResponsiveStyles";
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
  height = 240, // Increased to accommodate date labels
  showSmoothing = true,
}: WeightTrendChartProps) {
  const { getStyles, isMobile } = useResponsiveStyles();
  const styles = getStyles(mobileStyles, tabletStyles);

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
  const bottomPadding = 60; // Extra space for date labels
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding - bottomPadding;

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

  // Generate X-axis date labels
  const formatDate = (timestamp: number, isMobile: boolean = false) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (isMobile) {
      // More compact labels for mobile
      if (diffDays === 1) return "Today";
      if (diffDays === 2) return "Yest";
      if (diffDays <= 7) return `${diffDays - 1}d`;
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }

    // Full labels for tablet
    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1}d ago`;
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // Select dates to show on x-axis with better mobile spacing
  const maxLabels = isMobile ? 4 : 6; // Fewer labels on mobile
  const labelStep = Math.max(1, Math.floor(sortedData.length / maxLabels));

  const xAxisLabels = sortedData
    .filter((_, index) => {
      // Always show first and last
      if (index === 0 || index === sortedData.length - 1) return true;
      // Show every nth entry based on step calculation
      return index % labelStep === 0;
    })
    .map((entry, _, filteredArray) => {
      const originalIndex = sortedData.findIndex(
        (item) => item.id === entry.id
      );
      return {
        x: getX(originalIndex),
        label: formatDate(entry.timestamp, isMobile),
        isRecent: entry.timestamp > Date.now() - 7 * 24 * 60 * 60 * 1000,
      };
    });

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

        {/* X-axis line */}
        <Line
          x1={padding}
          y1={padding + chartHeight}
          x2={width - padding}
          y2={padding + chartHeight}
          stroke="#444"
          strokeWidth="1"
        />

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
            fontSize={isMobile ? "10" : "12"}
            fill="#9CA3AF"
            textAnchor="end"
          >
            {label.weight}
          </SvgText>
        ))}

        {/* X-axis date labels */}
        {xAxisLabels.map((label, index) => (
          <SvgText
            key={index}
            x={label.x}
            y={padding + chartHeight + 25}
            fontSize={isMobile ? "8" : "11"}
            fill="#9CA3AF"
            textAnchor="middle"
          >
            {label.label}
          </SvgText>
        ))}

        {/* Goal weight label */}
        {goalY && goalWeight && (
          <SvgText
            x={width - padding + 5}
            y={goalY + 3}
            fontSize={isMobile ? "10" : "12"}
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

const tabletStyles = StyleSheet.create({
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

const mobileStyles = StyleSheet.create({
  ...tabletStyles,
  legend: {
    ...tabletStyles.legend,
    gap: 8,
    marginTop: 8,
  },
  legendItem: {
    ...tabletStyles.legendItem,
    gap: 3,
    marginBottom: 4,
  },
  legendLine: {
    ...tabletStyles.legendLine,
    width: 16,
    height: 2,
  },
  legendText: {
    ...tabletStyles.legendText,
    fontSize: 10,
  },
});
