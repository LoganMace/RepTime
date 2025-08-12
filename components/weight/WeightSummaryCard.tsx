import React from "react";
import { StyleSheet, View } from "react-native";
import { useResponsiveStyles } from "../../hooks/useResponsiveStyles";
import { useTheme } from "../../hooks/useTheme";
import { formatWeight } from "../../utils/profileStorage";
import { ThemedText } from "../ThemedText";
import { getChangeColor, getChangeIcon } from "./WeightConstants";

interface WeightSummaryCardProps {
  currentWeight: number;
  weightChange: number;
  goalWeight: number;
  units: "metric" | "imperial";
}

export default function WeightSummaryCard({
  currentWeight,
  weightChange,
  goalWeight,
  units,
}: WeightSummaryCardProps) {
  const { colors } = useTheme();
  const { getStyles } = useResponsiveStyles();
  const styles = getStyles(mobileStyles(colors), tabletStyles(colors));

  return (
    <View style={styles.summaryCard}>
      <ThemedText style={styles.currentWeight}>
        {formatWeight(currentWeight, units)}
      </ThemedText>
      <ThemedText
        style={[styles.weightChange, { color: getChangeColor(weightChange) }]}
      >
        {getChangeIcon(weightChange)}{" "}
        {formatWeight(Math.abs(weightChange), units)} since last entry
      </ThemedText>
      {goalWeight > 0 && (
        <ThemedText style={styles.goalProgress}>
          Goal: {formatWeight(goalWeight, units)} •{" "}
          {formatWeight(Math.abs(currentWeight - goalWeight), units)} to go
        </ThemedText>
      )}
    </View>
  );
}

const tabletStyles = (colors: ReturnType<typeof useTheme>["colors"]) =>
  StyleSheet.create({
    summaryCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 24,
      marginBottom: 16,
      alignItems: "center",
    },
    currentWeight: {
      fontSize: 36,
      fontWeight: "900",
      marginBottom: 8,
      lineHeight: 44,
      includeFontPadding: false,
    },
    weightChange: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 4,
    },
    goalProgress: {
      fontSize: 14,
      opacity: 0.8,
    },
  });

const mobileStyles = (colors: ReturnType<typeof useTheme>["colors"]) => {
  const tablet = tabletStyles(colors);
  return StyleSheet.create({
    ...tablet,
    currentWeight: {
      ...tablet.currentWeight,
      fontSize: 28,
      lineHeight: 34,
    },
  });
};
