import React from "react";
import { View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { ExerciseItem } from "./ExerciseItem";

interface ExerciseCardProps {
  title: string;
  icon: any;
  iconColor: string;
  exercises: any[];
  allExercises: any[];
  completed: number[];
  activeExercise: number | null;
  styles: any;
  colors: any;
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
  styles,
  colors,
  hasTimerData,
  onSetActive,
  onComplete,
  onEdit,
  onStartTimer,
}) => {
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
          <IconSymbol 
            size={14} 
            color={colors.textSecondary} 
            name="pencil" 
            style={{width: 36, opacity: 0.5}} 
          />
          {exercises.some((ex: any) => hasTimerData(ex)) && (
            <IconSymbol 
              size={14} 
              color={colors.textSecondary} 
              name="play.fill" 
              style={{width: 36, opacity: 0.5}} 
            />
          )}
          <View 
            style={{
              width: 28, 
              height: 14, 
              borderRadius: 4, 
              borderWidth: 1.5, 
              borderColor: colors.inputBorder, 
              backgroundColor: colors.inputBackground, 
              opacity: 0.6
            }} 
          />
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
              styles={styles}
              colors={colors}
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