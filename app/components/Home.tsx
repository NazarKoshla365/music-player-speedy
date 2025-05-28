import { SafeAreaView, Text, StyleSheet, Image } from "react-native";
import { SortTabs } from "./SortTabs";

export const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('@/assets/images/speedy-logo.png')} style={styles.image} resizeMode="cover"></Image>
      {/* <Text style={styles.heading}>Hello Man</Text> */}
      <SortTabs />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 20,
    paddingBottom: 20,

  },
   image: {
    marginTop:20,
    width:200,
    height:60,
    

  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
  },
});
