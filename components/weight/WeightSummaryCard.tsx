import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useResponsiveStyles } from "../../hooks/useResponsiveStyles";
import { ThemedText } from "../ThemedText";
import { getChangeColor, getChangeIcon } from "./WeightConstants";

interface WeightSummaryCardProps {
  currentWeight: number;
  weightChange: number;
  goalWeight: number;
  onEditGoal: () => void;
}

export default function WeightSummaryCard({
  currentWeight,
  weightChange,
  goalWeight,
  onEditGoal,
}: WeightSummaryCardProps) {
  const { getStyles } = useResponsiveStyles();
  const styles = getStyles(mobileStyles, tabletStyles);

  return (
    <View style={styles.summaryCard}>
      <ThemedText style={styles.currentWeight}>{currentWeight} lbs</ThemedText>
      <ThemedText
        style={[styles.weightChange, { color: getChangeColor(weightChange) }]}
      >
        {getChangeIcon(weightChange)} {Math.abs(weightChange).toFixed(1)} lbs
        since last entry
      </ThemedText>
      {goalWeight > 0 && (
        <ThemedText style={styles.goalProgress}>
          Goal: {goalWeight} lbs •{" "}
          {Math.abs(currentWeight - goalWeight).toFixed(1)} lbs to go
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

const tabletStyles = StyleSheet.create({
  summaryCard: {
    backgroundColor: "#1a1a1a",
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
    backgroundColor: "#3b82f630",
    borderRadius: 8,
    alignItems: "center",
  },
  editGoalText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#3b82f6",
  },
});

const mobileStyles = StyleSheet.create({
  ...tabletStyles,
  currentWeight: {
    ...tabletStyles.currentWeight,
    fontSize: 28,
    lineHeight: 34,
  },
});
