
import { useEffect, useState } from "react"
import { View, Text, FlatList, Image, StyleSheet } from "react-native"
import * as MediaLibrary from 'expo-media-library';

function formatTitle(filename: string) {
    if (filename) {
        // Видаляємо розширення, підкреслення, зайві пробіли і дужки
        const cleaned = filename
            .replace(/_/g, ' ')
            .replace(/\.(mp3|wav|m4a)$/i, '')
            .replace(/\s*\(.*?\)/g, '')
            .replace(/\s*-\s*/g, ' - ')
            .replace(/ +/g, ' ')
            .trim();
        // Якщо формат "Artist - Title", беремо другий елемент як назву пісні
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
        // Якщо формат "Artist - Title", беремо перший елемент як артиста
        const parts = cleaned.split(' - ');
        if (parts.length === 2) return parts[0];
        return "Unknown Artist";
    }
    return "Unknown Artist";
}

export const Songs = () => {
    const [songs, setSongs] = useState<MediaLibrary.Asset[]>([])
    useEffect(() => {
        (async () => {
            const media = await MediaLibrary.getAssetsAsync({
                mediaType: 'audio',          // тип медіа — аудіо
                first: 100,                  // скільки отримати (максимум 100)
                sortBy: [['creationTime', false]], // сортування за датою створення, новіші перші
            });
            const allMp3s = media.assets.filter(asset =>
                asset.filename.toLowerCase().endsWith('.mp3')
            );

            setSongs(allMp3s)
        })()
    }, [])
    console.log(songs)
    return (
        <View style={styles.container}>
            <FlatList
                data={songs}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Image source={require('@/assets/images/cover.jpg')} style={styles.coverImage} resizeMode="cover" />
                        <View>
                              <Text style={styles.title}>{formatTitle(item.filename)}</Text>
                            <Text style={styles.artist}>{formatArtist(item.filename)}</Text>
                        </View>
                    </View>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        
        padding: 16,
       
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    coverImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
        backgroundColor: '#ccc',
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
});
