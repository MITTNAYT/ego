package com.ego.domain.repository

import com.ego.domain.model.Artist
import com.ego.domain.model.CollectionItem
import com.ego.domain.model.Track
import kotlinx.coroutines.flow.Flow

interface MusicRepository {
    fun getTrendingTracks(): Flow<List<Track>>
    fun getPopularArtists(): Flow<List<Artist>>
    fun getRecentlyPlayed(): Flow<List<Track>>
    fun getCollections(): Flow<List<CollectionItem>>
    fun getAllTracks(): Flow<List<Track>>
    fun searchTracks(query: String): Flow<List<Track>>
    suspend fun toggleLike(trackId: String): Result<Boolean>
    suspend fun scanLocalMusic(): Result<List<Track>>
}
