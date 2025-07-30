import { Feather } from "@expo/vector-icons";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { usePathname, useRouter } from "expo-router";
import { useState } from "react";
import { StyleProp, StyleSheet, Text, TextStyle, View } from "react-native";

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { IconSymbol } from "./ui/IconSymbol";

export function CustomDrawerContent(props: any) {
  const router = useRouter();
  const pathname = usePathname();
  const colorScheme = useColorScheme();
  const { isMobile } = useResponsiveStyles();

  const [timersOpen, setTimersOpen] = useState(pathname.startsWith("/timers"));
  const [workoutsOpen, setWorkoutsOpen] = useState(
    pathname.startsWith("/workouts")
  );

  const colors = Colors[colorScheme ?? "light"];

  const iconSize = isMobile ? 24 : 28;
  const labelSize = isMobile ? 14 : 18;

  const getLabelStyle = (path: string): StyleProp<TextStyle> => {
    const isActive = pathname === path;
    return {
      color: isActive ? colors.tint : colors.text,
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
              color={pathname === "/" ? colors.tint : colors.text}
            />
          )}
          onPress={() => {
            router.push("/");
            setTimersOpen(false);
            setWorkoutsOpen(false);
          }}
        />

        <DrawerItem
          style={getItemStyle("/timers")}
          label={() => (
            <View style={styles.collapsibleLabelContainer}>
              <Text
                style={{
                  color: isTimersPath ? colors.tint : colors.text,
                  fontSize: labelSize,
                  fontWeight: isTimersPath ? "bold" : "normal",
                }}
              >
                Timers
              </Text>
              <Feather
                name={timersOpen ? "chevron-down" : "chevron-right"}
                size={iconSize}
                color={isTimersPath ? colors.tint : colors.text}
                style={styles.chevron}
              />
            </View>
          )}
          icon={() => (
            <IconSymbol
              name="timer"
              size={iconSize}
              color={isTimersPath ? colors.tint : colors.text}
            />
          )}
          onPress={() => {
            setTimersOpen(!timersOpen);
            setWorkoutsOpen(false);
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
                  color: isWorkoutsPath ? colors.tint : colors.text,
                  fontSize: labelSize,
                  fontWeight: isWorkoutsPath ? "bold" : "normal",
                }}
              >
                Workouts
              </Text>
              <Feather
                name={workoutsOpen ? "chevron-down" : "chevron-right"}
                size={iconSize}
                color={isWorkoutsPath ? colors.tint : colors.text}
                style={styles.chevron}
              />
            </View>
          )}
          icon={() => (
            <IconSymbol
              name="dumbbell"
              size={iconSize}
              color={isWorkoutsPath ? colors.tint : colors.text}
            />
          )}
          onPress={() => {
            setWorkoutsOpen(!workoutsOpen);
            setTimersOpen(false);
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
