import { View, Pressable, StyleSheet } from "react-native"
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useAudioControls } from "../hooks/useAudioControls";
import { usePlayerStore } from "../store/playerStore";

export const PlaybackControll = () => {
    const { togglePlayBack, toggleRepeatPlayback, toggleShufflePlayback, PlayNextSong, PlayPrevSong } = useAudioControls();
    const { isShuffle, isSoundLoop, isPlay } = usePlayerStore()

    return (
        <View style={styles.viewPlay}>
            <Pressable style={styles.iconButton} onPress={toggleShufflePlayback}>
                <FontAwesome6 name="shuffle" size={18} color={isShuffle ? "#4c9aff" : "#333"} />
            </Pressable>

            <Pressable style={styles.iconButton} onPress={PlayPrevSong}>
                <FontAwesome5 name="step-backward" size={22} color="#333" />
            </Pressable>

            <Pressable style={[styles.iconButton, styles.playButton]} onPress={togglePlayBack}>
                {isPlay
                    ? <FontAwesome5 name="pause" size={26} color="#fff" />
                    : <FontAwesome5 style={{ marginLeft: 4 }} name="play" size={26} color="#fff" />}
            </Pressable>

            <Pressable style={styles.iconButton} onPress={PlayNextSong}>
                <FontAwesome5 name="step-forward" size={22} color="#333" />
            </Pressable>

            <Pressable style={styles.iconButton} onPress={toggleRepeatPlayback}>
                <MaterialCommunityIcons
                    name={isSoundLoop ? "repeat-once" : "repeat"}
                    size={22}
                    color={isSoundLoop ? "#4c9aff" : "#333"}
                />
            </Pressable>
        </View>
    )
}
const styles = StyleSheet.create({
viewPlay: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 12,
        marginBottom: 100,
    },
    iconButton: {
        width: 50,
        height: 50,
        backgroundColor: '#f0f0f0',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    playButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#4c9aff',
    },
})