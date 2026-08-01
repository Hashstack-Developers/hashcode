"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Camera,
  Download,
  Eraser,
  Hand,
  Loader2,
  Pause,
  Play,
  Sparkles,
  Trash2,
  Volume2,
  VolumeX,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  coverMappedPoint,
  densifyPath,
  dist2,
  normalizedPinch,
  pickPrimaryHandIndex,
  PinchGate,
  strokePath,
  Vec2EuroFilter,
  type Vec2,
} from "@/components/play/handTrack";
import {
  setPlayMuted,
  sfxClear,
  sfxPinchOff,
  sfxPinchOn,
  sfxSave,
  sfxSparkle,
  sfxStart,
  sfxUndo,
  speakCheer,
  speakFun,
  speakWelcome,
} from "@/components/play/playFx";

type Point = Vec2;
type Stroke = { color: string; width: number; points: Point[] };

type Status = "idle" | "loading" | "ready" | "running" | "error";

const COLORS = ["#ca8a04", "#faf8f0", "#f5d76e", "#ef4444", "#38bdf8", "#a78bfa"];

const INDEX_TIP = 8;
const INDEX_DIP = 7;
const HAND_CONNECTIONS: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [0, 5],
  [5, 6],
  [6, 7],
  [7, 8],
  [0, 9],
  [9, 10],
  [10, 11],
  [11, 12],
  [0, 13],
  [13, 14],
  [14, 15],
  [15, 16],
  [0, 17],
  [17, 18],
  [18, 19],
  [19, 20],
  [5, 9],
  [9, 13],
  [13, 17],
];

/**
 * Instagram-style air draw: webcam + MediaPipe hand landmarks.
 * Pinch (thumb + index) to paint with your fingertip.
 */
