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
    const setupApp = async () => {
      try {
        // 1️⃣ Initialize DB
        await initializeDatabase();

        // 2️⃣ Load user
        const existingUser = await getCurrentUser();

        // 3️⃣ Onboarding redirect
        if (!existingUser || existingUser.onboarded === 0) {
          router.replace("/onboarding"); // redirect if not onboarded
        } else {
          setUser(existingUser); // otherwise, set user
        }

        // 4️⃣ Mark DB ready
        setIsDbReady(true);
      } catch (err) {
        console.error("Failed to initialize app:", err);
      }
    };

    setupApp();
  }, [router]);

  return (
    <AppContext.Provider value={{ isDbReady, user }}>
      {children}
    </AppContext.Provider>
  );
};
