package com.ego.music

import android.app.Application
import com.ego.core.DefaultDispatcherProvider
import com.ego.data.playback.PlaybackRepositoryImpl
import com.ego.data.repository.MusicRepositoryImpl
import com.ego.domain.repository.MusicRepository
import com.ego.domain.repository.PlaybackRepository
import com.ego.domain.usecase.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.SupervisorJob

class EgoApplication : Application() {

    private val applicationScope = CoroutineScope(SupervisorJob())
    val dispatchers = DefaultDispatcherProvider()

    val musicRepository: MusicRepository by lazy {
        MusicRepositoryImpl()
    }

    val playbackRepository: PlaybackRepository by lazy {
        PlaybackRepositoryImpl(
            dispatchers = dispatchers,
            scope = applicationScope
        )
    }

    // UseCases
    val getHomeDataUseCase by lazy { GetHomeDataUseCase(musicRepository) }
    val observePlaybackStateUseCase by lazy { ObservePlaybackStateUseCase(playbackRepository) }
    val playTrackUseCase by lazy { PlayTrackUseCase(playbackRepository) }
    val togglePlayPauseUseCase by lazy { TogglePlayPauseUseCase(playbackRepository) }
    val nextTrackUseCase by lazy { NextTrackUseCase(playbackRepository) }
    val previousTrackUseCase by lazy { PreviousTrackUseCase(playbackRepository) }
    val seekToPositionUseCase by lazy { SeekToPositionUseCase(playbackRepository) }
    val setVolumeUseCase by lazy { SetVolumeUseCase(playbackRepository) }
    val manageEqualizerUseCase by lazy { ManageEqualizerUseCase(playbackRepository) }
}
