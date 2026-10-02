// Web Audio API Engine for Ego (Sonora-style Bit-Perfect playback & DSP)
class AudioEngine {
  constructor() {
    this.audio = new Audio();
    this.audio.crossOrigin = 'anonymous';
    this.audio.preload = 'auto';

    this.ctx = null;
    this.sourceNode = null;
    this.analyser = null;
    this.preAmpNode = null;
    this.volumeNode = null;
    this.eqFilters = [];

    this.frequencies = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
    this.eqGains = new Array(this.frequencies.length).fill(0); // in dB
    this.preAmpGain = 0; // in dB

    this.listeners = {
      timeupdate: [],
      ended: [],
      play: [],
      pause: [],
      error: [],
      loadedmetadata: []
    };

    this.setupAudioListeners();
  }

  initContext() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();

    // Create Source from HTMLAudioElement
    try {
      this.sourceNode = this.ctx.createMediaElementSource(this.audio);
    } catch (e) {
      console.warn('MediaElementSource already created or error:', e);
      return;
    }

    // Pre-amp gain
    this.preAmpNode = this.ctx.createGain();
    this.preAmpNode.gain.value = 1.0;

    // Create 10-Band EQ filters
    this.eqFilters = this.frequencies.map((freq, idx) => {
      const filter = this.ctx.createBiquadFilter();
      if (idx === 0) {
        filter.type = 'lowshelf';
      } else if (idx === this.frequencies.length - 1) {
        filter.type = 'highshelf';
      } else {
        filter.type = 'peaking';
        filter.Q.value = 1.4;
      }
      filter.frequency.value = freq;
      filter.gain.value = this.eqGains[idx];
      return filter;
    });

    // Master volume node
    this.volumeNode = this.ctx.createGain();
    this.volumeNode.gain.value = this.audio.volume;

    // Analyser Node for Live Spectrum & Visualizers
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.82;

    // Connect node chain:
    // source -> preAmp -> eq[0] -> eq[1] ... -> eq[9] -> volumeNode -> analyser -> destination
    let current = this.sourceNode;
    current.connect(this.preAmpNode);
    current = this.preAmpNode;

    this.eqFilters.forEach(filter => {
      current.connect(filter);
      current = filter;
    });

    current.connect(this.volumeNode);
    this.volumeNode.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);
  }

  ensureContext() {
    this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setupAudioListeners() {
    this.audio.addEventListener('timeupdate', () => {
      this.emit('timeupdate', {
        currentTime: this.audio.currentTime,
        duration: this.audio.duration || 0
      });
    });

    this.audio.addEventListener('ended', () => {
      this.emit('ended');
    });

    this.audio.addEventListener('play', () => {
      this.emit('play');
    });

    this.audio.addEventListener('pause', () => {
      this.emit('pause');
    });

    this.audio.addEventListener('error', (e) => {
      console.warn('Audio playback error:', e);
      this.emit('error', e);
    });

    this.audio.addEventListener('loadedmetadata', () => {
      this.emit('loadedmetadata', {
        duration: this.audio.duration || 0
      });
    });
  }

  on(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback);
    }
  }

  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }

  async loadAndPlay(url) {
    this.ensureContext();
    this.audio.src = url;
    try {
      await this.audio.play();
    } catch (err) {
      console.warn('Autoplay or load interrupted:', err);
      throw err;
    }
  }

  async play() {
    this.ensureContext();
    return this.audio.play();
  }

  pause() {
    this.audio.pause();
  }

  seek(timeInSeconds) {
    if (!isNaN(timeInSeconds) && isFinite(timeInSeconds)) {
      this.audio.currentTime = Math.max(0, Math.min(timeInSeconds, this.audio.duration || 0));
    }
  }

  setVolume(vol) {
    const clamped = Math.max(0, Math.min(1, vol));
    this.audio.volume = clamped;
    if (this.volumeNode && this.ctx) {
      this.volumeNode.gain.setValueAtTime(clamped, this.ctx.currentTime);
    }
  }

  getVolume() {
    return this.audio.volume;
  }

  setMuted(muted) {
    this.audio.muted = !!muted;
  }

  isMuted() {
    return this.audio.muted;
  }

  getCurrentTime() {
    return this.audio.currentTime;
  }

  getDuration() {
    return this.audio.duration || 0;
  }

  // 10-Band Equalizer controls
  setEQBand(index, gainDb) {
    if (index < 0 || index >= this.frequencies.length) return;
    this.eqGains[index] = gainDb;
    if (this.eqFilters[index] && this.ctx) {
      this.eqFilters[index].gain.setValueAtTime(gainDb, this.ctx.currentTime);
    }
  }

  setPreAmp(gainDb) {
    this.preAmpGain = gainDb;
    if (this.preAmpNode && this.ctx) {
      // dB to linear gain: 10 ^ (dB / 20)
      const linear = Math.pow(10, gainDb / 20);
      this.preAmpNode.gain.setValueAtTime(linear, this.ctx.currentTime);
    }
  }

  applyEQPreset(presetGains, preAmp = 0) {
    if (Array.isArray(presetGains)) {
      presetGains.forEach((gain, idx) => {
        this.setEQBand(idx, gain);
      });
    }
    this.setPreAmp(preAmp);
  }

  getFrequencyData() {
    if (!this.analyser) {
      return new Uint8Array(64).fill(0);
    }
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }

  getWaveformData() {
    if (!this.analyser) {
      return new Uint8Array(64).fill(128);
    }
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteTimeDomainData(dataArray);
    return dataArray;
  }
}

export const audioEngine = new AudioEngine();
