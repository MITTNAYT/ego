package com.ego.music.ui.navigation

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ego.music.ui.NavigationTab
import com.ego.music.ui.theme.*

data class NavItem(val tab: NavigationTab, val label: String, val icon: ImageVector)

@Composable
fun EgoBottomNavigation(
    currentTab: NavigationTab,
    onTabSelected: (NavigationTab) -> Unit,
    modifier: Modifier = Modifier
) {
    val items = listOf(
        NavItem(NavigationTab.HOME, "Home", Icons.Default.Home),
        NavItem(NavigationTab.SONGS, "Songs", Icons.Default.MusicNote),
        NavItem(NavigationTab.ARTISTS, "Artists", Icons.Default.Person),
        NavItem(NavigationTab.COLLECTIONS, "Collections", Icons.Default.LibraryMusic),
        NavItem(NavigationTab.SETTINGS, "Settings", Icons.Default.Settings)
    )

    NavigationBar(
        modifier = modifier
            .fillMaxWidth()
            .border(width = 0.5.dp, color = BorderSubtle),
        containerColor = BgWindow,
        contentColor = TextSecondary,
        tonalElevation = 0.dp
    ) {
        items.forEach { item ->
            val isSelected = currentTab == item.tab
            NavigationBarItem(
                selected = isSelected,
                onClick = { onTabSelected(item.tab) },
                icon = {
                    Icon(
                        imageVector = item.icon,
                        contentDescription = item.label,
                        modifier = Modifier.size(20.dp)
                    )
                },
                label = {
                    Text(
                        text = item.label,
                        fontSize = 10.sp,
                        color = if (isSelected) TextWhite else TextTertiary
                    )
                },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = TextWhite,
                    unselectedIconColor = TextTertiary,
                    indicatorColor = AccentActivePill
                )
            )
        }
    }
}
