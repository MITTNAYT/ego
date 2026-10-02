import fs from 'fs';
import path from 'path';

function createWavBuffer(sampleRate, durationSec, channelDataFn) {
  const numChannels = 2;
  const bytesPerSample = 2;
  const numSamples = Math.floor(sampleRate * durationSec);
  const dataSize = numSamples * numChannels * bytesPerSample;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * numChannels * bytesPerSample, 28);
  buffer.writeUInt16LE(numChannels * bytesPerSample, 32);
  buffer.writeUInt16LE(16, 34);

  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const [left, right] = channelDataFn(t, i, numSamples);
    const clLeft = Math.max(-1, Math.min(1, left));
    const clRight = Math.max(-1, Math.min(1, right));

    const sLeft = clLeft < 0 ? clLeft * 0x8000 : clLeft * 0x7fff;
    const sRight = clRight < 0 ? clRight * 0x8000 : clRight * 0x7fff;

    buffer.writeInt16LE(Math.floor(sLeft), offset);
    buffer.writeInt16LE(Math.floor(sRight), offset + 2);
    offset += 4;
  }

  return buffer;
}

const SAMPLE_RATE = 44100;
const DURATION = 48; // 48 seconds

// 1. Tokyo Lofi City Pop
const tokyoBuffer = createWavBuffer(SAMPLE_RATE, DURATION, (t) => {
  const bpm = 82;
  const beat = (t * bpm / 60);
  const bar = beat / 4;
  
  // Vinyl crackle
  const vinyl = (Math.random() - 0.5) * 0.03 * (Math.random() > 0.96 ? 2.5 : 0.4);
  
  // Lofi Drums
  const kickTime = beat % 2;
  const kick = Math.exp(-kickTime * 14) * Math.sin(2 * Math.PI * (55 - kickTime * 30) * kickTime) * 0.4;
  
  const snareTime = (beat + 1) % 2;
  const snareNoise = (Math.random() - 0.5) * Math.exp(-snareTime * 12) * 0.22;
  const snareTone = Math.sin(2 * Math.PI * 180 * snareTime) * Math.exp(-snareTime * 20) * 0.15;
  const snare = snareNoise + snareTone;
  
  const hihatTime = (beat * 2) % 1;
  const hihat = (Math.random() - 0.5) * Math.exp(-hihatTime * 28) * 0.08;

  // Chord progression: Fmaj7 -> Em7 -> Dm7 -> Cmaj7
  const chords = [
    [174.61, 220.00, 261.63, 329.63], // Fmaj7
    [164.81, 196.00, 246.94, 293.66], // Em7
    [146.83, 174.61, 220.00, 261.63], // Dm7
    [130.81, 164.81, 196.00, 246.94]  // Cmaj7
  ];
  const chordIndex = Math.floor(bar % 4);
  const currentChord = chords[chordIndex];
  
  let rhodes = 0;
  currentChord.forEach((freq, idx) => {
    const tremolo = 1 + 0.15 * Math.sin(2 * Math.PI * 4 * t);
    const chime = Math.sin(2 * Math.PI * freq * t) * 0.5 + Math.sin(2 * Math.PI * freq * 2 * t) * 0.15;
    rhodes += chime * tremolo * 0.08;
  });

  // Bassline
  const bassFreq = currentChord[0] / 2;
  const bass = Math.sin(2 * Math.PI * bassFreq * t) * 0.25;

  const left = kick + snare * 0.9 + hihat * 0.7 + rhodes * 1.05 + bass + vinyl;
  const right = kick + snare * 0.9 + hihat * 0.85 + rhodes * 0.95 + bass + vinyl;
  return [left * 0.7, right * 0.7];
});

// 2. Synthetic Void - Cyberpunk Darksynth
const synthBuffer = createWavBuffer(SAMPLE_RATE, DURATION, (t) => {
  const bpm = 124;
  const beat = (t * bpm / 60);
  
  // 4-on-the-floor kick
  const kickTime = beat % 1;
  const kick = Math.exp(-kickTime * 18) * Math.sin(2 * Math.PI * (120 - kickTime * 85) * kickTime) * 0.6;
  
  // Snare on beats 2 & 4
  const snareTime = (beat + 1) % 2;
  const snare = ((Math.random() - 0.5) * Math.exp(-snareTime * 10) * 0.3) + (Math.sin(2 * Math.PI * 220 * snareTime) * Math.exp(-snareTime * 16) * 0.2);
  
  // Driving 16th-note bass arpeggio
  const step = Math.floor(beat * 4) % 16;
  const arpNotes = [43.65, 43.65, 87.31, 43.65, 51.91, 43.65, 87.31, 58.27, 43.65, 43.65, 87.31, 43.65, 65.41, 58.27, 51.91, 49.00];
  const arpFreq = arpNotes[step];
  const stepTime = (beat * 4) % 1;
  const saw = (2 * ((arpFreq * t) % 1) - 1) * Math.exp(-stepTime * 5) * 0.25;

  // Lead synth pad
  const padFreq = 174.61 * (1 + 0.005 * Math.sin(2 * Math.PI * 5 * t));
  const pad = (Math.sin(2 * Math.PI * padFreq * t) + Math.sin(2 * Math.PI * padFreq * 1.5 * t) * 0.4) * 0.12;

  const left = kick + snare * 0.8 + saw * 1.1 + pad * 0.9;
  const right = kick + snare * 0.8 + saw * 0.9 + pad * 1.1;
  return [left * 0.7, right * 0.7];
});

fs.writeFileSync('public/audio/tokyo.wav', tokyoBuffer);
fs.writeFileSync('public/audio/synthetic_void.wav', synthBuffer);
console.log('Generated tokyo.wav and synthetic_void.wav!');
