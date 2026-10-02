import { state } from '../services/state.js';
import { INITIAL_TRACKS } from '../data/tracks.js';

export function renderRightSidebar() {
  const track = state.state.currentTrack || INITIAL_TRACKS[0];
  const isPlaying = state.state.isPlaying;

  // Queue tracks from state, fallback to CAS tracks matching screenshot
  let queueList = state.state.queue;
  if (!queueList || queueList.length === 0) {
    queueList = [
      INITIAL_TRACKS.find(t => t.id === 'track-sweet') || INITIAL_TRACKS[6],
      INITIAL_TRACKS.find(t => t.id === 'track-heavenly') || INITIAL_TRACKS[7],
      INITIAL_TRACKS.find(t => t.id === 'track-apocalypse') || INITIAL_TRACKS[8],
    ].filter(Boolean);
  }

  return `
    <aside id="now-playing-column">
      <div class="np-panel-card">
        <!-- Card Header with animated soundwave bars -->
        <div class="np-card-header">
          <div class="soundwave-bars" style="${isPlaying ? '' : 'animation-play-state: paused;'}">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span>Now Playing</span>
        </div>

        <!-- Big Hero Artwork Card -->
        <div class="np-hero-art-box" id="btn-hero-cover-action" title="Click for Synced Lyrics">
          <img src="${track.cover}" alt="${track.title}" />
        </div>

        <!-- Track Info Bar -->
        <div class="np-track-info-bar">
          <div>
            <div class="np-title">${track.title}</div>
            <div class="np-artist">${track.artist}</div>
          </div>
          <button class="np-queue-trigger-btn" id="btn-right-queue-modal" title="Manage Queue">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Embedded Queue Section -->
        <div class="queue-box">
          <span class="queue-label-text">Queue</span>
          <div class="queue-items-flow">
            ${queueList.slice(0, 4).map(item => `
              <div class="queue-item-row" data-track-id="${item.id}" title="Play ${item.title}">
                <div class="queue-item-left">
                  <img src="${item.cover}" class="queue-thumb" alt="" />
                  <div class="queue-titles">
                    <span class="queue-song-name">${item.title}</span>
                    <span class="queue-artist-name">${item.artist}</span>
                  </div>
                </div>
                <div class="queue-play-circle" data-track-id="${item.id}">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style="transform: translateX(1px);">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </aside>
  `;
}
