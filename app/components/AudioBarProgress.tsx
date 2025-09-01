import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,

  PanResponder,
  Pressable
} from "react-native";
import { usePlayerStore } from "../store/playerStore";

interface AudioBarProgressProps {
  position: number;
  setPosition: (position: number) => void;
  duration: number;
  setDuration: (duration: number) => void;
}

const SCREEN_WIDTH = Dimensions.get("window").width - 72;



export const AudioBarProgress = ({
  position,
  setPosition,
  duration,
  setDuration,
}: AudioBarProgressProps) => {
  const { sound } = usePlayerStore();
  const progress = useRef(new Animated.Value(0)).current;
  const currentProgress = useRef(0);
  const isDragging = useRef(false)

  const handleTrackPress = async (e: any) => {
    const tapX = e.nativeEvent.locationX;
    const clampedX = Math.max(0, Math.min(tapX, SCREEN_WIDTH));
    progress.setValue(clampedX);
    currentProgress.current = clampedX;
    const newTime = (clampedX / SCREEN_WIDTH) * duration;
    if (sound) await sound.setPositionAsync(newTime);
    setPosition(newTime);
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => isDragging.current = true,
    onPanResponderMove: (_, gestureState) => {
      const clampedX = Math.max(0, Math.min(gestureState.dx + currentProgress.current, SCREEN_WIDTH));
      progress.setValue(clampedX);
    },
    onPanResponderRelease: async (_, gestureState) => {
      const clampedX = Math.max(0, Math.min(gestureState.dx + currentProgress.current, SCREEN_WIDTH));
      currentProgress.current = clampedX;
      const newTime = (clampedX / SCREEN_WIDTH) * duration;
      if (sound) await sound.setPositionAsync(newTime);
      setPosition(newTime);
      isDragging.current = false;
    }
  })

  useEffect(() => {
    if (isDragging.current) return;
    const percentage = duration ? position / duration : 0;
    const newWidth = percentage * SCREEN_WIDTH;
    Animated.timing(progress, {
      toValue: newWidth,
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      currentProgress.current = newWidth;
    });
  }, [position, duration]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (isDragging.current) return;
      const status = await sound?.getStatusAsync();
      if (status?.isLoaded) {
        setPosition(status.positionMillis || 0);
        setDuration(status.durationMillis || 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sound]);


  return (
    <View style={styles.container}>
      <Pressable style={styles.track}
        onPress={handleTrackPress}
      >
        <Animated.View style={[styles.progress, { width: progress }]} />
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.thumb,
            { transform: [{ translateX: Animated.subtract(progress, 8) }] },
          ]}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 12,
    marginVertical: 16,
  },
  track: {
    width: "100%",
    height: 8,
    backgroundColor: "#ccc",
    borderRadius: 3,
    position: "relative",
  },
  progress: {
    height: "100%",
    backgroundColor: "#1DB954",
    borderRadius: 3,
  },
  thumb: {
    position: "absolute",
    top: -5,
    width: 18,
    height: 18,
    borderRadius: 8,
    backgroundColor: "#1DB954",
    zIndex: 10,
  },
});
