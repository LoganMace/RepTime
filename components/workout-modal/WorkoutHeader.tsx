import React, { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTheme } from "@/hooks/useTheme";

interface WorkoutHeaderProps {
  workout: any;
  progress: number;
  completedCount: number;
  onClose: () => void;
}

export const WorkoutHeader: React.FC<WorkoutHeaderProps> = ({
  workout,
  progress,
  completedCount,
  onClose,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
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

const createStyles = (colors: ReturnType<typeof useTheme>["colors"]) =>
  StyleSheet.create({
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
  });