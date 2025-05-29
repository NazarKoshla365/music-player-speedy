
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Audio } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useState } from "react";
import { Button, FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
interface SongData {
    id: string;
    title: string;
    artist: string;
    duration: string;
    uri: string;
}

function formatTitle(filename: string) {
    if (filename) {

        const cleaned = filename
            .replace(/_/g, ' ')
            .replace(/\.(mp3|wav|m4a)$/i, '')
            .replace(/\s*\(.*?\)/g, '')
            .replace(/\s*-\s*/g, ' - ')
            .replace(/ +/g, ' ')
            .trim();

        const parts = cleaned.split(' - ');
        if (parts.length === 2) return parts[1];
        return cleaned;
    }
    return "Unknown Title";
}
function formatArtist(filename: string) {
    if (filename) {
        const cleaned = filename
            .replace(/_/g, ' ')
            .replace(/\.(mp3|wav|m4a)$/i, '')
            .replace(/\s*\(.*?\)/g, '')
            .replace(/\s*-\s*/g, ' - ')
            .replace(/ +/g, ' ')
            .trim();

        const parts = cleaned.split(' - ');
        if (parts.length === 2) return parts[0];
        return "Unknown Artist";
    }
    return "Unknown Artist";
}

function calculateTime(duration: number) {
    const minutes = Math.floor(duration / 60)
    const seconds = Math.floor(duration % 60)
    const time = `${minutes}:${seconds.toString().padStart(2, '0')}`
    return time
}


export const Songs = () => {
    const [sound, setSound] = useState<Audio.Sound | null>(null)

    const [songs, setSongs] = useState<MediaLibrary.Asset[]>([])
    const [songsCount, setSongsCount] = useState<number>(0)
    const [activeSongData, setActiveSongData] = useState<SongData | null>(null)
    const [isPlay, setIsPlay] = useState<boolean>(true)

    async function PlaySong(song: MediaLibrary.Asset) {

        if (sound) {
            await sound.unloadAsync()
        }

        const { sound: newSound } = await Audio.Sound.createAsync(
            { uri: song.uri },
            { shouldPlay: true }
        )
        setSound(newSound)

        setActiveSongData({
            id: song.id,
            title: formatTitle(song.filename),
            artist: formatArtist(song.filename),
            duration: calculateTime(song.duration),
            uri: song.uri
        })
        console.log(activeSongData)

    }
    async function togglePlayBack() {
        if (!sound) return
        const status = await sound.getStatusAsync()
        console.log(status)
        if (status.isLoaded) {
            if (status.isPlaying) {
                await sound.pauseAsync()
                setIsPlay(false)
            } else {
                await sound.playAsync()
                setIsPlay(true)
            }


        }
    }
    useEffect(() => {
        (async () => {
            const media = await MediaLibrary.getAssetsAsync({
                mediaType: 'audio',
                first: 100,
                sortBy: [['creationTime', false]],
            });
            const allMp3s = media.assets.filter(asset =>
                asset.filename.toLowerCase().endsWith('.mp3')
            );

            setSongs(allMp3s)
            setSongsCount(allMp3s.length)
        })()
    }, [])
    console.log(songs)
    return (
        <View style={styles.container}>
            <View style={styles.topView}>
                <Text style={styles.topViewText}>{`All songs ${songsCount}`}</Text>
                <Button title="Sort button"></Button>
            </View>
            <FlatList
                style={styles.songList}
                data={songs}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (

                    <Pressable onPress={() => PlaySong(item)} >
                        <View style={item.id === activeSongData?.id ? styles.activeItem : styles.item}  >
                            <View style={styles.itemDesc}>
                                <Image source={require('@/assets/images/cover.jpg')} style={styles.coverImage} resizeMode="cover" />
                                <View style={styles.itemTextView}>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>{formatTitle(item.filename)}</Text>
                                    <Text style={styles.artist}>{formatArtist(item.filename)}</Text>
                                </View>
                            </View>
                            <Text style={styles.time}>{calculateTime(item.duration)}</Text>
                        </View>
                    </Pressable>
                )}
            />

            <View style={styles.itemPlay}>
                <View style={styles.itemPlayDesc}>
                    <Image source={require('@/assets/images/cover.jpg')} style={styles.coverImage} resizeMode="cover" />
                    <View style={styles.itemTextView}>
                        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>song</Text>
                        <Text style={styles.artist}>ok</Text>
                    </View>
                </View>

                <View style={styles.playViewBtns}>
                    <Pressable style={styles.btnPlay} onPress={togglePlayBack}>
                        {isPlay ? <FontAwesome5 name="pause" size={24} color="black" /> : <FontAwesome5 name="play" size={24} color="black" />}

                    </Pressable>
                    <Pressable>
                        <FontAwesome5 name="step-forward" size={24} color="black" />
                    </Pressable>
                </View>
            </View>

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
        fontFamily: 'Montserrat_500Medium',
        color: '#333',
    },
    songList: {
        flex: 1,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 10,
    },
    activeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 16,

        backgroundColor: '#e0e0e0'
    },
    itemDesc: {
        flexDirection: "row",
        alignItems: 'center',
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
        fontFamily: 'Montserrat_600SemiBol',
    },
    artist: {
        fontSize: 14,
        fontFamily: 'Montserrat_400Regular',
        color: '#666',
        marginTop: 4,
    },
    time: {
        fontSize: 13,
        fontFamily: 'Montserrat_300Light',
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
