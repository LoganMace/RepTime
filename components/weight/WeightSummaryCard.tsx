import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { useResponsiveStyles } from "../../hooks/useResponsiveStyles";
import { ThemedText } from "../ThemedText";
import { getChangeColor, getChangeIcon } from "./WeightConstants";
import { formatWeight } from "../../utils/profileStorage";

interface WeightSummaryCardProps {
  currentWeight: number;
  weightChange: number;
  goalWeight: number;
  units: "metric" | "imperial";
  onEditGoal: () => void;
}

export default function WeightSummaryCard({
  currentWeight,
  weightChange,
  goalWeight,
  units,
  onEditGoal,
}: WeightSummaryCardProps) {
  const { colors } = useTheme();
  const { getStyles } = useResponsiveStyles();
  const styles = getStyles(mobileStyles(colors), tabletStyles(colors));

  return (
    <View style={styles.summaryCard}>
      <ThemedText style={styles.currentWeight}>{formatWeight(currentWeight, units)}</ThemedText>
      <ThemedText
        style={[styles.weightChange, { color: getChangeColor(weightChange) }]}
      >
        {getChangeIcon(weightChange)} {formatWeight(Math.abs(weightChange), units)}
        since last entry
      </ThemedText>
      {goalWeight > 0 && (
        <ThemedText style={styles.goalProgress}>
          Goal: {formatWeight(goalWeight, units)} •{" "}
          {formatWeight(Math.abs(currentWeight - goalWeight), units)} to go
        </ThemedText>
      )}
      <TouchableOpacity style={styles.editGoalButton} onPress={onEditGoal}>
        <ThemedText style={styles.editGoalText}>
          {goalWeight > 0 ? "Edit Goal" : "Set Goal"}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const tabletStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
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
  editGoalButton: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.primary + '30',
    borderRadius: 12,
    alignItems: "center",
  },
  editGoalText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary,
  },
});

const mobileStyles = (colors: ReturnType<typeof useTheme>['colors']) => {
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
