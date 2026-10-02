import { state } from '../services/state.js';
import { INITIAL_TRACKS } from '../data/tracks.js';

export function renderPlayerBar() {
  const currentTrack = state.state.currentTrack || INITIAL_TRACKS[0];
  const isPlaying = state.state.isPlaying;
  const isShuffle = state.state.isShuffle;
  const repeatMode = state.state.repeatMode;
  const currentTime = state.state.currentTime;
  const duration = state.state.duration || (currentTrack ? currentTrack.duration : 234);
  const volume = state.state.volume;
  const isMuted = state.state.isMuted;

  const currentMin = Math.floor(currentTime / 60);
  const currentSec = Math.floor(currentTime % 60).toString().padStart(2, '0');
  const totalMin = Math.floor(duration / 60);
  const totalSec = Math.floor(duration % 60).toString().padStart(2, '0');
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const volumePercent = isMuted ? 0 : Math.round(volume * 100);

  return `
    <footer id="floating-player-bar">
      <!-- Left Track Column -->
      <div class="player-left-col">
        <div class="player-thumb-wrap" id="player-thumb-action" title="Open Lyrics / Theater">
          <img src="${currentTrack.cover}" alt="${currentTrack.title}" />
        </div>
        <div class="player-meta-block">
          <span class="player-track-title" id="player-track-title-btn" title="${currentTrack.title}">
            ${currentTrack.title}
          </span>
          <span class="player-track-artist">
            ${currentTrack.artist}
          </span>
        </div>
        <div style="display: flex; align-items: center; gap: 4px; margin-left: 8px;">
          <button class="ctrl-btn ${state.state.likedTrackIds.has(currentTrack.id) ? 'active' : ''}" id="btn-player-like" title="Save to Liked Songs">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="${state.state.likedTrackIds.has(currentTrack.id) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          <button class="ctrl-btn ${state.state.offlineTrackIds && state.state.offlineTrackIds.has(currentTrack.id) ? 'active' : ''}" id="btn-player-download" title="${state.state.offlineTrackIds && state.state.offlineTrackIds.has(currentTrack.id) ? 'Available Offline' : 'Download Offline'}">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </button>
        </div>
      </div>

      <!-- Center Controls & Scrubber -->
      <div class="player-center-col">
        <span class="timeline-stamp" id="label-current-time">${currentMin}:${currentSec}</span>
        
        <div class="scrubber-track-bar" id="timeline-scrubber-track" title="Seek Audio">
          <div class="scrubber-fill-bar" id="timeline-scrubber-fill" style="width: ${progressPercent}%;">
            <div class="scrubber-thumb-dot"></div>
          </div>
        </div>

        <span class="timeline-stamp" id="label-total-duration">${totalMin}:${totalSec}</span>

        <div class="player-actions-row">
          <!-- Shuffle -->
          <button class="ctrl-btn ${isShuffle ? 'active' : ''}" id="btn-ctrl-shuffle" title="Shuffle (${isShuffle ? 'On' : 'Off'})">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="16 3 21 3 21 8"></polyline>
              <line x1="4" y1="20" x2="21" y2="3"></line>
              <polyline points="21 16 21 21 16 21"></polyline>
              <line x1="15" y1="15" x2="21" y2="21"></line>
              <line x1="4" y1="4" x2="9" y2="9"></line>
            </svg>
          </button>

          <!-- Previous -->
          <button class="ctrl-btn" id="btn-ctrl-prev" title="Previous Track">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="19 20 9 12 19 4 19 20"></polygon>
              <line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" stroke-width="2.5"></line>
            </svg>
          </button>

          <!-- Master Play / Pause Button -->
          <button class="ctrl-play-pause-circle" id="btn-ctrl-play" title="${isPlaying ? 'Pause' : 'Play'} (Space)">
            ${isPlaying ? `
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
              </svg>
            ` : `
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="transform: translateX(1px);">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            `}
          </button>

          <!-- Next -->
          <button class="ctrl-btn" id="btn-ctrl-next" title="Next Track">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 4 15 12 5 20 5 4"></polygon>
              <line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" stroke-width="2.5"></line>
            </svg>
          </button>

          <!-- Repeat -->
          <button class="ctrl-btn ${repeatMode !== 'off' ? 'active' : ''}" id="btn-ctrl-repeat" title="Repeat: ${repeatMode.toUpperCase()}">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="17 1 21 5 17 9"></polyline>
              <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
              <polyline points="7 23 3 19 7 15"></polyline>
              <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Right Tools & Volume -->
      <div class="player-right-col">
        <div class="volume-cluster">
          <button class="ctrl-btn" id="btn-player-mute" title="${isMuted ? 'Unmute' : 'Mute'}">
            ${isMuted || volume === 0 ? `
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <line x1="23" y1="9" x2="17" y2="15"></line>
                <line x1="17" y1="9" x2="23" y2="15"></line>
              </svg>
            ` : `
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
            `}
          </button>
          <div class="volume-slider-line" id="volume-track-bar" title="Volume: ${volumePercent}%">
            <div class="volume-fill-line" id="volume-fill-bar" style="width: ${volumePercent}%;"></div>
          </div>
        </div>

        <button class="ctrl-btn" id="btn-tool-lyrics" title="Live Synced Lyrics">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
            <line x1="12" y1="19" x2="12" y2="23"></line>
            <line x1="8" y1="23" x2="16" y2="23"></line>
          </svg>
        </button>

        <button class="ctrl-btn" id="btn-tool-eq" title="Parametric Equalizer">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="4" y1="21" x2="4" y2="14"></line>
            <line x1="4" y1="10" x2="4" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12" y2="3"></line>
            <line x1="20" y1="21" x2="20" y2="16"></line>
            <line x1="20" y1="12" x2="20" y2="3"></line>
          </svg>
        </button>

        <button class="ctrl-btn ${state.state.sleepTimer && state.state.sleepTimer.active ? 'active' : ''}" id="btn-player-sleeptimer" title="${state.state.sleepTimer && state.state.sleepTimer.active ? 'Sleep Timer Active' : 'Sleep Timer (T)'}">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>

        <button class="ctrl-btn" id="btn-tool-settings" title="Audio Settings">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </button>
      </div>
    </footer>
  `;
}
