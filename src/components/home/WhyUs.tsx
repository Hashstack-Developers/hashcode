"use client";

import { useRef } from "react";
import { gsap, useGSAP, registerGsap } from "@/lib/gsap";
import { whyUs } from "@/data/content";
import { pinExtras } from "@/lib/mobile";

/**
 * Why us — pinned cascade with depth wipe + progress rail.
 */
export function WhyUs() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".why-card");
        if (!cards.length) return;

        gsap.set(".why-intro", { y: 20, autoAlpha: 0 });
        gsap.set(".why-rail-fill", { scaleY: 0, transformOrigin: "top center" });
        gsap.set(cards[0], { autoAlpha: 1, yPercent: 0, scale: 1, rotateX: 0 });
        cards.slice(1).forEach((card) => {
          gsap.set(card, { yPercent: 120, autoAlpha: 0, scale: 0.94, rotateX: 8 });
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".why-pin",
            start: "top top",
            // Extra scroll room so each card can be read before the next
            end: () => `+=${cards.length * 160}%`,
            scrub: 1.05,
            pin: true,
            ...pinExtras(),
          },
        });

        tl.to(".why-intro", { y: 0, autoAlpha: 1, duration: 0.45, ease: "none" }, 0)
          .to(".why-rail-fill", { scaleY: 1 / cards.length, duration: 0.35, ease: "none" }, 0.25);

        // Hold card 0 alone long enough to read
        let t = 1.15;

        cards.forEach((card, i) => {
          if (i === 0) return;

          // 1) Previous fully clears (no text bleed)
          tl.to(
            cards[i - 1],
            {
              autoAlpha: 0,
              yPercent: -18,
              scale: 0.92,
              duration: 0.4,
              ease: "none",
            },
            t,
          );

          // 2) Gap beat — empty frame before next card
          // 3) New card enters alone
          tl.fromTo(
            card,
            { yPercent: 120, autoAlpha: 0, scale: 0.94, rotateX: 8 },
            {
              yPercent: 0,
              autoAlpha: 1,
              scale: 1,
              rotateX: 0,
              duration: 0.55,
              ease: "none",
            },
            t + 0.45,
          ).to(
            ".why-rail-fill",
            { scaleY: (i + 1) / cards.length, duration: 0.55, ease: "none" },
            t + 0.45,
          );

          // 4) Hold this card readable before next transition
          t += 1.55;
        });

        // Final hold on last card
        tl.to(cards[cards.length - 1], { scale: 1.01, duration: 0.7, ease: "none" }, t);
      });

      mm.add("(max-width: 767px)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".why-card");
        const stack = root.current?.querySelector(".why-stack");
        if (!stack || !cards.length) return;

        gsap.set(cards, { y: 28, autoAlpha: 0 });
        gsap.set(".why-intro", { autoAlpha: 1, y: 0 });

        gsap.to(cards, {
          y: 0,
          autoAlpha: 1,
          stagger: 0.12,
          duration: 0.65,
          ease: "power2.out",
          overwrite: "auto",
          scrollTrigger: {
            trigger: stack,
            start: "top 82%",
            once: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [] },
  );

  return (
    <section ref={root} className="relative bg-[#0a0908]">
      <div className="why-pin mx-auto w-full max-w-7xl px-5 py-24 md:min-h-screen md:px-8 md:py-28">
        <div className="why-intro mb-12 w-full max-w-3xl">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.4em] text-[#ca8a04]">
            Why Hashstack
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-extrabold text-[#faf8f0] md:text-5xl">
            Full-service. Modern stack. Built to move fast.
          </h2>
          <p className="mt-3 text-sm text-[#faf8f0]/50 md:text-base">
            Scroll the cascade — each card is a reason clients stop juggling five vendors.
          </p>
        </div>

        {/* Explicit width — avoid grid collapse with absolute cards */}
        <div className="relative w-full max-w-3xl md:pl-12">
          <div className="why-rail absolute left-0 top-0 hidden h-[340px] w-1.5 overflow-hidden rounded-full bg-[#faf8f0]/10 md:block">
            <div className="why-rail-fill absolute inset-x-0 top-0 h-full origin-top rounded-full bg-[#ca8a04]" />
          </div>

          <div
            className="why-stack relative w-full"
            style={{ perspective: "1400px", minHeight: 340 }}
          >
            {whyUs.map((item, i) => (
              <article
                key={item.title}
                className="why-card relative mb-4 w-full overflow-hidden rounded-3xl border border-[#ca8a04]/25 bg-[#141210]/92 p-7 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl md:absolute md:left-0 md:right-0 md:top-0 md:mb-0 md:w-full md:p-10"
                style={{ zIndex: i + 1, transformStyle: "preserve-3d" }}
              >
                <div className="mb-6 flex items-center justify-between">
                  <span className="font-mono text-sm text-[#ca8a04]">0{i + 1}</span>
                  <span className="h-2 w-2 rounded-full bg-[#ca8a04] shadow-[0_0_12px_#ca8a04]" />
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[#faf8f0] md:text-4xl">
                  {item.title}
                </h3>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-[#faf8f0]/55 md:text-lg">
                  {item.body}
                </p>
                <div className="mt-8 h-1.5 w-full overflow-hidden rounded-full bg-[#faf8f0]/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#ca8a04] to-[#f5d76e]"
                    style={{ width: `${((i + 1) / whyUs.length) * 100}%` }}
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
