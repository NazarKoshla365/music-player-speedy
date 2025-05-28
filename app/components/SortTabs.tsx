import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export const SortTabs = () => {
  const sortTabs = [
    { name: "songs", label: "Songs" },
    { name: "favorites", label: "Favorites" },
    { name: "playlists", label: "Playlists" },
    { name: "albums", label: "Albums" },
    { name: "artists", label: "Artists" },
  ];

  const activeTab = "songs";

  return (
    <View style={styles.container}>
      {sortTabs.map((tab) => {
        const isActive = tab.name === activeTab;

        return (
          <TouchableOpacity
            key={tab.name}
            style={[
              styles.tab,
              isActive ? styles.activeTab : styles.inactiveTab,
            ]}
          >
            <Text style={isActive ? styles.activeText : styles.inactiveText}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  activeTab: {
    backgroundColor: "#000",
  },
  inactiveTab: {
    backgroundColor: "#e5e5e5",
  },
  activeText: {
    color: "#fff",
    fontSize: 14,
  },
  inactiveText: {
    color: "#000",
    fontSize: 14,
  },
});
