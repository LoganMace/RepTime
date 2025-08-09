import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import WorkoutViewModal from "@/components/workout/WorkoutViewModal";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { useTheme } from "@/hooks/useTheme";

export default function SavedWorkoutsScreen() {
  const { getStyles } = useResponsiveStyles();
  const { colors } = useTheme();

  const styles = useMemo(() => {
    return getStyles(mobileStyles(colors), tabletStyles(colors));
  }, [getStyles, colors]);
  const router = useRouter();

  const [savedWorkouts, setSavedWorkouts] = useState<any[]>([]);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewWorkout, setViewWorkout] = useState<any | null>(null);

  const loadWorkouts = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem("workoutPlans");
      const workoutPlans = data ? JSON.parse(data) : [];
      
      // Debug: Log the structure to see what fields are being used
      if (workoutPlans.length > 0) {
        console.log("Loaded workout plans:", JSON.stringify(workoutPlans[0], null, 2));
        if (workoutPlans[0].exercises?.length > 0) {
          console.log("First exercise fields:", Object.keys(workoutPlans[0].exercises[0]));
        }
      }
      
      // Migrate old data format (workout -> exercise)
      let needsUpdate = false;
      const migratedPlans = workoutPlans.map((plan: any) => {
        const migratedExercises = plan.exercises?.map((ex: any) => {
          if (ex.workout && !ex.exercise) {
            console.log(`Migrating exercise: ${ex.workout} -> exercise field`);
            needsUpdate = true;
            return { ...ex, exercise: ex.workout };
          }
          return ex;
        });
        
        return { ...plan, exercises: migratedExercises };
      });
      
      // Save migrated data back to storage
      if (needsUpdate) {
        console.log("Updating workout plans to use 'exercise' field");
        await AsyncStorage.setItem("workoutPlans", JSON.stringify(migratedPlans));
      }
      
      setSavedWorkouts(migratedPlans);
    } catch (error) {
      console.error("Error loading workouts:", error);
      setSavedWorkouts([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadWorkouts();
    }, [loadWorkouts])
  );

  const handleDelete = async (idx: number) => {
    const workout = savedWorkouts[idx];
    Alert.alert(
      "Delete Workout",
      `Are you sure you want to delete "${workout.name}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const updated = savedWorkouts.filter((_, i) => i !== idx);
            setSavedWorkouts(updated);
            await AsyncStorage.setItem("workoutPlans", JSON.stringify(updated));
          },
        },
      ]
    );
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

  const handleWorkoutUpdate = (updatedWorkout: any) => {
    // Update the workout in the local state
    setSavedWorkouts(prev => 
      prev.map(workout => 
        workout.name === updatedWorkout.name && workout.savedAt === updatedWorkout.savedAt 
          ? updatedWorkout 
          : workout
      )
    );
    // Update the viewWorkout state as well
    setViewWorkout(updatedWorkout);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {savedWorkouts.length === 0 ? (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <IconSymbol
                size={24}
                color="gold"
                name="figure.strengthtraining.traditional"
              />
              <ThemedText style={styles.cardTitle}>
                No Saved Workouts
              </ThemedText>
            </View>
            <ThemedText style={styles.emptyText}>
              Create and save your first workout to see it here.
            </ThemedText>
          </View>
        ) : (
          savedWorkouts.map((plan, idx) => (
            <View key={idx} style={styles.card}>
              <View style={styles.cardHeader}>
                <IconSymbol
                  size={24}
                  color="gold"
                  name="figure.strengthtraining.traditional"
                />
                <ThemedText style={styles.cardTitle}>{plan.name}</ThemedText>
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    onPress={() => handleEdit(plan, idx)}
                    style={styles.actionButton}
                  >
                    <IconSymbol
                      size={20}
                      color={colors.primary}
                      name="pencil"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDelete(idx)}
                    style={styles.actionButton}
                  >
                    <IconSymbol size={20} color={colors.error} name="trash" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.workoutDetails}>
                <View style={styles.workoutSummary}>
                  <ThemedText style={styles.exerciseCount}>
                    {plan.exercises.length} exercise
                    {plan.exercises.length !== 1 ? "s" : ""}
                  </ThemedText>
                  <ThemedText style={styles.savedDate}>
                    Saved: {new Date(plan.savedAt).toLocaleDateString()}
                  </ThemedText>
                </View>

                <View style={styles.exercisesList}>
                  {plan.exercises && plan.exercises.length > 0 ? (
                    plan.exercises.slice(0, 3).map((ex: any, i: number) => {
                      const details = [];
                      if (ex.sets && ex.sets.toString().trim())
                        details.push(`${ex.sets} sets`);
                      if (ex.reps && ex.reps.toString().trim())
                        details.push(`${ex.reps} reps`);
                      if (ex.weight && ex.weight.toString().trim())
                        details.push(`${ex.weight} lbs`);
                      if (ex.workTime && ex.workTime.toString().trim())
                        details.push(`${ex.workTime}s work`);
                      if (ex.restTime && ex.restTime.toString().trim())
                        details.push(`${ex.restTime}s rest`);

                      const exerciseName =
                        ex.exercise || `Exercise ${i + 1}`;

                      return (
                        <View key={i} style={styles.exerciseItem}>
                          <ThemedText style={styles.exerciseName}>
                            {exerciseName}
                          </ThemedText>
                          {details.length > 0 && (
                            <ThemedText style={styles.exerciseDetails}>
                              {details.join(" • ")}
                            </ThemedText>
                          )}
                        </View>
                      );
                    })
                  ) : (
                    <ThemedText style={styles.emptyText}>
                      No exercises found in this workout
                    </ThemedText>
                  )}
                  {plan.exercises && plan.exercises.length > 3 && (
                    <ThemedText style={styles.moreExercises}>
                      +{plan.exercises.length - 3} more exercise
                      {plan.exercises.length - 3 !== 1 ? "s" : ""}
                    </ThemedText>
                  )}
                </View>

                <TouchableOpacity
                  onPress={() => handleView(plan)}
                  style={styles.viewButton}
                  activeOpacity={0.8}
                >
                  <IconSymbol size={20} color={colors.textInverse} name="eye" />
                  <Text style={styles.viewButtonText}>View Workout</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <WorkoutViewModal
        visible={viewModalVisible}
        workout={viewWorkout}
        onClose={() => setViewModalVisible(false)}
        onWorkoutUpdate={handleWorkoutUpdate}
      />
    </ThemedView>
  );
}

const tabletStyles = (colors: ReturnType<typeof useTheme>["colors"]) =>
  StyleSheet.create({
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
    cardActions: {
      flexDirection: "row",
      gap: 8,
    },
    actionButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: colors.inputBackground,
    },
    emptyText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      marginTop: 8,
    },
    workoutDetails: {
      paddingTop: 16,
      minHeight: 100,
      gap: 16,
    },
    workoutSummary: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
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
    exercisesList: {
      gap: 8,
    },
    exerciseItem: {
      paddingVertical: 12,
      paddingHorizontal: 12,
      backgroundColor: colors.inputBackground,
      borderRadius: 8,
      marginBottom: 8,
      minHeight: 50,
      borderWidth: 1,
      borderColor: colors.border,
    },
    exerciseName: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      lineHeight: 20,
    },
    exerciseDetails: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 4,
      lineHeight: 18,
    },
    moreExercises: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: "center",
      fontStyle: "italic",
      paddingVertical: 8,
    },
    viewButton: {
      backgroundColor: "gold",
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },
    viewButtonText: {
      color: colors.textInverse,
      fontSize: 16,
      fontWeight: "600",
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
    exerciseName: {
      ...tablet.exerciseName,
      fontSize: 13,
    },
    exerciseDetails: {
      ...tablet.exerciseDetails,
      fontSize: 11,
    },
    viewButton: {
      ...tablet.viewButton,
      paddingVertical: 14,
    },
    viewButtonText: {
      ...tablet.viewButtonText,
      fontSize: 14,
    },
  });
};
