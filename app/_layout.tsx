import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import "react-native-reanimated";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import FlashMessage from "react-native-flash-message";

import { UserProvider } from "@/context/UserContext";
import { AuthProvider } from "@/context/AuthContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { GeoLocationProvider } from "@/context/GeoLocationContext";
import { PushNotificationsProvider } from "@/context/PushNotificationsContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <PushNotificationsProvider>
      <UserProvider>
        <AuthProvider>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <GeoLocationProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="chat/[id]"
                  options={{
                    headerTransparent: true,
                    headerBackVisible: true,
                    headerTitle: "",
                    headerBackTitle: "Назад",
                    headerShown: true,
                  }}
                />
                <Stack.Screen
                  name="user/[id]"
                  options={{
                    headerTransparent: true,
                    headerBackVisible: true,
                    headerTitle: "",
                    headerBackTitle: "Назад",
                    headerShown: true,
                  }}
                />
                <Stack.Screen
                  name="accident/[id]"
                  options={{
                    headerTransparent: true,
                    headerBackVisible: true,
                    headerTitle: "",
                    headerBackTitle: "Назад",
                    headerShown: true,
                  }}
                />
                <Stack.Screen name="+not-found" />
              </Stack>
            </GeoLocationProvider>
          </ThemeProvider>
          <StatusBar style="auto" />
        </AuthProvider>
      </UserProvider>
      <FlashMessage position="top" />
    </PushNotificationsProvider>
  );
}
