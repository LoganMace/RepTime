import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTheme } from "@/hooks/useTheme";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { ExerciseItem } from "./ExerciseItem";

interface ExerciseCardProps {
  title: string;
  icon: any;
  iconColor: string;
  exercises: any[];
  allExercises: any[];
  completed: number[];
  activeExercise: number | null;
  hasTimerData: (exercise: any) => boolean;
  onSetActive: (index: number) => void;
  onComplete: (index: number, event: any) => void;
  onEdit: (index: number, event: any) => void;
  onStartTimer: (exercise: any) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  title,
  icon,
  iconColor,
  exercises,
  allExercises,
  completed,
  activeExercise,
  hasTimerData,
  onSetActive,
  onComplete,
  onEdit,
  onStartTimer,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  if (exercises.length === 0) return null;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <IconSymbol size={20} color={iconColor} name={icon} />
        <ThemedText style={styles.cardSubtitle}>{title}</ThemedText>
      </View>

      {/* Column Headers */}
      <View style={styles.columnHeaders}>
        <View style={styles.exerciseNameHeader}>
          <ThemedText style={styles.activeColumnHeaderText}>
            Tap to set as active
          </ThemedText>
        </View>
        <View style={styles.columnActionsHeader}>
          <ThemedText style={styles.activeColumnHeaderText}>Edit</ThemedText>
          {exercises.some((ex: any) => hasTimerData(ex)) && (
            <ThemedText style={styles.activeColumnHeaderText}>Timer</ThemedText>
          )}
          <ThemedText style={styles.activeColumnHeaderText}>
            Complete
          </ThemedText>
        </View>
      </View>

      <View style={styles.exercisesList}>
        {exercises.map((ex: any) => {
          const originalIndex = allExercises.findIndex(
            (originalEx: any) => originalEx === ex
          );
          return (
            <ExerciseItem
              key={originalIndex}
              exercise={ex}
              originalIndex={originalIndex}
              isCompleted={completed.includes(originalIndex)}
              isActive={activeExercise === originalIndex}
              hasTimerData={hasTimerData(ex)}
              onSetActive={onSetActive}
              onComplete={onComplete}
              onEdit={onEdit}
              onStartTimer={onStartTimer}
            />
          );
        })}
      </View>
    </View>
  );
};

const createStyles = (colors: ReturnType<typeof useTheme>["colors"]) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 12,
    },
    cardSubtitle: {
      fontSize: 16,
      fontWeight: "600",
      flex: 1,
    },
    columnHeaders: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 8,
      marginBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    exerciseNameHeader: {
      flex: 1,
      minWidth: 100,
    },
    columnActionsHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    },
    activeColumnHeaderText: {
      fontSize: 10,
      fontWeight: "600",
      color: colors.textSecondary,
      textAlign: "left",
      lineHeight: 13,
    },
    exercisesList: {
      gap: 12,
    },
  });
