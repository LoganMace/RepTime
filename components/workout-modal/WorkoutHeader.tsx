import React from "react";
import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";

interface WorkoutHeaderProps {
  workout: any;
  progress: number;
  completedCount: number;
  styles: any;
  colors: any;
  onClose: () => void;
}

export const WorkoutHeader: React.FC<WorkoutHeaderProps> = ({
  workout,
  progress,
  completedCount,
  styles,
  colors,
  onClose,
}) => {
  return (
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
              {Math.round(progress * 100)}% Complete ({completedCount}/
              {workout?.exercises?.length || 0})
            </ThemedText>
          </View>
        </View>
      )}
    </View>
  );
};