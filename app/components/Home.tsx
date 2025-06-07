import { SafeAreaView, Text, StyleSheet, Image } from "react-native";
import { SortTabs } from "./SortTabs";
import { InterfacePlayer } from "./InterfacePlayer";
import { useEffect } from "react";
import { Audio,InterruptionModeAndroid,InterruptionModeIOS } from "expo-av";


useEffect(() => {
  (async () => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      playsInSilentModeIOS: true,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,

    })
  })()

}, [])

export const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('@/assets/images/speedy-logo.png')} style={styles.image} resizeMode="cover"></Image>
      <SortTabs />
      <InterfacePlayer />
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
    marginTop: 20,
    width: 200,
    height: 60,


  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
  },
});
