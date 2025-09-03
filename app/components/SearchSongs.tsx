import { useEffect, useRef, useState } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Pressable, StyleSheet, View, Animated, Dimensions, TextInput } from 'react-native';
interface SearchSongsProps {
    isOpenSearchModal: boolean;
    setIsOpenSearchModal: (isOpenSearchModal: boolean) => void
}
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export const SearchSongs = ({ isOpenSearchModal, setIsOpenSearchModal }: SearchSongsProps) => {
    const translateX = useRef(new Animated.Value(SCREEN_WIDTH)).current
    const [query, setQuery] = useState<string>('')

    useEffect(() => {
        Animated.timing(translateX, {
            toValue: isOpenSearchModal ? 0 : SCREEN_WIDTH,
            duration: 200,
            useNativeDriver: true
        }).start()
    }, [isOpenSearchModal])

    return (
        <Animated.View style={[styles.container,
        { transform: [{ translateX }] }
        ]} >
            <View style={styles.topContainer}>
                <Pressable onPress={() => setIsOpenSearchModal(false)}>
                    <AntDesign name="arrowleft" size={32} color="black" />
                </Pressable>
                <TextInput value={query} onChangeText={setQuery} style={styles.input} placeholder='Search...' />
            </View>
        </Animated.View>
    )
}
const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: 'white',
        zIndex: 999,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        padding: 20
    },
    input: {
        flex: 1,
        height: 40,
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#333',
        marginLeft: 10,
    },
    topContainer: {
        display: 'flex',
        flexDirection: "row",
        alignItems: 'center',

        marginTop: 20
    }
})