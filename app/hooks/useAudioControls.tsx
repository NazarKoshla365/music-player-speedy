
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useCallback } from "react";
import { usePlayerStore } from "../store/playerStore";
import { calculateTime, formatArtist, formatTitle } from "../utils/audioUtils";
import { Audio } from "expo-av";


export const useAudioControls = () => {
    const { sound, isShuffle, setIsShuffle, isSoundLoop, setIsSoundLoop, songs, setIsPlay, activeSongData, setActiveSongData, setItemPlay, setSound, setActiveSongIndex, activeSongIndex } = usePlayerStore()


    
    const PlaySongbyIndex = useCallback(async (index: number) => {
        const song = songs[index];
        const currentSound = usePlayerStore.getState().sound;

        if (currentSound) {
            try {
                await currentSound.stopAsync();
                await currentSound.unloadAsync();
            } catch (e) {
                console.warn('Помилка при розвантаженні sound:', e);
                 return; 
            }
        }
        const { sound: newSound } = await Audio.Sound.createAsync(
            { uri: song.uri },
            { shouldPlay: true }
        );
        setSound(newSound);
        setActiveSongData({
            id: song.id,
            title: formatTitle(song.filename),
            artist: formatArtist(song.filename),
            duration: calculateTime(song.duration),
            uri: song.uri,
        });
        setActiveSongIndex(index);
        setIsPlay(true);
        setItemPlay(true);
    }, [sound, songs, setSound, setActiveSongData, setActiveSongIndex, setIsPlay, setItemPlay]);
    const PlaySong = useCallback(async (song: MediaLibrary.Asset) => {
        const index = songs.findIndex(s => s.id === song.id);
        if (index !== -1) {
            await PlaySongbyIndex(index);
        }
    }, [PlaySongbyIndex])


    const PlayNextSong = useCallback(async () => {
        if (activeSongIndex === null) return;
        if (isShuffle) {
            const randomIndex = Math.floor(Math.random() * songs.length)
            await PlaySongbyIndex(randomIndex)
        } else {
            let nextIndex = activeSongIndex + 1
            if (nextIndex >= songs.length) {
                nextIndex = 0
            }
            await PlaySongbyIndex(nextIndex)
        }
    }, [isShuffle, activeSongIndex, PlaySongbyIndex, songs.length])


    const PlayPrevSong = useCallback(async () => {
        if (activeSongIndex === null) return;
        let prevIndex = activeSongIndex - 1
        if (prevIndex < 0) {
            prevIndex = songs.length - 1
        }
        await PlaySongbyIndex(prevIndex)
    }, [activeSongIndex, songs.length, PlaySongbyIndex])


    const togglePlayBack = useCallback(async () => {
        if (!sound) return;

        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
            if (status.isPlaying) {
                await sound.pauseAsync();
                setIsPlay(false);
            } else {
                await sound.playAsync();
                setIsPlay(true);
            }
        }
    }, [sound, setIsPlay]);
    const toggleRepeatPlayback = useCallback(async () => {
        if (!sound) return;

        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
            const newLoop = !status.isLooping;
            await sound.setIsLoopingAsync(newLoop);
            setIsSoundLoop(newLoop);
        }
    }, [sound, setIsSoundLoop])


    const toggleShufflePlayback = useCallback(() => {
        setIsShuffle(!isShuffle);
    }, [isShuffle, setIsShuffle]);


useEffect(() => {
        if (!sound) return
        const checkIsFinishSong = async () => {
            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded && status.didJustFinish) {
                    if (!isSoundLoop) {
                        PlayNextSong()
                    }
                }
            })
        }
        checkIsFinishSong()
        return (() => {
            sound.setOnPlaybackStatusUpdate(null)
        })
    }, [sound, isSoundLoop,PlayNextSong])

    return { togglePlayBack, toggleRepeatPlayback, toggleShufflePlayback, PlaySong, PlayNextSong, PlayPrevSong }
}