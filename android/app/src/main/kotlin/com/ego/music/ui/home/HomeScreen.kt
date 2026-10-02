package com.ego.music.ui.home

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Cast
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ego.domain.model.Artist
import com.ego.domain.model.Track
import com.ego.music.ui.HomeData
import com.ego.music.ui.theme.*

@Composable
fun HomeScreen(
    homeData: HomeData?,
    currentPlayingTrackId: String?,
    onTrackClick: (Track) -> Unit,
    onArtistClick: (Artist) -> Unit,
    modifier: Modifier = Modifier
) {
    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(BgDesktop),
        contentPadding = PaddingValues(bottom = 120.dp)
    ) {
        // Top Header Row
        item {
            HeaderSection()
        }

        // Section 1: Trending songs this week
        item {
            SectionTitle(title = "Trending songs this week")
            if (homeData != null) {
                LazyRow(
                    contentPadding = PaddingValues(horizontal = 20.dp),
                    horizontalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    items(homeData.trendingTracks) { track ->
                        TrendingCard(
                            track = track,
                            isPlaying = track.id == currentPlayingTrackId,
                            onClick = { onTrackClick(track) }
                        )
                    }
                }
            }
        }

        // Section 2: Popular artists
        item {
            Spacer(modifier = Modifier.height(28.dp))
            SectionTitle(title = "Popular artists")
            if (homeData != null) {
                LazyRow(
                    contentPadding = PaddingValues(horizontal = 20.dp),
                    horizontalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    items(homeData.popularArtists) { artist ->
                        ArtistItem(
                            artist = artist,
                            onClick = { onArtistClick(artist) }
                        )
                    }
                }
            }
        }

        // Section 3: Recently played
        item {
            Spacer(modifier = Modifier.height(28.dp))
            SectionTitle(title = "Recently played")
        }

        if (homeData != null) {
            items(homeData.recentlyPlayed) { track ->
                RecentTrackRow(
                    track = track,
                    isPlaying = track.id == currentPlayingTrackId,
                    onClick = { onTrackClick(track) }
                )
            }
        }
    }
}

@Composable
private fun HeaderSection() {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp, vertical = 24.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column {
            Text(
                text = "Welcome back, Kenshii!",
                color = TextWhite,
                fontSize = 22.sp,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = "112 new playlist for you",
                color = TextTertiary,
                fontSize = 13.sp,
                modifier = Modifier.padding(top = 2.dp)
            )
        }

        Row(
            horizontalArrangement = Arrangement.spacedBy(10.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(
                onClick = {},
                modifier = Modifier
                    .size(40.dp)
                    .background(BgCard, CircleShape)
                    .border(1.dp, BorderSubtle, CircleShape)
            ) {
                Icon(
                    imageVector = Icons.Default.Search,
                    contentDescription = "Search",
                    tint = TextSecondary,
                    modifier = Modifier.size(18.dp)
                )
            }

            IconButton(
                onClick = {},
                modifier = Modifier
                    .size(40.dp)
                    .background(BgCard, CircleShape)
                    .border(1.dp, BorderSubtle, CircleShape)
            ) {
                Icon(
                    imageVector = Icons.Default.Cast,
                    contentDescription = "AirPlay / Cast",
                    tint = TextSecondary,
                    modifier = Modifier.size(18.dp)
                )
            }

            Box(
                modifier = Modifier
                    .size(40.dp)
                    .clip(CircleShape)
                    .background(BgCardElevated)
                    .border(1.5.dp, BorderBright, CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "K",
                    color = TextWhite,
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp
                )
            }
        }
    }
}

@Composable
private fun SectionTitle(title: String) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp, vertical = 12.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = title,
            color = TextWhite,
            fontSize = 16.sp,
            fontWeight = FontWeight.Bold
        )
        Text(
            text = "See all",
            color = TextTertiary,
            fontSize = 12.sp,
            fontWeight = FontWeight.Medium
        )
    }
}

@Composable
private fun TrendingCard(
    track: Track,
    isPlaying: Boolean,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .width(220.dp)
            .height(140.dp)
            .clip(RoundedCornerShape(16.dp))
            .background(BgCard)
            .border(1.dp, if (isPlaying) TextWhite else BorderSubtle, RoundedCornerShape(16.dp))
            .clickable(onClick = onClick)
    ) {
        // Inner simulated art container
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Color(0xFF16161D))
        )

        // Bottom info strip
        Box(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .fillMaxWidth()
                .background(Color(0xEE0E0E12))
                .border(width = 0.5.dp, color = BorderSubtle)
                .padding(horizontal = 14.dp, vertical = 10.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = track.title,
                        color = TextWhite,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        maxLines = 1
                    )
                    Text(
                        text = track.artist,
                        color = TextSecondary,
                        fontSize = 11.sp,
                        maxLines = 1
                    )
                }
                Text(
                    text = track.formattedDuration,
                    color = TextTertiary,
                    fontSize = 11.sp,
                    fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace
                )
            }
        }
    }
}

@Composable
private fun ArtistItem(
    artist: Artist,
    onClick: () -> Unit
) {
    Column(
        modifier = Modifier
            .width(76.dp)
            .clickable(onClick = onClick),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Box(
            modifier = Modifier
                .size(72.dp)
                .clip(CircleShape)
                .background(BgCardElevated)
                .border(1.dp, BorderMedium, CircleShape),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = artist.name.take(1),
                color = TextWhite,
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold
            )
        }
        Spacer(modifier = Modifier.height(6.dp))
        Text(
            text = artist.name,
            color = TextSecondary,
            fontSize = 12.sp,
            fontWeight = FontWeight.Medium,
            maxLines = 1
        )
    }
}

@Composable
private fun RecentTrackRow(
    track: Track,
    isPlaying: Boolean,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp, vertical = 6.dp)
            .clip(RoundedCornerShape(10.dp))
            .background(if (isPlaying) Color(0x1AFFFFFF) else Color.Transparent)
            .clickable(onClick = onClick)
            .padding(horizontal = 8.dp, vertical = 6.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(42.dp)
                .clip(RoundedCornerShape(8.dp))
                .background(BgCard)
                .border(1.dp, BorderSubtle, RoundedCornerShape(8.dp)),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = track.title.take(1),
                color = TextWhite,
                fontWeight = FontWeight.Bold
            )
        }

        Spacer(modifier = Modifier.width(14.dp))

        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = track.title,
                color = if (isPlaying) TextWhite else TextPrimary,
                fontSize = 14.sp,
                fontWeight = FontWeight.SemiBold
            )
            Text(
                text = track.artist,
                color = TextTertiary,
                fontSize = 12.sp
            )
        }

        Text(
            text = track.formattedDuration,
            color = TextTertiary,
            fontSize = 12.sp,
            fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace,
            modifier = Modifier.padding(end = 12.dp)
        )

        IconButton(
            onClick = onClick,
            modifier = Modifier
                .size(32.dp)
                .background(if (isPlaying) TextWhite else BgCard, CircleShape)
                .border(1.dp, BorderSubtle, CircleShape)
        ) {
            Icon(
                imageVector = Icons.Default.PlayArrow,
                contentDescription = "Play",
                tint = if (isPlaying) BgDesktop else TextWhite,
                modifier = Modifier.size(16.dp)
            )
        }
    }
}
