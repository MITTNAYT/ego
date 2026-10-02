import { state } from '../services/state.js';

export function renderQueueModal() {
  const isOpen = state.state.queueOpen;
  const queue = state.state.queue;
  const currentTrack = state.state.currentTrack;

  return `
    <div id="queue-panel" class="${isOpen ? 'open' : ''}">
      <div class="lyrics-header">
        <div class="lyrics-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
          Play Queue (${queue.length})
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          ${queue.length > 0 ? `
            <button id="btn-clear-queue" class="btn-secondary" style="height: 26px; padding: 0 8px; font-size: 10px;">
              Clear
            </button>
          ` : ''}
          <button class="icon-btn" id="btn-close-queue" style="width: 28px; height: 28px;">✕</button>
        </div>
      </div>

      <div class="queue-items-list">
        <!-- Now Playing item -->
        ${currentTrack ? `
          <div style="font-family: var(--font-mono); font-size: 10px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; padding: 6px 4px 2px;">
            Now Playing
          </div>
          <div class="queue-item" style="background: rgba(255, 255, 255, 0.08); border-color: var(--border-glass-bright);">
            <img src="${currentTrack.cover}" class="queue-item-thumb" alt="" />
            <div class="queue-item-meta">
              <div class="queue-item-title" style="color: #fff;">${currentTrack.title}</div>
              <div class="queue-item-artist">${currentTrack.artist}</div>
            </div>
            <div class="table-equalizer-bars" style="margin-right: 6px;">
              <span></span><span></span><span></span><span></span>
            </div>
          </div>
        ` : ''}

        <div style="font-family: var(--font-mono); font-size: 10px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; padding: 12px 4px 4px;">
          Up Next (${queue.length})
        </div>

        ${queue.length === 0 ? `
          <div style="padding: 30px 10px; text-align: center; color: var(--text-muted); font-size: 12px;">
            The queue is empty. Tracks will play sequentially from your library.
          </div>
        ` : queue.map((track, idx) => `
          <div class="queue-item" data-queue-track-id="${track.id}">
            <img src="${track.cover}" class="queue-item-thumb" alt="" />
            <div class="queue-item-meta">
              <div class="queue-item-title">${track.title}</div>
              <div class="queue-item-artist">${track.artist}</div>
            </div>
            <button class="icon-btn btn-remove-queue-item" data-remove-index="${idx}" style="width: 24px; height: 24px; font-size: 12px;" title="Remove from queue">
              ✕
            </button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
