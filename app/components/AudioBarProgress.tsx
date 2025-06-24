import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  PanResponder,
  GestureResponderEvent,
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

  const [isDragging, setIsDragging] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;

 
  const dragStartX = useRef(0);

  useEffect(() => {
    if (!isDragging) {
      const percentage = duration ? position / duration : 0;
      const newWidth = percentage * SCREEN_WIDTH;
      Animated.timing(progress, {
        toValue: newWidth,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [position, duration, isDragging]);

  useEffect(() => {
    if (isDragging) return; 
    const interval = setInterval(async () => {
      const status = await sound?.getStatusAsync();
      if (status?.isLoaded) {
        setPosition(status.positionMillis || 0);
        setDuration(status.durationMillis || 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sound,isDragging]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsDragging(true);
        progress.stopAnimation((value) => {
          dragStartX.current = value; 
        });
      },
      onPanResponderMove: (_, gesture) => {
        let newPos = dragStartX.current + gesture.dx;
        newPos = Math.max(0, Math.min(newPos, SCREEN_WIDTH));
        progress.setValue(newPos);
      },
      onPanResponderRelease: async (_, gesture) => {
        setIsDragging(false);
        let newPos = dragStartX.current + gesture.dx;
        newPos = Math.max(0, Math.min(newPos, SCREEN_WIDTH));
        const newTime = (newPos / SCREEN_WIDTH) * duration;

        if (sound) {
          await sound.setPositionAsync(newTime);
        }
        setPosition(newTime);
      },
    })
  ).current;

  const onBarPress = async (event: GestureResponderEvent) => {
    const touchX = event.nativeEvent.locationX;
    const clampedX = Math.max(0, Math.min(touchX, SCREEN_WIDTH));
    const newTime = (clampedX / SCREEN_WIDTH) * duration;
    if (sound) {
      await sound.setPositionAsync(newTime);
    }
    setPosition(newTime);
    progress.setValue(clampedX);
  };

  return (
    <View style={styles.container}>
      <View
        style={styles.track}
        onStartShouldSetResponder={() => true}
        onResponderRelease={onBarPress}
      >
        <Animated.View style={[styles.progress, { width: progress }]} />
        <Animated.View
          style={[
            styles.thumb,
            { transform: [{ translateX: Animated.subtract(progress, 8) }] },
          ]}
          {...panResponder.panHandlers}
        />
      </View>
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
    height: 6,
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
    top: -6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#1DB954",
    zIndex: 10,
  },
});
