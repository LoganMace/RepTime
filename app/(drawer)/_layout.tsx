import { Drawer } from "expo-router/drawer";
import React from "react";

import { CustomDrawerContent } from "@/components/CustomDrawerContent";
import { CustomHeader } from "@/components/CustomHeader";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";

function DrawerNavigator() {
  const colorScheme = useColorScheme();
  const { isMobile } = useResponsiveStyles();

  const labelSize = isMobile ? 16 : 20;
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerType: "front",
        header: () => <CustomHeader />,
        headerShown: true,
        drawerActiveTintColor: Colors[colorScheme ?? "light"].tint,
        drawerLabelStyle: {
          fontSize: labelSize,
        },
        drawerStyle: {
          backgroundColor: Colors[colorScheme ?? "dark"].background,
        },
        overlayColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Drawer.Screen
        name="timers"
        options={{
          title: "Timers",
        }}
      />
      <Drawer.Screen
        name="workouts"
        options={{
          title: "Workouts",
        }}
      />
    </Drawer>
  );
}

export default function DrawerLayout() {
  return <DrawerNavigator />;
}
