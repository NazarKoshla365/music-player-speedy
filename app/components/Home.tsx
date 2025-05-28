import { SafeAreaView, Text, StyleSheet } from "react-native";
import { SortTabs } from "./SortTabs";

export const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Hello Man</Text>
      <SortTabs />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  
  },
  heading: {
    fontSize: 32,
    marginTop: 20,
    marginBottom: 20,
    fontWeight: "bold",
  },
});
