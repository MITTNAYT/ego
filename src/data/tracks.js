export const STREAMING_SOURCES = [
  { id: 'all', name: 'All Sources', icon: 'layers' },
  { id: 'apple', name: 'Apple Music', icon: 'music' },
  { id: 'spotify', name: 'Spotify', icon: 'radio' },
  { id: 'local', name: 'Local Files', icon: 'hard-drive' },
];

export const ARTISTS = [
  { id: 'art-1', name: 'JVKE', image: '/covers/jvke.jpg', listeners: '14.2M' },
  { id: 'art-2', name: 'The Weeknd', image: '/covers/the_weeknd.jpg', listeners: '108M' },
  { id: 'art-3', name: 'Yeat', image: '/covers/yeat.jpg', listeners: '18.5M' },
  { id: 'art-4', name: 'Travis Scott', image: '/covers/travis_scott.jpg', listeners: '65.8M' },
  { id: 'art-5', name: 'Joji', image: '/covers/joji.jpg', listeners: '28.1M' },
];

export const COLLECTIONS = [
  { id: 'col-1', name: 'Eve', type: 'Artist', image: '/covers/yoasobi.jpg', trackCount: 24 },
  { id: 'col-2', name: 'Yoasobi', type: 'Artist', image: '/covers/yoasobi.jpg', trackCount: 38 },
  { id: 'col-3', name: 'Study lofi', type: 'Playlist', image: '/covers/tokyo.jpg', trackCount: 62 },
  { id: 'col-4', name: 'Coffee Chill', type: 'Playlist', image: '/covers/hero_banner.jpg', trackCount: 45 },
  { id: 'col-5', name: 'Anime lofi', type: 'Playlist', image: '/covers/yoasobi.jpg', trackCount: 50 },
  { id: 'col-6', name: 'Ghibli Vibes', type: 'Playlist', image: '/covers/aura.jpg', trackCount: 33 },
];

