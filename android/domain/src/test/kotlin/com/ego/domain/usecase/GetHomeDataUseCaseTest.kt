package com.ego.domain.usecase

import com.ego.domain.model.*
import com.ego.domain.repository.MusicRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.test.runTest
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Before
import org.junit.Test

class GetHomeDataUseCaseTest {

    private lateinit var fakeMusicRepository: FakeMusicRepository
    private lateinit var useCase: GetHomeDataUseCase

    @Before
    fun setup() {
        fakeMusicRepository = FakeMusicRepository()
        useCase = GetHomeDataUseCase(fakeMusicRepository)
    }

    @Test
    fun `invoke combines trending tracks, artists, and recently played accurately`() = runTest {
        val result = useCase().first()

        assertNotNull(result)
        assertEquals(2, result.trendingTracks.size)
        assertEquals("Pink + White", result.trendingTracks[0].title)
        assertEquals(2, result.popularArtists.size)
        assertEquals("JVKE", result.popularArtists[0].name)
        assertEquals(1, result.recentlyPlayed.size)
        assertEquals("Cry", result.recentlyPlayed[0].title)
        assertEquals(1, result.collections.size)
        assertEquals("Study lofi", result.collections[0].name)
    }

    private class FakeMusicRepository : MusicRepository {
        val tracks = listOf(
            Track("t1", "Pink + White", "Frank Ocean", "Blonde", 184, "uri1", "cover1"),
            Track("t2", "Yoru ni Kakeru", "Yoasobi", "The Book", 261, "uri2", "cover2")
        )
        val artists = listOf(
            Artist("a1", "JVKE", "avatar1", "14M"),
            Artist("a2", "The Weeknd", "avatar2", "100M")
        )
        val recent = listOf(
            Track("t3", "Cry", "Cigarettes After Sex", "Cry", 234, "uri3", "cover3")
        )
        val collections = listOf(
            CollectionItem("c1", "Study lofi", CollectionType.PLAYLIST, "cover1", 50)
        )

        override fun getTrendingTracks(): Flow<List<Track>> = flowOf(tracks)
        override fun getPopularArtists(): Flow<List<Artist>> = flowOf(artists)
        override fun getRecentlyPlayed(): Flow<List<Track>> = flowOf(recent)
        override fun getCollections(): Flow<List<CollectionItem>> = flowOf(collections)
        override fun getAllTracks(): Flow<List<Track>> = flowOf(tracks + recent)
        override fun searchTracks(query: String): Flow<List<Track>> = flowOf(emptyList())
        override suspend fun toggleLike(trackId: String): Result<Boolean> = Result.success(true)
        override suspend fun scanLocalMusic(): Result<List<Track>> = Result.success(tracks)
    }
}
