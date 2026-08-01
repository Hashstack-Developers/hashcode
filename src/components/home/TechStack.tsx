"use client";

import { useRef } from "react";
import { gsap, useGSAP, registerGsap } from "@/lib/gsap";
import { techStack } from "@/data/content";
import { pinDistance, pinExtras, scrubFeel } from "@/lib/mobile";

const LAYOUT = techStack.map((tech, i) => {
  const angle = (i / techStack.length) * Math.PI * 2 - Math.PI / 2;
  const ring = 0.26 + (i % 3) * 0.11;
  return {
    ...tech,
    x: 50 + Math.cos(angle) * ring * 100,
    y: 52 + Math.sin(angle) * ring * 78,
  };
});

const lines = LAYOUT.filter((_, i) => i % 2 === 0).map((n, i) => ({
  id: i,
  x2: n.x,
  y2: n.y,
}));

const cats = ["Frontend", "Backend", "Cloud", "AI"];

/**
 * Day → night cinema (moon + stars) → tech constellation locks under the night sky.
 */
export function TechStack() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerGsap();
      if (!root.current) return;

      const mm = gsap.matchMedia();

      mm.add("(max-width: 767px)", () => {
        const mobileList = root.current?.querySelector(".tech-mobile-list");
        if (!mobileList) return;

        gsap.set(".tech-night", { autoAlpha: 1 });
        gsap.set(".tech-day", { autoAlpha: 0 });
        gsap.set(".tech-stars", { autoAlpha: 0.7 });
        gsap.set(".tech-sun", { autoAlpha: 0 });
        gsap.set(".tech-moon", { top: "14%", scale: 1, autoAlpha: 1 });
        gsap.set(".tech-blush", { autoAlpha: 0.1 });
        gsap.set(".tech-intro-day", { autoAlpha: 0 });
        gsap.set(".tech-intro-night", { y: 0, autoAlpha: 1 });
        gsap.set(".tech-hint", { autoAlpha: 0 });
        gsap.set(".tech-cloud", { autoAlpha: 0 });
        gsap.set(mobileList, { autoAlpha: 0, y: 16 });
        gsap.set(".tech-cat", { autoAlpha: 0, y: 8 });
        gsap.set(".tech-outro", { autoAlpha: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top 80%",
            end: "+=110%",
            scrub: scrubFeel(0.4),
          },
        });

        tl.to(mobileList, { autoAlpha: 1, y: 0, duration: 0.5, ease: "none" }, 0)
          .to(".tech-cat", { autoAlpha: 1, y: 0, stagger: 0.05, duration: 0.35, ease: "none" }, 0.2)
          .to(".tech-outro", { autoAlpha: 1, duration: 0.3, ease: "none" }, 0.45);
      });

      mm.add("(min-width: 768px)", () => {
      let navLight = true;
      const emitNav = (light: boolean) => {
        if (light === navLight) return;
        navLight = light;
        window.dispatchEvent(new CustomEvent("hashstack:dawn-light", { detail: light }));
      };

      gsap.set(".tech-night", { autoAlpha: 0 });
      gsap.set(".tech-day", { autoAlpha: 1 });
      gsap.set(".tech-stars", { autoAlpha: 0 });
      gsap.set(".tech-sun", { top: "22%", scale: 1, autoAlpha: 1 });
      gsap.set(".tech-moon", { top: "118%", scale: 0.7, autoAlpha: 0 });
      gsap.set(".tech-blush", { autoAlpha: 0 });
      gsap.set(".tech-intro-day", { y: 20, autoAlpha: 0 });
      gsap.set(".tech-intro-night", { y: 24, autoAlpha: 0 });
      gsap.set(".tech-hint", { autoAlpha: 1 });
      gsap.set(".tech-node", { autoAlpha: 0, scale: 0.55, left: "50%", top: "55%" });
      gsap.set(".tech-core", { scale: 0.45, autoAlpha: 0 });
      gsap.set(".tech-line", { strokeDashoffset: 1 });
      gsap.set(".tech-cat", { autoAlpha: 0, y: 10 });
      gsap.set(".tech-cloud", { autoAlpha: 0, y: 24 });
      gsap.set(".tech-outro", { autoAlpha: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: `+=${pinDistance(340)}%`,
          scrub: 0.95,
          pin: true,
          ...pinExtras(),
          onUpdate: (self) => {
            emitNav(self.isActive && self.progress < 0.38);
          },
          onToggle: (self) => {
            if (!self.isActive) emitNav(false);
          },
        },
      });

      // ── 1) Day hold + intro ──
      tl.to(".tech-intro-day", { y: 0, autoAlpha: 1, duration: 0.5, ease: "none" }, 0)
        .to(".tech-hint", { autoAlpha: 0.55, duration: 0.35, ease: "none" }, 0.15)
        .to(".tech-sun", { top: "28%", scale: 1.05, duration: 0.6, ease: "none" }, 0.2);

      // ── 2) Sunset → night (moon rises, stars) ──
      tl.to(".tech-hint", { autoAlpha: 0, duration: 0.3, ease: "none" }, 0.55)
        .to(".tech-sun", { top: "72%", scale: 0.75, duration: 1.1, ease: "none" }, 0.6)
        .to(".tech-blush", { autoAlpha: 0.85, duration: 0.8, ease: "none" }, 0.7)
        .to(".tech-day", { autoAlpha: 0, duration: 1.3, ease: "none" }, 1.0)
        .to(".tech-night", { autoAlpha: 1, duration: 1.3, ease: "none" }, 1.0)
        .to(".tech-sun", { top: "115%", autoAlpha: 0, duration: 0.7, ease: "none" }, 1.5)
        .to(".tech-stars", { autoAlpha: 1, duration: 1, ease: "none" }, 1.55)
        .to(".tech-blush", { autoAlpha: 0.12, duration: 0.8, ease: "none" }, 1.7)
        .to(
          ".tech-moon",
          { top: "18%", scale: 1, autoAlpha: 1, duration: 1.2, ease: "none" },
          1.85,
        )
        .to(".tech-intro-day", { autoAlpha: 0, y: -16, duration: 0.45, ease: "none" }, 2.2)
        .to(".tech-intro-night", { y: 0, autoAlpha: 1, duration: 0.55, ease: "none" }, 2.35)
        .to(".tech-moon", { top: "14%", scale: 1.05, duration: 0.6, ease: "none" }, 2.6);

      // ── 3) Constellation builds under the night ──
      tl.to(".tech-cloud", { autoAlpha: 1, y: 0, duration: 0.55, ease: "none" }, 2.85)
        .to(".tech-core", { scale: 1, autoAlpha: 1, duration: 0.5, ease: "none" }, 3.0);

      LAYOUT.forEach((node, i) => {
        tl.to(
          `.tech-node-${i}`,
          {
            left: `${node.x}%`,
            top: `${node.y}%`,
            scale: 1,
            autoAlpha: 1,
            duration: 0.65,
            ease: "none",
          },
          3.15 + i * 0.03,
        );
      });

      tl.to(".tech-line", { strokeDashoffset: 0, duration: 1.1, ease: "none", stagger: 0.035 }, 3.6)
        .to(".tech-cat", { autoAlpha: 1, y: 0, stagger: 0.07, duration: 0.4, ease: "none" }, 4.3)
        .to(".tech-core", { scale: 1.12, duration: 0.45, ease: "none" }, 4.5)
        .to(".tech-moon", { top: "12%", duration: 0.5, ease: "none" }, 4.55)
        .to(".tech-outro", { autoAlpha: 1, duration: 0.4, ease: "none" }, 4.9);
      });

      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <section
      ref={root}
      className="relative min-h-[100svh] overflow-hidden md:min-h-[100svh]"
      aria-label="Tech stack constellation — day to night"
    >
      <div className="relative flex min-h-[100svh] flex-col overflow-hidden px-5 py-16 md:h-[100svh] md:px-8 md:py-20">
        {/* Day sky */}
        <div
          className="tech-day absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #ffffff 0%, #fffaf0 30%, #f5edd8 70%, #e8d9b8 100%)",
          }}
        />

        {/* Night sky */}
        <div
          className="tech-night absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #050505 0%, #0c0b0a 40%, #141210 75%, #1a1510 100%)",
          }}
        />

        {/* Stars */}
        <div className="tech-stars pointer-events-none absolute inset-0 z-[1]">
          {Array.from({ length: 56 }).map((_, i) => {
            const left = ((i * 41) % 100) + (i % 6) * 0.2;
            const top = ((i * 59) % 70) + (i % 4) * 0.3;
            const size = i % 5 === 0 ? 2.3 : i % 3 === 0 ? 1.6 : 1.1;
            return (
              <span
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  width: size,
                  height: size,
                  opacity: 0.28 + (i % 4) * 0.15,
                  boxShadow: i % 8 === 0 ? "0 0 7px rgba(255,255,255,0.45)" : undefined,
                }}
              />
            );
          })}
        </div>

        <div
          className="tech-blush pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[42%]"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(200,80,30,0.35) 45%, rgba(255,140,40,0.45) 100%)",
          }}
        />

        {/* Sun — sets as night arrives */}
        <div
          className="tech-sun pointer-events-none absolute left-[42%] z-[5] -translate-x-1/2 -translate-y-1/2"
          style={{ top: "22%" }}
        >
          <div
            className="h-24 w-24 rounded-full md:h-32 md:w-32"
            style={{
              background:
                "radial-gradient(circle at 35% 35%, #fff8e0 0%, #f5d76e 45%, #ca8a04 100%)",
              boxShadow: "0 0 50px rgba(202,138,4,0.55)",
            }}
          />
        </div>

        {/* Moon — rises into night */}
        <div
          className="tech-moon pointer-events-none absolute left-[68%] z-[6] -translate-x-1/2 -translate-y-1/2 md:left-[72%]"
          style={{ top: "118%" }}
        >
          <div
            className="relative h-20 w-20 rounded-full md:h-28 md:w-28"
            style={{
              background:
                "radial-gradient(circle at 32% 30%, #faf8f0 0%, #e8e4d8 40%, #c8c2b0 75%, #9a9484 100%)",
              boxShadow:
                "0 0 40px rgba(250,248,240,0.35), inset -8px -5px 16px rgba(40,35,25,0.25)",
            }}
          >
            <span className="absolute left-[28%] top-[34%] h-2.5 w-2.5 rounded-full bg-[#c8c2b0]/70 md:h-3.5 md:w-3.5" />
            <span className="absolute left-[55%] top-[48%] h-2 w-2 rounded-full bg-[#b8b2a0]/55" />
          </div>
        </div>

        {/* Day copy */}
        <div className="tech-intro-day relative z-20 mx-auto w-full max-w-3xl text-center">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.4em] text-[#8a6a20]">
            Tech stack · daylight
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-extrabold text-[#1a1510] md:text-5xl">
            A living constellation of what we ship with.
          </h2>
          <p className="mt-3 text-sm text-[#5c4a28] md:text-base">
            Scroll — day yields to night, then the stack lights the sky.
          </p>
        </div>

        {/* Night copy */}
        <div className="tech-intro-night absolute left-1/2 top-16 z-20 w-full max-w-3xl -translate-x-1/2 px-5 text-center md:top-20 md:px-8">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.4em] text-[#ca8a04]">
            Tech stack · under the moon
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-extrabold text-[#faf8f0] md:text-5xl">
            Tools lock into orbit.
          </h2>
          <p className="mt-3 text-sm text-[#faf8f0]/50 md:text-base">
            Night sky. Gold constellation. Everything we ship with.
          </p>
        </div>

        <p className="tech-hint relative z-20 mt-4 text-center text-[10px] font-bold uppercase tracking-[0.35em] text-[#8a6a20]">
          Scroll · night falls
        </p>

        {/* Constellation panel — desktop */}
        <div className="relative z-10 mx-auto mt-4 hidden w-full max-w-5xl flex-1 md:block">
          <div className="tech-cloud relative h-full min-h-[48vh] overflow-hidden rounded-3xl border border-[#ca8a04]/25 bg-[#0c0a08]/75 backdrop-blur-sm">
            <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:radial-gradient(rgba(202,138,4,0.2)_1px,transparent_1px)] [background-size:28px_28px]" />

            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {lines.map((l) => (
                <line
                  key={l.id}
                  className="tech-line"
                  x1="50"
                  y1="55"
                  x2={l.x2}
                  y2={l.y2}
                  stroke="rgba(202,138,4,0.4)"
                  strokeWidth="0.15"
                  pathLength={1}
                  strokeDasharray={1}
                />
              ))}
            </svg>

            <div
              className="tech-core absolute left-1/2 top-[55%] z-20 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#ca8a04] md:h-[4.5rem] md:w-[4.5rem]"
              style={{
                background: "radial-gradient(circle, #ca8a04 0%, #141210 70%)",
                boxShadow: "0 0 40px rgba(202,138,4,0.45)",
              }}
            >
              <span className="font-[family-name:var(--font-display)] text-xs font-extrabold text-[#faf8f0] md:text-sm">
                HS
              </span>
            </div>

            {LAYOUT.map((tech, i) => (
              <div
                key={tech.name}
                className={`tech-node tech-node-${i} absolute z-10 rounded-xl border border-[#ca8a04]/30 bg-[#141210]/92 px-2.5 py-1.5 backdrop-blur-sm md:px-3 md:py-2`}
                style={{ boxShadow: "0 0 20px rgba(202,138,4,0.12)" }}
              >
                <p className="whitespace-nowrap text-[11px] font-bold text-[#faf8f0] md:text-sm">
                  {tech.name}
                </p>
                <p className="text-[8px] uppercase tracking-[0.16em] text-[#ca8a04]/70 md:text-[9px]">
                  {tech.category}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile wrapping tech chips — replaces crowded orbit */}
        <div className="tech-mobile-list relative z-10 mx-auto mt-6 grid w-full max-w-lg grid-cols-2 gap-2 md:hidden">
          {techStack.map((tech) => (
            <div
              key={tech.name}
              className="rounded-2xl border border-[#ca8a04]/35 bg-[#141210]/90 px-3 py-3"
              style={{ boxShadow: "0 8px 20px rgba(0,0,0,0.35)" }}
            >
              <p className="text-sm font-bold text-[#faf8f0]">{tech.name}</p>
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-[#ca8a04]/75">
                {tech.category}
              </p>
            </div>
          ))}
        </div>

        <div className="relative z-20 mx-auto mt-4 flex flex-wrap justify-center gap-2">
          {cats.map((c) => (
            <span
              key={c}
              className="tech-cat rounded-full border border-[#ca8a04]/35 bg-[#ca8a04]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#ca8a04]"
            >
              {c}
            </span>
          ))}
        </div>

        <p className="tech-outro relative z-20 mt-2 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-[#ca8a04]/55">
          Orbit locked · keep scrolling
        </p>
      </div>
    </section>
  );
}
