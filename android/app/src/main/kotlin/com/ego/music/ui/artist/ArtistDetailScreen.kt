package com.ego.music.ui.artist

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Verified
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
import com.ego.music.ui.theme.*

@Composable
fun ArtistDetailScreen(
    artist: Artist,
    artistTracks: List<Track>,
    onPlayTrack: (Track) -> Unit,
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(BgDesktop),
        contentPadding = PaddingValues(bottom = 120.dp)
    ) {
        // Hero Banner Item
        item {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(260.dp)
                    .background(BgCard)
            ) {
                IconButton(
                    onClick = onBack,
                    modifier = Modifier
                        .statusBarsPadding()
                        .padding(16.dp)
                        .background(Color(0x88000000), CircleShape)
                ) {
                    Icon(imageVector = Icons.Default.ArrowBack, contentDescription = "Back", tint = TextWhite)
                }

                Column(
                    modifier = Modifier
                        .align(Alignment.BottomStart)
                        .padding(20.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Verified,
                            contentDescription = "Verified Artist",
                            tint = TextWhite,
                            modifier = Modifier.size(16.dp)
                        )
                        Text(text = "Verified Artist", color = TextWhite, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                    }

                    Spacer(modifier = Modifier.height(4.dp))

                    Text(
                        text = artist.name,
                        color = TextWhite,
                        fontSize = 32.sp,
                        fontWeight = FontWeight.ExtraBold
                    )

                    Text(
                        text = "${artist.listenerCount} monthly listeners",
                        color = TextSecondary,
                        fontSize = 13.sp,
                        modifier = Modifier.padding(top = 2.dp)
                    )
                }
            }
        }

        // Section: Popular Songs
        item {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 18.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(text = "Popular Songs", color = TextWhite, fontSize = 18.sp, fontWeight = FontWeight.Bold)

                Button(
                    onClick = { if (artistTracks.isNotEmpty()) onPlayTrack(artistTracks.first()) },
                    colors = ButtonDefaults.buttonColors(containerColor = TextWhite, contentColor = BgDesktop),
                    shape = RoundedCornerShape(20.dp),
                    contentPadding = PaddingValues(horizontal = 16.dp, vertical = 6.dp)
                ) {
                    Icon(imageVector = Icons.Default.PlayArrow, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(text = "Play", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }
            }
        }

        items(artistTracks) { track ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 4.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .clickable { onPlayTrack(track) }
                    .padding(8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .clip(RoundedCornerShape(6.dp))
                        .background(BgCardElevated),
                    contentAlignment = Alignment.Center
                ) {
                    Text(text = track.title.take(1), color = TextWhite, fontWeight = FontWeight.Bold)
                }

                Spacer(modifier = Modifier.width(14.dp))

                Column(modifier = Modifier.weight(1f)) {
                    Text(text = track.title, color = TextWhite, fontSize = 14.sp, fontWeight = FontWeight.SemiBold)
                    Text(text = track.album, color = TextTertiary, fontSize = 12.sp)
                }

                Text(
                    text = track.formattedDuration,
                    color = TextTertiary,
                    fontSize = 12.sp,
                    fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace
                )
            }
        }
    }
}
