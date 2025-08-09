import { Drawer } from "expo-router/drawer";
import React from "react";

import { CustomDrawerContent } from "@/components/CustomDrawerContent";
import { CustomHeader } from "@/components/CustomHeader";
import { useThemeColors } from "@/hooks/useTheme";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";

function DrawerNavigator() {
  const colors = useThemeColors();
  const { isMobile } = useResponsiveStyles();

  const labelSize = isMobile ? 16 : 20;
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerType: "front",
        header: () => <CustomHeader />,
        headerShown: true,
        drawerActiveTintColor: colors.primary,
        drawerLabelStyle: {
          fontSize: labelSize,
          fontWeight: "500",
        },
        drawerStyle: {
          backgroundColor: colors.background,
          width: isMobile ? '85%' : 320,
        },
        overlayColor: "rgba(0, 0, 0, 0.6)",
        drawerPosition: 'left',
        swipeEnabled: true,
        swipeEdgeWidth: 50,
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
      <Drawer.Screen
        name="trackers"
        options={{
          title: "Trackers",
        }}
      />
    </Drawer>
  );
}

export default function DrawerLayout() {
  return <DrawerNavigator />;
}
