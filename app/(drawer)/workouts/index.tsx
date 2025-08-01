import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";

export default function WorkoutsScreen() {
  const { getStyles, isMobile } = useResponsiveStyles();
  const styles = getStyles(mobileStyles, tabletStyles);
  const params = useLocalSearchParams();
  const router = useRouter();

  const [workoutName, setWorkoutName] = useState("");
  const [workouts, setWorkouts] = useState([
    {
      exercise: "",
      sets: "",
      reps: "",
      weight: "",
      workTime: "",
      restTime: "",
    },
  ]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    if (params.workout && typeof params.editIndex === "string") {
      const workoutToEdit = JSON.parse(params.workout as string);
      const index = parseInt(params.editIndex, 10);
      setWorkoutName(workoutToEdit.name);
      setWorkouts(workoutToEdit.exercises);
      setEditIndex(index);
    }
  }, [params]);

  const handleChange = (index: number, field: string, value: string) => {
    setWorkouts((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addRow = () => {
    setWorkouts((prev) => [
      ...prev,
      {
        exercise: "",
        sets: "",
        reps: "",
        weight: "",
        workTime: "",
        restTime: "",
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
      setWorkoutName("");
      setWorkouts([
        {
          exercise: "",
          sets: "",
          reps: "",
          weight: "",
          workTime: "",
          restTime: "",
        },
      ]);
      setEditIndex(null);
      router.push("/workouts/savedWorkouts");
    } catch {
      alert("Failed to save workout plan.");
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={isMobile ? 180 : 310}
          color="gold"
          name="figure.strengthtraining.traditional"
          style={styles.headerImage}
        />
      }
    >
      <View style={styles.centeredContainer}>
        <View style={styles.workoutNameContainer}>
          <ThemedText style={[styles.inputLabel]}>Workout Name</ThemedText>
          <TextInput
            style={styles.workoutNameInput}
            placeholder="e.g., Morning Power Hour"
            placeholderTextColor="#999"
            value={workoutName}
            onChangeText={setWorkoutName}
          />
        </View>
        <ScrollView
          style={styles.formScroll}
          contentContainerStyle={{ alignItems: "center" }}
        >
          {isMobile ? (
            <View style={styles.mobileFormContainer}>
              {workouts.map((row, idx) => (
                <View key={idx} style={styles.mobileWorkoutCard}>
                  <View style={styles.cardHeader}>
                    <ThemedText style={styles.cardTitle}>
                      Exercise #{idx + 1}
                    </ThemedText>
                    {workouts.length > 1 && (
                      <TouchableOpacity
                        onPress={() => removeRow(idx)}
                        style={styles.removeButton}
                      >
                        <Feather name="trash-2" size={24} color="#d9534f" />
                      </TouchableOpacity>
                    )}
                  </View>

                  <View style={styles.inputGroup}>
                    <ThemedText style={styles.inputLabel}>
                      Exercise Name
                    </ThemedText>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., Bench Press"
                      placeholderTextColor="#999"
                      value={row.exercise}
                      onChangeText={(v) => handleChange(idx, "exercise", v)}
                    />
                  </View>

                  <View style={styles.row}>
                    <View style={styles.inputGroup}>
                      <ThemedText style={styles.inputLabel}>Sets</ThemedText>
                      <TextInput
                        style={styles.input}
                        placeholder="0"
                        placeholderTextColor="#999"
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
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                        value={row.reps}
                        onChangeText={(v) => handleChange(idx, "reps", v)}
                      />
                    </View>
                    <View style={styles.inputGroup}>
                      <ThemedText style={styles.inputLabel}>Weight</ThemedText>
                      <TextInput
                        style={styles.input}
                        placeholder="0"
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                        value={row.weight}
                        onChangeText={(v) => handleChange(idx, "weight", v)}
                      />
                    </View>
                  </View>

                  <View style={styles.row}>
                    <View style={styles.inputGroup}>
                      <ThemedText style={styles.inputLabel}>
                        Work (s)
                      </ThemedText>
                      <TextInput
                        style={styles.input}
                        placeholder="0"
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                        value={row.workTime}
                        onChangeText={(v) => handleChange(idx, "workTime", v)}
                      />
                    </View>
                    <View style={styles.inputGroup}>
                      <ThemedText style={styles.inputLabel}>
                        Rest (s)
                      </ThemedText>
                      <TextInput
                        style={styles.input}
                        placeholder="0"
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                        value={row.restTime}
                        onChangeText={(v) => handleChange(idx, "restTime", v)}
                      />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.tabletFormContainer}>
              {workouts.map((row, idx) => (
                <View key={idx} style={styles.tabletWorkoutCard}>
                  <View style={styles.cardHeader}>
                    <ThemedText style={styles.cardTitle}>
                      Exercise #{idx + 1}
                    </ThemedText>
                    {workouts.length > 1 && (
                      <TouchableOpacity
                        onPress={() => removeRow(idx)}
                        style={styles.removeButton}
                      >
                        <Feather name="trash-2" size={32} color="#d9534f" />
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* All inputs in a single row for tablet */}
                  <View style={styles.row}>
                    <View style={[styles.inputGroup, { flex: 3 }]}>
                      <ThemedText style={styles.inputLabel}>
                        Exercise Name
                      </ThemedText>
                      <TextInput
                        style={styles.input}
                        placeholder="e.g., Bench Press"
                        placeholderTextColor="#999"
                        value={row.exercise}
                        onChangeText={(v) => handleChange(idx, "exercise", v)}
                      />
                    </View>
                    <View style={styles.inputGroup}>
                      <ThemedText style={styles.inputLabel}>Sets</ThemedText>
                      <TextInput
                        style={styles.input}
                        placeholder="0"
                        placeholderTextColor="#999"
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
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                        value={row.reps}
                        onChangeText={(v) => handleChange(idx, "reps", v)}
                      />
                    </View>
                    <View style={styles.inputGroup}>
                      <ThemedText style={styles.inputLabel}>Weight</ThemedText>
                      <TextInput
                        style={styles.input}
                        placeholder="0"
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                        value={row.weight}
                        onChangeText={(v) => handleChange(idx, "weight", v)}
                      />
                    </View>
                    <View style={styles.inputGroup}>
                      <ThemedText style={styles.inputLabel}>
                        Work (s)
                      </ThemedText>
                      <TextInput
                        style={styles.input}
                        placeholder="0"
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                        value={row.workTime}
                        onChangeText={(v) => handleChange(idx, "workTime", v)}
                      />
                    </View>
                    <View style={styles.inputGroup}>
                      <ThemedText style={styles.inputLabel}>
                        Rest (s)
                      </ThemedText>
                      <TextInput
                        style={styles.input}
                        placeholder="0"
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                        value={row.restTime}
                        onChangeText={(v) => handleChange(idx, "restTime", v)}
                      />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
        <View style={styles.buttonContainer}>
          {/* Add Exercise Button */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={addRow}
            activeOpacity={0.85}
          >
            <Text style={styles.addButtonText}>+ Add Exercise</Text>
          </TouchableOpacity>

          {/* Save Workout Plan Button */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={savePlan}
            activeOpacity={0.85}
          >
            <Text style={styles.saveButtonText}>
              {editIndex !== null ? "Update Workout Plan" : "Save Workout Plan"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ParallaxScrollView>
  );
}

const baseButton = {
  borderRadius: 24,
  height: 60,
  justifyContent: "center",
  alignItems: "center",
  borderWidth: 2,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.18,
  shadowRadius: 8,
  elevation: 2,
  alignSelf: "center",
  paddingHorizontal: 24,
} as const;

const baseButtonText = {
  fontSize: 24,
  fontWeight: "bold",
  letterSpacing: 1,
  textTransform: "uppercase",
} as const;

const baseInput = {
  borderWidth: 1,
  borderColor: "#555",
  borderRadius: 8,
  padding: 8,
  backgroundColor: "#333",
  color: "#fff",
  fontSize: 24,
} as const;

const tabletStyles = StyleSheet.create({
  headerImage: {
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  centeredContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  workoutNameContainer: {
    marginBottom: 20,
    alignItems: "center",
    gap: 8,
  },
  workoutNameInput: {
    ...baseInput,
    minWidth: 300,
    alignSelf: "center",
  },
  formScroll: {
    alignSelf: "center",
    width: "100%",
  },
  tabletFormContainer: {
    width: "90%",
    gap: 20,
  },
  tabletWorkoutCard: {
    backgroundColor: "#2C2C2E",
    borderRadius: 16,
    padding: 20,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    color: "gold",
    fontSize: 22,
    fontWeight: "bold",
  },
  removeButton: {
    padding: 4,
  },
  row: {
    flexDirection: "row",
    gap: 16,
  },
  inputGroup: {
    flex: 1,
    flexDirection: "column",
    gap: 8,
  },
  inputLabel: {
    fontSize: 18,
    color: "#EBEBF599",
    fontWeight: "600",
  },
  input: {
    ...baseInput,
    fontSize: 20,
  },
  removeButtonContainer: {
    justifyContent: "center",
    paddingBottom: 4,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: "column",
    gap: 10,
    width: "100%",
    alignItems: "center",
  },
  addButton: {
    ...baseButton,
    backgroundColor: "gold",
    borderColor: "gold",
    marginTop: 20,
    marginBottom: 0,
  },
  addButtonText: {
    ...baseButtonText,
    color: "#222",
  },
  saveButton: {
    ...baseButton,
    backgroundColor: "#222",
    borderColor: "gold",
    marginTop: 10,
  },
  saveButtonText: {
    ...baseButtonText,
    color: "gold",
  },
  // Removed timerCardsContainer and related styles
  // Properties for mobile styles that don't exist in tablet
  mobileFormContainer: {},
  tableHeader: {},
  workoutRow: {},
  exerciseColumn: {},
  smallColumn: {},
  removeColumn: {},
  mobileWorkoutCard: {},
});

const mobileStyles = StyleSheet.create({
  ...tabletStyles,
  headerImage: {
    bottom: -30,
    left: -20,
    position: "absolute",
  },
  centeredContainer: {
    ...tabletStyles.centeredContainer,
    justifyContent: "flex-start",
  },
  workoutNameContainer: {
    width: "100%",
    marginBottom: 12,
    alignItems: "stretch",
  },
  workoutNameInput: {
    ...tabletStyles.workoutNameInput,
    width: "100%",
    fontSize: 20,
  },
  formScroll: {
    width: "100%",
  },
  mobileFormContainer: {
    width: "100%",
    gap: 16,
  },
  mobileWorkoutCard: {
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    padding: 12,
    width: "100%",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    color: "gold",
    fontSize: 18,
    fontWeight: "bold",
  },
  removeButton: {
    padding: 4,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  inputGroup: {
    flex: 1,
    gap: 6,
  },
  inputLabel: {
    ...tabletStyles.inputLabel,
    fontSize: 14,
    fontWeight: "600",
    color: "#EBEBF599", // Light gray for label
  },
  input: {
    ...tabletStyles.input,
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 8,
    minWidth: 0,
    textAlign: "left",
  },
  buttonContainer: {
    ...tabletStyles.buttonContainer,
    flexDirection: "column",
    width: "100%",
    gap: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  addButton: {
    ...tabletStyles.addButton,
    width: "100%",
    height: 50,
    marginTop: 10,
    marginBottom: 0,
  },
  saveButton: {
    ...tabletStyles.saveButton,
    width: "100%",
    height: 50,
    marginTop: 0,
  },
  addButtonText: {
    ...tabletStyles.addButtonText,
    fontSize: 20,
  },
  saveButtonText: {
    ...tabletStyles.saveButtonText,
    fontSize: 20,
  },
});
