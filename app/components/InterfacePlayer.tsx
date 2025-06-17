import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { useRef, useCallback, useMemo, useEffect, useState } from "react";
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';

import { LinearGradient } from 'expo-linear-gradient';
import { usePlayerStore } from "../store/playerStore";
import { AudioBarProgress } from "./AudioBarProgress";
import { formatMilliseconds } from "../utils/audioUtils";
import { PlaybackControll } from "./PlayBackControll";

export const InterfacePlayer = () => {
    const {  isOpenModal, activeSongData, setIsOpenModal } = usePlayerStore();
    const [position, setPosition] = useState<number>(0);
    const [duration, setDuration] = useState<number>(1);

    const bottomSheetRef = useRef<BottomSheet>(null);
    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);
    const snapPoints = useMemo(() => ['100%'], []);

    const openSheet = () => bottomSheetRef.current?.expand();
    const closeSheet = () => {
        bottomSheetRef.current?.close();
        setIsOpenModal(false);
    };

    useEffect(() => {
        if (isOpenModal) {
            openSheet();
            console.log(activeSongData);
        }
    }, [isOpenModal]);

    return (
        <BottomSheet
            handleIndicatorStyle={{ display: 'none' }}
            enableContentPanningGesture={false}
            onChange={handleSheetChanges}
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            index={-1}
        >
            <LinearGradient colors={['#f7f8fc', '#eaeaea']} style={styles.gradientContainer}>
                <BottomSheetView style={styles.contentContainer}>
                    {/* Upper Content */}
                    <View style={styles.upperContent}>
                        <View style={styles.topContainer}>
                            <Pressable onPress={closeSheet}>
                                <AntDesign name="arrowleft" size={32} color="#333" />
                            </Pressable>
                            <Pressable>
                                <Entypo name="dots-three-vertical" size={24} color="#333" />
                            </Pressable>
                        </View>

                        <View style={styles.contentDescContainer}>
                            <Image style={styles.imageCover} source={require('@/assets/images/cover.jpg')} />
                            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>{activeSongData?.title}</Text>
                            <Text style={styles.artist}>{activeSongData?.artist}</Text>
                        </View>

                        <View style={{ width: '100%' }}>
                            <AudioBarProgress
                                position={position}
                                setPosition={setPosition}
                                duration={duration}
                                setDuration={setDuration}
                            />
                            <View style={styles.viewSongTime}>
                                <Text style={styles.timeText}>{formatMilliseconds(position)}</Text>
                                <Text style={styles.timeText}>{activeSongData?.duration}</Text>
                            </View>
                        </View>
                    </View>
                    {/* Playback Controls */}
                   <PlaybackControll/>
                </BottomSheetView>
            </LinearGradient>
        </BottomSheet>
    );
};

const styles = StyleSheet.create({
    gradientContainer: {
        flex: 1,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: 'hidden',
    },
    contentContainer: {
        flex: 1,
        padding: 24,
        justifyContent: 'space-between', 
    },
    upperContent: {
        alignItems: 'center',
    },
    topContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    contentDescContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 20,
    },
    imageCover: {
        width: 220,
        height: 220,
        borderRadius: 24,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 8,
    },
    title: {
        fontSize: 26,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#222',
        textAlign: 'center',
        width:300,
    },
    artist: {
        fontSize: 18,
        fontFamily: 'Montserrat_400Regular',
        color: '#666',
        textAlign: 'center',
        marginTop: 6,
    },
    viewSongTime: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        marginTop: 4,
    },
    timeText: {
        color: '#444',
        fontSize: 14,
        fontFamily: 'Montserrat_400Regular',
    },

});
