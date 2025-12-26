import { useRouter } from "expo-router";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { initializeDatabase } from "../database/db";
import { getCurrentUser } from "../database/models/userModel";
import { User } from "../database/types";

type AppContextType = {
  isDbReady: boolean;
  user: User | null;
  refreshUser: () => Promise<void>; // ⭐ NEW
};

const AppContext = createContext<AppContextType>({
  isDbReady: false,
  user: null,
  refreshUser: async () => {},
});

export const useAppContext = () => useContext(AppContext);

type Props = { children: ReactNode };

export const AppProvider = ({ children }: Props) => {
  const [isDbReady, setIsDbReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // ⭐ NEW: Reusable function to load user
  const loadUser = useCallback(async () => {
    console.log("🔄 AppProvider: Loading user...");
    const existingUser = await getCurrentUser();
    console.log("🔄 AppProvider: User loaded:", existingUser);
    setUser(existingUser);
    return existingUser;
  }, []);

  // ⭐ NEW: Public refresh method
  const refreshUser = useCallback(async () => {
    console.log("🔄 AppProvider: Refresh user requested");
    await loadUser();
  }, [loadUser]);

  useEffect(() => {
    console.log("🟢 AppProvider: useEffect triggered");

    const setupApp = async () => {
      try {
        console.log("🟢 AppProvider: Starting setup...");
        await initializeDatabase();
        console.log("🟢 AppProvider: DB initialized");

        const existingUser = await loadUser();

        // Only redirect if no user OR user not onboarded
        if (!existingUser || existingUser.onboarded === 0) {
          console.log("🟢 AppProvider: Redirecting to onboarding");
          router.replace("/onboarding");
        }

        setIsDbReady(true);
        console.log("🟢 AppProvider: Setup complete");
      } catch (err) {
        console.error("❌ AppProvider: Setup failed:", err);
      }
    };

    setupApp();
  }, []);

  return (
    <AppContext.Provider value={{ isDbReady, user, refreshUser }}>
      {children}
    </AppContext.Provider>
  );
};
