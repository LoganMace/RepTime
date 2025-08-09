import { StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";

export const createMobileStyles = (colors: ReturnType<typeof useTheme>["colors"]) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: colors.background,
    },
    modalContent: {
      flex: 1,
      backgroundColor: colors.background,
    },
    headerCard: {
      backgroundColor: colors.card,
      padding: 16,
      paddingTop: 60, // Add extra padding for status bar
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
    columnHeaders: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 8,
      marginBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    exerciseNameHeader: {
      flex: 1,
      minWidth: 100,
    },
    columnActionsHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    columnHeaderText: {
      fontSize: 10,
      fontWeight: "600",
      color: colors.textSecondary,
      textAlign: "center",
      width: 36,
      lineHeight: 12,
      opacity: 0.7,
    },
    activeColumnHeaderText: {
      fontSize: 10,
      fontWeight: "600",
      color: colors.textSecondary,
      textAlign: "left",
      lineHeight: 13,
      paddingRight: 8,
    },
    exercisesList: {
      gap: 12,
    },
    exerciseItem: {
      backgroundColor: colors.inputBackground,
      borderRadius: 8,
      padding: 12,
      borderWidth: 1,
      borderColor: "transparent",
    },
    exerciseItemCompleted: {
      backgroundColor: colors.primary + "20",
      borderWidth: 1,
      borderColor: colors.gold,
    },
    exerciseItemActive: {
      borderWidth: 1,
      borderColor: colors.primary,
    },
    exerciseHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    exerciseHeaderActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    actionButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
    },
    editActionButton: {
      backgroundColor: colors.background,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 2,
      elevation: 1,
    },
    timerActionButton: {
      backgroundColor: colors.background,
      shadowColor: "gold",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.15,
      shadowRadius: 2,
      elevation: 1,
    },
    completeActionButton: {
      width: 28,
      height: 28,
      borderRadius: 8,
      backgroundColor: colors.inputBackground,
      borderWidth: 2,
      borderColor: colors.inputBorder,
      padding: 0,
    },
    completeActionButtonActive: {
      backgroundColor: "gold",
      borderColor: "gold",
      shadowColor: "gold",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    emptyCheckbox: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.textSecondary,
      opacity: 0.5,
    },
    exerciseName: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      flex: 1,
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
    // Edit Modal Styles
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

export const createTabletStyles = (colors: ReturnType<typeof useTheme>["colors"]) => {
  const mobile = createMobileStyles(colors);
  return StyleSheet.create({
    ...mobile,
    modalOverlay: {
      ...mobile.modalOverlay,
    },
    modalContent: {
      ...mobile.modalContent,
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
    exerciseItemActive: {
      ...mobile.exerciseItemActive,
    },
    exerciseHeaderActions: {
      ...mobile.exerciseHeaderActions,
      gap: 10,
    },
    actionButton: {
      ...mobile.actionButton,
      width: 40,
      height: 40,
      borderRadius: 20,
    },
    completeActionButton: {
      ...mobile.completeActionButton,
      width: 32,
      height: 32,
      borderRadius: 10,
    },
    columnHeaders: {
      ...mobile.columnHeaders,
      paddingVertical: 10,
    },
    exerciseNameHeader: {
      ...mobile.exerciseNameHeader,
      minWidth: 120,
    },
    columnActionsHeader: {
      ...mobile.columnActionsHeader,
      gap: 10,
    },
    columnHeaderText: {
      ...mobile.columnHeaderText,
      fontSize: 11,
      width: 40,
      lineHeight: 14,
    },
    activeColumnHeaderText: {
      ...mobile.activeColumnHeaderText,
      fontSize: 12,
      lineHeight: 15,
    },
    exerciseName: {
      ...mobile.exerciseName,
      fontSize: 18,
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