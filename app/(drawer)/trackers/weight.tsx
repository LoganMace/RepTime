import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedText } from "../../../components/ThemedText";
import { ThemedView } from "../../../components/ThemedView";
import { WeightTrendChart } from "../../../components/WeightTrendChart";
import { useMocksContext } from "../../../contexts/MocksContext";
import { useResponsiveStyles } from "../../../hooks/useResponsiveStyles";
import {
  formatDateForDisplay,
  getWeightGoal,
  initializeMockWeightData,
  loadWeightEntries,
  addWeightEntry as saveWeightEntry,
  setWeightGoal,
  type WeightEntry,
} from "../../../utils/weightStorage";

export default function WeightTrackingScreen() {
  const { getStyles } = useResponsiveStyles();
  const styles = getStyles(mobileStyles, tabletStyles);
  const { useMocks } = useMocksContext();

  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [newWeight, setNewWeight] = useState("");
  const [goalWeight, setGoalWeightState] = useState<number>(165); // Default goal weight
  const [newGoalWeight, setNewGoalWeight] = useState("");
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load weight data from storage
  const loadWeightData = useCallback(async () => {
    try {
      setLoading(true);

      // Initialize mock data if using mocks and no data exists
      if (useMocks) {
        await initializeMockWeightData();
      }

      // Load weight entries
      const entries = await loadWeightEntries();
      // Update date format for display
      const entriesWithDisplayDates = entries.map((entry) => ({
        ...entry,
        date: formatDateForDisplay(entry.date),
      }));
      setWeightEntries(entriesWithDisplayDates);

      // Load goal weight
      const goal = await getWeightGoal();
      if (goal) {
        setGoalWeightState(goal);
      }
    } catch (error) {
      console.error("Error loading weight data:", error);
      Alert.alert("Error", "Failed to load weight data");
    } finally {
      setLoading(false);
    }
  }, [useMocks]);

  // Load data on component mount
  useEffect(() => {
    loadWeightData();
  }, [loadWeightData]);

  const currentWeight = weightEntries[0]?.weight || 0;
  const previousWeight = weightEntries[1]?.weight || currentWeight;
  const weightChange = currentWeight - previousWeight;

  const addWeightEntry = async () => {
    if (!newWeight || isNaN(parseFloat(newWeight))) {
      Alert.alert("Error", "Please enter a valid weight");
      return;
    }

    try {
      await saveWeightEntry(parseFloat(newWeight));
      setNewWeight("");
      // Reload data to reflect changes
      await loadWeightData();
    } catch (error) {
      console.error("Error adding weight entry:", error);
      Alert.alert("Error", "Failed to save weight entry");
    }
  };

  const updateGoalWeight = async () => {
    if (!newGoalWeight || isNaN(parseFloat(newGoalWeight))) {
      Alert.alert("Error", "Please enter a valid goal weight");
      return;
    }

    try {
      const goal = parseFloat(newGoalWeight);
      await setWeightGoal(goal);
      setGoalWeightState(goal);
      setNewGoalWeight("");
      setShowGoalModal(false);
      Alert.alert("Success", "Goal weight updated successfully!");
    } catch (error) {
      console.error("Error setting goal weight:", error);
      Alert.alert("Error", "Failed to save goal weight");
    }
  };

  const openGoalModal = () => {
    setNewGoalWeight(goalWeight.toString());
    setShowGoalModal(true);
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

        {loading ? (
          <View style={styles.loadingContainer}>
            <ThemedText style={styles.loadingText}>
              Loading weight data...
            </ThemedText>
          </View>
        ) : (
          <>
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
                {getChangeIcon(weightChange)}{" "}
                {Math.abs(weightChange).toFixed(1)} lbs since last entry
              </ThemedText>
              {goalWeight > 0 && (
                <ThemedText style={styles.goalProgress}>
                  Goal: {goalWeight} lbs •{" "}
                  {Math.abs(currentWeight - goalWeight).toFixed(1)} lbs to go
                </ThemedText>
              )}
              <TouchableOpacity
                style={styles.editGoalButton}
                onPress={openGoalModal}
              >
                <ThemedText style={styles.editGoalText}>
                  {goalWeight > 0 ? "Edit Goal" : "Set Goal"}
                </ThemedText>
              </TouchableOpacity>
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
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={addWeightEntry}
                >
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
                  The dotted line shows your actual daily weights, while the
                  solid green line represents a 3-day moving average to smooth
                  out natural fluctuations and reveal your true weight trend.
                </ThemedText>
              </View>
            </View>

            {/* Weight History */}
            <View style={styles.historyCard}>
              <ThemedText style={styles.cardTitle}>Weight History</ThemedText>
              {weightEntries.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <ThemedText style={styles.emptyText}>
                    No weight entries yet. Add your first weight above to start
                    tracking!
                  </ThemedText>
                </View>
              ) : (
                <>
                  {(showAllHistory
                    ? weightEntries
                    : weightEntries.slice(0, 5)
                  ).map((entry, index) => {
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

                  {weightEntries.length > 5 && (
                    <TouchableOpacity
                      style={styles.showMoreButton}
                      onPress={() => setShowAllHistory(!showAllHistory)}
                    >
                      <ThemedText style={styles.showMoreText}>
                        {showAllHistory
                          ? "Show Less"
                          : `Show More (${
                              weightEntries.length - 5
                            } more entries)`}
                      </ThemedText>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>
          </>
        )}
      </ScrollView>

      {/* Goal Weight Modal */}
      <Modal
        visible={showGoalModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowGoalModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>Set Goal Weight</ThemedText>
            <ThemedText style={styles.modalSubtitle}>
              Current goal: {goalWeight > 0 ? `${goalWeight} lbs` : "Not set"}
            </ThemedText>

            <View style={styles.modalForm}>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter goal weight (lbs)"
                placeholderTextColor="#9CA3AF"
                value={newGoalWeight}
                onChangeText={setNewGoalWeight}
                keyboardType="decimal-pad"
                autoFocus={true}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => setShowGoalModal(false)}
                >
                  <ThemedText style={styles.modalCancelText}>Cancel</ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalSaveButton}
                  onPress={updateGoalWeight}
                >
                  <ThemedText style={styles.modalSaveText}>
                    Save Goal
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
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
  goalWeightCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  goalDescription: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 16,
  },
  goalWeightForm: {
    flexDirection: "row",
    gap: 12,
  },
  goalButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    justifyContent: "center",
  },
  goalButtonText: {
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
    marginTop: 32,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
  },
  loadingText: {
    color: "#A0A0A0",
    fontSize: 16,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 14,
    opacity: 0.8,
    textAlign: "center",
    marginBottom: 24,
  },
  modalForm: {
    gap: 20,
  },
  modalInput: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  modalCancelText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  modalSaveButton: {
    flex: 1,
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  modalSaveText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

const mobileStyles = StyleSheet.create({
  ...tabletStyles,
  scrollContainer: {
    ...tabletStyles.scrollContainer,
    padding: 16,
    paddingTop: 24,
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
  goalWeightForm: {
    ...tabletStyles.goalWeightForm,
    flexDirection: "column",
    gap: 12,
  },
  addButton: {
    ...tabletStyles.addButton,
    alignSelf: "stretch",
  },
  goalButton: {
    ...tabletStyles.goalButton,
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
    marginTop: 30,
    paddingHorizontal: 10,
  },
  chartDescriptionText: {
    ...tabletStyles.chartDescriptionText,
    fontSize: 12,
  },
  showMoreText: {
    ...tabletStyles.showMoreText,
    fontSize: 13,
  },
  modalContent: {
    ...tabletStyles.modalContent,
    padding: 20,
    paddingBottom: 36,
  },
  modalTitle: {
    ...tabletStyles.modalTitle,
    fontSize: 18,
  },
  modalButtons: {
    ...tabletStyles.modalButtons,
    flexDirection: "column",
    gap: 12,
  },
  modalCancelButton: {
    ...tabletStyles.modalCancelButton,
    flex: 0,
  },
  modalSaveButton: {
    ...tabletStyles.modalSaveButton,
    flex: 0,
  },
});
