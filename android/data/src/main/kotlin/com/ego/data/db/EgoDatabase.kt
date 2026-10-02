package com.ego.data.db

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.map

class EgoDatabase {

    private val _likedTracks = MutableStateFlow<Map<String, LikedTrackEntity>>(
        mapOf(
            "track-cry" to LikedTrackEntity("track-cry", "Cry", "Cigarettes After Sex", "Cry", 234, "uri", "cover"),
            "track-frank" to LikedTrackEntity("track-frank", "Pink + White", "Frank Ocean", "Blonde", 184, "uri", "cover")
        )
    )

    private val _history = MutableStateFlow<List<ListeningHistoryEntity>>(emptyList())

    private val _playlists = MutableStateFlow<List<PlaylistEntity>>(
        listOf(
            PlaylistEntity("pl-1", "Late Night Lossless", "Analog synths and nocturnal moods", "cover1", listOf("track-cry", "track-trance")),
            PlaylistEntity("pl-2", "Tokyo Lo-Fi Chill", "Japanese city pop and relaxing beats", "cover2", listOf("track-yoasobi", "track-look"))
        )
    )

    fun observeLikedTracks(): Flow<List<LikedTrackEntity>> = _likedTracks.map { it.values.toList() }

    fun isLiked(trackId: String): Boolean = _likedTracks.value.containsKey(trackId)

    suspend fun insertLiked(track: LikedTrackEntity) {
        val current = _likedTracks.value.toMutableMap()
        current[track.id] = track
        _likedTracks.value = current
    }

    suspend fun removeLiked(trackId: String) {
        val current = _likedTracks.value.toMutableMap()
        current.remove(trackId)
        _likedTracks.value = current
    }

    fun observeHistory(): Flow<List<ListeningHistoryEntity>> = _history.asStateFlow()

    suspend fun recordPlay(entry: ListeningHistoryEntity) {
        val current = _history.value.toMutableList()
        current.add(0, entry)
        _history.value = current.take(50)
    }

    fun observePlaylists(): Flow<List<PlaylistEntity>> = _playlists.asStateFlow()

    suspend fun createPlaylist(title: String, description: String): PlaylistEntity {
        val newId = "pl-${System.currentTimeMillis()}"
        val pl = PlaylistEntity(newId, title, description, "")
        _playlists.value = _playlists.value + pl
        return pl
    }
}
