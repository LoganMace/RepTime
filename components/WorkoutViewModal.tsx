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
  const [completed, setCompleted] = useState<number[]>([]);

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
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={modalStyles.container}>
        <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
          <Text style={modalStyles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        {workout && (
          <ScrollView contentContainerStyle={modalStyles.scrollContent}>
            {/* Progress Bar */}
            <View style={modalStyles.progressBarContainer}>
              <View style={modalStyles.progressBarBg}>
                <View
                  style={{
                    ...modalStyles.progressBarFill,
                    width: `${progress * 100}%`,
                  }}
                />
              </View>
              <Text style={modalStyles.progressText}>
                {Math.round(progress * 100)}% Complete
              </Text>
            </View>
            <Text style={modalStyles.title}>{workout.name}</Text>
            <Text style={modalStyles.subtitle}>
              {workout.exercises.length} exercise
              {workout.exercises.length !== 1 ? "s" : ""}
            </Text>
            <Text style={modalStyles.markCompleteLabel}>Mark Complete</Text>
            {workout.exercises.map((ex: any, i: number) => (
              <TouchableOpacity
                key={i}
                style={modalStyles.exerciseRow}
                onPress={() => handleComplete(i)}
                activeOpacity={0.7}
              >
                <Text style={modalStyles.exerciseTitle}>{ex.workout}</Text>
                {ex.sets ? (
                  <Text style={modalStyles.detailRow}>Sets: {ex.sets}</Text>
                ) : null}
                {ex.reps ? (
                  <Text style={modalStyles.detailRow}>Reps: {ex.reps}</Text>
                ) : null}
                {ex.weight ? (
                  <Text style={modalStyles.detailRow}>Weight: {ex.weight}</Text>
                ) : null}
                {ex.workTime ? (
                  <Text style={modalStyles.detailRow}>
                    Work: {ex.workTime}s
                  </Text>
                ) : null}
                {ex.restTime ? (
                  <Text style={modalStyles.detailRow}>
                    Rest: {ex.restTime}s
                  </Text>
                ) : null}
                <View style={modalStyles.flexSpacer} />
                <View
                  style={
                    completed.includes(i)
                      ? modalStyles.completeButtonDone
                      : modalStyles.completeButton
                  }
                >
                  <Text style={modalStyles.completeButtonText}>✔️</Text>
                </View>
              </TouchableOpacity>
            ))}
            <Text style={modalStyles.savedAt}>
              Saved: {new Date(workout.savedAt).toLocaleString()}
            </Text>
          </ScrollView>
        )}
      </View>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222",
    padding: 24,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    left: 40,
    zIndex: 1000,
  },
  closeButtonText: {
    color: "white",
    fontSize: 48,
    fontWeight: "bold",
  },
  scrollContent: {
    paddingTop: 100,
    paddingBottom: 40,
  },
  title: {
    color: "gold",
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    color: "#fff",
    fontSize: 24,
    marginBottom: 24,
    textAlign: "center",
  },
  exerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
    backgroundColor: "#333",
    borderRadius: 12,
    padding: 20,
    flexWrap: "wrap",
    gap: 24,
  },
  exerciseTitle: {
    color: "gold",
    fontSize: 32,
    fontWeight: "bold",
    marginRight: 24,
  },
  detailRow: {
    color: "#fff",
    fontSize: 28,
    marginRight: 24,
  },
  savedAt: {
    color: "#aaa",
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
    backgroundColor: "#444",
    borderRadius: 8,
    overflow: "hidden",
  },
  progressBarFill: {
    height: 16,
    backgroundColor: "gold",
    borderRadius: 8,
  },
  progressText: {
    color: "gold",
    fontSize: 18,
    marginTop: 8,
    fontWeight: "bold",
  },
  completeButton: {
    backgroundColor: "#555",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 16,
  },
  completeButtonDone: {
    backgroundColor: "gold",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 16,
  },
  completeButtonText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  flexSpacer: {
    flex: 1,
  },
  markCompleteLabel: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    marginLeft: "auto",
    marginRight: 0,
    textAlign: "right",
  },
});

export default WorkoutViewModal;
