import { state } from '../services/state.js';

export function renderLocalFilesView() {
  const localTracks = state.state.localTracks;
  const currentTrack = state.state.currentTrack;
  const isPlaying = state.state.isPlaying;

  return `
    <div class="local-files-view-container">
      <div class="shelf-header-row" style="margin-bottom: 20px;">
        <div>
          <h1 class="spotify-greeting-text" style="font-size: 26px; margin-bottom: 4px;">Local Music Library</h1>
          <p class="shelf-subheading">Play your personal lossless audio collection natively with embedded ID3 metadata extraction.</p>
        </div>
      </div>

      <!-- Dropzone Area -->
      <div class="dropzone-container" id="local-dropzone">
        <input type="file" id="local-file-input" multiple accept="audio/*,.mp3,.wav,.flac,.ogg,.m4a,.aac" style="display: none;" />
        <div class="dropzone-icon">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
        </div>
        <div class="dropzone-title">Drag & drop your audio files here</div>
        <div class="dropzone-subtitle">Supports FLAC, WAV, MP3, ALAC, AAC, and OGG formats with metadata parsing</div>
        <button class="btn-primary-play" id="btn-browse-files" style="margin: 0 auto;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
          Select Files from Disk
        </button>
      </div>

      <!-- Local Tracks Table -->
      <div class="shelf-header-row">
        <div>
          <h2 class="shelf-heading">Imported Tracks (${localTracks.length})</h2>
        </div>
        ${localTracks.length > 0 ? `
          <button class="btn-secondary" id="btn-play-all-local">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            Play All
          </button>
        ` : ''}
      </div>

      ${localTracks.length === 0 ? `
        <div style="padding: 48px 0; text-align: center; color: var(--text-tertiary); font-size: 13px;">
          No local files imported yet. Drag your music library files into the box above to get started.
        </div>
      ` : `
        <table class="apple-track-table">
          <thead>
            <tr>
              <th style="width: 44px; text-align: center;">#</th>
              <th>Title</th>
              <th>Album</th>
              <th>Format</th>
              <th style="text-align: right; width: 60px;">Time</th>
              <th style="width: 48px; text-align: center;"></th>
            </tr>
          </thead>
          <tbody>
            ${localTracks.map((track, idx) => {
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
                    <span class="table-source-chip">${track.quality || 'Local'}</span>
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
