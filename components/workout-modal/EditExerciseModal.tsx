import React from "react";
import {
  Modal,
  ScrollView,
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
  styles: any;
  colors: any;
  onClose: () => void;
  onSave: () => void;
  onExerciseChange: (exercise: any) => void;
}

export const EditExerciseModal: React.FC<EditExerciseModalProps> = ({
  visible,
  editingExercise,
  styles,
  colors,
  onClose,
  onSave,
  onExerciseChange,
}) => {
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
                  Weight (lbs)
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