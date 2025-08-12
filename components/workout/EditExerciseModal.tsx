import React, { useMemo } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTheme } from "@/hooks/useTheme";

interface EditExerciseModalProps {
  visible: boolean;
  editingExercise: any;
  units: "metric" | "imperial";
  onClose: () => void;
  onSave: () => void;
  onExerciseChange: (exercise: any) => void;
}

export const EditExerciseModal: React.FC<EditExerciseModalProps> = ({
  visible,
  editingExercise,
  units,
  onClose,
  onSave,
  onExerciseChange,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  
  if (!editingExercise) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.editModalOverlay}>
        <View style={styles.editModalContent}>
          <View style={styles.editModalHeader}>
            <ThemedText style={styles.editModalTitle}>
              Edit Exercise
            </ThemedText>
            <TouchableOpacity
              onPress={onClose}
              style={styles.editModalClose}
            >
              <IconSymbol
                size={20}
                color={colors.textSecondary}
                name="xmark"
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.editModalForm}
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.editInputGroup, { marginBottom: 20 }]}>
              <ThemedText style={styles.editInputLabel}>
                Exercise Name
              </ThemedText>
              <TextInput
                style={[
                  styles.editInput,
                  { fontSize: 16, paddingVertical: 12 },
                ]}
                value={editingExercise.exercise || ""}
                onChangeText={(text) =>
                  onExerciseChange({ ...editingExercise, exercise: text })
                }
                placeholder="Enter exercise name"
                placeholderTextColor={colors.placeholder}
              />
            </View>

            <View style={styles.editInputRow}>
              <View
                style={[styles.editInputGroup, styles.editInputGroupThird]}
              >
                <ThemedText style={styles.editInputLabel}>Sets</ThemedText>
                <TextInput
                  style={styles.editInput}
                  value={editingExercise.sets?.toString() || ""}
                  onChangeText={(text) =>
                    onExerciseChange({ ...editingExercise, sets: text })
                  }
                  placeholder="0"
                  keyboardType="numeric"
                  placeholderTextColor={colors.placeholder}
                />
              </View>
              <View
                style={[styles.editInputGroup, styles.editInputGroupThird]}
              >
                <ThemedText style={styles.editInputLabel}>Reps</ThemedText>
                <TextInput
                  style={styles.editInput}
                  value={editingExercise.reps?.toString() || ""}
                  onChangeText={(text) =>
                    onExerciseChange({ ...editingExercise, reps: text })
                  }
                  placeholder="0"
                  keyboardType="numeric"
                  placeholderTextColor={colors.placeholder}
                />
              </View>
              <View
                style={[styles.editInputGroup, styles.editInputGroupThird]}
              >
                <ThemedText style={styles.editInputLabel}>
                  Weight ({units === "imperial" ? "lbs" : "kg"})
                </ThemedText>
                <TextInput
                  style={styles.editInput}
                  value={editingExercise.weight?.toString() || ""}
                  onChangeText={(text) =>
                    onExerciseChange({ ...editingExercise, weight: text })
                  }
                  placeholder="0"
                  keyboardType="numeric"
                  placeholderTextColor={colors.placeholder}
                />
              </View>
            </View>

            <View style={styles.editInputRow}>
              <View
                style={[styles.editInputGroup, styles.editInputGroupThird]}
              >
                <ThemedText style={styles.editInputLabel}>
                  Work (s)
                </ThemedText>
                <TextInput
                  style={styles.editInput}
                  value={editingExercise.workTime?.toString() || ""}
                  onChangeText={(text) =>
                    onExerciseChange({
                      ...editingExercise,
                      workTime: text,
                    })
                  }
                  placeholder="0"
                  keyboardType="numeric"
                  placeholderTextColor={colors.placeholder}
                />
              </View>
              <View
                style={[styles.editInputGroup, styles.editInputGroupThird]}
              >
                <ThemedText style={styles.editInputLabel}>
                  Rest (s)
                </ThemedText>
                <TextInput
                  style={styles.editInput}
                  value={editingExercise.restTime?.toString() || ""}
                  onChangeText={(text) =>
                    onExerciseChange({
                      ...editingExercise,
                      restTime: text,
                    })
                  }
                  placeholder="0"
                  keyboardType="numeric"
                  placeholderTextColor={colors.placeholder}
                />
              </View>
              <View
                style={[styles.editInputGroup, styles.editInputGroupThird]}
              >
                <ThemedText style={styles.editInputLabel}>
                  Set Rest (s)
                </ThemedText>
                <TextInput
                  style={styles.editInput}
                  value={editingExercise.setRest?.toString() || ""}
                  onChangeText={(text) =>
                    onExerciseChange({
                      ...editingExercise,
                      setRest: text,
                    })
                  }
                  placeholder="0"
                  keyboardType="numeric"
                  placeholderTextColor={colors.placeholder}
                />
              </View>
            </View>

            <View style={styles.editCheckboxRow}>
              <TouchableOpacity
                style={styles.editCheckboxContainer}
                onPress={() =>
                  onExerciseChange({
                    ...editingExercise,
                    warmup: !editingExercise.warmup,
                    cooldown: editingExercise.warmup
                      ? editingExercise.cooldown
                      : false,
                  })
                }
              >
                <View
                  style={[
                    styles.editCheckbox,
                    editingExercise.warmup && styles.editCheckboxChecked,
                  ]}
                >
                  {editingExercise.warmup && (
                    <IconSymbol
                      size={12}
                      color={colors.textInverse}
                      name="checkmark"
                    />
                  )}
                </View>
                <ThemedText style={styles.editCheckboxLabel}>
                  Warmup
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.editCheckboxContainer}
                onPress={() =>
                  onExerciseChange({
                    ...editingExercise,
                    cooldown: !editingExercise.cooldown,
                    warmup: editingExercise.cooldown
                      ? editingExercise.warmup
                      : false,
                  })
                }
              >
                <View
                  style={[
                    styles.editCheckbox,
                    editingExercise.cooldown && styles.editCheckboxChecked,
                  ]}
                >
                  {editingExercise.cooldown && (
                    <IconSymbol
                      size={12}
                      color={colors.textInverse}
                      name="checkmark"
                    />
                  )}
                </View>
                <ThemedText style={styles.editCheckboxLabel}>
                  Cooldown
                </ThemedText>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.editModalButtons}>
            <TouchableOpacity
              style={styles.editModalCancelButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <ThemedText style={styles.editModalCancelText}>
                Cancel
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editModalSaveButton}
              onPress={onSave}
              activeOpacity={0.7}
            >
              <ThemedText style={styles.editModalSaveText}>Save</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (colors: ReturnType<typeof useTheme>["colors"]) =>
  StyleSheet.create({
    editModalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    editModalContent: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 0,
      width: "100%",
      maxWidth: 420,
      maxHeight: "85%",
      overflow: "hidden",
    },
    editModalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    editModalTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    editModalClose: {
      padding: 4,
      borderRadius: 8,
      backgroundColor: colors.inputBackground,
    },
    editModalForm: {
      paddingHorizontal: 20,
      paddingVertical: 20,
    },
    editInputGroup: {
      marginBottom: 0,
      flex: 1,
    },
    editInputGroupThird: {
      flex: 1,
    },
    editInputLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.textSecondary,
      marginBottom: 4,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    editInput: {
      backgroundColor: colors.inputBackground,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 8,
      fontSize: 14,
      color: colors.inputText,
    },
    editInputRow: {
      flexDirection: "row",
      gap: 10,
      marginBottom: 20,
    },
    editCheckboxRow: {
      flexDirection: "row",
      gap: 24,
      marginTop: 4,
      justifyContent: "center",
      paddingVertical: 16,
      backgroundColor: colors.inputBackground,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.inputBorder,
    },
    editCheckboxContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    editCheckbox: {
      width: 20,
      height: 20,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: colors.inputBorder,
      backgroundColor: colors.inputBackground,
      justifyContent: "center",
      alignItems: "center",
    },
    editCheckboxChecked: {
      borderColor: "gold",
      backgroundColor: "gold",
    },
    editCheckboxLabel: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.text,
    },
    editModalButtons: {
      flexDirection: "row",
      gap: 10,
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.card,
    },
    editModalCancelButton: {
      flex: 1,
      backgroundColor: colors.inputBackground,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      paddingVertical: 14,
      alignItems: "center",
    },
    editModalCancelText: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    editModalSaveButton: {
      flex: 1,
      backgroundColor: "gold",
      borderRadius: 10,
      paddingVertical: 14,
      alignItems: "center",
      shadowColor: "gold",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    editModalSaveText: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.textInverse,
    },
  });