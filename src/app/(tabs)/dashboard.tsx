import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function HomeScreen() {
  return (
    <>
      <View>
        <Link href={"/modal"} style={styles.modalStyles}>
          CLick me
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
