import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isMobile } = useResponsiveStyles();

  const iconSize = isMobile ? 28 : 32;
  const labelSize = isMobile ? 12 : 20;

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: "absolute",
            },
            default: {},
          }),
          tabBarLabelStyle: {
            fontSize: labelSize,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={iconSize} name="house.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="timers"
          options={{
            title: "Timers",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={iconSize} name="timer" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="workouts"
          options={{
            title: "Workouts",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={iconSize} name="dumbbell" color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
