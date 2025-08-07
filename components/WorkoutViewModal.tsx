import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { useTheme } from "@/hooks/useTheme";
import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";

interface WorkoutViewModalProps {
  visible: boolean;
  workout: any | null;
  onClose: () => void;
}

const WorkoutViewModal: React.FC<WorkoutViewModalProps> = ({
  visible,
  workout,
  onClose,
}) => {
  const { colors } = useTheme();
  const [completed, setCompleted] = useState<number[]>([]);
  const { getStyles } = useResponsiveStyles();

  const styles = useMemo(() => {
    return getStyles(mobileStyles(colors), tabletStyles(colors));
  }, [getStyles, colors]);

  useEffect(() => {
    if (!visible) {
      setCompleted([]);
    }
  }, [visible]);

  const handleComplete = (idx: number) => {
    setCompleted((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const progress =
    workout && workout.exercises && workout.exercises.length > 0
      ? completed.length / workout.exercises.length
      : 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header Card */}
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
                    {Math.round(progress * 100)}% Complete ({completed.length}/
                    {workout?.exercises?.length || 0})
                  </ThemedText>
                </View>
              </View>
            )}
          </View>

          {workout && workout.exercises && workout.exercises.length > 0 && (
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Exercises Card */}
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <IconSymbol size={20} color="gold" name="list.bullet" />
                  <ThemedText style={styles.cardSubtitle}>Exercises</ThemedText>
                </View>

                <View style={styles.exercisesList}>
                  {workout?.exercises && workout.exercises.length > 0 ? (
                    workout.exercises.map((ex: any, i: number) => (
                      <TouchableOpacity
                        key={i}
                        style={[
                          styles.exerciseItem,
                          completed.includes(i) && styles.exerciseItemCompleted,
                        ]}
                        onPress={() => handleComplete(i)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.exerciseHeader}>
                          <ThemedText style={styles.exerciseName}>
                            {ex.workout || ex.exercise || `Exercise ${i + 1}`}
                          </ThemedText>
                          <View
                            style={[
                              styles.checkbox,
                              completed.includes(i) && styles.checkboxCompleted,
                            ]}
                          >
                            {completed.includes(i) && (
                              <IconSymbol
                                size={16}
                                color={colors.textInverse}
                                name="checkmark"
                              />
                            )}
                          </View>
                        </View>

                        <View style={styles.exerciseDetails}>
                          {ex.sets && ex.sets.toString().trim() && (
                            <View style={styles.detailItem}>
                              <ThemedText style={styles.detailLabel}>
                                Sets
                              </ThemedText>
                              <ThemedText style={styles.detailValue}>
                                {ex.sets}
                              </ThemedText>
                            </View>
                          )}
                          {ex.reps && ex.reps.toString().trim() && (
                            <View style={styles.detailItem}>
                              <ThemedText style={styles.detailLabel}>
                                Reps
                              </ThemedText>
                              <ThemedText style={styles.detailValue}>
                                {ex.reps}
                              </ThemedText>
                            </View>
                          )}
                          {ex.weight && ex.weight.toString().trim() && (
                            <View style={styles.detailItem}>
                              <ThemedText style={styles.detailLabel}>
                                Weight
                              </ThemedText>
                              <ThemedText style={styles.detailValue}>
                                {ex.weight} lbs
                              </ThemedText>
                            </View>
                          )}
                          {ex.workTime && ex.workTime.toString().trim() && (
                            <View style={styles.detailItem}>
                              <ThemedText style={styles.detailLabel}>
                                Work
                              </ThemedText>
                              <ThemedText style={styles.detailValue}>
                                {ex.workTime}s
                              </ThemedText>
                            </View>
                          )}
                          {ex.restTime && ex.restTime.toString().trim() && (
                            <View style={styles.detailItem}>
                              <ThemedText style={styles.detailLabel}>
                                Rest
                              </ThemedText>
                              <ThemedText style={styles.detailValue}>
                                {ex.restTime}s
                              </ThemedText>
                            </View>
                          )}
                        </View>
                      </TouchableOpacity>
                    ))
                  ) : (
                    <ThemedText style={styles.emptyText}>
                      No exercises found
                    </ThemedText>
                  )}
                </View>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

const mobileStyles = (colors: ReturnType<typeof useTheme>["colors"]) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: "center",
      alignItems: "center",
      padding: 16,
    },
    modalContent: {
      backgroundColor: colors.background,
      borderRadius: 16,
      width: "100%",
      maxWidth: 600,
      height: "90%",
      overflow: "hidden",
    },
    headerCard: {
      backgroundColor: colors.card,
      padding: 16,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
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
    cardSubtitle: {
      fontSize: 16,
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
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
      paddingTop: 16,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
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
    exercisesList: {
      gap: 12,
    },
    exerciseItem: {
      backgroundColor: colors.inputBackground,
      borderRadius: 8,
      padding: 12,
    },
    exerciseItemCompleted: {
      backgroundColor: colors.primary + "20",
      borderWidth: 1,
      borderColor: "gold",
    },
    exerciseHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    exerciseName: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      flex: 1,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: colors.border,
      backgroundColor: colors.inputBackground,
      justifyContent: "center",
      alignItems: "center",
    },
    checkboxCompleted: {
      backgroundColor: "gold",
      borderColor: "gold",
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
    emptyText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      marginTop: 8,
    },
  });

const tabletStyles = (colors: ReturnType<typeof useTheme>["colors"]) => {
  const mobile = mobileStyles(colors);
  return StyleSheet.create({
    ...mobile,
    modalOverlay: {
      ...mobile.modalOverlay,
      padding: 24,
    },
    modalContent: {
      ...mobile.modalContent,
      maxWidth: 800,
    },
    headerCard: {
      ...mobile.headerCard,
      padding: 20,
    },
    cardTitle: {
      ...mobile.cardTitle,
      fontSize: 20,
    },
    cardSubtitle: {
      ...mobile.cardSubtitle,
      fontSize: 18,
    },
    scrollContent: {
      ...mobile.scrollContent,
      padding: 20,
      paddingTop: 20,
    },
    card: {
      ...mobile.card,
      padding: 20,
      marginBottom: 20,
    },
    progressText: {
      ...mobile.progressText,
      fontSize: 16,
    },
    exerciseItem: {
      ...mobile.exerciseItem,
      padding: 16,
    },
    exerciseName: {
      ...mobile.exerciseName,
      fontSize: 18,
    },
    checkbox: {
      ...mobile.checkbox,
      width: 28,
      height: 28,
    },
    detailItem: {
      ...mobile.detailItem,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    detailLabel: {
      ...mobile.detailLabel,
      fontSize: 12,
    },
    detailValue: {
      ...mobile.detailValue,
      fontSize: 14,
    },
  });
};

export default WorkoutViewModal;
