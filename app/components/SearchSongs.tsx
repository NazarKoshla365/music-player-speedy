import { useEffect, useRef, useState, useCallback } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Pressable, StyleSheet, View, Animated, Dimensions, TextInput, FlatList, Text, ListRenderItem } from 'react-native';
import { usePlayerStore } from '../store/playerStore';
import { SongItem } from './SongItem';
import { useAudioControls } from '../hooks/useAudioControls';
import * as MediaLibrary from 'expo-media-library';
import { SearchSongsTabs } from './SearchSongsTabs';



interface SearchSongsProps {
    isOpenSearchModal: boolean;
    setIsOpenSearchModal: (isOpenSearchModal: boolean) => void
}
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export const SearchSongs = ({ isOpenSearchModal, setIsOpenSearchModal }: SearchSongsProps) => {
    const { PlaySong } = useAudioControls()
    const [filteredSongs, setFilteredSongs] = useState<any[]>([])
    const translateX = useRef(new Animated.Value(SCREEN_WIDTH)).current
    const [query, setQuery] = useState<string>('')
    const { songs, activeSongData } = usePlayerStore()
    useEffect(() => {
        Animated.timing(translateX, {
            toValue: isOpenSearchModal ? 0 : SCREEN_WIDTH,
            duration: 200,
            useNativeDriver: true
        }).start()
    }, [isOpenSearchModal])
    useEffect(() => {
        if (!isOpenSearchModal) {
            setQuery('')
            setFilteredSongs([])
        }
    }, [isOpenSearchModal])


    const searchSong = (text: string) => {
        setQuery(text)
        const filtered = songs.filter(song => {
            return song.filename.toLowerCase().includes(text.toLowerCase())
        })
        setFilteredSongs(filtered)

        console.log(filtered)
    }
    const renderItem: ListRenderItem<MediaLibrary.Asset> = useCallback(({ item }) => (
        <SongItem item={item} isActive={item.id === activeSongData?.id} onPress={PlaySong} />
    ), [activeSongData?.id, PlaySong])

    return (
        <Animated.View style={[styles.container,
        { transform: [{ translateX }] }
        ]} >
            <View style={styles.topContainer}>
                <Pressable onPress={() => setIsOpenSearchModal(false)}>
                    <AntDesign name="arrowleft" size={32} color="black" />
                </Pressable>
                <View style={styles.inputContainer}>
                    <AntDesign name="search1" size={26} color="#555" />
                    <TextInput value={query} onChangeText={searchSong} style={styles.input} placeholder='Search...' />
                </View>
            </View>
            <SearchSongsTabs />
            <FlatList
                style={styles.flatList}
                renderItem={renderItem}
                ListEmptyComponent={
                        <Text style={styles.titleSearch}>No recent searches</Text>
                }
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                data={filteredSongs}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                windowSize={5}
                removeClippedSubviews={true}
            />
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
    inputContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        height: 46,
        paddingHorizontal: 16,
        marginLeft: 16,
        flex: 1,
    },
    input: {
        fontSize: 16,
        color: '#333',
        marginLeft: 6,
    },
    topContainer: {
        display: 'flex',
        flexDirection: "row",
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 16
    },
    titleSearch: {
        fontSize: 22,
        textAlign: 'center',
        marginTop:140
    },
    flatList:{
        marginTop:20,
    }
})