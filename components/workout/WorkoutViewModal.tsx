import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { useTheme } from "@/hooks/useTheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import Clock from "@/components/timer/Clock";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";

// Import refactored components
import { WorkoutHeader } from "./WorkoutHeader";
import { ExerciseCard } from "./ExerciseCard";
import { EditExerciseModal } from "./EditExerciseModal";

interface WorkoutViewModalProps {
  visible: boolean;
  workout: any | null;
  units: "metric" | "imperial";
  onClose: () => void;
  onWorkoutUpdate?: (updatedWorkout: any) => void;
}

const WorkoutViewModal: React.FC<WorkoutViewModalProps> = ({
  visible,
  workout,
  units,
  onClose,
  onWorkoutUpdate,
}) => {
  const { colors } = useTheme();
  const [completed, setCompleted] = useState<number[]>([]);
  const [activeExercise, setActiveExercise] = useState<number | null>(null);
  const { getStyles } = useResponsiveStyles();

  // Timer state management
  const [clockVisible, setClockVisible] = useState(false);
  const [activeTimerData, setActiveTimerData] = useState<{
    rounds: number;
    workTime: number;
    restTime: number;
    sets: number;
    setRestTime: number;
    quickTimer?: boolean;
    skipGetReady?: boolean;
  } | null>(null);

  // Edit state management
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingExerciseIndex, setEditingExerciseIndex] = useState<number | null>(null);
  const [editingExercise, setEditingExercise] = useState<any>(null);

  const styles = useMemo(() => {
    return getStyles(mobileStyles(colors), tabletStyles(colors));
  }, [getStyles, colors]);

  useEffect(() => {
    if (!visible) {
      setCompleted([]);
      setActiveExercise(null);
      // Reset timer state when modal closes
      setClockVisible(false);
      setActiveTimerData(null);
    }
  }, [visible]);

  // Timer configuration logic
  const handleStartTimer = (ex: any) => {
    const workTime = parseInt(ex.workTime) || 0;
    const restTime = parseInt(ex.restTime) || 0;
    const sets = parseInt(ex.sets) || 1;

    if (workTime === 0 && restTime === 0) return; // No timer data

    // Determine timer type and configuration
    const isQuickTimer =
      (workTime > 0 && restTime === 0) || (workTime === 0 && restTime > 0);

    if (isQuickTimer) {
      // QuickTimer: single phase (work OR rest only)
      setActiveTimerData({
        rounds: 1,
        workTime: workTime || restTime, // Use whichever time is provided
        restTime: 0,
        sets: 1,
        setRestTime: 0,
        quickTimer: true,
        skipGetReady: true,
      });
    } else {
      // Regular timer: both work AND rest phases
      const setRestTime = parseInt(ex.setRest) || restTime; // Use setRest if provided, otherwise use restTime
      setActiveTimerData({
        rounds: parseInt(ex.reps) || 1, // Use reps as rounds
        workTime,
        restTime,
        sets,
        setRestTime,
        quickTimer: false,
        skipGetReady: false,
      });
    }

    setClockVisible(true);
  };

  // Check if exercise has timer data
  const hasTimerData = (ex: any) => {
    const workTime = parseInt(ex.workTime) || 0;
    const restTime = parseInt(ex.restTime) || 0;
    return workTime > 0 || restTime > 0;
  };

  const handleSetActive = (idx: number) => {
    setActiveExercise(activeExercise === idx ? null : idx);
  };

  const handleComplete = (idx: number, event: any) => {
    event.stopPropagation(); // Prevent triggering active state
    setCompleted((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  // Edit functionality
  const handleEditExercise = (exerciseIndex: number, event: any) => {
    event.stopPropagation(); // Prevent triggering active state
    const exercise = workout.exercises[exerciseIndex];
    setEditingExerciseIndex(exerciseIndex);
    setEditingExercise({ ...exercise }); // Create a copy to edit
    setEditModalVisible(true);
  };

  const handleSaveExercise = async () => {
    if (!editingExercise || editingExerciseIndex === null || !workout) return;

    try {
      // Load all workouts from storage
      const data = await AsyncStorage.getItem("workoutPlans");
      const workoutPlans = data ? JSON.parse(data) : [];

      // Find the workout index in storage by comparing name and savedAt
      const workoutIndex = workoutPlans.findIndex(
        (plan: any) =>
          plan.name === workout.name && plan.savedAt === workout.savedAt
      );

      if (workoutIndex === -1) {
        Alert.alert("Error", "Could not find workout to update");
        return;
      }

      // Update the specific exercise
      workoutPlans[workoutIndex].exercises[editingExerciseIndex] = editingExercise;

      // Save back to storage
      await AsyncStorage.setItem("workoutPlans", JSON.stringify(workoutPlans));

      // Update the local workout state if callback provided
      if (onWorkoutUpdate) {
        onWorkoutUpdate(workoutPlans[workoutIndex]);
      }

      // Close edit modal
      setEditModalVisible(false);
      setEditingExerciseIndex(null);
      setEditingExercise(null);

      Alert.alert("Success", "Exercise updated successfully!");
    } catch (error) {
      console.error("Error updating exercise:", error);
      Alert.alert("Error", "Failed to update exercise");
    }
  };

  const handleCancelEdit = () => {
    setEditModalVisible(false);
    setEditingExerciseIndex(null);
    setEditingExercise(null);
  };

  // Filter exercises by type
  const warmupExercises = workout?.exercises?.filter((ex: any) => ex.warmup) || [];
  const cooldownExercises = workout?.exercises?.filter((ex: any) => ex.cooldown) || [];
  const mainExercises = workout?.exercises?.filter((ex: any) => !ex.warmup && !ex.cooldown) || [];

  const progress =
    workout && workout.exercises && workout.exercises.length > 0
      ? completed.length / workout.exercises.length
      : 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <WorkoutHeader
            workout={workout}
            progress={progress}
            completedCount={completed.length}
            onClose={onClose}
          />

          {workout && workout.exercises && workout.exercises.length > 0 && (
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Warmup Card */}
              <ExerciseCard
                title="Warmup"
                icon="flame"
                iconColor="orange"
                exercises={warmupExercises}
                allExercises={workout.exercises}
                units={units}
                completed={completed}
                activeExercise={activeExercise}
                hasTimerData={hasTimerData}
                onSetActive={handleSetActive}
                onComplete={handleComplete}
                onEdit={handleEditExercise}
                onStartTimer={handleStartTimer}
              />

              {/* Main Exercises Card */}
              <ExerciseCard
                title="Exercises"
                icon="list.bullet"
                iconColor="gold"
                exercises={mainExercises}
                allExercises={workout.exercises}
                units={units}
                completed={completed}
                activeExercise={activeExercise}
                hasTimerData={hasTimerData}
                onSetActive={handleSetActive}
                onComplete={handleComplete}
                onEdit={handleEditExercise}
                onStartTimer={handleStartTimer}
              />

              {/* Cooldown Card */}
              <ExerciseCard
                title="Cooldown"
                icon="snowflake"
                iconColor="cyan"
                exercises={cooldownExercises}
                allExercises={workout.exercises}
                units={units}
                completed={completed}
                activeExercise={activeExercise}
                hasTimerData={hasTimerData}
                onSetActive={handleSetActive}
                onComplete={handleComplete}
                onEdit={handleEditExercise}
                onStartTimer={handleStartTimer}
              />

              {/* Fallback for workouts with no exercises */}
              {warmupExercises.length === 0 &&
                mainExercises.length === 0 &&
                cooldownExercises.length === 0 && (
                  <View style={styles.card}>
                    <View style={styles.cardHeader}>
                      <IconSymbol size={20} color="gold" name="list.bullet" />
                      <ThemedText style={styles.cardSubtitle}>
                        Exercises
                      </ThemedText>
                    </View>
                    <View style={styles.exercisesList}>
                      <ThemedText style={styles.emptyText}>
                        No exercises found
                      </ThemedText>
                    </View>
                  </View>
                )}
            </ScrollView>
          )}
        </View>
      </View>

      {/* Clock Timer Component */}
      {activeTimerData && (
        <Clock
          visible={clockVisible}
          onClose={() => {
            setClockVisible(false);
            setActiveTimerData(null);
          }}
          rounds={activeTimerData.rounds}
          workTime={activeTimerData.workTime}
          restTime={activeTimerData.restTime}
          sets={activeTimerData.sets}
          setRestTime={activeTimerData.setRestTime}
          skipGetReady={activeTimerData.skipGetReady}
          quickTimer={activeTimerData.quickTimer}
        />
      )}

      {/* Edit Exercise Modal */}
      <EditExerciseModal
        visible={editModalVisible}
        editingExercise={editingExercise}
        units={units}
        onClose={handleCancelEdit}
        onSave={handleSaveExercise}
        onExerciseChange={setEditingExercise}
      />
    </Modal>
  );
};

const mobileStyles = (colors: ReturnType<typeof useTheme>["colors"]) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: colors.background,
    },
    modalContent: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
      paddingTop: 16,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 12,
    },
    cardSubtitle: {
      fontSize: 16,
      fontWeight: "600",
      flex: 1,
    },
    exercisesList: {
      gap: 12,
    },
    emptyText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      marginTop: 8,
    },
  });

const tabletStyles = (colors: ReturnType<typeof useTheme>["colors"]) => {
  const mobile = mobileStyles(colors);
  return StyleSheet.create({
    ...mobile,
    scrollContent: {
      ...mobile.scrollContent,
      padding: 20,
      paddingTop: 20,
    },
    card: {
      ...mobile.card,
      padding: 20,
      marginBottom: 20,
    },
    cardSubtitle: {
      ...mobile.cardSubtitle,
      fontSize: 18,
    },
  });
};

export default WorkoutViewModal;