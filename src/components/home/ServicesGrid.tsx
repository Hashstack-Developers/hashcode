"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  Cloud,
  Globe,
  Palette,
  Smartphone,
  Sparkles,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { gsap, useGSAP, registerGsap } from "@/lib/gsap";
import { services } from "@/data/content";

const icons: Record<string, LucideIcon> = {
  Globe,
  Smartphone,
  Cloud,
  Palette,
  Sparkles,
};

const ALL = [
  ...services,
  {
    id: "custom",
    title: "Custom stack",
    subtitle: "Engagement",
    description:
      "We assemble squads for product rebuilds, design systems, and AI launches — fixed scope or retainer.",
    icon: "Sparkles",
    accent: "#ca8a04",
  },
];

/**
 * Day reel after Stats shatter — cream sky, each service owns the frame.
 */
export function ServicesGrid() {
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

      gsap.set(".svc-intro", { y: 24, autoAlpha: 0 });
      gsap.set(".svc-slide", { autoAlpha: 0, scale: 0.88, y: 36 });
      gsap.set(".svc-beam", { autoAlpha: 0, scaleY: 0.4 });
      gsap.set(".svc-hint", { autoAlpha: 1 });
      gsap.set(".svc-progress-fill", { scaleX: 0, transformOrigin: "left center" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: `+=${160 + ALL.length * 75}%`,
          scrub: 0.95,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => emitNav(self.isActive),
          onToggle: (self) => {
            if (!self.isActive) emitNav(false);
          },
        },
      });

      tl.to(".svc-intro", { y: 0, autoAlpha: 1, duration: 0.5, ease: "none" }, 0)
        .to(".svc-beam", { autoAlpha: 0.9, scaleY: 1, duration: 0.55, ease: "none" }, 0.15)
        .to(".svc-hint", { autoAlpha: 0.5, duration: 0.3, ease: "none" }, 0.2);

      let t = 0.65;

      ALL.forEach((_, i) => {
        const slide = `.svc-slide-${i}`;
        const prev = i > 0 ? `.svc-slide-${i - 1}` : null;

        if (prev) {
          tl.to(prev, { autoAlpha: 0, scale: 0.9, y: -28, duration: 0.4, ease: "none" }, t);
        }

        tl.to(".svc-hint", { autoAlpha: 0, duration: 0.2, ease: "none" }, t)
          .fromTo(
            slide,
            { autoAlpha: 0, scale: 0.88, y: 40 },
            { autoAlpha: 1, scale: 1, y: 0, duration: 0.55, ease: "none" },
            t + 0.05,
          )
          .to(
            ".svc-progress-fill",
            { scaleX: (i + 1) / ALL.length, duration: 0.55, ease: "none" },
            t + 0.05,
          )
          .to(slide, { scale: 1.02, duration: 0.45, ease: "none" }, t + 0.6);

        t += 1.15;
      });

      tl.to(".svc-outro", { autoAlpha: 1, duration: 0.4, ease: "none" }, t);
      gsap.set(".svc-outro", { autoAlpha: 0 });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="services"
      data-nav-theme="light"
      className="relative min-h-[100svh] overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #ffffff 0%, #fffaf0 28%, #f5edd8 70%, #e8d9b8 100%)",
      }}
      aria-label="Core services"
    >
      <div className="relative flex h-[100svh] flex-col px-5 py-20 md:px-8 md:py-24">
        <div
          className="svc-beam pointer-events-none absolute left-1/2 top-[42%] h-[50vh] w-[min(640px,90vw)] -translate-x-1/2 -translate-y-1/2 rounded-[40%]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(202,138,4,0.28) 0%, rgba(255,230,180,0.15) 45%, transparent 70%)",
          }}
        />

        <div className="svc-intro relative z-20 mx-auto w-full max-w-3xl text-center">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.4em] text-[#8a6a20]">
            Core services · daylight
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-extrabold text-[#1a1510] md:text-5xl">
            Interactive capabilities, not brochure bullets.
          </h2>
          <p className="mt-3 text-sm text-[#5c4a28] md:text-base">
            Day reel — one delivery track owns the frame at a time.
          </p>
        </div>

        <div className="relative z-10 mx-auto mt-8 flex w-full max-w-2xl flex-1 items-center md:mt-10">
          {ALL.map((service, i) => {
            const Icon = icons[service.icon] ?? Globe;
            const isCustom = service.id === "custom";
            return (
              <div
                key={service.id}
                className={`svc-slide svc-slide-${i} absolute inset-x-0 mx-auto w-full`}
              >
                <div
                  className="rounded-3xl border-2 border-[#ca8a04]/50 bg-[#faf8f0]/95 p-7 backdrop-blur-xl md:p-10"
                  style={{
                    boxShadow:
                      "0 24px 60px rgba(80,50,10,0.12), 0 0 40px rgba(202,138,4,0.15)",
                  }}
                >
                  <div className="mb-6 flex items-center justify-between">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#ca8a04]/45 bg-[#ca8a04]/10"
                      style={{ boxShadow: `0 0 28px ${service.accent}44` }}
                    >
                      <Icon className="h-6 w-6 text-[#ca8a04]" />
                    </div>
                    <span className="font-mono text-sm text-[#8a6a20]">
                      0{i + 1} / 0{ALL.length}
                    </span>
                  </div>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#8a6a20]">
                    {service.subtitle}
                  </p>
                  <h3 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-extrabold text-[#1a1510] md:text-4xl">
                    {service.title}
                  </h3>
                  <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#5c4a28] md:text-base">
                    {service.description}
                  </p>
                  <Link
                    href={isCustom ? "/contact" : "/services"}
                    className="mt-7 inline-flex items-center gap-2 rounded-full border-2 border-[#ca8a04]/50 bg-[#1a1510] px-5 py-2.5 text-sm font-bold text-[#faf8f0] transition hover:border-[#ca8a04] hover:bg-[#2a241c]"
                  >
                    {isCustom ? "Talk to us" : "Explore track"}
                    <ArrowUpRight className="h-4 w-4 text-[#ca8a04]" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative z-20 mx-auto mt-auto w-full max-w-2xl pb-2">
          <div className="h-1.5 overflow-hidden rounded-full bg-[#1a1510]/10">
            <div className="svc-progress-fill h-full origin-left rounded-full bg-[#ca8a04]" />
          </div>
          <p className="svc-hint mt-3 text-center text-[10px] font-bold uppercase tracking-[0.35em] text-[#8a6a20]">
            Scroll · next capability
          </p>
          <p className="svc-outro mt-2 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-[#8a6a20]/70">
            Tracks locked · keep scrolling
          </p>
        </div>
      </div>
    </section>
  );
}
