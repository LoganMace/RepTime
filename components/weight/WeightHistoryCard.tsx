import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useResponsiveStyles } from "../../hooks/useResponsiveStyles";
import { ThemedText } from "../ThemedText";
import {
  WeightEntry,
  getChangeColor,
  getChangeIcon,
  getTrendIcon,
} from "./WeightConstants";

interface WeightHistoryCardProps {
  weightEntries: WeightEntry[];
  showAllHistory: boolean;
  onToggleHistory: () => void;
}

export default function WeightHistoryCard({
  weightEntries,
  showAllHistory,
  onToggleHistory,
}: WeightHistoryCardProps) {
  const { getStyles } = useResponsiveStyles();
  const styles = getStyles(mobileStyles, tabletStyles);

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
                  {entry.weight} lbs
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
                {Math.abs(change).toFixed(1)}
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

const tabletStyles = StyleSheet.create({
  historyCard: {
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
  historyEntry: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
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
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    alignItems: "center",
  },
  showMoreText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#22c55e",
  },
  emptyContainer: {
    alignItems: "center",
    padding: 32,
    gap: 16,
  },
  emptyText: {
    color: "#A0A0A0",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});

const mobileStyles = StyleSheet.create({
  ...tabletStyles,
  historyEntry: {
    ...tabletStyles.historyEntry,
    paddingVertical: 16,
  },
  historyWeight: {
    ...tabletStyles.historyWeight,
    fontSize: 16,
  },
  showMoreText: {
    ...tabletStyles.showMoreText,
    fontSize: 13,
  },
});
