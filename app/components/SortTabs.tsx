import { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, useWindowDimensions } from "react-native";
import * as MediaLibrary from 'expo-media-library';
import { TabView, SceneMap } from 'react-native-tab-view'

import { Songs } from "./Tabs/Songs";
import { Playlists } from "./Tabs/Playlists";
import { Favorites } from "./Tabs/Favorites";
import { Albums } from "./Tabs/Albums";
import { Artists } from "./Tabs/Artists";


export const SortTabs = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const scrollRef = useRef<ScrollView>(null)

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      console.log("Status", status);
      setHasPermission(status === 'granted')
    })()
  }, [])

  const routes = [
    { key: "songs", title: "Songs" },
    { key: "favorites", title: "Favorites" },
    { key: "playlists", title: "Playlists" },
    { key: "albums", title: "Albums" },
    { key: "artists", title: "Artists" },
  ];
  const renderScene = SceneMap({
    songs: () => <Songs hasPermission={hasPermission} />,
    favorites: Favorites,
    playlists: Playlists,
    albums: Albums,
    artists: Artists,
  })

  const setActiveTab = (tabIndex: number) => {
    setIndex(tabIndex)
    scrollRef.current?.scrollTo({
      x: tabIndex * 100,
      animated: true
    })
  }
  const handleTabPress = (tabKey: string) => {
    const tabIndex = routes.findIndex(route => route.key === tabKey);
    if (tabIndex !== -1) {
      setActiveTab(tabIndex)
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.wrapper}>
        <ScrollView ref={scrollRef} horizontal
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
        onIndexChange={setActiveTab}
        initialLayout={{ width: layout.width }}
        renderTabBar={() => null}
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

  },
  inactiveText: {
    color: "#000",
    fontSize: 18,



  },
});
