/**
 * Ego Music Player — Offline Storage Service
 * High-performance IndexedDB binary blob store for offline audio playback.
 */

const DB_NAME = 'ego_music_db';
const DB_VERSION = 2;

let dbPromise = null;

function openDb() {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      return reject(new Error('IndexedDB is not supported in this environment'));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Track blobs & metadata
      if (!db.objectStoreNames.contains('cached_tracks')) {
        const trackStore = db.createObjectStore('cached_tracks', { keyPath: 'id' });
        trackStore.createIndex('artist', 'artist', { unique: false });
        trackStore.createIndex('cachedAt', 'cachedAt', { unique: false });
      }

      // Offline playlists
      if (!db.objectStoreNames.contains('playlists')) {
        db.createObjectStore('playlists', { keyPath: 'id' });
      }

      // Listening history
      if (!db.objectStoreNames.contains('history')) {
        const historyStore = db.createObjectStore('history', { keyPath: 'id', autoIncrement: true });
        historyStore.createIndex('trackId', 'trackId', { unique: false });
        historyStore.createIndex('timestamp', 'timestamp', { unique: false });
      }

      // Key-value settings
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings');
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  return dbPromise;
}

/**
 * Cache track audio blob and metadata locally for 100% offline playback.
 */
export async function saveTrackForOffline(track, onProgress = null) {
  try {
    const db = await openDb();
    
    // Check if audio is already local or remote URL
    let blob;
    if (track.file) {
      blob = track.file;
    } else if (track.src) {
      const response = await fetch(track.src);
      if (!response.ok) throw new Error(`HTTP ${response.status} fetching track audio`);
      
      const contentLength = response.headers.get('content-length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      
      if (response.body && total > 0 && onProgress) {
        const reader = response.body.getReader();
        let received = 0;
        const chunks = [];
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          received += value.length;
          onProgress(Math.round((received / total) * 100));
        }
        blob = new Blob(chunks, { type: 'audio/mpeg' });
      } else {
        blob = await response.blob();
      }
    } else {
      throw new Error('Track has no audio source URL or File handle');
    }

    const record = {
      id: track.id,
      title: track.title,
      artist: track.artist,
      album: track.album || 'Unknown Album',
      duration: track.duration,
      durationStr: track.durationStr || '3:30',
      cover: track.cover,
      genre: track.genre || 'Electronic',
      lyrics: track.lyrics || [],
      blob: blob,
      sizeBytes: blob.size,
      cachedAt: Date.now()
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['cached_tracks'], 'readwrite');
      const store = transaction.objectStore('cached_tracks');
      const req = store.put(record);

      req.onsuccess = () => resolve(record);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error(`[OfflineStorage] Failed to cache track ${track.id}:`, err);
    throw err;
  }
}

/**
 * Remove a cached track from offline store.
 */
export async function removeTrackOffline(trackId) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['cached_tracks'], 'readwrite');
    const store = transaction.objectStore('cached_tracks');
    const req = store.delete(trackId);

    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Check if a track is cached offline.
 */
export async function isTrackOffline(trackId) {
  try {
    const db = await openDb();
    return new Promise((resolve) => {
      const transaction = db.transaction(['cached_tracks'], 'readonly');
      const store = transaction.objectStore('cached_tracks');
      const req = store.get(trackId);

      req.onsuccess = () => resolve(Boolean(req.result));
      req.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
}

/**
 * Retrieve cached audio blob Object URL for a track.
 */
export async function getCachedTrackAudioUrl(trackId) {
  try {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['cached_tracks'], 'readonly');
      const store = transaction.objectStore('cached_tracks');
      const req = store.get(trackId);

      req.onsuccess = () => {
        if (req.result && req.result.blob) {
          const objectUrl = URL.createObjectURL(req.result.blob);
          resolve(objectUrl);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

/**
 * Get all tracks currently cached offline.
 */
export async function getAllOfflineTracks() {
  try {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['cached_tracks'], 'readonly');
      const store = transaction.objectStore('cached_tracks');
      const req = store.getAll();

      req.onsuccess = () => {
        const items = req.result.map(item => ({
          ...item,
          isOffline: true
        }));
        resolve(items);
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('[OfflineStorage] Error reading offline tracks:', err);
    return [];
  }
}

/**
 * Get storage usage and quota estimate formatted for display.
 */
export async function getStorageUsageEstimate() {
  if (navigator.storage && navigator.storage.estimate) {
    const { usage, quota } = await navigator.storage.estimate();
    const usageMb = (usage / (1024 * 1024)).toFixed(1);
    const quotaMb = (quota / (1024 * 1024)).toFixed(0);
    const percent = quota ? Math.min(100, Math.round((usage / quota) * 100)) : 0;
    return { usage, quota, usageMb, quotaMb, percent };
  }
  return { usage: 0, quota: 0, usageMb: '0', quotaMb: '0', percent: 0 };
}

/**
 * Clear all offline cached tracks.
 */
export async function clearAllOfflineTracks() {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['cached_tracks'], 'readwrite');
    const store = transaction.objectStore('cached_tracks');
    const req = store.clear();

    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}
