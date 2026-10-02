import { state } from '../services/state.js';

export function renderLyricsModal() {
  const currentTrack = state.state.currentTrack;
  const isLyricsOpen = state.state.lyricsOpen;
  const isFullscreen = state.state.lyricsFullscreen;
  const showRomanized = state.state.lyricsRomanized;
  const currentTime = state.state.currentTime;

  const lyrics = (currentTrack && currentTrack.lyrics) || [
    { time: 0, text: "No synchronized lyrics available for this track." }
  ];

  let activeIndex = 0;
  for (let i = 0; i < lyrics.length; i++) {
    if (currentTime >= lyrics[i].time) {
      activeIndex = i;
    } else {
      break;
    }
  }

  return `
    <!-- Apple Music Side Lyrics Panel -->
    <div id="lyrics-panel" class="${isLyricsOpen ? 'open' : ''}">
      <div class="apple-lyrics-topbar">
        <div class="apple-lyrics-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
          Live Lyrics
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <button class="apple-pill-btn ${showRomanized ? 'active' : ''}" id="btn-toggle-romanize" title="Toggle Romanized Lyrics">
            Aa
          </button>
          <button class="icon-btn-compact" id="btn-close-lyrics">✕</button>
        </div>
      </div>

      <div class="apple-lyrics-scroll-body" id="lyrics-drawer-container">
        ${lyrics.map((line, idx) => {
          const isActive = idx === activeIndex;
          const isPassed = idx < activeIndex;
          return `
            <div 
              class="apple-lyric-line ${isActive ? 'is-active-line' : ''} ${isPassed ? 'is-passed-line' : ''}" 
              data-lyric-time="${line.time}"
              id="lyric-drawer-line-${idx}"
            >
              <span class="lyric-text-span">${line.text}</span>
              ${showRomanized && line.romanized ? `
                <span class="apple-romanized-sub">${line.romanized}</span>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Apple Music Iconic Full-Screen Karaoke Theater -->
    <div id="lyrics-fullscreen-modal" class="${isFullscreen ? 'open' : ''}">
      <div class="apple-fs-backdrop-mesh" style="background: radial-gradient(circle at 40% 40%, var(--accent-dynamic) 0%, transparent 70%);"></div>

      <div class="apple-fs-header">
        <div class="apple-fs-track-badge">
          <img src="${currentTrack ? currentTrack.cover : ''}" class="apple-fs-mini-thumb" alt="" />
          <div>
            <div style="font-weight: 700; color: #fff;">${currentTrack ? currentTrack.title : ''}</div>
            <div style="font-size: 13px; color: rgba(255,255,255,0.7);">${currentTrack ? currentTrack.artist : ''}</div>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 14px;">
          <button class="apple-pill-btn ${showRomanized ? 'active' : ''}" id="btn-fs-toggle-romanize" style="padding: 6px 14px; font-size: 14px;">
            Aa Romanize
          </button>
          <button class="icon-btn-compact" id="btn-close-fs-lyrics" style="width: 36px; height: 36px; font-size: 18px;">
            ✕
          </button>
        </div>
      </div>

      <div class="apple-fs-stage">
        <div class="apple-fs-left-cover">
          <img src="${currentTrack ? currentTrack.cover : ''}" class="apple-fs-hero-art" alt="" />
          <div class="apple-fs-album-name">${currentTrack ? currentTrack.album : ''}</div>
          <div class="apple-fs-audio-format">${currentTrack ? currentTrack.quality : 'Apple Lossless ALAC'}</div>
        </div>

        <div class="apple-fs-lyrics-column" id="fs-lyrics-container">
          ${lyrics.map((line, idx) => {
            const isActive = idx === activeIndex;
            const isPassed = idx < activeIndex;
            return `
              <div 
                class="apple-fs-line ${isActive ? 'fs-active' : ''} ${isPassed ? 'fs-passed' : ''}" 
                data-lyric-time="${line.time}"
                id="lyric-fs-line-${idx}"
              >
                <div class="fs-text">${line.text}</div>
                ${showRomanized && line.romanized ? `
                  <div class="fs-romanized">${line.romanized}</div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}
