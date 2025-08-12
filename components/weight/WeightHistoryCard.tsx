import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { useResponsiveStyles } from "../../hooks/useResponsiveStyles";
import { ThemedText } from "../ThemedText";
import {
  WeightEntry,
  getChangeColor,
  getChangeIcon,
  getTrendIcon,
} from "./WeightConstants";
import { formatWeight } from "../../utils/profileStorage";

interface WeightHistoryCardProps {
  weightEntries: WeightEntry[];
  units: "metric" | "imperial";
  showAllHistory: boolean;
  onToggleHistory: () => void;
}

export default function WeightHistoryCard({
  weightEntries,
  units,
  showAllHistory,
  onToggleHistory,
}: WeightHistoryCardProps) {
  const { colors } = useTheme();
  const { getStyles } = useResponsiveStyles();
  const styles = getStyles(mobileStyles(colors), tabletStyles(colors));

  if (weightEntries.length === 0) {
    return (
      <View style={styles.historyCard}>
        <ThemedText style={styles.cardTitle}>Weight History</ThemedText>
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>
            No weight entries yet. Add your first weight above to start
            tracking!
          </ThemedText>
        </View>
      </View>
    );
  }

  const displayEntries = showAllHistory
    ? weightEntries
    : weightEntries.slice(0, 5);

  return (
    <View style={styles.historyCard}>
      <ThemedText style={styles.cardTitle}>Weight History</ThemedText>
      {displayEntries.map((entry, index) => {
        const previousEntry = weightEntries[index + 1];
        const change = previousEntry ? entry.weight - previousEntry.weight : 0;

        return (
          <View key={entry.id} style={styles.historyEntry}>
            <View style={styles.historyLeft}>
              <ThemedText style={styles.historyIcon}>
                {getTrendIcon(
                  entry.weight,
                  previousEntry?.weight || entry.weight
                )}
              </ThemedText>
              <View>
                <ThemedText style={styles.historyWeight}>
                  {formatWeight(entry.weight, units)}
                </ThemedText>
                <ThemedText style={styles.historyDate}>{entry.date}</ThemedText>
              </View>
            </View>
            {previousEntry && (
              <ThemedText
                style={[
                  styles.historyChange,
                  { color: getChangeColor(change) },
                ]}
              >
                {getChangeIcon(change)}
                {formatWeight(Math.abs(change), units)}
              </ThemedText>
            )}
          </View>
        );
      })}

      {weightEntries.length > 5 && (
        <TouchableOpacity
          style={styles.showMoreButton}
          onPress={onToggleHistory}
        >
          <ThemedText style={styles.showMoreText}>
            {showAllHistory
              ? "Show Less"
              : `Show More (${weightEntries.length - 5} more entries)`}
          </ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );
}

const tabletStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  historyCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  historyEntry: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  historyLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  historyIcon: {
    fontSize: 20,
  },
  historyWeight: {
    fontSize: 18,
    fontWeight: "600",
  },
  historyDate: {
    fontSize: 14,
    opacity: 0.7,
  },
  historyChange: {
    fontSize: 14,
    fontWeight: "600",
  },
  showMoreButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.inputBackground,
    borderRadius: 8,
    alignItems: "center",
  },
  showMoreText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.success,
  },
  emptyContainer: {
    alignItems: "center",
    padding: 32,
    gap: 16,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});

const mobileStyles = (colors: ReturnType<typeof useTheme>['colors']) => {
  const tablet = tabletStyles(colors);
  return StyleSheet.create({
    ...tablet,
    historyEntry: {
      ...tablet.historyEntry,
      paddingVertical: 16,
    },
    historyWeight: {
      ...tablet.historyWeight,
      fontSize: 16,
    },
    showMoreText: {
      ...tablet.showMoreText,
      fontSize: 13,
    },
  });
};
