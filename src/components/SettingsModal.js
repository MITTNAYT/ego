import { state } from '../services/state.js';

export function renderSettingsModal() {
  const isOpen = state.state.settingsOpen;
  const settings = state.state.settings;
  const scrobbling = state.state.scrobbling;

  return `
    <div class="modal-backdrop ${isOpen ? 'open' : ''}" id="settings-modal-backdrop">
      <div class="modal-card" id="settings-modal-card" onclick="event.stopPropagation()">
        <div class="modal-header">
          <div class="modal-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            Preferences & Audio Engine
          </div>
          <button class="icon-btn" id="btn-close-settings">✕</button>
        </div>

        <!-- Section 1: Audio Playback Engine -->
        <div>
          <div style="font-family: var(--font-heading); font-size: 14px; font-weight: 700; margin-bottom: 12px; color: var(--text-primary);">
            High-Fidelity Audio Engine
          </div>
          <div style="background: rgba(10, 12, 18, 0.6); border-radius: var(--radius-md); padding: 14px; border: 1px solid var(--border-subtle); display: flex; flex-direction: column; gap: 12px; font-size: 13px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-weight: 600;">Bit-Perfect Output</div>
                <div style="color: var(--text-muted); font-size: 11px;">Bypasses OS resamplers for pure 24-bit 96kHz stream</div>
              </div>
              <input type="checkbox" checked style="accent-color: var(--apple-accent); width: 16px; height: 16px;" />
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-weight: 600;">Gapless Playback</div>
                <div style="color: var(--text-muted); font-size: 11px;">Seamless track transitions with pre-buffering</div>
              </div>
              <input type="checkbox" checked style="accent-color: var(--apple-accent); width: 16px; height: 16px;" />
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-weight: 600;">ReplayGain Normalization</div>
                <div style="color: var(--text-muted); font-size: 11px;">Prevents sudden volume spikes across services</div>
              </div>
              <input type="checkbox" checked style="accent-color: var(--apple-accent); width: 16px; height: 16px;" />
            </div>
          </div>
        </div>

        <!-- Section 2: Scrobbling Services -->
        <div>
          <div style="font-family: var(--font-heading); font-size: 14px; font-weight: 700; margin-bottom: 12px; color: var(--text-primary);">
            Scrobbling Integration
          </div>
          <div style="background: rgba(10, 12, 18, 0.6); border-radius: var(--radius-md); padding: 14px; border: 1px solid var(--border-subtle); display: flex; flex-direction: column; gap: 10px; font-size: 13px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="color: #f43f5e; font-weight: 700;">Last.fm</span>
                <span class="badge-version" style="color: #34d399;">Connected</span>
              </div>
              <span style="font-family: var(--font-mono); font-size: 11px; color: var(--text-muted);">
                ${scrobbling.sessionScrobbles} scrobbled this session
              </span>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.06);">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="color: #38bdf8; font-weight: 700;">ListenBrainz</span>
                <span class="badge-version" style="color: #34d399;">Active</span>
              </div>
              <span style="font-family: var(--font-mono); font-size: 11px; color: var(--text-muted);">Broadcasting Live</span>
            </div>
          </div>
        </div>

        <!-- Section 3: Cross-Platform Sync & Backup -->
        <div>
          <div style="font-family: var(--font-heading); font-size: 14px; font-weight: 700; margin-bottom: 12px; color: var(--text-primary); display: flex; align-items: center; gap: 6px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            Cross-Platform Sync & Backup
          </div>
          <div style="background: rgba(10, 12, 18, 0.6); border-radius: var(--radius-md); padding: 14px; border: 1px solid var(--border-subtle); display: flex; flex-direction: column; gap: 12px; font-size: 13px;">
            <div style="color: var(--text-secondary); font-size: 12px; line-height: 1.4;">
              Export your liked tracks, custom playlists, and equalizer presets to a unified JSON file compatible between Ego Web and Native Android.
            </div>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
              <button class="btn btn-secondary" id="btn-export-backup" style="flex: 1; min-width: 140px; display: inline-flex; align-items: center; justify-content: center; gap: 6px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Export Library (.json)
              </button>
              <label class="btn btn-secondary" style="flex: 1; min-width: 140px; display: inline-flex; align-items: center; justify-content: center; gap: 6px; cursor: pointer; margin-bottom: 0;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                Restore Backup
                <input type="file" id="input-import-backup" accept=".json" style="display: none;" />
              </label>
            </div>
          </div>
        </div>

        <!-- Section 4: Offline Storage Manager -->
        <div>
          <div style="font-family: var(--font-heading); font-size: 14px; font-weight: 700; margin-bottom: 12px; color: var(--text-primary); display: flex; align-items: center; gap: 6px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
            Offline Storage
          </div>
          <div style="background: rgba(10, 12, 18, 0.6); border-radius: var(--radius-md); padding: 14px; border: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center; font-size: 13px;">
            <div>
              <div style="font-weight: 600;">Downloaded Tracks</div>
              <div style="color: var(--text-muted); font-size: 11px;">
                ${state.state.offlineTrackIds ? state.state.offlineTrackIds.size : 0} tracks cached in IndexedDB
              </div>
            </div>
            <button class="btn btn-secondary" id="btn-clear-offline" style="border-color: rgba(244, 63, 94, 0.3); color: #f43f5e; padding: 6px 12px; font-size: 12px;">
              Clear All Cache
            </button>
          </div>
        </div>

        <!-- About Sonora / Ego -->
        <div style="font-size: 11px; color: var(--text-muted); line-height: 1.5; border-top: 1px solid var(--border-subtle); padding-top: 12px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <strong>Ego Music Player</strong> v1.2.0 • Pure Black Monochrome Edition
          </div>
          <span class="badge-version" style="color: #ffffff; border-color: rgba(255,255,255,0.2);">PWA Offline Ready</span>
        </div>
      </div>
    </div>
  `;
}
