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

import Login from "@/screens/Login";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthContext, AuthProvider } from "@/context/AuthContext";
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
      <AuthProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <GeoLocationProvider>
            <AuthContext.Consumer>
              {(authContext) => {
                if (authContext && authContext.token) {
                  if (!authContext.token) {
                    return <Login />;
                  }

                  return (
                    <Stack>
                      <Stack.Screen
                        name="(tabs)"
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen name="+not-found" />
                    </Stack>
                  );
                } else {
                  return <Login />;
                }
              }}
            </AuthContext.Consumer>
          </GeoLocationProvider>
        </ThemeProvider>
        <StatusBar style="auto" />
      </AuthProvider>
      <FlashMessage position="top" />
    </PushNotificationsProvider>
  );
}
