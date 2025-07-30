import { Feather } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation, usePathname } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

export function CustomHeader() {
  const navigation = useNavigation();
  const pathname = usePathname();
  const { isMobile } = useResponsiveStyles();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const getTitle = () => {
    if (pathname === "/") return "Home";
    if (pathname === "/workouts") return "Workouts";
    if (pathname === "/timers") return "Create Timer";
    if (pathname === "/timers/quickTimers") return "Quick Timers";
    return "RepTime";
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={openDrawer} style={[styles.menuButton]}>
        <Feather name="menu" size={isMobile ? 28 : 32} color="#fff" />
      </TouchableOpacity>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">{getTitle()}</ThemedText>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    position: "relative",
  },
  menuButton: {
    position: "absolute",
    zIndex: 10,
    padding: 10,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
});
