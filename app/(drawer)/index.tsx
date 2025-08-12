import { Alert, StyleSheet, Switch, TouchableOpacity, View } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useMocksContext } from "@/contexts/MocksContext";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { useTheme } from "@/hooks/useTheme";
import { refreshMockWorkoutData } from "@/utils/workoutStorage";
import { resetToMockWeightData } from "@/utils/weightStorage";
import { resetToMockData } from "@/utils/mealStorage";
import { refreshMockTimerData } from "@/utils/timerStorage";

export default function HomeScreen() {
  const { colors } = useTheme();
  const { getStyles, isMobile } = useResponsiveStyles();
  const styles = getStyles(mobileStyles(colors), tabletStyles(colors));
  const { useMocks, toggleMocks } = useMocksContext();

  const handleRefreshMocks = async () => {
    try {
      // Refresh all mock data
      await Promise.all([
        refreshMockWorkoutData(),
        resetToMockWeightData(),
        resetToMockData(), // Meal mock data
        refreshMockTimerData(), // Timer mock data
      ]);
      
      Alert.alert(
        "Success",
        "Mock data has been refreshed successfully!",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("Error refreshing mock data:", error);
      Alert.alert(
        "Error",
        "Failed to refresh mock data. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
        headerImage={
          <IconSymbol
            name="figure.walk"
            size={isMobile ? 180 : 310}
            color={colors.info}
            style={styles.headerIcon}
          />
        }
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Welcome to TrainSync!</ThemedText>
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Getting Started</ThemedText>
          <ThemedText>
            Welcome to TrainSync, your ultimate workout companion. Here&apos;s how
            to get started:
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">1. Create a Timer</ThemedText>
          <ThemedText>
            Navigate to the{" "}
            <ThemedText type="defaultSemiBold">Timers</ThemedText> tab to create
            your custom interval timers. You can set the number of rounds, work
            duration, and rest duration to fit your workout needs.
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">2. Start Your Workout</ThemedText>
          <ThemedText>
            Once you&apos;ve set up your timer, hit the &quot;Start&quot; button
            to begin your session. The app will guide you through each work and
            rest phase with audio and visual cues.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.settingsContainer}>
          <ThemedText type="subtitle">Settings</ThemedText>
          <TouchableOpacity
            style={styles.toggleContainer}
            onPress={toggleMocks}
          >
            <ThemedText style={styles.toggleLabel}>
              Use Mock Data: {useMocks ? "ON" : "OFF"}
            </ThemedText>
            <Switch
              value={useMocks}
              onValueChange={toggleMocks}
              trackColor={{ false: "#767577", true: "#4CAF50" }}
              thumbColor={useMocks ? "#ffffff" : "#f4f3f4"}
            />
          </TouchableOpacity>
          <ThemedText style={styles.toggleDescription}>
            Toggle this to enable/disable mock data in trackers for development
            and testing.
          </ThemedText>
          
          {useMocks && (
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={handleRefreshMocks}
              activeOpacity={0.7}
            >
              <IconSymbol
                name="arrow.clockwise"
                size={18}
                color={colors.text}
              />
              <ThemedText style={styles.refreshButtonText}>
                Refresh Mock Data
              </ThemedText>
            </TouchableOpacity>
          )}
        </ThemedView>
      </ParallaxScrollView>
    </View>
  );
}

const tabletStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  headerIcon: {
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  settingsContainer: {
    gap: 12,
    marginTop: 16,
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  toggleDescription: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 20,
  },
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 12,
  },
  refreshButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textInverse,
  },
});

const mobileStyles = (colors: ReturnType<typeof useTheme>['colors']) => {
  const tablet = tabletStyles(colors);
  return StyleSheet.create({
    ...tablet,
  headerIcon: {
    bottom: -30,
    left: -20,
    position: "absolute",
  },
  settingsContainer: {
    ...tablet.settingsContainer,
    padding: 12,
  },
  toggleLabel: {
    ...tablet.toggleLabel,
    fontSize: 14,
  },
  toggleDescription: {
    ...tablet.toggleDescription,
    fontSize: 12,
  },
  refreshButton: {
    ...tablet.refreshButton,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  refreshButtonText: {
    ...tablet.refreshButtonText,
    fontSize: 14,
  },
  });
};
