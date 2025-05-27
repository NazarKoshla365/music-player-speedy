import { Tabs } from "expo-router";
import { useRouter, useSegments } from "expo-router";
import { Text, View, TouchableOpacity } from "react-native";
import "@/global.css"

interface Tab {
  name: string;
  label: string;
}

interface Tab {
  name: string;
  label: string;
}

const tabs: Tab[] = [
  { name: "index", label: "Home" },
  { name: "favorite", label: "Favorite" },
  { name: "settings", label: "Settings" },
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
    } else if (tabName === "settings") {
      router.push("/settings");
    }
  };

  return (
    <View className="flex-row justify-around p-2 bg-gray-200">
      {tabs.map((tab) => {
        const isActive = segments.includes(tab.name);
        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => pushRoute(tab.name)}
            className={`py-2 border-b-2 ${isActive ? "border-blue-500" : "border-transparent"}`}
          >
            <Text className={isActive ? "text-blue-500" : "text-gray-500"}>
              {tab.label}
            </Text>
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
