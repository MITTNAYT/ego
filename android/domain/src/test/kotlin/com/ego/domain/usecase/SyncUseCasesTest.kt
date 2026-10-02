package com.ego.domain.usecase

import com.ego.domain.model.EgoBackup
import com.ego.domain.model.PlaylistBackupItem
import com.ego.domain.repository.MusicRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.emptyFlow
import kotlinx.coroutines.test.runTest
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test

class SyncUseCasesTest {

    private lateinit var fakeMusicRepository: FakeMusicRepository
    private lateinit var exportBackupUseCase: ExportBackupUseCase
    private lateinit var importBackupUseCase: ImportBackupUseCase

    @Before
    fun setup() {
        fakeMusicRepository = FakeMusicRepository()
        exportBackupUseCase = ExportBackupUseCase(fakeMusicRepository)
        importBackupUseCase = ImportBackupUseCase(fakeMusicRepository)
    }

    @Test
    fun `exportBackupUseCase generates valid EgoBackup format with client and track IDs`() = runTest {
        val likedTracks = listOf("track-1", "track-3")
        val history = listOf("track-2", "track-1")
        val playlists = listOf(
            PlaylistBackupItem(
                id = "pl-synth",
                title = "Synthwave Vault",
                trackIds = listOf("track-1", "track-2")
            )
        )

        val backup = exportBackupUseCase(
            likedTrackIds = likedTracks,
            recentlyPlayedIds = history,
            playlists = playlists
        )

        assertEquals("Ego Music Player", backup.appName)
        assertEquals("android", backup.client)
        assertEquals(1, backup.schemaVersion)
        assertEquals(2, backup.likedTrackIds.size)
        assertEquals("track-1", backup.likedTrackIds[0])
        assertEquals(1, backup.playlists.size)
        assertEquals("Synthwave Vault", backup.playlists[0].title)
    }

    @Test
    fun `importBackupUseCase successfully toggles likes for all imported tracks`() = runTest {
        val backup = EgoBackup(
            schemaVersion = 1,
            appName = "Ego Music Player",
            client = "web",
            exportedAt = "2026-10-02T13:00:00Z",
            likedTrackIds = listOf("track-10", "track-20")
        )

        val result = importBackupUseCase(backup)

        assertTrue(result.isSuccess)
        assertEquals(2, result.getOrNull())
        assertTrue(fakeMusicRepository.toggledIds.contains("track-10"))
        assertTrue(fakeMusicRepository.toggledIds.contains("track-20"))
    }

    private class FakeMusicRepository : MusicRepository {
        val toggledIds = mutableListOf<String>()

        override fun getTrendingTracks(): Flow<List<com.ego.domain.model.Track>> = emptyFlow()
        override fun getPopularArtists(): Flow<List<com.ego.domain.model.Artist>> = emptyFlow()
        override fun getRecentlyPlayed(): Flow<List<com.ego.domain.model.Track>> = emptyFlow()
        override fun getCollections(): Flow<List<com.ego.domain.model.CollectionItem>> = emptyFlow()
        override fun getAllTracks(): Flow<List<com.ego.domain.model.Track>> = emptyFlow()
        override fun searchTracks(query: String): Flow<List<com.ego.domain.model.Track>> = emptyFlow()

        override suspend fun toggleLike(trackId: String): Result<Boolean> {
            toggledIds.add(trackId)
            return Result.success(true)
        }

        override suspend fun scanLocalMusic(): Result<List<com.ego.domain.model.Track>> {
            return Result.success(emptyList())
        }
    }
}
