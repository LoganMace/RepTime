import React, { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";

import { ThemedText } from "../../../components/ThemedText";
import { ThemedView } from "../../../components/ThemedView";
import AddWeightCard from "../../../components/weight/AddWeightCard";
import GoalWeightModal from "../../../components/weight/GoalWeightModal";
import WeightChartCard from "../../../components/weight/WeightChartCard";
import { WeightEntry } from "../../../components/weight/WeightConstants";
import WeightHistoryCard from "../../../components/weight/WeightHistoryCard";
import WeightSummaryCard from "../../../components/weight/WeightSummaryCard";
import { useMocksContext } from "../../../contexts/MocksContext";
import { useResponsiveStyles } from "../../../hooks/useResponsiveStyles";
import { useTheme } from "../../../hooks/useTheme";
import {
  formatDateForDisplay,
  getWeightGoal,
  initializeMockWeightData,
  loadWeightEntries,
  addWeightEntry as saveWeightEntry,
  setWeightGoal,
} from "../../../utils/weightStorage";

export default function WeightTrackingScreen() {
  const { getStyles } = useResponsiveStyles();
  const { colors } = useTheme();
  const styles = getStyles(mobileStyles(colors), tabletStyles(colors));
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
            <WeightSummaryCard
              currentWeight={currentWeight}
              weightChange={weightChange}
              goalWeight={goalWeight}
              onEditGoal={openGoalModal}
            />

            {/* Quick Add Weight */}
            <AddWeightCard
              newWeight={newWeight}
              onWeightChange={setNewWeight}
              onAddWeight={addWeightEntry}
            />

            {/* Weight Trend Graph */}
            <WeightChartCard
              weightEntries={weightEntries}
              goalWeight={goalWeight}
            />

            {/* Weight History */}
            <WeightHistoryCard
              weightEntries={weightEntries}
              showAllHistory={showAllHistory}
              onToggleHistory={() => setShowAllHistory(!showAllHistory)}
            />
          </>
        )}
      </ScrollView>

      {/* Goal Weight Modal */}
      <GoalWeightModal
        visible={showGoalModal}
        goalWeight={goalWeight}
        newGoalWeight={newGoalWeight}
        onClose={() => setShowGoalModal(false)}
        onSave={updateGoalWeight}
        onGoalWeightChange={setNewGoalWeight}
      />
    </ThemedView>
  );
}

const tabletStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
});

const mobileStyles = (colors: ReturnType<typeof useTheme>['colors']) => {
  const tablet = tabletStyles(colors);
  return StyleSheet.create({
    ...tablet,
    scrollContainer: {
      ...tablet.scrollContainer,
      padding: 16,
      paddingTop: 24,
    },
    subtitle: {
      ...tablet.subtitle,
      fontSize: 14,
    },
  });
};
