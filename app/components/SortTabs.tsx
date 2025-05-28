import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView ,Alert} from "react-native";
import * as MediaLibrary from 'expo-media-library';

import { Songs } from "./Songs";
import { Playlists } from "./Playlists";
import { Favorites } from "./Favorites";
import { Albums } from "./Albums";
import { Artists } from "./Artists";

export const SortTabs = () => {
  const [activeTab, setActiveTab] = useState("songs")
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  useEffect(() => {
    (async () => {
       console.log("Запитуємо дозвіл на медіатеку...");
      const { status } = await MediaLibrary.requestPermissionsAsync();
        console.log("Статус дозволу:", status);
      setHasPermission(status === 'granted')
      if (status !== 'granted') {
        Alert.alert('Дозвіл потрібен', 'Щоб читати музику, потрібен доступ до медіатеки');
      }
    })()
  }, [])
  console.log("Активна вкладка:", activeTab);
  console.log("Дозвіл на медіатеку:", hasPermission);

  const sortTabs = [
    { name: "songs", label: "Songs" },
    { name: "favorites", label: "Favorites" },
    { name: "playlists", label: "Playlists" },
    { name: "albums", label: "Albums" },
    { name: "artists", label: "Artists" },
  ];




  return (


    <View>
      <View style={styles.wrapper}>
        <ScrollView horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.container}>{sortTabs.map((tab) => {
            const isActive = tab.name === activeTab;

            return (
              <TouchableOpacity
                key={tab.name}
                style={[
                  styles.tab,
                  isActive ? styles.activeTab : styles.inactiveTab,
                ]}
                onPress={() => setActiveTab(tab.name)}
              >
                <Text style={isActive ? styles.activeText : styles.inactiveText}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View >
      <View>
        {activeTab === "songs" && <Songs />}
        {activeTab === "favorites" && <Favorites />}
        {activeTab === "playlists" && <Playlists />}
        {activeTab === "albums" && <Albums />}
        {activeTab === "artists" && <Artists />}
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  wrapper: {
    marginTop: 20,
  },
  container: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginRight: 10
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 16,
    minHeight: 40,
  },
  activeTab: {
    backgroundColor: "#000",
  },
  inactiveTab: {
    backgroundColor: "#e5e5e5",

  },
  activeText: {
    color: "#fff",
    fontSize: 18,
  },
  inactiveText: {
    color: "#000",
    fontSize: 18,
  },
});
