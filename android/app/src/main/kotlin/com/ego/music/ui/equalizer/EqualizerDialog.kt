package com.ego.music.ui.equalizer

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.ego.domain.model.EqualizerBand
import com.ego.music.ui.theme.*

@Composable
fun EqualizerDialog(
    bands: List<EqualizerBand>,
    onSetGain: (Int, Float) -> Unit,
    onReset: () -> Unit,
    onDismiss: () -> Unit
) {
    val presets = listOf("Flat", "Bass Boost", "Vocal", "Electronic", "Rock", "Acoustic")

    Dialog(onDismissRequest = onDismiss) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(20.dp))
                .background(BgWindow)
                .border(1.dp, BorderMedium, RoundedCornerShape(20.dp))
                .padding(20.dp)
        ) {
            Column {
                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "10-Band Parametric EQ",
                        color = TextWhite,
                        fontSize = 17.sp,
                        fontWeight = FontWeight.Bold
                    )
                    IconButton(onClick = onDismiss, modifier = Modifier.size(28.dp)) {
                        Icon(
                            imageVector = Icons.Default.Close,
                            contentDescription = "Close",
                            tint = TextSecondary,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                // Presets
                LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    items(presets) { preset ->
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(16.dp))
                                .background(if (preset == "Flat") TextWhite else BgCard)
                                .border(1.dp, BorderSubtle, RoundedCornerShape(16.dp))
                                .clickable {
                                    if (preset == "Flat") onReset()
                                    // Preset adjustments can be dispatched here
                                }
                                .padding(horizontal = 12.dp, vertical = 6.dp)
                        ) {
                            Text(
                                text = preset,
                                color = if (preset == "Flat") BgDesktop else TextSecondary,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.SemiBold
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(20.dp))

                // 10 Frequency Sliders Grid
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(180.dp)
                        .background(BgCard, RoundedCornerShape(12.dp))
                        .border(1.dp, BorderSubtle, RoundedCornerShape(12.dp))
                        .padding(horizontal = 10.dp, vertical = 12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.Bottom
                ) {
                    bands.forEach { band ->
                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.SpaceBetween,
                            modifier = Modifier.fillMaxHeight()
                        ) {
                            Text(
                                text = "${band.gainDb.toInt()}dB",
                                color = TextTertiary,
                                fontSize = 9.sp,
                                fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace
                            )

                            // Visual vertical slider representation
                            Box(
                                modifier = Modifier
                                    .width(6.dp)
                                    .height(110.dp)
                                    .background(Color(0xFF252530), RoundedCornerShape(3.dp)),
                                contentAlignment = Alignment.Center
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(12.dp)
                                        .background(TextWhite, CircleShape)
                                )
                            }

                            Text(
                                text = formatFreq(band.centerFreqHz),
                                color = TextSecondary,
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Medium
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                Button(
                    onClick = onReset,
                    modifier = Modifier.fillMaxWidth(),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = BgCardElevated,
                        contentColor = TextWhite
                    ),
                    shape = RoundedCornerShape(10.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, BorderSubtle)
                ) {
                    Text(text = "Reset to Flat", fontSize = 13.sp, fontWeight = FontWeight.Medium)
                }
            }
        }
    }
}

private fun formatFreq(hz: Int): String {
    return if (hz >= 1000) "${hz / 1000}k" else "$hz"
}
