import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, useWindowDimensions } from "react-native";
import * as MediaLibrary from 'expo-media-library';
import { TabView, SceneMap } from 'react-native-tab-view'

import { Songs } from "./Songs";
import { Playlists } from "./Playlists";
import { Favorites } from "./Favorites";
import { Albums } from "./Albums";
import { Artists } from "./Artists";

export const SortTabs = () => {
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
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
  console.log("Активна вкладка:", index);
  console.log("Дозвіл на медіатеку:", hasPermission);

  const routes = [
    { key: "songs", title: "Songs" },
    { key: "favorites", title: "Favorites" },
    { key: "playlists", title: "Playlists" },
    { key: "albums", title: "Albums" },
    { key: "artists", title: "Artists" },
  ];
  const renderScene = SceneMap({
    songs: Songs,
    favorites: Favorites,
    playlists: Playlists,
    albums: Albums,
    artists: Artists,
  })

  const handleTabPress = (tabKey: string) => {
    const tabIndex = routes.findIndex(route => route.key === tabKey);
    if (tabIndex !== -1) {
      setIndex(tabIndex);
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.wrapper}>
        <ScrollView horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.container}>
          {routes.map((tab, i) => {
            const isActive = i === index;

            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tab, isActive ? styles.activeTab : styles.inactiveTab]}
                onPress={() => handleTabPress(tab.key)}
              >
                <Text style={isActive ? styles.activeText : styles.inactiveText}>{tab.title}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View >
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={() => null} // ❌ приховуємо стандартний таббар
      />
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
    fontFamily: "Montserrat_600SemiBold",
  },
  inactiveText: {
    color: "#000",
    fontSize: 18,
    fontFamily: "Montserrat_400Regular",
    

  },
});
