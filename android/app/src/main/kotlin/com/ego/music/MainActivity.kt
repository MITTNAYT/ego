package com.ego.music

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.animation.*
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.spring
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.platform.LocalHapticFeedback
import com.ego.domain.model.Artist
import com.ego.music.ui.MainViewModel
import com.ego.music.ui.NavigationTab
import com.ego.music.ui.artist.ArtistDetailScreen
import com.ego.music.ui.collections.CollectionsScreen
import com.ego.music.ui.equalizer.EqualizerDialog
import com.ego.music.ui.home.HomeScreen
import com.ego.music.ui.lyrics.LyricsSheet
import com.ego.music.ui.navigation.EgoBottomNavigation
import com.ego.music.ui.player.BottomPlayerPill
import com.ego.music.ui.player.NowPlayingSheet
import com.ego.music.ui.search.SearchScreen
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
                val haptic = LocalHapticFeedback.current
                var selectedArtist by remember { mutableStateOf<Artist?>(null) }

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
                                        onTogglePlayPause = {
                                            haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                                            viewModel.togglePlayPause()
                                        },
                                        onNextTrack = {
                                            haptic.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                                            viewModel.nextTrack()
                                        },
                                        onExpandNowPlaying = {
                                            haptic.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                                            viewModel.toggleNowPlayingExpanded(true)
                                        }
                                    )
                                }

                                EgoBottomNavigation(
                                    currentTab = uiState.currentNavigationTab,
                                    onTabSelected = {
                                        haptic.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                                        selectedArtist = null
                                        viewModel.setNavigationTab(it)
                                    }
                                )
                            }
                        }
                    ) { innerPadding ->
                        val screenModifier = Modifier.padding(innerPadding)

                        if (selectedArtist != null) {
                            val artist = selectedArtist!!
                            val artistTracks = (uiState.homeData?.trendingTracks ?: emptyList()) +
                                    (uiState.homeData?.recentlyPlayed ?: emptyList())
                            ArtistDetailScreen(
                                artist = artist,
                                artistTracks = artistTracks.filter { it.artist.contains(artist.name, ignoreCase = true) },
                                onPlayTrack = {
                                    haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                                    viewModel.playTrack(it)
                                },
                                onBack = { selectedArtist = null },
                                modifier = screenModifier
                            )
                        } else {
                            when (uiState.currentNavigationTab) {
                                NavigationTab.HOME -> {
                                    HomeScreen(
                                        homeData = uiState.homeData,
                                        currentPlayingTrackId = uiState.playbackState.currentTrack?.id,
                                        onTrackClick = {
                                            haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                                            viewModel.playTrack(it)
                                        },
                                        onArtistClick = { artist ->
                                            haptic.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                                            selectedArtist = artist
                                        },
                                        modifier = screenModifier
                                    )
                                }
                                NavigationTab.SONGS, NavigationTab.SETTINGS -> {
                                    val allTracks = (uiState.homeData?.trendingTracks ?: emptyList()) +
                                            (uiState.homeData?.recentlyPlayed ?: emptyList())
                                    SearchScreen(
                                        allTracks = allTracks.distinctBy { it.id },
                                        onPlayTrack = {
                                            haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                                            viewModel.playTrack(it)
                                        },
                                        modifier = screenModifier
                                    )
                                }
                                NavigationTab.ARTISTS -> {
                                    HomeScreen(
                                        homeData = uiState.homeData,
                                        currentPlayingTrackId = uiState.playbackState.currentTrack?.id,
                                        onTrackClick = { viewModel.playTrack(it) },
                                        onArtistClick = { selectedArtist = it },
                                        modifier = screenModifier
                                    )
                                }
                                NavigationTab.COLLECTIONS -> {
                                    CollectionsScreen(
                                        collections = uiState.homeData?.collections ?: emptyList(),
                                        onSelectCollection = {
                                            haptic.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                                        },
                                        onOpenLocalMusic = {
                                            haptic.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                                        },
                                        modifier = screenModifier
                                    )
                                }
                            }
                        }
                    }

                    // Physics-based spring animated Fullscreen Now Playing Sheet
                    AnimatedVisibility(
                        visible = uiState.isNowPlayingExpanded,
                        enter = slideInVertically(
                            animationSpec = spring(
                                dampingRatio = Spring.DampingRatioLowBouncy,
                                stiffness = Spring.StiffnessMediumLow
                            ),
                            initialOffsetY = { it }
                        ),
                        exit = slideOutVertically(
                            animationSpec = spring(
                                dampingRatio = Spring.DampingRatioNoBouncy,
                                stiffness = Spring.StiffnessMedium
                            ),
                            targetOffsetY = { it }
                        )
                    ) {
                        NowPlayingSheet(
                            playbackState = uiState.playbackState,
                            onCollapse = {
                                haptic.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                                viewModel.toggleNowPlayingExpanded(false)
                            },
                            onTogglePlayPause = {
                                haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                                viewModel.togglePlayPause()
                            },
                            onNext = {
                                haptic.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                                viewModel.nextTrack()
                            },
                            onPrevious = {
                                haptic.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                                viewModel.previousTrack()
                            },
                            onSeekTo = { viewModel.seekTo(it) },
                            onToggleLike = {
                                haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                                viewModel.toggleLike(it)
                            },
                            onOpenEqualizer = { viewModel.toggleEqualizer(true) },
                            onOpenLyrics = { viewModel.toggleLyrics(true) },
                            onPlayQueueTrack = {
                                haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                                viewModel.playTrack(it)
                            }
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
