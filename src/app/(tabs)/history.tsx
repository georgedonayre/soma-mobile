import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function HistoryScreen() {
  return (
    <>
      <View>
        <Link href={"/modal"} style={styles.modalStyles}>
          Here goes the chart
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
