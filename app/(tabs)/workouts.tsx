import {
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Text,
} from "react-native";
import { useState } from "react";
import { Feather } from "@expo/vector-icons";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function WorkoutsScreen() {
  const [workouts, setWorkouts] = useState([
    { name: "", sets: "", reps: "", weight: "", workTime: "", restTime: "" },
  ]);

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
      { name: "", sets: "", reps: "", weight: "", workTime: "", restTime: "" },
    ]);
  };

  const removeRow = (index: number) => {
    if (workouts.length === 1) return;
    setWorkouts((prev) => prev.filter((_, i) => i !== index));
  };

  const savePlan = () => {
    // TODO: Save logic (e.g., to async storage or backend)
    console.log("Saved workout plan:", workouts);
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
        <ScrollView style={styles.formScroll}>
          {workouts.map((row, idx) => (
            <View
              key={idx}
              style={{
                flexDirection: "row",
                gap: 20,
                marginBottom: 12,
                alignItems: "flex-end",
              }}
            >
              <View style={styles.inputGroup}>
                <ThemedText style={[styles.inputLabel, styles.name]}>
                  Name
                </ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  value={row.name}
                  onChangeText={(v) => handleChange(idx, "name", v)}
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
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 40,
  },
  formScroll: {
    alignSelf: "center",
  },
  inputGroup: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  inputLabel: {
    fontSize: 24,
    color: "white",
    marginBottom: 2,
    marginLeft: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    width: "100%",
    backgroundColor: "#fff",
    fontSize: 24,
    justifyContent: "center",
    minWidth: 80,
  },
  name: {
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
});
