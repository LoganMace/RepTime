import { StyleSheet, View } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1 }}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
        headerImage={
          <IconSymbol
            name="figure.walk"
            size={310}
            color="cyan"
            style={styles.headerIcon}
          />
        }
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Welcome to RepTime!</ThemedText>
          <HelloWave />
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Getting Started</ThemedText>
          <ThemedText>
            Welcome to RepTime, your ultimate workout companion. Here&apos;s how
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
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">3. Use the Side Menu</ThemedText>
          <ThemedText>
            Tap the menu icon in the top-left corner to open the side
            navigation. From there, you can easily switch between the Home and
            Timers pages.
          </ThemedText>
        </ThemedView>
      </ParallaxScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
