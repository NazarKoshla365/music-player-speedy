import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as MediaLibrary from 'expo-media-library';
import { useCallback, useEffect, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, View, ListRenderItem, NativeModules } from "react-native";
import { usePlayerStore } from "@/app/store/playerStore";
import { useAudioControls } from '@/app/hooks/useAudioControls';
import { SongItem } from '../SongItem';
import { formatArtist, formatTitle } from '@/app/utils/audioUtils';


interface SongsProps {
    hasPermission: boolean | null
}
export const Songs = ({ hasPermission }: SongsProps) => {
    const { songs, setSongs, isPlay, activeSongData, itemPlay, setIsOpenModal } = usePlayerStore()
    const { togglePlayBack, PlayNextSong, PlaySong } = useAudioControls()
    const [songsCount, setSongsCount] = useState<number>(0)
    const [sortModal, setSortModal] = useState<boolean>(false)
    const [sortMethod, setSortMethod] = useState<string>('Data')
    const { MusicParser } = NativeModules

    const fetchAllSongsMetadata = async (songs: MediaLibrary.Asset[]) => {
        const enrichedSongs = await Promise.all(
            songs.map(async (asset) => {
                try {
                    const metadata = await MusicParser.getMetadata(asset.uri)
                    return {
                        id: asset.id,
                        filename: asset.filename,
                        uri:asset.uri,
                        modificationTime: asset.modificationTime,
                        duration: asset.duration,
                        ...metadata,
                    }
                }
                catch (err) {
                    console.error("Failed to fetch metadata for", asset.filename, err)
                    return {
                        id: asset.id,
                        filename: asset.filename,
                        uri: asset.uri,
                        modificationTime: asset.modificationTime,
                        duration: asset.duration
                    }
                }
            })
        )
        setSongs(enrichedSongs)
    }

    useEffect(() => {
        if (!hasPermission) return;
        (async () => {
            const media = await MediaLibrary.getAssetsAsync({
                mediaType: 'audio',
                first: 100,
                sortBy: [['creationTime', false]],
            });
            const allMp3s = media.assets.filter(asset =>
                asset.filename.toLowerCase().endsWith('.mp3')
            );
            const filteredMp3s = allMp3s.filter(asset =>
                !/\(\d+\)\.mp3$/i.test(asset.filename)
            )
            setSongsCount(filteredMp3s.length)
            await fetchAllSongsMetadata(filteredMp3s)


        })()
    }, [hasPermission])
    if (hasPermission === false) {
        return <Text>No access to media library. Please enable permissions in settings.</Text>;
    }


    const renderItem: ListRenderItem<any> = useCallback(({ item }) => (
        <SongItem item={item} isActive={item.id === activeSongData?.id} onPress={PlaySong} />
    ), [activeSongData?.id, PlaySong])

    const handleSortModal = () => {
        setSortModal(true)
    }
    const handleSortButton = (sortBy: string) => {
        setSortMethod(sortBy)
        setSortModal(false)

        const sortFunctions: Record<string, (a: typeof songs[0], b: typeof songs[0]) => number> = {
            Name: (a, b) => formatTitle(a.filename)
                .toLowerCase()
                .localeCompare(formatTitle(b.filename).toLowerCase()),
            Data: (a, b) => b.modificationTime - a.modificationTime,
            Artist: (a, b) => formatArtist(a.filename)
                .toLowerCase()
                .localeCompare(formatArtist(b.filename).toLowerCase()),
            Duration: (a, b) => a.duration - b.duration
        }

        const sortFn = sortFunctions[sortBy] || sortFunctions['Data']
        setSongs([...songs].sort(sortFn))
    }

    return (
        <View style={styles.container}>
            {sortModal && (
                <Pressable style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 50,
                    backgroundColor: 'transparent',
                }} onPress={() => setSortModal(false)}></Pressable>
            )}
            <View style={styles.topView}>
                <Text style={styles.topViewText}>{`All songs ${songsCount}`}</Text>
                <Pressable style={styles.sortBtn} onPress={handleSortModal}>
                    <Text style={{ marginRight: 4 }}>{sortMethod}</Text>
                    <View style={{ transform: [{ rotate: '180deg' }] }}>
                        <MaterialCommunityIcons name="sort" size={24} color="black" />
                    </View>
                </Pressable>
                {sortModal && (
                    <>
                        <View style={styles.sortModal}>
                            <Pressable onPress={() => handleSortButton('Name')} style={({ pressed }) => [styles.sortModalBtn, pressed && { ...styles.sortModalBtnPressed, borderTopRightRadius: 8, borderTopStartRadius: 8 }]}>
                                <Text style={styles.sortModalText}>By name</Text>
                            </Pressable>
                            <Pressable onPress={() => handleSortButton('Data')} style={({ pressed }) => [pressed && styles.sortModalBtnPressed, styles.sortModalBtn]}>
                                <Text style={styles.sortModalText}>By data</Text>
                            </Pressable>
                            <Pressable onPress={() => handleSortButton('Artist')} style={({ pressed }) => [styles.sortModalBtn, pressed && { ...styles.sortModalBtnPressed, borderBottomStartRadius: 8, borderBottomEndRadius: 8 }]}>
                                <Text style={styles.sortModalText}>By artist</Text>
                            </Pressable>
                            <Pressable onPress={() => handleSortButton('Duration')} style={({ pressed }) => [styles.sortModalBtn, pressed && { ...styles.sortModalBtnPressed, borderBottomStartRadius: 8, borderBottomEndRadius: 8 }]}>
                                <Text style={styles.sortModalText}>By duration</Text>
                            </Pressable>
                        </View>
                    </>
                )}
            </View>
            <FlatList
                renderItem={renderItem}
                ListEmptyComponent={<Text>No songs found</Text>}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                style={styles.songList}
                data={songs}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                windowSize={5}
                removeClippedSubviews={true}
            />
            {itemPlay && (
                <Pressable onPress={() => setIsOpenModal(true)}>
                    <View style={styles.itemPlay}>
                        <View style={styles.itemPlayDesc}>
                            <Image source={activeSongData?.cover ? { uri: `data:image/jpeg;base64,${activeSongData.cover}`} : require('@/assets/images/cover.jpg')} style={styles.coverImage} resizeMode="cover" />
                            <View style={styles.itemTextView}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>{activeSongData?.title}</Text>
                                <Text style={styles.artist}>{activeSongData?.artist}</Text>
                            </View>
                        </View>

                        <View style={styles.playViewBtns}>
                            <Pressable style={styles.btnPlay} onPress={togglePlayBack}>
                                {isPlay ? <FontAwesome5 name="pause" size={24} color="black" /> : <FontAwesome5 name="play" size={24} color="black" />}
                            </Pressable>
                            <Pressable onPress={PlayNextSong}>
                                <FontAwesome5 name="step-forward" size={24} color="black" />
                            </Pressable>
                        </View>
                    </View>
                </Pressable>

            )}
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topView: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 12,
        marginBottom: 14,
        height: 'auto',
        paddingHorizontal: 16,
        position: 'relative'
    },
    topViewText: {
        fontSize: 16,
        color: '#333',
    },
    sortBtn: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    sortModal: {
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: 'white',
        borderRadius: 8,
        position: 'absolute',
        top: 0,
        right: 16,
        zIndex: 100
    },
    sortModalBtn: {
        paddingVertical: 12,
        paddingHorizontal: 24
    },
    sortModalText: {
        fontSize: 16
    },
    sortModalBtnPressed: {
        backgroundColor: '#f0f0f0'
    },
    songList: {
        flex: 1,
    },
    coverImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
    },
    itemTextView: {
        maxWidth: 160,
    },

    title: {
        fontSize: 16,
        color: '#333',
    },
    artist: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    time: {
        fontSize: 13,
        color: '#666',
    },
    itemPlay: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        marginBottom: 20,
        paddingHorizontal: 10
    },
    itemPlayDesc: {
        flexDirection: "row",
        alignItems: 'center',
    },
    playViewBtns: {
        flexDirection: "row",
        alignItems: 'center',
        marginRight: 16,


    },
    btnPlay: {
        marginRight: 24

    }
});
