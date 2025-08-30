
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import * as MediaLibrary from 'expo-media-library';
import { useCallback, useEffect, useState } from "react";
import { Button, FlatList, Image, Pressable, StyleSheet, Text, View, ListRenderItem } from "react-native";
import { usePlayerStore } from "@/app/store/playerStore";
import { useAudioControls } from '@/app/hooks/useAudioControls';
import { SongItem } from '../SongItem';

interface SongsProps {
    hasPermission: boolean | null
}
export const Songs = ({ hasPermission }: SongsProps) => {
    const { songs, setSongs, isPlay, activeSongData, itemPlay, setIsOpenModal } = usePlayerStore()
    const { togglePlayBack, PlayNextSong, PlaySong } = useAudioControls()
    const [songsCount, setSongsCount] = useState<number>(0)


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
            setSongs(filteredMp3s)
            setSongsCount(filteredMp3s.length)
        })()
    }, [hasPermission])
    if (hasPermission === false) {
        return <Text>No access to media library. Please enable permissions in settings.</Text>;
    }
    console.log("---------------")

    const renderItem: ListRenderItem<MediaLibrary.Asset> = useCallback(({ item }) => (
        <SongItem item={item} isActive={item.id === activeSongData?.id} onPress={PlaySong} />
    ), [activeSongData?.id, PlaySong])
    return (
        <View style={styles.container}>
            <View style={styles.topView}>
                <Text style={styles.topViewText}>{`All songs ${songsCount}`}</Text>
                <Button title="Sort button"></Button>
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
                            <Image source={require('@/assets/images/cover.jpg')} style={styles.coverImage} resizeMode="cover" />
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
        padding: 16,
        flex: 1,
    },
    topView: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        height: 'auto',
    },
    topViewText: {
        fontSize: 16,

        color: '#333',
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
