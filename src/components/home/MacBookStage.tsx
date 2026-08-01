"use client";

import { useRef } from "react";
import { gsap, useGSAP, registerGsap } from "@/lib/gsap";

type Chapter = {
  id: string;
  name: string;
  service: string;
  side: "left" | "right";
  mark: string;
  lines: string[];
};

/** Theme-locked palette — gold / cream / charcoal only */
const GOLD = "#ca8a04";
const CREAM = "#faf8f0";

const CHAPTERS: Chapter[] = [
  {
    id: "ts",
    name: "TypeScript",
    service: "Web Apps",
    side: "left",
    mark: "TS",
    lines: [
      "import { createApp } from 'hashstack';",
      "const app = createApp({ edge: true });",
      "app.route('/', HomePage);",
      "await app.ship();",
    ],
  },
  {
    id: "py",
    name: "Python",
    service: "AI & ML",
    side: "right",
    mark: "Py",
    lines: [
      "from hashstack import Agent",
      "bot = Agent(model='gpt-stack')",
      "reply = bot.run(prompt)",
      "print('✓ intelligence online')",
    ],
  },
  {
    id: "swift",
    name: "Swift",
    service: "Mobile",
    side: "left",
    mark: "Sw",
    lines: [
      "import SwiftUI",
      "struct PulseApp: App {",
      "  var body: some Scene { WindowGroup { Home() } }",
      "}",
    ],
  },
  {
    id: "go",
    name: "Go",
    service: "Cloud",
    side: "right",
    mark: "Go",
    lines: [
      "package main",
      "func Deploy(ctx context.Context) error {",
      "  return edge.Release(ctx, build)",
      "}",
    ],
  },
  {
    id: "csharp",
    name: "C# / Unity",
    service: "Gaming",
    side: "left",
    mark: "C#",
    lines: [
      "public class Arena : MonoBehaviour {",
      "  void Start() => Stack.Boot();",
      "  void Update() => Stack.Tick();",
      "}",
    ],
  },
  {
    id: "rust",
    name: "Rust",
    service: "Systems",
    side: "right",
    mark: "Rs",
    lines: [
      "fn main() {",
      "  let stack = Hashstack::new();",
      "  stack.compile().unwrap();",
      "}",
    ],
  },
];

const FOOTPRINTS = 6;

