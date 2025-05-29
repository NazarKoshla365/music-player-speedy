import { App } from "./components/Home";
import { useCallback } from "react";
import { View } from "react-native";
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
export default function Index() {
  SplashScreen.preventAutoHideAsync();
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold
  });
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
  if (!fontsLoaded) return null

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <App />
    </View>
  )
}
