import {ScrollView,Text,View,StyleSheet, Pressable
} from "react-native";
import { useRef, useState } from "react";
export const SearchSongsTabs = () => {
    const scrollRef = useRef<ScrollView>(null)
    const [activeTab, setActiveTab] = useState("songs");
    const routes = [
        { key: "all", title: "All" },
        { key: "songs", title: "Songs" },
        { key: "albums", title: "Albums" },
        { key: "artists", title: "Artists" },
        { key: "playlists", title: "Playlists" },
    ];
    return (
        <View>
            <ScrollView style={styles.container} ref={scrollRef} horizontal
            showsHorizontalScrollIndicator={false}
        >
            {routes.map((tab) => {
                const isActive = tab.key === activeTab
                return (
                    <Pressable
                        key={tab.key}
                        style={[styles.tab, isActive ? styles.activeTab : styles.inactiveTab]}
                        onPress={() => setActiveTab(tab.key)}
                    >
                        <Text style={isActive ? styles.activeText : styles.inactiveText}>{tab.title}</Text>
                    </Pressable>
                );
            })}
        </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: "row",
        
    },
    tab: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 24,
        marginRight: 16,
        height: 38,
    },
    activeTab: {
        backgroundColor: "#000",
    },
    inactiveTab: {
        backgroundColor: "#e5e5e5",
    },
    activeText: {
        color: "#fff",
        fontSize: 16,
    },
    inactiveText: {
        color: "#000",
        fontSize: 16,
    },
})