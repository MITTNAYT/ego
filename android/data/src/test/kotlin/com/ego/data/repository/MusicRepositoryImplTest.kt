package com.ego.data.repository

import kotlinx.coroutines.flow.first
import kotlinx.coroutines.test.runTest
import org.junit.Assert.*
import org.junit.Before
import org.junit.Test

class MusicRepositoryImplTest {

    private lateinit var repository: MusicRepositoryImpl

    @Before
    fun setup() {
        repository = MusicRepositoryImpl()
    }

    @Test
    fun `getTrendingTracks returns expected Frank Ocean, Yoasobi, and Jaden tracks`() = runTest {
        val trending = repository.getTrendingTracks().first()

        assertEquals(3, trending.size)
        val titles = trending.map { it.title }
        assertTrue(titles.contains("Pink + White"))
        assertTrue(titles.contains("Yoru ni Kakeru"))
        assertTrue(titles.contains("Syre"))
    }

    @Test
    fun `searchTracks filters by track title case-insensitively`() = runTest {
        val results = repository.searchTracks("pink").first()

        assertEquals(1, results.size)
        assertEquals("Pink + White", results[0].title)
    }

    @Test
    fun `searchTracks filters by artist name`() = runTest {
        val results = repository.searchTracks("cigarettes").first()

        assertTrue(results.isNotEmpty())
        assertEquals("Cigarettes After Sex", results[0].artist)
    }

    @Test
    fun `toggleLike updates liked state reactively`() = runTest {
        val trackId = "track-syre"

        // Initially not in default likes
        val initialTracks = repository.getAllTracks().first()
        val initialTrack = initialTracks.first { it.id == trackId }
        assertFalse(initialTrack.isLiked)

        // Toggle like to ON
        val toggleResult = repository.toggleLike(trackId)
        assertTrue(toggleResult.isSuccess)
        assertTrue(toggleResult.getOrThrow())

        // Verify updated in stream
        val updatedTracks = repository.getAllTracks().first()
        val updatedTrack = updatedTracks.first { it.id == trackId }
        assertTrue(updatedTrack.isLiked)

        // Toggle like to OFF
        val toggleOffResult = repository.toggleLike(trackId)
        assertTrue(toggleOffResult.isSuccess)
        assertFalse(toggleOffResult.getOrThrow())

        // Verify updated again
        val finalTracks = repository.getAllTracks().first()
        val finalTrack = finalTracks.first { it.id == trackId }
        assertFalse(finalTrack.isLiked)
    }
}
