import { Feather } from "@expo/vector-icons";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { usePathname, useRouter } from "expo-router";
import { useState } from "react";
import {
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
} from "react-native";

import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { useThemeColors } from "@/hooks/useTheme";
import { ThemedText } from "./ThemedText";
import { IconSymbol } from "./ui/IconSymbol";

export function CustomDrawerContent(props: any) {
  const router = useRouter();
  const pathname = usePathname();
  const colors = useThemeColors();
  const { isMobile } = useResponsiveStyles();

  const [timersOpen, setTimersOpen] = useState(pathname.startsWith("/timers"));
  const [workoutsOpen, setWorkoutsOpen] = useState(
    pathname.startsWith("/workouts")
  );
  const [trackersOpen, setTrackersOpen] = useState(
    pathname.startsWith("/trackers")
  );

  const iconSize = isMobile ? 24 : 28;
  const labelSize = isMobile ? 14 : 18;

  const getLabelStyle = (path: string): StyleProp<TextStyle> => {
    const isActive = pathname === path;
    return {
      color: isActive ? colors.primary : colors.text,
      fontWeight: isActive ? "bold" : "normal",
      fontSize: labelSize,
    };
  };

  const getItemStyle = (path: string) => {
    const isActive =
      pathname === path ||
      (path === "/timers" && pathname.startsWith(path)) ||
      (path === "/workouts" && pathname.startsWith(path));
    return {
      backgroundColor: isActive ? "rgba(255, 215, 0, 0.15)" : "transparent",
      borderRadius: 12,
      marginHorizontal: 12,
      marginBottom: 6,
      paddingVertical: 4,
      borderWidth: isActive ? 1 : 0,
      borderColor: isActive ? "rgba(255, 215, 0, 0.3)" : "transparent",
      shadowColor: isActive ? "#FFD700" : "transparent",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isActive ? 0.1 : 0,
      shadowRadius: 4,
      elevation: isActive ? 2 : 0,
    };
  };

  const getSubItemStyle = (path: string) => {
    const isActive = pathname === path;
    return {
      backgroundColor: isActive
        ? "rgba(255, 215, 0, 0.12)"
        : colors.inputBackground,
      borderRadius: 10,
      marginHorizontal: 12,
      marginBottom: 4,
      paddingVertical: 2,
      borderLeftWidth: isActive ? 3 : 0,
      borderLeftColor: isActive ? "gold" : "transparent",
      marginLeft: 20,
    };
  };

  const isTimersPath = pathname.startsWith("/timers");
  const isWorkoutsPath = pathname.startsWith("/workouts");
  const isTrackersPath = pathname.startsWith("/trackers");

  return (
    <View
      style={[styles.drawerContainer, { backgroundColor: colors.background }]}
    >
      {/* Header Section */}
      <View style={[styles.drawerHeader, { backgroundColor: colors.card }]}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <IconSymbol
              name="figure.strengthtraining.traditional"
              size={32}
              color="gold"
            />
            <ThemedText style={styles.appTitle}>TrainSync</ThemedText>
          </View>
          <View
            style={[styles.headerDivider, { backgroundColor: colors.border }]}
          />
        </View>
      </View>

      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <DrawerItem
          style={getItemStyle("/")}
          label={() => <Text style={getLabelStyle("/")}>Home</Text>}
          icon={() => (
            <IconSymbol
              name="house.fill"
              size={iconSize}
              color={pathname === "/" ? colors.primary : colors.text}
            />
          )}
          onPress={() => {
            router.push("/");
            setTimersOpen(false);
            setWorkoutsOpen(false);
            setTrackersOpen(false);
          }}
        />

        {/* Section Separator */}
        <View
          style={[styles.sectionSeparator, { backgroundColor: colors.border }]}
        />

        <DrawerItem
          style={getItemStyle("/timers")}
          label={() => (
            <View style={styles.collapsibleLabelContainer}>
              <Text
                style={{
                  color: isTimersPath ? colors.primary : colors.text,
                  fontSize: labelSize,
                  fontWeight: isTimersPath ? "bold" : "normal",
                }}
              >
                Timers
              </Text>
              <Feather
                name={timersOpen ? "chevron-down" : "chevron-right"}
                size={iconSize}
                color={isTimersPath ? colors.primary : colors.text}
                style={styles.chevron}
              />
            </View>
          )}
          icon={() => (
            <IconSymbol
              name="timer"
              size={iconSize}
              color={isTimersPath ? colors.primary : colors.text}
            />
          )}
          onPress={() => {
            setTimersOpen(!timersOpen);
            setWorkoutsOpen(false);
            setTrackersOpen(false);
          }}
        />

        {timersOpen && (
          <View
            style={[
              styles.collapsibleContent,
              { paddingLeft: isMobile ? 30 : 45 },
            ]}
          >
            <DrawerItem
              style={getSubItemStyle("/timers")}
              label={() => (
                <Text style={getLabelStyle("/timers")}>Create Timer</Text>
              )}
              onPress={() => {
                router.push("/timers");
                props.navigation.closeDrawer();
              }}
            />
            <DrawerItem
              style={getSubItemStyle("/timers/savedTimers")}
              label={() => (
                <Text style={getLabelStyle("/timers/savedTimers")}>
                  Saved Timers
                </Text>
              )}
              onPress={() => {
                router.push("/timers/savedTimers");
                props.navigation.closeDrawer();
              }}
            />
            <DrawerItem
              style={getSubItemStyle("/timers/quickTimers")}
              label={() => (
                <Text style={getLabelStyle("/timers/quickTimers")}>
                  Quick Timers
                </Text>
              )}
              onPress={() => {
                router.push("/timers/quickTimers");
                props.navigation.closeDrawer();
              }}
            />
          </View>
        )}

        {/* Section Separator */}
        <View
          style={[styles.sectionSeparator, { backgroundColor: colors.border }]}
        />

        <DrawerItem
          style={getItemStyle("/workouts")}
          label={() => (
            <View style={styles.collapsibleLabelContainer}>
              <Text
                style={{
                  color: isWorkoutsPath ? colors.primary : colors.text,
                  fontSize: labelSize,
                  fontWeight: isWorkoutsPath ? "bold" : "normal",
                }}
              >
                Workouts
              </Text>
              <Feather
                name={workoutsOpen ? "chevron-down" : "chevron-right"}
                size={iconSize}
                color={isWorkoutsPath ? colors.primary : colors.text}
                style={styles.chevron}
              />
            </View>
          )}
          icon={() => (
            <IconSymbol
              name="dumbbell"
              size={iconSize}
              color={isWorkoutsPath ? colors.primary : colors.text}
            />
          )}
          onPress={() => {
            setWorkoutsOpen(!workoutsOpen);
            setTimersOpen(false);
            setTrackersOpen(false);
          }}
        />

        {workoutsOpen && (
          <View
            style={[
              styles.collapsibleContent,
              { paddingLeft: isMobile ? 30 : 45 },
            ]}
          >
            <DrawerItem
              style={getSubItemStyle("/workouts")}
              label={() => (
                <Text style={getLabelStyle("/workouts")}>Create Workout</Text>
              )}
              onPress={() => {
                router.push("/workouts");
                props.navigation.closeDrawer();
              }}
            />
            <DrawerItem
              style={getSubItemStyle("/workouts/savedWorkouts")}
              label={() => (
                <Text style={getLabelStyle("/workouts/savedWorkouts")}>
                  Saved Workouts
                </Text>
              )}
              onPress={() => {
                router.push("/workouts/savedWorkouts");
                props.navigation.closeDrawer();
              }}
            />
          </View>
        )}

        {/* Section Separator */}
        <View
          style={[styles.sectionSeparator, { backgroundColor: colors.border }]}
        />

        <DrawerItem
          style={getItemStyle("/trackers")}
          label={() => (
            <View style={styles.collapsibleLabelContainer}>
              <Text
                style={{
                  color: isTrackersPath ? colors.primary : colors.text,
                  fontSize: labelSize,
                  fontWeight: isTrackersPath ? "bold" : "normal",
                }}
              >
                Trackers
              </Text>
              <Feather
                name={trackersOpen ? "chevron-down" : "chevron-right"}
                size={iconSize}
                color={isTrackersPath ? colors.primary : colors.text}
                style={styles.chevron}
              />
            </View>
          )}
          icon={() => (
            <IconSymbol
              name="chart.line.uptrend.xyaxis"
              size={iconSize}
              color={isTrackersPath ? colors.primary : colors.text}
            />
          )}
          onPress={() => {
            setTrackersOpen(!trackersOpen);
            setTimersOpen(false);
            setWorkoutsOpen(false);
          }}
        />

        {trackersOpen && (
          <View
            style={[
              styles.collapsibleContent,
              { paddingLeft: isMobile ? 30 : 45 },
            ]}
          >
            <DrawerItem
              style={getSubItemStyle("/trackers")}
              label={() => (
                <Text style={getLabelStyle("/trackers")}>Overview</Text>
              )}
              onPress={() => {
                router.push("/trackers");
                props.navigation.closeDrawer();
              }}
            />
            <DrawerItem
              style={getSubItemStyle("/trackers/weight")}
              label={() => (
                <Text style={getLabelStyle("/trackers/weight")}>Weight</Text>
              )}
              onPress={() => {
                router.push("/trackers/weight");
                props.navigation.closeDrawer();
              }}
            />
            <DrawerItem
              style={getSubItemStyle("/trackers/meals")}
              label={() => (
                <Text style={getLabelStyle("/trackers/meals")}>Meals</Text>
              )}
              onPress={() => {
                router.push("/trackers/meals");
                props.navigation.closeDrawer();
              }}
            />
          </View>
        )}

        {/* Section Separator */}
        <View style={[styles.sectionSeparator, { backgroundColor: colors.border }]} />

        <DrawerItem
          style={getItemStyle("/profile")}
          label={() => <Text style={getLabelStyle("/profile")}>Profile</Text>}
          icon={() => (
            <IconSymbol
              name="person.circle"
              size={iconSize}
              color={pathname === "/profile" ? colors.primary : colors.text}
            />
          )}
          onPress={() => {
            router.push("/profile");
            setTimersOpen(false);
            setWorkoutsOpen(false);
            setTrackersOpen(false);
            props.navigation.closeDrawer();
          }}
        />
      </DrawerContentScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
  },
  drawerHeader: {
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    paddingBottom: 20,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerContent: {
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 12,
    color: "gold",
  },
  headerDivider: {
    width: "80%",
    height: 1,
    opacity: 0.3,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 20,
  },
  sectionSeparator: {
    height: 1,
    marginHorizontal: 20,
    marginVertical: 12,
    opacity: 0.2,
  },
  collapsibleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontWeight: "500",
  },
  collapsibleContent: {
    paddingTop: 8,
    paddingBottom: 4,
  },
  collapsibleLabelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingRight: 8,
  },
  chevron: {
    marginLeft: "auto",
    opacity: 0.7,
  },
});
