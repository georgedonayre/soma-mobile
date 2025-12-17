import { User } from "@/src/database/types";
import { Link } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const [user, setUser] = useState<User | null>(null);
  // Load data when component mounts
  // useEffect(() => {
  //   const loadData = async () => {
  //     const currentUser = await getCurrentUser();
  //     setUser(currentUser);
  //   };

  //   loadData();
  // }, []);

  return (
    <>
      <View>
        <Link href={"/modal"} style={styles.modalStyles}>
          Helloooo, {user ? user.name : "Guest"} TIte
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  modalStyles: {
    color: "white",
  },
});
