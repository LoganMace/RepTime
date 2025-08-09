import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTheme } from "@/hooks/useTheme";
import React, { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface ExerciseItemProps {
  exercise: any;
  originalIndex: number;
  isCompleted: boolean;
  isActive: boolean;
  hasTimerData: boolean;
  onSetActive: (index: number) => void;
  onComplete: (index: number, event: any) => void;
  onEdit: (index: number, event: any) => void;
  onStartTimer: (exercise: any) => void;
}

export const ExerciseItem: React.FC<ExerciseItemProps> = ({
  exercise,
  originalIndex,
  isCompleted,
  isActive,
  hasTimerData,
  onSetActive,
  onComplete,
  onEdit,
  onStartTimer,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <TouchableOpacity
      style={[
        styles.exerciseItem,
        isCompleted && styles.exerciseItemCompleted,
        isActive && !isCompleted && styles.exerciseItemActive,
      ]}
      onPress={() => onSetActive(originalIndex)}
      activeOpacity={0.7}
    >
      <View style={styles.exerciseHeader}>
        <ThemedText style={styles.exerciseName}>
          {exercise.exercise || `Exercise ${originalIndex + 1}`}
        </ThemedText>
        <View style={styles.exerciseHeaderActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editActionButton]}
            onPress={(e) => onEdit(originalIndex, e)}
            activeOpacity={0.8}
          >
            <IconSymbol size={18} color={colors.textSecondary} name="pencil" />
          </TouchableOpacity>
          {hasTimerData && (
            <TouchableOpacity
              style={[styles.actionButton, styles.timerActionButton]}
              onPress={(e) => {
                e.stopPropagation();
                onStartTimer(exercise);
              }}
              activeOpacity={0.8}
            >
              <IconSymbol size={18} color="gold" name="play.fill" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.completeActionButton,
              isCompleted && styles.completeActionButtonActive,
            ]}
            onPress={(e) => onComplete(originalIndex, e)}
            activeOpacity={0.8}
          >
            {isCompleted && (
              <IconSymbol
                size={20}
                color={colors.textInverse}
                name="checkmark"
              />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.exerciseDetails}>
        {exercise.sets && exercise.sets.toString().trim() && (
          <View style={styles.detailItem}>
            <ThemedText style={styles.detailLabel}>Sets</ThemedText>
            <ThemedText style={styles.detailValue}>{exercise.sets}</ThemedText>
          </View>
        )}
        {exercise.reps && exercise.reps.toString().trim() && (
          <View style={styles.detailItem}>
            <ThemedText style={styles.detailLabel}>Reps</ThemedText>
            <ThemedText style={styles.detailValue}>{exercise.reps}</ThemedText>
          </View>
        )}
        {exercise.weight && exercise.weight.toString().trim() && (
          <View style={styles.detailItem}>
            <ThemedText style={styles.detailLabel}>Weight</ThemedText>
            <ThemedText style={styles.detailValue}>
              {exercise.weight} lbs
            </ThemedText>
          </View>
        )}
        {exercise.workTime && exercise.workTime.toString().trim() && (
          <View style={styles.detailItem}>
            <ThemedText style={styles.detailLabel}>Work</ThemedText>
            <ThemedText style={styles.detailValue}>
              {exercise.workTime}s
            </ThemedText>
          </View>
        )}
        {exercise.restTime && exercise.restTime.toString().trim() && (
          <View style={styles.detailItem}>
            <ThemedText style={styles.detailLabel}>Rest</ThemedText>
            <ThemedText style={styles.detailValue}>
              {exercise.restTime}s
            </ThemedText>
          </View>
        )}
        {exercise.setRest && exercise.setRest.toString().trim() && (
          <View style={styles.detailItem}>
            <ThemedText style={styles.detailLabel}>Set Rest</ThemedText>
            <ThemedText style={styles.detailValue}>
              {exercise.setRest}s
            </ThemedText>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (colors: ReturnType<typeof useTheme>["colors"]) =>
  StyleSheet.create({
    exerciseItem: {
      backgroundColor: colors.inputBackground,
      borderRadius: 8,
      padding: 12,
      borderWidth: 1,
      borderColor: "transparent",
    },
    exerciseItemCompleted: {
      backgroundColor: colors.primary + "20",
      borderWidth: 1,
      borderColor: "gold",
    },
    exerciseItemActive: {
      borderWidth: 1,
      borderColor: colors.primary,
    },
    exerciseHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    exerciseHeaderActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    },
    actionButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
    },
    editActionButton: {
      backgroundColor: colors.background,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 2,
      elevation: 1,
    },
    timerActionButton: {
      backgroundColor: colors.background,
      shadowColor: "gold",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.15,
      shadowRadius: 2,
      elevation: 1,
    },
    completeActionButton: {
      width: 28,
      height: 28,
      borderRadius: 8,
      backgroundColor: colors.inputBackground,
      borderWidth: 2,
      borderColor: colors.inputBorder,
      padding: 0,
    },
    completeActionButtonActive: {
      backgroundColor: "gold",
      borderColor: "gold",
      shadowColor: "gold",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    exerciseName: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      flex: 1,
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
  });
