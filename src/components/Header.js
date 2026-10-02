import { state } from '../services/state.js';
import { STREAMING_SOURCES } from '../data/tracks.js';

export function renderHeader() {
  const currentFilter = state.state.activeSourceFilter;
  const searchQuery = state.state.searchQuery;

  return `
    <header id="apple-top-header">
      <!-- Navigation & Traffic Lights -->
      <div class="header-left-cluster">
        <div class="mac-traffic-lights">
          <div class="traffic-dot dot-close"></div>
          <div class="traffic-dot dot-min"></div>
          <div class="traffic-dot dot-max"></div>
        </div>

        <div class="history-nav-pills">
          <button class="nav-circle-btn" id="btn-nav-back" title="Back">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <button class="nav-circle-btn" id="btn-nav-forward" title="Forward">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </div>

      <!-- Center Search Pill (Apple Music + Spotify Search Box) -->
      <div class="header-search-container">
        <svg class="search-glass-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input 
          type="text" 
          id="global-search-input" 
          class="apple-search-field" 
          placeholder="What do you want to play?" 
          value="${searchQuery}" 
        />
        <span class="search-key-badge">⌘K</span>
      </div>

      <!-- Source Filter Chips (Spotify Home Pills / Apple Segmented Controls) -->
      <div class="header-sources-bar">
        ${STREAMING_SOURCES.slice(0, 5).map(source => `
          <button 
            class="apple-segmented-pill ${currentFilter === source.id ? 'active' : ''}" 
            data-source-pill="${source.id}"
          >
            ${source.name}
          </button>
        `).join('')}
      </div>

      <!-- Right Profile & Tools -->
      <div class="header-right-cluster">
        <button class="header-icon-action" id="btn-header-eq" title="Parametric Equalizer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
        </button>

        <button class="header-icon-action" id="btn-header-settings" title="Audio Engine Settings">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
        </button>

        <div class="user-avatar-pill" title="Ego Lossless Subscriber">
          <div class="avatar-gradient"></div>
        </div>
      </div>
    </header>
  `;
}
