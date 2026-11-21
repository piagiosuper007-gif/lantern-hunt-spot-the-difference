// audio.js — small WebAudio synth for Lantern Hunt. No audio files:
// every sound is a few oscillators shaped in code, so the game ships
// no assets at all and plays offline.
let context = null;
let muted = false;

function ensureContext() {
  if (!context) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    context = new AC();
  }
  if (context.state === 'suspended') context.resume();
  return context;
}

export function setMuted(value) {
  muted = value;
}

export function isMuted() {
  return muted;
}

function tone(freq, startAt, dur, type, gainValue) {
  const ac = ensureContext();
  if (!ac || muted) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, ac.currentTime + startAt);
  gain.gain.exponentialRampToValueAtTime(gainValue, ac.currentTime + startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + startAt + dur);
  osc.connect(gain).connect(ac.destination);
  osc.start(ac.currentTime + startAt);
  osc.stop(ac.currentTime + startAt + dur + 0.05);
}

export function playFind() {
  tone(660, 0, 0.16, 'sine', 0.16);
  tone(880, 0.07, 0.2, 'sine', 0.16);
  tone(1320, 0.14, 0.28, 'sine', 0.1);
}

export function playMiss() {
  tone(180, 0, 0.18, 'sawtooth', 0.08);
  tone(140, 0.05, 0.2, 'sawtooth', 0.06);
}

export function playHint() {
  tone(520, 0, 0.12, 'triangle', 0.12);
  tone(780, 0.09, 0.18, 'triangle', 0.1);
}

export function playLevelWin() {
  [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.3, 'triangle', 0.14));
}

export function playGameWin() {
  [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.12, 0.32, 'triangle', 0.13));
}

export function playTick() {
  tone(980, 0, 0.06, 'square', 0.04);
}
