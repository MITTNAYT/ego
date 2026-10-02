import './style.css';
import { state } from './services/state.js';
import { audioEngine } from './services/audioEngine.js';
import { processFilesList } from './services/localFiles.js';
import { renderSidebar } from './components/Sidebar.js';
import { renderRightSidebar } from './components/RightSidebar.js';
import { renderPlayerBar } from './components/PlayerBar.js';
import { renderLyricsModal } from './components/LyricsModal.js';
import { renderEqualizerModal } from './components/EqualizerModal.js';
import { renderQueueModal } from './components/QueueModal.js';
import { renderSettingsModal } from './components/SettingsModal.js';
import { renderSleepTimerModal } from './components/SleepTimerModal.js';
import { setupVisualizer } from './components/Visualizer.js';
import { downloadBackupFile, restoreBackupFromJson } from './services/syncBridge.js';
import { clearAllOfflineTracks } from './services/offlineStorage.js';
import { renderHomeView } from './views/HomeView.js';
import { renderExploreView } from './views/ExploreView.js';
import { renderSearchView } from './views/SearchView.js';
import { renderLocalFilesView } from './views/LocalFilesView.js';
import { renderPlaylistView } from './views/PlaylistView.js';
import { PLAYLISTS, INITIAL_TRACKS } from './data/tracks.js';

let cleanupVisualizer = null;

function renderApp() {
  const app = document.querySelector('#app');
  if (!app) return;

  // Choose center view
  let viewHtml = '';
  switch (state.state.activeView) {
    case 'home':
      viewHtml = renderHomeView();
      break;
    case 'explore':
      viewHtml = renderExploreView();
      break;
    case 'search':
      viewHtml = renderSearchView();
      break;
    case 'local':
      viewHtml = renderLocalFilesView();
      break;
    case 'playlist':
      viewHtml = renderPlaylistView(state.state.selectedPlaylist);
      break;
    case 'favorites':
      viewHtml = renderPlaylistView({
        id: 'favorites',
        title: 'Liked Songs',
        description: 'Your personal collection of saved favorite tracks.',
        cover: '/covers/cry.jpg',
        isLikedSongs: true
      });
      break;
    default:
      viewHtml = renderHomeView();
  }

  app.innerHTML = `
    <!-- Top Safari/macOS Window Chrome Bar (Exact replica of groovesync reference) -->
    <header id="browser-chrome-bar">
      <div class="chrome-left-group">
        <div class="chrome-dots">
          <div class="chrome-dot dot-red" title="Close Window"></div>
          <div class="chrome-dot dot-yellow" title="Minimize Window"></div>
          <div class="chrome-dot dot-green" title="Full Screen"></div>
        </div>
        <div class="chrome-nav-arrows">
          <svg id="chrome-btn-back" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" title="Back">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          <svg id="chrome-btn-forward" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" title="Forward">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      </div>

      <div class="chrome-url-capsule" title="Bit-Perfect Lossless Security">
        <svg class="url-lock" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
        <span class="url-text">groovesync.com</span>
      </div>

      <div class="chrome-right-group">
        <svg id="chrome-btn-zen" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" title="Zen Focus Mode (F)" style="cursor: pointer;">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
        </svg>
        <svg id="chrome-btn-share" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" title="Share Music">
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
          <polyline points="16 6 12 2 8 6"></polyline>
          <line x1="12" y1="2" x2="12" y2="15"></line>
        </svg>
        <svg id="chrome-btn-new-tab" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" title="New Session">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <svg id="chrome-btn-tabs" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" title="Overview">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      </div>
    </header>

    <!-- App Viewport Root (Floating Dock + 3-Column Frame + Floating Player) -->
    <div id="app-viewport-root">
      <!-- Far-Left Floating Icon Dock -->
      <aside id="left-dock-strip">
        <button class="dock-icon-btn ${state.state.activeView === 'home' ? 'active' : ''}" data-nav="home" title="Home / Discover">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <rect x="3" y="3" width="7" height="7" rx="1.5"></rect>
            <rect x="14" y="3" width="7" height="7" rx="1.5"></rect>
            <rect x="14" y="14" width="7" height="7" rx="1.5"></rect>
            <rect x="3" y="14" width="7" height="7" rx="1.5"></rect>
          </svg>
        </button>

        <button class="dock-icon-btn ${state.state.activeView === 'search' ? 'active' : ''}" data-nav="search" title="Search Library">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>

        <button class="dock-icon-btn" id="btn-dock-notifications" title="Notifications">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        </button>

        <button class="dock-icon-btn ${state.state.eqOpen ? 'active' : ''}" id="btn-dock-eq" title="Parametric Equalizer">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="4" y1="21" x2="4" y2="14"></line>
            <line x1="4" y1="10" x2="4" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12" y2="3"></line>
            <line x1="20" y1="21" x2="20" y2="16"></line>
            <line x1="20" y1="12" x2="20" y2="3"></line>
          </svg>
        </button>

        <button class="dock-icon-btn ${state.state.sleepTimerOpen || (state.state.sleepTimer && state.state.sleepTimer.active) ? 'active' : ''}" id="btn-dock-sleeptimer" title="Sleep Timer (T)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>

        <button class="dock-icon-btn ${state.state.settingsOpen ? 'active' : ''}" id="btn-dock-settings" title="Settings">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </button>
      </aside>

      <!-- Main Application Card Frame (3 Columns) -->
      <div id="main-application-frame">
        <div id="main-frame-columns">
          ${renderSidebar()}
          <main id="center-content-column">
            ${viewHtml}
          </main>
          ${renderRightSidebar()}
        </div>
      </div>

      <!-- Floating Bottom Player Bar -->
      ${renderPlayerBar()}
    </div>

    <!-- Modals & Overlays -->
    ${renderLyricsModal()}
    ${renderEqualizerModal()}
    ${renderQueueModal()}
    ${renderSettingsModal()}
    ${renderSleepTimerModal()}

    <!-- Toast Notifications Container -->
    <div id="toast-container">
      ${state.state.toasts.map(t => `
        <div class="toast ${t.type}">
          <span>${t.message}</span>
        </div>
      `).join('')}
    </div>
  `;

  attachEventListeners();
}

