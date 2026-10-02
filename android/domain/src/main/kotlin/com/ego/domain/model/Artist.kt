package com.ego.domain.model

data class Artist(
    val id: String,
    val name: String,
    val avatarUri: String,
    val listenerCount: String
)

data class CollectionItem(
    val id: String,
    val name: String,
    val type: CollectionType,
    val coverUri: String,
    val trackCount: Int
)

enum class CollectionType {
    ARTIST, PLAYLIST, ALBUM, LOCAL
}
