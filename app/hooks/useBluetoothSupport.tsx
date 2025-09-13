import { useEffect, useRef } from "react";
import { NativeModules, NativeEventEmitter } from "react-native";
import { useAudioControls } from "./useAudioControls";

export const useBluetoothSupport = () => {
  const { togglePlayBack, PlayNextSong, PlayPrevSong } = useAudioControls();
  const { MyMediaModule } = NativeModules;

  const mediaEventEmitter = useRef<NativeEventEmitter | null>(null);
  const actionsRef = useRef({ togglePlayBack, PlayNextSong, PlayPrevSong });


  useEffect(() => {
    actionsRef.current = { togglePlayBack, PlayNextSong, PlayPrevSong };
  }, [togglePlayBack, PlayNextSong, PlayPrevSong]);


  useEffect(() => {
    console.log("Init MyMediaModule...");
    MyMediaModule?.initMediaSession?.();
    mediaEventEmitter.current = new NativeEventEmitter(MyMediaModule);

    return () => {
      MyMediaModule?.release?.();
      mediaEventEmitter.current?.removeAllListeners("MediaCommand");
    };
  }, []);

  
  useEffect(() => {
    if (!mediaEventEmitter.current) return;

    const subscription = mediaEventEmitter.current.addListener(
      "MediaCommand",
      async (action: string) => {
        console.log("🎧 MediaCommand received:", action);
        const { togglePlayBack, PlayNextSong, PlayPrevSong } = actionsRef.current;

        switch (action) {
          case "play":
          case "pause":
            await togglePlayBack();
            break;
          case "next":
            await PlayNextSong();
            console.log("play next");
            break;
          case "previous":
            await PlayPrevSong();
            break;
        }
      }
    );

    return () => subscription.remove();
  }, []);
};
