import { Text, View } from "react-native"
import { SortTabs } from "./SortTabs"

export const App = () => {
    return (
        <View className="flex-1 bg-[#fff] p-2" >
            <Text className="text-3xl">Hello Man</Text>
            <SortTabs/>
        </View>
    )
}