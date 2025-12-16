import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/src/hooks/use-color-scheme";
import { useEffect, useState } from "react";
import { Text } from "react-native";
import { initializeDatabase } from "../database/db";
import { User } from "../database/types";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [isDbReady, setIsDbReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Initialize database when app loads
    const setupDatabase = async () => {
      try {
        await initializeDatabase();

        setIsDbReady(true);
      } catch (error) {
        console.error("Failed to setup database:", error);
      }
    };

    setupDatabase();
  }, []);

  if (!isDbReady) {
    return <Text>Loading...</Text>; // Or your loading screen
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
