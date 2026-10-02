/**
 * Ego Music Player — Sleep Timer Modal
 * Pure Black Monochrome obsidian card for sleep countdown selection.
 */

import { state } from '../services/state.js';

export function renderSleepTimerModal() {
  const isOpen = state.state.sleepTimerOpen || false;
  const timer = state.state.sleepTimer;

  const formatRemaining = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return `
    <div class="modal-backdrop ${isOpen ? 'open' : ''}" id="sleeptimer-modal-backdrop">
      <div class="modal-card" id="sleeptimer-modal-card" onclick="event.stopPropagation()" style="max-width: 440px;">
        <div class="modal-header">
          <div class="modal-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
            Sleep Timer
          </div>
          <button class="icon-btn" id="btn-close-sleeptimer">✕</button>
        </div>

        <div style="margin-bottom: 16px;">
          ${timer.active ? `
            <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: var(--radius-md); padding: 14px; text-align: center; margin-bottom: 16px;">
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); margin-bottom: 4px;">Timer Active</div>
              <div style="font-family: var(--font-mono); font-size: 28px; font-weight: 700; color: #ffffff;">
                ${timer.mode === 'end_of_track' ? 'End of Current Track' : formatRemaining(timer.remainingSeconds)}
              </div>
              <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">Audio will gently fade out and stop</div>
              <button class="btn btn-secondary" id="btn-cancel-sleeptimer" style="margin-top: 12px; width: 100%; border-color: rgba(244, 63, 94, 0.4); color: #f43f5e;">
                Turn Off Timer
              </button>
            </div>
          ` : `
            <div style="color: var(--text-secondary); font-size: 13px; margin-bottom: 16px; line-height: 1.5;">
              Select a duration to automatically pause music playback with a gentle 15-second fade out.
            </div>
          `}

          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
            <button class="timer-option-btn ${timer.active && timer.remainingSeconds === 900 ? 'active' : ''}" data-mins="15">
              <span class="timer-num">15</span>
              <span class="timer-unit">Minutes</span>
            </button>
            <button class="timer-option-btn ${timer.active && timer.remainingSeconds === 1800 ? 'active' : ''}" data-mins="30">
              <span class="timer-num">30</span>
              <span class="timer-unit">Minutes</span>
            </button>
            <button class="timer-option-btn ${timer.active && timer.remainingSeconds === 2700 ? 'active' : ''}" data-mins="45">
              <span class="timer-num">45</span>
              <span class="timer-unit">Minutes</span>
            </button>
            <button class="timer-option-btn ${timer.active && timer.remainingSeconds === 3600 ? 'active' : ''}" data-mins="60">
              <span class="timer-num">60</span>
              <span class="timer-unit">Minutes</span>
            </button>
          </div>

          <button class="timer-option-btn ${timer.active && timer.mode === 'end_of_track' ? 'active' : ''}" data-mode="end_of_track" style="margin-top: 10px; width: 100%; justify-content: center; gap: 8px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
            <span>Stop at End of Track</span>
          </button>
        </div>

        <div style="font-size: 11px; color: var(--text-muted); text-align: center; border-top: 1px solid var(--border-subtle); padding-top: 12px;">
          Press <kbd style="background: rgba(255,255,255,0.08); padding: 2px 6px; border-radius: 4px; font-family: var(--font-mono);">T</kbd> anywhere to toggle this menu.
        </div>
      </div>
    </div>
  `;
}
