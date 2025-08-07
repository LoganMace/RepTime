import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import WorkoutViewModal from "@/components/WorkoutViewModal";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { useTheme } from "@/hooks/useTheme";

export default function SavedWorkoutsScreen() {
  const { getStyles } = useResponsiveStyles();
  const { colors } = useTheme();
  const styles = getStyles(mobileStyles(colors), tabletStyles(colors));
  const router = useRouter();

  const [savedWorkouts, setSavedWorkouts] = useState<any[]>([]);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewWorkout, setViewWorkout] = useState<any | null>(null);

  const loadWorkouts = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem("workoutPlans");
      setSavedWorkouts(data ? JSON.parse(data) : []);
    } catch {
      setSavedWorkouts([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadWorkouts();
    }, [loadWorkouts])
  );

  const handleDelete = async (idx: number) => {
    const updated = savedWorkouts.filter((_, i) => i !== idx);
    setSavedWorkouts(updated);
    await AsyncStorage.setItem("workoutPlans", JSON.stringify(updated));
  };

  const handleEdit = (plan: any, idx: number) => {
    router.push({
      pathname: "/workouts",
      params: { editIndex: idx, workout: JSON.stringify(plan) },
    });
  };

  const handleView = (plan: any) => {
    setViewWorkout(plan);
    setViewModalVisible(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
                  style={{ padding: 12 }}
                >
                  <Feather name="edit-2" size={26} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(idx)}
                  style={{ padding: 12 }}
                >
                  <Feather name="trash-2" size={26} color={colors.error} />
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
                      {ex.exercise}
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
                  backgroundColor: colors.primary,
                  borderRadius: 12,
                  padding: 12,
                  zIndex: 10,
                }}
              >
                <Feather name="eye" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
      <WorkoutViewModal
        visible={viewModalVisible}
        workout={viewWorkout}
        onClose={() => setViewModalVisible(false)}
      />
    </ScrollView>
  );
}

const tabletStyles = (colors: ReturnType<typeof useTheme>["colors"]) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      alignItems: "center",
    },
    timerCardsContainer: {
      width: "100%",
      paddingHorizontal: 16,
    },
    timerCard: {
      backgroundColor: colors.inputBackground,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      width: "100%",
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 2,
    },
    timerCardTitle: {
      color: colors.gold,
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 8,
    },
    timerCardText: {
      color: colors.text,
      fontSize: 16,
      marginBottom: 4,
    },
  });

const mobileStyles = (colors: ReturnType<typeof useTheme>["colors"]) => {
  const tablet = tabletStyles(colors);
  return StyleSheet.create({
    ...tablet,
  });
};
