import { INITIAL_TRACKS, PLAYLISTS, QUEUE_DEFAULT } from '../data/tracks.js';
import { audioEngine } from './audioEngine.js';
import { 
  isTrackOffline, 
  saveTrackForOffline, 
  removeTrackOffline, 
  getCachedTrackAudioUrl, 
  getAllOfflineTracks 
} from './offlineStorage.js';

class StateManager {
  constructor() {
    const savedLikes = localStorage.getItem('ego_liked_tracks');
    this.state = {
      allTracks: [...INITIAL_TRACKS],
      localTracks: [],
      currentTrack: INITIAL_TRACKS[0],
      isPlaying: false,
      currentTime: 72, // 1:12 matching screenshot
      duration: INITIAL_TRACKS[0].duration,
      volume: 0.75,
      isMuted: false,
      isShuffle: false,
      repeatMode: 'all', // 'off' | 'all' | 'one'
      queue: [...QUEUE_DEFAULT],
      history: [],
      likedTrackIds: new Set(savedLikes ? JSON.parse(savedLikes) : ['track-1', 'track-2']),

      // Views & Navigation
      activeView: 'home',
      activeSourceFilter: 'all',
      searchQuery: '',
      selectedPlaylist: null,
      selectedAlbum: null,

      // Spotify-style Library Pane state
      libraryFilter: 'all', // 'all' | 'playlists' | 'artists' | 'albums' | 'local'
      librarySearch: '',

      // Spotify Desktop "Now Playing" Right Drawer
      rightSidebarOpen: true,

      // Modals & Apple-style Overlays
      lyricsOpen: false,
      lyricsFullscreen: false,
      lyricsRomanized: false,
      eqOpen: false,
      queueOpen: false,
      settingsOpen: false,

      // Equalizer state
      eqPreset: 'Flat',
      eqBands: new Array(10).fill(0),
      eqPreAmp: 0,

      // Offline & Download state
      offlineTrackIds: new Set(),

      // Power-user tools
      sleepTimer: { active: false, remainingSeconds: 0, mode: 'time' },
      zenMode: false,

      // Scrobbling status
      scrobbling: {
        lastFm: true,
        listenBrainz: true,
        sessionScrobbles: 14,
        isBroadcasting: false
      },

      // Audio engine options
      settings: {
        gapless: true,
        crossfade: 2,
        normalization: true,
        highResOutput: true,
        theme: 'apple-glass-dark'
      },

      // Dynamic ambient lighting color (Apple Music Liquid Glass Mesh)
      ambientColor: INITIAL_TRACKS[0].accentColor || '#fa2d48',

      // Toasts
      toasts: []
    };

    this.subscribers = new Set();
    this.setupAudioEngineBridge();
    this.initOfflineTracks();
  }

