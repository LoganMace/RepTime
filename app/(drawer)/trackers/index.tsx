import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";

export default function TrackingScreen() {
  const { getStyles } = useResponsiveStyles();
  const styles = getStyles(mobileStyles, tabletStyles);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <ThemedText style={styles.title}>
            📊 Health & Fitness Tracking
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Track your progress across multiple health metrics
          </ThemedText>
        </View>

        <View style={styles.contentContainer}>
          <ThemedText style={styles.comingSoon}>Coming Soon!</ThemedText>
          <ThemedText style={styles.description}>
            This comprehensive tracking page will help you monitor:
            {"\n\n"}• Weight loss progress and BMI
            {"\n"}• Daily caloric intake and expenditure
            {"\n"}• Protein consumption and goals
            {"\n"}• Water intake tracking
            {"\n"}• Sleep quality and duration
            {"\n"}• Workout logs and exercise history
            {"\n\n"}All in one convenient location with charts and insights.
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const tabletStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.7,
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    padding: 24,
  },
  comingSoon: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    textAlign: "left",
    opacity: 0.8,
    lineHeight: 24,
    maxWidth: 600,
  },
});

const mobileStyles = StyleSheet.create({
  ...tabletStyles,
  scrollContainer: {
    ...tabletStyles.scrollContainer,
    padding: 16,
  },
  title: {
    ...tabletStyles.title,
    fontSize: 28,
  },
  subtitle: {
    ...tabletStyles.subtitle,
    fontSize: 14,
  },
  comingSoon: {
    ...tabletStyles.comingSoon,
    fontSize: 20,
  },
  description: {
    ...tabletStyles.description,
    fontSize: 14,
    maxWidth: "100%",
  },
});
