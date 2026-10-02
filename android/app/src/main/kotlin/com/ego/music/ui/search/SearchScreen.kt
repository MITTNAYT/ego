package com.ego.music.ui.search

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ego.domain.model.Track
import com.ego.music.ui.theme.*

@Composable
fun SearchScreen(
    allTracks: List<Track>,
    onPlayTrack: (Track) -> Unit,
    modifier: Modifier = Modifier
) {
    var searchQuery by remember { mutableStateOf("") }

    val filteredTracks = remember(searchQuery, allTracks) {
        val q = searchQuery.trim().lowercase()
        if (q.isEmpty()) emptyList()
        else allTracks.filter {
            it.title.lowercase().contains(q) || it.artist.lowercase().contains(q) || it.album.lowercase().contains(q)
        }
    }

    val genres = listOf(
        "Lossless Masters" to "45 tracks",
        "Tokyo City Pop" to "94 tracks",
        "Cyberpunk & Synth" to "128 tracks",
        "Ambient & Drone" to "72 tracks",
        "Retrowave 80s" to "86 tracks",
        "Subsonic Archives" to "210 tracks"
    )

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(BgDesktop)
            .padding(horizontal = 20.dp)
    ) {
        Spacer(modifier = Modifier.height(20.dp))

        // Search Input Capsule
        OutlinedTextField(
            value = searchQuery,
            onValueChange = { searchQuery = it },
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(24.dp))
                .background(BgCard),
            placeholder = { Text(text = "Search songs, artists, albums...", color = TextTertiary, fontSize = 14.sp) },
            leadingIcon = {
                Icon(imageVector = Icons.Default.Search, contentDescription = "Search", tint = TextSecondary)
            },
            trailingIcon = {
                if (searchQuery.isNotEmpty()) {
                    IconButton(onClick = { searchQuery = "" }) {
                        Icon(imageVector = Icons.Default.Close, contentDescription = "Clear", tint = TextSecondary)
                    }
                }
            },
            singleLine = true,
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = BorderBright,
                unfocusedBorderColor = BorderSubtle,
                focusedTextColor = TextWhite,
                unfocusedTextColor = TextWhite
            )
        )

        Spacer(modifier = Modifier.height(24.dp))

        if (searchQuery.isBlank()) {
            // Browse Genres Section
            Text(
                text = "Browse Catalogs",
                color = TextWhite,
                fontSize = 17.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(bottom = 14.dp)
            )

            LazyVerticalGrid(
                columns = GridCells.Fixed(2),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(genres) { (name, tracksCount) ->
                    Box(
                        modifier = Modifier
                            .height(90.dp)
                            .clip(RoundedCornerShape(14.dp))
                            .background(BgCard)
                            .border(1.dp, BorderSubtle, RoundedCornerShape(14.dp))
                            .clickable { searchQuery = name.split(" ").first() }
                            .padding(14.dp)
                    ) {
                        Column(
                            modifier = Modifier.fillMaxSize(),
                            verticalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(text = name, color = TextWhite, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                            Text(text = tracksCount, color = TextTertiary, fontSize = 11.sp)
                        }
                    }
                }
            }
        } else {
            // Search Results List
            Text(
                text = "Search Results (${filteredTracks.size})",
                color = TextWhite,
                fontSize = 15.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(bottom = 12.dp)
            )

            LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                items(filteredTracks) { track ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(10.dp))
                            .background(BgCard)
                            .clickable { onPlayTrack(track) }
                            .padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(40.dp)
                                .clip(RoundedCornerShape(8.dp))
                                .background(BgCardElevated),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(text = track.title.take(1), color = TextWhite, fontWeight = FontWeight.Bold)
                        }

                        Spacer(modifier = Modifier.width(12.dp))

                        Column(modifier = Modifier.weight(1f)) {
                            Text(text = track.title, color = TextWhite, fontSize = 14.sp, fontWeight = FontWeight.SemiBold)
                            Text(text = "${track.artist} • ${track.album}", color = TextTertiary, fontSize = 12.sp)
                        }

                        IconButton(onClick = { onPlayTrack(track) }) {
                            Icon(imageVector = Icons.Default.PlayArrow, contentDescription = "Play", tint = TextWhite)
                        }
                    }
                }
            }
        }
    }
}
