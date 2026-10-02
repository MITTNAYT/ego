/**
 * Ego Music Player — Cross-Platform Sync Bridge
 * Unifies library export/import between Web and Native Android.
 */

import { state } from './state.js';
import { getAllOfflineTracks } from './offlineStorage.js';

const BACKUP_SCHEMA_VERSION = 1;

/**
 * Generate a complete JSON backup object of user library and settings.
 */
export async function generateBackupData() {
  const offlineTracks = await getAllOfflineTracks();

  const backup = {
    schemaVersion: BACKUP_SCHEMA_VERSION,
    appName: 'Ego Music Player',
    client: 'web',
    exportedAt: new Date().toISOString(),
    likedTrackIds: Array.from(state.likedTrackIds || []),
    playlists: state.playlists || [],
    recentlyPlayedIds: state.recentlyPlayed || [],
    equalizer: {
      preset: state.eqPreset || 'Flat',
      bands: state.eqBands || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      preamp: state.eqPreamp || 0
    },
    preferences: {
      volume: state.volume,
      repeatMode: state.repeatMode,
      shuffle: state.shuffle,
      audioQuality: 'FLAC / 320kbps'
    },
    offlineTrackMetadata: offlineTracks.map(t => ({
      id: t.id,
      title: t.title,
      artist: t.artist,
      duration: t.duration,
      sizeBytes: t.sizeBytes,
      cachedAt: t.cachedAt
    }))
  };

  return backup;
}

/**
 * Export and trigger download of ego-backup-YYYY-MM-DD.json.
 */
export async function downloadBackupFile() {
  const data = await generateBackupData();
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const dateStr = new Date().toISOString().split('T')[0];
  const a = document.createElement('a');
  a.href = url;
  a.download = `ego-backup-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Validate and restore library state from JSON backup.
 */
export async function restoreBackupFromJson(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid JSON format');
    }

    if (!data.schemaVersion && !data.likedTrackIds && !data.playlists) {
      throw new Error('File does not match Ego Backup schema');
    }

    let importedLikesCount = 0;
    let importedPlaylistsCount = 0;

    // Restore Liked Tracks
    if (Array.isArray(data.likedTrackIds)) {
      data.likedTrackIds.forEach(id => {
        if (!state.likedTrackIds.has(id)) {
          state.likedTrackIds.add(id);
          importedLikesCount++;
        }
      });
      state.saveLikedTracks();
    }

    // Restore Playlists
    if (Array.isArray(data.playlists)) {
      const existingIds = new Set(state.playlists.map(p => p.id));
      data.playlists.forEach(pl => {
        if (!existingIds.has(pl.id)) {
          state.playlists.push(pl);
          importedPlaylistsCount++;
        }
      });
      state.savePlaylists();
    }

    // Restore EQ settings
    if (data.equalizer) {
      if (Array.isArray(data.equalizer.bands)) {
        state.eqBands = [...data.equalizer.bands];
      }
      if (data.equalizer.preset) {
        state.eqPreset = data.equalizer.preset;
      }
      if (typeof data.equalizer.preamp === 'number') {
        state.eqPreamp = data.equalizer.preamp;
      }
    }

    // Restore Preferences
    if (data.preferences) {
      if (typeof data.preferences.volume === 'number') {
        state.volume = data.preferences.volume;
      }
      if (typeof data.preferences.repeatMode === 'string') {
        state.repeatMode = data.preferences.repeatMode;
      }
      if (typeof data.preferences.shuffle === 'boolean') {
        state.shuffle = data.preferences.shuffle;
      }
    }

    // Emit library update
    state.emit('libraryUpdated');
    state.emit('equalizerChanged');

    return {
      success: true,
      importedLikesCount,
      importedPlaylistsCount,
      client: data.client || 'unknown'
    };
  } catch (err) {
    console.error('[SyncBridge] Restore failed:', err);
    throw err;
  }
}
