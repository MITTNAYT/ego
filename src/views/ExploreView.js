import { state } from '../services/state.js';
import { PLAYLISTS } from '../data/tracks.js';

export function renderExploreView() {
  const genres = [
    { name: 'Cyberpunk & Darksynth', color: 'linear-gradient(135deg, #1e1b4b, #312e81)', tracks: '128 tracks' },
    { name: 'Tokyo City Pop & Lo-Fi', color: 'linear-gradient(135deg, #1e293b, #0f172a)', tracks: '94 tracks' },
    { name: 'Audiophile Lossless Masters', color: 'linear-gradient(135deg, #27272a, #18181b)', tracks: '45 tracks' },
    { name: 'Ambient & Space Drone', color: 'linear-gradient(135deg, #064e3b, #022c22)', tracks: '72 tracks' },
    { name: 'Subsonic Deep Archives', color: 'linear-gradient(135deg, #3730a3, #1e1b4b)', tracks: '210 tracks' },
    { name: 'Retrowave & Outrun 80s', color: 'linear-gradient(135deg, #831843, #500724)', tracks: '86 tracks' },
  ];

  return `
    <div class="explore-view-container">
      <div class="shelf-header-row" style="margin-bottom: 20px;">
        <div>
          <h1 class="spotify-greeting-text" style="font-size: 26px; margin-bottom: 4px;">Explore Catalogs</h1>
          <p class="shelf-subheading">Curated genres, digital master archives, and cloud streaming feeds.</p>
        </div>
      </div>

      <!-- Genre Bento Cards (Subdued, High-Fashion Palette) -->
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px; margin-bottom: 36px;">
        ${genres.map(g => `
          <div style="height: 110px; border-radius: var(--radius-md); background: ${g.color}; border: 1px solid var(--border-subtle); padding: 18px; display: flex; flex-direction: column; justify-content: space-between; cursor: pointer; transition: transform 0.15s, box-shadow 0.15s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
            <div style="font-family: var(--font-display); font-weight: 700; font-size: 16px; color: #fff;">${g.name}</div>
            <div style="font-family: var(--font-mono); font-size: 11px; color: var(--text-secondary); font-weight: 500;">${g.tracks}</div>
          </div>
        `).join('')}
      </div>

      <!-- Playlists section -->
      <div class="shelf-header-row">
        <div>
          <h2 class="shelf-heading">Curated Provider Playlists</h2>
          <p class="shelf-subheading">Handcrafted high-fidelity playlists ready to stream.</p>
        </div>
      </div>

      <div class="spotify-card-carousel">
        ${PLAYLISTS.map(pl => `
          <div class="spotify-media-card playlist-card" data-playlist-id="${pl.id}">
            <div class="media-cover-box">
              <img src="${pl.cover}" alt="${pl.title}" loading="lazy" />
              <span class="apple-source-pill-tag">${pl.source}</span>
              <button class="spotify-floating-play" title="Play ${pl.title}">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              </button>
            </div>
            <div class="media-title-line">${pl.title}</div>
            <div class="media-artist-line">${pl.trackCount} tracks • ${pl.duration}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
