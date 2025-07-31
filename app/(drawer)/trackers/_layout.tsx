import { Stack } from "expo-router";
import React from "react";

export default function TrackersLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Header is handled by the main drawer layout
      }}
    />
  );
}
