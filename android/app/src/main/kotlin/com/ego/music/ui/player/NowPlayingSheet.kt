package com.ego.music.ui.player

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.FavoriteBorder
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ego.domain.model.PlaybackState
import com.ego.domain.model.Track
import com.ego.music.ui.theme.*

@Composable
fun NowPlayingSheet(
    playbackState: PlaybackState,
    onCollapse: () -> Unit,
    onTogglePlayPause: () -> Unit,
    onNext: () -> Unit,
    onPrevious: () -> Unit,
    onSeekTo: (Long) -> Unit,
    onToggleLike: (String) -> Unit,
    onOpenEqualizer: () -> Unit,
    onOpenLyrics: () -> Unit,
    onPlayQueueTrack: (Track) -> Unit,
    modifier: Modifier = Modifier
) {
    val track = playbackState.currentTrack ?: return
    val scrollState = rememberScrollState()

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(BgWindow)
            .statusBarsPadding()
            .padding(horizontal = 24.dp)
            .verticalScroll(scrollState),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Drag Handle / Header Row
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onCollapse) {
                Icon(
                    imageVector = Icons.Default.KeyboardArrowDown,
                    contentDescription = "Collapse",
                    tint = TextSecondary,
                    modifier = Modifier.size(28.dp)
                )
            }

            // Animated Soundwave Indicator
            Row(
                horizontalArrangement = Arrangement.spacedBy(3.dp),
                verticalAlignment = Alignment.Bottom,
                modifier = Modifier.height(14.dp)
            ) {
                repeat(4) { index ->
                    SoundwaveBar(isPlaying = playbackState.isPlaying, delay = index * 150)
                }
            }

            IconButton(onClick = onOpenEqualizer) {
                Icon(
                    imageVector = Icons.Default.Tune,
                    contentDescription = "Equalizer",
                    tint = TextSecondary,
                    modifier = Modifier.size(22.dp)
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Hero Artwork Card
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .aspectRatio(1f)
                .clip(RoundedCornerShape(24.dp))
                .background(BgCard)
                .border(1.dp, BorderSubtle, RoundedCornerShape(24.dp)),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = track.title.take(1),
                color = TextWhite,
                fontSize = 64.sp,
                fontWeight = FontWeight.ExtraBold
            )
        }

        Spacer(modifier = Modifier.height(28.dp))

        // Track Title & Favorite Button
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = track.title,
                    color = TextWhite,
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    maxLines = 1
                )
                Text(
                    text = track.artist,
                    color = TextSecondary,
                    fontSize = 14.sp,
                    modifier = Modifier.padding(top = 2.dp),
                    maxLines = 1
                )
            }

            IconButton(onClick = { onToggleLike(track.id) }) {
                Icon(
                    imageVector = if (track.isLiked) Icons.Default.Favorite else Icons.Outlined.FavoriteBorder,
                    contentDescription = "Like",
                    tint = if (track.isLiked) TextWhite else TextTertiary,
                    modifier = Modifier.size(24.dp)
                )
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Scrubber Slider
        Slider(
            value = playbackState.progressFraction,
            onValueChange = { fraction ->
                val targetMs = (fraction * playbackState.durationMs).toLong()
                onSeekTo(targetMs)
            },
            colors = SliderDefaults.colors(
                thumbColor = TextWhite,
                activeTrackColor = TextWhite,
                inactiveTrackColor = Color(0x33FFFFFF)
            ),
            modifier = Modifier.fillMaxWidth()
        )

        // Timestamps
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(
                text = playbackState.formattedPosition,
                color = TextTertiary,
                fontSize = 12.sp,
                fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace
            )
            Text(
                text = playbackState.formattedDuration,
                color = TextTertiary,
                fontSize = 12.sp,
                fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace
            )
        }

        Spacer(modifier = Modifier.height(18.dp))

        // Transport Controls Row
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceEvenly,
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = {}) {
                Icon(
                    imageVector = Icons.Default.Shuffle,
                    contentDescription = "Shuffle",
                    tint = if (playbackState.isShuffle) TextWhite else TextTertiary
                )
            }

            IconButton(onClick = onPrevious, modifier = Modifier.size(48.dp)) {
                Icon(
                    imageVector = Icons.Default.SkipPrevious,
                    contentDescription = "Previous",
                    tint = TextWhite,
                    modifier = Modifier.size(28.dp)
                )
            }

            // Master Play / Pause Button
            IconButton(
                onClick = onTogglePlayPause,
                modifier = Modifier
                    .size(64.dp)
                    .background(TextWhite, CircleShape)
            ) {
                Icon(
                    imageVector = if (playbackState.isPlaying) Icons.Default.Pause else Icons.Default.PlayArrow,
                    contentDescription = if (playbackState.isPlaying) "Pause" else "Play",
                    tint = BgDesktop,
                    modifier = Modifier.size(32.dp)
                )
            }

            IconButton(onClick = onNext, modifier = Modifier.size(48.dp)) {
                Icon(
                    imageVector = Icons.Default.SkipNext,
                    contentDescription = "Next",
                    tint = TextWhite,
                    modifier = Modifier.size(28.dp)
                )
            }

            IconButton(onClick = {}) {
                Icon(
                    imageVector = Icons.Default.Repeat,
                    contentDescription = "Repeat",
                    tint = TextTertiary
                )
            }
        }

        Spacer(modifier = Modifier.height(28.dp))

        // Tool Action Buttons (Lyrics & EQ)
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Button(
                onClick = onOpenLyrics,
                modifier = Modifier.weight(1f),
                colors = ButtonDefaults.buttonColors(
                    containerColor = BgCard,
                    contentColor = TextWhite
                ),
                shape = RoundedCornerShape(12.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, BorderSubtle)
            ) {
                Icon(
                    imageVector = Icons.Default.Lyrics,
                    contentDescription = null,
                    modifier = Modifier.size(16.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(text = "Synced Lyrics", fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
            }

            Button(
                onClick = onOpenEqualizer,
                modifier = Modifier.weight(1f),
                colors = ButtonDefaults.buttonColors(
                    containerColor = BgCard,
                    contentColor = TextWhite
                ),
                shape = RoundedCornerShape(12.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, BorderSubtle)
            ) {
                Icon(
                    imageVector = Icons.Default.Equalizer,
                    contentDescription = null,
                    modifier = Modifier.size(16.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(text = "10-Band EQ", fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
            }
        }

        Spacer(modifier = Modifier.height(32.dp))

        // Up Next / Queue Section
        Text(
            text = "Up Next in Queue",
            color = TextWhite,
            fontSize = 16.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.align(Alignment.Start)
        )
        Spacer(modifier = Modifier.height(12.dp))

        playbackState.queue.take(4).forEach { queueTrack ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 6.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .background(BgCard)
                    .clickable { onPlayQueueTrack(queueTrack) }
                    .padding(10.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(36.dp)
                        .clip(RoundedCornerShape(6.dp))
                        .background(BgCardElevated),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = queueTrack.title.take(1),
                        color = TextWhite,
                        fontWeight = FontWeight.Bold
                    )
                }

                Spacer(modifier = Modifier.width(12.dp))

                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = queueTrack.title,
                        color = TextWhite,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                    Text(
                        text = queueTrack.artist,
                        color = TextTertiary,
                        fontSize = 11.sp
                    )
                }

                Text(
                    text = queueTrack.formattedDuration,
                    color = TextTertiary,
                    fontSize = 11.sp,
                    fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace
                )
            }
        }

        Spacer(modifier = Modifier.height(48.dp))
    }
}

@Composable
private fun SoundwaveBar(isPlaying: Boolean, delay: Int) {
    val infiniteTransition = rememberInfiniteTransition(label = "eq")
    val heightScale by infiniteTransition.animateFloat(
        initialValue = 0.3f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 600, delayMillis = delay, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "scale"
    )

    Box(
        modifier = Modifier
            .width(2.5.dp)
            .fillMaxHeight(if (isPlaying) heightScale else 0.3f)
            .background(TextWhite, RoundedCornerShape(1.dp))
    )
}
