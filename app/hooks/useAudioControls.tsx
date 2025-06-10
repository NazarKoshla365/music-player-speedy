import { Audio} from 'expo-av';
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useState } from "react";
import { usePlayerStore } from "../store/playerStore";
import { calculateTime, formatArtist, formatTitle } from "../utils/audioUtils";


export const useAudioControls = () => {
    const { sound, isShuffle, setIsShuffle, isSoundLoop, setIsSoundLoop, songs, setIsPlay, activeSongData, setActiveSongData, setItemPlay, setSound, setActiveSongIndex, activeSongIndex } = usePlayerStore()

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
    }, [sound, isSoundLoop])

    async function PlaySongbyIndex(index: number) {
        const song = songs[index]
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
        setActiveSongIndex(index)
        setIsPlay(true)
        setItemPlay(true)
    }
    async function PlaySong(song: MediaLibrary.Asset) {
        const index = songs.findIndex(s => s.id === song.id)
        console.log(index)
        if (index !== -1) {
            await PlaySongbyIndex(index)
        }
    }

    async function PlayNextSong() {
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
    }
    async function PlayPrevSong() {
        if (activeSongIndex === null) return;
        let prevIndex = activeSongIndex - 1
        if (prevIndex < 0) {
            prevIndex = songs.length - 1
        }
        await PlaySongbyIndex(prevIndex)
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
    async function toggleRepeatPlayback() {
        if (!sound) return
        const status = await sound.getStatusAsync()
        if (status.isLoaded) {
            if (status.isLooping) {
                setIsSoundLoop(false)
                sound.setIsLoopingAsync(false)

            } else {
                setIsSoundLoop(true)
                sound.setIsLoopingAsync(true)
            }
        }

    }
    async function toggleShufflePlayback() {
        if (isShuffle) {
            setIsShuffle(false)
        } else {
            setIsShuffle(true)
        }
    }
   useEffect(()=>{
     return () => {
          if (sound) {
            sound.unloadAsync()
          }
        }
   },[sound])

    return { togglePlayBack, toggleRepeatPlayback, toggleShufflePlayback, PlaySong, PlayNextSong, PlayPrevSong }
}