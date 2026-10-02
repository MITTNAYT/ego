package com.ego.data.datasource

import com.ego.domain.model.*

class InMemoryMusicDataSource {

    val sampleTracks = listOf(
        Track(
            id = "track-cry",
            title = "Cry",
            artist = "Cigarettes After Sex",
            album = "Cry",
            durationSec = 234,
            audioUri = "asset:///audio/resonance.wav",
            coverUri = "file:///covers/cry.jpg",
            quality = "24-Bit / 96kHz Lossless ALAC",
            year = 2019,
            lyrics = listOf(
                LyricLine(0L, "♪ [Soft ambient electric guitar & gentle reverb] ♪"),
                LyricLine(8500L, "It's making you cry every time"),
                LyricLine(16000L, "You give your love away..."),
                LyricLine(24500L, "And every time you look into my eyes"),
                LyricLine(33000L, "You wanna tell me everything you've got inside"),
                LyricLine(42000L, "Cry, baby, cry into the night...")
            )
        ),
        Track(
            id = "track-frank",
            title = "Pink + White",
            artist = "Frank Ocean",
            album = "Blonde",
            durationSec = 184,
            audioUri = "asset:///audio/aura.wav",
            coverUri = "file:///covers/blond.jpg",
            quality = "24-Bit / 96kHz Lossless ALAC",
            year = 2016,
            lyrics = listOf(
                LyricLine(0L, "♪ [Acoustic piano chords & gentle shaker groove] ♪"),
                LyricLine(6000L, "That's the way everyday goes"),
                LyricLine(11500L, "Every time there's a tear in the sky"),
                LyricLine(17000L, "If the sky is pink and white"),
                LyricLine(23500L, "If the ground is black and yellow")
            )
        ),
        Track(
            id = "track-yoasobi",
            title = "Yoru ni Kakeru",
            artist = "Yoasobi",
            album = "The Book",
            durationSec = 261,
            audioUri = "asset:///audio/tokyo.wav",
            coverUri = "file:///covers/yoasobi.jpg",
            quality = "Lossless Digital Master",
            year = 2020,
            lyrics = listOf(
                LyricLine(0L, "♪ [Fast rhythmic piano & city pop intro] ♪"),
                LyricLine(5500L, "Shizumu you ni tokete yuku you ni", "Sinking in, melting away"),
                LyricLine(11000L, "Futari dake no sora ga hirogaru yoru ni", "In the night where the sky spreads out only for the two of us")
            )
        ),
        Track(
            id = "track-syre",
            title = "Syre",
            artist = "Jaden",
            album = "SYRE",
            durationSec = 234,
            audioUri = "asset:///audio/synthetic_void.wav",
            coverUri = "file:///covers/syre.jpg",
            quality = "320 kbps Ogg Vorbis",
            year = 2017
        ),
        Track(
            id = "track-trance",
            title = "Trance",
            artist = "Metro Boomin, Travis Scott, Young Thug",
            album = "Heroes & Villains",
            durationSec = 194,
            audioUri = "asset:///audio/midnight.wav",
            coverUri = "file:///covers/travis_scott.jpg",
            quality = "Dolby Atmos Spatial Audio",
            year = 2022
        ),
        Track(
            id = "track-look",
            title = "Look at the Sky",
            artist = "Porter Robinson",
            album = "Nurture",
            durationSec = 310,
            audioUri = "asset:///audio/resonance.wav",
            coverUri = "file:///covers/aura.jpg",
            quality = "24-Bit / 96kHz Lossless",
            year = 2021
        ),
        Track(
            id = "track-sweet",
            title = "Sweet",
            artist = "Cigarettes After Sex",
            album = "Cigarettes After Sex",
            durationSec = 290,
            audioUri = "asset:///audio/resonance.wav",
            coverUri = "file:///covers/cry.jpg",
            quality = "24-Bit / 96kHz Lossless",
            year = 2017
        ),
        Track(
            id = "track-heavenly",
            title = "Heavenly",
            artist = "Cigarettes After Sex",
            album = "Cry",
            durationSec = 286,
            audioUri = "asset:///audio/resonance.wav",
            coverUri = "file:///covers/cry.jpg",
            quality = "24-Bit / 96kHz Lossless",
            year = 2019
        ),
        Track(
            id = "track-apocalypse",
            title = "Apocalypse",
            artist = "Cigarettes After Sex",
            album = "Cigarettes After Sex",
            durationSec = 290,
            audioUri = "asset:///audio/resonance.wav",
            coverUri = "file:///covers/cry.jpg",
            quality = "24-Bit / 96kHz Lossless",
            year = 2017
        )
    )

    val sampleArtists = listOf(
        Artist("art-1", "JVKE", "file:///covers/jvke.jpg", "14.2M listeners"),
        Artist("art-2", "The Weeknd", "file:///covers/the_weeknd.jpg", "108M listeners"),
        Artist("art-3", "Yeat", "file:///covers/yeat.jpg", "18.5M listeners"),
        Artist("art-4", "Travis Scott", "file:///covers/travis_scott.jpg", "65.8M listeners"),
        Artist("art-5", "Joji", "file:///covers/joji.jpg", "28.1M listeners")
    )

    val sampleCollections = listOf(
        CollectionItem("col-1", "Eve", CollectionType.ARTIST, "file:///covers/yoasobi.jpg", 24),
        CollectionItem("col-2", "Yoasobi", CollectionType.ARTIST, "file:///covers/yoasobi.jpg", 38),
        CollectionItem("col-3", "Study lofi", CollectionType.PLAYLIST, "file:///covers/tokyo.jpg", 62),
        CollectionItem("col-4", "Coffee Chill", CollectionType.PLAYLIST, "file:///covers/hero_banner.jpg", 45),
        CollectionItem("col-5", "Anime lofi", CollectionType.PLAYLIST, "file:///covers/yoasobi.jpg", 50),
        CollectionItem("col-6", "Ghibli Vibes", CollectionType.PLAYLIST, "file:///covers/aura.jpg", 33)
    )
}
