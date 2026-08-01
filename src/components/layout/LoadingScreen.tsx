"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { registerGsap } from "@/lib/gsap";

type LoadingScreenProps = {
  onComplete?: () => void;
};

function unlockPage() {
  document.documentElement.classList.remove("overflow-hidden", "loader-locked");
  document.body.style.overflow = "";
  document.body.style.touchAction = "";
  window.dispatchEvent(new Event("hashstack:loader-done"));
}

function forceRemoveLoaderDom() {
  // Do not .remove() React-owned nodes — causes removeChild NotFoundError.
  // Hide only; LoadingScreen unmounts via setDone(true).
  document.querySelectorAll<HTMLElement>('[data-hashstack-loader="1"]').forEach((node) => {
    node.style.display = "none";
    node.style.pointerEvents = "none";
    node.setAttribute("aria-hidden", "true");
  });
}

function isMobileDevice() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 768px), (pointer: coarse)").matches;
}

/**
 * Desktop: walk → slam → split.
 * Mobile / LAN phones: skip gold cinema entirely — it was sticking as a blank yellow screen
 * when GSAP/WebView hiccuped. Unlock immediately + hard failsafe.
 */
export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const root = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const finished = useRef(false);
  const slamStarted = useRef(false);
  const [done, setDone] = useState(false);
  /** Avoid SSR painting gold halves (blank yellow if JS is slow/broken on phones). */
  const [client, setClient] = useState(false);
  const [phase, setPhase] = useState<"walk" | "slam" | "open">("walk");
  const [showEnter, setShowEnter] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    unlockPage();
    forceRemoveLoaderDom();
    setDone(true);
    onComplete?.();
  }, [onComplete]);

  const complete = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    setPhase("open");

    tlRef.current?.kill();
    tlRef.current = null;

    const el = root.current;
    if (el) {
      try {
        gsap.killTweensOf(el.querySelectorAll("*"));
      } catch {
        /* ignore */
      }
      const left = el.querySelector<HTMLElement>(".loader-half-left");
      const right = el.querySelector<HTMLElement>(".loader-half-right");
      const ui = el.querySelector<HTMLElement>(".loader-ui");
      const crack = el.querySelector<HTMLElement>(".loader-crack");

      if (ui) {
        ui.style.opacity = "0";
        ui.style.pointerEvents = "none";
      }
      if (crack) crack.style.opacity = "0";

      if (left) {
        gsap.set(left, { clearProps: "transform,x,xPercent" });
        left.style.transition = "transform 0.75s cubic-bezier(0.76,0,0.24,1)";
        void left.offsetWidth;
        left.style.transform = "translate3d(-110%,0,0)";
      }
      if (right) {
        gsap.set(right, { clearProps: "transform,x,xPercent" });
        right.style.transition = "transform 0.75s cubic-bezier(0.76,0,0.24,1)";
        void right.offsetWidth;
        right.style.transform = "translate3d(110%,0,0)";
      }
    }

    window.setTimeout(() => {
      unlockPage();
      forceRemoveLoaderDom();
      setDone(true);
      onComplete?.();
    }, 750);
  }, [onComplete]);

  // Client gate + mobile fast-path (no yellow overlay)
  useEffect(() => {
    const mobile = isMobileDevice();
    setIsMobile(mobile);
    setClient(true);

    if (mobile) {
      // Never lock scroll / paint gold on phones — was the blank yellow stuck state
      finish();
      return;
    }

    document.documentElement.classList.add("overflow-hidden", "loader-locked");
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    const enterTimer = window.setTimeout(() => setShowEnter(true), 1800);
    const soft = window.setTimeout(() => complete(), 9000);
    const hard = window.setTimeout(() => finish(), 12000);

    return () => {
      window.clearTimeout(enterTimer);
      window.clearTimeout(soft);
      window.clearTimeout(hard);
    };
  }, [complete, finish]);

  // Desktop walk → slam
  useEffect(() => {
    if (!client || isMobile || done || finished.current) return;
    const walkDone = window.setTimeout(() => setPhase("slam"), 2200);
    return () => window.clearTimeout(walkDone);
  }, [client, isMobile, done]);

  useEffect(() => {
    if (!client || isMobile || done || finished.current || phase !== "slam") return;
    if (slamStarted.current) return;
    slamStarted.current = true;

    registerGsap();
    const el = root.current;
    if (!el) {
      complete();
      return;
    }

    const left = el.querySelector<HTMLElement>(".loader-half-left");
    const right = el.querySelector<HTMLElement>(".loader-half-right");
    const stage = el.querySelector<HTMLElement>(".loader-stage-inner");
    const robot = el.querySelector<HTMLElement>(".loader-robot-wrap");
    const robotBody = el.querySelector<HTMLElement>(".robot-body");
    const arm = el.querySelector<HTMLElement>(".robot-arm");
    const crack = el.querySelector<HTMLElement>(".loader-crack");
    const brand = el.querySelector<HTMLElement>(".loader-brand-row");

    if (!left || !right || !robot) {
      const retry = window.setTimeout(() => {
        if (!finished.current) finish();
      }, 300);
      return () => window.clearTimeout(retry);
    }

    robot.classList.remove("loader-robot-walking");
    robot.classList.add("loader-robot-center");

    const slamWatchdog = window.setTimeout(() => {
      if (!finished.current) finish();
    }, 4500);

    try {
      gsap.set(robot, { clearProps: "transform", x: 0, y: 0, scale: 1, autoAlpha: 1 });
      if (robotBody) gsap.set(robotBody, { transformOrigin: "50% 85%" });
      if (arm) gsap.set(arm, { rotation: -20, transformOrigin: "20% 30%" });
      if (crack) gsap.set(crack, { scaleY: 0, autoAlpha: 0, transformOrigin: "50% 50%" });
      if (brand) gsap.set(brand, { autoAlpha: 0 });
      gsap.set([left, right], { x: 0, xPercent: 0 });

      const tl = gsap.timeline({
        onComplete: () => {
          window.clearTimeout(slamWatchdog);
          complete();
        },
      });
      tlRef.current = tl;

      tl.to(robotBody || robot, { scaleY: 0.82, scaleX: 1.08, y: 12, duration: 0.35, ease: "power2.in" });
      if (arm) tl.to(arm, { rotation: -115, duration: 0.4, ease: "power2.in" }, "<");
      tl.to(robotBody || robot, { scaleY: 1.05, scaleX: 0.95, y: -28, duration: 0.22, ease: "power2.out" });
      if (arm) tl.to(arm, { rotation: 62, duration: 0.14, ease: "power4.in" }, "-=0.06");
      tl.to(robotBody || robot, { scaleY: 0.88, scaleX: 1.06, y: 8, duration: 0.12, ease: "power3.in" }, "<");
      if (crack) tl.to(crack, { scaleY: 1, autoAlpha: 1, duration: 0.38, ease: "power2.out" }, "-=0.02");
      tl.to(robotBody || robot, { scaleY: 1, scaleX: 1, y: 0, duration: 0.28, ease: "power2.out" });
      if (stage) {
        tl.to(stage, {
          keyframes: [
            { x: -16, duration: 0.04 },
            { x: 16, duration: 0.04 },
            { x: -12, duration: 0.04 },
            { x: 10, duration: 0.04 },
            { x: -5, duration: 0.04 },
            { x: 0, duration: 0.06 },
          ],
        });
      }
      if (brand) tl.to(brand, { autoAlpha: 1, duration: 0.3 });
      tl.fromTo(".loader-left-word", { x: -28, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.4 }, "<")
        .fromTo(".loader-right-word", { x: 28, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.4 }, "<")
        .to(robot, { autoAlpha: 0, scale: 0.88, duration: 0.35 })
        .to({}, { duration: 0.2 });

      return () => {
        window.clearTimeout(slamWatchdog);
        tl.kill();
        if (tlRef.current === tl) tlRef.current = null;
      };
    } catch {
      window.clearTimeout(slamWatchdog);
      finish();
      return;
    }
  }, [phase, complete, finish, done, client, isMobile]);

  // SSR + mobile: never paint gold. Desktop: only after client mount.
  if (done || !client || isMobile) return null;

  return (
    <div
      ref={root}
      data-hashstack-loader="1"
      className="fixed inset-0 z-[100] overflow-hidden"
      aria-label="Loading Hashstack Developers"
      onClick={() => {
        if (showEnter) complete();
      }}
    >
      <style>{`
        @keyframes hashstack-walk-in {
          0% { transform: translate3d(-70vw, 0, 0); }
          12% { transform: translate3d(-55vw, -10px, 0); }
          24% { transform: translate3d(-40vw, 0, 0); }
          36% { transform: translate3d(-28vw, -10px, 0); }
          48% { transform: translate3d(-16vw, 0, 0); }
          60% { transform: translate3d(-8vw, -10px, 0); }
          72% { transform: translate3d(-3vw, 0, 0); }
          85% { transform: translate3d(-1vw, -6px, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        @keyframes hashstack-leg-l {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(28deg); }
          75% { transform: rotate(-28deg); }
        }
        @keyframes hashstack-leg-r {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-28deg); }
          75% { transform: rotate(28deg); }
        }
        .loader-robot-walking {
          animation: hashstack-walk-in 2.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .loader-robot-walking .robot-leg-l {
          transform-box: fill-box;
          transform-origin: 50% 0%;
          animation: hashstack-leg-l 0.28s ease-in-out infinite;
        }
        .loader-robot-walking .robot-leg-r {
          transform-box: fill-box;
          transform-origin: 50% 0%;
          animation: hashstack-leg-r 0.28s ease-in-out infinite;
        }
        .loader-robot-center {
          transform: translate3d(0, 0, 0);
        }
      `}</style>

      <div className="loader-stage-inner absolute inset-0 will-change-transform">
        <div className="absolute inset-0 z-10 flex">
          <div className="loader-half-left h-full w-1/2 bg-[#ca8a04] will-change-transform" />
          <div className="loader-half-right h-full w-1/2 bg-[#ca8a04] will-change-transform" />
        </div>

        <div className="loader-crack pointer-events-none absolute left-1/2 top-0 z-20 h-full w-[3px] -translate-x-1/2 origin-center scale-y-0 bg-[#faf8f0] opacity-0 shadow-[0_0_28px_#faf8f0]" />

        <div className="loader-ui pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center gap-6">
          <div
            className={`loader-robot-wrap relative h-40 w-40 will-change-transform md:h-56 md:w-56 ${
              phase === "walk" ? "loader-robot-walking" : "loader-robot-center"
            }`}
          >
            <div className="robot-body h-full w-full will-change-transform">
              <svg viewBox="0 0 200 230" className="h-full w-full drop-shadow-2xl" aria-hidden>
                <defs>
                  <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5a5a5a" />
                    <stop offset="100%" stopColor="#1a1a1a" />
                  </linearGradient>
                  <linearGradient id="hammerGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#f5d76e" />
                    <stop offset="100%" stopColor="#ca8a04" />
                  </linearGradient>
                </defs>
                <ellipse cx="100" cy="218" rx="52" ry="8" fill="#000" opacity="0.35" />
                <g className="robot-leg-l">
                  <rect x="72" y="155" width="20" height="44" rx="7" fill="url(#bodyGrad)" stroke="#faf8f0" strokeWidth="2.5" />
                  <rect x="64" y="194" width="34" height="14" rx="5" fill="#111" stroke="#ca8a04" strokeWidth="2" />
                </g>
                <g className="robot-leg-r">
                  <rect x="108" y="155" width="20" height="44" rx="7" fill="url(#bodyGrad)" stroke="#faf8f0" strokeWidth="2.5" />
                  <rect x="102" y="194" width="34" height="14" rx="5" fill="#111" stroke="#ca8a04" strokeWidth="2" />
                </g>
                <rect x="58" y="82" width="84" height="78" rx="16" fill="url(#bodyGrad)" stroke="#faf8f0" strokeWidth="3" />
                <rect x="74" y="98" width="52" height="32" rx="8" fill="#0a0a0a" stroke="#ca8a04" strokeWidth="2.5" />
                <circle cx="88" cy="114" r="5" fill="#ca8a04" />
                <circle cx="112" cy="114" r="5" fill="#ca8a04" />
                <rect x="82" y="140" width="36" height="10" rx="4" fill="#faf8f0" />
                <rect x="32" y="92" width="26" height="16" rx="7" fill="url(#bodyGrad)" stroke="#faf8f0" strokeWidth="2.5" />
                <rect x="28" y="106" width="16" height="42" rx="7" fill="url(#bodyGrad)" stroke="#faf8f0" strokeWidth="2.5" />
                <rect x="70" y="34" width="60" height="50" rx="14" fill="url(#bodyGrad)" stroke="#faf8f0" strokeWidth="3" />
                <rect x="80" y="50" width="16" height="14" rx="4" fill="#ca8a04" />
                <rect x="104" y="50" width="16" height="14" rx="4" fill="#ca8a04" />
                <rect x="88" y="70" width="24" height="6" rx="3" fill="#faf8f0" opacity="0.85" />
                <circle cx="100" cy="26" r="8" fill="#111" stroke="#faf8f0" strokeWidth="2.5" />
                <line x1="100" y1="18" x2="100" y2="8" stroke="#ca8a04" strokeWidth="3.5" strokeLinecap="round" />
                <circle cx="100" cy="6" r="4.5" fill="#ca8a04" />
                <g className="robot-arm">
                  <rect x="140" y="90" width="26" height="16" rx="7" fill="url(#bodyGrad)" stroke="#faf8f0" strokeWidth="2.5" />
                  <rect x="154" y="104" width="16" height="46" rx="7" fill="url(#bodyGrad)" stroke="#faf8f0" strokeWidth="2.5" />
                  <rect x="150" y="146" width="24" height="9" rx="2" fill="#333" stroke="#faf8f0" strokeWidth="1.5" />
                  <rect x="140" y="136" width="44" height="24" rx="5" fill="url(#hammerGrad)" stroke="#faf8f0" strokeWidth="2" />
                </g>
              </svg>
            </div>
          </div>

          <div className="loader-brand-row flex items-center gap-3 opacity-0 sm:gap-6">
            <span className="loader-left-word font-[family-name:var(--font-display)] text-2xl font-extrabold text-[#faf8f0] sm:text-4xl md:text-5xl">
              Hashstack
            </span>
            <span className="h-12 w-[2px] bg-[#faf8f0]/80 sm:h-16" />
            <span className="loader-right-word font-[family-name:var(--font-display)] text-2xl font-extrabold text-[#111] sm:text-4xl md:text-5xl">
              Developers
            </span>
          </div>
        </div>

        {showEnter && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              complete();
            }}
            className="absolute bottom-10 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#faf8f0] px-10 py-3.5 text-sm font-extrabold uppercase tracking-[0.22em] text-black shadow-xl active:scale-95"
          >
            Enter site
          </button>
        )}
      </div>
    </div>
  );
}
