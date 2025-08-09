import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState, useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { useTheme } from "@/hooks/useTheme";

export default function WorkoutsScreen() {
  const { getStyles, isTablet } = useResponsiveStyles();
  const { colors } = useTheme();
  
  const styles = useMemo(() => {
    return getStyles(mobileStyles(colors), tabletStyles(colors));
  }, [getStyles, colors]);
  const params = useLocalSearchParams();
  const router = useRouter();

  const [workoutName, setWorkoutName] = useState("");
  const [workouts, setWorkouts] = useState([
    {
      exercise: "",
      sets: "",
      reps: "1", // Default reps to 1
      weight: "",
      workTime: "",
      restTime: "",
      setRest: "", // Add setRest field
      warmup: false,
      cooldown: false,
    },
  ]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    if (params.workout && typeof params.editIndex === "string") {
      const workoutToEdit = JSON.parse(params.workout as string);
      const index = parseInt(params.editIndex, 10);
      setWorkoutName(workoutToEdit.name);
      
      // Ensure all exercises have the required fields with defaults
      const exercisesWithDefaults = workoutToEdit.exercises.map((ex: any) => ({
        exercise: ex.exercise || "",
        sets: ex.sets || "",
        reps: ex.reps || "1", // Default reps to 1 for existing workouts
        weight: ex.weight || "",
        workTime: ex.workTime || "",
        restTime: ex.restTime || "",
        setRest: ex.setRest || "", // Add setRest field for existing workouts
        warmup: ex.warmup || false,
        cooldown: ex.cooldown || false,
      }));
      
      setWorkouts(exercisesWithDefaults);
      setEditIndex(index);
    }
  }, [params.workout, params.editIndex]);

  const handleChange = (index: number, field: string, value: string) => {
    setWorkouts((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleWarmupCooldownChange = (index: number, field: 'warmup' | 'cooldown') => {
    setWorkouts((prev) => {
      const updated = [...prev];
      const currentValue = updated[index][field];
      
      // Toggle the selected field and ensure the other is false
      if (field === 'warmup') {
        updated[index] = { 
          ...updated[index], 
          warmup: !currentValue,
          cooldown: !currentValue ? false : updated[index].cooldown // If setting warmup to true, set cooldown to false
        };
      } else {
        updated[index] = { 
          ...updated[index], 
          cooldown: !currentValue,
          warmup: !currentValue ? false : updated[index].warmup // If setting cooldown to true, set warmup to false
        };
      }
      
      return updated;
    });
  };

  const addRow = () => {
    setWorkouts((prev) => [
      ...prev,
      {
        exercise: "",
        sets: "",
        reps: "1", // Default reps to 1
        weight: "",
        workTime: "",
        restTime: "",
        setRest: "", // Add setRest field
        warmup: false,
        cooldown: false,
      },
    ]);
  };

  const removeRow = (index: number) => {
    if (workouts.length === 1) return;
    setWorkouts((prev) => prev.filter((_, i) => i !== index));
  };

  const savePlan = async () => {
    if (!workoutName.trim()) {
      alert("Please enter a workout name.");
      return;
    }
    // Require at least one exercise with a non-empty 'exercise' field
    const hasAtLeastOneExercise = workouts.some(
      (w) => w.exercise.trim() !== ""
    );
    if (!hasAtLeastOneExercise) {
      alert("Please add at least one exercise to your plan.");
      return;
    }
    const plan = {
      name: workoutName,
      exercises: workouts,
      savedAt: new Date().toISOString(),
    };
    try {
      const existingPlans = await AsyncStorage.getItem("workoutPlans");
      let plans = existingPlans ? JSON.parse(existingPlans) : [];
      if (editIndex !== null) {
        plans[editIndex] = plan;
      } else {
        plans.push(plan);
      }
      await AsyncStorage.setItem("workoutPlans", JSON.stringify(plans));
      alert("Workout plan saved!");
      resetForm();
      router.push("/workouts/savedWorkouts");
    } catch {
      alert("Failed to save workout plan.");
    }
  };

  const cancelEdit = () => {
    resetForm();
    router.back();
  };

  const resetForm = () => {
    setWorkoutName("");
    setWorkouts([
      {
        exercise: "",
        sets: "",
        reps: "1", // Default reps to 1
        weight: "",
        workTime: "",
        restTime: "",
        setRest: "", // Add setRest field
        warmup: false,
        cooldown: false,
      },
    ]);
    setEditIndex(null);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >

        {/* Workout Name Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <IconSymbol size={24} color="gold" name="textformat" />
            <ThemedText style={styles.cardTitle}>Workout Name</ThemedText>
          </View>
          <TextInput
            style={styles.input}
            placeholder="e.g., Morning Power Hour"
            placeholderTextColor={colors.placeholder}
            value={workoutName}
            onChangeText={setWorkoutName}
          />
        </View>

        {/* Exercises */}
        {workouts.map((row, idx) => (
          <View key={idx} style={styles.card}>
            <View style={styles.cardHeader}>
              <IconSymbol size={24} color="gold" name="figure.strengthtraining.traditional" />
              <ThemedText style={styles.cardTitle}>Exercise #{idx + 1}</ThemedText>
              {workouts.length > 1 && (
                <TouchableOpacity
                  onPress={() => removeRow(idx)}
                  style={styles.removeButton}
                >
                  <IconSymbol size={20} color={colors.error} name="trash" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.exerciseForm}>
              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Exercise Name</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Bench Press"
                  placeholderTextColor={colors.placeholder}
                  value={row.exercise}
                  onChangeText={(v) => handleChange(idx, "exercise", v)}
                />
              </View>

              {isTablet ? (
                // Tablet layout: 5 columns in one row with adjusted widths
                <View style={styles.inputRow}>
                  <View style={[styles.inputGroup, styles.setsGroup]}>
                    <ThemedText style={styles.inputLabel}>Sets</ThemedText>
                    <TextInput
                      style={styles.input}
                      placeholder="0"
                      placeholderTextColor={colors.placeholder}
                      keyboardType="numeric"
                      value={row.sets}
                      onChangeText={(v) => handleChange(idx, "sets", v)}
                    />
                  </View>
                  <View style={[styles.inputGroup, styles.repsGroup]}>
                    <ThemedText style={styles.inputLabel}>Reps</ThemedText>
                    <TextInput
                      style={styles.input}
                      placeholder="0"
                      placeholderTextColor={colors.placeholder}
                      keyboardType="numeric"
                      value={row.reps}
                      onChangeText={(v) => handleChange(idx, "reps", v)}
                    />
                  </View>
                  <View style={[styles.inputGroup, styles.weightGroup]}>
                    <ThemedText style={styles.inputLabel}>Weight (lbs)</ThemedText>
                    <TextInput
                      style={styles.input}
                      placeholder="0"
                      placeholderTextColor={colors.placeholder}
                      keyboardType="numeric"
                      value={row.weight}
                      onChangeText={(v) => handleChange(idx, "weight", v)}
                    />
                  </View>
                  <View style={[styles.inputGroup, styles.workTimeGroup]}>
                    <ThemedText style={styles.inputLabel}>Work Time (s)</ThemedText>
                    <TextInput
                      style={styles.input}
                      placeholder="0"
                      placeholderTextColor={colors.placeholder}
                      keyboardType="numeric"
                      value={row.workTime}
                      onChangeText={(v) => handleChange(idx, "workTime", v)}
                    />
                  </View>
                  <View style={[styles.inputGroup, styles.restTimeGroup]}>
                    <ThemedText style={styles.inputLabel}>Rest Time (s)</ThemedText>
                    <TextInput
                      style={styles.input}
                      placeholder="0"
                      placeholderTextColor={colors.placeholder}
                      keyboardType="numeric"
                      value={row.restTime}
                      onChangeText={(v) => handleChange(idx, "restTime", v)}
                    />
                  </View>
                  <View style={[styles.inputGroup, styles.setRestGroup]}>
                    <ThemedText style={styles.inputLabel}>Set Rest (s)</ThemedText>
                    <TextInput
                      style={styles.input}
                      placeholder="0"
                      placeholderTextColor={colors.placeholder}
                      keyboardType="numeric"
                      value={row.setRest}
                      onChangeText={(v) => handleChange(idx, "setRest", v)}
                    />
                  </View>
                  <View style={[styles.inputGroup, styles.checkboxGroup]}>
                    <TouchableOpacity
                      style={styles.checkboxContainer}
                      onPress={() => handleWarmupCooldownChange(idx, 'warmup')}
                      activeOpacity={0.7}
                    >
                      <View style={[
                        styles.checkboxStyle,
                        row.warmup && styles.checkboxChecked
                      ]}>
                        {row.warmup && (
                          <ThemedText style={styles.checkmark}>✓</ThemedText>
                        )}
                      </View>
                      <ThemedText style={styles.checkboxLabel}>Warmup</ThemedText>
                    </TouchableOpacity>
                  </View>
                  <View style={[styles.inputGroup, styles.checkboxGroup]}>
                    <TouchableOpacity
                      style={styles.checkboxContainer}
                      onPress={() => handleWarmupCooldownChange(idx, 'cooldown')}
                      activeOpacity={0.7}
                    >
                      <View style={[
                        styles.checkboxStyle,
                        row.cooldown && styles.checkboxChecked
                      ]}>
                        {row.cooldown && (
                          <ThemedText style={styles.checkmark}>✓</ThemedText>
                        )}
                      </View>
                      <ThemedText style={styles.checkboxLabel}>Cooldown</ThemedText>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                // Mobile layout: 3 columns, then 2 columns
                <>
                  <View style={styles.inputRow}>
                    <View style={styles.inputGroup}>
                      <ThemedText style={styles.inputLabel}>Sets</ThemedText>
                      <TextInput
                        style={styles.input}
                        placeholder="0"
                        placeholderTextColor={colors.placeholder}
                        keyboardType="numeric"
                        value={row.sets}
                        onChangeText={(v) => handleChange(idx, "sets", v)}
                      />
                    </View>
                    <View style={styles.inputGroup}>
                      <ThemedText style={styles.inputLabel}>Reps</ThemedText>
                      <TextInput
                        style={styles.input}
                        placeholder="0"
                        placeholderTextColor={colors.placeholder}
                        keyboardType="numeric"
                        value={row.reps}
                        onChangeText={(v) => handleChange(idx, "reps", v)}
                      />
                    </View>
                    <View style={styles.inputGroup}>
                      <ThemedText style={styles.inputLabel}>Weight (lbs)</ThemedText>
                      <TextInput
                        style={styles.input}
                        placeholder="0"
                        placeholderTextColor={colors.placeholder}
                        keyboardType="numeric"
                        value={row.weight}
                        onChangeText={(v) => handleChange(idx, "weight", v)}
                      />
                    </View>
                  </View>

                  <View style={styles.inputRow}>
                    <View style={styles.inputGroup}>
                      <ThemedText style={styles.inputLabel}>Work Time (s)</ThemedText>
                      <TextInput
                        style={styles.input}
                        placeholder="0"
                        placeholderTextColor={colors.placeholder}
                        keyboardType="numeric"
                        value={row.workTime}
                        onChangeText={(v) => handleChange(idx, "workTime", v)}
                      />
                    </View>
                    <View style={styles.inputGroup}>
                      <ThemedText style={styles.inputLabel}>Rest Time (s)</ThemedText>
                      <TextInput
                        style={styles.input}
                        placeholder="0"
                        placeholderTextColor={colors.placeholder}
                        keyboardType="numeric"
                        value={row.restTime}
                        onChangeText={(v) => handleChange(idx, "restTime", v)}
                      />
                    </View>
                  </View>

                  <View style={styles.inputRow}>
                    <View style={styles.inputGroup}>
                      <ThemedText style={styles.inputLabel}>Set Rest (s)</ThemedText>
                      <TextInput
                        style={styles.input}
                        placeholder="0"
                        placeholderTextColor={colors.placeholder}
                        keyboardType="numeric"
                        value={row.setRest}
                        onChangeText={(v) => handleChange(idx, "setRest", v)}
                      />
                    </View>
                  </View>

                  <View style={styles.inputRow}>
                    <View style={styles.checkboxGroup}>
                      <TouchableOpacity
                        style={styles.checkboxContainer}
                        onPress={() => handleWarmupCooldownChange(idx, 'warmup')}
                        activeOpacity={0.7}
                      >
                        <View style={[
                          styles.checkboxStyle,
                          row.warmup && styles.checkboxChecked
                        ]}>
                          {row.warmup && (
                            <ThemedText style={styles.checkmark}>✓</ThemedText>
                          )}
                        </View>
                        <ThemedText style={styles.checkboxLabel}>Warmup</ThemedText>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.checkboxGroup}>
                      <TouchableOpacity
                        style={styles.checkboxContainer}
                        onPress={() => handleWarmupCooldownChange(idx, 'cooldown')}
                        activeOpacity={0.7}
                      >
                        <View style={[
                          styles.checkboxStyle,
                          row.cooldown && styles.checkboxChecked
                        ]}>
                          {row.cooldown && (
                            <ThemedText style={styles.checkmark}>✓</ThemedText>
                          )}
                        </View>
                        <ThemedText style={styles.checkboxLabel}>Cooldown</ThemedText>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>
        ))}

        {/* Action Buttons Card */}
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={addRow}
            activeOpacity={0.85}
          >
            <IconSymbol size={20} color={colors.textInverse} name="plus" />
            <Text style={styles.addButtonText}>Add Exercise</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={savePlan}
            activeOpacity={0.85}
          >
            <IconSymbol size={20} color={colors.primary} name="square.and.arrow.down" />
            <Text style={styles.saveButtonText}>
              {editIndex !== null ? "Update Workout" : "Save Workout"}
            </Text>
          </TouchableOpacity>

          {editIndex !== null && (
            <TouchableOpacity
              onPress={cancelEdit}
              style={styles.cancelButton}
              activeOpacity={0.85}
            >
              <IconSymbol 
                size={20} 
                color={colors.textSecondary} 
                name="xmark" 
              />
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const tabletStyles = (colors: ReturnType<typeof useTheme>["colors"]) => StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
  },
  removeButton: {
    padding: 4,
  },
  input: {
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.inputText,
  },
  exerciseForm: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  // Tablet-specific flex values for balanced input widths
  setsGroup: {
    flex: 1, // Small: Sets (single digit)
  },
  repsGroup: {
    flex: 1, // Small: Reps (single/double digit)
  },
  weightGroup: {
    flex: 1.5, // Medium: Weight (can be 3+ digits)
  },
  workTimeGroup: {
    flex: 1.5, // Medium: Work Time (seconds can be 2-3 digits)
  },
  restTimeGroup: {
    flex: 1.5, // Medium: Rest Time (seconds can be 2-3 digits)
  },
  setRestGroup: {
    flex: 1.5, // Medium: Set Rest Time (seconds can be 2-3 digits)
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  inputRow: {
    flexDirection: "row",
    gap: 16,
  },
  addButton: {
    backgroundColor: "gold",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 12,
  },
  addButtonText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  saveButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 12,
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: "600",
  },
  checkboxGroup: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 12, // Match input padding for alignment
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkboxStyle: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.inputBorder,
    backgroundColor: colors.inputBackground,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    borderColor: "gold",
    backgroundColor: "gold",
  },
  checkmark: {
    color: colors.textInverse,
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 12,
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
  },
});

const mobileStyles = (colors: ReturnType<typeof useTheme>["colors"]) => {
  const tablet = tabletStyles(colors);
  return StyleSheet.create({
    ...tablet,
    scrollView: {
      ...tablet.scrollView,
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    card: {
      ...tablet.card,
      padding: 16,
      marginBottom: 12,
    },
    cardTitle: {
      ...tablet.cardTitle,
      fontSize: 16,
    },
    input: {
      ...tablet.input,
      paddingVertical: 12,
      fontSize: 14,
    },
    inputRow: {
      ...tablet.inputRow,
      gap: 12,
    },
    inputGroup: {
      ...tablet.inputGroup,
      flex: 1,
    },
    // Reset tablet-specific flex values on mobile
    setsGroup: {
      flex: 1,
    },
    repsGroup: {
      flex: 1,
    },
    weightGroup: {
      flex: 1,
    },
    workTimeGroup: {
      flex: 1,
    },
    restTimeGroup: {
      flex: 1,
    },
    setRestGroup: {
      flex: 1,
    },
    checkboxGroup: {
      ...tablet.checkboxGroup,
    },
    checkboxContainer: {
      ...tablet.checkboxContainer,
      gap: 6,
    },
    checkboxStyle: {
      ...tablet.checkboxStyle,
      width: 18,
      height: 18,
    },
    checkboxLabel: {
      ...tablet.checkboxLabel,
      fontSize: 13,
    },
    inputLabel: {
      ...tablet.inputLabel,
      fontSize: 13,
    },
    addButton: {
      ...tablet.addButton,
      paddingVertical: 14,
    },
    saveButton: {
      ...tablet.saveButton,
      paddingVertical: 14,
    },
    cancelButton: {
      ...tablet.cancelButton,
      paddingVertical: 14,
    },
    cancelButtonText: {
      ...tablet.cancelButtonText,
      fontSize: 14,
    },
  });
};
