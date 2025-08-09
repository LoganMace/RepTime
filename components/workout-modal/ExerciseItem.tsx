import React from "react";
import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";

interface ExerciseItemProps {
  exercise: any;
  originalIndex: number;
  isCompleted: boolean;
  isActive: boolean;
  hasTimerData: boolean;
  styles: any;
  colors: any;
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
  styles,
  colors,
  onSetActive,
  onComplete,
  onEdit,
  onStartTimer,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.exerciseItem,
        isCompleted && styles.exerciseItemCompleted,
        isActive && styles.exerciseItemActive,
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
            {isCompleted ? (
              <IconSymbol
                size={20}
                color={colors.textInverse}
                name="checkmark"
              />
            ) : (
              <View style={styles.emptyCheckbox} />
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
            <ThemedText style={styles.detailValue}>{exercise.weight} lbs</ThemedText>
          </View>
        )}
        {exercise.workTime && exercise.workTime.toString().trim() && (
          <View style={styles.detailItem}>
            <ThemedText style={styles.detailLabel}>Work</ThemedText>
            <ThemedText style={styles.detailValue}>{exercise.workTime}s</ThemedText>
          </View>
        )}
        {exercise.restTime && exercise.restTime.toString().trim() && (
          <View style={styles.detailItem}>
            <ThemedText style={styles.detailLabel}>Rest</ThemedText>
            <ThemedText style={styles.detailValue}>{exercise.restTime}s</ThemedText>
          </View>
        )}
        {exercise.setRest && exercise.setRest.toString().trim() && (
          <View style={styles.detailItem}>
            <ThemedText style={styles.detailLabel}>Set Rest</ThemedText>
            <ThemedText style={styles.detailValue}>{exercise.setRest}s</ThemedText>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};