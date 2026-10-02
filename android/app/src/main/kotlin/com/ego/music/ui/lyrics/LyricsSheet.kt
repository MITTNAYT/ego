package com.ego.music.ui.lyrics

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ego.domain.model.Track
import com.ego.music.ui.theme.*

@Composable
fun LyricsSheet(
    track: Track,
    currentPositionMs: Long,
    onSeekTo: (Long) -> Unit,
    onClose: () -> Unit,
    modifier: Modifier = Modifier
) {
    var showRomanized by remember { mutableStateOf(false) }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(BgWindow)
            .statusBarsPadding()
            .padding(horizontal = 24.dp)
    ) {
        // Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 18.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "Live Synced Lyrics",
                    color = TextWhite,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = "${track.title} • ${track.artist}",
                    color = TextTertiary,
                    fontSize = 12.sp
                )
            }

            Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
                // Romanize toggle chip
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp))
                        .background(if (showRomanized) TextWhite else BgCard)
                        .clickable { showRomanized = !showRomanized }
                        .padding(horizontal = 10.dp, vertical = 5.dp)
                ) {
                    Text(
                        text = "Romaji",
                        color = if (showRomanized) BgDesktop else TextSecondary,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold
                    )
                }

                IconButton(onClick = onClose) {
                    Icon(
                        imageVector = Icons.Default.Close,
                        contentDescription = "Close",
                        tint = TextSecondary
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Lyrics Scroll List
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(vertical = 40.dp),
            verticalArrangement = Arrangement.spacedBy(24.dp)
        ) {
            itemsIndexed(track.lyrics) { index, lyric ->
                val nextTime = track.lyrics.getOrNull(index + 1)?.timeMs ?: Long.MAX_VALUE
                val isActive = currentPositionMs >= lyric.timeMs && currentPositionMs < nextTime

                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { onSeekTo(lyric.timeMs) }
                        .padding(vertical = 4.dp)
                ) {
                    Text(
                        text = lyric.text,
                        color = if (isActive) TextWhite else TextMuted,
                        fontSize = if (isActive) 24.sp else 18.sp,
                        fontWeight = if (isActive) FontWeight.Bold else FontWeight.Medium
                    )

                    val romanizedText = lyric.romanized
                    if (showRomanized && romanizedText != null) {
                        Text(
                            text = romanizedText,
                            color = if (isActive) TextSecondary else TextMuted,
                            fontSize = 14.sp,
                            modifier = Modifier.padding(top = 4.dp)
                        )
                    }
                }
            }
        }
    }
}
