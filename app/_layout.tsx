import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { SafeAreaView, StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { OrientationProvider } from "../hooks/useOrientation";

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <OrientationProvider>
        <ThemeProvider value={DarkTheme}>
          <StatusBar
            backgroundColor="black" // for Android
            barStyle="light-content" // for iOS
            translucent={false}
          />
          <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
            <Stack>
              <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
          </SafeAreaView>
        </ThemeProvider>
      </OrientationProvider>
    </GestureHandlerRootView>
  );
}
