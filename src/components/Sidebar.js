import { state } from '../services/state.js';
import { COLLECTIONS } from '../data/tracks.js';

export function renderSidebar() {
  const currentView = state.state.activeView;

  return `
    <aside id="sidebar-column">
      <!-- Top Navigation Menu -->
      <ul class="sidebar-nav-menu">
        <li class="nav-menu-item ${currentView === 'home' ? 'active' : ''}" data-nav="home">
          <svg viewBox="0 0 24 24" fill="${currentView === 'home' ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span>Home</span>
        </li>
        <li class="nav-menu-item ${currentView === 'songs' ? 'active' : ''}" data-nav="explore">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18V5l12-2v13"></path>
            <circle cx="6" cy="18" r="3"></circle>
            <circle cx="18" cy="16" r="3"></circle>
          </svg>
          <span>Songs</span>
        </li>
        <li class="nav-menu-item ${currentView === 'artists' ? 'active' : ''}" data-nav="explore">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>Artists</span>
        </li>
        <li class="nav-menu-item ${currentView === 'albums' ? 'active' : ''}" data-nav="explore">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          <span>Albums</span>
        </li>
        <li class="nav-menu-item ${currentView === 'podcast' ? 'active' : ''}" data-nav="explore">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
            <line x1="12" y1="19" x2="12" y2="23"></line>
            <line x1="8" y1="23" x2="16" y2="23"></line>
          </svg>
          <span>Podcast</span>
        </li>
      </ul>

      <!-- Your Collections Section -->
      <div class="collections-section">
        <div class="collections-header-row">
          <div class="collections-title-group">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>Your Collections</span>
          </div>
          <button class="btn-add-collection" id="btn-add-library-item" title="Create Playlist or Import Local Files">
            +
          </button>
        </div>

        <div class="collections-items-list">
          ${COLLECTIONS.map(col => `
            <div class="collection-item-row" data-collection-id="${col.id}" title="${col.name}">
              <img src="${col.image}" class="collection-thumb" alt="" />
              <div class="collection-meta">
                <span class="collection-name">${col.name}</span>
                <span class="collection-type">${col.type}</span>
              </div>
            </div>
          `).join('')}

          <!-- Local Files Access Row -->
          <div class="collection-item-row" data-nav="local" title="Local Files on your PC">
            <div class="collection-thumb" style="background: #1e1e26; display: flex; align-items: center; justify-content: center; color: #fff;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <div class="collection-meta">
              <span class="collection-name">Local Music</span>
              <span class="collection-type">Disk • ${state.state.localTracks.length} files</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  `;
}
