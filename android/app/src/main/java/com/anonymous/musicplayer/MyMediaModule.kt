package com.anonymous.musicplayer

import android.media.session.MediaSession
import android.media.session.PlaybackState
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule

class MyMediaModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var mediaSession: MediaSession? = null

    override fun getName(): String = "MyMediaModule"

    // TurboModule вимога для NativeEventEmitter
        @ReactMethod
    fun addListener(eventName: String?) {
        // нічого не робимо
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // нічого не робимо
    }

    @ReactMethod
    fun initMediaSession() {
        if (mediaSession != null) return  // вже ініціалізовано

        Log.d("MyMediaModule", "Initializing MediaSession")

        mediaSession = MediaSession(reactApplicationContext, "MyMediaSession")
        mediaSession?.setCallback(object : MediaSession.Callback() {
            override fun onPlay() {
                Log.d("MyMediaModule", "onPlay pressed")
                sendEvent("MediaCommand", "play")
            }

            override fun onPause() {
                Log.d("MyMediaModule", "onPause pressed")
                sendEvent("MediaCommand", "pause")
            }

            override fun onSkipToNext() {
                Log.d("MyMediaModule", "onSkipToNext pressed")
                sendEvent("MediaCommand", "next")
            }

            override fun onSkipToPrevious() {
                Log.d("MyMediaModule", "onSkipToPrevious pressed")
                sendEvent("MediaCommand", "previous")
            }
        })

        val state = PlaybackState.Builder()
            .setActions(
                PlaybackState.ACTION_PLAY or
                PlaybackState.ACTION_PAUSE or
                PlaybackState.ACTION_SKIP_TO_NEXT or
                PlaybackState.ACTION_SKIP_TO_PREVIOUS
            )
            .setState(PlaybackState.STATE_STOPPED, 0, 1.0f)
            .build()

        
        mediaSession?.setPlaybackState(state)
        mediaSession?.isActive = true
    }

    @ReactMethod
    fun release() {
        mediaSession?.release()
        mediaSession = null
    }

    private fun sendEvent(eventName: String, action: String) {
        try {
            reactApplicationContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit(eventName, action)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}
