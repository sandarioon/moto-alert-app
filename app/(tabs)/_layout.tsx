import { Tabs } from "expo-router";
import { Platform } from "react-native";
import React, { useState } from "react";

import { Colors } from "@/constants/Colors";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useColorScheme } from "@/hooks/useColorScheme";
import TabBarBackground from "@/components/ui/TabBarBackground";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [tabId, setTabId] = useState("index");

  const handleTabPress = (event: any) => {
    setTabId(event.target.split("-")[0]);
  };

  return (
    <Tabs
      screenListeners={{
        tabPress: handleTabPress,
      }}
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
      }}
    >
      <Tabs.Screen
        name="index"
        initialParams={{ tabId }}
        options={{
          title: "Главная",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        initialParams={{ tabId }}
        options={{
          title: "Карта",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="paperplane.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        initialParams={{ tabId }}
        options={{
          title: "Профиль",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
