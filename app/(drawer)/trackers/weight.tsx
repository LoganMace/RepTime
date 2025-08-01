import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedText } from "../../../components/ThemedText";
import { ThemedView } from "../../../components/ThemedView";
import { WeightTrendChart } from "../../../components/WeightTrendChart";
import { useResponsiveStyles } from "../../../hooks/useResponsiveStyles";

interface WeightEntry {
  id: string;
  weight: number;
  date: string;
  timestamp: number;
  note?: string;
}

export default function WeightTrackingScreen() {
  const { getStyles } = useResponsiveStyles();
  const styles = getStyles(mobileStyles, tabletStyles);

  // Mock data for demonstration with daily fluctuations
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([
    {
      id: "10",
      weight: 175.6,
      date: "Today",
      timestamp: Date.now(),
    },
    {
      id: "9",
      weight: 176.2,
      date: "Yesterday",
      timestamp: Date.now() - 86400000,
    },
    {
      id: "8",
      weight: 175.8,
      date: "2 days ago",
      timestamp: Date.now() - 172800000,
    },
    {
      id: "7",
      weight: 178.0,
      date: "3 days ago",
      timestamp: Date.now() - 259200000,
    },
    {
      id: "6",
      weight: 177.4,
      date: "4 days ago",
      timestamp: Date.now() - 345600000,
    },
    {
      id: "5",
      weight: 179.1,
      date: "5 days ago",
      timestamp: Date.now() - 432000000,
    },
    {
      id: "4",
      weight: 178.8,
      date: "6 days ago",
      timestamp: Date.now() - 518400000,
    },
    {
      id: "3",
      weight: 180.2,
      date: "1 week ago",
      timestamp: Date.now() - 604800000,
    },
    {
      id: "2",
      weight: 179.6,
      date: "8 days ago",
      timestamp: Date.now() - 691200000,
    },
    {
      id: "1",
      weight: 181.3,
      date: "9 days ago",
      timestamp: Date.now() - 777600000,
    },
  ]);

  const [newWeight, setNewWeight] = useState("");
  const [goalWeight] = useState(165); // Mock goal weight

  const currentWeight = weightEntries[0]?.weight || 0;
  const previousWeight = weightEntries[1]?.weight || currentWeight;
  const weightChange = currentWeight - previousWeight;

  const addWeightEntry = () => {
    if (!newWeight || isNaN(parseFloat(newWeight))) {
      Alert.alert("Error", "Please enter a valid weight");
      return;
    }

    const entry: WeightEntry = {
      id: Date.now().toString(),
      weight: parseFloat(newWeight),
      date: "Today",
      timestamp: Date.now(),
    };

    setWeightEntries([entry, ...weightEntries]);
    setNewWeight("");
  };

  const getChangeColor = (change: number) => {
    if (change < 0) return "#22c55e"; // Green for weight loss
    if (change > 0) return "#ef4444"; // Red for weight gain
    return "#6b7280"; // Gray for no change
  };

  const getChangeIcon = (change: number) => {
    if (change < 0) return "↓";
    if (change > 0) return "↑";
    return "→";
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current < previous) return "🟢";
    if (current > previous) return "🔴";
    return "🟡";
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <ThemedText style={styles.subtitle}>
            Monitor your weight loss journey
          </ThemedText>
        </View>

        {/* Current Weight Summary */}
        <View style={styles.summaryCard}>
          <ThemedText style={styles.currentWeight}>
            {currentWeight} lbs
          </ThemedText>
          <ThemedText
            style={[
              styles.weightChange,
              { color: getChangeColor(weightChange) },
            ]}
          >
            {getChangeIcon(weightChange)} {Math.abs(weightChange).toFixed(1)}{" "}
            lbs since last entry
          </ThemedText>
          {goalWeight > 0 && (
            <ThemedText style={styles.goalProgress}>
              Goal: {goalWeight} lbs •{" "}
              {Math.abs(currentWeight - goalWeight).toFixed(1)} lbs to go
            </ThemedText>
          )}
        </View>

        {/* Quick Add Weight */}
        <View style={styles.addWeightCard}>
          <ThemedText style={styles.cardTitle}>Quick Add Weight</ThemedText>
          <View style={styles.addWeightForm}>
            <TextInput
              style={styles.weightInput}
              placeholder="Enter weight (lbs)"
              placeholderTextColor="#9CA3AF"
              value={newWeight}
              onChangeText={setNewWeight}
              keyboardType="decimal-pad"
            />
            <TouchableOpacity style={styles.addButton} onPress={addWeightEntry}>
              <ThemedText style={styles.addButtonText}>Add</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Weight Trend Graph */}
        <View style={styles.chartCard}>
          <ThemedText style={styles.cardTitle}>Weight Trend</ThemedText>
          <WeightTrendChart
            data={weightEntries}
            goalWeight={goalWeight}
            showSmoothing={true}
          />
          <View style={styles.chartDescription}>
            <ThemedText style={styles.chartDescriptionText}>
              The dotted line shows your actual daily weights, while the solid
              green line represents a 3-day moving average to smooth out natural
              fluctuations and reveal your true weight trend.
            </ThemedText>
          </View>
        </View>

        {/* Weight History */}
        <View style={styles.historyCard}>
          <ThemedText style={styles.cardTitle}>Weight History</ThemedText>
          {weightEntries.map((entry, index) => {
            const previousEntry = weightEntries[index + 1];
            const change = previousEntry
              ? entry.weight - previousEntry.weight
              : 0;

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
                    <ThemedText style={styles.historyDate}>
                      {entry.date}
                    </ThemedText>
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
        </View>

        {/* Features Coming Soon */}
        <View style={styles.comingSoonCard}>
          <ThemedText style={styles.cardTitle}>Coming Soon</ThemedText>
          <ThemedText style={styles.featureList}>
            🎯 Goal Weight Progress Tracking{"\n"}
            📊 Advanced Trend Analysis{"\n"}
            📝 Weight Entry Notes & Annotations{"\n"}
            🏆 Milestone Badges & Achievements{"\n"}
            📸 Progress Photo Comparison{"\n"}
            📱 Data Export & Backup
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const tabletStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 48,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.7,
  },
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
  addWeightCard: {
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
  addWeightForm: {
    flexDirection: "row",
    gap: 12,
  },
  weightInput: {
    flex: 1,
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#FFFFFF",
  },
  addButton: {
    backgroundColor: "#22c55e",
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    justifyContent: "center",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  chartCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  chartDescription: {
    marginTop: 24,
    paddingHorizontal: 10,
  },
  chartDescriptionText: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: "center",
    lineHeight: 20,
  },
  historyCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 20,
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
  comingSoonCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  featureList: {
    fontSize: 14,
    lineHeight: 22,
    opacity: 0.8,
  },
});

const mobileStyles = StyleSheet.create({
  ...tabletStyles,
  scrollContainer: {
    ...tabletStyles.scrollContainer,
    padding: 16,
    paddingTop: 32,
  },
  subtitle: {
    ...tabletStyles.subtitle,
    fontSize: 14,
  },
  currentWeight: {
    ...tabletStyles.currentWeight,
    fontSize: 28,
    lineHeight: 34,
  },
  addWeightForm: {
    ...tabletStyles.addWeightForm,
    flexDirection: "column",
    gap: 12,
  },
  addButton: {
    ...tabletStyles.addButton,
    alignSelf: "stretch",
  },
  historyEntry: {
    ...tabletStyles.historyEntry,
    paddingVertical: 16,
  },
  historyWeight: {
    ...tabletStyles.historyWeight,
    fontSize: 16,
  },
  chartDescription: {
    ...tabletStyles.chartDescription,
    marginTop: 66,
    paddingHorizontal: 10,
  },
  chartDescriptionText: {
    ...tabletStyles.chartDescriptionText,
    fontSize: 12,
  },
});