export const INITIAL_TRACKS = [
  {
    id: 'track-cry',
    title: 'Cry',
    artist: 'Cigarettes After Sex',
    album: 'Cry',
    duration: 234, // 3:54
    audioUrl: '/audio/resonance.wav',
    cover: '/covers/cry.jpg',
    source: 'apple',
    quality: 'Lossless ALAC 24-Bit / 96kHz',
    year: 2019,
    lyrics: [
      { time: 0.0, text: "♪ [Soft ambient electric guitar & gentle reverb] ♪" },
      { time: 8.5, text: "It's making you cry every time" },
      { time: 16.0, text: "You give your love away..." },
      { time: 24.5, text: "And every time you look into my eyes" },
      { time: 33.0, text: "You wanna tell me everything you've got inside" },
      { time: 42.0, text: "Cry, baby, cry into the night..." }
    ]
  },
  {
    id: 'track-frank',
    title: 'Pink + White',
    artist: 'Frank Ocean',
    album: 'Blonde',
    duration: 184, // 3:04
    audioUrl: '/audio/aura.wav',
    cover: '/covers/blond.jpg',
    source: 'apple',
    quality: 'Lossless ALAC 24-Bit / 96kHz',
    year: 2016,
    lyrics: [
      { time: 0.0, text: "♪ [Acoustic piano chords & gentle shaker groove] ♪" },
      { time: 6.0, text: "That's the way everyday goes" },
      { time: 11.5, text: "Every time there's a tear in the sky" },
      { time: 17.0, text: "If the sky is pink and white" },
      { time: 23.5, text: "If the ground is black and yellow" },
      { time: 30.0, text: "It's the same way you showed me..." }
    ]
  },
  {
    id: 'track-yoasobi',
    title: 'Yoru ni Kakeru',
    artist: 'Yoasobi',
    album: 'The Book',
    duration: 261, // 4:21
    audioUrl: '/audio/tokyo.wav',
    cover: '/covers/yoasobi.jpg',
    source: 'spotify',
    quality: 'Lossless ALAC 24-Bit / 96kHz',
    year: 2020,
    lyrics: [
      { time: 0.0, text: "♪ [Fast rhythmic piano & city pop intro] ♪" },
      { time: 5.5, text: "Shizumu you ni tokete yuku you ni" },
      { time: 11.0, text: "Futari dake no sora ga hirogaru yoru ni", romanized: "In the night where the sky spreads out only for the two of us" },
      { time: 17.5, text: "Sayonara dake datta, sono hitokoto de subete ga wakatta" },
      { time: 25.0, text: "Hi ga shizumi dashita sora to kimi no sugata" },
      { time: 33.0, text: "Fensu goshi ni kasanatte ita..." }
    ]
  },
  {
    id: 'track-syre',
    title: 'Syre',
    artist: 'Jaden',
    album: 'SYRE',
    duration: 234, // 3:54
    audioUrl: '/audio/synthetic_void.wav',
    cover: '/covers/syre.jpg',
    source: 'spotify',
    quality: '320 kbps Ogg Vorbis',
    year: 2017,
    lyrics: [
      { time: 0.0, text: "♪ [Cinematic orchestra & sunset guitar arpeggio] ♪" },
      { time: 7.0, text: "Syre, a beautiful confusion" },
      { time: 14.5, text: "The story of a boy who chased the sunset" },
      { time: 22.0, text: "Until the stars came falling down upon his head" },
      { time: 30.0, text: "Standing on the hills of Calabasas..." }
    ]
  },
  {
    id: 'track-trance',
    title: 'Trance',
    artist: 'Metro Boomin, Travis Scott, Young Thug',
    album: 'Heroes & Villains',
    duration: 194, // 3:14
    audioUrl: '/audio/midnight.wav',
    cover: '/covers/travis_scott.jpg',
    source: 'apple',
    quality: 'Dolby Atmos Spatial Audio',
    year: 2022,
    lyrics: [
      { time: 0.0, text: "♪ [Heavy 808 sub-bass & haunting synthesizer swell] ♪" },
      { time: 6.0, text: "Yeah, she put me in a trance..." },
      { time: 13.0, text: "Out of this world, never coming down" },
      { time: 20.5, text: "Metro Boomin make it boom..." }
    ]
  },
  {
    id: 'track-porter',
    title: 'Look at the Sky',
    artist: 'Porter Robinson',
    album: 'Nurture',
    duration: 309, // 5:09
    audioUrl: '/audio/aura.wav',
    cover: '/covers/card_live.jpg',
    source: 'apple',
    quality: 'Lossless ALAC 24-Bit / 96kHz',
    year: 2021,
    lyrics: [
      { time: 0.0, text: "♪ [Euphoric piano intro & vocal melody] ♪" },
      { time: 8.0, text: "Look at the sky, I'm still here" },
      { time: 14.5, text: "I'll be alive next year" },
      { time: 21.0, text: "Though I can't make something good right now" },
      { time: 28.0, text: "Cause I still haven't found my way..." }
    ]
  },
  {
    id: 'track-sweet',
    title: 'Sweet',
    artist: 'Cigarettes After Sex',
    album: 'Cigarettes After Sex',
    duration: 292,
    audioUrl: '/audio/resonance.wav',
    cover: '/covers/cry.jpg',
    source: 'apple',
    quality: 'Lossless ALAC',
    year: 2017,
    lyrics: [
      { time: 0.0, text: "♪ [Dream pop slow bass & vintage snare] ♪" },
      { time: 10.0, text: "Watching the video that you sent me" },
      { time: 20.0, text: "The sweetest thing that I have ever seen..." }
    ]
  },
  {
    id: 'track-heavenly',
    title: 'Heavenly',
    artist: 'Cigarettes After Sex',
    album: 'Cry',
    duration: 288,
    audioUrl: '/audio/resonance.wav',
    cover: '/covers/cry.jpg',
    source: 'apple',
    quality: 'Lossless ALAC',
    year: 2019,
    lyrics: [
      { time: 0.0, text: "♪ [Nocturnal reverb guitar] ♪" },
      { time: 12.0, text: "Giving you all my love, heavenly..." }
    ]
  },
  {
    id: 'track-apocalypse',
    title: 'Apocalypse',
    artist: 'Cigarettes After Sex',
    album: 'Cigarettes After Sex',
    duration: 290,
    audioUrl: '/audio/resonance.wav',
    cover: '/covers/cry.jpg',
    source: 'apple',
    quality: 'Lossless ALAC',
    year: 2017,
    lyrics: [
      { time: 0.0, text: "♪ [Iconic slow tempo ballad intro] ♪" },
      { time: 14.0, text: "Got the music in you, baby, tell me why..." },
      { time: 24.0, text: "Your lips, my lips, apocalypse..." }
    ]
  }
];

export const QUEUE_DEFAULT = [
  INITIAL_TRACKS.find(t => t.id === 'track-sweet'),
  INITIAL_TRACKS.find(t => t.id === 'track-heavenly'),
  INITIAL_TRACKS.find(t => t.id === 'track-apocalypse'),
].filter(Boolean);

export const PLAYLISTS = [
  {
    id: 'pl-study',
    title: 'Study lofi',
    description: 'Chill beats to study and relax to.',
    cover: '/covers/tokyo.jpg',
    trackCount: 62,
    duration: '2 hr 45 min',
    source: 'apple',
    tracks: ['track-yoasobi', 'track-frank', 'track-porter']
  },
  {
    id: 'pl-coffee',
    title: 'Coffee Chill',
    description: 'Warm acoustic morning vibes.',
    cover: '/covers/hero_banner.jpg',
    trackCount: 45,
    duration: '2 hr 10 min',
    source: 'apple',
    tracks: ['track-cry', 'track-frank', 'track-sweet']
  },
  {
    id: 'pl-anime',
    title: 'Anime lofi',
    description: 'Nostalgic anime melodies reimagined in chill hop.',
    cover: '/covers/yoasobi.jpg',
    trackCount: 50,
    duration: '2 hr 20 min',
    source: 'spotify',
    tracks: ['track-yoasobi', 'track-porter', 'track-syre']
  },
  {
    id: 'pl-ghibli',
    title: 'Ghibli Vibes',
    description: 'Peaceful orchestra and piano music.',
    cover: '/covers/aura.jpg',
    trackCount: 33,
    duration: '1 hr 35 min',
    source: 'apple',
    tracks: ['track-frank', 'track-porter', 'track-cry']
  }
];
