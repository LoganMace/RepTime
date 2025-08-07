import { Feather } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation, usePathname } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { useTheme } from "@/hooks/useTheme";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

export function CustomHeader() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const pathname = usePathname();
  const { getStyles, isMobile } = useResponsiveStyles();
  const styles = getStyles(mobileStyles(colors), tabletStyles(colors));

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const getTitle = () => {
    if (pathname === "/") return "Home";
    if (pathname === "/workouts") return "Create Workout";
    if (pathname === "/workouts/savedWorkouts") return "Saved Workouts";
    if (pathname === "/timers") return "Create Timer";
    if (pathname === "/timers/savedTimers") return "Saved Timers";
    if (pathname === "/timers/quickTimers") return "Quick Timers";
    if (pathname === "/trackers") return "Trackers";
    if (pathname === "/trackers/weight") return "Weight Tracker";
    if (pathname === "/trackers/meals") return "Meal Tracker";
    return "RepTime";
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={openDrawer} style={[styles.menuButton]}>
        <Feather name="menu" size={isMobile ? 28 : 32} color={colors.text} />
      </TouchableOpacity>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">{getTitle()}</ThemedText>
      </ThemedView>
    </View>
  );
}

const tabletStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: "relative",
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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

const mobileStyles = (colors: ReturnType<typeof useTheme>['colors']) => {
  const tablet = tabletStyles(colors);
  return StyleSheet.create({
    ...tablet,
    headerContainer: {
      ...tablet.headerContainer,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
  });
};
