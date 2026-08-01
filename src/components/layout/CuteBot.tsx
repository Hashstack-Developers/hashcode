"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { registerGsap } from "@/lib/gsap";

type Mood = "peek" | "look" | "laugh" | "wave" | "think" | "fly" | "hide";
type Side = "left" | "right";
type ShowMode = "face" | "full";

const THOUGHTS = [
  "Ship it?",
  "More gold…",
  "404: sleep",
  "Beep boop",
  "Need coffee",
  "Stack > sleep",
  "Hmm… bugs?",
  "You're cool",
  "Scroll more!",
  "Don't refresh",
  "I see you 👀",
  "Pixel perfect?",
  "Deploy vibes",
  "Almost Friday",
  "Nice cursor!",
];

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function pickThought() {
  return THOUGHTS[Math.floor(Math.random() * THOUGHTS.length)]!;
}

/**
 * Cute 3D-feel companion — face peek OR full body, follows cursor,
 * laughs, waves, flies. Starts after loader.
 */
export function CuteBot() {
  const wrap = useRef<HTMLDivElement>(null);
  const thoughtRef = useRef<HTMLDivElement>(null);
  const armRRef = useRef<HTMLDivElement>(null);
  const pupilL = useRef<HTMLSpanElement>(null);
  const pupilR = useRef<HTMLSpanElement>(null);
  const pointer = useRef({ x: 0.5, y: 0.5 });
  const [visible, setVisible] = useState(false);
  const [mood, setMood] = useState<Mood>("peek");
  const [mode, setMode] = useState<ShowMode>("face");
  const [side, setSide] = useState<Side>("left");
  const [thought, setThought] = useState("");
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    const enable = () => {
      window.setTimeout(() => setVisible(true), 900);
    };
    window.addEventListener("hashstack:loader-done", enable);
    const t = window.setTimeout(enable, 12000);
    return () => {
      window.removeEventListener("hashstack:loader-done", enable);
      window.clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = e.clientX / window.innerWidth;
      pointer.current.y = e.clientY / window.innerHeight;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    if (!visible) return;
    let raf = 0;
    const tick = () => {
      const el = wrap.current;
      if (el && pupilL.current && pupilR.current) {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height * 0.28;
        const px = pointer.current.x * window.innerWidth;
        const py = pointer.current.y * window.innerHeight;
        const dx = Math.max(-1, Math.min(1, (px - cx) / 130));
        const dy = Math.max(-1, Math.min(1, (py - cy) / 100));
        const t = `translate(${dx * 4}px, ${dy * 3.2}px)`;
        pupilL.current.style.transform = t;
        pupilR.current.style.transform = t;
        // subtle head tilt toward pointer
        el.style.setProperty("--look-rot", `${dx * 6}deg`);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible]);

  useEffect(() => {
    if (!visible || !wrap.current) return;
    registerGsap();
    const el = wrap.current;
    let cancelled = false;

    const setSidePos = (s: Side, yPct: number) => {
      gsap.set(el, {
        left: s === "left" ? -8 : window.innerWidth - 108,
        top: `${yPct}%`,
        scaleX: s === "left" ? 1 : -1,
      });
    };

    const peekIn = (s: Side, show: ShowMode) => {
      // Face-only: less of the body comes out
      const endX = show === "face" ? (s === "left" ? -28 : 28) : s === "left" ? 14 : -14;
      return gsap.fromTo(
        el,
        {
          x: s === "left" ? -130 : 130,
          autoAlpha: 1,
          rotation: s === "left" ? -12 : 12,
          scale: 0.92,
        },
        {
          x: endX,
          rotation: 0,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.8)",
        },
      );
    };

    const peekOut = (s: Side) =>
      gsap.to(el, {
        x: s === "left" ? -140 : 140,
        duration: 0.5,
        ease: "power2.in",
      });

    const flyAcross = (from: Side) => {
      const to: Side = from === "left" ? "right" : "left";
      const y1 = 20 + Math.random() * 42;
      const y2 = 18 + Math.random() * 45;
      setSidePos(from, y1);
      gsap.set(el, {
        x: from === "left" ? -90 : 90,
        autoAlpha: 1,
        scaleX: from === "left" ? 1 : -1,
        scale: 1,
      });
      return gsap
        .timeline()
        .to(el, {
          left: to === "left" ? -8 : window.innerWidth - 108,
          top: `${y2}%`,
          x: to === "left" ? 12 : -12,
          scaleX: to === "left" ? 1 : -1,
          duration: 1.5,
          ease: "power2.inOut",
        })
        .to(el, { y: -20, duration: 0.28, yoyo: true, repeat: 4, ease: "sine.inOut" }, 0)
        .to(el, { rotation: 12, duration: 0.2, yoyo: true, repeat: 5, ease: "sine.inOut" }, 0.1);
    };

    const showThought = async (ms: number) => {
      setMood("think");
      setThought(pickThought());
      setShowBubble(true);
      // Wait for React to mount .cute-thought before GSAP runs
      await wait(40);
      await new Promise<void>((r) => requestAnimationFrame(() => r()));
      const bubble = thoughtRef.current;
      if (bubble && !cancelled) {
        gsap.fromTo(
          bubble,
          { autoAlpha: 0, scale: 0.6, y: 8 },
          { autoAlpha: 1, scale: 1, y: 0, duration: 0.35, ease: "back.out(1.8)" },
        );
      }
      gsap.to(el, { y: -5, duration: 0.4, yoyo: true, repeat: 4, ease: "sine.inOut" });
      await wait(ms);
      if (bubble && !cancelled) {
        await gsap.to(bubble, { autoAlpha: 0, scale: 0.8, duration: 0.25 });
      }
      setShowBubble(false);
    };

    const loop = async () => {
      while (!cancelled) {
        const s: Side = Math.random() > 0.4 ? "left" : "right";
        const show: ShowMode = Math.random() > 0.45 ? "face" : "full";
        setSide(s);
        setMode(show);
        setMood("peek");
        setSidePos(s, 14 + Math.random() * 55);
        await peekIn(s, show);
        if (cancelled) break;

        await wait(500 + Math.random() * 500);
        if (cancelled) break;

        if (show === "face" && Math.random() > 0.5) {
          setMode("full");
          gsap.to(el, {
            x: s === "left" ? 14 : -14,
            duration: 0.45,
            ease: "back.out(1.5)",
          });
          await wait(400);
        }
        if (cancelled) break;

        setMood("look");
        gsap.to(el, { y: -8, duration: 0.3, yoyo: true, repeat: 3, ease: "sine.inOut" });
        await wait(900);
        if (cancelled) break;

        const roll = Math.random();
        if (roll > 0.62) {
          await showThought(2200);
        } else if (roll > 0.38) {
          setMood("laugh");
          gsap.to(el, {
            keyframes: [
              { rotation: -16, y: -4, duration: 0.07 },
              { rotation: 14, y: 2, duration: 0.07 },
              { rotation: -12, y: -4, duration: 0.07 },
              { rotation: 0, y: 0, duration: 0.1 },
            ],
            repeat: 3,
          });
          await wait(1000);
        } else if (roll > 0.15) {
          setMood("wave");
          setMode("full");
          await wait(50);
          const arm = armRRef.current;
          if (arm) {
            gsap.to(arm, {
              rotation: 35,
              transformOrigin: "20% 50%",
              duration: 0.18,
              yoyo: true,
              repeat: 5,
              ease: "sine.inOut",
            });
          }
          await wait(1100);
        }
        if (cancelled) break;

        setShowBubble(false);
        setMood("hide");
        await peekOut(s);
        await wait(300 + Math.random() * 450);
        if (cancelled) break;

        if (Math.random() > 0.35) {
          setMood("fly");
          setMode("full");
          const from = s;
          const to: Side = from === "left" ? "right" : "left";
          setSide(to);
          await flyAcross(from);
          if (cancelled) break;
          if (Math.random() > 0.4) {
            await showThought(1600);
          } else {
            setMood("look");
            await wait(900);
          }
          setMood("hide");
          await peekOut(to);
          await wait(600 + Math.random() * 1000);
        } else {
          await wait(400 + Math.random() * 1100);
        }
      }
    };

    loop();

    return () => {
      cancelled = true;
      gsap.killTweensOf(el);
      if (armRRef.current) gsap.killTweensOf(armRRef.current);
      if (thoughtRef.current) gsap.killTweensOf(thoughtRef.current);
    };
  }, [visible]);

  if (!visible) return null;

  const laughing = mood === "laugh";
  const waving = mood === "wave";
  const thinking = mood === "think";
  const flying = mood === "fly";
  const faceOnly = mode === "face";

  return (
    <div
      ref={wrap}
      className="pointer-events-none fixed z-[60] will-change-transform"
      style={{
        left: 0,
        top: "30%",
        opacity: 0,
        perspective: "600px",
        width: faceOnly ? 92 : 108,
        height: faceOnly ? 86 : 128,
      }}
      aria-hidden
    >
      {/* Thinking / speech cloud — inner counter-flip keeps text readable */}
      {showBubble && (
        <div
          ref={thoughtRef}
          className="cute-thought absolute -top-2 left-1/2 z-30 w-max max-w-[120px] -translate-x-1/2 -translate-y-full"
          style={{ opacity: 0 }}
        >
          <div style={{ transform: side === "right" ? "scaleX(-1)" : undefined }}>
            <div
              className="relative rounded-2xl border border-[#ca8a04]/40 px-2.5 py-1.5 text-center"
              style={{
                background: "linear-gradient(160deg, #faf8f0 0%, #e8e4d8 100%)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.35), 0 0 16px rgba(202,138,4,0.2)",
              }}
            >
              <p className="font-[family-name:var(--font-display)] text-[10px] font-bold leading-tight tracking-wide text-[#1a1a1a]">
                {thought}
              </p>
              <span className="absolute -bottom-1.5 left-4 h-2 w-2 rounded-full border border-[#ca8a04]/30 bg-[#faf8f0]" />
              <span className="absolute -bottom-3.5 left-2.5 h-1.5 w-1.5 rounded-full border border-[#ca8a04]/25 bg-[#faf8f0]/90" />
            </div>
            {thinking && (
              <div className="mt-1 flex justify-center gap-0.5">
                <span className="h-1 w-1 animate-bounce rounded-full bg-[#ca8a04]" style={{ animationDelay: "0ms" }} />
                <span className="h-1 w-1 animate-bounce rounded-full bg-[#ca8a04]" style={{ animationDelay: "120ms" }} />
                <span className="h-1 w-1 animate-bounce rounded-full bg-[#ca8a04]" style={{ animationDelay: "240ms" }} />
              </div>
            )}
          </div>
        </div>
      )}

      <div
        className="cute-bot-3d relative h-full w-full"
        style={{
          transform: "rotateY(var(--look-rot, 0deg))",
          transformStyle: "preserve-3d",
        }}
      >
        {/* soft ground shadow */}
        {!faceOnly && (
          <div
            className="absolute bottom-0 left-1/2 h-3 w-14 -translate-x-1/2 rounded-full bg-black/40 blur-md"
            style={{ transform: "translateZ(-8px)" }}
          />
        )}

        {/* antenna */}
        <div className="absolute left-1/2 top-0 z-20 flex -translate-x-1/2 flex-col items-center">
          <span
            className={`rounded-full bg-gradient-to-br from-[#f5d76e] to-[#ca8a04] shadow-[0_0_12px_#ca8a04] ${
              flying ? "h-3 w-3 animate-pulse" : "h-2.5 w-2.5"
            }`}
          />
          <span className="h-3 w-[2px] bg-gradient-to-b from-[#ca8a04] to-transparent" />
        </div>

        {/* HEAD — 3D layered */}
        <div
          className="absolute left-1/2 top-3 z-10 -translate-x-1/2"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            className="relative h-[58px] w-[68px] rounded-[20px] border border-[#faf8f0]/30"
            style={{
              background:
                "linear-gradient(145deg, #4a4a4a 0%, #1a1a1a 45%, #0d0d0d 100%)",
              boxShadow:
                "inset 0 2px 6px rgba(255,255,255,0.18), inset 0 -8px 16px rgba(0,0,0,0.55), 0 10px 28px rgba(0,0,0,0.55), 0 0 24px rgba(202,138,4,0.2)",
              transform: "translateZ(12px)",
            }}
          >
            {/* face plate gloss */}
            <div className="pointer-events-none absolute inset-x-2 top-1 h-4 rounded-full bg-gradient-to-b from-white/20 to-transparent" />

            {/* cheeks */}
            <span className="absolute bottom-3 left-1.5 h-3 w-3 rounded-full bg-[#ca8a04]/40 blur-[1px]" />
            <span className="absolute bottom-3 right-1.5 h-3 w-3 rounded-full bg-[#ca8a04]/40 blur-[1px]" />

            {/* eyes */}
            <div className="absolute left-2.5 top-3.5 flex gap-2">
              <div
                className="relative flex h-5 w-5 items-center justify-center overflow-hidden rounded-xl border border-[#ca8a04]/50"
                style={{
                  background: "radial-gradient(circle at 30% 30%, #222, #050505)",
                  boxShadow: "inset 0 0 8px rgba(0,0,0,0.8), 0 0 8px rgba(202,138,4,0.25)",
                }}
              >
                <span
                  ref={pupilL}
                  className="absolute h-2.5 w-2.5 rounded-full bg-gradient-to-br from-[#f5d76e] to-[#ca8a04] shadow-[0_0_6px_#ca8a04] will-change-transform"
                >
                  <span className="absolute left-0.5 top-0.5 h-1 w-1 rounded-full bg-white/90" />
                </span>
              </div>
              <div
                className="relative flex h-5 w-5 items-center justify-center overflow-hidden rounded-xl border border-[#ca8a04]/50"
                style={{
                  background: "radial-gradient(circle at 30% 30%, #222, #050505)",
                  boxShadow: "inset 0 0 8px rgba(0,0,0,0.8), 0 0 8px rgba(202,138,4,0.25)",
                }}
              >
                <span
                  ref={pupilR}
                  className="absolute h-2.5 w-2.5 rounded-full bg-gradient-to-br from-[#f5d76e] to-[#ca8a04] shadow-[0_0_6px_#ca8a04] will-change-transform"
                >
                  <span className="absolute left-0.5 top-0.5 h-1 w-1 rounded-full bg-white/90" />
                </span>
              </div>
            </div>

            {/* mouth */}
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2">
              {laughing ? (
                <div className="h-3 w-5 rounded-b-full border-2 border-t-0 border-[#faf8f0]/90 bg-[#0a0a0a]/40" />
              ) : thinking ? (
                <div className="h-1.5 w-3 translate-x-1 rounded-full bg-[#faf8f0]/75" />
              ) : mood === "look" ? (
                <div className="h-1.5 w-4 rounded-full border border-[#faf8f0]/70 border-t-0" />
              ) : (
                <div className="h-1 w-3 rounded-full bg-[#faf8f0]/85" />
              )}
            </div>

            {laughing && (
              <>
                <span className="absolute -left-1 top-2 h-1.5 w-1.5 rounded-full bg-[#ca8a04]" />
                <span className="absolute -right-0.5 top-0 h-1 w-1 rounded-full bg-[#f5d76e]" />
              </>
            )}
          </div>
        </div>

        {/* BODY — hidden in face-only peek */}
        <div
          className="absolute left-1/2 top-[58px] -translate-x-1/2 transition-all duration-300"
          style={{
            opacity: faceOnly ? 0 : 1,
            transform: faceOnly ? "translateX(-50%) translateY(12px) scale(0.7)" : "translateX(-50%)",
            pointerEvents: "none",
          }}
        >
          {/* arms */}
          <div
            className="cute-arm-l absolute -left-5 top-2 h-2.5 w-5 rounded-full border border-[#faf8f0]/25"
            style={{
              background: "linear-gradient(90deg, #333, #151515)",
              boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
            }}
          />
          <div
            ref={armRRef}
            className={`cute-arm-r absolute -right-5 top-2 h-2.5 w-5 rounded-full border border-[#faf8f0]/25 ${
              waving ? "origin-left" : ""
            }`}
            style={{
              background: "linear-gradient(90deg, #151515, #333)",
              boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
            }}
          />

          <div
            className="relative h-10 w-11 rounded-2xl border border-[#faf8f0]/25"
            style={{
              background: "linear-gradient(160deg, #3a3a3a 0%, #141414 55%, #0a0a0a 100%)",
              boxShadow:
                "inset 0 2px 4px rgba(255,255,255,0.12), inset 0 -6px 12px rgba(0,0,0,0.5), 0 8px 20px rgba(0,0,0,0.45)",
            }}
          >
            <div
              className="absolute left-1/2 top-2 flex h-4 w-7 -translate-x-1/2 items-center justify-center gap-1.5 rounded-md border border-[#ca8a04]/40"
              style={{ background: "linear-gradient(180deg, #111, #050505)" }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#ca8a04] shadow-[0_0_6px_#ca8a04]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#ca8a04]/70" />
            </div>
          </div>

          {/* feet */}
          <div className="mt-0.5 flex justify-center gap-2">
            <span
              className="h-2 w-4 rounded-full border border-[#ca8a04]/40"
              style={{ background: "linear-gradient(180deg, #222, #080808)" }}
            />
            <span
              className="h-2 w-4 rounded-full border border-[#ca8a04]/40"
              style={{ background: "linear-gradient(180deg, #222, #080808)" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
