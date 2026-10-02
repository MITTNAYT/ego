import { state } from '../services/state.js';

export function renderSearchView() {
  const query = state.state.searchQuery.trim().toLowerCase();
  const availableTracks = state.getAllAvailableTracks();
  const filtered = query
    ? availableTracks.filter(t => 
        t.title.toLowerCase().includes(query) ||
        t.artist.toLowerCase().includes(query) ||
        t.album.toLowerCase().includes(query) ||
        (t.genre && t.genre.toLowerCase().includes(query))
      )
    : [];

  const topResult = filtered[0];
  const songResults = filtered.slice(0, 5);

  const browseCategories = [
    { title: 'Podcasts', color: '#006450' },
    { title: 'Live Events', color: '#8400e7' },
    { title: 'Made For You', color: '#1e3264' },
    { title: 'New Releases', color: '#e8115b' },
    { title: 'Cyberpunk & Darksynth', color: '#bc5900' },
    { title: 'Tokyo Lo-Fi', color: '#148a08' },
    { title: 'Audiophile Masters', color: '#503750' },
    { title: 'Ambient & Space', color: '#477d95' },
    { title: 'Chill & Relax', color: '#e91429' },
    { title: 'Deep Focus', color: '#537aa1' }
  ];

  return `
    <div class="search-view-container">
      ${!query ? `
        <!-- Spotify Browse Categories Matrix -->
        <h1 class="spotify-greeting-text" style="margin-bottom: 24px;">Browse all</h1>
        <div class="browse-categories-grid">
          ${browseCategories.map(cat => `
            <div class="category-tile" style="background-color: ${cat.color};">
              <span class="category-name">${cat.title}</span>
            </div>
          `).join('')}
        </div>
      ` : `
        <!-- Spotify Top Result + Songs Split Layout -->
        <div class="search-results-layout">
          ${topResult ? `
            <div class="top-result-section">
              <h2 class="shelf-heading" style="margin-bottom: 14px;">Top result</h2>
              <div class="top-result-card" data-track-id="${topResult.id}">
                <img src="${topResult.cover}" class="top-result-art" alt="" />
                <h3 class="top-result-title">${topResult.title}</h3>
                <div class="top-result-meta">
                  <span>${topResult.artist}</span>
                  <span class="apple-source-pill-tag">${topResult.source}</span>
                </div>
                <button class="spotify-floating-play top-result-play" title="Play ${topResult.title}">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                </button>
              </div>
            </div>
          ` : ''}

          <div class="songs-result-section">
            <h2 class="shelf-heading" style="margin-bottom: 14px;">Songs</h2>
            <div class="search-songs-list">
              ${songResults.map((track, idx) => {
                const isActive = state.state.currentTrack && state.state.currentTrack.id === track.id;
                const isLiked = state.isLiked(track.id);
                return `
                  <div class="search-song-row ${isActive ? 'is-playing-row' : ''}" data-track-id="${track.id}">
                    <img src="${track.cover}" class="table-art" alt="" />
                    <div class="table-track-titles" style="flex: 1;">
                      <span class="table-song-title ${isActive ? 'active-title' : ''}">${track.title}</span>
                      <span class="table-artist-subtitle">${track.artist}</span>
                    </div>
                    <span class="table-source-chip chip-${track.source}">${track.source}</span>
                    <button class="player-heart-btn ${isLiked ? 'liked' : ''}" data-like-track-id="${track.id}">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="${isLiked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    </button>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      `}
    </div>
  `;
}