export function AirDrawStudio() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const drawRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const landmarkerRef = useRef<import("@mediapipe/tasks-vision").HandLandmarker | null>(null);
  const rafRef = useRef(0);
  const lastVideoTimeRef = useRef(-1);
  const strokesRef = useRef<Stroke[]>([]);
  const activeStrokeRef = useRef<Stroke | null>(null);
  const runningRef = useRef(false);
  const tipFilterRef = useRef(new Vec2EuroFilter());
  const pinchGateRef = useRef(new PinchGate(0.3, 0.4, 2, 3));
  const wasPinchingRef = useRef(false);
  const sparklesRef = useRef<{ x: number; y: number; life: number; color: string }[]>([]);
  const lastSparkleSfxRef = useRef(0);
  const strokeCheerRef = useRef(0);

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [color, setColor] = useState(COLORS[0]);
  const [brush, setBrush] = useState(6);
  const [showBones, setShowBones] = useState(true);
  const [soundOn, setSoundOn] = useState(true);
  const [hint, setHint] = useState("Enable camera to begin");
  const [strokeCount, setStrokeCount] = useState(0);
  const hintRef = useRef(hint);

  const pushHint = useCallback((next: string) => {
    if (hintRef.current === next) return;
    hintRef.current = next;
    setHint(next);
  }, []);

  const colorRef = useRef(color);
  const brushRef = useRef(brush);
  const showBonesRef = useRef(showBones);
  colorRef.current = color;
  brushRef.current = brush;
  showBonesRef.current = showBones;

  const paintStrokes = useCallback(() => {
    const canvas = drawRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const all = [...strokesRef.current];
    if (activeStrokeRef.current) all.push(activeStrokeRef.current);

    const paintDot = (p: Point, color: string, width: number) => {
      ctx.save();
      ctx.shadowColor = color;
      ctx.shadowBlur = 28;
      ctx.fillStyle = color;
      ctx.globalCompositeOperation = "lighter";
      ctx.beginPath();
      ctx.arc(p.x, p.y, width * 0.9, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
      ctx.shadowBlur = 8;
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(p.x, p.y, width * 0.28, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    for (const stroke of all) {
      if (stroke.points.length < 2) {
        if (stroke.points.length === 1) paintDot(stroke.points[0], stroke.color, stroke.width);
        continue;
      }

      // Neon stack: outer bloom → mid glow → bright core
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = stroke.color;
      ctx.shadowColor = stroke.color;
      ctx.lineWidth = stroke.width * 3.2;
      ctx.shadowBlur = 36;
      ctx.globalAlpha = 0.35;
      strokePath(ctx, stroke.points);

      ctx.lineWidth = stroke.width * 1.85;
      ctx.shadowBlur = 22;
      ctx.globalAlpha = 0.7;
      strokePath(ctx, stroke.points);

      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.shadowBlur = 14;
      ctx.globalAlpha = 1;
      strokePath(ctx, stroke.points);

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = Math.max(1.2, stroke.width * 0.28);
      ctx.shadowBlur = 6;
      ctx.globalAlpha = 0.85;
      strokePath(ctx, stroke.points);
      ctx.restore();
    }

    // Sparkle particles along the brush
    for (const s of sparklesRef.current) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = Math.max(0, s.life);
      ctx.fillStyle = s.color;
      ctx.shadowColor = s.color;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(s.x, s.y, 2.2 + s.life * 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }, []);

  const resizeCanvases = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    for (const canvas of [drawRef.current, overlayRef.current]) {
      if (!canvas) continue;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    paintStrokes();
  }, [paintStrokes]);

  const stopLoop = useCallback(() => {
    runningRef.current = false;
    cancelAnimationFrame(rafRef.current);
  }, []);

  const endActiveStroke = useCallback(() => {
    if (activeStrokeRef.current) {
      strokesRef.current.push(activeStrokeRef.current);
      activeStrokeRef.current = null;
      const n = strokesRef.current.length;
      setStrokeCount(n);
      paintStrokes();
      sfxPinchOff();
      strokeCheerRef.current += 1;
      if (strokeCheerRef.current % 3 === 0) speakCheer();
    }
    wasPinchingRef.current = false;
    pinchGateRef.current.reset();
  }, [paintStrokes]);

  const clearDraw = useCallback(() => {
    strokesRef.current = [];
    activeStrokeRef.current = null;
    sparklesRef.current = [];
    wasPinchingRef.current = false;
    pinchGateRef.current.reset();
    tipFilterRef.current.reset();
    setStrokeCount(0);
    paintStrokes();
    sfxClear();
    speakFun("Fresh canvas!", true);
    const overlay = overlayRef.current;
    const ctx = overlay?.getContext("2d");
    if (overlay && ctx) ctx.clearRect(0, 0, overlay.width, overlay.height);
  }, [paintStrokes]);

  const downloadArt = useCallback(() => {
    const wrap = wrapRef.current;
    const video = videoRef.current;
    const draw = drawRef.current;
    if (!wrap || !video || !draw) return;

    const out = document.createElement("canvas");
    out.width = wrap.clientWidth * 2;
    out.height = wrap.clientHeight * 2;
    const ctx = out.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#141210";
    ctx.fillRect(0, 0, out.width, out.height);
    ctx.save();
    ctx.translate(out.width, 0);
    ctx.scale(-1, 1);
    try {
      ctx.drawImage(video, 0, 0, out.width, out.height);
    } catch {
      /* video not ready */
    }
    ctx.restore();
    ctx.drawImage(draw, 0, 0, out.width, out.height);

    const a = document.createElement("a");
    a.href = out.toDataURL("image/png");
    a.download = `hashstack-air-draw-${Date.now()}.png`;
    a.click();
    sfxSave();
    speakFun("Masterpiece saved!", true);
  }, []);

  const loop = useCallback(() => {
    const video = videoRef.current;
    const landmarker = landmarkerRef.current;
    const overlay = overlayRef.current;
    const wrap = wrapRef.current;
    if (!runningRef.current || !video || !landmarker || !overlay || !wrap) return;

    if (video.readyState >= 2 && video.currentTime !== lastVideoTimeRef.current) {
      lastVideoTimeRef.current = video.currentTime;
      const now = performance.now();
      const result = landmarker.detectForVideo(video, now);
      const octx = overlay.getContext("2d");
      if (!octx) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      octx.clearRect(0, 0, w, h);

      const hands = result.landmarks ?? [];
      if (!hands.length) {
        tipFilterRef.current.reset();
        if (wasPinchingRef.current) endActiveStroke();
        pushHint("Show your hand to the camera · good light helps");
      } else {
        const primary = pickPrimaryHandIndex(hands, result.handedness);
        const landmarks = hands[primary];
        if (!landmarks) {
          rafRef.current = requestAnimationFrame(loop);
          return;
        }

        // object-cover + mirror mapping — fixes finger / cursor offset
        const pts = landmarks.map((lm) => coverMappedPoint(lm, video, w, h, true));

        // Blend tip + DIP for stabler brush point
        const rawTip = {
          x: pts[INDEX_TIP].x * 0.72 + pts[INDEX_DIP].x * 0.28,
          y: pts[INDEX_TIP].y * 0.72 + pts[INDEX_DIP].y * 0.28,
        };
        const tip = tipFilterRef.current.filter(rawTip, now);

        const pinchNorm = normalizedPinch(landmarks);
        const pinching = pinchGateRef.current.update(pinchNorm);

        if (showBonesRef.current) {
          octx.strokeStyle = "rgba(202,138,4,0.55)";
          octx.lineWidth = 2;
          for (const [a, b] of HAND_CONNECTIONS) {
            octx.beginPath();
            octx.moveTo(pts[a].x, pts[a].y);
            octx.lineTo(pts[b].x, pts[b].y);
            octx.stroke();
          }
          octx.fillStyle = "rgba(250,248,240,0.85)";
          for (const p of pts) {
            octx.beginPath();
            octx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
            octx.fill();
          }
        }

        const ring = pinching ? brushRef.current + 5 : 11;
        octx.beginPath();
        octx.arc(tip.x, tip.y, ring, 0, Math.PI * 2);
        octx.strokeStyle = pinching ? colorRef.current : "rgba(250,248,240,0.75)";
        octx.lineWidth = 2;
        octx.stroke();
        octx.beginPath();
        octx.arc(tip.x, tip.y, 3.2, 0, Math.PI * 2);
        octx.fillStyle = pinching ? colorRef.current : "rgba(250,248,240,0.9)";
        octx.fill();

        if (pinching) {
          pushHint("Drawing… open fingers slightly to lift pen");
          const point = { x: tip.x, y: tip.y };
          if (!wasPinchingRef.current) {
            wasPinchingRef.current = true;
            sfxPinchOn();
            activeStrokeRef.current = {
              color: colorRef.current,
              width: brushRef.current,
              points: [point],
            };
          } else if (activeStrokeRef.current) {
            const last = activeStrokeRef.current.points[activeStrokeRef.current.points.length - 1];
            if (!last) {
              activeStrokeRef.current.points.push(point);
            } else if (dist2(last, point) > 1.5) {
              activeStrokeRef.current.points.push(...densifyPath(last, point, 3.5));
            }
          }

          // Glow sparkles trail the fingertip
          if (Math.random() > 0.35) {
            sparklesRef.current.push({
              x: tip.x + (Math.random() - 0.5) * 14,
              y: tip.y + (Math.random() - 0.5) * 14,
              life: 1,
              color: colorRef.current,
            });
          }
          if (now - lastSparkleSfxRef.current > 140) {
            lastSparkleSfxRef.current = now;
            sfxSparkle();
          }

          paintStrokes();
        } else if (wasPinchingRef.current) {
          endActiveStroke();
          pushHint("Pinch thumb + index firmly to draw");
        } else {
          pushHint("Pinch thumb + index firmly to draw");
        }

        // Age sparkles every frame we have a hand
        sparklesRef.current = sparklesRef.current
          .map((s) => ({ ...s, life: s.life - 0.045, y: s.y - 0.6 }))
          .filter((s) => s.life > 0);
        if (sparklesRef.current.length) paintStrokes();
      }
    }

    rafRef.current = requestAnimationFrame(loop);
  }, [paintStrokes, pushHint, endActiveStroke]);

  const startCamera = useCallback(async () => {
    setError(null);
    setStatus("loading");
    pushHint("Loading hand model…");

    try {
      const { FilesetResolver, HandLandmarker } = await import("@mediapipe/tasks-vision");

      const fileset = await FilesetResolver.forVisionTasks("/mediapipe/wasm");

      const make = (delegate: "GPU" | "CPU") =>
        HandLandmarker.createFromOptions(fileset, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate,
          },
          runningMode: "VIDEO",
          numHands: 2,
          minHandDetectionConfidence: 0.65,
          minHandPresenceConfidence: 0.65,
          minTrackingConfidence: 0.65,
        });

      try {
        landmarkerRef.current = await make("GPU");
      } catch {
        landmarkerRef.current = await make("CPU");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: "user",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30, max: 60 },
        },
      });

      const video = videoRef.current;
      if (!video) throw new Error("Video element missing");

      video.srcObject = stream;
      await video.play();

      tipFilterRef.current.reset();
      pinchGateRef.current.reset();
      wasPinchingRef.current = false;

      resizeCanvases();
      setStatus("running");
      pushHint("Pinch thumb + index firmly to draw");
      runningRef.current = true;
      lastVideoTimeRef.current = -1;
      sfxStart();
      speakWelcome();
      rafRef.current = requestAnimationFrame(loop);
    } catch (e) {
      console.error(e);
      setStatus("error");
      setError(
        e instanceof Error
          ? e.message
          : "Camera / hand model failed. Use HTTPS or localhost and allow camera access.",
      );
      pushHint("Could not start — check camera permission");
    }
  }, [loop, resizeCanvases, pushHint]);

  const togglePause = useCallback(() => {
    if (status === "running") {
      stopLoop();
      setStatus("ready");
      pushHint("Paused");
    } else if (status === "ready" && landmarkerRef.current && videoRef.current?.srcObject) {
      tipFilterRef.current.reset();
      runningRef.current = true;
      setStatus("running");
      pushHint("Pinch thumb + index firmly to draw");
      rafRef.current = requestAnimationFrame(loop);
    }
  }, [status, stopLoop, loop, pushHint]);

  useEffect(() => {
    const onResize = () => resizeCanvases();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      stopLoop();
      const video = videoRef.current;
      const stream = video?.srcObject as MediaStream | null;
      stream?.getTracks().forEach((t) => t.stop());
      landmarkerRef.current?.close();
      landmarkerRef.current = null;
    };
  }, [resizeCanvases, stopLoop]);

  const started = status === "running" || status === "ready";

  return (
    <div className="relative mx-auto w-full max-w-6xl">
      <div
        ref={wrapRef}
        className="relative aspect-[3/4] w-full overflow-hidden rounded-[1.75rem] border border-[#ca8a04]/30 bg-[#0a0908] shadow-[0_30px_80px_rgba(0,0,0,0.55)] sm:aspect-video md:rounded-[2rem]"
      >
        <video
          ref={videoRef}
          playsInline
          muted
          className={cn(
            "absolute inset-0 h-full w-full object-cover scale-x-[-1]",
            started ? "opacity-100" : "opacity-0",
          )}
        />

        {!started && (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(202,138,4,0.18),transparent_55%),linear-gradient(180deg,#1a1612,#0a0908)]" />
        )}

        <canvas ref={drawRef} className="pointer-events-none absolute inset-0 h-full w-full" />
        <canvas ref={overlayRef} className="pointer-events-none absolute inset-0 h-full w-full" />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(10,9,8,0.55)_100%)]" />
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-[#ca8a04]/20" />

        {!started && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#ca8a04]/40 bg-[#ca8a04]/10 text-[#ca8a04]">
              {status === "loading" ? (
                <Loader2 className="h-7 w-7 animate-spin" />
              ) : (
                <Hand className="h-7 w-7" />
              )}
            </div>
            <div>
              <p className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[#faf8f0] md:text-3xl">
                Air Draw
              </p>
              <p className="mt-2 max-w-md text-sm text-[#faf8f0]/55 md:text-base">
                High-accuracy hand tracking — pinch thumb + index to paint in the air. Bright, even light
                works best.
              </p>
            </div>
            {error && <p className="max-w-sm text-sm text-red-400">{error}</p>}
            <button
              type="button"
              disabled={status === "loading"}
              onClick={startCamera}
              className="inline-flex items-center gap-2 rounded-full bg-[#ca8a04] px-6 py-3 text-sm font-semibold text-[#141210] transition hover:bg-[#f5d76e] disabled:opacity-60"
            >
              <Camera className="h-4 w-4" />
              {status === "loading" ? "Starting…" : status === "error" ? "Try again" : "Enable camera"}
            </button>
          </div>
        )}

        {started && (
          <div className="absolute left-4 top-4 z-10 flex max-w-[75%] items-center gap-2 rounded-full border border-[#ca8a04]/30 bg-[#141210]/75 px-3 py-1.5 text-[11px] text-[#faf8f0]/85 backdrop-blur-md md:left-5 md:top-5 md:text-xs">
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#ca8a04]" />
            <span className="truncate">{hint}</span>
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-col gap-4 md:mt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={`Color ${c}`}
                onClick={() => setColor(c)}
                className={cn(
                  "h-8 w-8 rounded-full border-2 transition",
                  color === c ? "scale-110 border-[#faf8f0]" : "border-transparent opacity-80 hover:opacity-100",
                )}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          <label className="flex items-center gap-2 text-xs text-[#faf8f0]/55">
            Brush
            <input
              type="range"
              min={2}
              max={28}
              value={brush}
              onChange={(e) => setBrush(Number(e.target.value))}
              className="w-24 accent-[#ca8a04]"
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={!started}
            onClick={togglePause}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#faf8f0]/15 bg-[#faf8f0]/5 px-3.5 py-2 text-xs text-[#faf8f0]/85 transition hover:border-[#ca8a04]/40 disabled:opacity-40"
          >
            {status === "running" ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {status === "running" ? "Pause" : "Resume"}
          </button>

          <button
            type="button"
            onClick={() => setShowBones((v) => !v)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs transition",
              showBones
                ? "border-[#ca8a04]/45 bg-[#ca8a04]/10 text-[#ca8a04]"
                : "border-[#faf8f0]/15 bg-[#faf8f0]/5 text-[#faf8f0]/85 hover:border-[#ca8a04]/40",
            )}
          >
            <Hand className="h-3.5 w-3.5" />
            Skeleton {showBones ? "on" : "off"}
          </button>

          <button
            type="button"
            onClick={() => {
              const next = !soundOn;
              setSoundOn(next);
              setPlayMuted(!next);
              if (next) speakFun("Sound on!", true);
            }}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs transition",
              soundOn
                ? "border-[#ca8a04]/45 bg-[#ca8a04]/10 text-[#ca8a04]"
                : "border-[#faf8f0]/15 bg-[#faf8f0]/5 text-[#faf8f0]/85 hover:border-[#ca8a04]/40",
            )}
          >
            {soundOn ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            {soundOn ? "Sound on" : "Muted"}
          </button>

          <button
            type="button"
            disabled={!started || strokeCount === 0}
            onClick={() => {
              strokesRef.current.pop();
              setStrokeCount(strokesRef.current.length);
              paintStrokes();
              sfxUndo();
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#faf8f0]/15 bg-[#faf8f0]/5 px-3.5 py-2 text-xs text-[#faf8f0]/85 transition hover:border-[#ca8a04]/40 disabled:opacity-40"
          >
            <Eraser className="h-3.5 w-3.5" />
            Undo
          </button>

          <button
            type="button"
            disabled={!started}
            onClick={clearDraw}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#faf8f0]/15 bg-[#faf8f0]/5 px-3.5 py-2 text-xs text-[#faf8f0]/85 transition hover:border-red-400/40 disabled:opacity-40"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear
          </button>

          <button
            type="button"
            disabled={!started}
            onClick={downloadArt}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#ca8a04] px-3.5 py-2 text-xs font-semibold text-[#141210] transition hover:bg-[#f5d76e] disabled:opacity-40"
          >
            <Download className="h-3.5 w-3.5" />
            Save PNG
          </button>

          <span className="ml-auto text-[11px] text-[#faf8f0]/35">{strokeCount} strokes</span>
        </div>
      </div>
    </div>
  );
}
