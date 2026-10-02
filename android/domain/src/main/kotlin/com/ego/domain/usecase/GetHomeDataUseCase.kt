package com.ego.domain.usecase

import com.ego.domain.model.Artist
import com.ego.domain.model.CollectionItem
import com.ego.domain.model.Track
import com.ego.domain.repository.MusicRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.combine

data class HomeData(
    val trendingTracks: List<Track>,
    val popularArtists: List<Artist>,
    val recentlyPlayed: List<Track>,
    val collections: List<CollectionItem>
)

class GetHomeDataUseCase(
    private val musicRepository: MusicRepository
) {
    operator fun invoke(): Flow<HomeData> {
        return combine(
            musicRepository.getTrendingTracks(),
            musicRepository.getPopularArtists(),
            musicRepository.getRecentlyPlayed(),
            musicRepository.getCollections()
        ) { trending, artists, recent, collections ->
            HomeData(
                trendingTracks = trending,
                popularArtists = artists,
                recentlyPlayed = recent,
                collections = collections
            )
        }
    }
}
