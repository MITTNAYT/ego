import { state } from '../services/state.js';

export function renderPlaylistView(playlist) {
  if (!playlist) return '<div style="padding: 40px; color: var(--text-tertiary);">Playlist not found</div>';

  const allTracks = state.state.allTracks;
  const playlistTracks = playlist.isLikedSongs
    ? allTracks.filter(t => state.isLiked(t.id))
    : allTracks.filter(t => (playlist.tracks || []).includes(t.id));

  const currentTrack = state.state.currentTrack;
  const isPlaying = state.state.isPlaying;

  return `
    <div class="playlist-view-container">
      <!-- Playlist Grand Glass Header -->
      <div style="display: flex; gap: 28px; align-items: flex-end; margin-bottom: 36px; padding: 12px 0;">
        <div style="width: 200px; height: 200px; border-radius: var(--radius-md); overflow: hidden; box-shadow: var(--shadow-card); flex-shrink: 0;">
          <img src="${playlist.cover}" alt="${playlist.title}" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        <div>
          <div style="font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-tertiary); font-weight: 700; margin-bottom: 6px;">
            ${playlist.isLikedSongs ? 'LIBRARY PLAYLIST' : 'EGO PLAYLIST'}
          </div>
          <h1 class="spotify-greeting-text" style="font-size: 38px; margin-bottom: 8px;">${playlist.title}</h1>
          <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 18px; max-width: 600px;">
            ${playlist.description || 'Curated high-resolution audio collection.'}
          </p>
          <div style="display: flex; align-items: center; gap: 14px; font-size: 13px; color: var(--text-tertiary);">
            <span><strong style="color: #fff;">${playlistTracks.length}</strong> tracks</span>
            <span>•</span>
            <button class="btn-primary-play" id="btn-play-playlist">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              Play All
            </button>
            <button class="btn-secondary" id="btn-shuffle-playlist">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line><polyline points="21 16 21 21 16 21"></polyline><line x1="15" y1="15" x2="21" y2="21"></line><line x1="4" y1="4" x2="9" y2="9"></line></svg>
              Shuffle
            </button>
          </div>
        </div>
      </div>

      <!-- Unified Tracks Table -->
      ${playlistTracks.length === 0 ? `
        <div style="padding: 48px 0; text-align: center; color: var(--text-tertiary); font-size: 13px;">
          No tracks in this playlist yet. Add songs by clicking the heart button or adding local files.
        </div>
      ` : `
        <table class="apple-track-table">
          <thead>
            <tr>
              <th style="width: 44px; text-align: center;">#</th>
              <th>Title</th>
              <th>Album</th>
              <th>Source</th>
              <th>Audio Resolution</th>
              <th style="text-align: right; width: 60px;">Time</th>
              <th style="width: 48px; text-align: center;"></th>
            </tr>
          </thead>
          <tbody>
            ${playlistTracks.map((track, idx) => {
              const isActive = currentTrack && currentTrack.id === track.id;
              const isLiked = state.isLiked(track.id);
              const minutes = Math.floor(track.duration / 60);
              const seconds = Math.floor(track.duration % 60).toString().padStart(2, '0');

              return `
                <tr class="apple-track-row ${isActive ? 'is-playing-row' : ''}" data-track-id="${track.id}">
                  <td style="text-align: center; font-family: var(--font-mono); font-size: 13px; color: var(--text-tertiary);">
                    ${isActive && isPlaying ? `
                      <div class="table-equalizer-bars">
                        <span></span><span></span><span></span><span></span>
                      </div>
                    ` : `
                      <span class="row-num">${idx + 1}</span>
                      <button class="row-play-btn">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                      </button>
                    `}
                  </td>
                  <td>
                    <div class="table-track-block">
                      <img src="${track.cover}" class="table-art" alt="" />
                      <div class="table-track-titles">
                        <span class="table-song-title ${isActive ? 'active-title' : ''}">${track.title}</span>
                        <span class="table-artist-subtitle">${track.artist}</span>
                      </div>
                    </div>
                  </td>
                  <td class="table-album-cell">${track.album}</td>
                  <td>
                    <span class="table-source-chip">${track.source}</span>
                  </td>
                  <td style="font-family: var(--font-mono); font-size: 11px; color: var(--text-tertiary);">
                    ${track.quality}
                  </td>
                  <td style="text-align: right; font-family: var(--font-mono); font-size: 12px; color: var(--text-tertiary);">
                    ${minutes}:${seconds}
                  </td>
                  <td style="text-align: center;">
                    <button class="player-heart-btn ${isLiked ? 'liked' : ''}" data-like-track-id="${track.id}">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="${isLiked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    </button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `}
    </div>
  `;
}
