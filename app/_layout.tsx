import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { SafeAreaView, StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { MocksProvider } from "../contexts/MocksContext";
import { useTheme } from "../hooks/useTheme";
import { OrientationProvider } from "../hooks/useOrientation";

function ThemedRootLayout() {
  const { colors } = useTheme();

  return (
    <ThemeProvider value={DarkTheme}>
      <StatusBar
        backgroundColor={colors.background}
        barStyle="light-content"
        translucent={false}
      />
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <Stack>
          <Stack.Screen
            name="(drawer)"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
      </SafeAreaView>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MocksProvider defaultUseMocks={true}>
        <OrientationProvider>
          <ThemedRootLayout />
        </OrientationProvider>
      </MocksProvider>
    </GestureHandlerRootView>
  );
}
