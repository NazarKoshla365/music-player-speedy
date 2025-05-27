import { Tabs } from "expo-router";
import { useRouter, useSegments } from "expo-router";
import { View, TouchableOpacity } from "react-native";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import "@/global.css"
import { JSX } from "react";



interface Tab {
  name: string;
  icon: (isActive: boolean) => JSX.Element;
}

const tabs: Tab[] = [
  { name: "index", icon: (isActive) => <FontAwesome5 name="music" size={28} color={isActive ? "black" : "gray"} /> },
  { name: "favorite", icon: (isActive) => <MaterialIcons name={isActive ? 'favorite' : 'favorite-border'} size={28} color={isActive ? "black" : "gray"} /> },
  { name: "songs", icon: (isActive) => <MaterialCommunityIcons name={isActive ? 'playlist-music' : 'playlist-music-outline'} size={28} color={isActive ? "black" : "gray"} /> },
  { name: "settings", icon: (isActive) => <Ionicons name={isActive ? 'settings-sharp' : 'settings-outline'} size={28} color={isActive ? "black" : "gray"} /> },
]

type TabName = typeof tabs[number]["name"];

const CustomTabBar = () => {
  const router = useRouter();
  const segments = useSegments() as string[];

  const pushRoute = (tabName: TabName) => {
    if (tabName === "index") {
      router.push("/"); // головна сторінка
    } else if (tabName === "favorite") {
      router.push("/favorite");
    } else if (tabName === "songs") {
      router.push("/songs");
    }
    else if (tabName === "settings") {
      router.push("/settings");
    }
  };

  return (
    <View className="flex-row items-center justify-center p-2 bg-gray-200 space-x-8" >
      {tabs.map((tab) => {
        const current = segments[0] ?? "index";
        const isActive = current === tab.name;
        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => pushRoute(tab.name)}
            className="py-2 flex-1 items-center justify-center"
               style={{ width: 60 }}
          >
            {tab.icon(isActive)}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { display: "none" },
        headerShown: false,// ховаємо стандартний таб-бар
      }}
      tabBar={(props) => <CustomTabBar />}
    />
  );
}
