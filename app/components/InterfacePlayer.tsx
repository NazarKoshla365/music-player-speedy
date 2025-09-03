import { SafeAreaView, View, Text, StyleSheet, Image, Pressable, Animated, Dimensions, PanResponder } from "react-native";
import { useEffect, useRef, useState } from "react";

import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import { useBluetoothSupport } from "../hooks/useBluetoothSupport";

import { LinearGradient } from 'expo-linear-gradient';
import { usePlayerStore } from "../store/playerStore";
import { AudioBarProgress } from "./AudioBarProgress";
import { formatMilliseconds } from "../utils/audioUtils";
import { PlaybackControll } from "./PlayBackControll";
const { height, width: screenWidth } = Dimensions.get('window')
export const InterfacePlayer = () => {
    const { isOpenModal, activeSongData, setIsOpenModal } = usePlayerStore();
    const [position, setPosition] = useState<number>(0);
    const [duration, setDuration] = useState<number>(1);

    const slideAnim = useRef(new Animated.Value(height)).current
    const pan = useRef(new Animated.Value(0)).current

    const closeModal = () => setIsOpenModal(false)


    const topDragHeight = 360
    const dragZoneWidth = 200
    useBluetoothSupport()

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => {
            const { pageY, pageX } = evt.nativeEvent;
            const leftBound = (screenWidth - dragZoneWidth) / 2;
            const rightBound = leftBound + dragZoneWidth;
            return pageY < topDragHeight && pageX > leftBound && pageX < rightBound;
        },
        onMoveShouldSetPanResponder: (evt, gestureState) => {
            const { pageY, pageX } = evt.nativeEvent;
            const leftBound = (screenWidth - dragZoneWidth) / 2;
            const rightBound = leftBound + dragZoneWidth;
            return pageY < topDragHeight && pageX > leftBound && pageX < rightBound;
        },
        onPanResponderMove: (_, gestureState) => {
            if (gestureState.dy > 0) {
                pan.setValue(gestureState.dy);
            }
        },
        onPanResponderRelease: (_, gestureState) => {
            if (gestureState.dy > 100) {
                Animated.timing(slideAnim, {
                    toValue: height,
                    duration: 200,
                    useNativeDriver: true,
                }).start(() => {
                    setIsOpenModal(false)
                    pan.setValue(0)
                })
            }
            else {
                Animated.spring(pan, {
                    toValue: 0,
                    useNativeDriver: true,
                }).start();
            }
        }
    })
    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: isOpenModal ? 0 : height,
            duration: 200,
            useNativeDriver: true,
        }).start()
    }, [isOpenModal])
    return (
        <Animated.View {...panResponder.panHandlers} style={[styles.interfaceContainer, { transform: [{ translateY: Animated.add(slideAnim, pan) }] }]}>
            <SafeAreaView style={styles.safeArea}>
                <LinearGradient colors={['#fdfdfd', '#e6e6e6']} style={styles.gradientContainer}>
                    <View style={styles.contentContainer}>
                        <View style={styles.upperContent}>
                            <View style={styles.topContainer}>
                                <Pressable onPress={closeModal}>
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
                        <PlaybackControll />
                    </View>
                </LinearGradient>
            </SafeAreaView>
        </Animated.View>

    )
};

const styles = StyleSheet.create({
    interfaceContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
    },
    safeArea: {
        flex: 1,
    },
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
        marginTop: 20,
        marginBottom: 40,
    },
    contentDescContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 120,
        marginTop: 20,
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
        width: 300,
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
