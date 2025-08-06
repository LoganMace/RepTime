import { Feather } from "@expo/vector-icons";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { usePathname, useRouter } from "expo-router";
import { useState } from "react";
import { StyleProp, StyleSheet, Text, TextStyle, View } from "react-native";

import { useThemeColors } from "@/hooks/useTheme";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
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
      borderRadius: 10,
      marginHorizontal: 10,
      marginBottom: 5,
    };
  };

  const getSubItemStyle = (path: string) => {
    const isActive = pathname === path;
    return {
      backgroundColor: isActive ? "rgba(255, 215, 0, 0.1)" : "transparent",
      borderRadius: 8,
      marginHorizontal: 10,
      marginBottom: 2,
    };
  };

  const isTimersPath = pathname.startsWith("/timers");
  const isWorkoutsPath = pathname.startsWith("/workouts");
  const isTrackersPath = pathname.startsWith("/trackers");

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop: 20 }}
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
      </DrawerContentScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
  collapsibleContent: {},
  collapsibleLabelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  chevron: {
    marginLeft: "auto",
  },
});
