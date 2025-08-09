import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { useTheme } from "@/hooks/useTheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Clock from "@/components/Clock";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";

interface WorkoutViewModalProps {
  visible: boolean;
  workout: any | null;
  onClose: () => void;
  onWorkoutUpdate?: (updatedWorkout: any) => void;
}

const WorkoutViewModal: React.FC<WorkoutViewModalProps> = ({
  visible,
  workout,
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
  const [editingExerciseIndex, setEditingExerciseIndex] = useState<
    number | null
  >(null);
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
      workoutPlans[workoutIndex].exercises[editingExerciseIndex] =
        editingExercise;

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
  const warmupExercises =
    workout?.exercises?.filter((ex: any) => ex.warmup) || [];
  const cooldownExercises =
    workout?.exercises?.filter((ex: any) => ex.cooldown) || [];
  const mainExercises =
    workout?.exercises?.filter((ex: any) => !ex.warmup && !ex.cooldown) || [];

  const progress =
    workout && workout.exercises && workout.exercises.length > 0
      ? completed.length / workout.exercises.length
      : 0;

  // Helper function to render exercise items
  const renderExerciseItem = (ex: any, originalIndex: number) => (
    <TouchableOpacity
      key={originalIndex}
      style={[
        styles.exerciseItem,
        completed.includes(originalIndex) && styles.exerciseItemCompleted,
        activeExercise === originalIndex && styles.exerciseItemActive,
      ]}
      onPress={() => handleSetActive(originalIndex)}
      activeOpacity={0.7}
    >
      <View style={styles.exerciseHeader}>
        <ThemedText style={styles.exerciseName}>
          {ex.exercise || `Exercise ${originalIndex + 1}`}
        </ThemedText>
        <View style={styles.exerciseHeaderActions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={(e) => handleEditExercise(originalIndex, e)}
            activeOpacity={0.7}
          >
            <IconSymbol size={16} color={colors.primary} name="pencil" />
          </TouchableOpacity>
          {hasTimerData(ex) && (
            <TouchableOpacity
              style={styles.timerButton}
              onPress={(e) => {
                e.stopPropagation(); // Prevent completion toggle
                handleStartTimer(ex);
              }}
              activeOpacity={0.7}
            >
              <IconSymbol size={16} color="gold" name="clock.fill" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[
              styles.checkbox,
              completed.includes(originalIndex) && styles.checkboxCompleted,
            ]}
            onPress={(e) => handleComplete(originalIndex, e)}
            activeOpacity={0.7}
          >
            {completed.includes(originalIndex) && (
              <IconSymbol
                size={16}
                color={colors.textInverse}
                name="checkmark"
              />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.exerciseDetails}>
        {ex.sets && ex.sets.toString().trim() && (
          <View style={styles.detailItem}>
            <ThemedText style={styles.detailLabel}>Sets</ThemedText>
            <ThemedText style={styles.detailValue}>{ex.sets}</ThemedText>
          </View>
        )}
        {ex.reps && ex.reps.toString().trim() && (
          <View style={styles.detailItem}>
            <ThemedText style={styles.detailLabel}>Reps</ThemedText>
            <ThemedText style={styles.detailValue}>{ex.reps}</ThemedText>
          </View>
        )}
        {ex.weight && ex.weight.toString().trim() && (
          <View style={styles.detailItem}>
            <ThemedText style={styles.detailLabel}>Weight</ThemedText>
            <ThemedText style={styles.detailValue}>{ex.weight} lbs</ThemedText>
          </View>
        )}
        {ex.workTime && ex.workTime.toString().trim() && (
          <View style={styles.detailItem}>
            <ThemedText style={styles.detailLabel}>Work</ThemedText>
            <ThemedText style={styles.detailValue}>{ex.workTime}s</ThemedText>
          </View>
        )}
        {ex.restTime && ex.restTime.toString().trim() && (
          <View style={styles.detailItem}>
            <ThemedText style={styles.detailLabel}>Rest</ThemedText>
            <ThemedText style={styles.detailValue}>{ex.restTime}s</ThemedText>
          </View>
        )}
        {ex.setRest && ex.setRest.toString().trim() && (
          <View style={styles.detailItem}>
            <ThemedText style={styles.detailLabel}>Set Rest</ThemedText>
            <ThemedText style={styles.detailValue}>{ex.setRest}s</ThemedText>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header Card */}
          <View style={styles.headerCard}>
            <View style={styles.cardHeader}>
              <IconSymbol
                size={24}
                color="gold"
                name="figure.strengthtraining.traditional"
              />
              <ThemedText style={styles.cardTitle}>
                {workout?.name || "Workout"}
              </ThemedText>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <IconSymbol
                  size={20}
                  color={colors.textSecondary}
                  name="xmark"
                />
              </TouchableOpacity>
            </View>

            {workout && (
              <View style={styles.workoutSummary}>
                <ThemedText style={styles.exerciseCount}>
                  {workout.exercises.length} exercise
                  {workout.exercises.length !== 1 ? "s" : ""}
                </ThemedText>
                <ThemedText style={styles.savedDate}>
                  Saved: {new Date(workout.savedAt).toLocaleDateString()}
                </ThemedText>
              </View>
            )}

            {/* Progress Section */}
            {workout && workout.exercises && workout.exercises.length > 0 && (
              <View style={styles.progressSection}>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${progress * 100}%` },
                      ]}
                    />
                  </View>
                  <ThemedText style={styles.progressText}>
                    {Math.round(progress * 100)}% Complete ({completed.length}/
                    {workout?.exercises?.length || 0})
                  </ThemedText>
                </View>
              </View>
            )}
          </View>

          {workout && workout.exercises && workout.exercises.length > 0 && (
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Warmup Card */}
              {warmupExercises.length > 0 && (
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <IconSymbol size={20} color="orange" name="flame" />
                    <ThemedText style={styles.cardSubtitle}>Warmup</ThemedText>
                  </View>

                  {/* Column Headers for Warmup */}
                  <View style={styles.columnHeaders}>
                    <View style={styles.exerciseNameHeader}>
                      <ThemedText style={styles.activeColumnHeaderText}>
                        Tap to set as active
                      </ThemedText>
                    </View>
                    <View style={styles.columnActionsHeader}>
                      <ThemedText style={styles.columnHeaderText}>
                        Edit
                      </ThemedText>
                      {warmupExercises.some((ex: any) => hasTimerData(ex)) && (
                        <ThemedText style={styles.columnHeaderText}>
                          Start{"\n"}Timer
                        </ThemedText>
                      )}
                      <ThemedText style={styles.columnHeaderText}>
                        Mark{"\n"}Complete
                      </ThemedText>
                    </View>
                  </View>

                  <View style={styles.exercisesList}>
                    {warmupExercises.map((ex: any, i: number) => {
                      const originalIndex = workout.exercises.findIndex(
                        (originalEx: any) => originalEx === ex
                      );
                      return renderExerciseItem(ex, originalIndex);
                    })}
                  </View>
                </View>
              )}

              {/* Main Exercises Card */}
              {mainExercises.length > 0 && (
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <IconSymbol size={20} color="gold" name="list.bullet" />
                    <ThemedText style={styles.cardSubtitle}>
                      Exercises
                    </ThemedText>
                  </View>

                  {/* Column Headers for Main Exercises */}
                  <View style={styles.columnHeaders}>
                    <View style={styles.exerciseNameHeader}>
                      <ThemedText style={styles.activeColumnHeaderText}>
                        Tap to set as active
                      </ThemedText>
                    </View>
                    <View style={styles.columnActionsHeader}>
                      <ThemedText style={styles.columnHeaderText}>
                        Edit
                      </ThemedText>
                      {mainExercises.some((ex: any) => hasTimerData(ex)) && (
                        <ThemedText style={styles.columnHeaderText}>
                          Start{"\n"}Timer
                        </ThemedText>
                      )}
                      <ThemedText style={styles.columnHeaderText}>
                        Mark{"\n"}Complete
                      </ThemedText>
                    </View>
                  </View>

                  <View style={styles.exercisesList}>
                    {mainExercises.map((ex: any, i: number) => {
                      const originalIndex = workout.exercises.findIndex(
                        (originalEx: any) => originalEx === ex
                      );
                      return renderExerciseItem(ex, originalIndex);
                    })}
                  </View>
                </View>
              )}

              {/* Cooldown Card */}
              {cooldownExercises.length > 0 && (
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <IconSymbol size={20} color="cyan" name="snowflake" />
                    <ThemedText style={styles.cardSubtitle}>
                      Cooldown
                    </ThemedText>
                  </View>

                  {/* Column Headers for Cooldown */}
                  <View style={styles.columnHeaders}>
                    <View style={styles.exerciseNameHeader}>
                      <ThemedText style={styles.activeColumnHeaderText}>
                        Tap to set as active
                      </ThemedText>
                    </View>
                    <View style={styles.columnActionsHeader}>
                      <ThemedText style={styles.columnHeaderText}>
                        Edit
                      </ThemedText>
                      {cooldownExercises.some((ex: any) =>
                        hasTimerData(ex)
                      ) && (
                        <ThemedText style={styles.columnHeaderText}>
                          Start{"\n"}Timer
                        </ThemedText>
                      )}
                      <ThemedText style={styles.columnHeaderText}>
                        Mark{"\n"}Complete
                      </ThemedText>
                    </View>
                  </View>

                  <View style={styles.exercisesList}>
                    {cooldownExercises.map((ex: any, i: number) => {
                      const originalIndex = workout.exercises.findIndex(
                        (originalEx: any) => originalEx === ex
                      );
                      return renderExerciseItem(ex, originalIndex);
                    })}
                  </View>
                </View>
              )}

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
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancelEdit}
      >
        <View style={styles.editModalOverlay}>
          <View style={styles.editModalContent}>
            <View style={styles.editModalHeader}>
              <ThemedText style={styles.editModalTitle}>
                Edit Exercise
              </ThemedText>
              <TouchableOpacity
                onPress={handleCancelEdit}
                style={styles.editModalClose}
              >
                <IconSymbol
                  size={20}
                  color={colors.textSecondary}
                  name="xmark"
                />
              </TouchableOpacity>
            </View>

            {editingExercise && (
              <ScrollView
                style={styles.editModalForm}
                showsVerticalScrollIndicator={false}
              >
                <View style={[styles.editInputGroup, { marginBottom: 20 }]}>
                  <ThemedText style={styles.editInputLabel}>
                    Exercise Name
                  </ThemedText>
                  <TextInput
                    style={[
                      styles.editInput,
                      { fontSize: 16, paddingVertical: 12 },
                    ]}
                    value={editingExercise.exercise || ""}
                    onChangeText={(text) =>
                      setEditingExercise({ ...editingExercise, exercise: text })
                    }
                    placeholder="Enter exercise name"
                    placeholderTextColor={colors.placeholder}
                  />
                </View>

                <View style={styles.editInputRow}>
                  <View
                    style={[styles.editInputGroup, styles.editInputGroupThird]}
                  >
                    <ThemedText style={styles.editInputLabel}>Sets</ThemedText>
                    <TextInput
                      style={styles.editInput}
                      value={editingExercise.sets?.toString() || ""}
                      onChangeText={(text) =>
                        setEditingExercise({ ...editingExercise, sets: text })
                      }
                      placeholder="0"
                      keyboardType="numeric"
                      placeholderTextColor={colors.placeholder}
                    />
                  </View>
                  <View
                    style={[styles.editInputGroup, styles.editInputGroupThird]}
                  >
                    <ThemedText style={styles.editInputLabel}>Reps</ThemedText>
                    <TextInput
                      style={styles.editInput}
                      value={editingExercise.reps?.toString() || ""}
                      onChangeText={(text) =>
                        setEditingExercise({ ...editingExercise, reps: text })
                      }
                      placeholder="0"
                      keyboardType="numeric"
                      placeholderTextColor={colors.placeholder}
                    />
                  </View>
                  <View
                    style={[styles.editInputGroup, styles.editInputGroupThird]}
                  >
                    <ThemedText style={styles.editInputLabel}>
                      Weight (lbs)
                    </ThemedText>
                    <TextInput
                      style={styles.editInput}
                      value={editingExercise.weight?.toString() || ""}
                      onChangeText={(text) =>
                        setEditingExercise({ ...editingExercise, weight: text })
                      }
                      placeholder="0"
                      keyboardType="numeric"
                      placeholderTextColor={colors.placeholder}
                    />
                  </View>
                </View>

                <View style={styles.editInputRow}>
                  <View
                    style={[styles.editInputGroup, styles.editInputGroupThird]}
                  >
                    <ThemedText style={styles.editInputLabel}>
                      Work (s)
                    </ThemedText>
                    <TextInput
                      style={styles.editInput}
                      value={editingExercise.workTime?.toString() || ""}
                      onChangeText={(text) =>
                        setEditingExercise({
                          ...editingExercise,
                          workTime: text,
                        })
                      }
                      placeholder="0"
                      keyboardType="numeric"
                      placeholderTextColor={colors.placeholder}
                    />
                  </View>
                  <View
                    style={[styles.editInputGroup, styles.editInputGroupThird]}
                  >
                    <ThemedText style={styles.editInputLabel}>
                      Rest (s)
                    </ThemedText>
                    <TextInput
                      style={styles.editInput}
                      value={editingExercise.restTime?.toString() || ""}
                      onChangeText={(text) =>
                        setEditingExercise({
                          ...editingExercise,
                          restTime: text,
                        })
                      }
                      placeholder="0"
                      keyboardType="numeric"
                      placeholderTextColor={colors.placeholder}
                    />
                  </View>
                  <View
                    style={[styles.editInputGroup, styles.editInputGroupThird]}
                  >
                    <ThemedText style={styles.editInputLabel}>
                      Set Rest (s)
                    </ThemedText>
                    <TextInput
                      style={styles.editInput}
                      value={editingExercise.setRest?.toString() || ""}
                      onChangeText={(text) =>
                        setEditingExercise({
                          ...editingExercise,
                          setRest: text,
                        })
                      }
                      placeholder="0"
                      keyboardType="numeric"
                      placeholderTextColor={colors.placeholder}
                    />
                  </View>
                </View>

                <View style={styles.editCheckboxRow}>
                  <TouchableOpacity
                    style={styles.editCheckboxContainer}
                    onPress={() =>
                      setEditingExercise({
                        ...editingExercise,
                        warmup: !editingExercise.warmup,
                        cooldown: editingExercise.warmup
                          ? editingExercise.cooldown
                          : false,
                      })
                    }
                  >
                    <View
                      style={[
                        styles.editCheckbox,
                        editingExercise.warmup && styles.editCheckboxChecked,
                      ]}
                    >
                      {editingExercise.warmup && (
                        <IconSymbol
                          size={12}
                          color={colors.textInverse}
                          name="checkmark"
                        />
                      )}
                    </View>
                    <ThemedText style={styles.editCheckboxLabel}>
                      Warmup
                    </ThemedText>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.editCheckboxContainer}
                    onPress={() =>
                      setEditingExercise({
                        ...editingExercise,
                        cooldown: !editingExercise.cooldown,
                        warmup: editingExercise.cooldown
                          ? editingExercise.warmup
                          : false,
                      })
                    }
                  >
                    <View
                      style={[
                        styles.editCheckbox,
                        editingExercise.cooldown && styles.editCheckboxChecked,
                      ]}
                    >
                      {editingExercise.cooldown && (
                        <IconSymbol
                          size={12}
                          color={colors.textInverse}
                          name="checkmark"
                        />
                      )}
                    </View>
                    <ThemedText style={styles.editCheckboxLabel}>
                      Cooldown
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}

            <View style={styles.editModalButtons}>
              <TouchableOpacity
                style={styles.editModalCancelButton}
                onPress={handleCancelEdit}
                activeOpacity={0.7}
              >
                <ThemedText style={styles.editModalCancelText}>
                  Cancel
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.editModalSaveButton}
                onPress={handleSaveExercise}
                activeOpacity={0.7}
              >
                <ThemedText style={styles.editModalSaveText}>Save</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    headerCard: {
      backgroundColor: colors.card,
      padding: 16,
      paddingTop: 60, // Add extra padding for status bar
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 12,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: "600",
      flex: 1,
    },
    cardSubtitle: {
      fontSize: 16,
      fontWeight: "600",
      flex: 1,
    },
    closeButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: colors.inputBackground,
    },
    workoutSummary: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    exerciseCount: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.primary,
    },
    savedDate: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    progressSection: {
      paddingTop: 16,
      marginTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
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
    progressContainer: {
      gap: 8,
    },
    progressBar: {
      height: 8,
      backgroundColor: colors.inputBackground,
      borderRadius: 4,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: "gold",
      borderRadius: 4,
    },
    progressText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
      textAlign: "center",
    },
    columnHeaders: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 8,
      marginBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    exerciseNameHeader: {
      flex: 1,
      minWidth: 100, // Ensure enough space for "Tap to set as active" text
    },
    columnActionsHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 24, // Same gap as exerciseHeaderActions
    },
    columnHeaderText: {
      fontSize: 11,
      fontWeight: "600",
      color: colors.textSecondary,
      textAlign: "center",
      width: 54, // Narrow width to force line breaks
      lineHeight: 14,
    },
    activeColumnHeaderText: {
      fontSize: 10,
      fontWeight: "600",
      color: colors.textSecondary,
      textAlign: "left",
      lineHeight: 13,
      paddingRight: 8,
    },
    exercisesList: {
      gap: 12,
    },
    exerciseItem: {
      backgroundColor: colors.inputBackground,
      borderRadius: 8,
      padding: 12,
      borderWidth: 1,
      borderColor: "transparent", // Transparent border to maintain consistent sizing
    },
    exerciseItemCompleted: {
      backgroundColor: colors.primary + "20",
      borderWidth: 1,
      borderColor: colors.gold,
    },
    exerciseItemActive: {
      borderWidth: 1,
      borderColor: colors.primary,
    },
    exerciseHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    exerciseHeaderActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 24, // Adjusted spacing to accommodate edit button
    },
    editButton: {
      width: 32,
      height: 32,
      borderRadius: 6,
      backgroundColor: colors.inputBackground,
      borderWidth: 1,
      borderColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    timerButton: {
      width: 32,
      height: 32,
      borderRadius: 6,
      backgroundColor: colors.inputBackground,
      borderWidth: 1,
      borderColor: "gold",
      justifyContent: "center",
      alignItems: "center",
    },
    exerciseName: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      flex: 1,
    },
    checkbox: {
      width: 32,
      height: 32,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: colors.textSecondary,
      backgroundColor: colors.inputBackground,
      justifyContent: "center",
      alignItems: "center",
    },
    checkboxCompleted: {
      backgroundColor: "gold",
      borderColor: "gold",
    },
    exerciseDetails: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    detailItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.background,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      gap: 4,
    },
    detailLabel: {
      fontSize: 11,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    detailValue: {
      fontSize: 12,
      color: colors.text,
      fontWeight: "600",
    },
    emptyText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      marginTop: 8,
    },
    // Edit Modal Styles
    editModalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    editModalContent: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 0,
      width: "100%",
      maxWidth: 420,
      maxHeight: "85%",
      overflow: "hidden",
    },
    editModalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    editModalTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    editModalClose: {
      padding: 4,
      borderRadius: 8,
      backgroundColor: colors.inputBackground,
    },
    editModalForm: {
      paddingHorizontal: 20,
      paddingVertical: 20,
    },
    editInputGroup: {
      marginBottom: 0,
      flex: 1,
    },
    editInputGroupThird: {
      flex: 1,
    },
    editInputLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.textSecondary,
      marginBottom: 4,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    editInput: {
      backgroundColor: colors.inputBackground,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 8,
      fontSize: 14,
      color: colors.inputText,
    },
    editInputRow: {
      flexDirection: "row",
      gap: 10,
      marginBottom: 20,
    },
    editCheckboxRow: {
      flexDirection: "row",
      gap: 24,
      marginTop: 4,
      justifyContent: "center",
      paddingVertical: 16,
      backgroundColor: colors.inputBackground,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.inputBorder,
    },
    editCheckboxContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    editCheckbox: {
      width: 20,
      height: 20,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: colors.inputBorder,
      backgroundColor: colors.inputBackground,
      justifyContent: "center",
      alignItems: "center",
    },
    editCheckboxChecked: {
      borderColor: "gold",
      backgroundColor: "gold",
    },
    editCheckboxLabel: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.text,
    },
    editModalButtons: {
      flexDirection: "row",
      gap: 10,
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.card,
    },
    editModalCancelButton: {
      flex: 1,
      backgroundColor: colors.inputBackground,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      paddingVertical: 14,
      alignItems: "center",
    },
    editModalCancelText: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    editModalSaveButton: {
      flex: 1,
      backgroundColor: "gold",
      borderRadius: 10,
      paddingVertical: 14,
      alignItems: "center",
      shadowColor: "gold",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    editModalSaveText: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.textInverse,
    },
  });

const tabletStyles = (colors: ReturnType<typeof useTheme>["colors"]) => {
  const mobile = mobileStyles(colors);
  return StyleSheet.create({
    ...mobile,
    modalOverlay: {
      ...mobile.modalOverlay,
    },
    modalContent: {
      ...mobile.modalContent,
    },
    headerCard: {
      ...mobile.headerCard,
      padding: 20,
    },
    cardTitle: {
      ...mobile.cardTitle,
      fontSize: 20,
    },
    cardSubtitle: {
      ...mobile.cardSubtitle,
      fontSize: 18,
    },
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
    progressText: {
      ...mobile.progressText,
      fontSize: 16,
    },
    exerciseItem: {
      ...mobile.exerciseItem,
      padding: 16,
    },
    exerciseItemActive: {
      ...mobile.exerciseItemActive,
    },
    exerciseHeaderActions: {
      ...mobile.exerciseHeaderActions,
      gap: 32, // Smaller gap to fit edit button
    },
    editButton: {
      ...mobile.editButton,
      width: 36,
      height: 36,
    },
    columnHeaders: {
      ...mobile.columnHeaders,
      paddingVertical: 10,
    },
    exerciseNameHeader: {
      ...mobile.exerciseNameHeader,
      minWidth: 120, // Slightly more space for tablet
    },
    columnActionsHeader: {
      ...mobile.columnActionsHeader,
      gap: 32, // Match the exerciseHeaderActions gap
    },
    columnHeaderText: {
      ...mobile.columnHeaderText,
      fontSize: 12,
      width: 60, // Slightly wider for tablet but still narrow
      lineHeight: 16,
    },
    activeColumnHeaderText: {
      ...mobile.activeColumnHeaderText,
      fontSize: 12,
      lineHeight: 15,
    },
    timerButton: {
      ...mobile.timerButton,
      width: 36,
      height: 36,
    },
    exerciseName: {
      ...mobile.exerciseName,
      fontSize: 18,
    },
    checkbox: {
      ...mobile.checkbox,
      width: 36,
      height: 36,
    },
    detailItem: {
      ...mobile.detailItem,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    detailLabel: {
      ...mobile.detailLabel,
      fontSize: 12,
    },
    detailValue: {
      ...mobile.detailValue,
      fontSize: 14,
    },
  });
};

export default WorkoutViewModal;
