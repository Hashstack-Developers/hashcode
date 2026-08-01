/** Lightweight Web Audio + speech for Air Draw entertainment. */

let ctx: AudioContext | null = null;
let muted = false;

function ac() {
  if (typeof window === "undefined") return null;
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function setPlayMuted(next: boolean) {
  muted = next;
}

export function isPlayMuted() {
  return muted;
}

function tone(
  freq: number,
  duration: number,
  type: OscillatorType = "sine",
  gain = 0.08,
  when = 0,
) {
  if (muted) return;
  const audio = ac();
  if (!audio) return;
  const t0 = audio.currentTime + when;
  const osc = audio.createOscillator();
  const g = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(g);
  g.connect(audio.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

export function sfxStart() {
  tone(392, 0.12, "triangle", 0.07);
  tone(523, 0.18, "sine", 0.06, 0.08);
  tone(659, 0.22, "sine", 0.05, 0.16);
}

export function sfxPinchOn() {
  tone(880, 0.07, "sine", 0.05);
  tone(1320, 0.1, "triangle", 0.035, 0.04);
}

export function sfxPinchOff() {
  tone(660, 0.08, "sine", 0.04);
  tone(440, 0.12, "triangle", 0.03, 0.05);
}

export function sfxSparkle() {
  tone(1400 + Math.random() * 600, 0.04, "sine", 0.025);
}

export function sfxClear() {
  tone(520, 0.08, "sawtooth", 0.04);
  tone(310, 0.14, "triangle", 0.035, 0.06);
}

export function sfxSave() {
  tone(523, 0.1, "sine", 0.06);
  tone(659, 0.12, "sine", 0.05, 0.08);
  tone(784, 0.18, "triangle", 0.05, 0.16);
}

export function sfxUndo() {
  tone(400, 0.09, "triangle", 0.04);
}

const cheers = [
  "Nice stroke!",
  "Looking good!",
  "Keep painting!",
  "Glow mode activated!",
  "Artist energy!",
  "Beautiful lines!",
];

let lastSpeak = 0;

export function speakFun(text: string, force = false) {
  if (muted || typeof window === "undefined" || !window.speechSynthesis) return;
  const now = Date.now();
  if (!force && now - lastSpeak < 4500) return;
  lastSpeak = now;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 1.05;
  u.pitch = 1.15;
  u.volume = 0.85;
  window.speechSynthesis.speak(u);
}

export function speakCheer() {
  speakFun(cheers[Math.floor(Math.random() * cheers.length)]);
}

export function speakWelcome() {
  speakFun("Camera ready. Pinch to paint!", true);
}
