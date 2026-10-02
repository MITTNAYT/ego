# Ego Music Player (GrooveSync Edition) 🖤🎶

> **Pure Black Monochrome Lossless Music Experience**  
> Inspired by GrooveSync desktop architecture with zero glassmorphism, matte obsidian surfaces, and a studio-grade Web Audio API engine.

---

## ✨ Features

- **🖤 Pure Black Monochrome Design**:
  - Engineered with deep matte obsidian palettes (`#070709`, `#0d0d10`, `#141418`, `#18181e`).
  - Zero glassmorphism or room wallpaper blur for maximum readability, focus, and visual weight.
  - Precision hairlines (`#1f1f26` / `#2b2b35`) and high-contrast typography.

- **🖥️ Desktop Window Architecture**:
  - **macOS Chrome Bar**: Integrated traffic lights, navigation arrows, and `groovesync.com` capsule.
  - **Left Floating Dock**: Instant access to Dashboard, Search, Notifications, Equalizer, and Settings.
  - **3-Column Main Viewport**:
    - **Navigation & Collections**: Fast navigation across Home, Songs, Artists, Albums, Podcasts, and custom collections.
    - **Center Stage**: Greeting header, "Trending songs this week" wide landscape cards, "Popular artists" circular avatars, and "Recently played" rows.
    - **Now Playing & Queue Panel**: Soundwave visualizer, hero album art, track details, and embedded interactive queue.
  - **Floating Bottom Player Pill**: Smooth scrubber seek bar, precise duration timestamps, shuffle/repeat/transport controls, and volume slider.

- **🎛️ Pro Audio Features**:
  - **Web Audio API Engine**: Real-time gain control, multi-track playback, and synthesis.
  - **10-Band Parametric Equalizer**: 32Hz to 16kHz bands with presets (Flat, Bass Boost, Vocal, Electronic, Rock, Acoustic) and Pre-Amp master gain.
  - **Live Synced Lyrics**: Auto-scrolling karaoke mode with line-click seeking and Romaji toggle for Japanese tracks.
  - **Local Audio Files Support**: Drag-and-drop `.mp3`, `.wav`, `.flac`, `.m4a` files with in-browser ID3 tag and cover art parsing via `jsmediatags`.

- **⌨️ Keyboard Shortcuts**:
  - `Space` — Play / Pause
  - `Shift + →` / `Shift + ←` — Next / Previous Track
  - `→` / `←` — Seek Forward / Backward 5 seconds
  - `↑` / `↓` — Volume Up / Down
  - `L` — Toggle Synced Lyrics Drawer
  - `E` — Toggle 10-Band Equalizer
  - `Q` — Toggle Queue Inspector
  - `⌘K` / `Ctrl+K` — Focus Search Field
  - `Esc` — Close Active Modal

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm / yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/MITTNAYT/ego-music-player.git

# Navigate into project directory
cd ego-music-player

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

### Production Build
```bash
npm run build
npm run preview
```

---

## 📱 Android Native App (`/android`)

Ego includes a native Android counterpart crafted with **Kotlin**, **Jetpack Compose**, and **Android Clean Architecture**:

- **Modules**:
  - `:app`: Jetpack Compose UI, Material3 black monochrome theme, ViewModels (`UDF`).
  - `:domain`: Pure Kotlin entities (`Track`, `Artist`, `PlaybackState`) and UseCases.
  - `:data`: InMemory & MediaStore data sources, Media3 / ExoPlayer state management.
  - `:core`: Coroutine Dispatchers, Resource state wrappers.
- **Mobile UI**:
  - Adaptive monochrome cards & bottom navigation tabs.
  - Floating player pill docked with progress indicators.
  - Fullscreen Now Playing sheet with animated soundwaves & lyrics.
  - 10-band parametric EQ dialog.

See [`android/README.md`](android/README.md) for full architecture details.

---

## 🛠️ Tech Stack
- **Web App**: Vanilla JavaScript (ES Modules), Modern CSS, Vite, Web Audio API, `jsmediatags`
- **Android App**: Kotlin 2.1, Jetpack Compose, Material3, AndroidX Media3 / ExoPlayer, Coroutines & Flow

---

## 📄 License
MIT License. Created by [MITTNAYT](https://github.com/MITTNAYT).

