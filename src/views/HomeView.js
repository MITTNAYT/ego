import { state } from '../services/state.js';
import { ARTISTS, INITIAL_TRACKS } from '../data/tracks.js';

export function renderHomeView() {
  const currentTrack = state.state.currentTrack;
  const isPlaying = state.state.isPlaying;

  // 3 trending tracks matching reference image
  const trendingTracks = [
    INITIAL_TRACKS.find(t => t.id === 'track-frank') || INITIAL_TRACKS[1],
    INITIAL_TRACKS.find(t => t.id === 'track-yoasobi') || INITIAL_TRACKS[2],
    INITIAL_TRACKS.find(t => t.id === 'track-syre') || INITIAL_TRACKS[3]
  ];

  // Recently played tracks matching reference image
  const recentTracks = [
    INITIAL_TRACKS.find(t => t.id === 'track-trance') || INITIAL_TRACKS[4],
    INITIAL_TRACKS.find(t => t.id === 'track-look') || INITIAL_TRACKS[5],
    INITIAL_TRACKS.find(t => t.id === 'track-cry') || INITIAL_TRACKS[0],
    INITIAL_TRACKS.find(t => t.id === 'track-sweet') || INITIAL_TRACKS[6],
  ].filter(Boolean);

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  return `
    <div class="home-center-view">
      <!-- Center Top Header Row -->
      <div class="center-header-row">
        <div class="greeting-block">
          <h1 class="greeting-title">Welcome back, Kenshii!</h1>
          <span class="greeting-subtitle">112 new playlist for you</span>
        </div>

        <div class="header-tools-cluster">
          <div class="search-pill-container">
            <svg class="search-pill-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              class="search-pill-input" 
              id="center-search-input" 
              placeholder="Search music, artists..." 
              value="${state.state.searchQuery || ''}"
            />
          </div>

          <button class="icon-circle-tool" id="btn-header-cast" title="AirPlay / Google Cast">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"></path>
              <line x1="2" y1="20" x2="2.01" y2="20"></line>
            </svg>
          </button>

          <div class="header-avatar-circle" id="btn-header-avatar" title="Kenshii Profile">
            <img src="/covers/jvke.jpg" class="avatar-inner-img" alt="Avatar" />
          </div>
        </div>
      </div>

      <!-- Section 1: Trending songs this week (3 Wide Landscape Cards) -->
      <div class="section-headline-bar">
        <span class="section-headline-text">Trending songs this week</span>
        <span class="see-all-link" data-nav="explore">See all</span>
      </div>

      <div class="trending-cards-grid">
        ${trendingTracks.map(track => {
          if (!track) return '';
          const isThisPlaying = isPlaying && currentTrack && currentTrack.id === track.id;
          return `
            <div class="trending-card-box" data-track-id="${track.id}">
              <img src="${track.cover}" class="trending-card-img" alt="${track.title}" />
              <div class="trending-card-glass-strip">
                <div class="trending-meta-text">
                  <span class="trending-song-name">${track.title}</span>
                  <span class="trending-artist-name">${track.artist}</span>
                </div>
                <span class="trending-duration-label">${formatTime(track.duration)}</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Section 2: Popular artists (5 Circular Avatars) -->
      <div class="section-headline-bar">
        <span class="section-headline-text">Popular artists</span>
        <span class="see-all-link" data-nav="explore">See all</span>
      </div>

      <div class="popular-artists-grid">
        ${ARTISTS.map(artist => `
          <div class="artist-circle-item" data-artist-name="${artist.name}">
            <img src="${artist.image}" class="artist-circle-avatar" alt="${artist.name}" />
            <span class="artist-circle-name">${artist.name}</span>
          </div>
        `).join('')}
      </div>

      <!-- Section 3: Recently played (List rows) -->
      <div class="section-headline-bar">
        <span class="section-headline-text">Recently played</span>
        <span class="see-all-link" data-nav="explore">See all</span>
      </div>

      <div class="recently-played-list">
        ${recentTracks.map(track => {
          const isThisPlaying = isPlaying && currentTrack && currentTrack.id === track.id;
          return `
            <div class="recent-track-row" data-track-id="${track.id}">
              <div class="recent-left-block">
                <img src="${track.cover}" class="recent-thumb" alt="" />
                <div class="recent-titles-meta">
                  <span class="recent-song-title">${track.title}</span>
                  <span class="recent-artist-subtitle">${track.artist}</span>
                </div>
              </div>
              <div class="recent-right-block">
                <span class="recent-time-label">${formatTime(track.duration)}</span>
                <button class="recent-play-circle" data-track-id="${track.id}" title="Play ${track.title}">
                  ${isThisPlaying ? `
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="6" y="4" width="4" height="16"></rect>
                      <rect x="14" y="4" width="4" height="16"></rect>
                    </svg>
                  ` : `
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style="transform: translateX(1px);">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  `}
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}