  setupAudioEngineBridge() {
    audioEngine.setVolume(this.state.volume);

    audioEngine.on('timeupdate', ({ currentTime, duration }) => {
      this.state.currentTime = currentTime;
      if (duration && !isNaN(duration)) {
        this.state.duration = duration;
      }
      this.emit('timeupdate', { currentTime, duration: this.state.duration });
    });

    audioEngine.on('play', () => {
      this.state.isPlaying = true;
      this.state.scrobbling.isBroadcasting = true;
      this.emit('playbackChange', true);
      this.emit('change');
    });

    audioEngine.on('pause', () => {
      this.state.isPlaying = false;
      this.state.scrobbling.isBroadcasting = false;
      this.emit('playbackChange', false);
      this.emit('change');
    });

    audioEngine.on('ended', () => {
      this.handleTrackEnded();
    });

    audioEngine.on('error', (err) => {
      this.showToast('Playback error: Audio file could not be loaded', 'error');
      this.state.isPlaying = false;
      this.emit('change');
    });
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  emit(event = 'change', data = null) {
    this.subscribers.forEach(cb => cb(this.state, event, data));
  }

  // Playback Control Actions
  async playTrack(track, newQueue = null) {
    if (!track) return;

    if (this.state.currentTrack && this.state.currentTrack.id !== track.id) {
      this.state.history.unshift(this.state.currentTrack);
    }

    this.state.currentTrack = track;
    this.state.ambientColor = track.accentColor || '#fa2d48';
    this.state.currentTime = 0;
    this.state.duration = track.duration || 48;

    if (newQueue) {
      this.state.queue = newQueue.filter(t => t.id !== track.id);
    }

    try {
      let audioUrlToPlay = track.audioUrl;
      const offlineUrl = await getCachedTrackAudioUrl(track.id);
      if (offlineUrl) {
        audioUrlToPlay = offlineUrl;
      }
      await audioEngine.loadAndPlay(audioUrlToPlay);
      this.state.isPlaying = true;
      this.state.scrobbling.sessionScrobbles += 1;
      this.showToast(`Now playing: ${track.title}${offlineUrl ? ' ⚡ (Offline)' : ''}`, 'info');
    } catch (err) {
      console.warn('Playback start error:', err);
    }

    this.emit('trackChange', track);
    this.emit('change');
  }

  togglePlayPause() {
    if (!this.state.currentTrack) {
      if (this.state.allTracks.length > 0) {
        this.playTrack(this.state.allTracks[0]);
      }
      return;
    }

    if (this.state.isPlaying) {
      audioEngine.pause();
    } else {
      audioEngine.play().catch(() => {
        audioEngine.loadAndPlay(this.state.currentTrack.audioUrl);
      });
    }
  }

  nextTrack() {
    if (this.state.queue.length > 0) {
      let nextTrack;
      if (this.state.isShuffle) {
        const randomIndex = Math.floor(Math.random() * this.state.queue.length);
        nextTrack = this.state.queue.splice(randomIndex, 1)[0];
      } else {
        nextTrack = this.state.queue.shift();
      }
      this.playTrack(nextTrack);
    } else {
      const all = this.getAllAvailableTracks();
      if (all.length > 0) {
        this.playTrack(all[0], all);
      }
    }
  }

  prevTrack() {
    if (this.state.currentTime > 3) {
      audioEngine.seek(0);
      return;
    }

    if (this.state.history.length > 0) {
      const prevTrack = this.state.history.shift();
      if (this.state.currentTrack) {
        this.state.queue.unshift(this.state.currentTrack);
      }
      this.playTrack(prevTrack);
    } else {
      audioEngine.seek(0);
    }
  }

  handleTrackEnded() {
    if (this.state.sleepTimer.active && this.state.sleepTimer.mode === 'end_of_track') {
      this.cancelSleepTimer();
      audioEngine.pause();
      this.state.isPlaying = false;
      this.showToast('Sleep timer reached: Stopped playback at end of track', 'info');
      this.emit('change');
      return;
    }

    if (this.state.repeatMode === 'one') {
      audioEngine.seek(0);
      audioEngine.play();
      return;
    }

    if (this.state.queue.length > 0) {
      this.nextTrack();
    } else if (this.state.repeatMode === 'all') {
      const all = this.getAllAvailableTracks();
      if (all.length > 0) {
        this.playTrack(all[0], all);
      }
    } else {
      this.state.isPlaying = false;
      this.emit('change');
    }
  }

  seek(seconds) {
    audioEngine.seek(seconds);
    this.state.currentTime = seconds;
    this.emit('change');
  }

  setVolume(vol) {
    this.state.volume = vol;
    this.state.isMuted = vol === 0;
    audioEngine.setVolume(vol);
    this.emit('change');
  }

  toggleMute() {
    this.state.isMuted = !this.state.isMuted;
    audioEngine.setMuted(this.state.isMuted);
    this.emit('change');
  }

  toggleShuffle() {
    this.state.isShuffle = !this.state.isShuffle;
    this.showToast(`Shuffle ${this.state.isShuffle ? 'On' : 'Off'}`, 'info');
    this.emit('change');
  }

  toggleRepeat() {
    const modes = ['off', 'all', 'one'];
    const nextIdx = (modes.indexOf(this.state.repeatMode) + 1) % modes.length;
    this.state.repeatMode = modes[nextIdx];
    this.showToast(`Repeat mode: ${this.state.repeatMode.toUpperCase()}`, 'info');
    this.emit('change');
  }

  toggleLike(trackId) {
    if (this.state.likedTrackIds.has(trackId)) {
      this.state.likedTrackIds.delete(trackId);
      this.showToast('Removed from Liked Songs', 'info');
    } else {
      this.state.likedTrackIds.add(trackId);
      this.showToast('Added to Liked Songs', 'success');
    }
    localStorage.setItem('ego_liked_tracks', JSON.stringify([...this.state.likedTrackIds]));
    this.emit('change');
  }

  isLiked(trackId) {
    return this.state.likedTrackIds.has(trackId);
  }

  addToQueue(track, playNext = false) {
    if (playNext) {
      this.state.queue.unshift(track);
      this.showToast(`Playing next: ${track.title}`, 'info');
    } else {
      this.state.queue.push(track);
      this.showToast(`Added to queue: ${track.title}`, 'info');
    }
    this.emit('change');
  }

  removeFromQueue(index) {
    if (index >= 0 && index < this.state.queue.length) {
      this.state.queue.splice(index, 1);
      this.emit('change');
    }
  }

  clearQueue() {
    this.state.queue = [];
    this.showToast('Queue cleared', 'info');
    this.emit('change');
  }

  // Local files integration
  addLocalTracks(tracks) {
    if (!tracks || !tracks.length) return;
    this.state.localTracks.unshift(...tracks);
    this.state.allTracks.unshift(...tracks);
    this.showToast(`Imported ${tracks.length} local track(s)`, 'success');
    this.emit('change');
  }

  // Views & Filters
  setView(view, extra = null) {
    this.state.activeView = view;
    if (view === 'playlist') {
      this.state.selectedPlaylist = extra;
    } else if (view === 'album') {
      this.state.selectedAlbum = extra;
    }
    this.emit('change');
  }

  setSourceFilter(source) {
    this.state.activeSourceFilter = source;
    this.emit('change');
  }

  setSearchQuery(q) {
    this.state.searchQuery = q;
    this.emit('change');
  }

  setLibraryFilter(filter) {
    this.state.libraryFilter = filter;
    this.emit('change');
  }

  setLibrarySearch(q) {
    this.state.librarySearch = q;
    this.emit('change');
  }

  toggleRightSidebar() {
    this.state.rightSidebarOpen = !this.state.rightSidebarOpen;
    this.emit('change');
  }

  // Modals
  toggleLyrics(fullscreen = false) {
    if (fullscreen) {
      this.state.lyricsFullscreen = !this.state.lyricsFullscreen;
    } else {
      this.state.lyricsOpen = !this.state.lyricsOpen;
    }
    this.emit('change');
  }

  toggleLyricsRomanized() {
    this.state.lyricsRomanized = !this.state.lyricsRomanized;
    this.emit('change');
  }

  toggleEqualizer() {
    this.state.eqOpen = !this.state.eqOpen;
    this.emit('change');
  }

  toggleQueue() {
    this.state.queueOpen = !this.state.queueOpen;
    this.emit('change');
  }

  toggleSettings() {
    this.state.settingsOpen = !this.state.settingsOpen;
    this.emit('change');
  }

  // Equalizer adjustments
  setEQBand(bandIdx, gainDb) {
    this.state.eqBands[bandIdx] = gainDb;
    this.state.eqPreset = 'Custom';
    audioEngine.setEQBand(bandIdx, gainDb);
    this.emit('change');
  }

  setEQPreAmp(gainDb) {
    this.state.eqPreAmp = gainDb;
    audioEngine.setPreAmp(gainDb);
    this.emit('change');
  }

  applyEQPreset(presetName) {
    const PRESETS = {
      'Flat': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      'Bass Boost': [6.5, 5.0, 3.5, 1.5, 0, 0, 0, 0.5, 1.5, 2.0],
      'Electronic': [5.0, 4.0, 1.5, 0, -1.0, 1.5, 3.0, 4.5, 5.0, 5.5],
      'Vocal Clarity': [-2.0, -1.0, 0, 2.0, 4.5, 4.0, 3.0, 1.5, 0, -1.0],
      'Acoustic': [3.0, 2.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 3.0, 2.0],
      'Rock': [5.0, 3.5, 2.0, 0, -1.0, 1.0, 3.0, 4.5, 5.0, 5.5],
      'Lo-Fi Warmth': [4.0, 4.5, 2.0, 0, -1.5, -2.0, -2.5, -4.0, -5.5, -7.0]
    };

    if (PRESETS[presetName]) {
      this.state.eqPreset = presetName;
      this.state.eqBands = [...PRESETS[presetName]];
      audioEngine.applyEQPreset(this.state.eqBands, this.state.eqPreAmp);
      this.emit('change');
    }
  }

  showToast(message, type = 'info') {
    const id = Date.now() + Math.random().toString(36).substr(2, 4);
    this.state.toasts.push({ id, message, type });
    this.emit('change');

    setTimeout(() => {
      this.state.toasts = this.state.toasts.filter(t => t.id !== id);
      this.emit('change');
    }, 3000);
  }

  // Offline Storage Bridge
  async initOfflineTracks() {
    try {
      const offlineList = await getAllOfflineTracks();
      this.state.offlineTrackIds = new Set(offlineList.map(t => t.id));
      this.emit('change');
    } catch (e) {
      console.warn('Could not initialize offline tracks:', e);
    }
  }

  async toggleOfflineDownload(track) {
    if (!track) return;
    if (this.state.offlineTrackIds.has(track.id)) {
      try {
        await removeTrackOffline(track.id);
        this.state.offlineTrackIds.delete(track.id);
        this.showToast(`Removed "${track.title}" from offline downloads`, 'info');
      } catch (err) {
        this.showToast(`Error removing offline track: ${err.message}`, 'error');
      }
    } else {
      this.showToast(`Downloading "${track.title}" for offline playback...`, 'info');
      try {
        await saveTrackForOffline(track);
        this.state.offlineTrackIds.add(track.id);
        this.showToast(`Saved "${track.title}" offline ⚡`, 'success');
      } catch (err) {
        this.showToast(`Failed to download: ${err.message}`, 'error');
      }
    }
    this.emit('change');
  }

  // Sleep Timer Controller
  startSleepTimer(minutes, mode = 'time') {
    this.cancelSleepTimer();

    if (mode === 'end_of_track') {
      this.state.sleepTimer = { active: true, mode: 'end_of_track', remainingSeconds: 0 };
      this.showToast('Sleep timer set: Stopping at end of track 🌙', 'info');
      this.emit('change');
      return;
    }

    const totalSeconds = minutes * 60;
    this.state.sleepTimer = {
      active: true,
      mode: 'time',
      remainingSeconds: totalSeconds
    };
    this.showToast(`Sleep timer set: ${minutes} min 🌙`, 'info');
    this.emit('change');

    this._sleepTimerInterval = setInterval(() => {
      if (!this.state.sleepTimer.active) {
        clearInterval(this._sleepTimerInterval);
        return;
      }

      this.state.sleepTimer.remainingSeconds -= 1;

      // Smooth volume fade during last 15 seconds
      if (this.state.sleepTimer.remainingSeconds <= 15 && this.state.sleepTimer.remainingSeconds > 0) {
        const factor = this.state.sleepTimer.remainingSeconds / 15;
        audioEngine.setVolume(this.state.volume * factor);
      }

      if (this.state.sleepTimer.remainingSeconds <= 0) {
        this.cancelSleepTimer();
        audioEngine.pause();
        audioEngine.setVolume(this.state.volume); // restore original volume setting
        this.state.isPlaying = false;
        this.showToast('Sleep timer ended: Music paused 💤', 'info');
        this.emit('change');
      } else {
        this.emit('change');
      }
    }, 1000);
  }

  cancelSleepTimer() {
    if (this._sleepTimerInterval) {
      clearInterval(this._sleepTimerInterval);
      this._sleepTimerInterval = null;
    }
    if (this.state.sleepTimer.active) {
      audioEngine.setVolume(this.state.volume);
    }
    this.state.sleepTimer = { active: false, mode: 'time', remainingSeconds: 0 };
    this.emit('change');
  }

  // Zen Mode (Pure Monochrome Focus Fullscreen)
  toggleZenMode() {
    this.state.zenMode = !this.state.zenMode;
    const appEl = document.querySelector('.gs-window-frame') || document.documentElement;
    if (this.state.zenMode) {
      document.body.classList.add('gs-zen-mode');
      if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
      this.showToast('Zen Focus Mode active. Press Esc to exit.', 'info');
    } else {
      document.body.classList.remove('gs-zen-mode');
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      this.showToast('Exited Zen Mode', 'info');
    }
    this.emit('change');
  }

  getAllAvailableTracks() {
    let tracks = [...this.state.allTracks];
    if (this.state.activeSourceFilter !== 'all') {
      tracks = tracks.filter(t => t.source === this.state.activeSourceFilter);
    }
    return tracks;
  }
}

export const state = new StateManager();
