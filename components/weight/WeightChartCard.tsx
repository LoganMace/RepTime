import React from "react";
import { StyleSheet, View } from "react-native";
import { useResponsiveStyles } from "../../hooks/useResponsiveStyles";
import { ThemedText } from "../ThemedText";
import { WeightTrendChart } from "../WeightTrendChart";
import { WeightEntry } from "./WeightConstants";

interface WeightChartCardProps {
  weightEntries: WeightEntry[];
  goalWeight: number;
}

export default function WeightChartCard({
  weightEntries,
  goalWeight,
}: WeightChartCardProps) {
  const { getStyles } = useResponsiveStyles();
  const styles = getStyles(mobileStyles, tabletStyles);

  return (
    <View style={styles.chartCard}>
      <ThemedText style={styles.cardTitle}>Weight Trend</ThemedText>
      <WeightTrendChart
        data={weightEntries}
        goalWeight={goalWeight}
        showSmoothing={true}
      />
      <View style={styles.chartDescription}>
        <ThemedText style={styles.chartDescriptionText}>
          The dotted line shows your actual daily weights, while the solid green
          line represents a 3-day moving average to smooth out natural
          fluctuations and reveal your true weight trend.
        </ThemedText>
      </View>
    </View>
  );
}

const tabletStyles = StyleSheet.create({
  chartCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  chartDescription: {
    marginTop: 32,
    paddingHorizontal: 10,
  },
  chartDescriptionText: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: "center",
    lineHeight: 20,
  },
});

const mobileStyles = StyleSheet.create({
  ...tabletStyles,
  chartDescription: {
    ...tabletStyles.chartDescription,
    marginTop: 30,
    paddingHorizontal: 10,
  },
  chartDescriptionText: {
    ...tabletStyles.chartDescriptionText,
    fontSize: 12,
  },
});
