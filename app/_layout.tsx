import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import "react-native-reanimated";
import React, { ReactNode, useEffect, useState } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import * as SplashScreen from "expo-splash-screen";

import Login from "@/screens/Login";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthContext, AuthProvider } from "@/context/AuthContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [locationErrMsg, setLocationErrMsg] = useState<string | null>(null);

  const getCurrentLocation = async () => {
    let { status } = await Location.getForegroundPermissionsAsync();
    console.log("location status", status);
    if (status !== "granted") {
      // Permission is not granted, ask for permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationErrMsg("Permission to access location was denied");
        return;
      }
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <LocationContext.Provider
      value={{ location, locationErrMsg, getCurrentLocation }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const LocationContext = React.createContext<{
  getCurrentLocation: () => Promise<void>;
  location: Location.LocationObject | null;
  locationErrMsg: string | null;
}>({
  getCurrentLocation: async () => {},
  location: null,
  locationErrMsg: null,
});

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
    <AuthProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <LocationProvider>
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
        </LocationProvider>
      </ThemeProvider>
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