function attachEventListeners() {
  // Navigation items in sidebar & dock
  document.querySelectorAll('[data-nav]').forEach(item => {
    item.addEventListener('click', () => {
      const view = item.getAttribute('data-nav');
      state.setView(view);
    });
  });

  // Window chrome buttons
  document.querySelector('#chrome-btn-back')?.addEventListener('click', () => {
    if (state.state.activeView !== 'home') state.setView('home');
  });
  document.querySelector('#chrome-btn-forward')?.addEventListener('click', () => {
    if (state.state.activeView === 'home') state.setView('explore');
  });
  document.querySelector('#chrome-btn-share')?.addEventListener('click', () => {
    const cur = state.state.currentTrack;
    if (cur) {
      state.showToast(`Shared "${cur.title}" link to clipboard`, 'success');
    }
  });
  document.querySelector('#chrome-btn-new-tab')?.addEventListener('click', () => {
    state.setView('explore');
  });

  // Dock buttons
  document.querySelector('#btn-dock-notifications')?.addEventListener('click', () => {
    state.showToast('No new notifications. Everything is sync-ready.', 'info');
  });
  document.querySelector('#btn-dock-eq')?.addEventListener('click', () => {
    state.toggleEqualizer();
  });
  document.querySelector('#btn-dock-settings')?.addEventListener('click', () => {
    state.toggleSettings();
  });

  // Collections click
  document.querySelectorAll('[data-collection-id]').forEach(item => {
    item.addEventListener('click', () => {
      const colId = item.getAttribute('data-collection-id');
      const all = state.getAllAvailableTracks();
      if (colId === 'col-1' || colId === 'col-2') {
        const yoasobi = all.find(t => t.id === 'track-yoasobi');
        if (yoasobi) state.playTrack(yoasobi, all);
      } else if (colId === 'col-3') {
        const frank = all.find(t => t.id === 'track-frank');
        if (frank) state.playTrack(frank, all);
      } else {
        const cry = all.find(t => t.id === 'track-cry');
        if (cry) state.playTrack(cry, all);
      }
    });
  });

  // Add library item / import (+)
  document.querySelector('#btn-add-library-item')?.addEventListener('click', () => {
    state.setView('local');
  });

  // Track play on click (from trending cards, recent rows, queue rows, or playlists)
  document.querySelectorAll('[data-track-id]').forEach(el => {
    el.addEventListener('click', (e) => {
      // Avoid triggering when clicking child play buttons or actions
      const trackId = el.getAttribute('data-track-id');
      const all = state.getAllAvailableTracks();
      const track = all.find(t => t.id === trackId);
      if (track) {
        state.playTrack(track, all);
      }
    });
  });

  // Play button on recent track rows
  document.querySelectorAll('.recent-play-circle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const trackId = btn.getAttribute('data-track-id');
      const all = state.getAllAvailableTracks();
      const track = all.find(t => t.id === trackId);
      if (track) {
        if (state.state.currentTrack && state.state.currentTrack.id === track.id) {
          state.togglePlayPause();
        } else {
          state.playTrack(track, all);
        }
      }
    });
  });

  // Play button on queue rows
  document.querySelectorAll('.queue-play-circle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const trackId = btn.getAttribute('data-track-id');
      const all = state.getAllAvailableTracks();
      const track = all.find(t => t.id === trackId);
      if (track) state.playTrack(track, all);
    });
  });

  // Popular artists click
  document.querySelectorAll('.artist-circle-item').forEach(item => {
    item.addEventListener('click', () => {
      const artistName = item.getAttribute('data-artist-name');
      const all = state.getAllAvailableTracks();
      const matchingTrack = all.find(t => t.artist.toLowerCase().includes(artistName.toLowerCase()));
      if (matchingTrack) {
        state.playTrack(matchingTrack, all);
      } else {
        state.showToast(`Playing ${artistName} Radio Station`, 'info');
      }
    });
  });

  // Center top search input
  const centerSearch = document.querySelector('#center-search-input');
  if (centerSearch) {
    centerSearch.addEventListener('input', (e) => {
      state.setSearchQuery(e.target.value);
      if (state.state.activeView !== 'search' && e.target.value.trim().length > 0) {
        state.setView('search');
      }
    });
  }

  // Cast / AirPlay button in header
  document.querySelector('#btn-header-cast')?.addEventListener('click', () => {
    state.showToast('AirPlay & Cast: Searching for nearby studio monitors...', 'info');
  });

  // User avatar in header
  document.querySelector('#btn-header-avatar')?.addEventListener('click', () => {
    state.toggleSettings();
  });

  // Hero card cover action & player thumb action -> opens lyrics
  document.querySelector('#btn-hero-cover-action')?.addEventListener('click', () => {
    state.toggleLyrics();
  });
  document.querySelector('#player-thumb-action')?.addEventListener('click', () => {
    state.toggleLyrics();
  });
  document.querySelector('#player-track-title-btn')?.addEventListener('click', () => {
    state.toggleLyrics();
  });

  // Queue modal trigger in Right Column
  document.querySelector('#btn-right-queue-modal')?.addEventListener('click', () => {
    state.toggleQueue();
  });

  // Player Bar Transport Controls
  document.querySelector('#btn-ctrl-play')?.addEventListener('click', () => state.togglePlayPause());
  document.querySelector('#btn-ctrl-next')?.addEventListener('click', () => state.nextTrack());
  document.querySelector('#btn-ctrl-prev')?.addEventListener('click', () => state.prevTrack());
  document.querySelector('#btn-ctrl-shuffle')?.addEventListener('click', () => state.toggleShuffle());
  document.querySelector('#btn-ctrl-repeat')?.addEventListener('click', () => state.toggleRepeat());
  document.querySelector('#btn-player-mute')?.addEventListener('click', () => state.toggleMute());

  // Player Bar Tools
  document.querySelector('#btn-tool-lyrics')?.addEventListener('click', () => state.toggleLyrics());
  document.querySelector('#btn-tool-eq')?.addEventListener('click', () => state.toggleEqualizer());
  document.querySelector('#btn-tool-settings')?.addEventListener('click', () => state.toggleSettings());

  // Player Scrubber Click & Drag
  const scrubberTrack = document.querySelector('#timeline-scrubber-track');
  if (scrubberTrack) {
    scrubberTrack.addEventListener('click', (e) => {
      const rect = scrubberTrack.getBoundingClientRect();
      const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const targetTime = clickRatio * state.state.duration;
      state.seek(targetTime);
    });
  }

  // Volume Track Click
  const volumeTrack = document.querySelector('#volume-track-bar');
  if (volumeTrack) {
    volumeTrack.addEventListener('click', (e) => {
      const rect = volumeTrack.getBoundingClientRect();
      const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      state.setVolume(clickRatio);
    });
  }

  // Zen Mode toggle
  document.querySelector('#chrome-btn-zen')?.addEventListener('click', () => state.toggleZenMode());

  // Sleep Timer triggers
  const toggleSleepTimer = () => {
    state.state.sleepTimerOpen = !state.state.sleepTimerOpen;
    state.emit('change');
  };
  document.querySelector('#btn-dock-sleeptimer')?.addEventListener('click', toggleSleepTimer);
  document.querySelector('#btn-player-sleeptimer')?.addEventListener('click', toggleSleepTimer);
  document.querySelector('#btn-close-sleeptimer')?.addEventListener('click', () => {
    state.state.sleepTimerOpen = false;
    state.emit('change');
  });
  document.querySelector('#sleeptimer-modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'sleeptimer-modal-backdrop') {
      state.state.sleepTimerOpen = false;
      state.emit('change');
    }
  });

  // Sleep timer duration buttons
  document.querySelectorAll('.timer-option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const mins = btn.getAttribute('data-mins');
      const mode = btn.getAttribute('data-mode');
      if (mode === 'end_of_track') {
        state.startSleepTimer(0, 'end_of_track');
      } else if (mins) {
        state.startSleepTimer(parseInt(mins, 10));
      }
      state.state.sleepTimerOpen = false;
    });
  });
  document.querySelector('#btn-cancel-sleeptimer')?.addEventListener('click', () => {
    state.cancelSleepTimer();
    state.state.sleepTimerOpen = false;
  });

  // Offline Download for current track
  document.querySelector('#btn-player-download')?.addEventListener('click', () => {
    state.toggleOfflineDownload(state.state.currentTrack);
  });
  document.querySelector('#btn-player-like')?.addEventListener('click', () => {
    state.toggleLike(state.state.currentTrack.id);
  });

  // Cross-Platform Sync: Export and Import
  document.querySelector('#btn-export-backup')?.addEventListener('click', () => {
    downloadBackupFile();
    state.showToast('Exported library backup (.json)', 'success');
  });

  const importInput = document.querySelector('#input-import-backup');
  if (importInput) {
    importInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (evt) => {
          try {
            const res = await restoreBackupFromJson(evt.target.result);
            state.showToast(`Restored: ${res.importedLikesCount} likes, ${res.importedPlaylistsCount} playlists`, 'success');
          } catch (err) {
            state.showToast(`Restore error: ${err.message}`, 'error');
          }
        };
        reader.readAsText(file);
      }
    });
  }

  // Clear offline cache
  document.querySelector('#btn-clear-offline')?.addEventListener('click', async () => {
    await clearAllOfflineTracks();
    state.state.offlineTrackIds.clear();
    state.showToast('Cleared all cached offline songs', 'info');
    state.emit('change');
  });

  // Modals close buttons
  document.querySelector('#btn-close-lyrics')?.addEventListener('click', () => state.toggleLyrics());
  document.querySelector('#btn-close-fs-lyrics')?.addEventListener('click', () => state.toggleLyrics(true));
  document.querySelector('#btn-close-eq')?.addEventListener('click', () => state.toggleEqualizer());
  document.querySelector('#btn-close-queue')?.addEventListener('click', () => state.toggleQueue());
  document.querySelector('#btn-close-settings')?.addEventListener('click', () => state.toggleSettings());

  document.querySelector('#eq-modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'eq-modal-backdrop') state.toggleEqualizer();
  });
  document.querySelector('#settings-modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'settings-modal-backdrop') state.toggleSettings();
  });
  document.querySelector('#queue-modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'queue-modal-backdrop') state.toggleQueue();
  });
  document.querySelector('#lyrics-drawer-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'lyrics-drawer-backdrop') state.toggleLyrics();
  });

  // Lyrics Romanize toggle
  document.querySelector('#btn-toggle-romanize')?.addEventListener('click', () => state.toggleLyricsRomanized());
  document.querySelector('#btn-fs-toggle-romanize')?.addEventListener('click', () => state.toggleLyricsRomanized());

  // Click on lyric line to jump
  document.querySelectorAll('[data-lyric-time]').forEach(el => {
    el.addEventListener('click', () => {
      const time = parseFloat(el.getAttribute('data-lyric-time'));
      if (!isNaN(time)) state.seek(time);
    });
  });

  // Equalizer presets
  document.querySelectorAll('[data-eq-preset]').forEach(btn => {
    btn.addEventListener('click', () => {
      const preset = btn.getAttribute('data-eq-preset');
      state.applyEQPreset(preset);
    });
  });

  // Equalizer band sliders
  document.querySelectorAll('[data-eq-band-index]').forEach(input => {
    input.addEventListener('input', (e) => {
      const idx = parseInt(input.getAttribute('data-eq-band-index'));
      const gain = parseFloat(e.target.value);
      state.setEQBand(idx, gain);
    });
  });

  document.querySelector('#eq-slider-preamp')?.addEventListener('input', (e) => {
    state.setEQPreAmp(parseFloat(e.target.value));
  });

  document.querySelector('#btn-reset-eq')?.addEventListener('click', () => {
    state.applyEQPreset('Flat');
  });

  // Queue actions
  document.querySelectorAll('.btn-remove-queue-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.getAttribute('data-remove-index'));
      state.removeFromQueue(idx);
    });
  });

  document.querySelector('#btn-clear-queue')?.addEventListener('click', () => state.clearQueue());

  // Local Files Dropzone
  const dropzone = document.querySelector('#local-dropzone');
  const fileInput = document.querySelector('#local-file-input');

  if (dropzone && fileInput) {
    document.querySelector('#btn-browse-files')?.addEventListener('click', (e) => {
      e.stopPropagation();
      fileInput.click();
    });

    dropzone.addEventListener('click', () => fileInput.click());

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('drag-over');
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('drag-over');
    });

    dropzone.addEventListener('drop', async (e) => {
      e.preventDefault();
      dropzone.classList.remove('drag-over');
      if (e.dataTransfer.files && e.dataTransfer.files.length) {
        state.showToast('Reading audio files...', 'info');
        const parsed = await processFilesList(e.dataTransfer.files);
        state.addLocalTracks(parsed);
      }
    });

    fileInput.addEventListener('change', async () => {
      if (fileInput.files && fileInput.files.length) {
        state.showToast('Reading audio files...', 'info');
        const parsed = await processFilesList(fileInput.files);
        state.addLocalTracks(parsed);
      }
    });
  }

  document.querySelector('#btn-play-all-local')?.addEventListener('click', () => {
    if (state.state.localTracks.length > 0) {
      state.playTrack(state.state.localTracks[0], state.state.localTracks);
    }
  });
}

