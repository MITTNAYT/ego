package com.ego.domain.usecase

import com.ego.domain.model.EqualizerBand
import com.ego.domain.model.PlaybackState
import com.ego.domain.model.Track
import com.ego.domain.repository.PlaybackRepository
import kotlinx.coroutines.flow.StateFlow

class PlayTrackUseCase(
    private val playbackRepository: PlaybackRepository
) {
    suspend operator fun invoke(track: Track, playlist: List<Track> = listOf(track)) {
        playbackRepository.play(track, playlist)
    }
}

class TogglePlayPauseUseCase(
    private val playbackRepository: PlaybackRepository
) {
    suspend operator fun invoke() {
        playbackRepository.togglePlayPause()
    }
}

class NextTrackUseCase(
    private val playbackRepository: PlaybackRepository
) {
    suspend operator fun invoke() {
        playbackRepository.next()
    }
}

class PreviousTrackUseCase(
    private val playbackRepository: PlaybackRepository
) {
    suspend operator fun invoke() {
        playbackRepository.previous()
    }
}

class SeekToPositionUseCase(
    private val playbackRepository: PlaybackRepository
) {
    suspend operator fun invoke(positionMs: Long) {
        playbackRepository.seekTo(positionMs)
    }
}

class SetVolumeUseCase(
    private val playbackRepository: PlaybackRepository
) {
    suspend operator fun invoke(volume: Float) {
        playbackRepository.setVolume(volume.coerceIn(0f, 1f))
    }
}

class ObservePlaybackStateUseCase(
    private val playbackRepository: PlaybackRepository
) {
    operator fun invoke(): StateFlow<PlaybackState> = playbackRepository.playbackState
}

class ManageEqualizerUseCase(
    private val playbackRepository: PlaybackRepository
) {
    val bands: StateFlow<List<EqualizerBand>> get() = playbackRepository.equalizerBands

    suspend fun setGain(bandIndex: Int, gainDb: Float) {
        playbackRepository.setEqualizerGain(bandIndex, gainDb)
    }

    suspend fun reset() {
        playbackRepository.resetEqualizer()
    }
}
