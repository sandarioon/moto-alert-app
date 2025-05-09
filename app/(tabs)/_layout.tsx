import { Tabs } from "expo-router";
import { Platform } from "react-native";
import React, { useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import { Colors } from "@/constants/Colors";
import { HapticTab } from "@/components/HapticTab";
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
            backgroundColor: "#fff",
            opacity: 100,
            // Use a transparent background on iOS to show the blur effect
            // position: "absolute",
          },
          android: {},
          default: {
            backgroundColor: "#fff",
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        initialParams={{ tabId }}
        options={{
          title: "Главная",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chats"
        initialParams={{ tabId }}
        options={{
          title: "Чаты",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="book" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        initialParams={{ tabId }}
        options={{
          title: "Карта",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="map-marker" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        initialParams={{ tabId }}
        options={{
          title: "Профиль",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
