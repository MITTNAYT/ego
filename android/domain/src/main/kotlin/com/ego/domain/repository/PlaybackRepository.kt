package com.ego.domain.repository

import com.ego.domain.model.EqualizerBand
import com.ego.domain.model.PlaybackState
import com.ego.domain.model.Track
import kotlinx.coroutines.flow.StateFlow

interface PlaybackRepository {
    val playbackState: StateFlow<PlaybackState>
    val equalizerBands: StateFlow<List<EqualizerBand>>

    suspend fun play(track: Track, playlist: List<Track> = listOf(track))
    suspend fun pause()
    suspend fun resume()
    suspend fun togglePlayPause()
    suspend fun next()
    suspend fun previous()
    suspend fun seekTo(positionMs: Long)
    suspend fun setVolume(volume: Float)
    suspend fun toggleShuffle()
    suspend fun toggleRepeat()
    suspend fun setEqualizerGain(bandIndex: Int, gainDb: Float)
    suspend fun resetEqualizer()
}
