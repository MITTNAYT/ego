package com.ego.data.playback

import com.ego.core.DispatcherProvider
import com.ego.data.datasource.InMemoryMusicDataSource
import com.ego.domain.model.EqualizerBand
import com.ego.domain.model.PlaybackState
import com.ego.domain.model.RepeatMode
import com.ego.domain.model.Track
import com.ego.domain.repository.PlaybackRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch

class PlaybackRepositoryImpl(
    private val dispatchers: DispatcherProvider,
    private val scope: CoroutineScope,
    dataSource: InMemoryMusicDataSource = InMemoryMusicDataSource()
) : PlaybackRepository {

    private val defaultQueue = dataSource.sampleTracks.filter {
        it.id in listOf("track-sweet", "track-heavenly", "track-apocalypse")
    }

    private val defaultTrack = dataSource.sampleTracks.find { it.id == "track-cry" }
        ?: dataSource.sampleTracks.first()

    private val _playbackState = MutableStateFlow(
        PlaybackState(
            currentTrack = defaultTrack,
            isPlaying = false,
            positionMs = 72_000L, // 1:12 matching desktop reference
            durationMs = (defaultTrack.durationSec * 1000).toLong(),
            queue = defaultQueue
        )
    )
    override val playbackState: StateFlow<PlaybackState> = _playbackState.asStateFlow()

    private val defaultBands = listOf(
        EqualizerBand(0, 32, 0f),
        EqualizerBand(1, 64, 0f),
        EqualizerBand(2, 125, 0f),
        EqualizerBand(3, 250, 0f),
        EqualizerBand(4, 500, 0f),
        EqualizerBand(5, 1000, 0f),
        EqualizerBand(6, 2000, 0f),
        EqualizerBand(7, 4000, 0f),
        EqualizerBand(8, 8000, 0f),
        EqualizerBand(9, 16000, 0f)
    )

    private val _equalizerBands = MutableStateFlow(defaultBands)
    override val equalizerBands: StateFlow<List<EqualizerBand>> = _equalizerBands.asStateFlow()

    private var progressJob: Job? = null

    override suspend fun play(track: Track, playlist: List<Track>) {
        val newQueue = if (playlist.isNotEmpty()) playlist.filter { it.id != track.id } else _playbackState.value.queue
        _playbackState.update {
            it.copy(
                currentTrack = track,
                isPlaying = true,
                positionMs = 0L,
                durationMs = (track.durationSec * 1000).toLong(),
                queue = newQueue
            )
        }
        startProgressLoop()
    }

    override suspend fun pause() {
        _playbackState.update { it.copy(isPlaying = false) }
        progressJob?.cancel()
    }

    override suspend fun resume() {
        _playbackState.update { it.copy(isPlaying = true) }
        startProgressLoop()
    }

    override suspend fun togglePlayPause() {
        if (_playbackState.value.isPlaying) pause() else resume()
    }

    override suspend fun next() {
        val q = _playbackState.value.queue
        if (q.isNotEmpty()) {
            val nextTrack = q.first()
            val remainingQueue = q.drop(1)
            _playbackState.update {
                it.copy(
                    currentTrack = nextTrack,
                    isPlaying = true,
                    positionMs = 0L,
                    durationMs = (nextTrack.durationSec * 1000).toLong(),
                    queue = remainingQueue
                )
            }
            startProgressLoop()
        }
    }

    override suspend fun previous() {
        val cur = _playbackState.value
        if (cur.positionMs > 3000L) {
            seekTo(0L)
        } else {
            seekTo(0L)
        }
    }

    override suspend fun seekTo(positionMs: Long) {
        val dur = _playbackState.value.durationMs
        val clamped = positionMs.coerceIn(0L, if (dur > 0) dur else Long.MAX_VALUE)
        _playbackState.update { it.copy(positionMs = clamped) }
    }

    override suspend fun setVolume(volume: Float) {
        _playbackState.update { it.copy(volume = volume.coerceIn(0f, 1f)) }
    }

    override suspend fun toggleShuffle() {
        _playbackState.update { it.copy(isShuffle = !it.isShuffle) }
    }

    override suspend fun toggleRepeat() {
        val nextMode = when (_playbackState.value.repeatMode) {
            RepeatMode.OFF -> RepeatMode.ALL
            RepeatMode.ALL -> RepeatMode.ONE
            RepeatMode.ONE -> RepeatMode.OFF
        }
        _playbackState.update { it.copy(repeatMode = nextMode) }
    }

    override suspend fun setEqualizerGain(bandIndex: Int, gainDb: Float) {
        _equalizerBands.update { bands ->
            bands.map { band ->
                if (band.index == bandIndex) band.copy(gainDb = gainDb.coerceIn(band.minGainDb, band.maxGainDb))
                else band
            }
        }
    }

    override suspend fun resetEqualizer() {
        _equalizerBands.value = defaultBands
    }

    private fun startProgressLoop() {
        progressJob?.cancel()
        progressJob = scope.launch(dispatchers.default) {
            while (isActive && _playbackState.value.isPlaying) {
                delay(500)
                val cur = _playbackState.value
                val nextPos = cur.positionMs + 500
                if (cur.durationMs > 0 && nextPos >= cur.durationMs) {
                    when (cur.repeatMode) {
                        RepeatMode.ONE -> seekTo(0L)
                        else -> next()
                    }
                } else {
                    _playbackState.update { it.copy(positionMs = nextPos) }
                }
            }
        }
    }
}
