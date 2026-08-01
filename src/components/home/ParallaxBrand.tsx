"use client";

import { useRef } from "react";
import { gsap, useGSAP, registerGsap } from "@/lib/gsap";

/**
 * Name starts FULLY buried behind mountains (CSS opacity 0 + deep y).
 * Scroll → rises out of the ridge with backlight.
 */
export function ParallaxBrand({ trigger }: { trigger: React.RefObject<HTMLElement | null> }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const triggerEl =
        trigger.current ?? document.querySelector<HTMLElement>("#cinematic-film");
      if (!triggerEl || !root.current) return;

      const name = root.current.querySelector<HTMLElement>(".parallax-name");
      const glow = root.current.querySelector<HTMLElement>(".parallax-glow");
      const far = root.current.querySelector<HTMLElement>(".parallax-mount-far");
      const mid = root.current.querySelector<HTMLElement>(".parallax-mount-mid");
      if (!name || !glow) return;

      // Buried deep — invisible until scroll lifts it past the ridge
      gsap.set(name, { y: 240, opacity: 0, scale: 0.86 });
      gsap.set(glow, { opacity: 0, scale: 0.4 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerEl,
          start: "top top",
          end: "+=90%",
          scrub: 1.1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(glow, { opacity: 1, scale: 1.7, y: -80, ease: "none" }, 0).to(
        name,
        {
          y: -520,
          opacity: 0.98,
          scale: 1.06,
          ease: "none",
        },
        0,
      );
      if (far) tl.to(far, { y: 40, ease: "none" }, 0);
      if (mid) tl.to(mid, { y: 70, ease: "none" }, 0);

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: root, dependencies: [trigger], revertOnUpdate: true },
  );

  return (
    <div ref={root} className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <div
        className="parallax-glow absolute left-1/2 top-[42%] h-[50vmin] w-[82vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
        style={{
          background:
            "radial-gradient(circle, rgba(255,230,140,0.75) 0%, rgba(202,138,4,0.42) 38%, transparent 70%)",
          filter: "blur(12px)",
        }}
      />

      {/* Starts low + invisible — rises well above mountain ridge */}
      <div className="parallax-name absolute inset-x-0 top-[80%] z-[1] flex -translate-y-1/2 flex-col items-center gap-1 opacity-0 will-change-transform">
        <p
          className="font-[family-name:var(--font-display)] text-[clamp(2.2rem,8vw,5.75rem)] font-extrabold leading-none tracking-[-0.04em] text-cream"
          style={{
            textShadow:
              "0 0 50px rgba(202,138,4,0.8), 0 0 100px rgba(202,138,4,0.45), 0 4px 30px rgba(0,0,0,0.9)",
          }}
        >
          HASHSTACK
        </p>
        <p
          className="font-[family-name:var(--font-display)] text-[clamp(1rem,3vw,1.9rem)] font-bold tracking-[0.4em] text-gold"
          style={{ textShadow: "0 0 30px rgba(202,138,4,0.85)" }}
        >
          DEVELOPERS
        </p>
      </div>

      <svg
        className="parallax-mount-far absolute bottom-[22%] left-[-6%] z-[2] h-[26vh] w-[112%] text-[#3a3228] opacity-80 md:h-[28vh]"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        style={{ filter: "blur(1px)" }}
      >
        <path
          fill="currentColor"
          d="M0,150 L160,105 L300,130 L460,55 L620,115 L800,35 L980,100 L1160,50 L1320,105 L1440,75 L1440,200 L0,200 Z"
        />
      </svg>

      <svg
        className="parallax-mount-mid absolute bottom-0 left-[-4%] z-[3] h-[48vh] w-[108%] text-[#1c1814] md:h-[52vh]"
        viewBox="0 0 1440 280"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="mountFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a241c" />
            <stop offset="55%" stopColor="#16120f" />
            <stop offset="100%" stopColor="#141210" />
          </linearGradient>
        </defs>
        <path
          fill="url(#mountFill)"
          d="M0,200 L120,155 L260,185 L400,90 L560,165 L720,70 L880,150 L1040,85 L1200,160 L1360,110 L1440,140 L1440,280 L0,280 Z"
        />
        <path
          fill="none"
          stroke="#ca8a04"
          strokeOpacity="0.45"
          strokeWidth="2.5"
          d="M0,200 L120,155 L260,185 L400,90 L560,165 L720,70 L880,150 L1040,85 L1200,160 L1360,110 L1440,140"
        />
      </svg>

      <div className="absolute inset-x-0 bottom-0 z-[4] h-[12%] bg-gradient-to-t from-[#141210] to-transparent" />
    </div>
  );
}
