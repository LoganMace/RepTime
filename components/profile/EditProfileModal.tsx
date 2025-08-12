import React, { useState } from "react";
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
import {
  UserInfo,
  kgToLbs,
  lbsToKg,
  cmToFeetAndInches,
  feetAndInchesToCm,
} from "@/utils/profileStorage";

interface EditProfileModalProps {
  visible: boolean;
  userInfo: UserInfo;
  units: "metric" | "imperial";
  onSave: (userInfo: UserInfo) => void;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  userInfo,
  units,
  onSave,
  onClose,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const [name, setName] = useState(userInfo.name);
  const [age, setAge] = useState(userInfo.age.toString());
  const [weight, setWeight] = useState(
    units === "imperial" 
      ? kgToLbs(userInfo.weight).toString()
      : userInfo.weight.toString()
  );
  const [height, setHeight] = useState(() => {
    if (units === "imperial") {
      const { feet, inches } = cmToFeetAndInches(userInfo.height);
      return { feet: feet.toString(), inches: inches.toString() };
    }
    return { cm: userInfo.height.toString() };
  });

  const handleSave = () => {
    const updatedInfo: UserInfo = {
      name: name.trim(),
      age: parseInt(age) || 25,
      weight: units === "imperial" 
        ? lbsToKg(parseFloat(weight) || 0)
        : parseFloat(weight) || 70,
      height: units === "imperial"
        ? feetAndInchesToCm(
            parseInt(height.feet || "0") || 0,
            parseInt(height.inches || "0") || 0
          )
        : parseInt(height.cm || "0") || 170,
    };
    onSave(updatedInfo);
    onClose();
  };

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
            <ThemedText style={styles.modalTitle}>Edit Profile</ThemedText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <IconSymbol name="xmark" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
            {/* Name Input */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Name</ThemedText>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            {/* Age Input */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Age</ThemedText>
              <TextInput
                style={styles.input}
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
                placeholder="Enter your age"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            {/* Weight Input */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>
                Weight ({units === "imperial" ? "lbs" : "kg"})
              </ThemedText>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                keyboardType="decimal-pad"
                placeholder={`Enter weight in ${units === "imperial" ? "lbs" : "kg"}`}
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            {/* Height Input */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>
                Height ({units === "imperial" ? "ft/in" : "cm"})
              </ThemedText>
              {units === "imperial" ? (
                <View style={styles.heightRow}>
                  <TextInput
                    style={[styles.input, styles.heightInput]}
                    value={height.feet}
                    onChangeText={(text) => setHeight({ ...height, feet: text })}
                    keyboardType="numeric"
                    placeholder="Feet"
                    placeholderTextColor={colors.textSecondary}
                  />
                  <ThemedText style={styles.heightSeparator}>ft</ThemedText>
                  <TextInput
                    style={[styles.input, styles.heightInput]}
                    value={height.inches}
                    onChangeText={(text) => setHeight({ ...height, inches: text })}
                    keyboardType="numeric"
                    placeholder="Inches"
                    placeholderTextColor={colors.textSecondary}
                  />
                  <ThemedText style={styles.heightSeparator}>in</ThemedText>
                </View>
              ) : (
                <TextInput
                  style={styles.input}
                  value={height.cm}
                  onChangeText={(text) => setHeight({ cm: text })}
                  keyboardType="numeric"
                  placeholder="Enter height in cm"
                  placeholderTextColor={colors.textSecondary}
                />
              )}
            </View>
          </ScrollView>

          <View style={styles.modalButtons}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <ThemedText style={styles.cancelText}>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <ThemedText style={styles.saveText}>Save</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (colors: ReturnType<typeof useTheme>["colors"]) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    modalContent: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 0,
      width: "100%",
      maxWidth: 400,
      maxHeight: "80%",
      overflow: "hidden",
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    closeButton: {
      padding: 4,
      borderRadius: 8,
      backgroundColor: colors.inputBackground,
    },
    modalForm: {
      paddingHorizontal: 20,
      paddingVertical: 20,
    },
    inputGroup: {
      marginBottom: 20,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textSecondary,
      marginBottom: 8,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    input: {
      backgroundColor: colors.inputBackground,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 16,
      color: colors.inputText,
    },
    heightRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    heightInput: {
      flex: 1,
    },
    heightSeparator: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    modalButtons: {
      flexDirection: "row",
      gap: 10,
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.card,
    },
    cancelButton: {
      flex: 1,
      backgroundColor: colors.inputBackground,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      paddingVertical: 14,
      alignItems: "center",
    },
    cancelText: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    saveButton: {
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
    saveText: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.textInverse,
    },
  });