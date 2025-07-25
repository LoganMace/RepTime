import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import WorkoutViewModal from "@/components/WorkoutViewModal";

export default function WorkoutsScreen() {
  const [workoutName, setWorkoutName] = useState("");
  const [workouts, setWorkouts] = useState([
    { workout: "", sets: "", reps: "", weight: "", workTime: "", restTime: "" },
  ]);
  const [savedWorkouts, setSavedWorkouts] = useState<any[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewWorkout, setViewWorkout] = useState<any | null>(null);

  const loadWorkouts = async () => {
    try {
      const data = await AsyncStorage.getItem("workoutPlans");
      setSavedWorkouts(data ? JSON.parse(data) : []);
    } catch (e) {
      setSavedWorkouts([]);
    }
  };

  useEffect(() => {
    loadWorkouts();
  }, []);

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
        workout: "",
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

  const handleDelete = async (idx: number) => {
    const updated = savedWorkouts.filter((_, i) => i !== idx);
    setSavedWorkouts(updated);
    await AsyncStorage.setItem("workoutPlans", JSON.stringify(updated));
  };

  const handleEdit = (plan: any, idx: number) => {
    setWorkoutName(plan.name);
    setWorkouts(plan.exercises);
    setEditIndex(idx);
  };

  const handleView = (plan: any) => {
    setViewWorkout(plan);
    setViewModalVisible(true);
  };

  const savePlan = async () => {
    if (!workoutName.trim()) {
      alert("Please enter a workout name.");
      return;
    }
    // Require at least one workout with a non-empty 'workout' field
    const hasAtLeastOneWorkout = workouts.some((w) => w.workout.trim() !== "");
    if (!hasAtLeastOneWorkout) {
      alert("Please add at least one workout to your plan.");
      return;
    }
    const plan = {
      name: workoutName,
      exercises: workouts,
      savedAt: new Date().toISOString(),
    };
    try {
      let plans = savedWorkouts.slice();
      if (editIndex !== null) {
        plans[editIndex] = plan;
      } else {
        plans.push(plan);
      }
      await AsyncStorage.setItem("workoutPlans", JSON.stringify(plans));
      setSavedWorkouts(plans);
      alert("Workout plan saved!");
      setWorkoutName("");
      setWorkouts([
        {
          workout: "",
          sets: "",
          reps: "",
          weight: "",
          workTime: "",
          restTime: "",
        },
      ]);
      setEditIndex(null);
    } catch (e) {
      alert("Failed to save workout plan.");
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="gold"
          name="figure.strengthtraining.traditional"
          style={styles.headerImage}
        />
      }
    >
      <View style={styles.centeredContainer}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Create a Workout</ThemedText>
        </ThemedView>
        <ThemedText style={[styles.inputLabel]}>Plan Name</ThemedText>
        <TextInput
          style={styles.workoutNameInput}
          placeholder="Workout Name"
          value={workoutName}
          onChangeText={setWorkoutName}
        />
        <ScrollView style={styles.formScroll}>
          {workouts.map((row, idx) => (
            <View
              key={idx}
              style={{
                flexDirection: "row",
                gap: 20,
                marginBottom: 16,
                alignItems: "flex-end",
              }}
            >
              <View style={styles.inputGroup}>
                <ThemedText style={[styles.inputLabel, styles.name]}>
                  Workout
                </ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="Workout"
                  value={row.workout}
                  onChangeText={(v) => handleChange(idx, "workout", v)}
                />
              </View>
              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Sets</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="Sets"
                  keyboardType="numeric"
                  value={row.sets}
                  onChangeText={(v) => handleChange(idx, "sets", v)}
                />
              </View>
              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Reps</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="Reps"
                  keyboardType="numeric"
                  value={row.reps}
                  onChangeText={(v) => handleChange(idx, "reps", v)}
                />
              </View>
              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Weight</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="Weight"
                  keyboardType="numeric"
                  value={row.weight}
                  onChangeText={(v) => handleChange(idx, "weight", v)}
                />
              </View>
              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Work (s)</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="Work (s)"
                  keyboardType="numeric"
                  value={row.workTime}
                  onChangeText={(v) => handleChange(idx, "workTime", v)}
                />
              </View>
              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Rest (s)</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="Rest (s)"
                  keyboardType="numeric"
                  value={row.restTime}
                  onChangeText={(v) => handleChange(idx, "restTime", v)}
                />
              </View>
              <View style={styles.inputGroup}>
                {workouts.length > 1 && (
                  <TouchableOpacity
                    onPress={() => removeRow(idx)}
                    style={{ padding: 4 }}
                  >
                    <Feather name="trash-2" size={40} color="#d9534f" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}

          {/* Add Row Button */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={addRow}
            activeOpacity={0.85}
          >
            <Text style={styles.addButtonText}>+ Add Row</Text>
          </TouchableOpacity>

          {/* Save Workout Plan Button */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={savePlan}
            activeOpacity={0.85}
          >
            <Text style={styles.saveButtonText}>Save Workout Plan</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Saved Workouts Section */}
      <View style={{ marginTop: 40, width: "100%", alignItems: "center" }}>
        <ThemedText type="title" style={{ marginBottom: 12 }}>
          Saved Workouts
        </ThemedText>
        <View style={styles.timerCardsContainer}>
          {savedWorkouts.length === 0 ? (
            <ThemedText>No saved workouts yet.</ThemedText>
          ) : (
            savedWorkouts.map((plan, idx) => (
              <View key={idx} style={styles.timerCard}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    gap: 16,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => handleEdit(plan, idx)}
                    style={{ padding: 4 }}
                  >
                    <Feather name="edit-2" size={26} color="#007AFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDelete(idx)}
                    style={{ padding: 4 }}
                  >
                    <Feather name="trash-2" size={26} color="#d9534f" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.timerCardTitle}>{plan.name}</Text>
                <Text style={styles.timerCardText}>
                  {plan.exercises.length} exercise
                  {plan.exercises.length !== 1 ? "s" : ""}
                </Text>
                <ScrollView style={{ maxHeight: 120 }}>
                  {plan.exercises.map((ex: any, i: number) => {
                    const details = [];
                    if (ex.sets) details.push(`Sets: ${ex.sets}`);
                    if (ex.reps) details.push(`Reps: ${ex.reps}`);
                    if (ex.weight) details.push(`Weight: ${ex.weight}`);
                    if (ex.workTime) details.push(`Work: ${ex.workTime}s`);
                    if (ex.restTime) details.push(`Rest: ${ex.restTime}s`);
                    return (
                      <Text key={i} style={styles.timerCardText}>
                        {ex.workout}
                        {details.length > 0 ? " | " + details.join(" | ") : ""}
                      </Text>
                    );
                  })}
                </ScrollView>
                <Text
                  style={[styles.timerCardText, { fontSize: 12, marginTop: 8 }]}
                >
                  Saved: {new Date(plan.savedAt).toLocaleString()}
                </Text>
                <TouchableOpacity
                  onPress={() => handleView(plan)}
                  style={{
                    position: "absolute",
                    bottom: 12,
                    right: 12,
                    backgroundColor: "#007AFF",
                    borderRadius: 24,
                    padding: 10,
                    zIndex: 10,
                  }}
                >
                  <Feather name="eye" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </View>

      {/* Workout View Modal */}
      <WorkoutViewModal
        visible={viewModalVisible}
        workout={viewWorkout}
        onClose={() => setViewModalVisible(false)}
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
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
  titleContainer: {
    marginBottom: 40,
  },
  workoutNameInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    fontSize: 24,
    backgroundColor: "#fff",
    marginBottom: 20,
    minWidth: 300,
    alignSelf: "center",
  },
  formScroll: {
    alignSelf: "center",
  },
  inputGroup: {
    flexDirection: "column",
  },
  inputLabel: {
    fontSize: 24,
    color: "white",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    backgroundColor: "#fff",
    fontSize: 24,
    justifyContent: "center",
    minWidth: 80,
  },
  name: {
    fontSize: 24,
    width: 200,
  },
  addButton: {
    backgroundColor: "gold",
    borderRadius: 24,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "gold",
    marginTop: 40,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 2,
    width: 400,
    alignSelf: "center",
  },
  addButtonText: {
    color: "#222",
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  saveButton: {
    backgroundColor: "#222",
    borderRadius: 24,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "gold",
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 2,
    width: 400,
    alignSelf: "center",
  },
  saveButtonText: {
    color: "gold",
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  timerCardsContainer: {
    width: "100%",
    paddingHorizontal: 16,
  },
  timerCard: {
    backgroundColor: "#444",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  timerCardTitle: {
    color: "gold",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  timerCardText: {
    color: "white",
    fontSize: 16,
    marginBottom: 4,
  },
});

const modalStyles = StyleSheet.create({
  detail: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 4,
  },
});
