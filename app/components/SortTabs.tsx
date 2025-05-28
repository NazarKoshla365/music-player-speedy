import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Songs } from "./Songs";
import { Playlists } from "./Playlists";
import { Favorites } from "./Favorites";
import { Albums } from "./Albums";
import { Artists } from "./Artists";

export const SortTabs = () => {
  const sortTabs = [
    { name: "songs", label: "Songs" },
    { name: "favorites", label: "Favorites" },
    { name: "playlists", label: "Playlists" },
    { name: "albums", label: "Albums" },
    { name: "artists", label: "Artists" },
  ];

  const [activeTab, setActiveTab] = useState("songs")

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
        {activeTab === "songs" && <Songs/> }
        {activeTab === "favorites" && <Favorites/>}
        {activeTab === "playlists" && <Playlists/>}
        {activeTab === "albums" && <Albums/>}
        {activeTab === "artists" && <Artists/>}
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
