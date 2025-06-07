import { Audio } from 'expo-av';
import { create } from 'zustand';
import * as MediaLibrary from 'expo-media-library';

interface SongData {
    id: string;
    title: string;
    artist: string;
    duration: string;
    uri: string;
}
interface PlayerStore {
    songs: MediaLibrary.Asset[]
    setSongs: (songs: MediaLibrary.Asset[]) => void
    sound: Audio.Sound | null
    setSound: (sound: Audio.Sound | null) => void
    isSoundLoop: boolean
    isShuffle:boolean
    setIsShuffle:(isShuffle:boolean)=>void
    setIsSoundLoop: (sound: boolean) => void
    isOpenModal: boolean
    setIsOpenModal: (isOpenModal: boolean) => void
    isPlay: boolean
    setIsPlay: (isPlay: boolean) => void
    itemPlay: boolean
    setItemPlay: (itemPlay: boolean) => void
    activeSongData: SongData | null
    setActiveSongData: (activeSongData: SongData) => void
    activeSongIndex: number | null
    setActiveSongIndex: (index: number | null) => void;

}
export const usePlayerStore = create<PlayerStore>((set) => ({
    songs: [],
    sound: null,
    isSoundLoop: false,
    isShuffle:false,
    isOpenModal: false,
    isPlay: false,
    itemPlay: false,
    activeSongData: null,
    activeSongIndex: null,
    setIsShuffle:(isShuffle)=>set({isShuffle}),
    setActiveSongIndex: (index) => set({ activeSongIndex: index }),
    setSongs: (songs) => set({ songs }),
    setSound: (sound) => set({ sound }),
    setIsSoundLoop: (isSoundLoop) => set({ isSoundLoop}),
    setIsPlay: (isPlay) => set({ isPlay }),
    setItemPlay: (itemPlay) => set({ itemPlay }),
    setActiveSongData: (activeSongData) => set({ activeSongData }),
    setIsOpenModal: (isOpenModal) => set({ isOpenModal })

})) 