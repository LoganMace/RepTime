import React from "react";
import {
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";
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
  const { colors } = useTheme();
  const { getStyles } = useResponsiveStyles();
  const styles = getStyles(mobileStyles(colors), tabletStyles(colors));

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
              placeholderTextColor={colors.placeholder}
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
    padding: 24,
    width: "100%",
    maxWidth: 400,
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
    gap: 16,
  },
  modalInput: {
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 18,
    color: colors.inputText,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  modalCancelText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  modalSaveButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  modalSaveText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: "600",
  },
});

const mobileStyles = (colors: ReturnType<typeof useTheme>['colors']) => {
  const tablet = tabletStyles(colors);
  return StyleSheet.create({
    ...tablet,
    modalContent: {
      ...tablet.modalContent,
      padding: 20,
    },
    modalTitle: {
      ...tablet.modalTitle,
      fontSize: 18,
    },
    modalButtons: {
      ...tablet.modalButtons,
      flexDirection: "column",
      gap: 12,
    },
    modalCancelButton: {
      ...tablet.modalCancelButton,
      flex: 0,
      paddingHorizontal: 20,
    },
    modalSaveButton: {
      ...tablet.modalSaveButton,
      flex: 0,
      paddingHorizontal: 20,
    },
    modalInput: {
      ...tablet.modalInput,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
    },
  });
};
