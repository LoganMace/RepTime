import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTheme } from "@/hooks/useTheme";
import { UserInfo, formatWeight, formatHeight } from "@/utils/profileStorage";

interface UserInfoCardProps {
  userInfo: UserInfo;
  units: "metric" | "imperial";
  onEdit: () => void;
}

export const UserInfoCard: React.FC<UserInfoCardProps> = ({ userInfo, units, onEdit }) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.titleRow}>
          <IconSymbol name="person.circle" size={24} color={colors.primary} />
          <ThemedText style={styles.cardTitle}>User Information</ThemedText>
        </View>
        <TouchableOpacity onPress={onEdit} style={styles.editButton}>
          <IconSymbol name="pencil" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.infoGrid}>
        <View style={styles.infoItem}>
          <ThemedText style={styles.label}>Name</ThemedText>
          <ThemedText style={styles.value}>
            {userInfo.name || "Not set"}
          </ThemedText>
        </View>
        
        <View style={styles.infoItem}>
          <ThemedText style={styles.label}>Age</ThemedText>
          <ThemedText style={styles.value}>
            {userInfo.age} years
          </ThemedText>
        </View>
        
        <View style={styles.infoItem}>
          <ThemedText style={styles.label}>Weight</ThemedText>
          <ThemedText style={styles.value}>
            {formatWeight(userInfo.weight, units)}
          </ThemedText>
        </View>
        
        <View style={styles.infoItem}>
          <ThemedText style={styles.label}>Height</ThemedText>
          <ThemedText style={styles.value}>
            {formatHeight(userInfo.height, units)}
          </ThemedText>
        </View>
      </View>
    </View>
  );
};

const createStyles = (colors: ReturnType<typeof useTheme>["colors"]) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    editButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: colors.inputBackground,
    },
    infoGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 16,
    },
    infoItem: {
      flex: 1,
      minWidth: "45%",
    },
    label: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 4,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    value: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.text,
    },
  });