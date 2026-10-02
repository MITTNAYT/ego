package com.ego.domain.model

data class PlaybackState(
    val currentTrack: Track? = null,
    val isPlaying: Boolean = false,
    val positionMs: Long = 0L,
    val durationMs: Long = 0L,
    val isShuffle: Boolean = false,
    val repeatMode: RepeatMode = RepeatMode.OFF,
    val queue: List<Track> = emptyList(),
    val volume: Float = 1.0f
) {
    val progressFraction: Float
        get() = if (durationMs > 0) (positionMs.toFloat() / durationMs.toFloat()).coerceIn(0f, 1f) else 0f

    val formattedPosition: String
        get() {
            val totalSec = positionMs / 1000
            val min = totalSec / 60
            val sec = (totalSec % 60).toString().padStart(2, '0')
            return "$min:$sec"
        }

    val formattedDuration: String
        get() {
            val totalSec = durationMs / 1000
            val min = totalSec / 60
            val sec = (totalSec % 60).toString().padStart(2, '0')
            return "$min:$sec"
        }
}

enum class RepeatMode {
    OFF, ALL, ONE
}

data class EqualizerBand(
    val index: Int,
    val centerFreqHz: Int,
    val gainDb: Float,
    val minGainDb: Float = -12f,
    val maxGainDb: Float = 12f
)