// Global Keyboard Shortcuts
window.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT') return;

  if (e.code === 'Space') {
    e.preventDefault();
    state.togglePlayPause();
  } else if (e.code === 'ArrowRight' && (e.shiftKey || e.metaKey)) {
    state.nextTrack();
  } else if (e.code === 'ArrowLeft' && (e.shiftKey || e.metaKey)) {
    state.prevTrack();
  } else if (e.code === 'ArrowRight') {
    state.seek(state.state.currentTime + 5);
  } else if (e.code === 'ArrowLeft') {
    state.seek(state.state.currentTime - 5);
  } else if (e.code === 'ArrowUp') {
    state.setVolume(state.state.volume + 0.05);
  } else if (e.code === 'ArrowDown') {
    state.setVolume(state.state.volume - 0.05);
  } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    document.querySelector('#center-search-input')?.focus();
  } else if (e.key.toLowerCase() === 'l') {
    state.toggleLyrics();
  } else if (e.key.toLowerCase() === 'e') {
    state.toggleEqualizer();
  } else if (e.key.toLowerCase() === 'q') {
    state.toggleQueue();
  } else if (e.key.toLowerCase() === 't') {
    state.state.sleepTimerOpen = !state.state.sleepTimerOpen;
    state.emit('change');
  } else if (e.key.toLowerCase() === 'f') {
    state.toggleZenMode();
  } else if (e.key === 'Escape') {
    if (state.state.zenMode) state.toggleZenMode();
    else if (state.state.sleepTimerOpen) {
      state.state.sleepTimerOpen = false;
      state.emit('change');
    }
    else if (state.state.lyricsFullscreen) state.toggleLyrics(true);
    else if (state.state.lyricsOpen) state.toggleLyrics();
    else if (state.state.eqOpen) state.toggleEqualizer();
    else if (state.state.queueOpen) state.toggleQueue();
    else if (state.state.settingsOpen) state.toggleSettings();
  }
});

