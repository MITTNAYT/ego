# Ego Android — Native Lossless Music Player 📱🖤

> **Pure Black Monochrome Android App with Jetpack Compose & Clean Architecture**  
> Inspired by Sonora and GrooveSync desktop aesthetics, engineered natively for Android with Media3, Kotlin Coroutines, and Unidirectional Data Flow (UDF).

---

## 🏛️ Architecture

Following Google's official Android Clean Architecture guidelines:

```
android/
├── app/                  # Android Application, MainActivity, Jetpack Compose UI, Theme
│   └── src/main/kotlin/com/ego/music/
│       ├── ui/
│       │   ├── home/         # HomeScreen (Trending, Popular Artists, Recently Played)
│       │   ├── player/       # BottomPlayerPill, NowPlayingSheet
│       │   ├── equalizer/    # EqualizerDialog (10-Band Parametric EQ)
│       │   ├── lyrics/       # LyricsSheet (Synced lyrics with Romaji toggle)
│       │   ├── navigation/   # EgoBottomNavigation
│       │   └── theme/        # Solid Black Monochrome Material3 Theme
│       ├── EgoApplication.kt
│       └── MainActivity.kt
│
├── domain/               # Pure Kotlin business logic & entities (Zero Android dependencies)
│   └── src/main/kotlin/com/ego/domain/
│       ├── model/            # Track, LyricLine, Artist, CollectionItem, PlaybackState
│       ├── repository/       # MusicRepository, PlaybackRepository
│       └── usecase/          # GetHomeDataUseCase, PlayTrackUseCase, ManageEqualizerUseCase
│
├── data/                 # Repositories, DataSources & Playback engine
│   └── src/main/kotlin/com/ego/data/
│       ├── datasource/       # InMemoryMusicDataSource, MediaStoreAudioDataSource
│       ├── repository/       # MusicRepositoryImpl
│       └── playback/         # PlaybackRepositoryImpl with structured coroutine loops
│
└── core/                 # Shared utilities, DispatcherProvider, Resource wrapper
    └── src/main/kotlin/com/ego/core/
        ├── DispatcherProvider.kt
        └── Resource.kt
```

---

## ✨ Android Features
- **🖤 Solid Black Monochrome UI**: Designed exclusively with pure dark tones (`#070709`, `#0D0D10`, `#141418`, `#18181E`), high typographic contrast, and zero noisy blurs or LED neon glows.
- **🎵 Unidirectional Data Flow (UDF)**: ViewModels expose immutable `StateFlow<MainUiState>` driven by domain use cases.
- **🎛️ 10-Band Parametric EQ**: Real-time frequency band adjustments (32Hz - 16kHz) with presets (Flat, Bass Boost, Vocal, Electronic, etc.).
- **🎤 Synced Karaoke Lyrics**: Real-time position tracking with interactive line-jumping and Japanese Romaji transliteration.
- **📱 Floating Player Pill**: Persistent playback bar docked above the bottom navigation with quick play/pause, next track, and scrub progression.

---

## 🛠️ Build & Run

### Local Compilation
```bash
cd android

# Build debug APK locally
./gradlew :app:assembleDebug

# Or using the helper script
./build-apk.sh     # macOS / Linux
build-apk.bat      # Windows

# Run unit tests across all modules
./gradlew test
```

---

## 🚀 Automated APK Release Pipeline (GitHub Actions)

Ego features an automated CI/CD pipeline that compiles, tests, and publishes Android APKs on GitHub:

1. **Automatic Workflow Artifacts**:
   - Every push modifying `android/**` triggers `.github/workflows/android-release.yml`.
   - The workflow compiles `:app:assembleDebug` and uploads `ego-music-player-apk` to GitHub Actions Artifacts.
2. **GitHub Releases with APK**:
   - Pushing any git tag starting with `v*` (e.g. `git tag v1.0.0 && git push origin v1.0.0`) automatically compiles the APK, creates a GitHub Release, and attaches `ego-music-player-v1.0.0-debug.apk` ready for direct phone download and installation!
3. **Manual Trigger (`workflow_dispatch`)**:
   - Trigger a build anytime directly from GitHub Actions tab with the "Publish as GitHub Release" checkbox.

