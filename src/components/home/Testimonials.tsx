"use client";

import { useRef } from "react";
import { Quote } from "lucide-react";
import { gsap, useGSAP, registerGsap } from "@/lib/gsap";
import { testimonials } from "@/data/content";
import { pinDistance, pinExtras, scrubFeel } from "@/lib/mobile";

/**
 * Quote orbit — pin, each testimonial floats forward in 3D, then parks.
 * Mobile: simpler fade stack — 3D + long pins freeze weak GPUs.
 */
export function Testimonials() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerGsap();
      if (!root.current) return;

      const mm = gsap.matchMedia();

      mm.add("(max-width: 767px), (pointer: coarse)", () => {
        gsap.set(".tm-intro", { y: 16, autoAlpha: 0 });
        gsap.set(".tm-card", { autoAlpha: 0, y: 24 });
        gsap.set(".tm-hint", { autoAlpha: 0 });
        gsap.set(".tm-outro", { autoAlpha: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: `+=${pinDistance(180)}%`,
            scrub: scrubFeel(0.5),
            pin: true,
            ...pinExtras(),
          },
        });

        tl.to(".tm-intro", { y: 0, autoAlpha: 1, duration: 0.4, ease: "none" }, 0);
        gsap.utils.toArray<HTMLElement>(".tm-card").forEach((card, i) => {
          tl.to(card, { autoAlpha: 1, y: 0, duration: 0.5, ease: "none" }, 0.35 + i * 0.45);
        });
        tl.to(".tm-outro", { autoAlpha: 1, duration: 0.35, ease: "none" }, 1.8);
      });

      mm.add("(min-width: 768px) and (pointer: fine)", () => {
        gsap.set(".tm-intro", { y: 24, autoAlpha: 0 });
        gsap.set(".tm-card", { autoAlpha: 0 });
        gsap.set(".tm-hint", { autoAlpha: 1 });
        gsap.set(".tm-outro", { autoAlpha: 0 });

        const cards = gsap.utils.toArray<HTMLElement>(".tm-card");
        const parks = [
          { xPercent: -108, yPercent: 8, rotateY: 18, scale: 0.82, z: -80 },
          { xPercent: -50, yPercent: -4, rotateY: 0, scale: 1.05, z: 40 },
          { xPercent: 8, yPercent: 8, rotateY: -18, scale: 0.82, z: -80 },
        ];

        cards.forEach((card, i) => {
          gsap.set(card, {
            left: "50%",
            top: "52%",
            xPercent: -50,
            yPercent: -50,
            rotateY: i === 0 ? 0 : i === 1 ? 25 : -25,
            scale: 0.7,
            z: -120,
            autoAlpha: 0,
            transformPerspective: 1200,
          });
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: `+=${pinDistance(200 + testimonials.length * 55)}%`,
            scrub: 0.95,
            pin: true,
            ...pinExtras(),
          },
        });

        tl.to(".tm-intro", { y: 0, autoAlpha: 1, duration: 0.5, ease: "none" }, 0).to(
          ".tm-hint",
          { autoAlpha: 0.5, duration: 0.3, ease: "none" },
          0.2,
        );

        let t = 0.55;

        testimonials.forEach((_, i) => {
          const card = `.tm-card-${i}`;

          if (i > 0) {
            tl.to(
              `.tm-card-${i - 1}`,
              {
                scale: 0.75,
                z: -100,
                autoAlpha: 0.35,
                rotateY: i % 2 === 0 ? -22 : 22,
                xPercent: i % 2 === 0 ? 10 : -110,
                duration: 0.45,
                ease: "none",
              },
              t,
            );
          }

          tl.to(".tm-hint", { autoAlpha: 0, duration: 0.2, ease: "none" }, t)
            .to(
              card,
              {
                autoAlpha: 1,
                scale: 1.08,
                z: 60,
                rotateY: 0,
                xPercent: -50,
                yPercent: -50,
                duration: 0.65,
                ease: "none",
              },
              t + 0.05,
            )
            .to(card, { scale: 1.02, duration: 0.4, ease: "none" }, t + 0.7);

          t += 1.05;
        });

        cards.forEach((card, i) => {
          const p = parks[i] ?? parks[1];
          tl.to(
            card,
            {
              autoAlpha: 1,
              xPercent: p.xPercent,
              yPercent: p.yPercent,
              rotateY: p.rotateY,
              scale: p.scale,
              z: p.z,
              duration: 0.7,
              ease: "none",
            },
            t,
          );
        });

        tl.to(".tm-outro", { autoAlpha: 1, duration: 0.4, ease: "none" }, t + 0.5);
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative min-h-[100svh] overflow-hidden bg-[#0a0908]"
      aria-label="Testimonials"
    >
      <div className="relative flex h-[100svh] flex-col px-5 py-20 md:px-8 md:py-24">
        <div
          className="pointer-events-none absolute left-1/2 top-[55%] h-[45vmin] w-[55vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(202,138,4,0.16) 0%, transparent 70%)",
          }}
        />

        <div className="tm-intro relative z-20 mx-auto w-full max-w-3xl text-center">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.4em] text-[#ca8a04]">
            Testimonials
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-extrabold text-[#faf8f0] md:text-5xl">
            Floating proof from partners who stayed.
          </h2>
          <p className="mt-3 text-sm text-[#faf8f0]/50 md:text-base">
            Scroll — each quote floats into focus, then parks in the frame.
          </p>
        </div>

        <div
          className="relative z-10 mx-auto mt-4 flex w-full max-w-5xl flex-1 flex-col items-center gap-3 md:block"
          style={{ perspective: "1400px" }}
        >
          {testimonials.map((tm, i) => (
            <article
              key={tm.name}
              className={`tm-card tm-card-${i} relative w-full max-w-[380px] rounded-3xl border border-[#ca8a04]/35 bg-[#141210]/92 p-6 backdrop-blur-xl md:absolute md:w-[400px] md:p-8`}
              style={{
                boxShadow: "0 24px 60px rgba(0,0,0,0.45), 0 0 40px rgba(202,138,4,0.12)",
                transformStyle: "preserve-3d",
              }}
            >
              <Quote className="mb-4 h-7 w-7 text-[#ca8a04]" />
              <p className="text-base leading-relaxed text-[#faf8f0]/80 md:text-lg">
                &ldquo;{tm.quote}&rdquo;
              </p>
              <div className="mt-7 border-t border-[#faf8f0]/10 pt-5">
                <p className="font-bold text-[#faf8f0]">{tm.name}</p>
                <p className="text-sm text-[#faf8f0]/45">{tm.role}</p>
              </div>
            </article>
          ))}
        </div>

        <p className="tm-hint relative z-20 hidden text-center text-[10px] font-bold uppercase tracking-[0.35em] text-[#ca8a04]/65 md:block">
          Scroll · next voice
        </p>
        <p className="tm-outro relative z-20 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-[#ca8a04]/50">
          Proof parked · estimate next
        </p>
      </div>
    </section>
  );
}
