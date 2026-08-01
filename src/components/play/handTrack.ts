/** Accurate landmark → canvas mapping for object-fit: cover + mirrored selfie. */
export type Vec2 = { x: number; y: number };

export function coverMappedPoint(
  lm: Vec2,
  video: HTMLVideoElement,
  boxW: number,
  boxH: number,
  mirrorX = true,
): Vec2 {
  const vw = video.videoWidth || 1;
  const vh = video.videoHeight || 1;
  const videoAspect = vw / vh;
  const boxAspect = boxW / boxH;

  let drawW: number;
  let drawH: number;
  let offsetX: number;
  let offsetY: number;

  if (videoAspect > boxAspect) {
    drawH = boxH;
    drawW = boxH * videoAspect;
    offsetX = (boxW - drawW) / 2;
    offsetY = 0;
  } else {
    drawW = boxW;
    drawH = boxW / videoAspect;
    offsetX = 0;
    offsetY = (boxH - drawH) / 2;
  }

  const nx = mirrorX ? 1 - lm.x : lm.x;
  return {
    x: offsetX + nx * drawW,
    y: offsetY + lm.y * drawH,
  };
}

/** One Euro Filter — low lag, kills landmark jitter. */
export class OneEuroFilter {
  private x = 0;
  private dx = 0;
  private initialized = false;

  constructor(
    private minCutoff = 1.2,
    private beta = 0.007,
    private dCutoff = 1.0,
  ) {}

  reset() {
    this.initialized = false;
    this.x = 0;
    this.dx = 0;
  }

  filter(value: number, tSec: number, lastTSec: number) {
    if (!this.initialized) {
      this.initialized = true;
      this.x = value;
      this.dx = 0;
      return value;
    }
    const dt = Math.max(1e-3, tSec - lastTSec);
    const edx = this.expSmooth(this.dx, (value - this.x) / dt, this.alpha(dt, this.dCutoff));
    this.dx = edx;
    const cutoff = this.minCutoff + this.beta * Math.abs(edx);
    this.x = this.expSmooth(this.x, value, this.alpha(dt, cutoff));
    return this.x;
  }

  private alpha(dt: number, cutoff: number) {
    const tau = 1 / (2 * Math.PI * cutoff);
    return 1 / (1 + tau / dt);
  }

  private expSmooth(prev: number, value: number, a: number) {
    return a * value + (1 - a) * prev;
  }
}

export class Vec2EuroFilter {
  private fx = new OneEuroFilter(1.15, 0.008, 1.0);
  private fy = new OneEuroFilter(1.15, 0.008, 1.0);
  private lastT = 0;

  reset() {
    this.fx.reset();
    this.fy.reset();
    this.lastT = 0;
  }

  filter(p: Vec2, tMs: number): Vec2 {
    const t = tMs / 1000;
    if (!this.lastT) this.lastT = t;
    const out = {
      x: this.fx.filter(p.x, t, this.lastT),
      y: this.fy.filter(p.y, t, this.lastT),
    };
    this.lastT = t;
    return out;
  }
}

export function dist2(a: Vec2, b: Vec2) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Pinch distance normalized by palm size — stable near & far from camera. */
export function normalizedPinch(landmarks: Vec2[]) {
  const tip = landmarks[8];
  const thumb = landmarks[4];
  const wrist = landmarks[0];
  const mcp = landmarks[9]; // middle finger MCP ≈ palm scale
  const palm = Math.max(1e-4, dist2(wrist, mcp));
  return dist2(tip, thumb) / palm;
}

/**
 * Hysteresis pinch: tight to start, looser to end — kills flicker.
 * Also requires N consecutive frames before latching on.
 */
export class PinchGate {
  private on = false;
  private onFrames = 0;
  private offFrames = 0;

  constructor(
    private enter = 0.32,
    private exit = 0.42,
    private confirmOn = 2,
    private confirmOff = 3,
  ) {}

  reset() {
    this.on = false;
    this.onFrames = 0;
    this.offFrames = 0;
  }

  update(normPinch: number): boolean {
    if (!this.on) {
      if (normPinch < this.enter) {
        this.onFrames += 1;
        this.offFrames = 0;
        if (this.onFrames >= this.confirmOn) {
          this.on = true;
          this.onFrames = 0;
        }
      } else {
        this.onFrames = 0;
      }
    } else if (normPinch > this.exit) {
      this.offFrames += 1;
      this.onFrames = 0;
      if (this.offFrames >= this.confirmOff) {
        this.on = false;
        this.offFrames = 0;
      }
    } else {
      this.offFrames = 0;
    }
    return this.on;
  }

  get active() {
    return this.on;
  }
}

/** Fill gaps between samples so fast motion doesn't skip. */
export function densifyPath(from: Vec2, to: Vec2, maxStep = 4): Vec2[] {
  const d = dist2(from, to);
  if (d <= maxStep) return [to];
  const n = Math.ceil(d / maxStep);
  const pts: Vec2[] = [];
  for (let i = 1; i <= n; i++) {
    const t = i / n;
    pts.push({
      x: from.x + (to.x - from.x) * t,
      y: from.y + (to.y - from.y) * t,
    });
  }
  return pts;
}

/** Midpoint quadratic stroke — smoother than raw polyline. */
export function strokePath(ctx: CanvasRenderingContext2D, points: Vec2[]) {
  if (points.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  if (points.length === 2) {
    ctx.lineTo(points[1].x, points[1].y);
  } else {
    for (let i = 1; i < points.length - 1; i++) {
      const midX = (points[i].x + points[i + 1].x) / 2;
      const midY = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, midX, midY);
    }
    const last = points[points.length - 1];
    ctx.lineTo(last.x, last.y);
  }
  ctx.stroke();
}

/** Pick the most confident / largest hand for drawing. */
export function pickPrimaryHandIndex(
  landmarks: Vec2[][],
  handedness?: { score?: number }[][],
): number {
  if (!landmarks.length) return -1;
  let best = 0;
  let bestScore = -1;
  for (let i = 0; i < landmarks.length; i++) {
    const conf = handedness?.[i]?.[0]?.score ?? 0.5;
    const palm = dist2(landmarks[i][0], landmarks[i][9]);
    const score = conf * 2 + palm * 8;
    if (score > bestScore) {
      bestScore = score;
      best = i;
    }
  }
  return best;
}
