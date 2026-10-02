package com.ego.music.ui.collections

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Folder
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ego.domain.model.CollectionItem
import com.ego.music.ui.theme.*

@Composable
fun CollectionsScreen(
    collections: List<CollectionItem>,
    onSelectCollection: (CollectionItem) -> Unit,
    onOpenLocalMusic: () -> Unit,
    modifier: Modifier = Modifier
) {
    var showCreateDialog by remember { mutableStateOf(false) }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(BgDesktop)
            .padding(horizontal = 20.dp)
    ) {
        Spacer(modifier = Modifier.height(20.dp))

        // Header Row with "+" action
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "Your Collections",
                    color = TextWhite,
                    fontSize = 22.sp,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = "${collections.size} playlists & archives",
                    color = TextTertiary,
                    fontSize = 13.sp,
                    modifier = Modifier.padding(top = 2.dp)
                )
            }

            IconButton(
                onClick = { showCreateDialog = true },
                modifier = Modifier
                    .size(40.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(BgCard)
                    .border(1.dp, BorderSubtle, RoundedCornerShape(12.dp))
            ) {
                Icon(imageVector = Icons.Default.Add, contentDescription = "Add Playlist", tint = TextWhite)
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Local Storage Fast Access Card
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(16.dp))
                .background(BgCard)
                .border(1.dp, BorderSubtle, RoundedCornerShape(16.dp))
                .clickable(onClick = onOpenLocalMusic)
                .padding(16.dp)
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(44.dp)
                        .clip(RoundedCornerShape(10.dp))
                        .background(BgCardElevated),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(imageVector = Icons.Default.Folder, contentDescription = null, tint = TextWhite)
                }
                Spacer(modifier = Modifier.width(14.dp))
                Column {
                    Text(text = "Local Storage Files", color = TextWhite, fontSize = 15.sp, fontWeight = FontWeight.SemiBold)
                    Text(text = "Scan device storage for .flac, .wav, .mp3", color = TextTertiary, fontSize = 12.sp)
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Collections Grid
        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            horizontalArrangement = Arrangement.spacedBy(14.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp),
            contentPadding = PaddingValues(bottom = 120.dp)
        ) {
            items(collections) { item ->
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .aspectRatio(0.9f)
                        .clip(RoundedCornerShape(16.dp))
                        .background(BgCard)
                        .border(1.dp, BorderSubtle, RoundedCornerShape(16.dp))
                        .clickable { onSelectCollection(item) }
                        .padding(14.dp)
                ) {
                    Column(
                        modifier = Modifier.fillMaxSize(),
                        verticalArrangement = Arrangement.SpaceBetween
                    ) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(80.dp)
                                .clip(RoundedCornerShape(10.dp))
                                .background(BgCardElevated),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(text = item.name.take(1), color = TextWhite, fontSize = 24.sp, fontWeight = FontWeight.Bold)
                        }

                        Column {
                            Text(
                                text = item.name,
                                color = TextWhite,
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                maxLines = 1
                            )
                            Text(
                                text = "${item.type.name.lowercase().replaceFirstChar { it.uppercase() }} • ${item.trackCount} tracks",
                                color = TextTertiary,
                                fontSize = 11.sp,
                                modifier = Modifier.padding(top = 2.dp)
                            )
                        }
                    }
                }
            }
        }
    }

    if (showCreateDialog) {
        var playlistTitle by remember { mutableStateOf("") }
        AlertDialog(
            onDismissRequest = { showCreateDialog = false },
            title = { Text(text = "New Playlist", color = TextWhite, fontWeight = FontWeight.Bold) },
            text = {
                OutlinedTextField(
                    value = playlistTitle,
                    onValueChange = { playlistTitle = it },
                    placeholder = { Text(text = "Playlist name", color = TextTertiary) },
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = TextWhite,
                        unfocusedTextColor = TextWhite,
                        focusedBorderColor = BorderBright,
                        unfocusedBorderColor = BorderSubtle
                    )
                )
            },
            confirmButton = {
                Button(
                    onClick = { showCreateDialog = false },
                    colors = ButtonDefaults.buttonColors(containerColor = TextWhite, contentColor = BgDesktop)
                ) {
                    Text(text = "Create")
                }
            },
            dismissButton = {
                TextButton(onClick = { showCreateDialog = false }) {
                    Text(text = "Cancel", color = TextSecondary)
                }
            },
            containerColor = BgWindow
        )
    }
}
