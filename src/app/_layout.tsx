import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/src/hooks/use-color-scheme";
import { useEffect, useState } from "react";
import { Text } from "react-native";
import { initializeDatabase } from "../database/db";
import { getCurrentUser } from "../database/models/userModel";
import { User } from "../database/types";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const pathname = usePathname();

  const [isDbReady, setIsDbReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Initialize database when app loads
    const setupDatabase = async () => {
      try {
        await initializeDatabase();
        // await dropAllTables();

        const existingUser = await getCurrentUser();

        if (
          (!existingUser || existingUser.onboarded === 0) &&
          pathname !== "/onboarding"
        ) {
          console.log("IS IT THIS");
          // redirect to onboarding page
          router.replace("/onboarding");
        } else {
          setUser(existingUser);
        }
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
