import React from "react";
import { StyleSheet, Switch, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTheme } from "@/hooks/useTheme";
import { Preferences } from "@/utils/profileStorage";

interface PreferencesCardProps {
  preferences: Preferences;
  onUpdate: (preferences: Preferences) => void;
}

export const PreferencesCard: React.FC<PreferencesCardProps> = ({ 
  preferences, 
  onUpdate 
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const handleWeightUnitsToggle = () => {
    onUpdate({
      ...preferences,
      weightUnits: preferences.weightUnits === "metric" ? "imperial" : "metric",
    });
  };

  const handleWorkoutUnitsToggle = () => {
    onUpdate({
      ...preferences,
      workoutUnits: preferences.workoutUnits === "metric" ? "imperial" : "metric",
    });
  };

  const handleSoundToggle = () => {
    onUpdate({
      ...preferences,
      muteSounds: !preferences.muteSounds,
    });
  };

  const handleVoiceToggle = () => {
    onUpdate({
      ...preferences,
      muteVoice: !preferences.muteVoice,
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.titleRow}>
          <IconSymbol name="gearshape" size={24} color={colors.primary} />
          <ThemedText style={styles.cardTitle}>Preferences</ThemedText>
        </View>
      </View>

      <View style={styles.preferencesList}>
        {/* Weight Units Toggle */}
        <View style={styles.preferenceItem}>
          <View style={styles.preferenceInfo}>
            <IconSymbol name="scalemass" size={20} color={colors.text} />
            <View style={styles.textContainer}>
              <ThemedText style={styles.preferenceLabel}>Weight Units</ThemedText>
              <ThemedText style={styles.preferenceValue}>
                {preferences.weightUnits === "metric" ? "Metric (kg)" : "Imperial (lbs)"}
              </ThemedText>
            </View>
          </View>
          <View style={styles.toggleContainer}>
            <ThemedText style={styles.toggleLabel}>kg</ThemedText>
            <Switch
              value={preferences.weightUnits === "imperial"}
              onValueChange={handleWeightUnitsToggle}
              trackColor={{ false: "#767577", true: "#4CAF50" }}
              thumbColor={preferences.weightUnits === "imperial" ? "#ffffff" : "#f4f3f4"}
            />
            <ThemedText style={styles.toggleLabel}>lbs</ThemedText>
          </View>
        </View>

        {/* Workout Units Toggle */}
        <View style={styles.preferenceItem}>
          <View style={styles.preferenceInfo}>
            <IconSymbol name="dumbbell" size={20} color={colors.text} />
            <View style={styles.textContainer}>
              <ThemedText style={styles.preferenceLabel}>Workout Units</ThemedText>
              <ThemedText style={styles.preferenceValue}>
                {preferences.workoutUnits === "metric" ? "Metric (kg)" : "Imperial (lbs)"}
              </ThemedText>
            </View>
          </View>
          <View style={styles.toggleContainer}>
            <ThemedText style={styles.toggleLabel}>kg</ThemedText>
            <Switch
              value={preferences.workoutUnits === "imperial"}
              onValueChange={handleWorkoutUnitsToggle}
              trackColor={{ false: "#767577", true: "#4CAF50" }}
              thumbColor={preferences.workoutUnits === "imperial" ? "#ffffff" : "#f4f3f4"}
            />
            <ThemedText style={styles.toggleLabel}>lbs</ThemedText>
          </View>
        </View>

        {/* Sound Settings Section */}
        <View style={styles.sectionDivider} />
        
        <ThemedText style={styles.sectionTitle}>Sound Settings</ThemedText>

        {/* Mute Timer Beeps */}
        <View style={styles.preferenceItem}>
          <View style={styles.preferenceInfo}>
            <IconSymbol name="speaker.wave.2" size={20} color={colors.text} />
            <View style={styles.textContainer}>
              <ThemedText style={styles.preferenceLabel}>Timer Beeps</ThemedText>
              <ThemedText style={styles.preferenceValue}>
                {preferences.muteSounds ? "Muted" : "Enabled"}
              </ThemedText>
            </View>
          </View>
          <Switch
            value={!preferences.muteSounds}
            onValueChange={handleSoundToggle}
            trackColor={{ false: "#767577", true: "#4CAF50" }}
            thumbColor={!preferences.muteSounds ? "#ffffff" : "#f4f3f4"}
          />
        </View>

        {/* Mute Voice Announcements */}
        <View style={styles.preferenceItem}>
          <View style={styles.preferenceInfo}>
            <IconSymbol name="mic" size={20} color={colors.text} />
            <View style={styles.textContainer}>
              <ThemedText style={styles.preferenceLabel}>Voice Announcements</ThemedText>
              <ThemedText style={styles.preferenceValue}>
                {preferences.muteVoice ? "Muted" : "Enabled"}
              </ThemedText>
            </View>
          </View>
          <Switch
            value={!preferences.muteVoice}
            onValueChange={handleVoiceToggle}
            trackColor={{ false: "#767577", true: "#4CAF50" }}
            thumbColor={!preferences.muteVoice ? "#ffffff" : "#f4f3f4"}
          />
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
    preferencesList: {
      gap: 16,
    },
    preferenceItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 8,
    },
    preferenceInfo: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      flex: 1,
    },
    textContainer: {
      flex: 1,
    },
    preferenceLabel: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.text,
      marginBottom: 2,
    },
    preferenceValue: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    toggleContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    toggleLabel: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    sectionDivider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 8,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textSecondary,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 8,
    },
  });