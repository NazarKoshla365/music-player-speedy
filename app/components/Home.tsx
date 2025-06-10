import { SafeAreaView, StyleSheet, Image } from "react-native";
import { SortTabs } from "./SortTabs";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { InterfacePlayer } from "./InterfacePlayer";


export const App = () => {
  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
        <Image source={require('@/assets/images/speedy-logo.png')} style={styles.image} resizeMode="cover"></Image>
        <SortTabs />
        <InterfacePlayer/>
      </SafeAreaView>
    </GestureHandlerRootView>
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
    marginTop: 20,
    width: 200,
    height: 60,


  },

  heading: {
    fontSize: 32,
    fontWeight: "bold",
  },
});
