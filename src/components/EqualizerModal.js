import { state } from '../services/state.js';

export function renderEqualizerModal() {
  const isOpen = state.state.eqOpen;
  const bands = state.state.eqBands;
  const preAmp = state.state.eqPreAmp;
  const currentPreset = state.state.eqPreset;

  const frequencies = ['32Hz', '64Hz', '125Hz', '250Hz', '500Hz', '1kHz', '2kHz', '4kHz', '8kHz', '16kHz'];
  const presets = ['Flat', 'Bass Boost', 'Electronic', 'Vocal Clarity', 'Acoustic', 'Rock', 'Lo-Fi Warmth'];

  return `
    <div class="modal-backdrop ${isOpen ? 'open' : ''}" id="eq-modal-backdrop">
      <div class="modal-card" id="eq-modal-card" onclick="event.stopPropagation()">
        <div class="modal-header">
          <div class="modal-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
            10-Band Parametric Equalizer
          </div>
          <button class="icon-btn" id="btn-close-eq">✕</button>
        </div>

        <!-- Presets Row -->
        <div class="eq-presets-row">
          ${presets.map(p => `
            <button class="eq-preset-chip ${currentPreset === p ? 'active' : ''}" data-eq-preset="${p}">
              ${p}
            </button>
          `).join('')}
        </div>

        <!-- Sliders Board -->
        <div class="eq-sliders-board">
          <!-- Pre-amp Column -->
          <div class="eq-slider-col" style="border-right: 1px solid var(--border-subtle); padding-right: 14px; margin-right: 6px;">
            <span class="eq-gain-val">${preAmp > 0 ? '+' : ''}${preAmp}dB</span>
            <input type="range" min="-12" max="12" step="0.5" value="${preAmp}" id="eq-slider-preamp" orient="vertical" />
            <span class="eq-freq-label" style="font-weight: 700; color: var(--text-primary);">PREAMP</span>
          </div>

          <!-- 10 Frequency Bands -->
          ${frequencies.map((freq, idx) => {
            const gain = bands[idx] || 0;
            return `
              <div class="eq-slider-col">
                <span class="eq-gain-val">${gain > 0 ? '+' : ''}${gain}dB</span>
                <input 
                  type="range" 
                  min="-12" 
                  max="12" 
                  step="0.5" 
                  value="${gain}" 
                  data-eq-band-index="${idx}" 
                  orient="vertical" 
                />
                <span class="eq-freq-label">${freq}</span>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Bottom Options -->
        <div style="display: flex; align-items: center; justify-content: space-between; font-size: 12px; color: var(--text-muted);">
          <span>Hardware Accel: <strong>Web Audio DSP 64-bit Float</strong></span>
          <button class="btn-secondary" id="btn-reset-eq" style="height: 32px; padding: 0 14px; font-size: 11px;">
            Reset to Flat
          </button>
        </div>
      </div>
    </div>
  `;
}