// Update timeline scrubber & lyrics smoothly on timeupdate
state.subscribe((currentState, event, data) => {
  if (event === 'timeupdate') {
    const { currentTime, duration } = data;
    const percent = duration > 0 ? (currentTime / duration) * 100 : 0;
    const scrubFill = document.querySelector('#timeline-scrubber-fill');
    if (scrubFill) scrubFill.style.width = `${percent}%`;

    const labelCur = document.querySelector('#label-current-time');
    if (labelCur) {
      const curMin = Math.floor(currentTime / 60);
      const curSec = Math.floor(currentTime % 60).toString().padStart(2, '0');
      labelCur.textContent = `${curMin}:${curSec}`;
    }

    // Update active lyric line and auto-scroll
    const lyrics = currentState.currentTrack ? currentState.currentTrack.lyrics : [];
    if (lyrics && lyrics.length) {
      let activeIdx = 0;
      for (let i = 0; i < lyrics.length; i++) {
        if (currentTime >= lyrics[i].time) activeIdx = i;
        else break;
      }

      // Update drawer lyrics
      document.querySelectorAll('#lyrics-drawer-container .apple-lyric-line').forEach((el, idx) => {
        if (idx === activeIdx) {
          if (!el.classList.contains('is-active-line')) {
            el.classList.add('is-active-line');
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        } else {
          el.classList.remove('is-active-line');
        }
      });

      // Update fullscreen lyrics
      document.querySelectorAll('#fs-lyrics-container .apple-fs-line').forEach((el, idx) => {
        if (idx === activeIdx) {
          if (!el.classList.contains('fs-active')) {
            el.classList.add('fs-active');
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        } else {
          el.classList.remove('fs-active');
        }
      });
    }
  } else {
    // Full re-render on state changes
    renderApp();
  }
});

// Initial boot
renderApp();
console.log('Ego Music: Groovesync Black Monochrome Desktop UI initialized.');

// Service Worker for offline PWA capabilities
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('ServiceWorker registration error:', err);
    });
  });
}
