import Ionicons from '@expo/vector-icons/Ionicons';
import { Asset } from "expo-media-library";
import { formatArtist, formatTitle,formatTime } from "../utils/audioUtils";
import { Pressable, View, Text, Image, StyleSheet } from "react-native";
import React from "react";


interface SongItemProps {
    item: any
    isActive: boolean
    onPress: (item: Asset) => void
}
export const SongItem = React.memo(({ item, isActive, onPress }: SongItemProps) => {

    console.log('🔄 RENDER:', item.filename);
    return (
        <Pressable onPress={() => onPress(item)} style={({ pressed }) => [
            pressed && styles.pressedItem
        ]}>
            <View style={isActive ? styles.activeItem : styles.item}  >
                <View style={styles.itemDesc}>
                    <Image source={item.cover ? { uri: `data:image/jpeg;base64,${item.cover}` } : require('@/assets/images/cover.jpg')} style={styles.coverImage} resizeMode="cover" />
                    <View style={styles.itemTextView}>
                        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>{item.title ? item.title : formatTitle(item.filename)}</Text>
                        <Text style={styles.artist}>{item.artist ? item.artist : formatArtist(item.filename)}</Text>
                    </View>
                </View>
                <View style={styles.infoItem}>
                    <Text style={styles.time}>{formatTime(item.duration)}</Text>
                    <Pressable><Ionicons name="ellipsis-vertical-sharp" size={24} color="black" /></Pressable>
                </View>
            </View>
        </Pressable>
    )
}, (prevProps, nextProps) => {
    return (
        prevProps.item.id === nextProps.item.id &&
        prevProps.isActive === nextProps.isActive
    );
})
const styles = StyleSheet.create({
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

    },
    artist: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    time: {
        fontSize: 13,
        color: '#666',
        marginRight: 8
    },
    pressedItem: {
        backgroundColor: '#e0e0e0'
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center'

    }
})