export function MacBookStage() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerGsap();
      if (!root.current) return;

      gsap.set(".mac-rig", {
        y: 160,
        rotateX: 26,
        rotateY: -16,
        scale: 0.78,
        autoAlpha: 0.4,
      });
      gsap.set(".mac-intro", { y: 28, autoAlpha: 0 });
      gsap.set(".mac-glow", { opacity: 0 });
      gsap.set(".mac-chapter-code", { autoAlpha: 0 });
      gsap.set(".mac-dock-item", { autoAlpha: 0, scale: 0.35, y: 20 });
      gsap.set(".mac-fly", { autoAlpha: 0, scale: 0.25 });
      gsap.set(".mac-lang-tag", { autoAlpha: 0 });
      gsap.set(".mac-print", { autoAlpha: 0, scale: 0, visibility: "hidden" });
      gsap.set(".mac-outro", { autoAlpha: 0, y: 16 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: `+=${280 + CHAPTERS.length * 95}%`,
          scrub: 1.05,
          pin: true,
          anticipatePin: 1,
        },
      });

      tl.to(".mac-glow", { opacity: 1, duration: 0.6, ease: "none" }, 0)
        .to(
          ".mac-rig",
          {
            y: 0,
            rotateX: 6,
            rotateY: -4,
            scale: 1,
            autoAlpha: 1,
            duration: 1,
            ease: "none",
          },
          0,
        )
        .to(".mac-intro", { y: 0, autoAlpha: 1, duration: 0.5, ease: "none" }, 0.2);

      let t = 1.1;

      CHAPTERS.forEach((ch, i) => {
        const code = `.mac-code-${ch.id}`;
        const lines = `.mac-code-${ch.id} .mac-line`;
        const fly = `.mac-fly-${ch.id}`;
        const dock = `.mac-dock-${ch.id}`;
        const tag = `.mac-tag-${ch.id}`;
        const prints = `.mac-print-${ch.id}`;

        tl.to(tag, { autoAlpha: 1, duration: 0.2, ease: "none" }, t)
          .to(code, { autoAlpha: 1, duration: 0.25, ease: "none" }, t)
          .fromTo(
            lines,
            { autoAlpha: 0, x: -10 },
            { autoAlpha: 1, x: 0, stagger: 0.06, duration: 0.28, ease: "none" },
            t + 0.1,
          );

        // Glitter spark then FULLY gone (no fade stagger — avoids scrub leftover)
        tl.fromTo(
          prints,
          { autoAlpha: 0, scale: 0.3, visibility: "visible" },
          {
            autoAlpha: 1,
            scale: 1.15,
            stagger: 0.04,
            duration: 0.18,
            ease: "none",
          },
          t + 0.5,
        )
          .to(
            prints,
            { autoAlpha: 0, scale: 0, duration: 0.28, ease: "none" },
            t + 0.82,
          )
          .set(prints, { autoAlpha: 0, scale: 0, visibility: "hidden" }, t + 1.12);

        tl.set(
          fly,
          {
            autoAlpha: 1,
            scale: 1.05,
            left: "50%",
            top: "48%",
            xPercent: -50,
            yPercent: -50,
            rotation: ch.side === "left" ? -12 : 12,
          },
          t + 0.52,
        )
          .to(
            fly,
            {
              left: ch.side === "left" ? "7%" : "93%",
              top: `${20 + (i % 3) * 20}%`,
              scale: 0.7,
              rotation: 0,
              duration: 0.6,
              ease: "none",
            },
            t + 0.52,
          )
          .to(code, { autoAlpha: 0, duration: 0.28, ease: "none" }, t + 0.72)
          .to(tag, { autoAlpha: 0, duration: 0.2, ease: "none" }, t + 0.72)
          .to(
            dock,
            {
              autoAlpha: 1,
              scale: 1,
              y: 0,
              duration: 0.4,
              ease: "none",
            },
            t + 1.0,
          )
          .to(fly, { autoAlpha: 0, scale: 0.3, duration: 0.22, ease: "none" }, t + 1.05)
          .to(
            ".mac-rig",
            {
              rotateY: ch.side === "left" ? 6 : -6,
              duration: 0.4,
              ease: "none",
            },
            t + 0.5,
          );

        t += 1.4;
      });

      tl.to(
        ".mac-rig",
        { rotateY: 0, rotateX: 2, scale: 0.94, duration: 0.6, ease: "none" },
        t,
      ).to(".mac-outro", { autoAlpha: 1, y: 0, duration: 0.4, ease: "none" }, t);
    },
    { scope: root },
  );

  return (
    <section
      id="studio"
      ref={root}
      data-nav-theme="light"
      className="relative"
      style={{
        background: "linear-gradient(180deg, #f5edd8 0%, #efe6d0 50%, #e8dcc4 100%)",
      }}
      aria-label="Languages and services craft"
    >
      <div className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-2 py-20 md:px-6">
        <div
          className="mac-glow pointer-events-none absolute left-1/2 top-[45%] h-[55vmin] w-[75vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(202,138,4,0.25) 0%, rgba(255,230,180,0.1) 45%, transparent 70%)",
          }}
        />

        <div className="mac-intro pointer-events-none absolute left-1/2 top-20 z-30 w-full max-w-xl -translate-x-1/2 px-4 text-center md:top-24">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.4em] text-[#8a6a20]">
            Our services · in code
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-extrabold text-[#1a1510] md:text-4xl">
            Every language. One stack.
          </h2>
        </div>

        {/* Larger side docks */}
        <div className="pointer-events-none absolute inset-y-0 left-1 z-20 flex w-[108px] flex-col justify-center gap-7 md:left-5 md:w-[148px] md:gap-8 lg:left-7 lg:w-[168px]">
          {CHAPTERS.filter((c) => c.side === "left").map((ch) => (
            <DockItem key={ch.id} chapter={ch} />
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-1 z-20 flex w-[108px] flex-col justify-center gap-7 md:right-5 md:w-[148px] md:gap-8 lg:right-7 lg:w-[168px]">
          {CHAPTERS.filter((c) => c.side === "right").map((ch) => (
            <DockItem key={ch.id} chapter={ch} />
          ))}
        </div>

        {/* Footprint trails */}
        {CHAPTERS.map((ch, ci) => (
          <div key={`trail-${ch.id}`} className="pointer-events-none absolute inset-0 z-30">
            {Array.from({ length: FOOTPRINTS }).map((_, fi) => {
              const t = (fi + 1) / (FOOTPRINTS + 1);
              const left = ch.side === "left" ? 50 - t * 40 : 50 + t * 40;
              const top = 48 + Math.sin(t * Math.PI) * (ci % 2 === 0 ? -6 : 6) - t * (4 + (ci % 3) * 4);
              return (
                <span
                  key={fi}
                  className={`mac-print mac-print-${ch.id} absolute -translate-x-1/2 -translate-y-1/2 rounded-full`}
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                    width: fi % 2 === 0 ? 5 : 8,
                    height: fi % 2 === 0 ? 5 : 8,
                    background: GOLD,
                    boxShadow: `0 0 12px ${GOLD}, 0 0 22px rgba(245,215,110,0.7)`,
                    visibility: "hidden",
                  }}
                />
              );
            })}
          </div>
        ))}

        {/* Flying orbs */}
        {CHAPTERS.map((ch) => (
          <div
            key={`fly-${ch.id}`}
            className={`mac-fly mac-fly-${ch.id} pointer-events-none absolute z-40 flex h-20 w-20 items-center justify-center rounded-[1.35rem] border-2 border-[#ca8a04]/50 md:h-24 md:w-24 md:rounded-[1.5rem]`}
            style={{
              background: "linear-gradient(145deg, #2a241c 0%, #0a0a0a 100%)",
              boxShadow: `0 0 32px ${GOLD}88, inset 0 0 12px ${GOLD}33`,
              left: "50%",
              top: "48%",
            }}
          >
            <span
              className="font-[family-name:var(--font-display)] text-xl font-extrabold md:text-2xl"
              style={{ color: CREAM }}
            >
              {ch.mark}
            </span>
          </div>
        ))}

        {/* MacBook */}
        <div className="relative z-10 w-full max-w-[620px] md:max-w-[720px]" style={{ perspective: "1600px" }}>
          <div className="mac-rig will-change-transform" style={{ transformStyle: "preserve-3d" }}>
            <div
              className="relative mx-auto overflow-hidden rounded-t-[14px] border border-[#2a2a2a] bg-[#0a0a0a] md:rounded-t-[18px]"
              style={{
                width: "92%",
                aspectRatio: "16 / 10.2",
                boxShadow:
                  "inset 0 0 0 2px #1a1a1a, inset 0 0 0 5px #0d0d0d, 0 30px 80px rgba(0,0,0,0.4)",
              }}
            >
              <div className="absolute left-1/2 top-2 z-20 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#222]" />
              <div className="absolute inset-[3%] overflow-hidden rounded-[6px] bg-[#0c0c0c] md:inset-[2.5%]">
                <div className="flex h-7 items-center gap-1.5 border-b border-white/5 bg-[#141414] px-3">
                  <span className="h-2 w-2 rounded-full bg-[#ca8a04]/80" />
                  <span className="h-2 w-2 rounded-full bg-[#f5d76e]/60" />
                  <span className="h-2 w-2 rounded-full bg-[#faf8f0]/40" />
                  <span className="ml-3 font-mono text-[9px] text-white/35">hashstack — craft</span>
                </div>
                <div className="relative h-[calc(100%-1.75rem)] overflow-hidden px-3 py-3 md:px-5 md:py-4">
                  {CHAPTERS.map((ch) => (
                    <div
                      key={ch.id}
                      className={`mac-chapter-code mac-code-${ch.id} absolute inset-0 px-3 py-3 md:px-5 md:py-4`}
                    >
                      <div
                        className={`mac-lang-tag mac-tag-${ch.id} mb-2 inline-flex items-center gap-2 rounded-full border border-[#ca8a04]/35 bg-[#ca8a04]/10 px-2.5 py-0.5`}
                      >
                        <span className="h-2 w-2 rounded-full bg-[#ca8a04] shadow-[0_0_8px_#ca8a04]" />
                        <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-[#f5d76e]">
                          {ch.name} · {ch.service}
                        </span>
                      </div>
                      <pre className="font-mono text-[10px] leading-5 text-[#c8c4b8] md:text-[12px] md:leading-6">
                        {ch.lines.map((line, li) => (
                          <div key={li} className="mac-line flex gap-3">
                            <span className="w-4 shrink-0 text-right text-[#555]">{li + 1}</span>
                            <span className={li === 0 ? "text-[#ca8a04]" : undefined}>{line || "\u00A0"}</span>
                          </div>
                        ))}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="relative mx-auto h-2 w-[92%] bg-gradient-to-b from-[#1f1f1f] to-[#0a0a0a]" />
            <div
              className="relative mx-auto overflow-hidden rounded-b-[12px] border border-t-0 border-[#222] bg-gradient-to-b from-[#1a1a1a] to-[#0c0c0c] md:rounded-b-[16px]"
              style={{ width: "100%", aspectRatio: "16 / 1.1", boxShadow: "0 40px 70px rgba(0,0,0,0.3)" }}
            >
              <div className="absolute left-1/2 top-[18%] h-[55%] w-[28%] -translate-x-1/2 rounded-md border border-white/5 bg-[#141414]/80" />
            </div>
          </div>
        </div>

        <p className="mac-outro pointer-events-none absolute bottom-10 left-1/2 z-30 -translate-x-1/2 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-[#8a6a20]">
          Stack complete · scroll for creative
        </p>
      </div>
    </section>
  );
}

function DockItem({ chapter }: { chapter: Chapter }) {
  return (
    <div className={`mac-dock-item mac-dock-${chapter.id} flex w-full flex-col items-center gap-2.5`}>
      <div
        className="flex h-[4.75rem] w-[4.75rem] items-center justify-center rounded-[1.35rem] border-2 border-[#ca8a04]/60 md:h-[5.75rem] md:w-[5.75rem] md:rounded-[1.5rem]"
        style={{
          background: "linear-gradient(145deg, #2a241c 0%, #0c0a08 100%)",
          boxShadow: "0 12px 32px rgba(202,138,4,0.32), inset 0 0 20px rgba(202,138,4,0.14)",
        }}
      >
        <span
          className="font-[family-name:var(--font-display)] text-xl font-extrabold tracking-tight md:text-2xl"
          style={{ color: CREAM, textShadow: `0 0 14px ${GOLD}` }}
        >
          {chapter.mark}
        </span>
      </div>
      <p className="text-center font-[family-name:var(--font-display)] text-sm font-bold leading-tight text-[#1a1510] md:text-base">
        {chapter.name}
      </p>
      <p className="text-center text-[11px] font-bold uppercase tracking-[0.12em] text-[#8a6a20] md:text-xs">
        {chapter.service}
      </p>
    </div>
  );
}
