package com.ego.music

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import com.ego.music.ui.MainViewModel
import com.ego.music.ui.equalizer.EqualizerDialog
import com.ego.music.ui.home.HomeScreen
import com.ego.music.ui.lyrics.LyricsSheet
import com.ego.music.ui.navigation.EgoBottomNavigation
import com.ego.music.ui.player.BottomPlayerPill
import com.ego.music.ui.player.NowPlayingSheet
import com.ego.music.ui.theme.BgDesktop
import com.ego.music.ui.theme.EgoTheme

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val app = application as EgoApplication
        val viewModel = MainViewModel(
            getHomeDataUseCase = app.getHomeDataUseCase,
            observePlaybackStateUseCase = app.observePlaybackStateUseCase,
            playTrackUseCase = app.playTrackUseCase,
            togglePlayPauseUseCase = app.togglePlayPauseUseCase,
            nextTrackUseCase = app.nextTrackUseCase,
            previousTrackUseCase = app.previousTrackUseCase,
            seekToPositionUseCase = app.seekToPositionUseCase,
            setVolumeUseCase = app.setVolumeUseCase,
            manageEqualizerUseCase = app.manageEqualizerUseCase,
            musicRepository = app.musicRepository
        )

        setContent {
            EgoTheme {
                val uiState by viewModel.uiState.collectAsState()

                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(BgDesktop)
                ) {
                    Scaffold(
                        bottomBar = {
                            Column {
                                // Floating Player Pill docked above bottom navigation
                                if (uiState.playbackState.currentTrack != null && !uiState.isNowPlayingExpanded) {
                                    BottomPlayerPill(
                                        playbackState = uiState.playbackState,
                                        onTogglePlayPause = { viewModel.togglePlayPause() },
                                        onNextTrack = { viewModel.nextTrack() },
                                        onExpandNowPlaying = { viewModel.toggleNowPlayingExpanded(true) }
                                    )
                                }

                                EgoBottomNavigation(
                                    currentTab = uiState.currentNavigationTab,
                                    onTabSelected = { viewModel.setNavigationTab(it) }
                                )
                            }
                        }
                    ) { innerPadding ->
                        HomeScreen(
                            homeData = uiState.homeData,
                            currentPlayingTrackId = uiState.playbackState.currentTrack?.id,
                            onTrackClick = { track -> viewModel.playTrack(track) },
                            onArtistClick = { /* Filter by artist */ },
                            modifier = Modifier.padding(innerPadding)
                        )
                    }

                    // Fullscreen Now Playing Sheet
                    AnimatedVisibility(
                        visible = uiState.isNowPlayingExpanded,
                        enter = slideInVertically(initialOffsetY = { it }),
                        exit = slideOutVertically(targetOffsetY = { it })
                    ) {
                        NowPlayingSheet(
                            playbackState = uiState.playbackState,
                            onCollapse = { viewModel.toggleNowPlayingExpanded(false) },
                            onTogglePlayPause = { viewModel.togglePlayPause() },
                            onNext = { viewModel.nextTrack() },
                            onPrevious = { viewModel.previousTrack() },
                            onSeekTo = { viewModel.seekTo(it) },
                            onToggleLike = { viewModel.toggleLike(it) },
                            onOpenEqualizer = { viewModel.toggleEqualizer(true) },
                            onOpenLyrics = { viewModel.toggleLyrics(true) },
                            onPlayQueueTrack = { viewModel.playTrack(it) }
                        )
                    }

                    // Synced Lyrics Sheet
                    AnimatedVisibility(
                        visible = uiState.isLyricsOpen && uiState.playbackState.currentTrack != null,
                        enter = slideInVertically(initialOffsetY = { it }),
                        exit = slideOutVertically(targetOffsetY = { it })
                    ) {
                        uiState.playbackState.currentTrack?.let { track ->
                            LyricsSheet(
                                track = track,
                                currentPositionMs = uiState.playbackState.positionMs,
                                onSeekTo = { viewModel.seekTo(it) },
                                onClose = { viewModel.toggleLyrics(false) }
                            )
                        }
                    }

                    // Equalizer Dialog
                    if (uiState.isEqualizerOpen) {
                        EqualizerDialog(
                            bands = uiState.equalizerBands,
                            onSetGain = { idx, gain -> viewModel.setEqualizerGain(idx, gain) },
                            onReset = { viewModel.resetEqualizer() },
                            onDismiss = { viewModel.toggleEqualizer(false) }
                        )
                    }
                }
            }
        }
    }
}
