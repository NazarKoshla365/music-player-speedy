import { SafeAreaView, StyleSheet, Image, View, Pressable } from "react-native";
import { SortTabs } from "./SortTabs";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { InterfacePlayer } from "./InterfacePlayer";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useEffect, useState } from "react";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import { SearchSongs } from "./SearchSongs";


export const App = () => {
  const [isOpenSearchModal, setIsOpenSearchModal] = useState<boolean>(false)
  useEffect(() => {
    Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      playsInSilentModeIOS: false,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      shouldDuckAndroid: true,
    })
  }, [])




  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
        <View style={styles.topContainer}>
          <Image source={require('@/assets/images/speedy-logo.png')} style={styles.image} resizeMode="cover"></Image>
          <Pressable onPress={() => setIsOpenSearchModal(true)} style={styles.searchBtn}>
            <AntDesign name="search1" size={26} color="black" />
           
          </Pressable>
        </View>
        <SortTabs />
        <InterfacePlayer />
        <SearchSongs isOpenSearchModal={isOpenSearchModal} setIsOpenSearchModal={setIsOpenSearchModal} />
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
    width: 170,
    height: 40,
  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
  },
  topContainer: {
    display: "flex",
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'space-between',
    marginTop: 24
  },
  searchBtn: {
    marginRight: 30
  }
});
