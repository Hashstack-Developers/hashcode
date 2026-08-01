"use client";

import { useRef } from "react";
import { gsap, useGSAP, registerGsap } from "@/lib/gsap";

const GOLD = "#ca8a04";
const CREAM = "#faf8f0";

const REVEALS = [
  {
    id: "brief",
    title: "Brief → blueprint",
    body: "We catch the signal in the dark — goals, constraints, the one metric that matters.",
  },
  {
    id: "craft",
    title: "Craft under glass",
    body: "Pixels, motion, and code lit by the same lamp — one studio, one standard.",
  },
  {
    id: "ship",
    title: "Ship in the beam",
    body: "Releases that feel inevitable. Observability on. Drama optional.",
  },
  {
    id: "care",
    title: "Stay illuminated",
    body: "After launch the light stays on — care, iteration, the next chapter.",
  },
];

/**
 * Tight stage: laptop (faces right) → visible gold beam → cards.
 * Beam lives OUTSIDE overflow:hidden so it never gets clipped.
 */
export function LaptopGlowStage() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerGsap();
      if (!root.current) return;

      gsap.set(".glow-intro", { y: 20, autoAlpha: 0 });
      gsap.set(".glow-stage", { autoAlpha: 0.5, y: 24 });
      gsap.set(".glow-screen-wash", { opacity: 0 });
      gsap.set(".glow-beam", { autoAlpha: 0, scaleX: 0.12, transformOrigin: "left center" });
      gsap.set(".glow-mote", { autoAlpha: 0 });
      gsap.set(".glow-card", {
        autoAlpha: 0.2,
        x: 28,
        filter: "brightness(0.28) saturate(0.4)",
      });
      gsap.set(".glow-card-rim", { opacity: 0 });
      gsap.set(".glow-card-face", { opacity: 0 });
      gsap.set(".glow-hint", { autoAlpha: 1 });
      gsap.set(".glow-outro", { autoAlpha: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: `+=${200 + REVEALS.length * 55}%`,
          scrub: 0.95,
          pin: true,
          anticipatePin: 1,
        },
      });

      tl.to(".glow-intro", { y: 0, autoAlpha: 1, duration: 0.45, ease: "none" }, 0)
        .to(".glow-stage", { y: 0, autoAlpha: 1, duration: 0.7, ease: "none" }, 0.15)
        .to(".glow-screen-wash", { opacity: 1, duration: 0.5, ease: "none" }, 0.45)
        .to(".glow-beam", { autoAlpha: 1, scaleX: 1, duration: 0.8, ease: "none" }, 0.5)
        .to(".glow-mote", { autoAlpha: 0.9, stagger: 0.02, duration: 0.35, ease: "none" }, 0.7)
        .to(".glow-hint", { autoAlpha: 0.45, duration: 0.25, ease: "none" }, 0.3);

      let t = 1.15;

      REVEALS.forEach((_, i) => {
        const card = `.glow-card-${i}`;
        tl.to(".glow-hint", { autoAlpha: 0, duration: 0.15, ease: "none" }, t)
          .to(".glow-beam", { autoAlpha: 1, scaleY: 1.08, duration: 0.35, ease: "none" }, t)
          .to(".glow-screen-wash", { opacity: 1.2, duration: 0.3, ease: "none" }, t)
          .to(
            card,
            {
              autoAlpha: 1,
              x: 0,
              filter: "brightness(1.08) saturate(1)",
              duration: 0.5,
              ease: "none",
            },
            t + 0.1,
          )
          .to(`${card} .glow-card-rim`, { opacity: 1, duration: 0.35, ease: "none" }, t + 0.12)
          .to(`${card} .glow-card-face`, { opacity: 1, duration: 0.4, ease: "none" }, t + 0.15)
          .to(".glow-beam", { scaleY: 1, autoAlpha: 0.95, duration: 0.3, ease: "none" }, t + 0.5)
          .to(".glow-screen-wash", { opacity: 1, duration: 0.25, ease: "none" }, t + 0.5);

        t += 1.0;
      });

      tl.to(".glow-outro", { autoAlpha: 1, duration: 0.4, ease: "none" }, t)
        .to(".glow-beam", { autoAlpha: 0.85, duration: 0.4, ease: "none" }, t);
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative min-h-[100svh] overflow-hidden bg-[#060504]"
      aria-label="Studio lamp — laptop beam lights the cards"
    >
      <div className="relative flex h-[100svh] flex-col px-4 py-12 md:px-8 md:py-14">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 55% at 40% 60%, rgba(202,138,4,0.1) 0%, transparent 60%)",
          }}
        />

        <div className="glow-intro relative z-30 mx-auto w-full max-w-2xl text-center">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.4em] text-[#ca8a04]">
            Studio lamp
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-extrabold text-[#faf8f0] md:text-5xl">
            The screen lights the room.
          </h2>
          <p className="mt-3 text-sm text-[#faf8f0]/50 md:text-base">
            Light leaves the glass and wakes every card in its path.
          </p>
        </div>

        <p className="glow-hint relative z-30 mt-2 text-center text-[10px] font-bold uppercase tracking-[0.35em] text-[#ca8a04]/65">
          Scroll · beam finds the cards
        </p>

        {/* Centered tight stage — laptop | beam | cards */}
        <div className="glow-stage relative z-10 mx-auto mt-6 flex min-h-0 w-full max-w-5xl flex-1 items-center justify-center gap-0 md:mt-8">
          {/* Laptop */}
          <div className="relative z-20 w-[min(300px,38vw)] shrink-0 md:w-[320px]">
            <div
              className="relative overflow-hidden rounded-t-[12px] border border-[#2a2a2a] bg-[#0a0a0a]"
              style={{
                width: "92%",
                marginLeft: "4%",
                aspectRatio: "16 / 10.4",
                boxShadow:
                  "inset 0 0 0 2px #141414, 0 0 50px rgba(202,138,4,0.28), 0 28px 60px rgba(0,0,0,0.5)",
                transform: "perspective(900px) rotateY(32deg)",
                transformOrigin: "right center",
              }}
            >
              <div className="absolute left-1/2 top-2 z-20 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#333]" />
              <div className="absolute inset-[2.8%] overflow-hidden rounded-[5px] bg-[#0c0c0c]">
                <div className="relative flex h-full flex-col">
                  <div className="flex h-5 items-center gap-1 border-b border-white/5 bg-[#141414] px-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#ca8a04]/90" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#f5d76e]/55" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#faf8f0]/35" />
                    <span className="ml-2 font-mono text-[7px] text-white/30">hashstack — lamp</span>
                  </div>
                  <div className="relative flex flex-1 flex-col items-center justify-center gap-1.5 p-3">
                    <p className="font-[family-name:var(--font-display)] text-lg font-extrabold text-[#faf8f0] md:text-2xl">
                      Hashstack<span className="text-[#ca8a04]">.</span>
                    </p>
                    <p className="text-[7px] font-bold uppercase tracking-[0.28em] text-[#ca8a04]/70">
                      Live craft
                    </p>
                    <div
                      className="glow-screen-wash pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "radial-gradient(ellipse 90% 80% at 70% 45%, rgba(255,230,140,0.7) 0%, rgba(202,138,4,0.32) 45%, transparent 75%)",
                        mixBlendMode: "screen",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="relative ml-[4%] h-1.5 w-[92%] bg-gradient-to-b from-[#1f1f1f] to-[#0a0a0a]" />
            <div
              className="relative overflow-hidden rounded-b-[10px] border border-t-0 border-[#222] bg-gradient-to-b from-[#1a1a1a] to-[#0c0c0c]"
              style={{
                width: "100%",
                aspectRatio: "16 / 1.05",
                boxShadow: "0 32px 50px rgba(0,0,0,0.45)",
                transform: "perspective(900px) rotateY(32deg)",
                transformOrigin: "right center",
              }}
            >
              <div className="absolute left-1/2 top-[18%] h-[55%] w-[28%] -translate-x-1/2 rounded-md border border-white/5 bg-[#141414]/80" />
            </div>
          </div>

          {/* Beam — sibling between laptop & cards (NOT clipped) */}
          <div className="relative z-10 -ml-3 h-[42%] w-[min(220px,22vw)] shrink-0 md:-ml-4 md:h-[48%] md:w-[240px]">
            <div
              className="glow-beam absolute inset-0"
              style={{
                background: `
                  linear-gradient(
                    90deg,
                    rgba(255,235,160,0.85) 0%,
                    rgba(245,215,110,0.45) 18%,
                    rgba(202,138,4,0.28) 45%,
                    rgba(202,138,4,0.14) 72%,
                    rgba(202,138,4,0.06) 100%
                  )
                `,
                clipPath: "polygon(0% 32%, 0% 68%, 100% 95%, 100% 5%)",
              }}
            />
            <div
              className="glow-beam absolute inset-y-[6%] left-0 w-full"
              style={{
                background:
                  "linear-gradient(90deg, rgba(255,240,180,0.5) 0%, rgba(202,138,4,0.15) 50%, transparent 100%)",
                clipPath: "polygon(0% 35%, 0% 65%, 100% 88%, 100% 12%)",
                filter: "blur(8px)",
              }}
            />
            {Array.from({ length: 12 }).map((_, i) => (
              <span
                key={i}
                className="glow-mote absolute rounded-full bg-[#f5d76e]"
                style={{
                  left: `${6 + (i % 6) * 14}%`,
                  top: `${30 + ((i * 13) % 40)}%`,
                  width: i % 3 === 0 ? 3 : 2,
                  height: i % 3 === 0 ? 3 : 2,
                  boxShadow: `0 0 10px ${GOLD}`,
                }}
              />
            ))}
          </div>

          {/* Cards */}
          <div className="relative z-20 flex w-[min(300px,40vw)] shrink-0 flex-col justify-center gap-2.5 md:w-[320px] md:gap-3">
            {REVEALS.map((card, i) => (
              <article
                key={card.id}
                className={`glow-card glow-card-${i} relative overflow-hidden rounded-2xl border border-[#ca8a04]/25 bg-[#0e0c0a]/92 p-3.5 md:p-4`}
                style={{ boxShadow: "0 14px 36px rgba(0,0,0,0.45)" }}
              >
                <div
                  className="glow-card-face pointer-events-none absolute inset-0 opacity-0"
                  style={{
                    background:
                      "linear-gradient(95deg, rgba(255,230,150,0.3) 0%, rgba(202,138,4,0.1) 42%, transparent 78%)",
                  }}
                />
                <div
                  className="glow-card-rim pointer-events-none absolute inset-0 rounded-2xl opacity-0"
                  style={{
                    boxShadow: `inset 0 0 0 1px ${GOLD}aa, 0 0 24px ${GOLD}55, -14px 0 30px rgba(202,138,4,0.28)`,
                  }}
                />
                <p className="relative font-mono text-[10px] text-[#ca8a04]">0{i + 1}</p>
                <h3
                  className="relative mt-1 font-[family-name:var(--font-display)] text-sm font-bold md:text-base"
                  style={{ color: CREAM }}
                >
                  {card.title}
                </h3>
                <p className="relative mt-1 text-[10px] leading-relaxed text-[#faf8f0]/55 md:text-xs">
                  {card.body}
                </p>
              </article>
            ))}
          </div>
        </div>

        <p className="glow-outro relative z-30 mt-3 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-[#ca8a04]/55">
          Beam locked · keep scrolling
        </p>
      </div>
    </section>
  );
}
