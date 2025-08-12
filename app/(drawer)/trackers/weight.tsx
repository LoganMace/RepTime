import React, { useCallback, useEffect, useState, useMemo } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { useFocusEffect } from "expo-router";

import { ThemedText } from "../../../components/ThemedText";
import { ThemedView } from "../../../components/ThemedView";
import AddWeightCard from "../../../components/weight/AddWeightCard";
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
} from "../../../utils/weightStorage";
import { loadProfileData, lbsToKg } from "../../../utils/profileStorage";

export default function WeightTrackingScreen() {
  const { getStyles } = useResponsiveStyles();
  const { colors } = useTheme();
  const styles = useMemo(() => {
    return getStyles(mobileStyles(colors), tabletStyles(colors));
  }, [getStyles, colors]);
  const { useMocks } = useMocksContext();

  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [newWeight, setNewWeight] = useState("");
  const [goalWeight, setGoalWeightState] = useState<number>(77.0); // Default goal weight (~170 lbs in kg)
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [loading, setLoading] = useState(true);
  const [weightUnits, setWeightUnits] = useState<"metric" | "imperial">("imperial");

  // Load weight data from storage
  const loadWeightData = useCallback(async () => {
    try {
      setLoading(true);

      // Load weight units preference
      const profileData = await loadProfileData();
      console.log("Loading weight units:", profileData.preferences.weightUnits);
      setWeightUnits(profileData.preferences.weightUnits);

      // Initialize mock data if using mocks and no data exists
      if (useMocks) {
        await initializeMockWeightData();
      }

      // Load weight entries
      const entries = await loadWeightEntries();
      
      // Debug: Check for invalid weight data
      console.log("Raw weight entries:", entries);
      const invalidEntries = entries.filter(entry => 
        !entry.weight || isNaN(entry.weight) || !isFinite(entry.weight) || entry.weight <= 0 || entry.weight > 1000
      );
      if (invalidEntries.length > 0) {
        console.warn("Found invalid weight entries:", invalidEntries);
      }
      
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

  // Reload data when screen comes into focus (e.g., returning from Profile page)
  useFocusEffect(
    useCallback(() => {
      loadWeightData();
    }, [loadWeightData])
  );

  const currentWeight = weightEntries[0]?.weight || 0;
  const previousWeight = weightEntries[1]?.weight || currentWeight;
  const weightChange = currentWeight - previousWeight;

  const addWeightEntry = async () => {
    if (!newWeight || isNaN(parseFloat(newWeight))) {
      Alert.alert("Error", "Please enter a valid weight");
      return;
    }

    try {
      let weightValue = parseFloat(newWeight);
      // Convert to kg for storage if user entered imperial units
      if (weightUnits === "imperial") {
        weightValue = lbsToKg(weightValue);
      }
      await saveWeightEntry(weightValue);
      setNewWeight("");
      // Reload data to reflect changes
      await loadWeightData();
    } catch (error) {
      console.error("Error adding weight entry:", error);
      Alert.alert("Error", "Failed to save weight entry");
    }
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
              units={weightUnits}
            />

            {/* Quick Add Weight */}
            <AddWeightCard
              newWeight={newWeight}
              units={weightUnits}
              onWeightChange={setNewWeight}
              onAddWeight={addWeightEntry}
            />

            {/* Weight Trend Graph */}
            <WeightChartCard
              weightEntries={weightEntries}
              goalWeight={goalWeight}
              units={weightUnits}
            />

            {/* Weight History */}
            <WeightHistoryCard
              weightEntries={weightEntries}
              units={weightUnits}
              showAllHistory={showAllHistory}
              onToggleHistory={() => setShowAllHistory(!showAllHistory)}
            />
          </>
        )}
      </ScrollView>
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
