import { StyleSheet, View } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { useTheme } from "@/hooks/useTheme";

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { getStyles } = useResponsiveStyles();
  const styles = getStyles(mobileStyles(colors), tabletStyles(colors));

  return (
    <View style={{ flex: 1 }}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
        headerImage={
          <IconSymbol
            size={310}
            color={colors.primary}
            name="person.circle"
            style={styles.headerImage}
          />
        }
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Profile</ThemedText>
        </ThemedView>

        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">User Profile</ThemedText>
          <ThemedText>
            Your profile and account settings will be available here.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Coming Soon</ThemedText>
          <ThemedText>• Account management</ThemedText>
          <ThemedText>• App preferences and settings</ThemedText>
          <ThemedText>• Data export and backup options</ThemedText>
          <ThemedText>• Fitness goals and targets</ThemedText>
        </ThemedView>

        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">TrainSync</ThemedText>
          <ThemedText>
            Version 1.0.0 - Your ultimate workout companion
          </ThemedText>
        </ThemedView>
      </ParallaxScrollView>
    </View>
  );
}

const mobileStyles = (colors: ReturnType<typeof useTheme>["colors"]) =>
  StyleSheet.create({
    headerImage: {
      color: colors.primary,
      bottom: -90,
      left: -35,
      position: "absolute",
    },
    titleContainer: {
      flexDirection: "row",
      gap: 8,
      alignItems: "center",
    },
    stepContainer: {
      gap: 8,
      marginBottom: 8,
    },
  });

const tabletStyles = (colors: ReturnType<typeof useTheme>["colors"]) => {
  const mobile = mobileStyles(colors);
  return StyleSheet.create({
    ...mobile,
    headerImage: {
      ...mobile.headerImage,
      bottom: -120,
      left: -50,
    },
    titleContainer: {
      ...mobile.titleContainer,
      gap: 12,
    },
    stepContainer: {
      ...mobile.stepContainer,
      gap: 12,
      marginBottom: 16,
    },
  });
};
