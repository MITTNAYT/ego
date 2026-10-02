package com.ego.domain.usecase

import com.ego.domain.model.EgoBackup
import com.ego.domain.model.PlaylistBackupItem
import com.ego.domain.repository.MusicRepository

/**
 * UseCase to generate a cross-platform backup model from current state and repository.
 */
class ExportBackupUseCase(
    private val musicRepository: MusicRepository
) {
    suspend operator fun invoke(
        likedTrackIds: List<String>,
        recentlyPlayedIds: List<String>,
        playlists: List<PlaylistBackupItem> = emptyList()
    ): EgoBackup {
        return EgoBackup(
            schemaVersion = 1,
            appName = "Ego Music Player",
            client = "android",
            exportedAt = java.time.Instant.now().toString(),
            likedTrackIds = likedTrackIds,
            playlists = playlists,
            recentlyPlayedIds = recentlyPlayedIds
        )
    }
}

/**
 * UseCase to validate and import a cross-platform backup into the repository.
 */
class ImportBackupUseCase(
    private val musicRepository: MusicRepository
) {
    suspend operator fun invoke(backup: EgoBackup): Result<Int> {
        return runCatching {
            var restoredCount = 0
            backup.likedTrackIds.forEach { trackId ->
                musicRepository.toggleLike(trackId)
                restoredCount++
            }
            restoredCount
        }
    }
}
