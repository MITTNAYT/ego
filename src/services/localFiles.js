export async function parseAudioFile(file) {
  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");

    // Default metadata fallback
    const fallbackTrack = {
      id: 'local-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      title: fileNameWithoutExt,
      artist: 'Local Artist',
      album: 'Local Files',
      duration: 48,
      audioUrl: objectUrl,
      cover: '/covers/tokyo.jpg', // clean fallback cover
      source: 'local',
      quality: `${(file.size / (1024 * 1024)).toFixed(1)} MB • Native File`,
      accentColor: '#e5a00d',
      bpm: 120,
      genre: 'Local Audio',
      year: new Date().getFullYear(),
      isLocal: true,
      fileRef: file,
      lyrics: [
        { time: 0.0, text: `♪ Playing local audio: ${fileNameWithoutExt} ♪` }
      ]
    };

    // Calculate actual audio duration using temporary Audio object
    const tempAudio = new Audio();
    tempAudio.src = objectUrl;
    tempAudio.addEventListener('loadedmetadata', () => {
      fallbackTrack.duration = Math.round(tempAudio.duration) || 48;
    });

    const jsmediatags = window.jsmediatags;
    if (!jsmediatags) {
      resolve(fallbackTrack);
      return;
    }

    try {
      jsmediatags.read(file, {
        onSuccess: (tag) => {
          const tags = tag.tags || {};
          if (tags.title) fallbackTrack.title = tags.title;
          if (tags.artist) fallbackTrack.artist = tags.artist;
          if (tags.album) fallbackTrack.album = tags.album;
          if (tags.year) fallbackTrack.year = parseInt(tags.year) || fallbackTrack.year;
          if (tags.genre) fallbackTrack.genre = tags.genre;

          // Parse embedded cover art
          if (tags.picture) {
            const { data, format } = tags.picture;
            let base64String = "";
            for (let i = 0; i < data.length; i++) {
              base64String += String.fromCharCode(data[i]);
            }
            fallbackTrack.cover = `data:${format};base64,${window.btoa(base64String)}`;
          }

          resolve(fallbackTrack);
        },
        onError: (error) => {
          console.warn('Could not read ID3 tags, using filename fallback:', error);
          resolve(fallbackTrack);
        }
      });
    } catch (e) {
      console.warn('jsmediatags read exception:', e);
      resolve(fallbackTrack);
    }
  });
}

export async function processFilesList(files) {
  const audioFiles = Array.from(files).filter(f => {
    return f.type.startsWith('audio/') || /\.(mp3|wav|flac|ogg|m4a|aac)$/i.test(f.name);
  });

  const parsedTracks = [];
  for (const file of audioFiles) {
    try {
      const track = await parseAudioFile(file);
      parsedTracks.push(track);
    } catch (err) {
      console.error('Error processing file:', file.name, err);
    }
  }

  return parsedTracks;
}
