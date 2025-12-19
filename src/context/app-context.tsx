import { useRouter } from "expo-router";
import React, {
  createContext,
  ReactNode,
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
};

const AppContext = createContext<AppContextType>({
  isDbReady: false,
  user: null,
});

export const useAppContext = () => useContext(AppContext);

type Props = { children: ReactNode };

export const AppProvider = ({ children }: Props) => {
  const [isDbReady, setIsDbReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    console.log("🟢 AppProvider: useEffect triggered");

    const setupApp = async () => {
      try {
        console.log("🟢 AppProvider: Starting setup...");
        await initializeDatabase();
        console.log("🟢 AppProvider: DB initialized");

        const existingUser = await getCurrentUser();
        console.log("🟢 AppProvider: User loaded:", existingUser);

        if (!existingUser || existingUser.onboarded === 0) {
          console.log("🟢 AppProvider: Redirecting to onboarding");
          router.replace("/onboarding");
        } else {
          console.log("🟢 AppProvider: Setting user");
          setUser(existingUser);
        }

        setIsDbReady(true);
        console.log("🟢 AppProvider: Setup complete");
      } catch (err) {
        console.error("❌ AppProvider: Setup failed:", err);
      }
    };

    setupApp();
  }, []); // Make sure this is empty!

  return (
    <AppContext.Provider value={{ isDbReady, user }}>
      {children}
    </AppContext.Provider>
  );
};
