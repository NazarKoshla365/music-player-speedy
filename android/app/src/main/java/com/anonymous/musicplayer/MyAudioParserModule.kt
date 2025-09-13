package com.anonymous.musicplayer
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.Arguments

import android.media.MediaMetadataRetriever
import android.util.Base64


class MyAudioParserModule(reactContext:ReactApplicationContext):ReactContextBaseJavaModule(reactContext){
    override fun getName():String{
        return "MusicParser"
    }
    @ReactMethod
fun getMetadata(filePath:String,promise:Promise){
    try{
        val retriever = MediaMetadataRetriever()
        retriever.setDataSource(filePath)
        val title = retriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_TITLE)
        val artist = retriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_ARTIST)
        val album = retriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_ALBUM)
        val duration = retriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_DURATION)

        val artBytes = retriever.embeddedPicture
        val coverBase64: String? = artBytes?.let { Base64.encodeToString(it, Base64.DEFAULT) }

        val result = Arguments.createMap()
        result.putString("title",title)
        result.putString("artist",artist)
        result.putString("album",album)
        result.putString("cover",coverBase64)

            

        promise.resolve(result)
    }
    catch(e:Exception){
        promise.reject("Parser Error",e)
    }

}
}




