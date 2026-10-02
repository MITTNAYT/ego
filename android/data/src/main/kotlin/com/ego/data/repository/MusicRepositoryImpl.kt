package com.ego.data.repository

import com.ego.data.datasource.InMemoryMusicDataSource
import com.ego.domain.model.Artist
import com.ego.domain.model.CollectionItem
import com.ego.domain.model.Track
import com.ego.domain.repository.MusicRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.flow.map

class MusicRepositoryImpl(
    private val inMemoryDataSource: InMemoryMusicDataSource = InMemoryMusicDataSource()
) : MusicRepository {

    private val likedIds = MutableStateFlow<Set<String>>(setOf("track-cry", "track-frank"))

    override fun getTrendingTracks(): Flow<List<Track>> {
        return likedIds.map { likes ->
            inMemoryDataSource.sampleTracks
                .filter { it.id in listOf("track-frank", "track-yoasobi", "track-syre") }
                .map { it.copy(isLiked = it.id in likes) }
        }
    }

    override fun getPopularArtists(): Flow<List<Artist>> {
        return flowOf(inMemoryDataSource.sampleArtists)
    }

    override fun getRecentlyPlayed(): Flow<List<Track>> {
        return likedIds.map { likes ->
            inMemoryDataSource.sampleTracks
                .filter { it.id in listOf("track-trance", "track-look", "track-cry", "track-sweet") }
                .map { it.copy(isLiked = it.id in likes) }
        }
    }

    override fun getCollections(): Flow<List<CollectionItem>> {
        return flowOf(inMemoryDataSource.sampleCollections)
    }

    override fun getAllTracks(): Flow<List<Track>> {
        return likedIds.map { likes ->
            inMemoryDataSource.sampleTracks.map { it.copy(isLiked = it.id in likes) }
        }
    }

    override fun searchTracks(query: String): Flow<List<Track>> {
        val q = query.trim().lowercase()
        return likedIds.map { likes ->
            if (q.isBlank()) emptyList()
            else inMemoryDataSource.sampleTracks
                .filter { it.title.lowercase().contains(q) || it.artist.lowercase().contains(q) }
                .map { it.copy(isLiked = it.id in likes) }
        }
    }

    override suspend fun toggleLike(trackId: String): Result<Boolean> = runCatching {
        var isNowLiked = false
        val current = likedIds.value
        val updated = if (trackId in current) {
            current - trackId
        } else {
            isNowLiked = true
            current + trackId
        }
        likedIds.value = updated
        isNowLiked
    }

    override suspend fun scanLocalMusic(): Result<List<Track>> = runCatching {
        // Fallback to in-memory tracks for initial demonstration
        inMemoryDataSource.sampleTracks
    }
}
