import { Tabs } from "expo-router";
import React, { useState } from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      {/* <SideNav isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)} /> */}
      {/* <View style={{ position: "absolute", top: 30, left: 20, zIndex: 1 }}>
        <Icon
          name="menu"
          size={40}
          color={Colors[colorScheme ?? "light"].text}
          onPress={() => setDrawerOpen(!isDrawerOpen)}
        />
      </View> */}
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
            fontSize: 20,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={32} name="house.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="timers"
          options={{
            title: "Timers",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={32} name="timer" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="workouts"
          options={{
            title: "Workouts",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={32} name="dumbbell" color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
