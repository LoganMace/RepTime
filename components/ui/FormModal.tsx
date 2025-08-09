import React, { ReactNode } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { useResponsiveStyles } from "../../hooks/useResponsiveStyles";

export interface FormInput {
  key: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: "default" | "numeric" | "decimal-pad";
  textAlign?: "left" | "center" | "right";
  multiline?: boolean;
}

export interface FormButton {
  text: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

interface FormModalProps {
  // Core modal props
  visible: boolean;
  onClose: () => void;
  
  // Content configuration
  title: string;
  subtitle?: string;
  
  // Form configuration
  inputs?: FormInput[];
  children?: ReactNode; // For custom form content
  
  // Button configuration
  primaryButton?: FormButton;
  secondaryButton?: FormButton;
  
  // Layout options
  scrollable?: boolean;
  size?: "small" | "medium" | "large";
}

export default function FormModal({
  visible,
  onClose,
  title,
  subtitle,
  inputs = [],
  children,
  primaryButton,
  secondaryButton,
  scrollable = false,
  size = "medium",
}: FormModalProps) {
  const { colors } = useTheme();
  const { getStyles } = useResponsiveStyles();
  const styles = getStyles(mobileStyles(colors), tabletStyles(colors));

  const contentStyle = {
    small: styles.modalContentSmall,
    medium: styles.modalContent,
    large: styles.modalContentLarge,
  }[size];

  const renderContent = () => (
    <>
      {/* Header */}
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>{title}</Text>
        {subtitle && <Text style={styles.modalSubtitle}>{subtitle}</Text>}
      </View>

      {/* Form Content */}
      <View style={styles.modalForm}>
        {/* Render inputs if provided */}
        {inputs.map((input) => (
          <TextInput
            key={input.key}
            style={[
              styles.input,
              input.textAlign === "center" && { textAlign: "center" },
            ]}
            placeholder={input.placeholder}
            placeholderTextColor={colors.placeholder}
            value={input.value}
            onChangeText={input.onChangeText}
            keyboardType={input.keyboardType || "default"}
            multiline={input.multiline}
          />
        ))}
        
        {/* Custom children content */}
        {children}
      </View>

      {/* Buttons */}
      {(primaryButton || secondaryButton) && (
        <View style={styles.modalButtons}>
          {secondaryButton && (
            <TouchableOpacity
              style={[styles.modalButton, styles.secondaryButton]}
              onPress={secondaryButton.onPress}
            >
              <Text style={styles.secondaryButtonText}>
                {secondaryButton.text}
              </Text>
            </TouchableOpacity>
          )}
          
          {primaryButton && (
            <TouchableOpacity
              style={[
                styles.modalButton,
                styles.primaryButton,
                primaryButton.disabled && styles.disabledButton,
              ]}
              onPress={primaryButton.onPress}
              disabled={primaryButton.disabled}
            >
              <Text
                style={[
                  styles.primaryButtonText,
                  primaryButton.disabled && styles.disabledButtonText,
                ]}
              >
                {primaryButton.text}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={contentStyle}>
          {scrollable ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {renderContent()}
            </ScrollView>
          ) : (
            renderContent()
          )}
        </View>
      </View>
    </Modal>
  );
}

const tabletStyles = (colors: ReturnType<typeof useTheme>["colors"]) =>
  StyleSheet.create({
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
      width: "90%",
      maxWidth: 500,
    },
    modalContentSmall: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 24,
      width: "80%",
      maxWidth: 400,
    },
    modalContentLarge: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 24,
      width: "95%",
      maxWidth: 700,
      maxHeight: "90%",
    },
    modalHeader: {
      marginBottom: 20,
      alignItems: "center",
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: colors.text,
      textAlign: "center",
      marginBottom: 8,
    },
    modalSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 18,
    },
    modalForm: {
      gap: 16,
    },
    input: {
      backgroundColor: colors.inputBackground,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 12,
      paddingHorizontal: 20,
      paddingVertical: 16,
      fontSize: 18,
      color: colors.inputText,
    },
    modalButtons: {
      flexDirection: "row",
      gap: 12,
      marginTop: 24,
    },
    modalButton: {
      flex: 1,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: "center",
    },
    primaryButton: {
      backgroundColor: colors.primary,
    },
    secondaryButton: {
      backgroundColor: colors.inputBackground,
      borderWidth: 1,
      borderColor: colors.inputBorder,
    },
    primaryButtonText: {
      color: colors.textInverse,
      fontSize: 16,
      fontWeight: "600",
    },
    secondaryButtonText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "500",
    },
    disabledButton: {
      backgroundColor: colors.inputBackground,
      opacity: 0.6,
    },
    disabledButtonText: {
      color: colors.textSecondary,
    },
    scrollContent: {
      flexGrow: 1,
    },
  });

const mobileStyles = (colors: ReturnType<typeof useTheme>["colors"]) => {
  const tablet = tabletStyles(colors);
  return StyleSheet.create({
    ...tablet,
    modalContent: {
      ...tablet.modalContent,
      width: "95%",
      padding: 20,
    },
    modalContentSmall: {
      ...tablet.modalContentSmall,
      width: "90%",
      padding: 20,
    },
    modalContentLarge: {
      ...tablet.modalContentLarge,
      width: "98%",
      padding: 20,
      maxHeight: "95%",
    },
    modalTitle: {
      ...tablet.modalTitle,
      fontSize: 18,
    },
    input: {
      ...tablet.input,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
    },
    modalButton: {
      ...tablet.modalButton,
      paddingVertical: 12,
    },
    modalButtons: {
      ...tablet.modalButtons,
      marginTop: 20,
    },
  });
};