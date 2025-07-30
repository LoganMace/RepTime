import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet } from "react-native";

export default function QuickTimersScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Quick Timers</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
