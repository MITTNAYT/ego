package com.ego.music.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.ego.domain.model.EqualizerBand
import com.ego.domain.model.PlaybackState
import com.ego.domain.model.Track
import com.ego.domain.repository.MusicRepository
import com.ego.domain.usecase.*
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

data class MainUiState(
    val homeData: HomeData? = null,
    val playbackState: PlaybackState = PlaybackState(),
    val equalizerBands: List<EqualizerBand> = emptyList(),
    val isNowPlayingExpanded: Boolean = false,
    val isEqualizerOpen: Boolean = false,
    val isLyricsOpen: Boolean = false,
    val currentNavigationTab: NavigationTab = NavigationTab.HOME
)

enum class NavigationTab {
    HOME, SONGS, ARTISTS, COLLECTIONS, SETTINGS
}

class MainViewModel(
    private val getHomeDataUseCase: GetHomeDataUseCase,
    private val observePlaybackStateUseCase: ObservePlaybackStateUseCase,
    private val playTrackUseCase: PlayTrackUseCase,
    private val togglePlayPauseUseCase: TogglePlayPauseUseCase,
    private val nextTrackUseCase: NextTrackUseCase,
    private val previousTrackUseCase: PreviousTrackUseCase,
    private val seekToPositionUseCase: SeekToPositionUseCase,
    private val setVolumeUseCase: SetVolumeUseCase,
    private val manageEqualizerUseCase: ManageEqualizerUseCase,
    private val musicRepository: MusicRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(MainUiState())
    val uiState: StateFlow<MainUiState> = _uiState.asStateFlow()

    init {
        // Collect Home Data
        viewModelScope.launch {
            getHomeDataUseCase().collect { data ->
                _uiState.update { it.copy(homeData = data) }
            }
        }

        // Collect Playback State
        viewModelScope.launch {
            observePlaybackStateUseCase().collect { state ->
                _uiState.update { it.copy(playbackState = state) }
            }
        }

        // Collect Equalizer Bands
        viewModelScope.launch {
            manageEqualizerUseCase.bands.collect { bands ->
                _uiState.update { it.copy(equalizerBands = bands) }
            }
        }
    }

    fun playTrack(track: Track, playlist: List<Track> = listOf(track)) {
        viewModelScope.launch {
            playTrackUseCase(track, playlist)
        }
    }

    fun togglePlayPause() {
        viewModelScope.launch {
            togglePlayPauseUseCase()
        }
    }

    fun nextTrack() {
        viewModelScope.launch {
            nextTrackUseCase()
        }
    }

    fun previousTrack() {
        viewModelScope.launch {
            previousTrackUseCase()
        }
    }

    fun seekTo(positionMs: Long) {
        viewModelScope.launch {
            seekToPositionUseCase(positionMs)
        }
    }

    fun setVolume(volume: Float) {
        viewModelScope.launch {
            setVolumeUseCase(volume)
        }
    }

    fun setNavigationTab(tab: NavigationTab) {
        _uiState.update { it.copy(currentNavigationTab = tab) }
    }

    fun toggleNowPlayingExpanded(expanded: Boolean) {
        _uiState.update { it.copy(isNowPlayingExpanded = expanded) }
    }

    fun toggleEqualizer(open: Boolean) {
        _uiState.update { it.copy(isEqualizerOpen = open) }
    }

    fun toggleLyrics(open: Boolean) {
        _uiState.update { it.copy(isLyricsOpen = open) }
    }

    fun setEqualizerGain(index: Int, gainDb: Float) {
        viewModelScope.launch {
            manageEqualizerUseCase.setGain(index, gainDb)
        }
    }

    fun resetEqualizer() {
        viewModelScope.launch {
            manageEqualizerUseCase.reset()
        }
    }

    fun toggleLike(trackId: String) {
        viewModelScope.launch {
            musicRepository.toggleLike(trackId)
        }
    }
}
