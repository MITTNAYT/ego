package com.ego.domain.usecase

import com.ego.domain.model.EqualizerBand
import com.ego.domain.model.PlaybackState
import com.ego.domain.model.Track
import com.ego.domain.repository.PlaybackRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.test.runTest
import org.junit.Assert.*
import org.junit.Before
import org.junit.Test

class PlaybackUseCasesTest {

    private lateinit var fakePlaybackRepository: FakePlaybackRepository
    private lateinit var playTrackUseCase: PlayTrackUseCase
    private lateinit var togglePlayPauseUseCase: TogglePlayPauseUseCase
    private lateinit var seekToPositionUseCase: SeekToPositionUseCase

    private val testTrack = Track(
        id = "test-1",
        title = "Cry",
        artist = "Cigarettes After Sex",
        album = "Cry",
        durationSec = 234,
        audioUri = "uri",
        coverUri = "cover"
    )

    @Before
    fun setup() {
        fakePlaybackRepository = FakePlaybackRepository()
        playTrackUseCase = PlayTrackUseCase(fakePlaybackRepository)
        togglePlayPauseUseCase = TogglePlayPauseUseCase(fakePlaybackRepository)
        seekToPositionUseCase = SeekToPositionUseCase(fakePlaybackRepository)
    }

    @Test
    fun `playTrackUseCase updates current track and starts playback`() = runTest {
        playTrackUseCase(testTrack)

        val state = fakePlaybackRepository.playbackState.value
        assertEquals("test-1", state.currentTrack?.id)
        assertTrue(state.isPlaying)
    }

    @Test
    fun `togglePlayPauseUseCase switches playback state`() = runTest {
        playTrackUseCase(testTrack)
        assertTrue(fakePlaybackRepository.playbackState.value.isPlaying)

        togglePlayPauseUseCase()
        assertFalse(fakePlaybackRepository.playbackState.value.isPlaying)

        togglePlayPauseUseCase()
        assertTrue(fakePlaybackRepository.playbackState.value.isPlaying)
    }

    @Test
    fun `seekToPositionUseCase clamps and sets track position`() = runTest {
        playTrackUseCase(testTrack)
        seekToPositionUseCase(45000L)

        assertEquals(45000L, fakePlaybackRepository.playbackState.value.positionMs)
    }

    private class FakePlaybackRepository : PlaybackRepository {
        private val _state = MutableStateFlow(PlaybackState())
        override val playbackState: StateFlow<PlaybackState> = _state.asStateFlow()

        private val _bands = MutableStateFlow<List<EqualizerBand>>(emptyList())
        override val equalizerBands: StateFlow<List<EqualizerBand>> = _bands.asStateFlow()

        override suspend fun play(track: Track, playlist: List<Track>) {
            _state.value = _state.value.copy(
                currentTrack = track,
                isPlaying = true,
                positionMs = 0L,
                durationMs = (track.durationSec * 1000).toLong()
            )
        }

        override suspend fun pause() {
            _state.value = _state.value.copy(isPlaying = false)
        }

        override suspend fun resume() {
            _state.value = _state.value.copy(isPlaying = true)
        }

        override suspend fun togglePlayPause() {
            _state.value = _state.value.copy(isPlaying = !_state.value.isPlaying)
        }

        override suspend fun next() {}
        override suspend fun previous() {}

        override suspend fun seekTo(positionMs: Long) {
            _state.value = _state.value.copy(positionMs = positionMs)
        }

        override suspend fun setVolume(volume: Float) {
            _state.value = _state.value.copy(volume = volume)
        }

        override suspend fun toggleShuffle() {}
        override suspend fun toggleRepeat() {}
        override suspend fun setEqualizerGain(bandIndex: Int, gainDb: Float) {}
        override suspend fun resetEqualizer() {}
    }
}
