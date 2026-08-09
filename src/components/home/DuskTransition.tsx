"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight, Moon, Radio, Shield, Zap } from "lucide-react";
import { gsap, useGSAP, registerGsap } from "@/lib/gsap";
import { siteConfig } from "@/data/content";
import { pinDistance, pinExtras, scrubFeel } from "@/lib/mobile";

const NIGHT_POINTS = [
  {
    icon: Zap,
    title: "Sprint cadence",
    body: "Weekly demos across web, app, design, and AI — clear owners, no black-box weeks.",
  },
  {
    icon: Shield,
    title: "Production care",
    body: "After launch we stay: monitoring, hotfixes, performance, and release discipline.",
  },
  {
    icon: Radio,
    title: "Always-on partners",
    body: "Remote-first across timezones — someone is shipping while you sleep.",
  },
];

/**
 * After Graphics — pinned day → scroll sunset → night + moon → studio info.
 */
export function DuskTransition() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerGsap();
      if (!root.current) return;

      let navLight = false;
      const emitNav = (light: boolean) => {
        if (light === navLight) return;
        navLight = light;
        window.dispatchEvent(new CustomEvent("hashstack:dawn-light", { detail: light }));
      };

      // Start as full day — sun high
      gsap.set(".dusk-day", { autoAlpha: 1 });
      gsap.set(".dusk-night", { autoAlpha: 0 });
      gsap.set(".dusk-stars", { autoAlpha: 0 });
      gsap.set(".dusk-sun-wrap", { top: "24%", scale: 1.05, autoAlpha: 1 });
      gsap.set(".dusk-rays", { autoAlpha: 0.75, scale: 1.1 });
      gsap.set(".dusk-glow", { autoAlpha: 0.9 });
      gsap.set(".dusk-blush", { autoAlpha: 0.2 });
      gsap.set(".dusk-moon-wrap", { top: "118%", scale: 0.55, autoAlpha: 0 });
      gsap.set(".dusk-hint", { autoAlpha: 1 });
      gsap.set(".dusk-day-copy", { y: 0, autoAlpha: 1 });
      gsap.set(".dusk-night-copy", { y: 36, autoAlpha: 0 });
      gsap.set(".dusk-card", { y: 24, autoAlpha: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: `+=${pinDistance(320)}%`,
          scrub: scrubFeel(0.85),
          pin: true,
          ...pinExtras(),
          onUpdate: (self) => {
            // Light nav while still day; dark once night takes over
            emitNav(self.isActive && self.progress < 0.48);
          },
          onToggle: (self) => {
            if (!self.isActive) emitNav(false);
          },
        },
      });

      // 1) Hold day
      tl.to(".dusk-hint", { autoAlpha: 0.7, duration: 0.45, ease: "none" }, 0);

      // 2) Sunset — sun sinks, golden hour blush
      tl.to(".dusk-hint", { autoAlpha: 0, duration: 0.35, ease: "none" }, 0.5)
        .to(".dusk-day-copy", { autoAlpha: 0, y: -16, duration: 0.55, ease: "none" }, 0.55)
        .to(
          ".dusk-sun-wrap",
          { top: "48%", scale: 1.15, duration: 1.2, ease: "none" },
          0.6,
        )
        .to(".dusk-blush", { autoAlpha: 0.85, duration: 1, ease: "none" }, 0.7)
        .to(".dusk-glow", { autoAlpha: 0.7, duration: 1, ease: "none" }, 0.75)
        .to(".dusk-rays", { autoAlpha: 0.45, scale: 0.95, duration: 1, ease: "none" }, 0.8);

      // 3) Sun drops behind mountains — night rolls in
      tl.to(
        ".dusk-sun-wrap",
        { top: "88%", scale: 0.75, duration: 1.35, ease: "none" },
        1.7,
      )
        .to(".dusk-rays", { autoAlpha: 0, duration: 0.8, ease: "none" }, 1.85)
        .to(".dusk-day", { autoAlpha: 0, duration: 1.5, ease: "none" }, 1.9)
        .to(".dusk-night", { autoAlpha: 1, duration: 1.5, ease: "none" }, 1.9)
        .to(".dusk-glow", { autoAlpha: 0.15, duration: 1.2, ease: "none" }, 2.1)
        .to(".dusk-blush", { autoAlpha: 0.35, duration: 1, ease: "none" }, 2.2)
        .to(".dusk-stars", { autoAlpha: 1, duration: 1.2, ease: "none" }, 2.35)
        .to(
          ".dusk-sun-wrap",
          { top: "112%", scale: 0.45, autoAlpha: 0.35, duration: 1.1, ease: "none" },
          2.9,
        );

      // 4) Moon rises
      tl.to(
        ".dusk-moon-wrap",
        { top: "28%", scale: 1, autoAlpha: 1, duration: 1.5, ease: "none" },
        3.2,
      )
        .to(".dusk-blush", { autoAlpha: 0.12, duration: 0.9, ease: "none" }, 3.4)
        .to(".dusk-glow", { autoAlpha: 0.35, duration: 1, ease: "none" }, 3.5);

      // 5) Night info
      tl.to(".dusk-night-copy", { y: 0, autoAlpha: 1, duration: 0.8, ease: "none" }, 4.3)
        .to(
          ".dusk-card",
          { y: 0, autoAlpha: 1, stagger: 0.12, duration: 0.65, ease: "none" },
          4.55,
        )
        .to(
          ".dusk-moon-wrap",
          { top: "22%", scale: 1.06, duration: 0.95, ease: "none" },
          5.0,
        )
        .to(".dusk-stars", { autoAlpha: 1, duration: 0.9, ease: "none" }, 5.4);
    },
    { scope: root },
  );

  return (
    <section
      id="after-dark"
      ref={root}
      className="relative min-h-[100svh] overflow-hidden"
      aria-label="Hashstack after dark — how we partner"
    >
      <div className="relative h-[100svh] w-full overflow-hidden">
        {/* Day sky */}
        <div
          className="dusk-day absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #ffffff 0%, #fffaf0 28%, #f5edd8 62%, #e8d9b8 100%)",
          }}
        />

        {/* Night sky */}
        <div
          className="dusk-night absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #050505 0%, #0c0b0a 35%, #141210 70%, #1a1510 100%)",
          }}
        />

        {/* Stars — night */}
        <div className="dusk-stars pointer-events-none absolute inset-0 z-[1]">
          {Array.from({ length: 60 }).map((_, i) => {
            const left = ((i * 41) % 100) + (i % 6) * 0.25;
            const top = ((i * 59) % 68) + (i % 4) * 0.35;
            const size = i % 5 === 0 ? 2.4 : i % 3 === 0 ? 1.7 : 1.15;
            return (
              <span
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  width: size,
                  height: size,
                  opacity: 0.28 + (i % 4) * 0.16,
                  boxShadow: i % 8 === 0 ? "0 0 8px rgba(255,255,255,0.5)" : undefined,
                }}
              />
            );
          })}
        </div>

        <div
          className="dusk-blush pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[48%]"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(200,80,30,0.4) 45%, rgba(255,140,40,0.5) 100%)",
          }}
        />

        <div
          className="dusk-glow pointer-events-none absolute inset-0 z-[3]"
          style={{
            background:
              "radial-gradient(ellipse 75% 50% at 50% 40%, rgba(255,210,90,0.45) 0%, rgba(255,230,180,0.12) 40%, transparent 70%)",
          }}
        />

        {/* Sun — sets on scroll */}
        <div
          className="dusk-sun-wrap pointer-events-none absolute left-1/2 z-[15] -translate-x-1/2 -translate-y-1/2"
          style={{ top: "24%" }}
        >
          <div className="dusk-rays absolute left-1/2 top-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2">
            <div
              className="h-full w-full"
              style={{
                background: `
                  repeating-conic-gradient(
                    from 0deg at 50% 50%,
                    rgba(202,138,4,0.2) 0deg 7deg,
                    transparent 7deg 20deg
                  )
                `,
                maskImage: "radial-gradient(circle, black 6%, transparent 58%)",
                WebkitMaskImage: "radial-gradient(circle, black 6%, transparent 58%)",
              }}
            />
          </div>
          <div
            className="relative h-32 w-32 rounded-full md:h-52 md:w-52"
            style={{
              background:
                "radial-gradient(circle at 35% 35%, #fff8e0 0%, #ffe08a 28%, #f5d76e 50%, #ca8a04 82%, #a16207 100%)",
              boxShadow:
                "0 0 40px rgba(255,220,100,0.9), 0 0 100px rgba(202,138,4,0.55), 0 0 180px rgba(255,180,40,0.35)",
            }}
          />
        </div>

        {/* Moon — rises as night takes over */}
        <div
          className="dusk-moon-wrap pointer-events-none absolute left-[58%] z-[16] -translate-x-1/2 -translate-y-1/2 md:left-[62%]"
          style={{ top: "118%" }}
        >
          <div
            className="relative h-24 w-24 rounded-full md:h-36 md:w-36"
            style={{
              background:
                "radial-gradient(circle at 32% 30%, #faf8f0 0%, #e8e4d8 40%, #c8c2b0 75%, #9a9484 100%)",
              boxShadow:
                "0 0 40px rgba(250,248,240,0.35), 0 0 90px rgba(202,138,4,0.12), inset -10px -6px 20px rgba(40,35,25,0.25)",
            }}
          >
            <span className="absolute left-[28%] top-[34%] h-3 w-3 rounded-full bg-[#c8c2b0]/70 md:h-4 md:w-4" />
            <span className="absolute left-[55%] top-[48%] h-2 w-2 rounded-full bg-[#b8b2a0]/60 md:h-3 md:w-3" />
            <span className="absolute left-[40%] top-[62%] h-4 w-4 rounded-full bg-[#d0caba]/45 md:h-5 md:w-5" />
          </div>
        </div>

        <svg
          className="absolute bottom-0 left-0 z-20 h-[20vh] w-full text-[#0a0908] md:h-[24vh]"
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            fill="currentColor"
            d="M0,140 L180,100 L320,125 L480,70 L650,110 L820,55 L1000,95 L1180,60 L1340,100 L1440,80 L1440,200 L0,200 Z"
          />
          <path
            fill="none"
            stroke="#ca8a04"
            strokeOpacity="0.45"
            strokeWidth="2"
            d="M0,140 L180,100 L320,125 L480,70 L650,110 L820,55 L1000,95 L1180,60 L1340,100 L1440,80"
          />
        </svg>

        <p className="dusk-hint pointer-events-none absolute bottom-[28%] left-1/2 z-30 -translate-x-1/2 text-center text-[10px] font-bold uppercase tracking-[0.4em] text-[#5c4a28]/80 md:text-xs">
          Scroll · day becomes night
        </p>

        {/* Day copy — visible at start */}
        <div className="dusk-day-copy pointer-events-none absolute inset-x-0 top-[5.75rem] z-30 px-6 text-center md:top-28">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.4em] text-[#8a6a20]">
            End of day · {siteConfig.location}
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-extrabold text-[#1a1510] md:text-5xl">
            Full-service doesn&apos;t clock out.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-[#5c4a28] md:text-base">
            Watch the sun set — then see how we stay with your product after dark.
          </p>
        </div>

        {/* Night info panel — mobile: top-align under fixed nav (center was sliding heading under header) */}
        <div className="dusk-night-copy pointer-events-none absolute inset-0 z-30 mx-auto flex max-w-6xl flex-col justify-start overflow-y-auto overscroll-contain px-5 pb-[18vh] pt-[5.75rem] md:justify-center md:overflow-visible md:px-10 md:pb-[24vh] md:pt-28">
          <div className="mb-5 flex shrink-0 items-center gap-3 md:mb-10">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#ca8a04]/40 bg-[#ca8a04]/10">
              <Moon className="h-5 w-5 text-[#f5d76e]" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#ca8a04]">
                After dark · partnership
              </p>
              <h2 className="font-[family-name:var(--font-display)] text-xl font-extrabold leading-tight text-[#faf8f0] sm:text-2xl md:text-4xl">
                How we stay with you.
              </h2>
            </div>
          </div>

          <div className="grid shrink-0 gap-3 md:grid-cols-3 md:gap-5">
            {NIGHT_POINTS.map((item) => (
              <div
                key={item.title}
                className="dusk-card rounded-2xl border border-[#ca8a04]/25 bg-[#141210]/75 p-4 backdrop-blur-sm md:p-6"
              >
                <item.icon className="mb-2.5 h-5 w-5 text-[#ca8a04] md:mb-3 md:h-6 md:w-6" />
                <p className="font-[family-name:var(--font-display)] text-base font-bold text-[#faf8f0] md:text-lg">
                  {item.title}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-[#faf8f0]/65 md:mt-2">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="dusk-card pointer-events-auto mt-4 flex shrink-0 flex-col items-start gap-4 rounded-2xl border border-[#ca8a04]/30 bg-[#0a0908]/80 p-4 md:mt-8 md:flex-row md:items-center md:justify-between md:p-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#ca8a04]">
                Ready when you are
              </p>
              <p className="mt-1 font-[family-name:var(--font-display)] text-lg font-bold text-[#faf8f0] md:text-2xl">
                Brief us. We ship through the night.
              </p>
              <p className="mt-1 text-sm text-[#faf8f0]/55">{siteConfig.email}</p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#ca8a04]/60 bg-[#ca8a04]/15 px-6 py-3 text-sm font-extrabold text-[#faf8f0] transition hover:border-[#ca8a04] hover:bg-[#ca8a04]/25"
            >
              Start a project
              <ArrowUpRight className="h-4 w-4 text-[#ca8a04]" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
