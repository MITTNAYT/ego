package com.ego.data.db

data class LikedTrackEntity(
    val id: String,
    val title: String,
    val artist: String,
    val album: String,
    val durationSec: Int,
    val audioUri: String,
    val coverUri: String,
    val likedAtMs: Long = System.currentTimeMillis()
)

data class ListeningHistoryEntity(
    val id: Long = 0L,
    val trackId: String,
    val title: String,
    val artist: String,
    val playedAtMs: Long = System.currentTimeMillis()
)

data class PlaylistEntity(
    val id: String,
    val title: String,
    val description: String,
    val coverUri: String,
    val trackIds: List<String> = emptyList(),
    val createdAtMs: Long = System.currentTimeMillis()
)
