"use client";

import { useRef } from "react";
import { gsap, useGSAP, registerGsap } from "@/lib/gsap";
import { stats } from "@/data/content";
import { isMobileViewport, pinDistance, pinExtras, scrubFeel } from "@/lib/mobile";

type Particle = {
  angle: number;
  ringR: number;
  dist: number;
  size: number;
  shade: string;
};

/**
 * Number theater → ring grows → shatter via canvas particles (GPU-light) → day.
 * Mobile: far fewer particles + shorter pin — 1000 arcs @ high DPR freezes phones.
 */
export function Stats() {
  const root = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useGSAP(
    () => {
      registerGsap();
      if (!root.current) return;

      const mobile = isMobileViewport();
      const particleCount = mobile ? 90 : 1000;

      let navLight = false;
      const emitNav = (light: boolean) => {
        if (light === navLight) return;
        navLight = light;
        window.dispatchEvent(new CustomEvent("hashstack:dawn-light", { detail: light }));
      };

      gsap.set(".stat-intro", { y: 28, autoAlpha: 0 });
      gsap.set(".stat-hero", { autoAlpha: 0, scale: 0.55 });
      gsap.set(".stat-hero-label", { autoAlpha: 0, y: 16 });
      gsap.set(".stat-card", { autoAlpha: 0, y: 40, scale: 0.88 });
      gsap.set(".stat-ring", { autoAlpha: 0, scale: 0.45 });
      gsap.set(".stat-ring-outer", { autoAlpha: 0, scale: 0.35 });
      gsap.set(".stat-glow", { autoAlpha: 0, scale: 0.5 });
      gsap.set(".stat-hint", { autoAlpha: 1 });
      gsap.set(".stat-day", { autoAlpha: 0 });
      gsap.set(".stat-flash", { autoAlpha: 0 });
      gsap.set(".stat-outro", { autoAlpha: 0, y: 14 });
      gsap.set(".stat-intro-day", { autoAlpha: 0, y: 12 });
      gsap.set(".stat-burst-canvas", { autoAlpha: 0 });
      gsap.set(".stat-shake", { x: 0, y: 0 });

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d", { alpha: true });
      const particles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
        angle: (i / particleCount) * Math.PI * 2 + (i % 17) * 0.021,
        ringR: 85 + (i % 9) * 12,
        dist: 0.45 + (i % 13) * 0.08,
        size: i % 17 === 0 ? 3.8 : i % 7 === 0 ? 2.4 : i % 3 === 0 ? 1.6 : 1.1,
        shade:
          i % 5 === 0
            ? "#ffe566"
            : i % 3 === 0
              ? "#f5d76e"
              : i % 2 === 0
                ? "#f0c14d"
                : "#ca8a04",
      }));

      const resizeCanvas = () => {
        if (!canvas) return;
        const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.75);
        const w = window.innerWidth;
        const h = window.innerHeight;
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      resizeCanvas();

      /** Full-viewport dhamaka — particles reach corners */
      const drawBurst = (p: number) => {
        if (!canvas || !ctx) return;
        const w = window.innerWidth;
        const h = window.innerHeight;
        const cx = w / 2;
        const cy = h / 2;
        const reach = Math.hypot(w, h) * 0.72;
        ctx.clearRect(0, 0, w, h);
        if (p <= 0.001) return;

        for (let i = 0; i < particles.length; i++) {
          const pt = particles[i];
          const t = p;
          const fly = Math.min(1, t * 1.08);
          const r = pt.ringR + fly * fly * reach * pt.dist;
          const scale = t < 0.35 ? 0.4 + t * 6 : 2.4 + (t - 0.35) * 4.5;
          const alpha =
            t < 0.05 ? t / 0.05 : t > 0.8 ? Math.max(0, 1 - (t - 0.8) / 0.2) : 1;

          if (alpha <= 0.01) continue;

          const x = cx + Math.cos(pt.angle) * r;
          const y = cy + Math.sin(pt.angle) * r;
          const s = pt.size * scale;

          ctx.globalAlpha = alpha * 0.9;
          ctx.fillStyle = pt.shade;
          ctx.beginPath();
          ctx.arc(x, y, s, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      };

      const burst = { p: 0 };
      const shake = { amp: 0, phase: 0 };
      const applyShake = () => {
        const a = shake.amp;
        const ph = shake.phase;
        gsap.set(".stat-shake", {
          x: Math.sin(ph * 17.1) * a + Math.sin(ph * 29.4) * a * 0.45,
          y: Math.cos(ph * 21.3) * a * 0.9 + Math.cos(ph * 13.7) * a * 0.35,
        });
      };

      const pinEnd = pinDistance(250 + stats.length * 70);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: `+=${pinEnd}%`,
          scrub: scrubFeel(mobile ? 0.55 : 0.95),
          pin: true,
          ...pinExtras(),
          onUpdate: (self) => {
            emitNav(self.isActive && self.progress >= 0.84);
          },
          onToggle: (self) => {
            if (!self.isActive) {
              emitNav(false);
              // Clear canvas when leaving so nothing keeps painting
              ctx?.clearRect(0, 0, window.innerWidth, window.innerHeight);
            }
          },
        },
      });

      tl.to(".stat-intro", { y: 0, autoAlpha: 1, duration: 0.55, ease: "none" }, 0)
        .to(".stat-glow", { autoAlpha: 0.35, scale: 0.85, duration: 0.6, ease: "none" }, 0.1)
        .to(".stat-ring", { autoAlpha: 0.75, scale: 0.85, duration: 0.55, ease: "none" }, 0.15)
        .to(".stat-ring-outer", { autoAlpha: 0.35, scale: 0.7, duration: 0.55, ease: "none" }, 0.2)
        .to(".stat-hint", { autoAlpha: 0.55, duration: 0.35, ease: "none" }, 0.2);

      let t = 0.7;

      stats.forEach((stat, i) => {
        const hero = `.stat-hero-${i}`;
        const label = `.stat-hero-label-${i}`;
        const card = `.stat-card-${i}`;
        const valueEl = root.current?.querySelector<HTMLElement>(`${hero} .stat-count`);
        const counter = { n: 0 };
        const progress = (i + 1) / stats.length;

        tl.to(".stat-hint", { autoAlpha: 0, duration: 0.2, ease: "none" }, t)
          .to(
            ".stat-ring",
            {
              scale: 0.85 + progress * 0.9,
              autoAlpha: 0.75 + progress * 0.2,
              duration: 1.2,
              ease: "none",
            },
            t,
          )
          .to(
            ".stat-ring-outer",
            {
              scale: 0.7 + progress * 1.1,
              autoAlpha: 0.3 + progress * 0.3,
              duration: 1.2,
              ease: "none",
            },
            t,
          )
          .to(
            ".stat-glow",
            {
              scale: 0.85 + progress * 1.15,
              autoAlpha: 0.35 + progress * 0.55,
              duration: 1.2,
              ease: "none",
            },
            t,
          )
          .set(hero, { autoAlpha: 1, scale: 0.55 }, t)
          .to(hero, { scale: 1.08, duration: 0.7, ease: "none" }, t)
          .to(
            counter,
            {
              n: stat.value,
              duration: 0.85,
              ease: "none",
              onUpdate: () => {
                if (valueEl) valueEl.textContent = Math.round(counter.n).toString();
              },
            },
            t,
          )
          .to(label, { autoAlpha: 1, y: 0, duration: 0.4, ease: "none" }, t + 0.25)
          .to(hero, { scale: 0.42, autoAlpha: 0, duration: 0.55, ease: "none" }, t + 0.95)
          .to(label, { autoAlpha: 0, y: -12, duration: 0.35, ease: "none" }, t + 0.95)
          .to(card, { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: "none" }, t + 1.05);

        t += 1.45;
      });

      const boom = t + 0.2;

      // Ring climbs to peak — shake starts, then gets violent at peak
      tl.to(".stat-intro-night", { autoAlpha: 0.4, duration: 0.35, ease: "none" }, boom)
        .to(".stat-ring", { scale: 2.35, autoAlpha: 1, duration: 0.55, ease: "none" }, boom)
        .to(".stat-ring-outer", { scale: 2.9, autoAlpha: 0.85, duration: 0.55, ease: "none" }, boom)
        .to(".stat-glow", { scale: 2.8, autoAlpha: 1, duration: 0.55, ease: "none" }, boom)
        .to(
          shake,
          { amp: mobile ? 1.2 : 2.5, phase: 10, duration: 0.28, ease: "none", onUpdate: applyShake },
          boom,
        )
        .to(
          shake,
          { amp: mobile ? 3 : 7, phase: 28, duration: 0.27, ease: "none", onUpdate: applyShake },
          boom + 0.28,
        );

      const hit = boom + 0.55;

      // Peak → FAST shake → DHAMAKA full-screen
      tl.to(
        shake,
        { amp: mobile ? 6 : 18, phase: 55, duration: 0.18, ease: "none", onUpdate: applyShake },
        hit,
      )
        .to(".stat-flash", { autoAlpha: 0.75, duration: 0.1, ease: "none" }, hit)
        .set([".stat-ring", ".stat-ring-outer"], { autoAlpha: 0 }, hit)
        .set(".stat-burst-canvas", { autoAlpha: 1 }, hit)
        .fromTo(
          burst,
          { p: 0 },
          {
            p: 1,
            duration: 1.75,
            ease: "none",
            onUpdate: () => {
              drawBurst(burst.p);
              if (burst.p >= 0.99) {
                ctx?.clearRect(0, 0, window.innerWidth, window.innerHeight);
              }
            },
          },
          hit,
        )
        .to(
          shake,
          { amp: mobile ? 4 : 11, phase: 72, duration: 0.28, ease: "none", onUpdate: applyShake },
          hit + 0.15,
        )
        .to(
          shake,
          { amp: 0, phase: 82, duration: 0.5, ease: "none", onUpdate: applyShake },
          hit + 0.45,
        )
        .set(".stat-shake", { x: 0, y: 0 }, hit + 1.0)
        .to(".stat-flash", { autoAlpha: 0, duration: 0.55, ease: "none" }, hit + 0.15)
        .to(".stat-glow", { autoAlpha: 0.55, scale: 2.1, duration: 0.6, ease: "none" }, hit);

      // 2) Day rises gently UNDER the storm → full day
      tl.to(".stat-day", { autoAlpha: 0.25, duration: 0.55, ease: "none" }, hit + 0.2)
        .to(".stat-night", { autoAlpha: 0.75, duration: 0.55, ease: "none" }, hit + 0.2)
        .to(".stat-day", { autoAlpha: 0.55, duration: 0.65, ease: "none" }, hit + 0.7)
        .to(".stat-night", { autoAlpha: 0.4, duration: 0.65, ease: "none" }, hit + 0.7)
        .to(".stat-day", { autoAlpha: 0.85, duration: 0.7, ease: "none" }, hit + 1.25)
        .to(".stat-night", { autoAlpha: 0.12, duration: 0.7, ease: "none" }, hit + 1.25)
        .to(".stat-day", { autoAlpha: 1, duration: 0.55, ease: "none" }, hit + 1.85)
        .to(".stat-night", { autoAlpha: 0, duration: 0.55, ease: "none" }, hit + 1.85)
        .to(".stat-glow", { autoAlpha: 0.28, scale: 1.5, duration: 0.6, ease: "none" }, hit + 1.5);

      // 3) UI flips to day once daylight is mostly there
      tl.to(".stat-intro-night", { autoAlpha: 0, duration: 0.4, ease: "none" }, hit + 1.1)
        .to(".stat-intro-day", { autoAlpha: 1, y: 0, duration: 0.5, ease: "none" }, hit + 1.2)
        .to(
          ".stat-card",
          {
            backgroundColor: "rgba(250,248,240,0.95)",
            borderColor: "rgba(202,138,4,0.5)",
            duration: 0.45,
            ease: "none",
          },
          hit + 1.15,
        )
        .to(".stat-card-value", { color: "#1a1510", duration: 0.4, ease: "none" }, hit + 1.15)
        .to(".stat-card-label", { color: "#1a1510", duration: 0.4, ease: "none" }, hit + 1.15)
        .to(".stat-card-detail", { color: "#5c4a28", duration: 0.4, ease: "none" }, hit + 1.15)
        .to(".stat-outro", { autoAlpha: 1, y: 0, duration: 0.4, ease: "none" }, hit + 2.0)
        .set(".stat-burst-canvas", { autoAlpha: 0 }, hit + 1.85)
        .to(".stat-day", { autoAlpha: 1, duration: 0.45, ease: "none" }, hit + 2.2);

      const onResize = () => {
        resizeCanvas();
        if (burst.p > 0 && burst.p < 1) drawBurst(burst.p);
      };
      window.addEventListener("resize", onResize);

      return () => {
        window.removeEventListener("resize", onResize);
        ctx?.clearRect(0, 0, window.innerWidth, window.innerHeight);
      };
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative min-h-[100svh] overflow-hidden"
      aria-label="Impact numbers"
    >
      <div className="stat-shake relative flex h-[100svh] flex-col items-center justify-center px-5 will-change-transform">
        <div className="stat-night absolute inset-0 bg-[#0a0908]" />
        <div
          className="stat-day absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #ffffff 0%, #fffaf0 30%, #f5edd8 70%, #e8d9b8 100%)",
          }}
        />
        <div className="stat-flash pointer-events-none absolute inset-0 z-40 bg-[#fffef5]" />

        <div
          className="stat-glow pointer-events-none absolute left-1/2 top-1/2 z-[1] h-[75vmin] w-[75vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,220,80,0.55) 0%, rgba(202,138,4,0.22) 40%, transparent 70%)",
          }}
        />

        <div className="stat-ring-outer pointer-events-none absolute left-1/2 top-1/2 z-[2] h-[68vmin] w-[68vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#ca8a04]/20" />
        <div
          className="stat-ring pointer-events-none absolute left-1/2 top-1/2 z-[3] h-[52vmin] w-[52vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#ca8a04]/55"
          style={{
            boxShadow:
              "0 0 60px rgba(202,138,4,0.35), inset 0 0 50px rgba(202,138,4,0.12)",
          }}
        />

        {/* Single canvas = no 160 compositor layers */}
        <canvas
          ref={canvasRef}
          className="stat-burst-canvas pointer-events-none absolute inset-0 z-30"
          aria-hidden
        />

        <div className="absolute left-1/2 top-20 z-20 w-full max-w-2xl -translate-x-1/2 px-4 text-center md:top-24">
          <div className="stat-intro">
            <div className="stat-intro-night">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.4em] text-[#ca8a04]">
                Impact
              </p>
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-extrabold text-[#faf8f0] md:text-5xl">
                Proof across every service we ship.
              </h2>
              <p className="mt-3 text-sm text-[#faf8f0]/50 md:text-base">
                Projects, retention, clients, and the speed jump after we left the slow legacy era.
              </p>
            </div>
            <div className="stat-intro-day absolute inset-x-0 top-0">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.4em] text-[#8a6a20]">
                Impact · daybreak
              </p>
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-extrabold text-[#1a1510] md:text-5xl">
                The numbers stay. Services come next.
              </h2>
              <p className="mt-3 text-sm text-[#5c4a28] md:text-base">
                From web and apps to design, cloud, and AI — the full catalog opens in daylight.
              </p>
            </div>
          </div>
        </div>

        <p className="stat-hint pointer-events-none absolute bottom-[18%] z-20 text-[10px] font-bold uppercase tracking-[0.35em] text-[#ca8a04]/70">
          Scroll · count the craft
        </p>

        <div className="relative z-10 flex h-[42vh] w-full max-w-3xl items-center justify-center">
          {stats.map((stat, i) => (
            <div
              key={`hero-${stat.label}`}
              className={`stat-hero stat-hero-${i} absolute inset-0 flex flex-col items-center justify-center text-center`}
            >
              <p className="font-[family-name:var(--font-display)] text-[clamp(4.5rem,18vw,9rem)] font-extrabold leading-none text-[#faf8f0]">
                <span className="stat-count">0</span>
                <span className="text-[#ca8a04]">{stat.suffix}</span>
              </p>
              <p
                className={`stat-hero-label stat-hero-label-${i} mt-4 text-sm font-bold uppercase tracking-[0.28em] text-[#ca8a04] md:text-base`}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Lift cards on mobile so outro hint has clear air below */}
        <div className="absolute inset-x-0 bottom-[4.75rem] z-20 mx-auto grid max-w-5xl grid-cols-2 gap-3 px-4 md:bottom-16 md:grid-cols-4 md:gap-4 md:px-8">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`stat-card stat-card-${i} rounded-2xl border border-[#ca8a04]/30 bg-[#141210]/85 p-4 backdrop-blur-md md:p-5`}
              style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.35)" }}
            >
              <p className="stat-card-value font-[family-name:var(--font-display)] text-2xl font-bold text-[#faf8f0] md:text-3xl">
                {stat.value}
                <span className="text-[#ca8a04]">{stat.suffix}</span>
              </p>
              <p className="stat-card-label mt-1 text-xs font-medium text-[#faf8f0]/85 md:text-sm">
                {stat.label}
              </p>
              <p className="stat-card-detail mt-0.5 text-[10px] text-[#faf8f0]/40 md:text-xs">
                {stat.detail}
              </p>
            </div>
          ))}
        </div>

        <p className="stat-outro pointer-events-none absolute bottom-4 left-1/2 z-20 w-[min(92vw,22rem)] -translate-x-1/2 text-center text-[9px] font-bold uppercase leading-relaxed tracking-[0.22em] text-[#8a6a20] md:bottom-5 md:w-auto md:tracking-[0.3em]">
          <span className="md:hidden">Daybreak · scroll next</span>
          <span className="hidden md:inline">Daybreak · scroll into capabilities</span>
        </p>
      </div>
    </section>
  );
}
