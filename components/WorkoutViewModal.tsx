import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { useTheme } from "@/hooks/useTheme";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
  const styles = getStyles(mobileStyles(colors), tabletStyles(colors));

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

  const progress = workout ? completed.length / workout.exercises.length : 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Workout</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          {workout && (
            <ScrollView contentContainerStyle={styles.scrollContent}>
              {/* Progress Bar */}
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${progress * 100}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {Math.round(progress * 100)}% Complete
                </Text>
              </View>
              <Text style={styles.title}>{workout.name}</Text>
              <Text style={styles.subtitle}>
                {workout.exercises.length} exercise
                {workout.exercises.length !== 1 ? "s" : ""}
              </Text>
              <Text style={styles.markCompleteLabel}>Mark Complete</Text>
              {workout.exercises.map((ex: any, i: number) => (
                <TouchableOpacity
                  key={i}
                  style={styles.exerciseRow}
                  onPress={() => handleComplete(i)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.exerciseTitle}>{ex.workout}</Text>
                  {ex.sets ? (
                    <Text style={styles.detailRow}>Sets: {ex.sets}</Text>
                  ) : null}
                  {ex.reps ? (
                    <Text style={styles.detailRow}>Reps: {ex.reps}</Text>
                  ) : null}
                  {ex.weight ? (
                    <Text style={styles.detailRow}>Weight: {ex.weight}</Text>
                  ) : null}
                  {ex.workTime ? (
                    <Text style={styles.detailRow}>Work: {ex.workTime}s</Text>
                  ) : null}
                  {ex.restTime ? (
                    <Text style={styles.detailRow}>Rest: {ex.restTime}s</Text>
                  ) : null}
                  <View style={styles.flexSpacer} />
                  <View
                    style={
                      completed.includes(i)
                        ? styles.completeButtonDone
                        : styles.completeButton
                    }
                  >
                    <Text style={styles.completeButtonText}>✔️</Text>
                  </View>
                </TouchableOpacity>
              ))}
              <Text style={styles.savedAt}>
                Saved: {new Date(workout.savedAt).toLocaleString()}
              </Text>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

const mobileStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 16,
    width: "100%",
    maxWidth: 600,
    maxHeight: "90%",
    padding: 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },
  closeButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.inputBackground,
  },
  closeButtonText: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "bold",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  title: {
    color: colors.warning,
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    color: colors.text,
    fontSize: 18,
    marginBottom: 16,
    textAlign: "center",
  },
  exerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    flexWrap: "wrap",
    gap: 16,
  },
  exerciseTitle: {
    color: colors.warning,
    fontSize: 24,
    fontWeight: "bold",
    marginRight: 16,
  },
  detailRow: {
    color: colors.text,
    fontSize: 18,
    marginRight: 16,
  },
  savedAt: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: "center",
    marginTop: 16,
  },
  progressBarContainer: {
    marginBottom: 16,
    alignItems: "center",
  },
  progressBarBg: {
    width: "100%",
    height: 12,
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    overflow: "hidden",
  },
  progressBarFill: {
    height: 12,
    backgroundColor: colors.warning,
    borderRadius: 12,
  },
  progressText: {
    color: colors.warning,
    fontSize: 14,
    marginTop: 4,
    fontWeight: "bold",
  },
  completeButton: {
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  completeButtonDone: {
    backgroundColor: colors.warning,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  completeButtonText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "bold",
  },
  flexSpacer: {
    flex: 1,
  },
  markCompleteLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    marginLeft: "auto",
    marginRight: 0,
    textAlign: "right",
  },
});

const tabletStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 16,
    width: "100%",
    maxWidth: 800,
    maxHeight: "90%",
    padding: 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
  },
  closeButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.inputBackground,
  },
  closeButtonText: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "bold",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  title: {
    color: colors.warning,
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    color: colors.text,
    fontSize: 24,
    marginBottom: 24,
    textAlign: "center",
  },
  exerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    flexWrap: "wrap",
    gap: 24,
  },
  exerciseTitle: {
    color: colors.warning,
    fontSize: 32,
    fontWeight: "bold",
    marginRight: 24,
  },
  detailRow: {
    color: colors.text,
    fontSize: 28,
    marginRight: 24,
  },
  savedAt: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
    marginTop: 24,
  },
  progressBarContainer: {
    marginBottom: 24,
    alignItems: "center",
  },
  progressBarBg: {
    width: "100%",
    height: 16,
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    overflow: "hidden",
  },
  progressBarFill: {
    height: 16,
    backgroundColor: colors.warning,
    borderRadius: 12,
  },
  progressText: {
    color: colors.warning,
    fontSize: 18,
    marginTop: 8,
    fontWeight: "bold",
  },
  completeButton: {
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginRight: 16,
  },
  completeButtonDone: {
    backgroundColor: colors.warning,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginRight: 16,
  },
  completeButtonText: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "bold",
  },
  flexSpacer: {
    flex: 1,
  },
  markCompleteLabel: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    marginLeft: "auto",
    marginRight: 0,
    textAlign: "right",
  },
});

export default WorkoutViewModal;
