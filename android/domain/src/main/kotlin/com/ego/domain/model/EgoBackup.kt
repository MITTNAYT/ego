package com.ego.domain.model

/**
 * Cross-platform Ego Library Backup format.
 * Matches web application export/import schema for seamless synchronization.
 */
data class EgoBackup(
    val schemaVersion: Int = 1,
    val appName: String = "Ego Music Player",
    val client: String = "android",
    val exportedAt: String,
    val likedTrackIds: List<String>,
    val playlists: List<PlaylistBackupItem> = emptyList(),
    val recentlyPlayedIds: List<String> = emptyList(),
    val equalizer: EqualizerBackup = EqualizerBackup(),
    val preferences: PreferencesBackup = PreferencesBackup()
)

data class PlaylistBackupItem(
    val id: String,
    val title: String,
    val trackIds: List<String>,
    val createdAt: Long = System.currentTimeMillis()
)

data class EqualizerBackup(
    val preset: String = "Flat",
    val bands: List<Float> = listOf(0f, 0f, 0f, 0f, 0f, 0f, 0f, 0f, 0f, 0f),
    val preamp: Float = 0f
)

data class PreferencesBackup(
    val volume: Float = 0.85f,
    val repeatMode: String = "off",
    val shuffle: Boolean = false,
    val audioQuality: String = "FLAC / 320kbps"
)
