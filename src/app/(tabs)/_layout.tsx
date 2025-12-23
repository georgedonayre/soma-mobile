// just like layout.tsx in nextjs, it applies to all sibling .tsx files.

import { Tabs } from "expo-router";
import React from "react";

import { FabMenu } from "@/src/components/fab-menu";
import { HapticTab } from "@/src/components/haptic-tab";
import { useColorScheme } from "@/src/hooks/use-color-scheme";
import { Colors } from "@/src/theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: true,
          tabBarButton: HapticTab,
        }}
      >
        <Tabs.Screen
          name="dashboard"
          options={{
            title: "Dashboard",
            tabBarIcon: ({ color }) => (
              <MaterialIcons
                name="dashboard-customize"
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="analytics"
          options={{
            title: "Analytics",
            tabBarIcon: ({ color }) => (
              <AntDesign name="line-chart" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
      <FabMenu />
    </GestureHandlerRootView>
  );
}
