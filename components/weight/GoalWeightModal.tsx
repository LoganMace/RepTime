import React from "react";
import {
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useResponsiveStyles } from "../../hooks/useResponsiveStyles";
import { ThemedText } from "../ThemedText";

interface GoalWeightModalProps {
  visible: boolean;
  goalWeight: number;
  newGoalWeight: string;
  onClose: () => void;
  onSave: () => void;
  onGoalWeightChange: (weight: string) => void;
}

export default function GoalWeightModal({
  visible,
  goalWeight,
  newGoalWeight,
  onClose,
  onSave,
  onGoalWeightChange,
}: GoalWeightModalProps) {
  const { getStyles } = useResponsiveStyles();
  const styles = getStyles(mobileStyles, tabletStyles);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ThemedText style={styles.modalTitle}>Set Goal Weight</ThemedText>
          <ThemedText style={styles.modalSubtitle}>
            Current goal: {goalWeight > 0 ? `${goalWeight} lbs` : "Not set"}
          </ThemedText>

          <View style={styles.modalForm}>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter goal weight (lbs)"
              placeholderTextColor="#9CA3AF"
              value={newGoalWeight}
              onChangeText={onGoalWeightChange}
              keyboardType="decimal-pad"
              autoFocus={true}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={onClose}
              >
                <ThemedText style={styles.modalCancelText}>Cancel</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalSaveButton} onPress={onSave}>
                <ThemedText style={styles.modalSaveText}>Save Goal</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const tabletStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 14,
    opacity: 0.8,
    textAlign: "center",
    marginBottom: 24,
  },
  modalForm: {
    gap: 20,
  },
  modalInput: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  modalCancelText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  modalSaveButton: {
    flex: 1,
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  modalSaveText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

const mobileStyles = StyleSheet.create({
  ...tabletStyles,
  modalContent: {
    ...tabletStyles.modalContent,
    padding: 20,
    paddingBottom: 36,
  },
  modalTitle: {
    ...tabletStyles.modalTitle,
    fontSize: 18,
  },
  modalButtons: {
    ...tabletStyles.modalButtons,
    flexDirection: "column",
    gap: 12,
  },
  modalCancelButton: {
    ...tabletStyles.modalCancelButton,
    flex: 0,
  },
  modalSaveButton: {
    ...tabletStyles.modalSaveButton,
    flex: 0,
  },
});
