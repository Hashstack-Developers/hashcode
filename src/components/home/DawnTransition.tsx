"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, useGSAP, registerGsap } from "@/lib/gsap";
import { siteConfig } from "@/data/content";

/**
 * Section 2 — pin on black → scroll sunrise (sun bottom→top) → full day → About → section 3.
 */
export function DawnTransition() {
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

      // Sun buried below the ridge — clearly rises on scroll
      gsap.set(".dawn-sun-wrap", {
        top: "108%",
        scale: 0.55,
        autoAlpha: 1,
      });
      gsap.set(".dawn-rays", { autoAlpha: 0, scale: 0.4 });
      gsap.set(".dawn-glow", { autoAlpha: 0 });
      gsap.set(".dawn-day", { autoAlpha: 0 });
      gsap.set(".dawn-black", { autoAlpha: 1 });
      gsap.set(".dawn-stars", { autoAlpha: 1 });
      gsap.set(".dawn-hint", { autoAlpha: 1 });
      gsap.set(".dawn-logo", { y: 28, autoAlpha: 0 });
      gsap.set(".dawn-copy", { y: 28, autoAlpha: 0 });
      gsap.set(".dawn-blush", { autoAlpha: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=340%",
          scrub: 0.85,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            // Nav flips once sky is mostly day
            emitNav(self.isActive && self.progress >= 0.52);
          },
          onToggle: (self) => {
            if (!self.isActive) emitNav(false);
          },
        },
      });

      // 1) Hold pure black — screen is "stopped"
      tl.to(".dawn-hint", { autoAlpha: 0.85, duration: 0.55, ease: "none" }, 0);

      // 2) First light + sun starts climbing from below
      tl.to(".dawn-hint", { autoAlpha: 0, duration: 0.4, ease: "none" }, 0.55)
        .to(".dawn-blush", { autoAlpha: 0.7, duration: 0.9, ease: "none" }, 0.6)
        .to(
          ".dawn-sun-wrap",
          { top: "78%", scale: 0.7, duration: 1.2, ease: "none" },
          0.65,
        )
        .to(".dawn-glow", { autoAlpha: 0.4, duration: 1, ease: "none" }, 0.9);

      // 3) Sun clears the mountains — sky turns white / day
      tl.to(
        ".dawn-sun-wrap",
        { top: "48%", scale: 0.92, duration: 1.4, ease: "none" },
        1.7,
      )
        .to(".dawn-stars", { autoAlpha: 0, duration: 1, ease: "none" }, 1.8)
        .to(".dawn-black", { autoAlpha: 0, duration: 1.6, ease: "none" }, 1.85)
        .to(".dawn-day", { autoAlpha: 1, duration: 1.6, ease: "none" }, 1.85)
        .to(".dawn-glow", { autoAlpha: 0.85, duration: 1.2, ease: "none" }, 2.1)
        .to(".dawn-rays", { autoAlpha: 0.7, scale: 1, duration: 1.2, ease: "none" }, 2.2)
        .to(".dawn-blush", { autoAlpha: 0.25, duration: 1, ease: "none" }, 2.4);

      // 4) Full day — sun high in the sky
      tl.to(
        ".dawn-sun-wrap",
        { top: "26%", scale: 1.05, duration: 1.35, ease: "none" },
        3.2,
      )
        .to(".dawn-rays", { scale: 1.12, autoAlpha: 0.8, duration: 1.2, ease: "none" }, 3.3)
        .to(".dawn-glow", { autoAlpha: 1, duration: 1, ease: "none" }, 3.4);

      // 5) About copy only after proper day
      tl.to(".dawn-logo", { y: 0, autoAlpha: 1, duration: 0.75, ease: "none" }, 4.3)
        .to(".dawn-copy", { y: 0, autoAlpha: 1, duration: 0.75, ease: "none" }, 4.45)
        .to(
          ".dawn-sun-wrap",
          { top: "22%", scale: 1.08, duration: 0.9, ease: "none" },
          4.6,
        )
        // 6) Hold day, then release → section 3
        .to(".dawn-rays", { scale: 1.15, duration: 1.1, ease: "none" }, 5.3);
    },
    { scope: root },
  );

  return (
    <section
      id="about"
      ref={root}
      className="relative min-h-[100svh] overflow-hidden bg-black"
      aria-label="About Hashstack — night to morning"
    >
      <div className="relative h-[100svh] w-full overflow-hidden">
        {/* Day / white sky */}
        <div
          className="dawn-day absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #ffffff 0%, #fffaf0 28%, #f5edd8 62%, #e8d9b8 100%)",
          }}
        />

        {/* Pure black night */}
        <div className="dawn-black absolute inset-0 bg-[#050505]" />

        {/* Stars */}
        <div className="dawn-stars pointer-events-none absolute inset-0 z-[1]">
          {Array.from({ length: 56 }).map((_, i) => {
            const left = ((i * 37) % 100) + (i % 7) * 0.3;
            const top = ((i * 53) % 70) + (i % 5) * 0.4;
            const size = i % 5 === 0 ? 2.5 : i % 3 === 0 ? 1.8 : 1.2;
            return (
              <span
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  width: size,
                  height: size,
                  opacity: 0.3 + (i % 4) * 0.18,
                  boxShadow: i % 7 === 0 ? "0 0 8px rgba(255,255,255,0.55)" : undefined,
                }}
              />
            );
          })}
        </div>

        {/* Horizon blush as sun approaches */}
        <div
          className="dawn-blush pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[50%]"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(180,70,20,0.35) 40%, rgba(255,160,40,0.55) 100%)",
          }}
        />

        <div
          className="dawn-glow pointer-events-none absolute inset-0 z-[3]"
          style={{
            background:
              "radial-gradient(ellipse 80% 55% at 50% 55%, rgba(255,210,90,0.65) 0%, rgba(255,240,200,0.25) 42%, transparent 72%)",
          }}
        />

        {/* Sun + rays — rise together from below the mountains */}
        <div className="dawn-sun-wrap pointer-events-none absolute left-1/2 z-[15] -translate-x-1/2 -translate-y-1/2" style={{ top: "108%" }}>
          <div className="dawn-rays absolute left-1/2 top-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2">
            <div
              className="h-full w-full"
              style={{
                background: `
                  repeating-conic-gradient(
                    from 0deg at 50% 50%,
                    rgba(202,138,4,0.22) 0deg 7deg,
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

        {/* Mountains — sun rises behind the ridge */}
        <svg
          className="absolute bottom-0 left-0 z-20 h-[22vh] w-full text-[#0a0908] md:h-[26vh]"
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
            strokeOpacity="0.5"
            strokeWidth="2"
            d="M0,140 L180,100 L320,125 L480,70 L650,110 L820,55 L1000,95 L1180,60 L1340,100 L1440,80"
          />
        </svg>

        <p className="dawn-hint pointer-events-none absolute bottom-[30%] left-1/2 z-30 -translate-x-1/2 text-center text-[10px] font-bold uppercase tracking-[0.4em] text-white/75 md:text-xs">
          Scroll · sun rises
        </p>

        {/* About — after full day */}
        <div className="pointer-events-none absolute inset-0 z-30 mx-auto grid max-w-7xl grid-cols-1 items-start gap-8 px-6 pb-[30vh] pt-28 md:grid-cols-2 md:items-center md:gap-12 md:px-10 md:pb-[28vh] md:pt-24 lg:gap-20">
          <div className="dawn-logo text-left">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.4em] text-[#8a6a20] md:text-xs">
              Est. craft · {siteConfig.location}
            </p>
            <p className="font-[family-name:var(--font-display)] text-5xl font-extrabold leading-none tracking-[-0.03em] text-[#1a1510] md:text-6xl lg:text-7xl">
              {siteConfig.name}
              <span className="text-[#ca8a04]">.</span>
            </p>
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.35em] text-[#8a6a20] md:text-sm">
              {siteConfig.fullName}
            </p>
            <p className="mt-5 max-w-sm text-sm font-medium leading-relaxed text-[#5c4a28]/90 md:text-base">
              {siteConfig.tagline}
            </p>
            <div className="mt-8 hidden h-px w-24 bg-[#ca8a04]/50 md:block" />
          </div>

          <div className="dawn-copy pointer-events-auto text-left md:pl-4 lg:pl-8">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.4em] text-[#8a6a20] md:text-xs">
              About us
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-tight text-[#1a1510] md:text-3xl lg:text-4xl">
              Day breaks on better software.
            </h2>
            <p className="mt-4 max-w-md text-sm font-medium leading-relaxed text-[#5c4a28] md:text-base">
              {siteConfig.description} We blend strategy, immersive frontend, and production
              engineering for brands that need to look inevitable — and ship on time.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#8a6a20] md:text-xs">
              <span>Web · Mobile · AI</span>
              <span>Cloud · Design</span>
            </div>
            <Link
              href="/about"
              className="mt-7 inline-flex items-center gap-2 rounded-full border-2 border-[#ca8a04]/50 bg-[#1a1510]/90 px-6 py-3 text-sm font-extrabold text-[#faf8f0] shadow-[0_8px_30px_rgba(80,50,10,0.2)] transition hover:border-[#ca8a04] hover:bg-[#1a1510]"
            >
              Our story
              <ArrowUpRight className="h-4 w-4 text-[#ca8a04]" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
