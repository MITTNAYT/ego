package com.ego.domain.model

data class Track(
    val id: String,
    val title: String,
    val artist: String,
    val album: String,
    val durationSec: Int,
    val audioUri: String,
    val coverUri: String,
    val quality: String = "24-Bit / 96kHz Lossless",
    val year: Int = 2024,
    val lyrics: List<LyricLine> = emptyList(),
    val isLiked: Boolean = false
) {
    val formattedDuration: String
        get() {
            val min = durationSec / 60
            val sec = (durationSec % 60).toString().padStart(2, '0')
            return "$min:$sec"
        }
}

data class LyricLine(
    val timeMs: Long,
    val text: String,
    val romanized: String? = null
)
